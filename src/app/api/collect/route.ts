import { NextResponse } from 'next/server';
import { runCollection } from '@/services/collector';

export async function GET() {
  try {
    const result = await runCollection();
    return NextResponse.json({ message: "Collecte réussie", result });
  } catch (error) {
    return NextResponse.json({ error: "Erreur de collecte" }, { status: 500 });
  }
}