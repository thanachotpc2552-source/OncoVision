/**
 * POST /api/analyze
 *
 * Accepts a base64-encoded histopathological image and runs it through
 * the Gemini Vision model for breast-cancer cell analysis.
 *
 * Implements automatic model fallback:
 *   Primary   → gemini-2.5-flash
 *   Fallback  → gemini-1.5-flash  (used on rate-limit / unavailability)
 */

import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// ── Constants ─────────────────────────────────────────────────────────────────
const PRIMARY_MODEL  = 'gemini-2.5-flash';
const FALLBACK_MODEL = 'gemini-1.5-flash';

/**
 * Expert pathologist system prompt.
 * Instructs the model to produce a structured, clinical-tone response
 * without markdown headers so it's easy to parse on the frontend.
 */
const SYSTEM_PROMPT = `You are an expert Pathologist and Medical AI Assistant specializing in breast cancer histopathology.
Analyze the provided histopathological image for breast cancer cells.

Provide a structured response using EXACTLY this JSON format and nothing else. Do not wrap it in markdown code blocks.
{
  "diagnosis_status": "Normal / Suspicious / Malignant Indicators Present",
  "confidence_score": <number between 0 and 100>,
  "visual_findings": "<Explain specific cellular patterns, nuclear morphology, cell density, architectural arrangement, mitotic figures. Be specific and clinically precise.>",
  "feature_attributions": [
    {"feature": "<Feature Name, e.g., Nuclear Pleomorphism>", "percentage": <number>},
    {"feature": "<Feature Name>", "percentage": <number>},
    {"feature": "<Feature Name>", "percentage": <number>}
  ],
  "clinical_recommendation": "<Concise, professional recommendation for the clinical team.>"
}`;

// ── Helper: detect rate-limit errors ─────────────────────────────────────────
function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('429') ||
      msg.includes('rate limit') ||
      msg.includes('quota') ||
      msg.includes('resource_exhausted') ||
      msg.includes('too many requests')
    );
  }
  return false;
}

// ── Helper: detect service-unavailability errors ──────────────────────────────
function isServiceUnavailableError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();
    return (
      msg.includes('503') ||
      msg.includes('service unavailable') ||
      msg.includes('overloaded') ||
      msg.includes('unavailable')
    );
  }
  return false;
}

// ── Core analysis function ────────────────────────────────────────────────────
async function runAnalysis(
  ai: GoogleGenAI,
  modelName: string,
  imageBase64: string,
  mimeType: string,
): Promise<string> {
  const response = await ai.models.generateContent({
    model: modelName,
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: mimeType as 'image/jpeg' | 'image/png' | 'image/webp',
              data: imageBase64,
            },
          },
          {
            text: SYSTEM_PROMPT,
          },
        ],
      },
    ],
    config: {
      temperature: 0.2,    // Low temperature for deterministic clinical output
      maxOutputTokens: 2048,
      responseMimeType: "application/json",
      safetySettings: [
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
      ],
    },
  });

  const text = response.text ?? '';
  if (!text) throw new Error('Empty response from Gemini API');
  
  // Validate that it is actually valid JSON
  try {
    JSON.parse(text);
  } catch (e) {
    console.error('[OncoVision] Gemini returned invalid/truncated JSON:', text);
    // If it's truncated, try to rescue whatever fields we can using regex
    const diagMatch = text.match(/"diagnosis_status"\s*:\s*"([^"]+)"/);
    const confMatch = text.match(/"confidence_score"\s*:\s*(\d+)/);
    
    const rescuedStatus = diagMatch ? diagMatch[1] : "Analysis Truncated (Safety Filter)";
    const rescuedConf   = confMatch ? parseInt(confMatch[1], 10) : 0;

    text = JSON.stringify({
      diagnosis_status: rescuedStatus,
      confidence_score: rescuedConf,
      visual_findings: "The AI model truncated the response during generation, likely due to safety filters triggering on medical images. Only partial data could be recovered.",
      feature_attributions: [],
      clinical_recommendation: "Please review the image manually."
    });
  }
  
  return text.trim();
}

// ── Route Handler ─────────────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    // ── 1. Validate API key ──────────────────────────────────────────────────
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'Server configuration error: GEMINI_API_KEY is not set.',
          detail: 'Please add GEMINI_API_KEY to your .env.local file or Vercel environment variables.',
        },
        { status: 500 },
      );
    }

    // ── 2. Parse request body ────────────────────────────────────────────────
    let body: { imageBase64?: string; mimeType?: string };
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid request body. Expected JSON with imageBase64 and mimeType fields.' },
        { status: 400 },
      );
    }

    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json({ error: 'Missing required field: imageBase64' }, { status: 400 });
    }
    if (!mimeType || !['image/jpeg', 'image/png', 'image/webp'].includes(mimeType)) {
      return NextResponse.json(
        { error: 'Invalid or missing mimeType. Allowed: image/jpeg, image/png, image/webp' },
        { status: 400 },
      );
    }

    // ── 3. Initialize Gemini client ──────────────────────────────────────────
    const ai = new GoogleGenAI({ apiKey });

    // ── 4. Primary model attempt ─────────────────────────────────────────────
    let analysisText: string;
    let usedModel = PRIMARY_MODEL;

    try {
      console.log(`[OncoVision] Attempting analysis with primary model: ${PRIMARY_MODEL}`);
      analysisText = await runAnalysis(ai, PRIMARY_MODEL, imageBase64, mimeType);
      console.log(`[OncoVision] Primary model succeeded.`);
    } catch (primaryError) {
      // ── 5. Fallback on rate-limit or service unavailability ────────────────
      const shouldFallback =
        isRateLimitError(primaryError) || isServiceUnavailableError(primaryError);

      if (shouldFallback) {
        console.warn(
          `[OncoVision] Primary model failed (${primaryError instanceof Error ? primaryError.message : 'unknown'}). ` +
          `Retrying with fallback model: ${FALLBACK_MODEL}`,
        );
        try {
          usedModel = FALLBACK_MODEL;
          analysisText = await runAnalysis(ai, FALLBACK_MODEL, imageBase64, mimeType);
          console.log(`[OncoVision] Fallback model succeeded.`);
        } catch (fallbackError) {
          console.error('[OncoVision] Fallback model also failed:', fallbackError);
          return NextResponse.json(
            {
              error: 'Both AI models are currently unavailable. Please try again in a few moments.',
              detail:
                fallbackError instanceof Error ? fallbackError.message : 'Unknown fallback error',
            },
            { status: 503 },
          );
        }
      } else {
        // Non-recoverable primary error (auth, bad request, etc.)
        console.error('[OncoVision] Primary model non-recoverable error:', primaryError);
        return NextResponse.json(
          {
            error: 'AI analysis failed. Please check your API key and try again.',
            detail:
              primaryError instanceof Error ? primaryError.message : 'Unknown primary error',
          },
          { status: 500 },
        );
      }
    }

    // ── 6. Return successful result ──────────────────────────────────────────
    return NextResponse.json({
      success: true,
      analysis: analysisText,
      modelUsed: usedModel,
      timestamp: new Date().toISOString(),
    });

  } catch (unexpectedError) {
    // ── Global catch-all ────────────────────────────────────────────────────
    console.error('[OncoVision] Unexpected server error:', unexpectedError);
    return NextResponse.json(
      {
        error: 'An unexpected server error occurred. Please try again.',
        detail:
          unexpectedError instanceof Error ? unexpectedError.message : 'Unknown server error',
      },
      { status: 500 },
    );
  }
}
