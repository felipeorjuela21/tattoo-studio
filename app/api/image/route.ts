import { NextRequest, NextResponse } from 'next/server'
import {
  hfImageErrorIsAuthFailure,
  hfImageErrorShouldFallbackToPollinations,
  stableDiffusion2DataUrl,
} from '@/lib/huggingface-sd'
import { freeImageDataUrl } from '@/lib/images'

/** Generar en Pollinations puede tardar >10s; en Vercel ajusta el límite del plan si hace falta. */
export const maxDuration = 120

export async function POST(req: NextRequest) {
  const { prompt } = await req.json()
  const p = String(prompt || 'tatuaje estilo blackwork minimalista')

  try {
    if (
      process.env.HUGGINGFACE_API_KEY?.trim() &&
      process.env.HUGGINGFACE_IMAGE_ONLY_POLLINATIONS === '1'
    ) {
      const url = await freeImageDataUrl(p)
      return NextResponse.json({ url })
    }

    if (process.env.HUGGINGFACE_API_KEY?.trim()) {
      try {
        const url = await stableDiffusion2DataUrl(p)
        return NextResponse.json({ url })
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : 'No se pudo generar la imagen'
        if (hfImageErrorIsAuthFailure(message)) {
          return NextResponse.json({ error: message }, { status: 502 })
        }
        if (hfImageErrorShouldFallbackToPollinations(message)) {
          const url = await freeImageDataUrl(p)
          return NextResponse.json({ url })
        }
        return NextResponse.json({ error: message }, { status: 502 })
      }
    }

    const url = await freeImageDataUrl(p)
    return NextResponse.json({ url })
  } catch (e: unknown) {
    const message =
      e instanceof Error ? e.message : 'No se pudo obtener la imagen desde Pollinations'
    return NextResponse.json({ error: message }, { status: 502 })
  }
}
