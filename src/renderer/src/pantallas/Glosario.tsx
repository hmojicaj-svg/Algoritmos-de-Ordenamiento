const TERMINOS: [string, string][] = [
  ['Algoritmo', 'Una lista de pasos precisos para resolver un problema.'],
  ['Árbol binario', 'Estructura de nodos donde cada nodo tiene como máximo dos hijos: izquierdo y derecho.'],
  ['Árbol binario de búsqueda', 'Árbol binario donde todo lo de la izquierda de un nodo es menor que él y todo lo de la derecha es mayor o igual.'],
  ['Big O', 'Notación que describe cómo crece el tiempo (o la memoria) de un algoritmo cuando crece la cantidad de datos n.'],
  ['Comparación', 'Preguntar cuál de dos elementos es menor. Los tres algoritmos ordenan comparando.'],
  ['Divide y vencerás', 'Estrategia que parte un problema en problemas más pequeños, los resuelve y junta los resultados.'],
  ['En sitio', 'Un algoritmo que ordena dentro del mismo arreglo, usando muy poca memoria extra.'],
  ['Estable', 'Un ordenamiento que deja a los elementos iguales en el mismo orden en que llegaron.'],
  ['Hoja', 'Nodo que no tiene hijos.'],
  ['Hundir (sift-down)', 'En un montículo, bajar un elemento intercambiándolo con su hijo mayor hasta que ningún hijo lo supere.'],
  ['Mezclar (merge)', 'Unir dos listas ya ordenadas en una sola lista ordenada, tomando cada vez el menor de los dos primeros.'],
  ['Montículo (heap)', 'Árbol binario completo donde cada padre es mayor (o igual) que sus hijos. Se guarda dentro de un arreglo.'],
  ['Nodo', 'Cada elemento de un árbol.'],
  ['Raíz', 'El nodo de arriba del árbol, el único que no tiene padre.'],
  ['Recorrido en orden', 'Visitar un árbol en este orden: subárbol izquierdo, nodo, subárbol derecho. En un árbol de búsqueda entrega los datos ordenados.'],
  ['Recursión', 'Cuando una función se usa a sí misma para resolver una versión más pequeña del problema.']
]

export default function Glosario() {
  return (
    <>
      <header className="cabecera"><div><h1>Glosario</h1><p>Las palabras que aparecen en las fichas y animaciones, explicadas sin rodeos.</p></div></header>
      <dl className="tarjeta glosario">
        {TERMINOS.map(([t, d]) => <div key={t}><dt>{t}</dt><dd>{d}</dd></div>)}
      </dl>
    </>
  )
}
