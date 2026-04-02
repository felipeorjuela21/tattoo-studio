import { NextRequest, NextResponse } from 'next/server'
import { chatReply } from '@/lib/openai'

export async function POST(req: NextRequest) {
  const { message } = await req.json()
  try {
    const reply = await chatReply(message)
    return NextResponse.json({ reply })
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
