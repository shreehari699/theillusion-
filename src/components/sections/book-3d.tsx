"use client";

import { Canvas } from "@react-three/fiber";
import { useRef, useState, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { TextureLoader, type Mesh } from "three";
import { Environment } from "@react-three/drei";

/**
 * The rotating 3D book. A box mesh (book proportions) with the real cover
 * texture on the front face, slowly rotating, reacting subtly to the pointer.
 * Wrapped so that if WebGL/3D fails anywhere, the parent shows a flat image
 * fallback instead of a blank screen.
 */
function BookMesh() {
  const mesh = useRef<Mesh>(null);
  const cover = useLoader(TextureLoader, "/images/cover.jpg");
  const [hover, setHover] = useState(false);

  useFrame((state, delta) => {
    if (!mesh.current) return;
    // gentle continuous spin
    mesh.current.rotation.y += delta * (hover ? 0.15 : 0.35);
    // subtle tilt following the pointer
    const targetX = state.pointer.y * 0.15;
    mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * 0.05;
  });

  return (
    <mesh
      ref={mesh}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      castShadow
    >
      {/* book proportions: width, height, depth(thickness) */}
      <boxGeometry args={[2.05, 3.3, 0.42]} />
      {/* face order: right, left, top, bottom, front(cover), back */}
      <meshStandardMaterial attach="material-0" color="#EDEDE8" roughness={0.9} />
      <meshStandardMaterial attach="material-1" color="#141414" roughness={0.6} />
      <meshStandardMaterial attach="material-2" color="#EDEDE8" roughness={0.9} />
      <meshStandardMaterial attach="material-3" color="#EDEDE8" roughness={0.9} />
      <meshStandardMaterial attach="material-4" map={cover} roughness={0.35} metalness={0.05} />
      <meshStandardMaterial attach="material-5" color="#0B0B0B" roughness={0.5} />
    </mesh>
  );
}

export function Book3D() {
  const [failed, setFailed] = useState(false);

  // If 3D can't render, fall back to the flat cover image.
  if (failed) {
    return (
      <div className="mx-auto flex h-full w-full items-center justify-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/cover.jpg"
          alt="THE ILLUSION book cover"
          className="max-h-[70vh] rounded-sm shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", () => setFailed(true));
        }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
        <directionalLight position={[-4, -2, 2]} intensity={0.4} color="#D4AF37" />
        <Suspense fallback={null}>
          <BookMesh />
          <Environment preset="studio" />
        </Suspense>
      </Canvas>
    </div>
  );
}
