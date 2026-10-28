import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Quaternion, Vector3, type Group } from 'three'
import type { Paso } from '../algoritmos'
import type { EstadoArbol } from '../algoritmos/treeSort'
import type { Tono } from '../escenas/comun'
import { CABLE, disenoArbol } from '../escenas/EscenaArbol'
import { Aro, ESCALA, Mundo, mat, mundoX, reducido, texturaNumero, useTrayecto } from './Mundo'

const plumaje = (v: number) => `hsl(${(v * 47) % 360}, 62%, 55%)`
const ala = (v: number) => `hsl(${(v * 47) % 360}, 55%, 40%)`
const NARANJA = '#F2A03D'
const MADERA = '#7A5232'
// Altura en el mundo: la fila del cable queda a ras del suelo y la raíz arriba.
const mundoY = (y: number) => (CABLE + 40 - y) / ESCALA

interface PropsPajaro { valor: number; tono: Tono; objetivo: [number, number, number]; duracion: number; fase: number }

function Pajaro({ valor, tono, objetivo, duracion, fase }: PropsPajaro) {
  const raiz = useRef<Group>(null!)
  const cuerpo = useRef<Group>(null!)
  const cabeza = useRef<Group>(null!)
  const alaI = useRef<Group>(null!)
  const alaD = useRef<Group>(null!)
  const ojos = useRef<Group>(null!)
  const patas = useRef<Group>(null!)
  const trayecto = useTrayecto(objetivo, duracion, (d) => 0.25 + d * 0.12)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { moviendo, dx } = trayecto(t, raiz.current)
    // Revolotea mientras viaja o mientras busca rama (activo).
    const vuela = moviendo || tono === 'activo'
    if (tono === 'activo' && !moviendo && !reducido) raiz.current.position.y += Math.sin(t * 6) * 0.06
    if (tono === 'listo' && !reducido) raiz.current.position.y += Math.max(0, Math.sin(t * 4 + fase)) * 0.18
    const aleteo = vuela ? 0.3 + Math.abs(Math.sin(t * 22)) * 1.1 : 0.1 + (Math.sin(t * 0.9 + fase) > 0.97 ? 0.5 : 0)
    alaI.current.rotation.z = aleteo
    alaD.current.rotation.z = -aleteo
    patas.current.visible = !vuela
    raiz.current.rotation.y += ((moviendo ? Math.sign(dx) * 0.6 : 0) - raiz.current.rotation.y) * 0.15
    cuerpo.current.rotation.x = vuela ? 0.25 : 0
    // Ladea la cabeza de vez en cuando; mira hacia arriba cuando lo comparan.
    cabeza.current.rotation.z = Math.sin(t * 0.7 + fase) * 0.25
    cabeza.current.rotation.x = tono === 'resaltado' ? -0.35 : 0
    ojos.current.scale.y = (t + fase) % 3.5 < 0.12 ? 0.1 : 1
  })

  return (
    <group ref={raiz}>
      <Aro visible={tono === 'resaltado'} radio={0.36} />
      <group ref={patas}>
        {[-0.07, 0.07].map((x) => (
          <mesh key={x} position={[x, 0.09, 0]}><cylinderGeometry args={[0.018, 0.018, 0.18, 6]} />{mat(NARANJA)}</mesh>
        ))}
      </group>
      <group ref={cuerpo}>
        <mesh position-y={0.38} scale={[1, 0.95, 0.9]} castShadow><sphereGeometry args={[0.26, 24, 18]} />{mat(plumaje(valor))}</mesh>
        <mesh position={[0, 0.35, 0.12]} scale={[1, 1.05, 0.6]}><sphereGeometry args={[0.2, 20, 14]} />{mat('#FBF6EA')}</mesh>
        <mesh position={[0, 0.35, 0.245]}>
          <planeGeometry args={[0.24, 0.24]} />
          <meshBasicMaterial map={texturaNumero(valor)} transparent depthWrite={false} />
        </mesh>
        <mesh position={[0, 0.3, -0.26]} rotation-x={-2.1}><coneGeometry args={[0.1, 0.28, 10]} />{mat(ala(valor))}</mesh>
        <group ref={alaI} position={[-0.23, 0.45, 0]}>
          <mesh position={[-0.04, -0.06, 0]} scale={[0.35, 0.9, 0.75]} castShadow><sphereGeometry args={[0.17, 14, 10]} />{mat(ala(valor))}</mesh>
        </group>
        <group ref={alaD} position={[0.23, 0.45, 0]}>
          <mesh position={[0.04, -0.06, 0]} scale={[0.35, 0.9, 0.75]} castShadow><sphereGeometry args={[0.17, 14, 10]} />{mat(ala(valor))}</mesh>
        </group>
        <group ref={cabeza} position-y={0.68}>
          <mesh castShadow><sphereGeometry args={[0.17, 20, 16]} />{mat(plumaje(valor))}</mesh>
          <mesh position={[0, 0.16, -0.02]} rotation-x={-0.4}><coneGeometry args={[0.05, 0.12, 8]} />{mat(ala(valor))}</mesh>
          <group ref={ojos}>
            {[-0.07, 0.07].map((x) => (
              <group key={x} position={[x, 0.03, 0.13]}>
                <mesh><sphereGeometry args={[0.045, 12, 10]} />{mat('#FFFFFF')}</mesh>
                <mesh position-z={0.03}><sphereGeometry args={[0.024, 10, 8]} />{mat('#111111')}</mesh>
              </group>
            ))}
          </group>
          <mesh position={[0, -0.02, 0.19]} rotation-x={Math.PI / 2}><coneGeometry args={[0.045, 0.12, 10]} />{mat(NARANJA)}</mesh>
        </group>
      </group>
    </group>
  )
}

// Rama de madera entre dos nodos; al nacer crece desde el padre.
function Rama({ desde, hasta }: { desde: Vector3; hasta: Vector3 }) {
  const ref = useRef<Group>(null!)
  const dir = hasta.clone().sub(desde)
  const largo = dir.length()
  const giro = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), dir.normalize())
  useFrame(() => { ref.current.scale.y += (1 - ref.current.scale.y) * (reducido ? 1 : 0.08) })
  return (
    <group position={desde} quaternion={giro}>
      <group ref={ref} scale={[1, 0.001, 1]}>
        <mesh position-y={largo / 2} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.075, largo, 10]} />{mat(MADERA, 0.9)}
        </mesh>
      </group>
    </group>
  )
}

// Follaje detrás de cada nodo: el árbol se llena de hojas a medida que llegan pájaros.
function Follaje({ x, y }: { x: number; y: number }) {
  const ref = useRef<Group>(null!)
  useFrame(({ clock }) => {
    const s = ref.current.scale.x + (1 - ref.current.scale.x) * (reducido ? 1 : 0.06)
    ref.current.scale.setScalar(s)
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.8 + x) * 0.03
  })
  return (
    <group ref={ref} position={[x, y + 0.25, -0.55]} scale={0.001}>
      {[[0, 0, 0.55], [-0.38, -0.1, 0.4], [0.38, -0.08, 0.42], [0, 0.3, 0.38]].map(([dx, dy, r], i) => (
        <mesh key={i} position={[dx, dy, 0]} castShadow><icosahedronGeometry args={[r, 1]} />{mat(i % 2 ? '#6FA85A' : '#7DB866', 0.9)}</mesh>
      ))}
    </group>
  )
}

function Paisaje({ raiz }: { raiz: [number, number] | null }) {
  const ancho = 5.6
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[90, 60]} />{mat('#9CC97A', 1)}</mesh>
      {[[-12, -18, 9], [0, -22, 12], [13, -17, 8]].map(([x, z, r]) => (
        <mesh key={x} position={[x, -r * 0.55, z]} scale={[1.6, 1, 1]}><sphereGeometry args={[r, 32, 16]} />{mat('#86B868', 1)}</mesh>
      ))}
      {raiz && (
        <mesh position={[raiz[0], raiz[1] / 2, -0.25]} castShadow receiveShadow>
          <cylinderGeometry args={[0.16, 0.32, raiz[1], 14]} />{mat(MADERA, 0.9)}
        </mesh>
      )}
      {/* Postes y cable donde se posan ya ordenados */}
      {[-ancho, ancho].map((x) => (
        <mesh key={x} position={[x, 0.45, 0]} castShadow><cylinderGeometry args={[0.07, 0.08, 0.9, 10]} />{mat('#8E8A80', 0.8)}</mesh>
      ))}
      <mesh position={[0, mundoY(CABLE) - 0.01, 0]} rotation-z={Math.PI / 2}><cylinderGeometry args={[0.015, 0.015, ancho * 2, 6]} />{mat('#3A3A36', 0.6)}</mesh>
      {[[-8, 6.5, -12], [7, 7.5, -14], [-1, 8.2, -18]].map(([x, y, z]) => (
        <group key={x} position={[x, y, z]}>
          {[[0, 0, 1], [1, 0.2, 0.8], [-1, 0.1, 0.75], [0.4, 0.6, 0.7]].map(([dx, dy, r], i) => (
            <mesh key={i} position={[dx, dy, 0]}><sphereGeometry args={[r, 16, 12]} /><meshStandardMaterial color="#FFFFFF" roughness={1} /></mesh>
          ))}
        </group>
      ))}
      <mesh position={[11, 9, -20]}><sphereGeometry args={[1.4, 24, 16]} /><meshStandardMaterial color="#FFE9A8" emissive="#FFD36B" emissiveIntensity={1.2} /></mesh>
    </group>
  )
}

interface Props { paso: Paso<EstadoArbol>; ultimo: EstadoArbol; datos: number[]; duracion: number }

export default function EscenaPajaros3D({ paso, ultimo, datos, duracion }: Props) {
  const { lugares, ramas, raiz, hojas } = disenoArbol(paso, ultimo, datos)
  const v = (p: { x: number; y: number }) => new Vector3(mundoX(p.x), mundoY(p.y), 0)
  return (
    <Mundo cielo="#BFE0F2" camara={[0, 3.6, 19]} mira={[0, 2.5, 0]}>
      <Paisaje raiz={raiz ? [mundoX(raiz.x), mundoY(raiz.y)] : null} />
      {hojas.map((h) => <Follaje key={h.id} x={mundoX(h.x)} y={mundoY(h.y)} />)}
      {ramas.map((r) => <Rama key={r.hijo} desde={v(r.desde)} hasta={v(r.hasta)} />)}
      {lugares.map(({ id, x, y, tono }) => (
        <Pajaro key={id} valor={datos[id]} tono={tono} duracion={duracion} fase={id * 1.3} objetivo={[mundoX(x), mundoY(y), 0.05]} />
      ))}
    </Mundo>
  )
}
