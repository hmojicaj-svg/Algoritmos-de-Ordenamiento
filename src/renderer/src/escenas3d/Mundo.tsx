import { useLayoutEffect, useRef, type ReactNode } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { CanvasTexture, SRGBColorSpace, Vector3, type Group, type Mesh, type PerspectiveCamera } from 'three'

export const reducido = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Lienzo 1000 × 540 de las vistas 2D → mundo 3D: así las dos vistas usan las mismas posiciones.
export const ESCALA = 90 // unidades del lienzo 2D por unidad 3D
export const mundoX = (x: number) => (x - 500) / ESCALA

// Corre el centro de la imagen para que los personajes queden en el hueco libre entre los paneles.
function Encuadre({ dx, dy }: { dx: number; dy: number }) {
  const { camera, size } = useThree()
  useLayoutEffect(() => {
    const c = camera as PerspectiveCamera
    c.setViewOffset(size.width, size.height, dx, dy, size.width, size.height)
    c.updateProjectionMatrix()
    return () => c.clearViewOffset()
  }, [camera, size, dx, dy])
  return null
}

interface Props {
  children: ReactNode
  cielo: string
  camara: [number, number, number]
  mira: [number, number, number]
  desplazar?: [number, number]
}

export function Mundo({ children, cielo, camara, mira, desplazar = [200, 40] }: Props) {
  return (
    <Canvas shadows dpr={[1, 2]} camera={{ position: camara, fov: 36 }} onCreated={({ camera }) => camera.lookAt(...mira)}>
      <color attach="background" args={[cielo]} />
      <fog attach="fog" args={[cielo, 16, 38]} />
      <hemisphereLight args={['#FFFFFF', '#8D88B5', 1.1]} />
      <directionalLight
        position={[6, 10, 7]} intensity={1.9} castShadow
        shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004}
        shadow-camera-left={-12} shadow-camera-right={12} shadow-camera-top={10} shadow-camera-bottom={-10}
      />
      <Encuadre dx={desplazar[0]} dy={desplazar[1]} />
      {children}
    </Canvas>
  )
}

// Número dibujado en un canvas: no depende de descargar fuentes. Con insignia, va sobre un círculo blanco.
const texturas = new Map<string, CanvasTexture>()
export function texturaNumero(v: number, insignia = false) {
  let t = texturas.get(`${v}-${insignia}`)
  if (!t) {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    if (insignia) {
      g.fillStyle = '#FFFFFF'
      g.beginPath()
      g.arc(64, 64, 60, 0, Math.PI * 2)
      g.fill()
    }
    g.fillStyle = '#23262B'
    g.font = `800 ${v > 9 ? 70 : 84}px "Inter Variable", "Segoe UI", sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(String(v), 64, 70)
    t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    texturas.set(`${v}-${insignia}`, t)
  }
  return t
}

export const suave = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2)

// Viaje en arco hacia `objetivo`: cuando el objetivo cambia, sale desde donde está y llega en `duracion` segundos.
// Se llama dentro de useFrame; devuelve si sigue en el aire y hacia dónde va.
export function useTrayecto(objetivo: [number, number, number], duracion: number, altura: (distancia: number) => number) {
  const m = useRef({ desde: new Vector3(...objetivo), hasta: new Vector3(...objetivo), ahora: new Vector3(...objetivo), t0: -10 })
  return (t: number, g: Group) => {
    const e = m.current
    if (e.hasta.x !== objetivo[0] || e.hasta.y !== objetivo[1] || e.hasta.z !== objetivo[2]) {
      e.desde.copy(e.ahora)
      e.hasta.set(...objetivo)
      e.t0 = t
    }
    const k = reducido ? 1 : Math.min(1, (t - e.t0) / duracion)
    e.ahora.lerpVectors(e.desde, e.hasta, suave(k))
    const arco = k < 1 ? Math.sin(Math.PI * k) * altura(e.desde.distanceTo(e.hasta)) : 0
    g.position.set(e.ahora.x, e.ahora.y + arco, e.ahora.z)
    return { moviendo: k < 1, k, dx: e.hasta.x - e.desde.x }
  }
}

// Anillo de luz bajo el personaje que se está comparando.
export function Aro({ visible, radio = 0.48 }: { visible: boolean; radio?: number }) {
  const ref = useRef<Mesh>(null!)
  useFrame(({ clock }) => { ref.current.rotation.z = clock.elapsedTime * 2 })
  return (
    <mesh ref={ref} visible={visible} rotation-x={-Math.PI / 2} position-y={0.02}>
      <torusGeometry args={[radio, 0.05, 12, 48]} />
      <meshStandardMaterial color="#FFD45E" emissive="#FFB400" emissiveIntensity={1.4} />
    </mesh>
  )
}

export const mat = (color: string, rugosidad = 0.55) => <meshStandardMaterial color={color} roughness={rugosidad} />
