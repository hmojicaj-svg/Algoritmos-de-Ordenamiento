import type { Ruta } from '../App'

export default function Inicio({ ir }: { ir: (r: Ruta) => void }) {
  return <header className="cabecera"><div><h1>Algoritmos de Ordenamiento</h1><p><button className="boton" onClick={() => ir('tree')}>Empezar con Tree Sort</button></p></div></header>
}
