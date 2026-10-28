import { useEffect, useMemo, useState, type KeyboardEvent } from 'react'
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw, Shuffle } from 'lucide-react'
import { grabar, type Algoritmo } from '../algoritmos'
import type { EstadoArbol } from '../algoritmos/treeSort'
import type { Tema } from '../escenas/comun'
import EscenaArbol from '../escenas/EscenaArbol'
import EscenaMezcla from '../escenas/EscenaMezcla'
import EscenaMonticulo from '../escenas/EscenaMonticulo'
import { FondoArbol, Pajaro } from '../escenas/Pajaros'
import { FondoMar, PlacaHielo, Pinguino } from '../escenas/Pinguinos'

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

export default function Reproductor({ alg }: { alg: Algoritmo<unknown> }) {
  const [texto, setTexto] = useState(EJEMPLO)
  const [datos, setDatos] = useState(() => leerDatos(EJEMPLO) as number[])
  const leido = leerDatos(texto)
  const pasos = useMemo(() => grabar(alg, datos), [alg, datos])
  const [i, setI] = useState(0)
  const [jugando, setJugando] = useState(false)
  const [velocidad, setVelocidad] = useState(1)
  const [tema, setTema] = useState<Tema>('personajes')

  const usar = (t: string) => {
    setTexto(t)
    const d = leerDatos(t)
    if (typeof d === 'string') return
    setDatos(d)
    setI(0)
    setJugando(false)
  }

  useEffect(() => {
    if (!jugando) return
    if (i >= pasos.length - 1) return setJugando(false)
    const t = setTimeout(() => setI(i + 1), 1100 / velocidad)
    return () => clearTimeout(t)
  }, [jugando, i, velocidad, pasos.length])

  const paso = pasos[i]
  const comparaciones = useMemo(() => pasos.slice(0, i + 1).filter((p) => p.accion === 'comparar').length, [pasos, i])
  const teclas = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement).tagName === 'INPUT') return
    if (e.key === ' ') { e.preventDefault(); setJugando((j) => !j) }
    if (e.key === 'ArrowRight') setI((v) => Math.min(v + 1, pasos.length - 1))
    if (e.key === 'ArrowLeft') setI((v) => Math.max(v - 1, 0))
  }
  const reproducir = () => {
    if (i >= pasos.length - 1) setI(0)
    setJugando(!jugando || i >= pasos.length - 1)
  }

  // El paso es de un tipo distinto por algoritmo; cada escena sabe leer el suyo.
  const personajes = tema === 'personajes' && alg.id !== 'heap'
  const comun = { datos, tema: personajes ? tema : 'tecnica' as Tema, paso: paso as never }
  return (
    <div className="reproductor" onKeyDown={teclas}>
      <section className="tarjeta" aria-label="Animación">
        <div className="escena" style={{ background: personajes ? undefined : 'var(--surface-2)' }}>
          {alg.id === 'tree' && <EscenaArbol {...comun} ultimo={pasos.at(-1)!.estado as EstadoArbol} {...(personajes && { Figura: Pajaro, Fondo: FondoArbol })} />}
          {alg.id === 'heap' && <EscenaMonticulo {...comun} />}
          {alg.id === 'merge' && <EscenaMezcla {...comun} {...(personajes && { Figura: Pinguino, Placa: PlacaHielo, Fondo: FondoMar })} />}
          {/* ponytail: Heap Sort aún sin escena con personajes; el selector aparece cuando se elija una. */}
          {alg.id !== 'heap' && (
            <div className="modo pestanas" role="tablist" aria-label="Tipo de vista">
              <button role="tab" aria-selected={personajes} onClick={() => setTema('personajes')}>{alg.id === 'tree' ? 'Pájaros' : 'Pingüinos'}</button>
              <button role="tab" aria-selected={!personajes} onClick={() => setTema('tecnica')}>Vista técnica</button>
            </div>
          )}
        </div>
        <p className="narracion" aria-live="polite"><span className="n">Paso {i + 1} de {pasos.length}</span>{paso.narracion}</p>
        <div className="controles">
          <button className="boton" onClick={() => { setI(0); setJugando(false) }} aria-label="Reiniciar"><RotateCcw /></button>
          <button className="boton" onClick={() => setI(Math.max(i - 1, 0))} disabled={i === 0} aria-label="Paso anterior"><ChevronLeft /></button>
          <button className="boton primario" onClick={reproducir}>{jugando ? <><Pause />Pausa</> : <><Play />Reproducir</>}</button>
          <button className="boton" onClick={() => setI(Math.min(i + 1, pasos.length - 1))} disabled={i >= pasos.length - 1} aria-label="Paso siguiente"><ChevronRight /></button>
          <label>Velocidad
            <input type="range" min={0.25} max={4} step={0.25} value={velocidad} onChange={(e) => setVelocidad(Number(e.target.value))} />
            <span className="num">{velocidad}×</span>
          </label>
          <div className="contadores"><span>Comparaciones: <b>{comparaciones}</b></span></div>
          <label>Datos
            <input type="text" value={texto} onChange={(e) => usar(e.target.value)} aria-invalid={typeof leido === 'string'} />
          </label>
          <button className="boton" onClick={() => usar(azar())}><Shuffle />Aleatorios</button>
          <button className="boton" onClick={() => usar('1, 2, 3, 4, 5, 6, 7, 8')}>Ya ordenados</button>
          <button className="boton" onClick={() => usar(EJEMPLO)}>Ejemplo</button>
          {typeof leido === 'string' && <p className="error" role="alert">{leido}</p>}
        </div>
      </section>
      <section className="tarjeta pseudo" aria-label="Pseudocódigo">
        <h2>Pseudocódigo</h2>
        <ol>
          {alg.pseudocodigo.map((l, k) => (
            <li key={k} className={k + 1 === paso.linea ? 'activa' : undefined} aria-current={k + 1 === paso.linea ? 'step' : undefined}>{l || ' '}</li>
          ))}
        </ol>
      </section>
    </div>
  )
}
