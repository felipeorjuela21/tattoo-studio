// Generador GRATUITO usando el endpoint público de Pollinations.
// Construimos una URL de imagen basada en el prompt.
export function freeImageUrl(prompt: string, width=1024, height=1024) {
  const q = encodeURIComponent(prompt)
  return `https://image.pollinations.ai/prompt/${q}?width=${width}&height=${height}`
}
