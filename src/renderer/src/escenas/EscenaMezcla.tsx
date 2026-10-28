import type { ComponentType } from 'react'
import type { Paso } from '../algoritmos'
import type { EstadoMezcla } from '../algoritmos/mergeSort'
import { ALTO, ANCHO, MARGEN, Movil, Nodo, Texto, type Personaje, type Tema, type Tono } from './comun'

export interface PropsPlaca { x: number; ancho: number; y: number; activa: boolean }
interface Props {
  paso: Paso<EstadoMezcla>
  datos: number[]
  tema: Tema
  Figura?: Personaje
  Placa?: ComponentType<PropsPlaca>
  Fondo?: ComponentType
}

const FILA = 200 // grupos partidos
const NUEVA = 360 // donde se va armando la mezcla
const HUECO = 18 // separación entre grupos

function PlacaSimple({ x, ancho, y, activa }: PropsPlaca) {
  return <rect x={x} y={y + 28} width={ancho} height={10} rx={5} fill={activa ? 'var(--acento)' : '#CFC8BA'} opacity={activa ? 0.55 : 1} />
}

export default function EscenaMezcla({ paso, datos, tema, Figura = Nodo, Placa = PlacaSimple, Fondo }: Props) {
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

  return (
    <svg className="lienzo" viewBox={`0 0 ${ANCHO} ${ALTO}`} role="img" aria-label="Grupos que se dividen y se mezclan">
      {Fondo && <Fondo />}
      {placas.map((p, i) => <Placa key={`${p.x}-${p.y}-${i}`} {...p} />)}
      {tema === 'tecnica' && (
        <>
          <Texto x={MARGEN} y={FILA - 60}>Grupos divididos</Texto>
          <Texto x={MARGEN} y={NUEVA - 60}>Mezcla en curso</Texto>
        </>
      )}
      {orden.map((id, p) => (
        <Movil key={id} x={x(p)} y={enNueva(p) ? NUEVA : FILA}><Figura valor={datos[id]} tono={tono(id, p)} /></Movil>
      ))}
    </svg>
  )
}
