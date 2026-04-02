import OpenAI from 'openai'

const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  throw new Error('OPENAI_API_KEY no está configurada en el entorno')
}

const client = new OpenAI({ apiKey })

export async function chatReply(message: string): Promise<string> {
  try {
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'Eres un asistente para un estudio de tatuajes. Responde de forma breve, clara y en español.',
        },
        { role: 'user', content: message },
      ],
      max_tokens: 256,
      temperature: 0.7,
    })

    const content = response.choices[0]?.message?.content

    if (!content) {
      throw new Error('La respuesta de OpenAI no contiene contenido')
    }

    return content
  } catch (error: any) {
    console.error('Error al llamar a OpenAI:', error)
    throw new Error('No pude generar una respuesta en este momento.')
  }
}

export async function chatReply(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return 'Modo demo: agrega OPENAI_API_KEY en .env.local para habilitar el chat de texto.'
  }

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Eres un asistente de un estudio de tatuajes. Responde con consejos de estilo y cuidados.' },
        { role: 'user', content: message }
      ],
      temperature: 0.6
    })
  })

  if (!res.ok) throw new Error('Error en OpenAI Chat')
  const json = await res.json()
  return json.choices?.[0]?.message?.content || 'Sin respuesta'
}
