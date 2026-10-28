import type { ComponentType, ReactNode } from 'react'
import { motion } from 'motion/react'

// Lienzo común: todas las escenas dibujan en 1000 × 540 y el SVG escala al ancho disponible.
export const ANCHO = 1000
export const ALTO = 540
export const MARGEN = 40

export type Tono = 'normal' | 'resaltado' | 'activo' | 'listo'
export interface PropsPersonaje { valor: number; tono: Tono }
export type Personaje = ComponentType<PropsPersonaje>
export type Tema = 'personajes' | 'tecnica'

// Centro de la columna `i` de `n` columnas repartidas en el ancho útil.
export const columna = (i: number, n: number) => MARGEN + ((i + 0.5) * (ANCHO - 2 * MARGEN)) / Math.max(n, 1)

// Mueve a un personaje con un resorte: conserva su identidad (key = id) y viaja de un lugar a otro.
export function Movil({ x, y, children }: { x: number; y: number; children: ReactNode }) {
  return (
    <motion.g initial={false} animate={{ x, y }} transition={{ type: 'spring', stiffness: 170, damping: 22 }}>
      {children}
    </motion.g>
  )
}

const COLOR: Record<Tono, [string, string]> = {
  normal: ['#FFFFFF', '#8A8F84'],
  resaltado: ['#FBF0D9', '#E2A93B'],
  activo: ['var(--acento-bg)', 'var(--acento)'],
  listo: ['#E6F2EA', '#2F7D4F']
}

// Vista técnica: un nodo con su número.
export function Nodo({ valor, tono }: PropsPersonaje) {
  const [relleno, borde] = COLOR[tono]
  return (
    <g>
      <circle r={22} fill={relleno} stroke={borde} strokeWidth={tono === 'normal' ? 1.5 : 3} />
      <text textAnchor="middle" dy="0.35em" fontSize={17} fontWeight={650} fill="#22261F">{valor}</text>
    </g>
  )
}

export function Texto({ x, y, children, ancla = 'start' }: { x: number; y: number; children: ReactNode; ancla?: 'start' | 'middle' | 'end' }) {
  return <text x={x} y={y} textAnchor={ancla} fontSize={14} fill="#6E7368" fontWeight={500}>{children}</text>
}
