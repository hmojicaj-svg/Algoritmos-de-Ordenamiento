import { useState } from 'react'
import { RefreshCw } from 'lucide-react'
import { ALGORITMOS, ejecutar } from '../algoritmos'

const TAMANOS = [100, 500, 1000, 2000, 4000, 6000, 8000]
const CORRIDAS = 3
const aleatorios = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 1_000_000))
const fmt = (v: number) => Math.round(v).toLocaleString('es-CO')

// Promedio de comparaciones de cada algoritmo con datos aleatorios, para cada tamaño.
function medir() {
  return ALGORITMOS.map((alg) => ({
    alg,
    puntos: TAMANOS.map((n) => {
      let suma = 0
      for (let r = 0; r < CORRIDAS; r++) suma += ejecutar(alg, aleatorios(n)).comparaciones
      return { n, c: suma / CORRIDAS }
    })
  }))
}

const W = 900, H = 420, IZQ = 84, DER = 24, ARR = 20, ABA = 52

export default function Comparar() {
  const [series, setSeries] = useState(medir)
  const max = Math.max(...series.flatMap((s) => s.puntos.map((p) => p.c)))
  const techo = Math.ceil(max / 50_000) * 50_000
  const x = (n: number) => IZQ + (n / TAMANOS.at(-1)!) * (W - IZQ - DER)
  const y = (c: number) => H - ABA - (c / techo) * (H - ARR - ABA)
  const marcas = Array.from({ length: 6 }, (_, i) => (techo / 5) * i)
  const ranking = [...series].sort((a, b) => a.puntos.at(-1)!.c - b.puntos.at(-1)!.c)

  return (
    <>
      <header className="cabecera">
        <div>
          <h1>Comparar los tres algoritmos</h1>
          <p>Comparaciones que hace cada uno para ordenar números aleatorios, según cuántos números hay.</p>
        </div>
        <button className="boton" onClick={() => setSeries(medir())}><RefreshCw />Medir de nuevo</button>
      </header>
      <section className="tarjeta grafica">
        <div className="leyenda">
          {series.map(({ alg }) => <span key={alg.id}><i style={{ background: `var(--${alg.id})` }} />{alg.nombre}</span>)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Gráfica de líneas: comparaciones según la cantidad de datos">
          {marcas.map((m) => (
            <g key={m}>
              <line x1={IZQ} x2={W - DER} y1={y(m)} y2={y(m)} stroke="#E3DED3" />
              <text x={IZQ - 10} y={y(m)} textAnchor="end" dy="0.35em" fontSize={12} fill="#6E7368">{fmt(m)}</text>
            </g>
          ))}
          {TAMANOS.map((n) => (
            <text key={n} x={x(n)} y={H - ABA + 22} textAnchor="middle" fontSize={12} fill="#6E7368">{fmt(n)}</text>
          ))}
          <text x={(IZQ + W - DER) / 2} y={H - 8} textAnchor="middle" fontSize={13} fill="#5C6157">Cantidad de números (n)</text>
          <text transform={`translate(16 ${(ARR + H - ABA) / 2}) rotate(-90)`} textAnchor="middle" fontSize={13} fill="#5C6157">Comparaciones</text>
          {series.map(({ alg, puntos }) => (
            <g key={alg.id}>
              <polyline points={puntos.map((p) => `${x(p.n)},${y(p.c)}`).join(' ')} fill="none" stroke={`var(--${alg.id})`} strokeWidth={3} strokeLinejoin="round" />
              {puntos.map((p) => (
                <circle key={p.n} cx={x(p.n)} cy={y(p.c)} r={4.5} fill="#fff" stroke={`var(--${alg.id})`} strokeWidth={2.5}>
                  <title>{`${alg.nombre}: ${fmt(p.c)} comparaciones con ${fmt(p.n)} números`}</title>
                </circle>
              ))}
            </g>
          ))}
        </svg>
      </section>
      <div className="rejilla-dos">
        <section className="tarjeta bloque">
          <h2>¿Qué muestra?</h2>
          <p>Las tres curvas crecen casi en línea recta, apenas curvadas hacia arriba: esa es la forma de <b>n log n</b>, el caso promedio de los tres algoritmos con datos aleatorios.</p>
          <p>Con 8.000 números aleatorios, <b>{ranking[0].alg.nombre}</b> hizo menos comparaciones y <b>{ranking[2].alg.nombre}</b> más. Los tres están en la misma familia O(n log n): la diferencia es el número que acompaña a n log n.</p>
          <p>Ojo: con datos <b>ya ordenados</b> Tree Sort cambia por completo y sube a O(n²). Pruébalo en su animación con el botón «Ya ordenados».</p>
        </section>
        <section className="tarjeta bloque">
          <h2>Valores medidos</h2>
          <table className="bigo">
            <thead><tr><th>n</th>{series.map(({ alg }) => <th key={alg.id}>{alg.nombre}</th>)}</tr></thead>
            <tbody>
              {TAMANOS.map((n, k) => <tr key={n}><td>{fmt(n)}</td>{series.map(({ alg, puntos }) => <td key={alg.id} className="num">{fmt(puntos[k].c)}</td>)}</tr>)}
            </tbody>
          </table>
          <p className="fuentes">Promedio de {CORRIDAS} corridas por tamaño, con números aleatorios nuevos cada vez.</p>
        </section>
      </div>
    </>
  )
}
