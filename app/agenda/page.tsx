'use client'
import { useMemo, useState } from 'react'

export default function Agenda() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState('')
  const [zona, setZona] = useState<'brazo'|'pierna'|'espalda'|'pecho'|'otra'|''>('')
  const [descripcion, setDescripcion] = useState('')
  const [tamano, setTamano] = useState<'pequeño'|'mediano'|'grande'|''>('')

  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '573000000000'

  const url = useMemo(()=>{
    const text = `Hola! Me gustaría agendar una cita:%0A%0A`+
      `• Nombre: ${nombre}%0A`+
      `• Teléfono: ${telefono}%0A`+
      `• Fecha deseada: ${fecha}%0A`+
      `• Zona: ${zona}%0A`+
      `• Tamaño aprox: ${tamano}%0A`+
      `• Descripción/Referencia: ${descripcion}`
    return `https://wa.me/${whatsapp}?text=${text}`
  }, [nombre, telefono, fecha, zona, tamano, descripcion, whatsapp])

  return (
    <section className="grid gap-6 max-w-2xl">
      <h1 className="text-3xl font-bold">Agendar cita</h1>
      <p className="text-neutral-300">Completa el formulario y te llevamos a WhatsApp con el mensaje listo para enviar.</p>

      <div className="card p-5 grid gap-4">
        <div>
          <label className="label">Nombre</label>
          <input className="input" value={nombre} onChange={e=>setNombre(e.target.value)} placeholder="Tu nombre" />
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Teléfono</label>
            <input className="input" value={telefono} onChange={e=>setTelefono(e.target.value)} placeholder="3001234567" />
          </div>
          <div>
            <label className="label">Fecha deseada</label>
            <input type="date" className="input" value={fecha} onChange={e=>setFecha(e.target.value)} />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Zona del cuerpo</label>
            <select className="input" value={zona} onChange={e=>setZona(e.target.value as any)}>
              <option value="">Selecciona…</option>
              <option value="brazo">Brazo</option>
              <option value="pierna">Pierna</option>
              <option value="espalda">Espalda</option>
              <option value="pecho">Pecho</option>
              <option value="otra">Otra</option>
            </select>
          </div>
          <div>
            <label className="label">Tamaño</label>
            <select className="input" value={tamano} onChange={e=>setTamano(e.target.value as any)}>
              <option value="">Selecciona…</option>
              <option value="pequeño">Pequeño</option>
              <option value="mediano">Mediano</option>
              <option value="grande">Grande</option>
            </select>
          </div>
        </div>
        <div>
          <label className="label">Descripción / Enlaces de referencia</label>
          <textarea className="input h-28" value={descripcion} onChange={e=>setDescripcion(e.target.value)} placeholder="Estilo, referencias, color/blackwork, alergias, etc." />
        </div>
        <a className="btn" href={url} target="_blank" rel="noreferrer">Enviar por WhatsApp</a>
      </div>
    </section>
  )
}
