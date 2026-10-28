// Contenido de las fichas. Cada dato histórico y de complejidad tiene su fuente en `fuentes` (sin Wikipedia).
export interface Fuente { texto: string; url?: string }
export interface ContenidoAlgoritmo {
  resumen: string
  etiquetas: string[]
  historia: string[]
  idea: string[]
  bigO: { caso: string; tiempo: string; nota: string }[]
  memoria: string
  caracteristicas: string[]
  ventajas: string[]
  desventajas: string[]
  curiosidad: string
  fuentes: Fuente[]
}

const CORMEN = 'T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. Introduction to Algorithms, 4.ª ed. MIT Press, 2022.'

export const CONTENIDO: Record<'tree' | 'heap' | 'merge', ContenidoAlgoritmo> = {
  tree: {
    resumen: 'Mete los números uno por uno en un árbol binario de búsqueda y luego lo recorre en orden: izquierda, nodo, derecha. Lo que sale ya está ordenado.',
    etiquetas: ['Árbol binario de búsqueda', 'Por comparación', 'Estable (en esta versión)'],
    historia: [
      'El Tree Sort no tiene un único inventor: es la consecuencia directa del árbol binario de búsqueda. Si los datos se guardan en un árbol donde lo menor va a la izquierda y lo mayor a la derecha, basta con recorrerlo en orden para obtenerlos ordenados.',
      'Ese árbol aparece en los primeros trabajos sobre cómo organizar datos en computadores. En 1960, P. F. Windley publicó en The Computer Journal «Trees, forests and rearranging», sobre reorganizar datos usando árboles, y en 1962 Thomas N. Hibbard estudió en el Journal of the ACM las propiedades de estos árboles «con aplicaciones a la búsqueda y el ordenamiento».',
      'Hoy se enseña como un ejercicio clásico: el libro de Cormen et al. (Introduction to Algorithms) propone ordenar construyendo el árbol e imprimiéndolo con un recorrido en orden, y pide analizar su mejor y su peor caso.'
    ],
    idea: [
      'El primer número es la raíz del árbol.',
      'Cada número nuevo baja desde la raíz: si es menor que el nodo, va a la izquierda; si no, a la derecha. Se queda en la primera rama libre.',
      'Cuando todos están en el árbol, se recorre en orden (primero todo lo de la izquierda, luego el nodo, luego lo de la derecha). Ese recorrido entrega los números de menor a mayor.'
    ],
    bigO: [
      { caso: 'Mejor', tiempo: 'O(n log n)', nota: 'El árbol queda equilibrado: cada inserción baja unos log n niveles.' },
      { caso: 'Promedio', tiempo: 'O(n log n)', nota: 'Con datos en orden aleatorio la altura esperada del árbol es O(log n).' },
      { caso: 'Peor', tiempo: 'O(n²)', nota: 'Con datos ya ordenados (o al revés) el árbol es una sola rama de n niveles.' }
    ],
    memoria: 'O(n) extra: un nodo por cada número.',
    caracteristicas: [
      'Compara elementos: es un ordenamiento por comparación.',
      'No es «en sitio»: necesita construir el árbol aparte.',
      'Estable en esta versión: los iguales van a la derecha y conservan su orden de llegada.',
      'Si se usa un árbol que se equilibra solo (por ejemplo, rojo-negro), el peor caso baja a O(n log n).'
    ],
    ventajas: [
      'Muy fácil de entender y de dibujar.',
      'Sirve para datos que llegan de a poco: el árbol siempre está listo para recorrerse en orden.',
      'El árbol queda construido y se puede reutilizar para buscar.'
    ],
    desventajas: [
      'Con datos casi ordenados se vuelve muy lento (O(n²)).',
      'Usa memoria extra para los nodos.',
      'En la práctica es más lento que Merge Sort o Heap Sort por el manejo de punteros.'
    ],
    curiosidad: 'Prueba el botón «Ya ordenados» en la animación: el árbol crece como una sola rama torcida. Ese es el peor caso O(n²) que se ve en la tabla.',
    fuentes: [
      { texto: 'P. F. Windley. «Trees, forests and rearranging». The Computer Journal, 3(2):84–88, 1960.', url: 'https://doi.org/10.1093/comjnl/3.2.84' },
      { texto: 'T. N. Hibbard. «Some combinatorial properties of certain trees with applications to searching and sorting». Journal of the ACM, 9(1):13–28, 1962.', url: 'https://doi.org/10.1145/321105.321108' },
      { texto: `${CORMEN} Cap. 12 (árboles binarios de búsqueda, ejercicio 12.3-3) y cap. 13 (árboles rojo-negro).` }
    ]
  },
  heap: {
    resumen: 'Organiza el arreglo como un montículo (un árbol donde cada padre es mayor que sus hijos), saca el mayor de la cima, lo deja al final y repite.',
    etiquetas: ['Montículo binario', 'Por comparación', 'En sitio'],
    historia: [
      'Heap Sort fue publicado en junio de 1964 por J. W. J. Williams en Communications of the ACM, como «Algorithm 232: Heapsort». En ese trabajo aparece también el montículo binario como estructura de datos.',
      'Ese mismo año, en diciembre de 1964, Robert W. Floyd publicó «Algorithm 245: Treesort 3», una implementación completa y eficiente que, según el diccionario de algoritmos del NIST, es casi idéntica a la que se usa hoy.',
      'El nombre de Floyd muestra el parentesco con este proyecto: Heap Sort también es un ordenamiento con árboles, solo que el árbol vive escondido dentro del arreglo.'
    ],
    idea: [
      'El arreglo se lee como un árbol: los hijos de la posición i están en 2i + 1 y 2i + 2.',
      'Primero se arma el montículo: cada padre se «hunde» mientras algún hijo sea mayor.',
      'La cima siempre tiene el mayor. Se intercambia con el último lugar libre, que ya queda ordenado, y la nueva cima se hunde hasta su sitio.',
      'Se repite hasta que el montículo queda vacío.'
    ],
    bigO: [
      { caso: 'Mejor', tiempo: 'O(n log n)', nota: 'Cada una de las n extracciones hunde la cima hasta log n niveles.' },
      { caso: 'Promedio', tiempo: 'O(n log n)', nota: 'No depende del orden de entrada.' },
      { caso: 'Peor', tiempo: 'O(n log n)', nota: 'Garantizado: el montículo siempre tiene altura log n.' }
    ],
    memoria: 'O(1) extra: ordena dentro del mismo arreglo.',
    caracteristicas: [
      'Ordenamiento por comparación.',
      'En sitio: solo intercambia elementos del propio arreglo.',
      'No es estable: dos números iguales pueden cambiar su orden relativo.',
      'Armar el montículo inicial cuesta O(n).'
    ],
    ventajas: [
      'Garantiza O(n log n) incluso en el peor caso.',
      'Casi no usa memoria extra.',
      'El montículo sirve también para colas de prioridad.'
    ],
    desventajas: [
      'No es estable.',
      'Salta mucho por el arreglo, lo que aprovecha mal la memoria caché.',
      'En la práctica suele ser algo más lento que Merge Sort o Quicksort bien implementados.'
    ],
    curiosidad: 'En la animación, la cabra de la cima es siempre la mayor de la montaña. Cuando baja al valle ya está en su lugar definitivo.',
    fuentes: [
      { texto: 'J. W. J. Williams. «Algorithm 232: Heapsort». Communications of the ACM, 7(6):347–348, 1964.' },
      { texto: 'R. W. Floyd. «Algorithm 245: Treesort 3». Communications of the ACM, 7(12):701, 1964.' },
      { texto: 'P. E. Black. «heapsort». Dictionary of Algorithms and Data Structures, NIST.', url: 'https://xlinux.nist.gov/dads/HTML/heapSort.html' },
      { texto: `${CORMEN} Cap. 6 (Heapsort).` }
    ]
  },
  merge: {
    resumen: 'Divide el grupo por la mitad una y otra vez hasta tener grupos de uno, y luego los mezcla de dos en dos, siempre en orden.',
    etiquetas: ['Divide y vencerás', 'Por comparación', 'Estable'],
    historia: [
      'Merge Sort fue ideado por John von Neumann en 1945, mientras se diseñaba la computadora EDVAC. Su programa de ordenamiento es probablemente el programa más antiguo que se conserva escrito para una computadora de programa almacenado.',
      'Donald E. Knuth estudió ese manuscrito en 1970 en el artículo «Von Neumann\'s First Computer Program» (ACM Computing Surveys). Allí explica que von Neumann eligió un problema de ordenamiento para comprobar si el repertorio de instrucciones de la máquina podía controlar procesos complejos.',
      'Su árbol no se ve en memoria pero está ahí: es el árbol de llamadas recursivas, con log n niveles de divisiones.'
    ],
    idea: [
      'Si el grupo tiene un solo elemento, ya está ordenado.',
      'Si no, se parte por la mitad y se ordena cada mitad con el mismo método.',
      'Se mezclan las dos mitades ordenadas: se comparan sus primeros elementos y pasa el menor, hasta vaciar una; lo que sobra de la otra pasa directo.'
    ],
    bigO: [
      { caso: 'Mejor', tiempo: 'O(n log n)', nota: 'Siempre divide en log n niveles y en cada nivel mezcla n elementos.' },
      { caso: 'Promedio', tiempo: 'O(n log n)', nota: 'No depende del orden de entrada.' },
      { caso: 'Peor', tiempo: 'O(n log n)', nota: 'Garantizado.' }
    ],
    memoria: 'O(n) extra: la mezcla usa un espacio auxiliar.',
    caracteristicas: [
      'Ordenamiento por comparación de tipo «divide y vencerás».',
      'Estable: con «≤», ante un empate pasa primero el de la izquierda.',
      'No es en sitio en su versión clásica: necesita memoria extra para mezclar.',
      'Funciona muy bien con listas enlazadas y datos en disco o cinta.'
    ],
    ventajas: [
      'O(n log n) garantizado.',
      'Estable.',
      'Fácil de paralelizar: cada mitad se puede ordenar por separado.'
    ],
    desventajas: [
      'Usa memoria extra proporcional a n.',
      'Para listas muy pequeñas, métodos simples como inserción son más rápidos.'
    ],
    curiosidad: 'El ordenamiento que usa Python para sus listas (TimSort) se basa en las mezclas de Merge Sort.',
    fuentes: [
      { texto: 'D. E. Knuth. «Von Neumann\'s First Computer Program». ACM Computing Surveys, 2(4):247–260, 1970.', url: 'https://doi.org/10.1145/356580.356581' },
      { texto: 'P. E. Black. «merge sort». Dictionary of Algorithms and Data Structures, NIST.', url: 'https://xlinux.nist.gov/dads/HTML/mergesort.html' },
      { texto: `${CORMEN} Cap. 2.3 (Merge Sort).` },
      { texto: 'T. Peters. «listsort.txt» (descripción de TimSort), código fuente de CPython.', url: 'https://github.com/python/cpython/blob/main/Objects/listsort.txt' }
    ]
  }
}
