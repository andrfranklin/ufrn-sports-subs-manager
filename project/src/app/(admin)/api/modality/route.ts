import { listAllModalities } from '@/actions/modality/listAll'
import { NextResponse } from 'next/server'

export async function GET() {
  const modalities = await listAllModalities()
  return NextResponse.json(modalities)
}
