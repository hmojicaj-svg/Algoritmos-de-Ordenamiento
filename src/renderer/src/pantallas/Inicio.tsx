import type { Ruta } from '../App'
import { ALGORITMOS } from '../algoritmos'
import { CONTENIDO } from '../contenido'

const PERSONAJE = { tree: '🐦 Pájaros en un árbol', heap: '🐐 Cabras en la montaña', merge: '🐧 Pingüinos en el hielo' } as const

export default function Inicio({ ir }: { ir: (r: Ruta) => void }) {
  return (
    <div className="inicio">
      <header className="cabecera">
        <div>
          <h1>Ordenar con árboles</h1>
          <p>Tres algoritmos de ordenamiento que usan árboles, explicados paso a paso con animaciones.</p>
        </div>
      </header>
      <div className="rejilla">
        {ALGORITMOS.map((a) => (
          <button key={a.id} className="tarjeta-alg" style={{ borderTopColor: `var(--${a.id})` }} onClick={() => ir(a.id)}>
            <span className="personaje">{PERSONAJE[a.id]}</span>
            <h2>{a.nombre}</h2>
            <p>{CONTENIDO[a.id].resumen}</p>
            <span className="ir" style={{ color: `var(--${a.id})` }}>Ver animación →</span>
          </button>
        ))}
      </div>
      <div className="rejilla">
        <section className="tarjeta bloque">
          <h2>¿Qué es ordenar?</h2>
          <p>Es poner una lista en orden, por ejemplo de menor a mayor. Los computadores lo hacen todo el tiempo: para buscar más rápido, mostrar resultados o encontrar repetidos.</p>
        </section>
        <section className="tarjeta bloque">
          <h2>¿Qué es un árbol?</h2>
          <p>Una forma de organizar datos en nodos conectados: arriba está la <b>raíz</b> y cada nodo puede tener <b>hijos</b>. En un árbol binario, cada nodo tiene como máximo dos: izquierdo y derecho.</p>
        </section>
        <section className="tarjeta bloque">
          <h2>¿Qué es Big O?</h2>
          <p>Una forma de decir cuánto crece el trabajo cuando crecen los datos. <b>O(n log n)</b> crece un poco más que los datos; <b>O(n²)</b> crece mucho más: el doble de datos es cuatro veces el trabajo.</p>
        </section>
      </div>
      <p className="ayuda">En cada animación: <b>Espacio</b> reproduce o pausa, y las <b>flechas ← →</b> avanzan o retroceden un paso.</p>
    </div>
  )
}
