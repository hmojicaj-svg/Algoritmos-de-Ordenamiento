import { useState, type CSSProperties, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { BookOpen, ChartLine, House } from 'lucide-react'
import { ALGORITMOS } from './algoritmos'
import PantallaAlgoritmo from './pantallas/Algoritmo'
import Comparar from './pantallas/Comparar'
import Glosario from './pantallas/Glosario'
import Inicio from './pantallas/Inicio'

export type Ruta = 'inicio' | 'tree' | 'heap' | 'merge' | 'comparar' | 'glosario'

export default function App() {
  const [ruta, setRuta] = useState<Ruta>('inicio')
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
          {enlace('inicio', <><House aria-hidden />Inicio</>)}
          <div className="grupo">Algoritmos</div>
          {ALGORITMOS.map((a) => enlace(a.id, <><span className="punto" style={{ background: `var(--${a.id})` }} />{a.nombre}</>))}
          <div className="grupo">Aprender más</div>
          {enlace('comparar', <><ChartLine aria-hidden />Comparar</>)}
          {enlace('glosario', <><BookOpen aria-hidden />Glosario</>)}
        </nav>
        <main className="principal">
          {ruta === 'inicio' && <Inicio ir={setRuta} />}
          {alg && <PantallaAlgoritmo key={alg.id} alg={alg} />}
          {ruta === 'comparar' && <Comparar />}
          {ruta === 'glosario' && <Glosario />}
        </main>
      </div>
    </MotionConfig>
  )
}
