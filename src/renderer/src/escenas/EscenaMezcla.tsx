import type { Paso } from '../algoritmos'
import type { EstadoMezcla } from '../algoritmos/mergeSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, type Tono } from './comun'

export interface PropsPlaca { x: number; ancho: number; y: number; activa: boolean }
const FILA = 200 // grupos partidos
const NUEVA = 360 // donde se va armando la mezcla
const HUECO = 18 // separación entre grupos

function Placa({ x, ancho, y, activa }: PropsPlaca) {
  return <rect x={x} y={y + 28} width={ancho} height={10} rx={5} fill={activa ? 'var(--acento)' : '#CFC8BA'} opacity={activa ? 0.55 : 1} />
}

export const FILAS = { FILA, NUEVA }

// Posiciones (en el lienzo 1000 × 540) de cada id y de las placas. La usan la vista técnica y la escena 3D.
export function disenoMezcla(paso: Paso<EstadoMezcla>) {
  const { orden, cortes, activo, colocados, resaltados } = paso.estado
  const n = orden.length
  const celda = (ANCHO - 2 * MARGEN - HUECO * Math.max(n - 1, 0)) / Math.max(n, 1)
  const x = (p: number) => MARGEN + p * celda + celda / 2 + cortes.filter((c) => c <= p).length * HUECO
  const enNueva = (p: number) => activo !== null && p >= activo[0] && p < activo[0] + colocados.length

  // Placas: tramos entre cortes. Durante una mezcla, lo ya colocado tiene su propia placa abajo.
  const placas: PropsPlaca[] = []
  const bordes = [0, ...cortes, n]
  for (let k = 0; k + 1 < bordes.length; k++) {
    let [a, b] = [bordes[k], bordes[k + 1] - 1]
    const activa = activo !== null && a >= activo[0] && b <= activo[1]
    if (activa && colocados.length) a = Math.max(a, activo![0] + colocados.length)
    if (a <= b) placas.push({ x: x(a) - celda / 2, ancho: x(b) - x(a) + celda, y: FILA, activa })
  }
  if (activo && colocados.length) {
    const [a, b] = [activo[0], activo[0] + colocados.length - 1]
    placas.push({ x: x(a) - celda / 2, ancho: x(b) - x(a) + celda, y: NUEVA, activa: true })
  }
  const fin = paso.accion === 'fin'
  const tono = (id: number, p: number): Tono =>
    fin ? 'listo' : resaltados.includes(id) ? 'resaltado' : enNueva(p) ? 'activo' : 'normal'
  const lugares = orden.map((id, p) => ({ id, x: x(p), y: enNueva(p) ? NUEVA : FILA, tono: tono(id, p) }))
  return { lugares, placas, celda }
}

export default function EscenaMezcla({ paso, datos }: { paso: Paso<EstadoMezcla>; datos: number[] }) {
  const { lugares, placas } = disenoMezcla(paso)
  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Grupos que se dividen y se mezclan">
      {placas.map((p, i) => <Placa key={`${p.x}-${p.y}-${i}`} {...p} />)}
      <Texto x={MARGEN} y={FILA - 60}>Grupos divididos</Texto>
      <Texto x={MARGEN} y={NUEVA - 60}>Mezcla en curso</Texto>
      {lugares.map(({ id, x, y, tono }) => (
        <Movil key={id} x={x} y={y}><Nodo valor={datos[id]} tono={tono} /></Movil>
      ))}
    </svg>
  )
}
