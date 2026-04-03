// Generador GRATUITO usando el endpoint público de Pollinations.
// Construimos una URL de imagen basada en el prompt.
export function freeImageUrl(prompt: string, width = 1024, height = 1024) {
  const q = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${q}?width=${width}&height=${height}`
}

const POLLINATIONS_FETCH_MS = Math.min(
  Math.max(Number.parseInt(process.env.POLLINATIONS_FETCH_TIMEOUT_MS ?? '120000', 10) || 120_000, 15_000),
  180_000,
)

/**
 * Descarga la imagen en el servidor y devuelve data URL.
 * Así el cliente no depende de cargar image.pollinations.ai (adblock, red, referrer).
 */
export async function freeImageDataUrl(prompt: string, width = 1024, height = 1024): Promise<string> {
  const url = freeImageUrl(prompt, width, height)
  const res = await fetch(url, {
    signal: AbortSignal.timeout(POLLINATIONS_FETCH_MS),
    headers: {
      Accept: 'image/avif,image/webp,image/apng,image/png,image/*,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    },
  })

  if (!res.ok) {
    throw new Error(`Pollinations respondió HTTP ${res.status}`)
  }

  const buf = await res.arrayBuffer()
  if (buf.byteLength < 100) {
    const preview = new TextDecoder().decode(buf.slice(0, 300))
    throw new Error(`Pollinations no devolvió una imagen válida: ${preview || '(vacío)'}`)
  }

  const ct = res.headers.get('content-type') || ''
  const mime = ct.startsWith('image/') ? ct.split(';')[0].trim() : 'image/png'
  const b64 = Buffer.from(buf).toString('base64')
  return `data:${mime};base64,${b64}`
}
