import OpenAI from 'openai'

export async function chatReply(message: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return 'Modo demo: agrega OPENAI_API_KEY en .env.local para habilitar el chat de texto.'
  }

  const client = new OpenAI({ apiKey })

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
  } catch (error: unknown) {
    console.error('Error al llamar a OpenAI:', error)
    throw new Error('No pude generar una respuesta en este momento.')
  }
}
