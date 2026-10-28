import { useState } from 'react'
import type { Algoritmo, Paso } from '../algoritmos'
import type { EstadoMezcla } from '../algoritmos/mergeSort'
import EscenaPinguinos3D from '../escenas3d/Pinguinos3D'
import Ficha from './Ficha'
import { Controles, Pseudocodigo, VistaTecnica, useReproductor } from './Reproductor'

const PERSONAJES = { tree: 'Pájaros', heap: 'Cabras', merge: 'Pingüinos' } as const

// El escenario 3D ocupa toda la pantalla del algoritmo; los paneles flotan encima.
export default function PantallaAlgoritmo({ alg }: { alg: Algoritmo<unknown> }) {
  const r = useReproductor(alg)
  const [vista, setVista] = useState<'animacion' | 'ficha'>('animacion')
  const [tecnica, setTecnica] = useState(false)
  // ponytail: por ahora solo Merge Sort tiene escena 3D; pájaros y cabras siguen el mismo molde.
  const tiene3D = alg.id === 'merge'
  const verTecnica = tecnica || !tiene3D

  return (
    <div className={`escenario ${alg.id}`} onKeyDown={r.teclas}>
      <div className="fondo3d" aria-hidden>
        {tiene3D && <EscenaPinguinos3D paso={r.paso as Paso<EstadoMezcla>} datos={r.datos} duracion={r.duracion} />}
      </div>
      <div className="capa">
        <header className="cabecera vidrio">
          <h1>{alg.nombre}</h1>
          <div className="pestanas" role="tablist" aria-label="Contenido">
            <button role="tab" aria-selected={vista === 'animacion'} onClick={() => setVista('animacion')}>Animación</button>
            <button role="tab" aria-selected={vista === 'ficha'} onClick={() => setVista('ficha')}>Ficha</button>
          </div>
          {vista === 'animacion' && tiene3D && (
            <div className="pestanas" role="tablist" aria-label="Tipo de vista">
              <button role="tab" aria-selected={!tecnica} onClick={() => setTecnica(false)}>{PERSONAJES[alg.id]}</button>
              <button role="tab" aria-selected={tecnica} onClick={() => setTecnica(true)}>Vista técnica</button>
            </div>
          )}
        </header>
        {vista === 'animacion' ? (
          <>
            <div className="hueco">{verTecnica && <VistaTecnica r={r} />}</div>
            <Pseudocodigo r={r} />
            <Controles r={r} />
          </>
        ) : (
          <div className="hueco ficha-hueco"><Ficha alg={alg} /></div>
        )}
      </div>
    </div>
  )
}
