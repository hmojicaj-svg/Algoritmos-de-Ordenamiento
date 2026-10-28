// Cada algoritmo es un generador: animando entrega un Paso por acción; en silencio solo cuenta.
// Así la animación, el pseudocódigo y la gráfica salen del mismo código y no se pueden contradecir.
export type Accion = 'inicio' | 'tomar' | 'comparar' | 'insertar' | 'intercambiar' | 'colocar' | 'dividir' | 'mezclar' | 'fin'

export interface Paso<E> {
  linea: number // 1-based sobre pseudocodigo
  accion: Accion
  narracion: string
  estado: E
}

export interface Contador {
  comparaciones: number
  movimientos: number
}

export interface Algoritmo<E> {
  id: 'tree' | 'heap' | 'merge'
  nombre: string
  pseudocodigo: string[]
  // Los elementos se identifican por su índice en `datos`, para que cada personaje conserve su identidad al moverse.
  pasos(datos: readonly number[], c: Contador, animar: boolean): Generator<Paso<E>, number[]>
}
