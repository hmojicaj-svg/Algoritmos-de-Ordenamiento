import type { Paso } from '../algoritmos'
import type { EstadoMonticulo } from '../algoritmos/heapSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, columna, type Tono } from './comun'

export const ARRIBA = 70
export const PODIO = 420 // fila de los ya ordenados
const TIRA = 492 // el arreglo A, tal como está en memoria

// Posiciones (lienzo 1000 × 540) de cada id, de cada cornisa del montículo y de sus enlaces.
export function disenoMonticulo(paso: Paso<EstadoMonticulo>) {
  const { orden, tamano, resaltados } = paso.estado
  const n = orden.length
  const niveles = Math.floor(Math.log2(Math.max(n, 1))) + 1
  const alto = Math.min(85, (PODIO - 80 - ARRIBA) / Math.max(1, niveles - 1))
  // Posición p del arreglo → lugar en el árbol: nivel ⌊log2(p+1)⌋, hijos en 2p+1 y 2p+2.
  const enArbol = (p: number) => {
    const nivel = Math.floor(Math.log2(p + 1))
    const ancho = 2 ** nivel
    return { x: MARGEN + ((p - (ancho - 1) + 0.5) / ancho) * (ANCHO - 2 * MARGEN), y: ARRIBA + nivel * alto }
  }
  const fin = paso.accion === 'fin'
  const tono = (id: number, p: number): Tono => (fin || p >= tamano ? 'listo' : resaltados.includes(id) ? 'resaltado' : 'normal')
  const lugares = orden.map((id, p) => ({ id, p, ...(p < tamano ? enArbol(p) : { x: columna(p, n), y: PODIO }), tono: tono(id, p) }))
  const cornisas = orden.map((_, p) => ({ p, ...enArbol(p), usada: p < tamano }))
  const enlaces = cornisas.slice(1).filter((c) => c.usada).map((c) => ({ p: c.p, desde: enArbol((c.p - 1) >> 1), hasta: enArbol(c.p) }))
  return { lugares, cornisas, enlaces }
}

export default function EscenaMonticulo({ paso, datos }: { paso: Paso<EstadoMonticulo>; datos: number[] }) {
  const { orden, tamano, resaltados } = paso.estado
  const { lugares, enlaces } = disenoMonticulo(paso)
  const n = orden.length
  const celda = Math.min(56, (ANCHO - 2 * MARGEN) / Math.max(n, 1) - 6)
  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Montículo binario y su arreglo">
      {enlaces.map(({ p, desde, hasta }) => <line key={p} x1={desde.x} y1={desde.y} x2={hasta.x} y2={hasta.y} stroke="#CFC8BA" strokeWidth={2} />)}
      <Texto x={MARGEN} y={PODIO - 36}>Ya ordenados (fuera del montículo)</Texto>
      {lugares.map(({ id, x, y, tono }) => <Movil key={id} x={x} y={y}><Nodo valor={datos[id]} tono={tono} /></Movil>)}
      {/* El montículo no es una estructura aparte: es este mismo arreglo leído como árbol. */}
      {orden.map((id, p) => (
        <g key={p} transform={`translate(${columna(p, n)} ${TIRA})`}>
          <rect x={-celda / 2} y={-16} width={celda} height={32} rx={6}
            fill={p < tamano ? '#FFFFFF' : '#E6F2EA'} stroke={resaltados.includes(id) ? '#E2A93B' : '#CFC8BA'} strokeWidth={resaltados.includes(id) ? 2.5 : 1} />
          <text textAnchor="middle" dy="0.35em" fontSize={14} fontWeight={600} fill="#22261F">{datos[id]}</text>
          <text textAnchor="middle" y={30} fontSize={11} fill="#6E7368">{p}</text>
        </g>
      ))}
      <Texto x={MARGEN} y={TIRA - 26}>Arreglo A (posición debajo)</Texto>
    </svg>
  )
}
