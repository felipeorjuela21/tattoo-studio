'use client'
import { useEffect, useRef, useState } from 'react'

interface Msg { id: string; role: 'user'|'assistant'|'image'; content: string }

export default function Asistente() {
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [mode, setMode] = useState<'chat'|'image'>('chat')
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(()=>{ listRef.current?.scrollTo({top: 999999, behavior:'smooth'}) }, [messages])

  async function send() {
    if (!input.trim()) return
    setIsSending(true)

    const userMsg: Msg = { id: crypto.randomUUID(), role: 'user', content: input }
    setMessages(m => [...m, userMsg])

    try {
      if (mode === 'chat') {
        const res = await fetch('/api/chat', { method: 'POST', body: JSON.stringify({ message: input }) })
        const data = await res.json()
        const assistantMsg: Msg = { id: crypto.randomUUID(), role: 'assistant', content: data.reply ?? 'Configura OPENAI_API_KEY para habilitar el chat.' }
        setMessages(m => [...m, assistantMsg])
      } else {
        const res = await fetch('/api/image', { method: 'POST', body: JSON.stringify({ prompt: input }) })
        const data = await res.json()
        const img: Msg = { id: crypto.randomUUID(), role: 'image', content: data.url }
        setMessages(m => [...m, img])
      }
    } catch (e:any) {
      setMessages(m => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'Hubo un error. Si estás en demo, la imagen gratuita puede tardar o fallar.' }])
    } finally { setIsSending(false); setInput('') }
  }

  return (
    <section className="grid grid-rows-[auto,1fr,auto] h-[70vh] gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Asistente IA</h1>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-neutral-400">Modo:</span>
          <select className="input w-40" value={mode} onChange={e=>setMode(e.target.value as any)}>
            <option value="chat">Chat (texto)</option>
            <option value="image">Generar imagen (gratis)</option>
          </select>
        </div>
      </div>

      <div ref={listRef} className="card p-4 overflow-y-auto space-y-3">
        {messages.length===0 && (
          <div className="text-neutral-400 text-sm">
            Pregúntame por ideas de tatuajes, cuidados, tamaños, estilos… o cambia a "Generar imagen (gratis)" para un boceto de referencia.
          </div>
        )}
        {messages.map(m => (
          <div key={m.id} className={m.role==='user' ? 'text-right' : ''}>
            {m.role==='image' ? (
              <img src={m.content} alt="Generado" className="inline-block max-w-full rounded-xl border border-neutral-800" />
            ) : (
              <div className={`inline-block max-w-[80%] px-3 py-2 rounded-2xl ${m.role==='user' ? 'bg-brand-600' : 'bg-neutral-800'}`}>{m.content}</div>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input className="input" placeholder={mode==='chat' ? 'Escribe tu mensaje…' : 'Describe la imagen (estilo, elementos, tonos)…'} value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter') send() }} />
        <button className="btn" onClick={send} disabled={isSending}>{isSending? 'Enviando…':'Enviar'}</button>
      </div>
    </section>
  )
}
