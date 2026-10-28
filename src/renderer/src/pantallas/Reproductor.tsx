import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from 'lucide-react'
import { grabar, type Algoritmo } from '../algoritmos'
import type { EstadoArbol } from '../algoritmos/treeSort'
import EscenaArbol from '../escenas/EscenaArbol'
import EscenaMezcla from '../escenas/EscenaMezcla'
import EscenaMonticulo from '../escenas/EscenaMonticulo'

const EJEMPLO = '7, 4, 2, 1, 8, 3, 6, 5'
const MAX = 15

// Valida lo que escribe la persona: de 2 a 15 enteros entre 1 y 99.
export function leerDatos(texto: string): number[] | string {
  const partes = texto.split(/[\s,;]+/).filter(Boolean)
  if (partes.length < 2) return 'Escribe al menos 2 números.'
  if (partes.length > MAX) return `Máximo ${MAX} números, para que la animación se pueda seguir.`
  const datos = partes.map(Number)
  if (datos.some((d) => !Number.isInteger(d) || d < 1 || d > 99)) return 'Usa solo números enteros del 1 al 99.'
  return datos
}

const azar = () => Array.from({ length: 9 }, () => 1 + Math.floor(Math.random() * 60)).join(', ')

export function useReproductor(alg: Algoritmo<unknown>) {
  const [texto, setTexto] = useState(EJEMPLO)
  const [datos, setDatos] = useState(() => leerDatos(EJEMPLO) as number[])
  const pasos = useMemo(() => grabar(alg, datos), [alg, datos])
  const [i, setI] = useState(0)
  const [jugando, setJugando] = useState(false)
  const [velocidad, setVelocidad] = useState(1)

  useEffect(() => {
    if (!jugando) return
    if (i >= pasos.length - 1) return setJugando(false)
    const t = setTimeout(() => setI(i + 1), 1100 / velocidad)
    return () => clearTimeout(t)
  }, [jugando, i, velocidad, pasos.length])

  const usar = (t: string) => {
    setTexto(t)
    const d = leerDatos(t)
    if (typeof d === 'string') return
    setDatos(d)
    setI(0)
    setJugando(false)
  }
  const ir = (k: number) => setI(Math.max(0, Math.min(k, pasos.length - 1)))
  const reproducir = () => {
    const alFinal = i >= pasos.length - 1
    if (alFinal) setI(0)
    setJugando(!jugando || alFinal)
  }
  const teclas = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    if (e.key === ' ') { e.preventDefault(); setJugando((j) => !j) }
    if (e.key === 'ArrowRight') setI((v) => Math.min(v + 1, pasos.length - 1))
    if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0))
  }
  return {
    alg, texto, datos, pasos, i, paso: pasos[i], jugando, velocidad, setVelocidad, usar, ir, reproducir, teclas,
    // Lo que dura un salto de personaje: nunca más que el tiempo entre pasos.
    duracion: Math.min(0.75, 0.85 / velocidad),
    error: typeof leerDatos(texto) === 'string' ? (leerDatos(texto) as string) : null
  }
}
export type EstadoReproductor = ReturnType<typeof useReproductor>

export function Controles({ r }: { r: EstadoReproductor }) {
  const { i, pasos, paso, jugando, velocidad } = r
  const comparaciones = useMemo(() => pasos.slice(0, i + 1).filter((p) => p.accion === 'comparar').length, [pasos, i])
  return (
    <section className="panel vidrio" aria-label="Controles">
      <p className="narracion" aria-live="polite"><span className="n">Paso {i + 1} de {pasos.length}</span>{paso.narracion}</p>
      <div className="controles">
        <button className="boton" onClick={() => { r.ir(0) }} aria-label="Reiniciar"><RotateCcw /></button>
        <button className="boton" onClick={() => r.ir(i - 1)} disabled={i === 0} aria-label="Paso anterior"><ChevronLeft /></button>
        <button className="boton primario" onClick={r.reproducir}>{jugando ? <><Pause />Pausa</> : <><Play />Reproducir</>}</button>
        <button className="boton" onClick={() => r.ir(i + 1)} disabled={i >= pasos.length - 1} aria-label="Paso siguiente"><ChevronRight /></button>
        <label>Velocidad
          <input type="range" min={0.25} max={4} step={0.25} value={velocidad} onChange={(e) => r.setVelocidad(Number(e.target.value))} />
          <span className="num">{velocidad}×</span>
        </label>
        <div className="contadores"><span>Comparaciones: <b>{comparaciones}</b></span></div>
        <label>Datos
          <input type="text" value={r.texto} onChange={(e) => r.usar(e.target.value)} aria-invalid={r.error !== null} />
        </label>
        <button className="boton" onClick={() => r.usar(azar())}><Shuffle />Aleatorios</button>
        <button className="boton" onClick={() => r.usar('1, 2, 3, 4, 5, 6, 7, 8')}>Ya ordenados</button>
        <button className="boton" onClick={() => r.usar(EJEMPLO)}>Ejemplo</button>
        {r.error && <p className="error" role="alert">{r.error}</p>}
      </div>
    </section>
  )
}

export function Pseudocodigo({ r }: { r: EstadoReproductor }) {
  return (
    <section className="pseudo vidrio" aria-label="Pseudocódigo">
      <h2>Pseudocódigo</h2>
      <ol>
        {r.alg.pseudocodigo.map((l, k) => (
          <li key={k} className={k + 1 === r.paso.linea ? 'activa' : undefined} aria-current={k + 1 === r.paso.linea ? 'step' : undefined}>{l || ' '}</li>
        ))}
      </ol>
    </section>
  )
}

// Vista técnica: nodos y arreglos en 2D, para quien quiera ver el algoritmo en su forma clásica.
export function VistaTecnica({ r }: { r: EstadoReproductor }) {
  const comun = { datos: r.datos, paso: r.paso as never }
  return (
    <div className="tecnica vidrio">
      {r.alg.id === 'tree' && <EscenaArbol {...comun} ultimo={r.pasos.at(-1)!.estado as EstadoArbol} />}
      {r.alg.id === 'heap' && <EscenaMonticulo {...comun} />}
      {r.alg.id === 'merge' && <EscenaMezcla {...comun} />}
    </div>
  )
}
