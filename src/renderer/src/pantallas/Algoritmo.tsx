import { useState } from 'react'
import type { Algoritmo } from '../algoritmos'
import Ficha from './Ficha'
import Reproductor from './Reproductor'

export default function PantallaAlgoritmo({ alg }: { alg: Algoritmo<unknown> }) {
  const [vista, setVista] = useState<'animacion' | 'ficha'>('animacion')
  return (
    <>
      <header className="cabecera">
        <div>
          <h1>{alg.nombre}</h1>
        </div>
        <div className="pestanas" role="tablist" aria-label="Contenido">
          <button role="tab" aria-selected={vista === 'animacion'} onClick={() => setVista('animacion')}>Animación</button>
          <button role="tab" aria-selected={vista === 'ficha'} onClick={() => setVista('ficha')}>Ficha</button>
        </div>
      </header>
      {vista === 'animacion' ? <Reproductor alg={alg} /> : <Ficha alg={alg} />}
    </>
  )
}
