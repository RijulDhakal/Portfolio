"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface LetterProps {
  char: string;
  position: [number, number, number];
  isMobile: boolean;
}

const Letter = ({ char, position, isMobile }: LetterProps) => {
  const meshRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshBasicMaterial>(null);
  const basePosition = new THREE.Vector3(...position);
  
  const vec = new THREE.Vector3();
  const colorTarget = new THREE.Color();
  const defaultColor = new THREE.Color("#F5F5F0");
  const electricColor = new THREE.Color("#C8FF00");

  useFrame((state) => {
    if (!meshRef.current || !materialRef.current || isMobile) return;

    // Project pointer position to 3D space at z=0 plane
    vec.set(state.pointer.x, state.pointer.y, 0.5);
    vec.unproject(state.camera);
    const dir = vec.sub(state.camera.position).normalize();
    const distance = -state.camera.position.z / dir.z;
    const pointerPos = state.camera.position.clone().add(dir.multiplyScalar(distance));

    // Calculate distance to this letter
    const dist = pointerPos.distanceTo(basePosition);
    
    // Proximity effect radius
    const radius = 3.5;
    
    if (dist < radius) {
      // Inside radius, repel and highlight
      const intensity = 1 - (dist / radius);
      
      // Repel direction
      const repelDir = basePosition.clone().sub(pointerPos).normalize();
      
      // Target position
      const targetPos = basePosition.clone().add(repelDir.multiplyScalar(intensity * 1.5));
      targetPos.z = intensity * 1.5; // push out slightly in 3D
      
      meshRef.current.position.lerp(targetPos, 0.15);
      
      // Rotation
      const targetRotX = repelDir.y * intensity * 0.8;
      const targetRotY = -repelDir.x * intensity * 0.8;
      
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetRotX, 0.15);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, targetRotY, 0.15);
      
      // Color
      colorTarget.copy(defaultColor).lerp(electricColor, intensity);
      materialRef.current.color.lerp(colorTarget, 0.15);
    } else {
      // Return to base
      meshRef.current.position.lerp(basePosition, 0.1);
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, 0, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, 0, 0.1);
      materialRef.current.color.lerp(defaultColor, 0.1);
    }
  });

  return (
    <group ref={meshRef} position={position}>
      <Text
        fontSize={isMobile ? 1.5 : 2.5}
        letterSpacing={-0.05}
        anchorX="center"
        anchorY="middle"
        characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      >
        {char}
        <meshBasicMaterial ref={materialRef} color="#F5F5F0" toneMapped={false} />
      </Text>
    </group>
  );
};

export default function InteractiveText() {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const firstName = "RIJUL".split("");
  const lastName = "DHAKAL".split("");
  
  // Base spacing
  const spacing = isMobile ? 1.2 : 2.0;
  
  return (
    <group position={[0, 0, 0]}>
      {/* First Name */}
      <group position={[0, isMobile ? 1 : 1.5, 0]}>
        {firstName.map((char, i) => {
          const xOffset = (i - (firstName.length - 1) / 2) * spacing;
          return <Letter key={`f-${i}`} char={char} position={[xOffset, 0, 0]} isMobile={isMobile} />;
        })}
      </group>
      
      {/* Last Name */}
      <group position={[0, isMobile ? -1 : -1.5, 0]}>
        {lastName.map((char, i) => {
          const xOffset = (i - (lastName.length - 1) / 2) * spacing;
          return <Letter key={`l-${i}`} char={char} position={[xOffset, 0, 0]} isMobile={isMobile} />;
        })}
      </group>
    </group>
  );
}
