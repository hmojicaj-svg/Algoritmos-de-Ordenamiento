import type { ComponentType } from 'react'
import type { Paso } from '../algoritmos'
import type { EstadoArbol } from '../algoritmos/treeSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, columna, type Personaje, type Tema, type Tono } from './comun'

export type Rama = [number, number, number, number]
interface Props {
  paso: Paso<EstadoArbol>
  ultimo: EstadoArbol
  datos: number[]
  tema: Tema
  Figura?: Personaje
  Fondo?: ComponentType<{ ramas: Rama[] }> // escena con personajes: dibuja el árbol con sus ramas
}

const ARRIBA = 150 // altura de la raíz
const CABLE = 470 // fila ordenada

export default function EscenaArbol({ paso, ultimo, datos, tema, Figura = Nodo, Fondo }: Props) {
  const { nodos, pendientes, salida, volando, actual } = paso.estado
  const n = datos.length
  // Cada número tiene su columna fija según su lugar final: así el recorrido en orden se ve de izquierda a derecha.
  const rango = new Map(datos.map((v, id) => [id, v] as const).sort((a, b) => a[1] - b[1] || a[0] - b[0]).map(([id], r) => [id, r]))
  const prof = new Map<number, number>()
  for (const nd of ultimo.nodos) prof.set(nd.id, nd.padre === null ? 0 : prof.get(nd.padre)! + 1)
  const niveles = Math.max(1, ...prof.values()) // con la escala del árbol final, nada se reacomoda mientras crece
  const alto = Math.min(64, (CABLE - 80 - ARRIBA) / niveles)
  const pos = (id: number) => ({ x: columna(rango.get(id)!, n), y: ARRIBA + prof.get(id)! * alto })

  const ramas = nodos.filter((nd) => nd.padre !== null).map((nd) => {
    const a = pos(nd.padre!), b = pos(nd.id)
    return [a.x, a.y, b.x, b.y] as Rama
  })
  const enArbol = new Set(nodos.map((nd) => nd.id))
  const enSalida = new Set(salida)
  const fin = paso.accion === 'fin'

  const lugar = (id: number) => {
    const s = salida.indexOf(id)
    if (s >= 0) return { x: columna(s, n), y: CABLE }
    if (enArbol.has(id)) return pos(id)
    if (id === volando) {
      if (actual === null) return { x: pos(nodos[0]?.id ?? id).x, y: ARRIBA - 58 }
      const p = pos(actual)
      return { x: p.x, y: p.y - 46 }
    }
    return { x: MARGEN + 30 + pendientes.indexOf(id) * 58, y: 48 }
  }
  const tono = (id: number): Tono =>
    fin || enSalida.has(id) ? 'listo' : id === actual ? 'resaltado' : id === volando ? 'activo' : 'normal'

  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Árbol binario de búsqueda">
      {Fondo ? <Fondo ramas={ramas} /> : ramas.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CFC8BA" strokeWidth={2} />)}
      {tema === 'tecnica' && (
        <>
          <Texto x={MARGEN} y={20}>Esperan su turno</Texto>
          <line x1={MARGEN} y1={CABLE} x2={ANCHO - MARGEN} y2={CABLE} stroke="#E3DED3" strokeWidth={2} strokeDasharray="4 6" />
          <Texto x={MARGEN} y={CABLE + 50}>Salida en orden</Texto>
        </>
      )}
      {datos.map((v, id) => {
        const { x, y } = lugar(id)
        return <Movil key={id} x={x} y={y}><Figura valor={v} tono={tono(id)} /></Movil>
      })}
    </svg>
  )
}
