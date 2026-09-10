import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import type { Mesh } from 'three';

// Draggable 3D accent for the Home hero — an abstract "road loop" echoing the
// logo mark (route line + destination dot), not a literal bus model. Visitors
// can drag to spin it; left alone it keeps turning slowly on its own so the
// hero never looks static. Kept deliberately simple (two primitives, no
// imported .glb) so it stays light — this is a decorative accent, not the
// detailed KIMLONG99.glb bus model used on the seat-selection page.
function RoadLoop() {
  const ringRef = useRef<Mesh>(null);
  const dotRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (ringRef.current) ringRef.current.rotation.y += delta * 0.18;
    if (dotRef.current) dotRef.current.rotation.y += delta * 0.18;
  });

  return (
    <group rotation={[0.5, 0, 0]}>
      <mesh ref={ringRef}>
        <torusGeometry args={[1.5, 0.14, 32, 128]} />
        <meshStandardMaterial color="#215951" metalness={0.35} roughness={0.4} />
      </mesh>
      {/* destination dot riding the loop, mirrors the amber dot in the logo mark */}
      <mesh ref={dotRef} position={[1.5, 0, 0]}>
        <sphereGeometry args={[0.32, 32, 32]} />
        <meshStandardMaterial color="#D1873F" metalness={0.2} roughness={0.3} emissive="#D1873F" emissiveIntensity={0.15} />
      </mesh>
    </group>
  );
}

export function Hero3D({ className = '' }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <Canvas camera={{ position: [0, 1.4, 5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 2]} intensity={1.1} />
          <RoadLoop />
          <ContactShadows position={[0, -1.6, 0]} opacity={0.35} scale={6} blur={2.4} far={3} />
          <Environment preset="city" />
        </Suspense>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={1.2}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>
    </div>
  );
}
