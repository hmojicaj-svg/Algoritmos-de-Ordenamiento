import type { Algoritmo } from '../algoritmos'

export default function Ficha({ alg }: { alg: Algoritmo<unknown> }) {
  return <section className="tarjeta bloque"><h2>{alg.nombre}</h2><p>Ficha en construcción.</p></section>
}
