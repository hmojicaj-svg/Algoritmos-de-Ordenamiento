import { describe, expect, it } from 'vitest'
import { ALGORITMOS, ejecutar, grabar } from '.'
import { heapSort } from './heapSort'
import { mergeSort } from './mergeSort'
import { treeSort } from './treeSort'

const aleatorios = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 1000))
const ordenados = (n: number) => Array.from({ length: n }, (_, i) => i)
const casos: [string, number[]][] = [
  ['vacío', []],
  ['un elemento', [5]],
  ['aleatorios', aleatorios(300)],
  ['ya ordenados', ordenados(300)],
  ['al revés', ordenados(300).reverse()],
  ['con repetidos', [3, 1, 3, 2, 1, 3, 2, 2, 1]]
]

describe.each(ALGORITMOS)('$nombre', (alg) => {
  it.each(casos)('ordena %s', (_, datos) => {
    expect(ejecutar(alg, datos).resultado).toEqual([...datos].sort((a, b) => a - b))
  })

  it('no modifica los datos de entrada', () => {
    const datos = [4, 2, 3, 1]
    ejecutar(alg, datos)
    expect(datos).toEqual([4, 2, 3, 1])
  })

  it('la animación termina ordenada y solo señala líneas que existen', () => {
    const pasos = grabar(alg, [7, 4, 2, 1, 8, 3, 6, 5])
    expect(pasos[0].accion).toBe('inicio')
    expect(pasos.at(-1)!.accion).toBe('fin')
    for (const p of pasos) expect(alg.pseudocodigo[p.linea - 1]?.trim()).toBeTruthy()
  })

  it('cuenta lo mismo animando que en silencio', () => {
    const datos = [7, 4, 2, 1, 8, 3, 6, 5]
    const silencio = ejecutar(alg, datos)
    const pasos = grabar(alg, datos)
    expect(pasos.filter((p) => p.accion === 'comparar')).toHaveLength(silencio.comparaciones)
  })
})

describe('lo que se ve en pantalla', () => {
  it.each([heapSort, mergeSort])('$nombre: en cada paso cada personaje aparece una sola vez', (alg) => {
    const datos = [7, 4, 2, 1, 8, 3, 6, 5, 9]
    for (const p of grabar(alg, datos)) expect([...p.estado.orden].sort((a, b) => a - b)).toEqual(datos.map((_, i) => i))
  })
})

describe('complejidad', () => {
  it('Tree Sort con datos ordenados degenera a n(n-1)/2 comparaciones sin desbordar la pila', () => {
    const n = 5000
    expect(ejecutar(treeSort, ordenados(n)).comparaciones).toBe((n * (n - 1)) / 2)
  })

  it.each(ALGORITMOS)('$nombre con datos aleatorios se mantiene en O(n log n)', (alg) => {
    const n = 2048
    expect(ejecutar(alg, aleatorios(n)).comparaciones).toBeLessThan(3 * n * Math.log2(n))
  })
})
