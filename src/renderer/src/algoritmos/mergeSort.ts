import type { Accion, Algoritmo } from './tipos'

export interface EstadoMezcla {
  orden: number[] // ids en el orden en que se ven en pantalla
  cortes: number[] // posiciones donde el grupo está partido (una placa termina antes de cada corte)
  activo: [number, number] | null // tramo que se está dividiendo o mezclando
  colocados: number[] // ya ubicados dentro del tramo que se mezcla
  resaltados: number[]
}

export const mergeSort: Algoritmo<EstadoMezcla> = {
  id: 'merge',
  nombre: 'Merge Sort',
  pseudocodigo: [
    'Algoritmo MergeSort(A, ini, fin)',
    '  Si ini ≥ fin entonces devolver',
    '  medio ← (ini + fin) / 2',
    '  MergeSort(A, ini, medio)',
    '  MergeSort(A, medio + 1, fin)',
    '  Mezclar(A, ini, medio, fin)',
    'FinAlgoritmo',
    '',
    'Función Mezclar(A, ini, medio, fin)',
    '  izq ← A[ini..medio] ;  der ← A[medio+1..fin]',
    '  Mientras queden elementos en izq y en der hacer',
    '    Si izq[i] ≤ der[j] entonces',
    '      A[k] ← izq[i] ;  i ← i + 1',
    '    Sino',
    '      A[k] ← der[j] ;  j ← j + 1',
    '    FinSi',
    '  FinMientras',
    '  Copiar en A lo que sobre de izq o de der',
    'FinFunción'
  ],

  // La recursión solo baja log2(n) niveles, así que aquí sí es segura.
  *pasos(datos, c, animar) {
    const A = datos.map((_, i) => i)
    const cortes = new Set<number>()
    let activo: [number, number] | null = null
    let resaltados: number[] = []
    // Mientras se mezcla, lo pendiente de cada mitad sigue a la vista después de lo ya colocado: la fila siempre es una permutación.
    let mezcla: { k: number; fin: number; L: number[]; R: number[]; i: number; j: number } | null = null
    const vista = () => {
      if (!mezcla) return [...A]
      const { k, fin, L, R, i, j } = mezcla
      return [...A.slice(0, k), ...L.slice(i), ...R.slice(j), ...A.slice(fin + 1)]
    }
    const paso = (linea: number, accion: Accion, narracion: string) => ({
      linea, accion, narracion,
      estado: {
        orden: vista(), cortes: [...cortes].sort((a, b) => a - b), activo, resaltados,
        colocados: mezcla && activo ? A.slice(activo[0], mezcla.k) : []
      }
    })
    const texto = (ini: number, fin: number) => A.slice(ini, fin + 1).map((id) => datos[id]).join(', ')

    function* ordenar(ini: number, fin: number): Generator<ReturnType<typeof paso>> {
      if (ini >= fin) return
      const medio = Math.floor((ini + fin) / 2)
      cortes.add(medio + 1)
      activo = [ini, fin]
      if (animar) yield paso(3, 'dividir', `El grupo [${texto(ini, fin)}] se parte por la mitad.`)
      yield* ordenar(ini, medio)
      yield* ordenar(medio + 1, fin)
      yield* mezclar(ini, medio, fin)
    }

    function* mezclar(ini: number, medio: number, fin: number) {
      const L = A.slice(ini, medio + 1)
      const R = A.slice(medio + 1, fin + 1)
      mezcla = { k: ini, fin, L, R, i: 0, j: 0 }
      activo = [ini, fin]
      resaltados = []
      if (animar) yield paso(10, 'mezclar', `Se juntan [${L.map((id) => datos[id]).join(', ')}] y [${R.map((id) => datos[id]).join(', ')}], que ya están ordenados.`)
      while (mezcla.i < L.length && mezcla.j < R.length) {
        const a = L[mezcla.i]
        const b = R[mezcla.j]
        const tomaIzq = datos[a] <= datos[b] // con ≤ los iguales de la izquierda pasan primero: es estable
        c.comparaciones++
        resaltados = [a, b]
        if (animar) yield paso(12, 'comparar', `¿${datos[a]} ≤ ${datos[b]}? ${tomaIzq ? `Sí: pasa el ${datos[a]}.` : `No: pasa el ${datos[b]}.`}`)
        A[mezcla.k++] = tomaIzq ? L[mezcla.i++] : R[mezcla.j++]
        c.movimientos++
        resaltados = [A[mezcla.k - 1]]
        if (animar) yield paso(tomaIzq ? 13 : 15, 'colocar', `El ${datos[A[mezcla.k - 1]]} toma el siguiente lugar de la fila.`)
      }
      const sobran = [...L.slice(mezcla.i), ...R.slice(mezcla.j)]
      for (const id of sobran) {
        A[mezcla.k++] = id
        c.movimientos++
      }
      cortes.delete(medio + 1)
      resaltados = sobran
      if (animar) yield paso(18, 'colocar', sobran.length ? `Los que sobran (${sobran.map((id) => datos[id]).join(', ')}) ya estaban en orden: pasan directo.` : 'No sobra nadie.')
      mezcla = null
      activo = null
      resaltados = []
    }

    if (animar) yield paso(1, 'inicio', 'Divide y vencerás: se parte el grupo hasta tener grupos de uno, que ya están ordenados.')
    yield* ordenar(0, A.length - 1)
    if (animar) yield paso(7, 'fin', '¡Listo! Las mitades ordenadas se fueron uniendo hasta formar un solo grupo ordenado.')
    return A.map((id) => datos[id])
  }
}
