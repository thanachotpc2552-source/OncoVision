import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the path to the local JSON database
const DB_PATH = path.join(process.cwd(), 'data', 'ehr_records.json');

// Helper to ensure database file exists
const initDB = () => {
  if (!fs.existsSync(DB_PATH)) {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
};

export async function GET() {
  try {
    initDB();
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return NextResponse.json({ success: true, records: JSON.parse(data) });
  } catch (error: any) {
    console.error('[EHR GET Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to read records' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    initDB();
    
    // Read existing
    const rawData = fs.readFileSync(DB_PATH, 'utf8');
    const records = JSON.parse(rawData);
    
    // Create new record
    const newRecord = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...body
    };
    
    // Add to beginning of array so newest is first
    records.unshift(newRecord);
    
    // Save back to file
    fs.writeFileSync(DB_PATH, JSON.stringify(records, null, 2));
    
    return NextResponse.json({ success: true, record: newRecord });
  } catch (error: any) {
    console.error('[EHR POST Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to save record' }, { status: 500 });
  }
}
