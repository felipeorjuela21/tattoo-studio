import './globals.css'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tattoo Studio',
  description: 'Galería, agenda y asistente IA para estudio de tatuajes',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-neutral-800 sticky top-0 z-50 backdrop-blur bg-neutral-950/70">
          <nav className="container flex items-center gap-6 py-3">
            <Link href="/" className="text-xl font-bold">🖤 Tattoo Studio</Link>
            <div className="ml-auto flex gap-3 text-sm">
              <Link href="/galeria" className="hover:underline">Galería</Link>
              <Link href="/agenda" className="hover:underline">Agendar</Link>
              <Link href="/asistente" className="hover:underline">Asistente IA</Link>
            </div>
          </nav>
        </header>
        <main className="container py-8">{children}</main>
        <footer className="container py-10 text-center text-sm text-neutral-400">
          © {new Date().getFullYear()} Tattoo Studio — hecho con Next.js + Tailwind
        </footer>
      </body>
    </html>
  )
}
