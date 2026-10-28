import type { Paso } from '../algoritmos'
import type { EstadoArbol } from '../algoritmos/treeSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, columna, type Tono } from './comun'

export const ARRIBA = 150 // altura de la raíz
export const CABLE = 470 // fila ordenada

// Posiciones (lienzo 1000 × 540) de cada pájaro y de cada rama. La usan la vista técnica y la escena 3D.
export function disenoArbol(paso: Paso<EstadoArbol>, ultimo: EstadoArbol, datos: number[]) {
  const { nodos, pendientes, salida, volando, actual } = paso.estado
  const n = datos.length
  // Cada número tiene su columna fija según su lugar final: así el recorrido en orden se ve de izquierda a derecha.
  const rango = new Map(datos.map((v, id) => [id, v] as const).sort((a, b) => a[1] - b[1] || a[0] - b[0]).map(([id], r) => [id, r]))
  const prof = new Map<number, number>()
  for (const nd of ultimo.nodos) prof.set(nd.id, nd.padre === null ? 0 : prof.get(nd.padre)! + 1)
  const niveles = Math.max(1, ...prof.values()) // con la escala del árbol final, nada se reacomoda mientras crece
  const alto = Math.min(64, (CABLE - 80 - ARRIBA) / niveles)
  const pos = (id: number) => ({ x: columna(rango.get(id)!, n), y: ARRIBA + prof.get(id)! * alto })

  const raiz = nodos[0] ? pos(nodos[0].id) : null
  const ramas = nodos.filter((nd) => nd.padre !== null).map((nd) => ({ hijo: nd.id, desde: pos(nd.padre!), hasta: pos(nd.id) }))
  const enArbol = new Set(nodos.map((nd) => nd.id))
  const enSalida = new Set(salida)
  const fin = paso.accion === 'fin'

  const lugar = (id: number) => {
    const s = salida.indexOf(id)
    if (s >= 0) return { x: columna(s, n), y: CABLE }
    if (enArbol.has(id)) return pos(id)
    if (id === volando) {
      if (actual === null) return { x: raiz?.x ?? ANCHO / 2, y: ARRIBA - 58 }
      const p = pos(actual)
      return { x: p.x, y: p.y - 46 }
    }
    return { x: MARGEN + 30 + pendientes.indexOf(id) * 58, y: 48 }
  }
  const tono = (id: number): Tono =>
    fin || enSalida.has(id) ? 'listo' : id === actual ? 'resaltado' : id === volando ? 'activo' : 'normal'
  const lugares = datos.map((_, id) => ({ id, ...lugar(id), tono: tono(id), enArbol: enArbol.has(id) && !enSalida.has(id) }))
  return { lugares, ramas, raiz, hojas: nodos.map((nd) => ({ id: nd.id, ...pos(nd.id) })) }
}

export default function EscenaArbol({ paso, ultimo, datos }: { paso: Paso<EstadoArbol>; ultimo: EstadoArbol; datos: number[] }) {
  const { lugares, ramas } = disenoArbol(paso, ultimo, datos)
  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Árbol binario de búsqueda">
      {ramas.map(({ hijo, desde, hasta }) => <line key={hijo} x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y} stroke="#CFC8BA" strokeWidth={2} />)}
      <Texto x={MARGEN} y={20}>Esperan su turno</Texto>
      <line x1={MARGEN} y1={CABLE} x2={ANCHO - MARGEN} y2={CABLE} stroke="#E3DED3" strokeWidth={2} strokeDasharray="4 6" />
      <Texto x={MARGEN} y={CABLE + 50}>Salida en orden</Texto>
      {lugares.map(({ id, x, y, tono }) => <Movil key={id} x={x} y={y}><Nodo valor={datos[id]} tono={tono} /></Movil>)}
    </svg>
  )
}
