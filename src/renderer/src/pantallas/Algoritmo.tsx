import { useState } from 'react'
import type { Algoritmo, Paso } from '../algoritmos'
import type { EstadoMonticulo } from '../algoritmos/heapSort'
import type { EstadoMezcla } from '../algoritmos/mergeSort'
import type { EstadoArbol } from '../algoritmos/treeSort'
import EscenaCabras3D from '../escenas3d/Cabras3D'
import EscenaPajaros3D from '../escenas3d/Pajaros3D'
import EscenaPinguinos3D from '../escenas3d/Pinguinos3D'
import Ficha from './Ficha'
import { Controles, Pseudocodigo, VistaTecnica, useReproductor } from './Reproductor'

const PERSONAJES = { tree: 'Pájaros', heap: 'Cabras', merge: 'Pingüinos' } as const

// El escenario 3D ocupa toda la pantalla del algoritmo; los paneles flotan encima.
export default function PantallaAlgoritmo({ alg }: { alg: Algoritmo<unknown> }) {
  const r = useReproductor(alg)
  const [vista, setVista] = useState<'animacion' | 'ficha'>('animacion')
  const [tecnica, setTecnica] = useState(false)
  const comun = { datos: r.datos, duracion: r.duracion }

  return (
    <div className={`escenario ${alg.id}`} onKeyDown={r.teclas}>
      <div className="fondo3d" aria-hidden>
        {alg.id === 'tree' && <EscenaPajaros3D {...comun} paso={r.paso as Paso<EstadoArbol>} ultimo={r.pasos.at(-1)!.estado as EstadoArbol} />}
        {alg.id === 'heap' && <EscenaCabras3D {...comun} paso={r.paso as Paso<EstadoMonticulo>} />}
        {alg.id === 'merge' && <EscenaPinguinos3D {...comun} paso={r.paso as Paso<EstadoMezcla>} />}
      </div>
      <div className="capa">
        <header className="cabecera vidrio">
          <h1>{alg.nombre}</h1>
          <div className="pestanas" role="tablist" aria-label="Contenido">
            <button role="tab" aria-selected={vista === 'animacion'} onClick={() => setVista('animacion')}>Animación</button>
            <button role="tab" aria-selected={vista === 'ficha'} onClick={() => setVista('ficha')}>Ficha</button>
          </div>
          {vista === 'animacion' && (
            <div className="pestanas" role="tablist" aria-label="Tipo de vista">
              <button role="tab" aria-selected={!tecnica} onClick={() => setTecnica(false)}>{PERSONAJES[alg.id]}</button>
              <button role="tab" aria-selected={tecnica} onClick={() => setTecnica(true)}>Vista técnica</button>
            </div>
          )}
        </header>
        {vista === 'animacion' ? (
          <>
            <div className="hueco">{tecnica && <VistaTecnica r={r} />}</div>
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
