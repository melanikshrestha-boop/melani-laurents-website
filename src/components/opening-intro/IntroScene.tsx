"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import type { IntroState } from "./intro-timeline";

interface IntroSceneProps {
  progress: number;
  getState: (t: number) => IntroState;
}

function SittingFigure({ headLookUp }: { headLookUp: number }) {
  const skin = "#c4a882";
  const coat = "#2a2438";
  const hair = "#1a1410";

  return (
    <group position={[-0.55, 0, 0.35]} rotation={[0, 0.55, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <capsuleGeometry args={[0.22, 0.38, 8, 16]} />
        <meshStandardMaterial color={coat} roughness={0.85} metalness={0.05} />
      </mesh>

      <group position={[0.06, 0.78, 0.04]} rotation={[headLookUp, 0, 0]}>
        <mesh castShadow>
          <sphereGeometry args={[0.17, 24, 24]} />
          <meshStandardMaterial color={skin} roughness={0.72} />
        </mesh>
        <mesh position={[-0.02, 0.04, -0.06]} scale={[1.1, 1.35, 0.95]}>
          <sphereGeometry args={[0.19, 20, 20]} />
          <meshStandardMaterial color={hair} roughness={0.95} />
        </mesh>
      </group>

      <mesh
        position={[-0.28, 0.28, 0.12]}
        rotation={[0.4, 0, 0.35]}
        castShadow
      >
        <capsuleGeometry args={[0.06, 0.28, 6, 12]} />
        <meshStandardMaterial color={coat} roughness={0.85} />
      </mesh>
      <mesh
        position={[0.26, 0.22, -0.08]}
        rotation={[0.8, 0, -0.45]}
        castShadow
      >
        <capsuleGeometry args={[0.06, 0.26, 6, 12]} />
        <meshStandardMaterial color={coat} roughness={0.85} />
      </mesh>

      <mesh position={[-0.18, 0.08, 0.42]} rotation={[1.15, 0.2, 0.15]} castShadow>
        <capsuleGeometry args={[0.08, 0.34, 6, 12]} />
        <meshStandardMaterial color="#1e1a28" roughness={0.9} />
      </mesh>
      <mesh position={[0.22, 0.05, 0.28]} rotation={[1.05, -0.15, -0.1]} castShadow>
        <capsuleGeometry args={[0.08, 0.3, 6, 12]} />
        <meshStandardMaterial color="#1e1a28" roughness={0.9} />
      </mesh>
    </group>
  );
}

function Tree({ opacity }: { opacity: number }) {
  return (
    <group position={[0.35, 0, 0]}>
      <mesh position={[0, 0.95, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.14, 0.2, 1.9, 12]} />
        <meshStandardMaterial
          color="#3d2a22"
          roughness={0.92}
          transparent
          opacity={opacity}
        />
      </mesh>

      {[
        [0, 2.05, 0, 0.62, 0.48],
        [0.28, 2.18, 0.08, 0.42, 0.34],
        [-0.22, 2.12, -0.06, 0.38, 0.32],
        [0.12, 2.38, -0.1, 0.35, 0.28],
      ].map(([x, y, z, sx, sy], i) => (
        <mesh
          key={i}
          position={[x, y, z]}
          scale={[sx, sy, sx * 0.85]}
          castShadow
        >
          <sphereGeometry args={[0.55, 20, 20]} />
          <meshStandardMaterial
            color="#1f3d2a"
            roughness={0.88}
            transparent
            opacity={opacity * 0.95}
          />
        </mesh>
      ))}

      <mesh position={[0.22, 2.05, 0.08]} rotation={[0, 0, 0.4]}>
        <cylinderGeometry args={[0.015, 0.015, 0.14, 6]} />
        <meshStandardMaterial color="#4a3528" transparent opacity={opacity} />
      </mesh>
    </group>
  );
}

function FallingApple({
  y,
  rotation,
  scale,
  metal,
  visible,
}: {
  y: number;
  rotation: number;
  scale: number;
  metal: number;
  visible: boolean;
}) {
  if (!visible) return null;

  const red = new THREE.Color("#b83a3a");
  const chrome = new THREE.Color("#e8e4df");
  const color = red.clone().lerp(chrome, metal);

  return (
    <group position={[0.48, y, 0.12]} rotation={[rotation * 0.3, rotation, 0]} scale={scale}>
      <mesh castShadow>
        <sphereGeometry args={[0.11, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.55 - metal * 0.35}
          metalness={metal * 0.85}
          emissive={chrome}
          emissiveIntensity={metal * 0.35}
        />
      </mesh>
      <mesh position={[0, 0.11, 0]}>
        <cylinderGeometry args={[0.012, 0.016, 0.06, 8]} />
        <meshStandardMaterial color="#4a3528" />
      </mesh>
      <mesh position={[0.02, 0.14, 0]}>
        <boxGeometry args={[0.07, 0.015, 0.04]} />
        <meshStandardMaterial color="#2d5a34" />
      </mesh>
    </group>
  );
}

function AppleLogoFormation({ progress, metal }: { progress: number; metal: number }) {
  const groupRef = useRef<THREE.Group>(null);

  const logoShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0.42);
    shape.bezierCurveTo(0.26, 0.42, 0.34, 0.22, 0.3, 0.02);
    shape.bezierCurveTo(0.26, -0.28, 0.02, -0.42, 0, -0.42);
    shape.bezierCurveTo(-0.02, -0.42, -0.26, -0.28, -0.3, 0.02);
    shape.bezierCurveTo(-0.34, 0.22, -0.26, 0.42, 0, 0.42);

    const bite = new THREE.Path();
    bite.absellipse(0.2, 0.06, 0.09, 0.1, 0, Math.PI * 2, false);
    shape.holes.push(bite);

    return shape;
  }, []);

  const extrudeSettings = useMemo(
    () => ({
      depth: 0.08,
      bevelEnabled: true,
      bevelThickness: 0.012,
      bevelSize: 0.012,
      bevelSegments: 3,
      curveSegments: 24,
    }),
    [],
  );

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += 0.004;
  });

  if (progress <= 0) return null;

  const scale = 0.85 + progress * 0.35;
  const opacity = Math.min(1, progress * 1.35);

  return (
    <group ref={groupRef} position={[0, 1.35, 0]} scale={scale * progress}>
      <mesh rotation={[0, 0, Math.PI]}>
        <extrudeGeometry args={[logoShape, extrudeSettings]} />
        <meshStandardMaterial
          color="#f0ece6"
          roughness={0.18}
          metalness={0.92}
          emissive="#ddb896"
          emissiveIntensity={0.15 + metal * 0.45}
          transparent
          opacity={opacity}
        />
      </mesh>

      <mesh position={[0.04, -0.38, 0.05]} rotation={[0, 0, 0.5]} scale={progress}>
        <sphereGeometry args={[0.04, 12, 12]} />
        <meshStandardMaterial
          color="#2d5a34"
          emissive="#3d7a44"
          emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
}

function NeuralHalo({ progress }: { progress: number }) {
  const ref = useRef<THREE.Group>(null);

  const nodes = useMemo(() => {
    const pts: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      pts.push([
        Math.cos(a) * 0.55,
        Math.sin(a * 2) * 0.12,
        Math.sin(a) * 0.55,
      ]);
    }
    return pts;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.25;
  });

  if (progress <= 0) return null;

  return (
    <group ref={ref} position={[0, 1.35, 0]}>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos} scale={progress * 0.06}>
          <sphereGeometry args={[1, 10, 10]} />
          <meshStandardMaterial
            color="#c9a962"
            emissive="#ddb896"
            emissiveIntensity={0.8 * progress}
            transparent
            opacity={progress * 0.85}
          />
        </mesh>
      ))}

      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.58, 0.004, 8, 64]} />
        <meshBasicMaterial
          color="#ddb896"
          transparent
          opacity={progress * 0.45}
        />
      </mesh>
    </group>
  );
}

function TechCore({ progress }: { progress: number }) {
  if (progress <= 0.2) return null;

  const p = (progress - 0.2) / 0.8;

  return (
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <group position={[0, 1.35, 0]} scale={p * 0.35}>
        <mesh>
          <icosahedronGeometry args={[1, 1]} />
          <MeshTransmissionMaterial
            backside
            samples={4}
            thickness={0.35}
            chromaticAberration={0.12}
            anisotropy={0.25}
            distortion={0.15}
            distortionScale={0.25}
            temporalDistortion={0.08}
            iridescence={0.45}
            iridescenceIOR={1.2}
            color="#c9a962"
          />
        </mesh>
      </group>
    </Float>
  );
}

function ImpactBurst({ strength }: { strength: number }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(120 * 3);
    for (let i = 0; i < 120; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 0.15;
      arr[i * 3 + 1] = Math.random() * 0.2;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!ref.current || strength <= 0) return;
    ref.current.rotation.y += 0.02;
  });

  if (strength <= 0.01) return null;

  return (
    <points ref={ref} position={[0.48, 0.52, 0.12]} scale={1 + strength * 2.5}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={120}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#ffddb0"
        transparent
        opacity={strength * 0.75}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(300 * 3);
    for (let i = 0; i < 300; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 24;
      arr[i * 3 + 1] = Math.random() * 12 + 1;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.015;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={300}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.018}
        color="#ffffff"
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

function Ground() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[4.5, 64]} />
        <meshStandardMaterial color="#080808" roughness={0.95} metalness={0.05} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, 0]} receiveShadow>
        <ringGeometry args={[0.6, 4.5, 64]} />
        <meshStandardMaterial
          color="#111111"
          roughness={1}
          transparent
          opacity={0.6}
        />
      </mesh>
    </>
  );
}

function CameraRig({
  getState,
  progress,
}: {
  getState: (t: number) => IntroState;
  progress: number;
}) {
  useFrame(({ camera }) => {
    const state = getState(progress);
    camera.position.set(...state.cameraPos);
    camera.lookAt(...state.cameraTarget);
  });

  return null;
}

export function IntroScene({ progress, getState }: IntroSceneProps) {
  const state = getState(progress);
  const natureOpacity = 1 - state.hideNature * 0.92;
  const showApple =
    state.transformProgress < 0.35 || state.logoProgress < 0.25;

  return (
    <>
      <CameraRig getState={getState} progress={progress} />

      <ambientLight intensity={0.08 + state.impactFlash * 0.35} />
      <directionalLight
        position={[4, 6, 3]}
        intensity={0.55 + state.impactFlash * 1.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-far={20}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={5}
        shadow-camera-bottom={-5}
      />
      <pointLight
        position={[0.5, 2.2, 1]}
        intensity={0.35 + state.impactFlash * 2.5}
        color={state.impactFlash > 0 ? "#ffddb0" : "#ddb896"}
        distance={8}
      />
      <spotLight
        position={[-2, 4, 2]}
        angle={0.35}
        penumbra={0.8}
        intensity={0.25 + state.logoProgress * 0.6}
        color="#c9a962"
        castShadow
      />

      <group visible={state.sceneOpacity > 0.01}>
        <Starfield />
        <Ground />

        <group visible={natureOpacity > 0.02}>
          <Tree opacity={natureOpacity} />
          <SittingFigure headLookUp={state.headLookUp} />
        </group>

        <FallingApple
          y={state.appleY}
          rotation={state.appleRot}
          scale={state.appleScale}
          metal={state.appleMetal}
          visible={showApple && natureOpacity > 0.05}
        />

        <ImpactBurst strength={state.impactFlash} />

        <AppleLogoFormation
          progress={state.logoProgress}
          metal={state.appleMetal}
        />
        <NeuralHalo progress={state.neuralProgress} />
        <TechCore progress={state.logoProgress} />
      </group>

      <ContactShadows
        position={[0, 0.01, 0]}
        opacity={0.35 * natureOpacity}
        scale={8}
        blur={2.2}
        far={4}
      />
    </>
  );
}
