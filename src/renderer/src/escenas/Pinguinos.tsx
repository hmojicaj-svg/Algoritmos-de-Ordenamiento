import { ALTO, ANCHO, type PropsPersonaje } from './comun'
import type { PropsPlaca } from './EscenaMezcla'

// Bufanda de un color por número, como en el video: así se sigue a cada pingüino.
const bufanda = (v: number) => `hsl(${(v * 53) % 360} 62% 50%)`

export function Pinguino({ valor, tono }: PropsPersonaje) {
  return (
    <g>
      {tono === 'resaltado' && <ellipse cy={-2} rx={26} ry={32} fill="#FBE7A8" opacity={0.9} />}
      <ellipse cx={-7} cy={27} rx={7} ry={3.5} fill="#F0A33A" />
      <ellipse cx={7} cy={27} rx={7} ry={3.5} fill="#F0A33A" />
      <ellipse cy={2} rx={17} ry={25} fill="#23262B" />
      <ellipse cy={7} rx={12} ry={18} fill="#F7F5EF" />
      <circle cy={-17} r={12} fill="#23262B" />
      <circle cx={-4.5} cy={-19} r={3.2} fill="#FFFFFF" />
      <circle cx={4.5} cy={-19} r={3.2} fill="#FFFFFF" />
      <circle cx={-4} cy={-19} r={1.6} fill="#111" />
      <circle cx={5} cy={-19} r={1.6} fill="#111" />
      <path d="M-3.5 -14 L3.5 -14 L0 -9 Z" fill="#F0A33A" />
      <rect x={-13} y={-8} width={26} height={6} rx={3} fill={bufanda(valor)} />
      <rect x={6} y={-6} width={5} height={11} rx={2} fill={bufanda(valor)} />
      <text y={10} textAnchor="middle" dy="0.35em" fontSize={valor > 9 ? 12 : 14} fontWeight={750} fill="#23262B">{valor}</text>
      {tono === 'listo' && <path d="M-6 31 l4 4 8 -8" stroke="#2F7D4F" strokeWidth={2.5} fill="none" strokeLinecap="round" />}
    </g>
  )
}

export function PlacaHielo({ x, ancho, y, activa }: PropsPlaca) {
  return (
    <g>
      <rect x={x - 4} y={y + 30} width={ancho + 8} height={14} rx={7} fill="#9CC3D9" />
      <rect x={x - 4} y={y + 24} width={ancho + 8} height={14} rx={7} fill={activa ? '#FFFFFF' : '#EAF4F8'} stroke={activa ? '#2A6496' : '#C4DCE8'} strokeWidth={activa ? 2 : 1} />
    </g>
  )
}

// Cielo de tarde, montañas lejanas, un iglú y el mar donde flotan las placas.
export function FondoMar() {
  return (
    <g>
      <defs>
        <linearGradient id="tarde" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B9B3D9" />
          <stop offset="1" stopColor="#E8DCE6" />
        </linearGradient>
      </defs>
      <rect width={ANCHO} height={ALTO} fill="url(#tarde)" />
      <path d={`M0 120 L120 60 L230 120 L360 50 L500 120 L640 70 L780 120 L900 65 L${ANCHO} 110 L${ANCHO} 140 L0 140 Z`} fill="#8E87B8" opacity={0.6} />
      <path d={`M${ANCHO - 140} 140 a46 40 0 0 1 92 0 Z`} fill="#F4F2F7" />
      <path d={`M${ANCHO - 104} 140 a10 12 0 0 1 20 0 Z`} fill="#5D5878" />
      <rect y={140} width={ANCHO} height={ALTO - 140} fill="#6F9FC0" />
      {[180, 260, 320, 420, 480].map((y, i) => (
        <path key={y} d={`M${60 + i * 170} ${y} q18 -6 36 0 t36 0`} stroke="#A9CBE0" strokeWidth={2} fill="none" opacity={0.7} />
      ))}
    </g>
  )
}
