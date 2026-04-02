import { NextRequest, NextResponse } from 'next/server'
import { freeImageUrl } from '@/lib/images'

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  // No llamamos a servicios de pago. Devolvemos una URL directa gratuita.
  const url = freeImageUrl(String(prompt || 'tatuaje estilo blackwork minimalista'))
  return NextResponse.json({ url })
}
