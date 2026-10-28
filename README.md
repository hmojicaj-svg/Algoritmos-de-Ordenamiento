# Algoritmos de Ordenamiento

Aplicativo de escritorio didáctico y comparativo de tres algoritmos de ordenamiento que usan árboles:

| Algoritmo | Escena 3D | Idea |
|---|---|---|
| **Tree Sort** | Pájaros que se posan en un árbol | Árbol binario de búsqueda + recorrido en orden |
| **Heap Sort** | Cabras que saltan entre las cornisas de una montaña | Montículo binario guardado en el arreglo |
| **Merge Sort** | Pingüinos sobre placas de hielo que se parten y se unen | Divide y vencerás (árbol de recursión) |

Cada algoritmo tiene:

- **Animación 3D a pantalla completa**, sincronizada con el **pseudocódigo en español** (la línea que se ejecuta se resalta) y una narración paso a paso. Controles de reproducir, pausar, avanzar, retroceder, velocidad y datos propios.
- **Vista técnica** con nodos y arreglos en 2D.
- **Ficha** con historia, cómo funciona, rendimiento en notación Big O, características, ventajas, desventajas y fuentes académicas.

Además: una **gráfica de líneas** que compara las comparaciones de los tres con datos aleatorios, una página de inicio y un glosario.

## Cómo ejecutarlo

Requisitos: [Node.js](https://nodejs.org/) 22 o superior y Git.

```bash
git clone https://github.com/hmojicaj-svg/Algoritmos-de-Ordenamiento.git
cd Algoritmos-de-Ordenamiento
npm install
npm start
```

`npm start` compila el proyecto y abre la ventana del aplicativo.

Otros comandos:

| Comando | Para qué |
|---|---|
| `npm run dev` | Modo desarrollo, con recarga al guardar |
| `npm test` | Pruebas del motor de los algoritmos |
| `npm run typecheck` | Revisión de tipos de TypeScript |

## Cómo está hecho

- **Electron + React + TypeScript**, empaquetado con electron-vite.
- **Three.js** con React Three Fiber para las escenas 3D. Los personajes están modelados en código (sin modelos descargados).
- El **motor** (`src/renderer/src/algoritmos`) implementa cada algoritmo como un generador: animando entrega un paso por acción y en silencio solo cuenta comparaciones. Así la animación, el pseudocódigo, la narración y la gráfica salen del mismo código.
- Las **pruebas** (Vitest) verifican que los tres ordenan bien en todos los casos, que la animación coincide con el conteo y que Tree Sort con datos ya ordenados hace exactamente n(n−1)/2 comparaciones sin desbordar la pila.

## Fuentes de las fichas

- J. W. J. Williams. «Algorithm 232: Heapsort». *Communications of the ACM*, 7(6):347–348, 1964.
- R. W. Floyd. «Algorithm 245: Treesort 3». *Communications of the ACM*, 7(12):701, 1964.
- D. E. Knuth. «Von Neumann's First Computer Program». *ACM Computing Surveys*, 2(4):247–260, 1970.
- P. F. Windley. «Trees, forests and rearranging». *The Computer Journal*, 3(2):84–88, 1960.
- T. N. Hibbard. «Some combinatorial properties of certain trees with applications to searching and sorting». *Journal of the ACM*, 9(1):13–28, 1962.
- P. E. Black (ed.). *Dictionary of Algorithms and Data Structures*. NIST.
- T. H. Cormen, C. E. Leiserson, R. L. Rivest y C. Stein. *Introduction to Algorithms*, 4.ª ed. MIT Press, 2022.
