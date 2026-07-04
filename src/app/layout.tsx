import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OncoVision – AI-Assisted Breast Cancer Histopathology Analysis',
  description:
    'An Explainable AI platform for early breast cancer cell detection in histopathological images. Upload slides and receive structured, transparent diagnostic insights powered by Gemini Vision AI.',
  keywords: [
    'breast cancer detection', 'histopathology AI', 'explainable AI', 'XAI',
    'cancer screening', 'pathology', 'medical AI', 'deep learning',
  ],
  authors: [{ name: 'OncoVision' }],
  openGraph: {
    title: 'OncoVision – AI Histopathology Analysis',
    description: 'Explainable AI for early breast cancer detection',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#14b8a6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-white text-gray-800 antialiased overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
