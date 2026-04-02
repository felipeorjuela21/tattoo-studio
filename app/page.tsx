import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <section className="grid gap-8">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Tatuajes con estilo, diseñados a tu medida
          </h1>
          <p className="text-neutral-300">
            Explora nuestra <strong>galería</strong>, agenda tu cita en minutos y conversa con
            nuestro <strong>asistente IA</strong> para crear ideas únicas.
          </p>
          <div className="flex gap-3">
            <Link href="/galeria" className="btn">Ver Galería</Link>
            <Link href="/agenda" className="btn bg-neutral-800 hover:bg-neutral-700">Agendar</Link>
          </div>
        </div>
        <div className="relative aspect-video">
          <Image src="https://images.unsplash.com/photo-1518635017498-87f514b7519c" alt="Tattoo"
                 fill className="object-cover rounded-2xl border border-neutral-800" />
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-2xl font-bold mb-3">¿Buscas una idea?</h2>
        <p className="mb-4">Pásate por el <strong>Asistente IA</strong> y descríbenos tu concepto.
          Podemos generar una imagen de referencia (modo gratuito) y recomendaciones de estilo.</p>
        <Link href="/asistente" className="btn">Probar Asistente</Link>
      </div>
    </section>
  )
}
