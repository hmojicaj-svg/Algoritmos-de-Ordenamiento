import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import type { Group } from 'three'
import type { Paso } from '../algoritmos'
import type { EstadoMezcla } from '../algoritmos/mergeSort'
import type { Tono } from '../escenas/comun'
import { FILAS, disenoMezcla } from '../escenas/EscenaMezcla'
import { Aro, ESCALA, Mundo, mat, mundoX, reducido, texturaNumero, useTrayecto } from './Mundo'

const NEGRO = '#22252B'
const NARANJA = '#F2A03D'
const bufanda = (v: number) => `hsl(${(v * 53) % 360}, 65%, 52%)`
// Fila de grupos divididos atrás, la mezcla en curso adelante.
const filaZ = (y: number) => (y === FILAS.FILA ? -0.5 : 1.5)

interface PropsPinguino { valor: number; tono: Tono; objetivo: [number, number, number]; escala: number; duracion: number; fase: number }

function Pinguino({ valor, tono, objetivo, escala, duracion, fase }: PropsPinguino) {
  const raiz = useRef<Group>(null!)
  const cuerpo = useRef<Group>(null!)
  const cabeza = useRef<Group>(null!)
  const alaI = useRef<Group>(null!)
  const alaD = useRef<Group>(null!)
  const ojos = useRef<Group>(null!)
  const trayecto = useTrayecto(objetivo, duracion, (d) => Math.min(1.3, 0.35 + d * 0.22))

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const { moviendo, dx } = trayecto(t, raiz.current)
    if (tono === 'listo' && !reducido) raiz.current.position.y += Math.max(0, Math.sin(t * 5 + fase)) * 0.35
    // Gira hacia donde camina; quieto, mira al frente.
    const giro = moviendo ? Math.sign(dx) * 0.7 : 0
    raiz.current.rotation.y += (giro - raiz.current.rotation.y) * 0.15
    // Contoneo al caminar y respiración en reposo.
    cuerpo.current.rotation.z = moviendo ? Math.sin(t * 16) * 0.16 : Math.sin(t * 1.3 + fase) * 0.03
    cuerpo.current.scale.y = 1 + (reducido ? 0 : Math.sin(t * 2.2 + fase) * 0.025)
    const aleteo = moviendo || tono === 'listo' ? 0.5 + Math.abs(Math.sin(t * 14)) * 0.8 : tono === 'resaltado' ? 0.35 : 0.12
    alaI.current.rotation.z = aleteo
    alaD.current.rotation.z = -aleteo
    cabeza.current.rotation.x = tono === 'resaltado' ? -0.25 : 0
    // Parpadeo cada pocos segundos, distinto en cada pingüino.
    ojos.current.scale.y = (t + fase) % 4 < 0.12 ? 0.1 : 1
  })

  return (
    <group ref={raiz} scale={escala}>
      <Aro visible={tono === 'resaltado'} />
      {[-0.13, 0.13].map((x) => (
        <mesh key={x} position={[x, 0.05, 0.1]} scale={[1, 0.45, 1.5]} castShadow>
          <sphereGeometry args={[0.11, 16, 12]} />{mat(NARANJA)}
        </mesh>
      ))}
      <group ref={cuerpo}>
        <mesh position-y={0.58} castShadow>
          <capsuleGeometry args={[0.34, 0.42, 8, 24]} />{mat(NEGRO)}
        </mesh>
        <mesh position={[0, 0.52, 0.2]} scale={[1, 1.25, 0.65]}>
          <sphereGeometry args={[0.3, 24, 18]} />{mat('#F6F3EC')}
        </mesh>
        <mesh position={[0, 0.5, 0.4]}>
          <planeGeometry args={[0.36, 0.36]} />
          <meshBasicMaterial map={texturaNumero(valor)} transparent depthWrite={false} />
        </mesh>
        <mesh position-y={0.9} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.27, 0.07, 12, 32]} />{mat(bufanda(valor))}
        </mesh>
        <mesh position={[0.17, 0.74, 0.26]} rotation-z={0.15}>
          <boxGeometry args={[0.1, 0.26, 0.05]} />{mat(bufanda(valor))}
        </mesh>
        <group ref={alaI} position={[-0.34, 0.78, 0]}>
          <mesh position-y={-0.2} castShadow><capsuleGeometry args={[0.07, 0.3, 6, 12]} />{mat(NEGRO)}</mesh>
        </group>
        <group ref={alaD} position={[0.34, 0.78, 0]}>
          <mesh position-y={-0.2} castShadow><capsuleGeometry args={[0.07, 0.3, 6, 12]} />{mat(NEGRO)}</mesh>
        </group>
        <group ref={cabeza} position-y={1.12}>
          <mesh castShadow><sphereGeometry args={[0.27, 24, 18]} />{mat(NEGRO)}</mesh>
          <group ref={ojos}>
            {[-0.1, 0.1].map((x) => (
              <group key={x} position={[x, 0.04, 0.21]}>
                <mesh><sphereGeometry args={[0.075, 14, 10]} />{mat('#FFFFFF')}</mesh>
                <mesh position-z={0.055}><sphereGeometry args={[0.038, 10, 8]} />{mat('#111111')}</mesh>
              </group>
            ))}
          </group>
          <mesh position={[0, -0.06, 0.27]} rotation-x={Math.PI / 2}>
            <coneGeometry args={[0.06, 0.14, 12]} />{mat(NARANJA)}
          </mesh>
        </group>
      </group>
    </group>
  )
}

// Placa de hielo: se estira o encoge suavemente cuando el grupo se parte o se une.
function Placa({ cx, ancho, z, activa }: { cx: number; ancho: number; z: number; activa: boolean }) {
  const ref = useRef<Group>(null!)
  useFrame(() => {
    const g = ref.current
    g.position.x += (cx - g.position.x) * 0.15
    g.scale.x += (ancho - g.scale.x) * 0.15
  })
  return (
    <group ref={ref} position={[cx, -0.1, z]} scale={[ancho, 1, 1]}>
      <RoundedBox args={[1, 0.24, 1.25]} radius={0.08} receiveShadow castShadow>
        <meshStandardMaterial color={activa ? '#FFFFFF' : '#E4EEF5'} roughness={0.35} />
      </RoundedBox>
    </group>
  )
}

function Paisaje() {
  return (
    <group>
      <mesh rotation-x={-Math.PI / 2} position-y={-0.2} receiveShadow>
        <planeGeometry args={[90, 60]} />
        <meshStandardMaterial color="#7BA3C6" roughness={0.25} metalness={0.15} />
      </mesh>
      {/* Orilla nevada al fondo */}
      <mesh position={[0, -0.1, -9]} receiveShadow><boxGeometry args={[60, 0.5, 9]} /><meshStandardMaterial color="#F3F1F7" roughness={0.9} /></mesh>
      <group position={[-5.5, 0.15, -6.5]}>
        <mesh castShadow><sphereGeometry args={[1.5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#F7F5FA" roughness={0.8} /></mesh>
        <mesh position={[0.2, 0, 1.35]}><sphereGeometry args={[0.55, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#EDEAF3" /></mesh>
        <mesh position={[0.2, 0.2, 1.6]}><circleGeometry args={[0.32, 24]} /><meshStandardMaterial color="#FFC978" emissive="#FF9F2E" emissiveIntensity={0.9} /></mesh>
      </group>
      <group position={[3.2, 0.15, -6.5]}>
        {[[0.7, 0.55], [0.5, 1.45], [0.36, 2.15]].map(([r, y]) => (
          <mesh key={y} position-y={y} castShadow><sphereGeometry args={[r, 24, 16]} /><meshStandardMaterial color="#FAF9FC" roughness={0.9} /></mesh>
        ))}
        <mesh position={[0, 2.12, 0.38]} rotation-x={Math.PI / 2}><coneGeometry args={[0.07, 0.3, 10]} /><meshStandardMaterial color={NARANJA} /></mesh>
        <mesh position-y={1.82} rotation-x={Math.PI / 2}><torusGeometry args={[0.36, 0.07, 10, 28]} /><meshStandardMaterial color="#D64545" /></mesh>
      </group>
      {[-11, -8.5, -2.5, 2, 9.5, 12].map((x, i) => (
        <group key={x} position={[x, 0.15, -10 - (i % 2) * 1.5]}>
          <mesh position-y={1.2} castShadow><coneGeometry args={[0.9, 2.4, 10]} /><meshStandardMaterial color="#4E5C86" roughness={0.9} /></mesh>
          <mesh position-y={2.3} castShadow><coneGeometry args={[0.65, 1.6, 10]} /><meshStandardMaterial color="#5B6A96" roughness={0.9} /></mesh>
        </group>
      ))}
      {[-14, -5, 6, 15].map((x, i) => (
        <mesh key={x} position={[x, 2.5, -20]}><coneGeometry args={[6 + i, 6 + (i % 2) * 2, 4]} /><meshStandardMaterial color="#A7A1CC" roughness={1} /></mesh>
      ))}
    </group>
  )
}

export default function EscenaPinguinos3D({ paso, datos, duracion }: { paso: Paso<EstadoMezcla>; datos: number[]; duracion: number }) {
  const { lugares, placas, celda } = disenoMezcla(paso)
  const [min, max] = useMemo(() => [Math.min(...datos), Math.max(...datos)], [datos])
  // Más pingüinos → más pequeños, para que quepan en su placa.
  const ajuste = Math.min(1, (celda / ESCALA) * 1.05)
  return (
    <Mundo cielo="#BDB6DD" camara={[0, 7, 20]} mira={[0, 0.4, 0.6]}>
      <Paisaje />
      {placas.map((p) => (
        <Placa key={`${p.y}-${Math.round(p.x)}`} cx={mundoX(p.x + p.ancho / 2)} ancho={p.ancho / ESCALA + 0.2} z={filaZ(p.y)} activa={p.activa} />
      ))}
      {lugares.map(({ id, x, y, tono }) => (
        <Pinguino
          key={id} valor={datos[id]} tono={tono} duracion={duracion} fase={id * 1.7}
          objetivo={[mundoX(x), 0.02, filaZ(y)]}
          escala={ajuste * (0.78 + (0.42 * (datos[id] - min)) / Math.max(1, max - min))}
        />
      ))}
    </Mundo>
  )
}
