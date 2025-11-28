"use client";

import { Canvas } from "@react-three/fiber";
import {
  Float,
  OrbitControls,
  Sphere,
  MeshDistortMaterial,
} from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      gl={{ antialias: true }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      {/* Floating animated object */}
      <Float speed={1.5} rotationIntensity={2} floatIntensity={1.2}>
        <Sphere args={[1.2, 64, 64]}>
          <MeshDistortMaterial
            color="#4f46e5"
            roughness={0.3}
            metalness={0.1}
            distort={0.4}
            speed={1.2}
          />
        </Sphere>
      </Float>

      {/* Prevent user from orbiting manually */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        enableRotate={false}
      />
    </Canvas>
  );
}
