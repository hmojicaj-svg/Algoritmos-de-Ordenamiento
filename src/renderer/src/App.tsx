import { useState, type CSSProperties, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { ChartLine } from 'lucide-react'
import { ALGORITMOS } from './algoritmos'
import PantallaAlgoritmo from './pantallas/Algoritmo'
import Comparar from './pantallas/Comparar'

export type Ruta = 'tree' | 'heap' | 'merge' | 'comparar'

export default function App() {
  const [ruta, setRuta] = useState<Ruta>('tree')
  const alg = ALGORITMOS.find((a) => a.id === ruta)
  const color = alg?.id ?? 'tree'
  const acento = { '--acento': `var(--${color})`, '--acento-bg': `var(--${color}-bg)` } as CSSProperties
  const enlace = (r: Ruta, contenido: ReactNode) => (
    <button key={r} aria-current={ruta === r ? 'page' : undefined} onClick={() => setRuta(r)}>{contenido}</button>
  )

  return (
    <MotionConfig reducedMotion="user">
      <div className="app" style={acento}>
        <nav className="nav" aria-label="Secciones">
          <div className="marca">Algoritmos de Ordenamiento<small>Ordenar con árboles</small></div>
          <div className="grupo">Algoritmos</div>
          {ALGORITMOS.map((a) => enlace(a.id, <><span className="punto" style={{ background: `var(--${a.id})` }} />{a.nombre}</>))}
          <div className="separador" />
          {enlace('comparar', <><ChartLine aria-hidden />Comparar</>)}
        </nav>
        <main className={alg ? "principal lleno" : "principal"}>
          {alg && <PantallaAlgoritmo key={alg.id} alg={alg} />}
          {ruta === 'comparar' && <Comparar />}
        </main>
      </div>
    </MotionConfig>
  )
}
