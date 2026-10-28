import type { Algoritmo } from '../algoritmos'
import { CONTENIDO } from '../contenido'

export default function Ficha({ alg }: { alg: Algoritmo<unknown> }) {
  const c = CONTENIDO[alg.id]
  return (
    <div className="ficha">
      <div className="vidrio">
        <section className="bloque">
          <p className="resumen">{c.resumen}</p>
          <div className="etiquetas">{c.etiquetas.map((e) => <span key={e} className="etiqueta">{e}</span>)}</div>
        </section>
        <section className="bloque">
          <h2>Historia</h2>
          {c.historia.map((p, i) => <p key={i}>{p}</p>)}
        </section>
        <section className="bloque">
          <h2>¿Cómo funciona?</h2>
          <ol className="pasos">{c.idea.map((p, i) => <li key={i}>{p}</li>)}</ol>
        </section>
        <section className="bloque fuentes">
          <h2>Fuentes</h2>
          <ul>
            {c.fuentes.map((f) => (
              <li key={f.texto}>{f.texto}{f.url && <> <a href={f.url} target="_blank" rel="noreferrer">{f.url}</a></>}</li>
            ))}
          </ul>
        </section>
      </div>
      <div className="vidrio">
        <section className="bloque">
          <h2>Rendimiento (Big O)</h2>
          <table className="bigo">
            <thead><tr><th>Caso</th><th>Tiempo</th><th>Por qué</th></tr></thead>
            <tbody>
              {c.bigO.map((f) => <tr key={f.caso}><td>{f.caso}</td><td className="o">{f.tiempo}</td><td>{f.nota}</td></tr>)}
              <tr><td>Memoria</td><td colSpan={2}>{c.memoria}</td></tr>
            </tbody>
          </table>
        </section>
        <section className="bloque">
          <h2>Características</h2>
          <ul>{c.caracteristicas.map((t) => <li key={t}>{t}</li>)}</ul>
        </section>
        <section className="bloque dos">
          <div><h2>Ventajas</h2><ul>{c.ventajas.map((t) => <li key={t}>{t}</li>)}</ul></div>
          <div><h2>Desventajas</h2><ul>{c.desventajas.map((t) => <li key={t}>{t}</li>)}</ul></div>
        </section>
        <section className="bloque curiosidad"><h2>¿Sabías que…?</h2><p>{c.curiosidad}</p></section>
      </div>
    </div>
  )
}
