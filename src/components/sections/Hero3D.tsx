"use client";

import { Canvas } from "@react-three/fiber";
import InteractiveText from "@/three/InteractiveText";

export default function Hero3D() {
  return (
    <Canvas camera={{ position: [0, 0, 15], fov: 35 }}>
      <InteractiveText />
    </Canvas>
  );
}
