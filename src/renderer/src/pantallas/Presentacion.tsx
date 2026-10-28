import { useEffect, useState, type ReactNode, type RefObject } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Maximize, Minimize } from 'lucide-react'
import type { Algoritmo } from '../algoritmos'
import { CONTENIDO } from '../contenido'

const ESCENA = { tree: 'Pájaros en un árbol', heap: 'Cabras en la montaña', merge: 'Pingüinos en el hielo' } as const

function diapositivas(alg: Algoritmo<unknown>): { titulo: string; cuerpo: ReactNode; portada?: boolean }[] {
  const c = CONTENIDO[alg.id]
  return [
    {
      titulo: alg.nombre, portada: true,
      cuerpo: <>
        <p className="lead">{c.resumen}</p>
        <div className="etiquetas">{c.etiquetas.map((e) => <span key={e} className="etiqueta">{e}</span>)}</div>
        <p className="escena-nombre">Escena: {ESCENA[alg.id]}</p>
      </>
    },
    { titulo: 'Historia', cuerpo: c.historia.map((p, i) => <p key={i}>{p}</p>) },
    { titulo: '¿Cómo funciona?', cuerpo: <ol>{c.idea.map((p, i) => <li key={i}>{p}</li>)}</ol> },
    {
      titulo: 'Pseudocódigo',
      cuerpo: <ol className={`codigo${alg.pseudocodigo.length > 16 ? ' dos-columnas' : ''}`}>{alg.pseudocodigo.map((l, i) => <li key={i}>{l || ' '}</li>)}</ol>
    },
    {
      titulo: 'Rendimiento (Big O)',
      cuerpo: <table className="bigo">
        <thead><tr><th>Caso</th><th>Tiempo</th><th>Por qué</th></tr></thead>
        <tbody>
          {c.bigO.map((f) => <tr key={f.caso}><td>{f.caso}</td><td className="o">{f.tiempo}</td><td>{f.nota}</td></tr>)}
          <tr><td>Memoria</td><td colSpan={2}>{c.memoria}</td></tr>
        </tbody>
      </table>
    },
    { titulo: 'Características', cuerpo: <ul>{c.caracteristicas.map((t) => <li key={t}>{t}</li>)}</ul> },
    {
      titulo: 'Ventajas y desventajas',
      cuerpo: <div className="dos">
        <div><h3>Ventajas</h3><ul>{c.ventajas.map((t) => <li key={t}>{t}</li>)}</ul></div>
        <div><h3>Desventajas</h3><ul>{c.desventajas.map((t) => <li key={t}>{t}</li>)}</ul></div>
      </div>
    },
    { titulo: '¿Sabías que…?', cuerpo: <p className="lead">{c.curiosidad}</p> },
    {
      titulo: 'Fuentes',
      cuerpo: <ul className="fuentes">
        {c.fuentes.map((f) => <li key={f.texto}>{f.texto}{f.url && <> <a href={f.url} target="_blank" rel="noreferrer">{f.url}</a></>}</li>)}
      </ul>
    }
  ]
}

// Presentación del algoritmo sobre su escenario 3D. Se maneja con flechas, RePág/AvPág (punteros de presentación) o los botones.
export default function Presentacion({ alg, contenedor }: { alg: Algoritmo<unknown>; contenedor: RefObject<HTMLDivElement | null> }) {
  const lista = diapositivas(alg)
  const [[i, dir], setI] = useState([0, 1])
  const [completa, setCompleta] = useState(false)
  const ir = (k: number) => setI(([actual]) => [Math.max(0, Math.min(k, lista.length - 1)), k >= actual ? 1 : -1])

  const pantallaCompleta = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else contenedor.current?.requestFullscreen()
  }

  useEffect(() => {
    const tecla = (e: KeyboardEvent) => {
      if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); setI(([a]) => [Math.min(a + 1, lista.length - 1), 1]) }
      if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); setI(([a]) => [Math.max(a - 1, 0), -1]) }
      if (e.key === 'Home') setI([0, -1])
      if (e.key === 'End') setI([lista.length - 1, 1])
      if (e.key === 'f' || e.key === 'F') pantallaCompleta()
    }
    const cambio = () => setCompleta(document.fullscreenElement !== null)
    window.addEventListener('keydown', tecla)
    document.addEventListener('fullscreenchange', cambio)
    return () => {
      window.removeEventListener('keydown', tecla)
      document.removeEventListener('fullscreenchange', cambio)
    }
  })

  const d = lista[i]
  return (
    <div className="presentacion">
      <AnimatePresence mode="wait" custom={dir} initial={false}>
        <motion.section
          key={i} className={`diapositiva vidrio${d.portada ? ' portada' : ''}`} custom={dir}
          initial={{ opacity: 0, x: 48 * dir }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -48 * dir }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          aria-roledescription="diapositiva" aria-label={`${i + 1} de ${lista.length}: ${d.titulo}`}
        >
          {!d.portada && <span className="algoritmo-nombre">{alg.nombre}</span>}
          <h2>{d.titulo}</h2>
          <div className="contenido-diapo">{d.cuerpo}</div>
        </motion.section>
      </AnimatePresence>
      <nav className="barra-diapo vidrio" aria-label="Diapositivas">
        <button className="boton" onClick={() => ir(i - 1)} disabled={i === 0} aria-label="Diapositiva anterior"><ChevronLeft /></button>
        <div className="puntos">
          {lista.map((x, k) => (
            <button key={k} className={k === i ? 'activo' : undefined} onClick={() => ir(k)} aria-label={`Ir a ${x.titulo}`} aria-current={k === i ? 'step' : undefined} />
          ))}
        </div>
        <span className="num contador">{i + 1} / {lista.length}</span>
        <button className="boton" onClick={() => ir(i + 1)} disabled={i === lista.length - 1} aria-label="Diapositiva siguiente"><ChevronRight /></button>
        <button className="boton" onClick={pantallaCompleta}>{completa ? <><Minimize />Salir</> : <><Maximize />Pantalla completa</>}</button>
      </nav>
    </div>
  )
}
