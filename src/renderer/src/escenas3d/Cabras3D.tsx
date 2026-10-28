import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Quaternion, Vector3, type Group } from 'three'
import type { Paso } from '../algoritmos'
import type { EstadoMonticulo } from '../algoritmos/heapSort'
import type { Tono } from '../escenas/comun'
import { PODIO, disenoMonticulo } from '../escenas/EscenaMonticulo'
import { Aro, ESCALA, Mundo, mat, mundoX, reducido, texturaNumero, useTrayecto } from './Mundo'

const PELAJES = ['#F3EEE4', '#E3D3BA', '#C79F78', '#9C7A5E', '#BDB8AF', '#7E6A5A']
const collar = (v: number) => `hsl(${(v * 59) % 360}, 60%, 48%)`
const CUERNO = '#D9CBA8'
// El valle (ya ordenados) queda a ras del suelo y la cima de la montaña arriba.
const mundoY = (y: number) => (PODIO - y) / ESCALA
const VALLE_Z = 1.9

interface PropsCabra { valor: number; tono: Tono; objetivo: [number, number, number]; duracion: number; fase: number }

function Cabra({ valor, tono, objetivo, duracion, fase }: PropsCabra) {
  const raiz = useRef<Group>(null!)
  const cuerpo = useRef<Group>(null!)
  const cabeza = useRef<Group>(null!)
  const hocico = useRef<Group>(null!)
  const cola = useRef<Group>(null!)
  const patas = useRef<Group[]>([])
  const mirando = useRef(1)
  const trayecto = useTrayecto(objetivo, duracion, (d) => 0.6 + d * 0.3)
  const pelaje = PELAJES[valor % PELAJES.length]

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { moviendo, k, dx } = trayecto(t, raiz.current)
    if (tono === 'listo' && !reducido) raiz.current.position.y += Math.max(0, Math.sin(t * 4.5 + fase)) * 0.3
    // Mira hacia donde salta; el número va fuera del giro para que siempre se lea.
    if (moviendo && Math.abs(dx) > 0.05) mirando.current = Math.sign(dx)
    cuerpo.current.scale.x += (mirando.current - cuerpo.current.scale.x) * 0.25
    // Se agacha al despegar y al aterrizar; en el aire recoge las patas.
    const agacha = moviendo ? Math.max(0, 1 - Math.abs(k - 0.08) * 12, 1 - Math.abs(k - 0.95) * 12) : 0
    cuerpo.current.scale.y = 1 - agacha * 0.12
    const recoge = moviendo && k > 0.15 && k < 0.85 ? 0.7 : 0
    patas.current.forEach((p, i) => { p.rotation.z = (i < 2 ? -1 : 1) * recoge })
    // En reposo rumia, mueve la cola y de vez en cuando baja a pastar; comparada, levanta la cabeza.
    hocico.current.position.y = -0.04 + (moviendo ? 0 : Math.sin(t * 9 + fase) * 0.012)
    cola.current.rotation.z = 0.6 + Math.sin(t * 7 + fase) * 0.35
    const pasta = !moviendo && tono === 'normal' && Math.sin(t * 0.5 + fase) > 0.8
    const objetivoCabeza = tono === 'resaltado' ? 0.35 : pasta ? -0.7 : 0
    cabeza.current.rotation.z += (objetivoCabeza - cabeza.current.rotation.z) * 0.1
  })

  return (
    <group ref={raiz}>
      <Aro visible={tono === 'resaltado'} radio={0.5} />
      <group ref={cuerpo}>
        {[[0.2, 0.13], [0.2, -0.13], [-0.2, 0.13], [-0.2, -0.13]].map(([x, z], i) => (
          <group key={i} position={[x, 0.36, z]} ref={(g) => { if (g) patas.current[i] = g }}>
            <mesh position-y={-0.17} castShadow><cylinderGeometry args={[0.045, 0.04, 0.34, 8]} />{mat(pelaje)}</mesh>
            <mesh position-y={-0.33}><cylinderGeometry args={[0.045, 0.05, 0.06, 8]} />{mat('#3B3430')}</mesh>
          </group>
        ))}
        <mesh position-y={0.5} rotation-z={Math.PI / 2} castShadow><capsuleGeometry args={[0.2, 0.38, 8, 20]} />{mat(pelaje, 0.8)}</mesh>
        <group ref={cola} position={[-0.38, 0.6, 0]}>
          <mesh position-y={0.06}><coneGeometry args={[0.05, 0.14, 8]} />{mat(pelaje, 0.8)}</mesh>
        </group>
        <mesh position={[0.3, 0.6, 0]} rotation-z={-0.5}><torusGeometry args={[0.15, 0.035, 8, 24]} />{mat(collar(valor))}</mesh>
        <mesh position={[0.4, 0.46, 0]}><sphereGeometry args={[0.05, 12, 10]} /><meshStandardMaterial color="#E8B93C" metalness={0.6} roughness={0.3} /></mesh>
        <group ref={cabeza} position={[0.36, 0.72, 0]}>
          <mesh scale={[1.05, 1, 0.9]} castShadow><sphereGeometry args={[0.15, 18, 14]} />{mat(pelaje, 0.8)}</mesh>
          <group ref={hocico}>
            <mesh position={[0.13, -0.04, 0]} scale={[1.1, 0.85, 0.9]}><sphereGeometry args={[0.085, 14, 10]} />{mat(pelaje, 0.8)}</mesh>
            <mesh position={[0.2, -0.03, 0]}><sphereGeometry args={[0.025, 8, 6]} />{mat('#3B3430')}</mesh>
          </group>
          <mesh position={[0.1, -0.16, 0]} rotation-z={Math.PI}><coneGeometry args={[0.035, 0.12, 8]} />{mat('#E9E3D6')}</mesh>
          {[-0.06, 0.06].map((z) => (
            <group key={z}>
              <mesh position={[-0.04, 0.12, z]} rotation={[0, 0, 0.9]}><torusGeometry args={[0.09, 0.022, 8, 16, Math.PI]} />{mat(CUERNO, 0.6)}</mesh>
              <mesh position={[-0.06, 0.02, z * 2.3]} rotation={[z > 0 ? -0.9 : 0.9, 0, 0.2]} scale={[0.5, 1, 0.25]}><sphereGeometry args={[0.07, 10, 8]} />{mat(pelaje, 0.8)}</mesh>
            </group>
          ))}
          <mesh position={[0.07, 0.04, 0.12]}><sphereGeometry args={[0.028, 10, 8]} />{mat('#1D1A17')}</mesh>
          <mesh position={[0.07, 0.04, -0.12]}><sphereGeometry args={[0.028, 10, 8]} />{mat('#1D1A17')}</mesh>
        </group>
      </group>
      <mesh position={[0, 0.5, 0.215]}>
        <planeGeometry args={[0.3, 0.3]} />
        <meshBasicMaterial map={texturaNumero(valor, true)} transparent depthWrite={false} />
      </mesh>
    </group>
  )
}

// Cornisa de roca: se hunde y oscurece cuando su lugar ya no es parte del montículo.
function Cornisa({ x, y, usada }: { x: number; y: number; usada: boolean }) {
  const ref = useRef<Group>(null!)
  useFrame(() => {
    const meta = usada ? 1 : 0.35
    ref.current.scale.y += (meta - ref.current.scale.y) * (reducido ? 1 : 0.1)
  })
  return (
    <group ref={ref} position={[x, y - 0.2, 0]}>
      <RoundedBox args={[1.05, 0.4, 0.95]} radius={0.12} castShadow receiveShadow>
        <meshStandardMaterial color={usada ? '#A39A90' : '#7F776F'} roughness={0.95} />
      </RoundedBox>
      <mesh position={[0, 0.19, 0]} scale={[1, 0.2, 0.9]}><sphereGeometry args={[0.45, 16, 8]} />{mat('#F5F3EF', 1)}</mesh>
    </group>
  )
}

// Cuerda entre cornisa padre e hija: así se ve que el montículo es un árbol.
function Cuerda({ desde, hasta }: { desde: Vector3; hasta: Vector3 }) {
  const dir = hasta.clone().sub(desde)
  const giro = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.clone().normalize())
  return (
    <mesh position={desde.clone().add(hasta).multiplyScalar(0.5)} quaternion={giro}>
      <cylinderGeometry args={[0.02, 0.02, dir.length(), 6]} />{mat('#8A6A44', 0.9)}
    </mesh>
  )
}

function Paisaje() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[90, 60]} />{mat('#A8C98A', 1)}</mesh>
      {/* La montaña detrás de las cornisas */}
      <mesh position={[0, 3.2, -4.2]} scale={[1.25, 1, 0.55]}><coneGeometry args={[6.5, 6.4, 7]} />{mat('#8F877F', 1)}</mesh>
      <mesh position={[0, 5.47, -4.05]} scale={[1.25, 1, 0.55]}><coneGeometry args={[1.95, 1.9, 7]} />{mat('#F7F6F3', 1)}</mesh>
      {[[-10, 4.5, -14, 6], [9, 5, -16, 7], [-2, 6, -24, 9]].map(([x, h, z, r]) => (
        <group key={x} position={[x, 0, z]}>
          <mesh position-y={h / 2}><coneGeometry args={[r, h, 6]} />{mat('#9FA6B8', 1)}</mesh>
          <mesh position-y={h * 0.86}><coneGeometry args={[r * 0.28, h * 0.28, 6]} />{mat('#F4F5F8', 1)}</mesh>
        </group>
      ))}
      {[-6.2, -4.8, 5, 6.4].map((x, i) => (
        <group key={x} position={[x, 0, 0.8 + (i % 2) * 0.6]}>
          <mesh position-y={0.25}><cylinderGeometry args={[0.07, 0.09, 0.5, 8]} />{mat('#6B4A2E', 0.9)}</mesh>
          <mesh position-y={0.85}><coneGeometry args={[0.45, 1.1, 9]} />{mat('#4F7F4A', 0.9)}</mesh>
        </group>
      ))}
      {Array.from({ length: 18 }, (_, i) => (
        <mesh key={i} position={[-7 + i * 0.83, 0.05, 2.7 + (i % 3) * 0.35]}><sphereGeometry args={[0.07, 8, 6]} />{mat(i % 2 ? '#F2D35B' : '#FFFFFF')}</mesh>
      ))}
    </group>
  )
}

export default function EscenaCabras3D({ paso, datos, duracion }: { paso: Paso<EstadoMonticulo>; datos: number[]; duracion: number }) {
  const { lugares, cornisas, enlaces } = disenoMonticulo(paso)
  const arbol = new Set(lugares.filter((l) => l.p < paso.estado.tamano).map((l) => l.id))
  const v = (p: { x: number; y: number }) => new Vector3(mundoX(p.x), mundoY(p.y) + 0.05, 0)
  return (
    <Mundo cielo="#CFE3EE" camara={[0, 3.8, 19.5]} mira={[0, 2.1, 0]}>
      <Paisaje />
      {cornisas.map((c) => <Cornisa key={c.p} x={mundoX(c.x)} y={mundoY(c.y)} usada={c.usada} />)}
      {enlaces.map((e) => <Cuerda key={e.p} desde={v(e.desde)} hasta={v(e.hasta)} />)}
      {lugares.map(({ id, x, y, tono }) => (
        <Cabra
          key={id} valor={datos[id]} tono={tono} duracion={duracion} fase={id * 1.9}
          objetivo={[mundoX(x), arbol.has(id) ? mundoY(y) : 0, arbol.has(id) ? 0 : VALLE_Z]}
        />
      ))}
    </Mundo>
  )
}
