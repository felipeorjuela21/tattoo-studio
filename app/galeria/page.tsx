'use client'
import { useMemo, useState } from 'react'
import Image from 'next/image'

const ITEMS = [
  { id: 1, src: 'https://images.unsplash.com/photo-1541014741259-de529411b96a', title: 'Rosa Neo Trad', tags: ['floral','neotrad'] },
  { id: 2, src: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2', title: 'Cráneo Blackwork', tags: ['blackwork'] },
  { id: 3, src: 'https://images.unsplash.com/photo-1556229174-5a6a3ca94dc9', title: 'Dragón Oriental', tags: ['oriental'] },
  { id: 4, src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', title: 'Geometría Lineal', tags: ['geometrico','linework'] },
  { id: 5, src: 'https://images.unsplash.com/photo-1541491003219-236fabd4e250', title: 'Ave Realista', tags: ['realismo'] },
  { id: 6, src: 'https://images.unsplash.com/photo-1580136608054-8d2edd88ec1b', title: 'Minimal Moon', tags: ['minimal'] }
]

const TAGS = ['todo','blackwork','realismo','geometrico','linework','floral','neotrad','oriental','minimal']

export default function Galeria() {
  const [tag, setTag] = useState('todo')
  const [active, setActive] = useState<number|null>(null)

  const filtered = useMemo(() => tag==='todo' ? ITEMS : ITEMS.filter(i=>i.tags.includes(tag)), [tag])

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-bold">Galería</h1>

      <div className="flex flex-wrap gap-2">
        {TAGS.map(t => (
          <button key={t} onClick={()=>setTag(t)}
            className={`px-3 py-1 rounded-full border ${tag===t? 'bg-brand-500 text-white border-brand-500':'border-neutral-700 hover:border-brand-500'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(item => (
          <button key={item.id} onClick={()=>setActive(item.id)} className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-800">
            <Image src={item.src} alt={item.title} fill className="object-cover group-hover:scale-105 transition" />
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent text-sm">{item.title}</div>
          </button>
        ))}
      </div>

      {active && (
        <div className="fixed inset-0 bg-black/80 z-50 grid place-items-center p-4" onClick={()=>setActive(null)}>
          <div className="relative w-full max-w-3xl aspect-[4/3]">
            <Image src={ITEMS.find(i=>i.id===active)!.src} alt="preview" fill className="object-cover rounded-2xl" />
          </div>
        </div>
      )}
    </section>
  )
}
