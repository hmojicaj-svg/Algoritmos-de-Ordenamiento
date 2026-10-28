import type { Accion, Algoritmo } from './tipos'

export interface NodoArbol {
  id: number
  padre: number | null
  lado: 'izq' | 'der' | null
}

export interface EstadoArbol {
  nodos: NodoArbol[] // en orden de llegada al árbol
  pendientes: number[] // esperan su turno
  salida: number[] // ya ordenados
  volando: number | null // el que se está insertando
  actual: number | null // nodo con el que se compara o que se visita
}

export const treeSort: Algoritmo<EstadoArbol> = {
  id: 'tree',
  nombre: 'Tree Sort',
  pseudocodigo: [
    'Algoritmo TreeSort(lista)',
    '  raiz ← nulo',
    '  Para cada x en lista hacer',
    '    raiz ← Insertar(raiz, x)',
    '  FinPara',
    '  RecorrerEnOrden(raiz)',
    'FinAlgoritmo',
    '',
    'Función Insertar(nodo, x)',
    '  Si nodo = nulo entonces devolver NuevoNodo(x)',
    '  Si x < nodo.valor entonces',
    '    nodo.izq ← Insertar(nodo.izq, x)',
    '  Sino',
    '    nodo.der ← Insertar(nodo.der, x)',
    '  FinSi',
    '  devolver nodo',
    'FinFunción',
    '',
    'Función RecorrerEnOrden(nodo)',
    '  Si nodo ≠ nulo entonces',
    '    RecorrerEnOrden(nodo.izq)',
    '    Escribir nodo.valor',
    '    RecorrerEnOrden(nodo.der)',
    '  FinSi',
    'FinFunción'
  ],

  // Inserción y recorrido iterativos: con datos ya ordenados el árbol es una sola rama de n niveles y la recursión desbordaría la pila.
  *pasos(datos, c, animar) {
    const n = datos.length
    const izq: (number | null)[] = Array(n).fill(null)
    const der: (number | null)[] = Array(n).fill(null)
    const nodos: NodoArbol[] = []
    const pendientes = datos.map((_, i) => i)
    const salida: number[] = []
    let raiz: number | null = null
    let volando: number | null = null
    let actual: number | null = null
    const paso = (linea: number, accion: Accion, narracion: string) =>
      ({ linea, accion, narracion, estado: { nodos: [...nodos], pendientes: [...pendientes], salida: [...salida], volando, actual } })

    if (animar) yield paso(2, 'inicio', 'El árbol empieza vacío. Cada número entrará uno por uno.')
    while (pendientes.length) {
      const id = pendientes.shift()!
      const x = datos[id]
      volando = id
      actual = null
      if (animar) yield paso(4, 'tomar', `Llega el ${x}: empieza a bajar desde la raíz.`)
      if (raiz === null) {
        raiz = id
        nodos.push({ id, padre: null, lado: null })
        c.movimientos++
        volando = null
        if (animar) yield paso(10, 'insertar', `El árbol está vacío: el ${x} se convierte en la raíz.`)
        continue
      }
      let nodo = raiz
      for (;;) {
        const v = datos[nodo]
        const menor = x < v // los iguales van a la derecha: así se conserva su orden de llegada (estable)
        c.comparaciones++
        actual = nodo
        if (animar) yield paso(11, 'comparar', `¿${x} < ${v}? ${menor ? 'Sí: baja por la izquierda.' : 'No: baja por la derecha.'}`)
        const hijos = menor ? izq : der
        const sig = hijos[nodo]
        if (sig === null) {
          hijos[nodo] = id
          nodos.push({ id, padre: nodo, lado: menor ? 'izq' : 'der' })
          c.movimientos++
          volando = null
          if (animar) yield paso(menor ? 12 : 14, 'insertar', `Rama libre: el ${x} queda a la ${menor ? 'izquierda' : 'derecha'} del ${v}.`)
          break
        }
        nodo = sig
      }
    }

    // Recorrido en orden: izquierda, nodo, derecha.
    if (animar) yield paso(6, 'inicio', 'Todos están en el árbol. Ahora se recorre en orden: izquierda, nodo, derecha.')
    const pila: number[] = []
    let nodo = raiz
    while (pila.length || nodo !== null) {
      while (nodo !== null) {
        pila.push(nodo)
        nodo = izq[nodo]
      }
      nodo = pila.pop()!
      salida.push(nodo)
      c.movimientos++
      actual = nodo
      if (animar) yield paso(22, 'colocar', `No queda nadie más pequeño a su izquierda: el ${datos[nodo]} pasa a la fila ordenada.`)
      nodo = der[nodo]
    }
    actual = null
    if (animar) yield paso(7, 'fin', '¡Listo! El recorrido en orden entrega todos los números ordenados.')
    return salida.map((id) => datos[id])
  }
}
