import { heapSort } from './heapSort'
import { mergeSort } from './mergeSort'
import type { Algoritmo, Contador, Paso } from './tipos'
import { treeSort } from './treeSort'

export type { Algoritmo, Paso } from './tipos'
export const ALGORITMOS = [treeSort, heapSort, mergeSort] as const

type EstadoDe<A> = A extends Algoritmo<infer E> ? E : never

// Corre el algoritmo sin guardar pasos: para la gráfica comparativa.
export function ejecutar(alg: Algoritmo<unknown>, datos: readonly number[]) {
  const c: Contador = { comparaciones: 0, movimientos: 0 }
  const g = alg.pasos(datos, c, false)
  let r = g.next()
  while (!r.done) r = g.next()
  return { resultado: r.value, ...c }
}

// Guarda todos los pasos: para la animación (datos pequeños).
export function grabar<A extends Algoritmo<unknown>>(alg: A, datos: readonly number[]): Paso<EstadoDe<A>>[] {
  return [...alg.pasos(datos, { comparaciones: 0, movimientos: 0 }, true)] as Paso<EstadoDe<A>>[]
}
