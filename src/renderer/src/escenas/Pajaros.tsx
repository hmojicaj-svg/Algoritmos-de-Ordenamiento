import { motion } from 'motion/react'
import { ALTO, ANCHO, type PropsPersonaje } from './comun'
import type { Rama } from './EscenaArbol'

// Cada número tiene su color de plumaje, así se reconoce al mismo pájaro mientras se mueve.
const plumaje = (v: number) => `hsl(${(v * 47) % 360} 58% 52%)`
const sombra = (v: number) => `hsl(${(v * 47) % 360} 50% 38%)`

export function Pajaro({ valor, tono }: PropsPersonaje) {
  const volando = tono === 'activo'
  return (
    <g>
      {tono === 'resaltado' && <circle r={30} fill="#FBE7A8" opacity={0.85} />}
      {tono === 'listo' && <circle r={27} fill="#FFFFFF" opacity={0.6} />}
      {!volando && (
        <g stroke="#6B4A2B" strokeWidth={2.2} strokeLinecap="round">
          <line x1={-4} y1={14} x2={-5} y2={22} />
          <line x1={5} y1={14} x2={6} y2={22} />
        </g>
      )}
      <path d="M-17 0 L-31 -9 L-28 8 Z" fill={sombra(valor)} />
      <ellipse rx={20} ry={16} fill={plumaje(valor)} />
      <circle cx={13} cy={-12} r={10} fill={plumaje(valor)} />
      <circle cx={16} cy={-14} r={2.4} fill="#1D1D1B" />
      <path d="M22 -13 L31 -10 L22 -7 Z" fill="#F0A33A" />
      <motion.path
        d="M-8 -3 Q2 -20 14 -4 Q2 2 -8 -3 Z" fill={sombra(valor)}
        style={{ originX: '0px', originY: '0px' }}
        animate={volando ? { rotate: [0, -28, 0] } : { rotate: 0 }}
        transition={volando ? { duration: 0.35, repeat: Infinity } : { duration: 0.2 }}
      />
      <circle cx={-2} cy={6} r={10} fill="#FFFFFF" />
      <text x={-2} y={6} textAnchor="middle" dy="0.35em" fontSize={valor > 9 ? 11 : 13} fontWeight={700} fill="#22261F">{valor}</text>
    </g>
  )
}

const CABLE = 470

// Cielo, tronco, ramas de madera con hojas en cada nodo y el cable donde se posan ya ordenados.
export function FondoArbol({ ramas }: { ramas: Rama[] }) {
  const raiz = ramas[0] ? { x: ramas[0][0], y: ramas[0][1] } : null
  const hojas = new Map<string, [number, number]>()
  for (const [x1, y1, x2, y2] of ramas) {
    hojas.set(`${x1},${y1}`, [x1, y1])
    hojas.set(`${x2},${y2}`, [x2, y2])
  }
  return (
    <g>
      <defs>
        <linearGradient id="cielo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#CFE6F2" />
          <stop offset="1" stopColor="#F3EEDC" />
        </linearGradient>
      </defs>
      <rect width={ANCHO} height={ALTO} fill="url(#cielo)" />
      <rect y={ALTO - 30} width={ANCHO} height={30} fill="#B9CF92" />
      {raiz && <path d={`M${raiz.x - 16} ${ALTO - 30} L${raiz.x - 7} ${raiz.y} L${raiz.x + 7} ${raiz.y} L${raiz.x + 16} ${ALTO - 30} Z`} fill="#7A5432" />}
      {[...hojas.values()].map(([x, y]) => <ellipse key={`${x},${y}`} cx={x} cy={y + 6} rx={34} ry={20} fill="#7FB069" opacity={0.75} />)}
      {ramas.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1 + 18} x2={x2} y2={y2 + 18} stroke="#7A5432" strokeWidth={7} strokeLinecap="round" />)}
      <rect x={14} y={CABLE - 40} width={8} height={ALTO} fill="#8C8C84" />
      <rect x={ANCHO - 22} y={CABLE - 40} width={8} height={ALTO} fill="#8C8C84" />
      <path d={`M18 ${CABLE + 20} Q${ANCHO / 2} ${CABLE + 30} ${ANCHO - 18} ${CABLE + 20}`} stroke="#3B3B36" strokeWidth={2} fill="none" />
    </g>
  )
}
