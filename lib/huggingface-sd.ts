import { InferenceClient } from '@huggingface/inference'
import type { InferenceProvider } from '@huggingface/inference'

/** Sin créditos prepago: usar proveedor HF propio (puede fallar en modelos muy pesados → ver fallback en /api/image). */
const DEFAULT_MODEL = 'stabilityai/stable-diffusion-2'
const DEFAULT_PROVIDER: InferenceProvider = 'hf-inference'

function hubModelId(raw: string): string {
  const m = raw.trim()
  if (!/^[\w.-]+\/[\w.-]+$/.test(m)) {
    throw new Error(
      'HUGGINGFACE_IMAGE_MODEL debe ser un id del Hub (ej. stabilityai/stable-diffusion-2).',
    )
  }
  return m
}

function imageProvider(raw: string | undefined): InferenceProvider {
  const p = (raw?.trim() || DEFAULT_PROVIDER) as InferenceProvider
  if (!/^[\w-]+$/.test(p)) {
    throw new Error('HUGGINGFACE_IMAGE_PROVIDER no tiene un formato válido (solo letras, números, guiones).')
  }
  return p
}

/** Errores de token: no enmascarar con Pollinations. */
export function hfImageErrorIsAuthFailure(message: string): boolean {
  return /invalid username or password|token.*rechazad|401|unauthorized|not authenticated/i.test(message)
}

/**
 * Hugging Face gratis no incluye fal-ai prepago ni algunos modelos; devolvemos imagen vía Pollinations.
 */
export function hfImageErrorShouldFallbackToPollinations(message: string): boolean {
  if (hfImageErrorIsAuthFailure(message)) return false
  return (
    /pre-paid|prepaid|credits are required|Add pre-paid|payment required|\b402\b|insufficient.*credit|billing required/i.test(
      message,
    ) ||
    /fal-ai|replicate.*(credit|billing|payment)/i.test(message) ||
    /404|not found|no route|not available.*provider|Unable to find inference provider/i.test(message) ||
    /HUGGINGFACE_IMAGE_TIMEOUT|AbortError|aborted a request|The operation was aborted|signal has been aborted|TimeoutError/i.test(
      message,
    )
  )
}

function imageRequestTimeoutMs(): number {
  const n = Number.parseInt(process.env.HUGGINGFACE_IMAGE_TIMEOUT_MS ?? '35000', 10)
  return Number.isFinite(n) && n >= 5000 ? n : 35000
}

/**
 * Intenta generar data URL con Inference Providers (por defecto hf-inference, sin fal-ai de pago).
 */
export async function stableDiffusion2DataUrl(prompt: string): Promise<string> {
  const token = process.env.HUGGINGFACE_API_KEY?.trim()
  if (!token) {
    throw new Error('HUGGINGFACE_API_KEY no está configurada')
  }
  if (!token.startsWith('hf_')) {
    throw new Error(
      'HUGGINGFACE_API_KEY debe ser un token válido de Hugging Face (empieza por hf_). Cópialo desde huggingface.co/settings/tokens.',
    )
  }

  const model = hubModelId(process.env.HUGGINGFACE_IMAGE_MODEL?.trim() || DEFAULT_MODEL)
  const provider = imageProvider(process.env.HUGGINGFACE_IMAGE_PROVIDER)

  const client = new InferenceClient(token)

  const parameters: Record<string, number> = {}
  if (model.includes('FLUX.1-schnell')) {
    parameters.num_inference_steps = 4
  }

  const timeoutMs = imageRequestTimeoutMs()
  const signal = AbortSignal.timeout(timeoutMs)
  /** El SDK hace fetch al Hub para el mapping sin señal; sin esto la petición puede colgarse antes de inferir. */
  const fetchWithDeadline: typeof fetch = (input, init) =>
    fetch(input, { ...init, signal })

  try {
    const dataUrl = await client.textToImage(
      {
        model,
        inputs: prompt,
        provider,
        ...(Object.keys(parameters).length > 0 ? { parameters } : {}),
      },
      {
        outputType: 'dataUrl',
        signal,
        retry_on_error: false,
        fetch: fetchWithDeadline,
      },
    )
    if (typeof dataUrl !== 'string' || !dataUrl.startsWith('data:')) {
      throw new Error('Respuesta de imagen inesperada del proveedor')
    }
    return dataUrl
  } catch (e: unknown) {
    const err = e instanceof Error ? e : null
    const msg = err?.message ?? String(e)
    const aborted =
      err?.name === 'AbortError' ||
      err?.name === 'TimeoutError' ||
      /aborted|timeout/i.test(msg)
    if (aborted) {
      throw new Error('HUGGINGFACE_IMAGE_TIMEOUT')
    }
    if (/invalid username or password/i.test(msg)) {
      throw new Error(
        'Token de Hugging Face rechazado. Genera un token nuevo con permisos de Inference Providers y lectura del Hub.',
      )
    }
    throw new Error(msg || 'No se pudo generar la imagen')
  }
}
