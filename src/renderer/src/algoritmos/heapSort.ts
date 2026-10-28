import type { Accion, Algoritmo } from './tipos'

export interface EstadoMonticulo {
  orden: number[] // el arreglo A: posición i → id; sus hijos están en 2i+1 y 2i+2
  tamano: number // las posiciones desde `tamano` en adelante ya están ordenadas
  resaltados: number[]
}

export const heapSort: Algoritmo<EstadoMonticulo> = {
  id: 'heap',
  nombre: 'Heap Sort',
  pseudocodigo: [
    'Algoritmo HeapSort(A, n)',
    '  Para i ← n/2 − 1 hasta 0 hacer',
    '    Hundir(A, i, n)',
    '  FinPara',
    '  Para fin ← n − 1 hasta 1 hacer',
    '    Intercambiar A[0] y A[fin]',
    '    Hundir(A, 0, fin)',
    '  FinPara',
    'FinAlgoritmo',
    '',
    'Función Hundir(A, i, n)',
    '  mayor ← i',
    '  izq ← 2i + 1 ;  der ← 2i + 2',
    '  Si izq < n y A[izq] > A[mayor] entonces mayor ← izq',
    '  Si der < n y A[der] > A[mayor] entonces mayor ← der',
    '  Si mayor ≠ i entonces',
    '    Intercambiar A[i] y A[mayor]',
    '    Hundir(A, mayor, n)',
    '  FinSi',
    'FinFunción'
  ],

  *pasos(datos, c, animar) {
    const A = datos.map((_, i) => i)
    const n = A.length
    let tamano = n
    let resaltados: number[] = []
    const val = (pos: number) => datos[A[pos]]
    const paso = (linea: number, accion: Accion, narracion: string) =>
      ({ linea, accion, narracion, estado: { orden: [...A], tamano, resaltados } })
    const intercambiar = (a: number, b: number) => {
      ;[A[a], A[b]] = [A[b], A[a]]
      c.movimientos++
    }

    // Hundir iterativo: baja el elemento de `i` mientras algún hijo sea mayor.
    function* hundir(i: number, tam: number) {
      for (;;) {
        let mayor = i
        const izq = 2 * i + 1
        const der = 2 * i + 2
        for (const [hijo, linea, lado] of [[izq, 14, 'izquierdo'], [der, 15, 'derecho']] as const) {
          if (hijo >= tam) continue
          c.comparaciones++
          const gana = val(hijo) > val(mayor)
          resaltados = [A[hijo], A[mayor]]
          if (animar) yield paso(linea, 'comparar', `¿El hijo ${lado} ${val(hijo)} > ${val(mayor)}? ${gana ? 'Sí: ahora él es el mayor.' : 'No.'}`)
          if (gana) mayor = hijo
        }
        if (mayor === i) {
          resaltados = []
          return
        }
        // Se intercambia antes de narrarlo: así el salto ocurre justo cuando el texto lo cuenta.
        const [sube, baja] = [val(mayor), val(i)]
        resaltados = [A[i], A[mayor]]
        intercambiar(i, mayor)
        if (animar) yield paso(17, 'intercambiar', `El ${sube} es mayor que el ${baja}: el ${sube} sube y el ${baja} baja.`)
        i = mayor
      }
    }

    if (animar) yield paso(2, 'inicio', 'Primero se arma el montículo: cada padre debe ser mayor que sus hijos.')
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) yield* hundir(i, n)
    for (let fin = n - 1; fin >= 1; fin--) {
      const cima = val(0)
      resaltados = [A[0], A[fin]]
      intercambiar(0, fin)
      tamano = fin
      if (animar) yield paso(6, 'intercambiar', `El ${cima} estaba en la cima: es el mayor que queda y baja a su lugar final.`)
      resaltados = []
      yield* hundir(0, fin)
    }
    tamano = 0
    if (animar) yield paso(9, 'fin', '¡Listo! Cada vuelta sacó el mayor de la cima y lo dejó en su lugar final.')
    return A.map((id) => datos[id])
  }
}
