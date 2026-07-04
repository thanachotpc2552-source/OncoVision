import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from 'firebase/firestore';

export async function GET() {
  try {
    const q = query(collection(db, 'ehr_records'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const records = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      // Convert Firestore Timestamp to ISO string
      timestamp: doc.data().timestamp?.toDate().toISOString() || new Date().toISOString()
    }));
    
    return NextResponse.json({ success: true, records });
  } catch (error: any) {
    console.error('[EHR GET Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to read records from Firebase' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Create new record in Firestore
    const docRef = await addDoc(collection(db, 'ehr_records'), {
      ...body,
      timestamp: serverTimestamp() // Use server time
    });
    
    return NextResponse.json({ success: true, record: { id: docRef.id, ...body } });
  } catch (error: any) {
    console.error('[EHR POST Error]', error);
    return NextResponse.json({ success: false, error: 'Failed to save record to Firebase' }, { status: 500 });
  }
}
