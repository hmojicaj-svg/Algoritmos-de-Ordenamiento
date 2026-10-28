import { useLayoutEffect, type ReactNode } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { CanvasTexture, SRGBColorSpace, type PerspectiveCamera } from 'three'

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

// Número dibujado en un canvas: no depende de descargar fuentes.
const texturas = new Map<number, CanvasTexture>()
export function texturaNumero(v: number) {
  let t = texturas.get(v)
  if (!t) {
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')!
    g.fillStyle = '#23262B'
    g.font = `800 ${v > 9 ? 70 : 84}px "Inter Variable", "Segoe UI", sans-serif`
    g.textAlign = 'center'
    g.textBaseline = 'middle'
    g.fillText(String(v), 64, 70)
    t = new CanvasTexture(c)
    t.colorSpace = SRGBColorSpace
    texturas.set(v, t)
  }
  return t
}

export const suave = (k: number) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2)
