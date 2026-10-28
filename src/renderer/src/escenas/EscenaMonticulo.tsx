import type { ComponentType } from 'react'
import type { Paso } from '../algoritmos'
import type { EstadoMonticulo } from '../algoritmos/heapSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, columna, type Personaje, type Tema, type Tono } from './comun'
import type { Rama } from './EscenaArbol'

interface Props {
  paso: Paso<EstadoMonticulo>
  datos: number[]
  tema: Tema
  Figura?: Personaje
  Fondo?: ComponentType<{ enlaces: Rama[] }>
}

const ARRIBA = 70
const PODIO = 420 // fila de los ya ordenados
const TIRA = 492 // el arreglo A, tal como está en memoria

export default function EscenaMonticulo({ paso, datos, tema, Figura = Nodo, Fondo }: Props) {
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
  const lugar = (p: number) => (p < tamano ? enArbol(p) : { x: columna(p, n), y: PODIO })
  const enlaces: Rama[] = []
  for (let p = 1; p < tamano; p++) {
    const a = enArbol((p - 1) >> 1), b = enArbol(p)
    enlaces.push([a.x, a.y, b.x, b.y])
  }
  const fin = paso.accion === 'fin'
  const tono = (id: number, p: number): Tono => (fin || p >= tamano ? 'listo' : resaltados.includes(id) ? 'resaltado' : 'normal')
  const celda = Math.min(56, (ANCHO - 2 * MARGEN) / Math.max(n, 1) - 6)

  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Montículo binario y su arreglo">
      {Fondo ? <Fondo enlaces={enlaces} /> : enlaces.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#CFC8BA" strokeWidth={2} />)}
      {tema === 'tecnica' && <Texto x={MARGEN} y={PODIO - 36}>Ya ordenados (fuera del montículo)</Texto>}
      {orden.map((id, p) => {
        const { x, y } = lugar(p)
        return <Movil key={id} x={x} y={y}><Figura valor={datos[id]} tono={tono(id, p)} /></Movil>
      })}
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
