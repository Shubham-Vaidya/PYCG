'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface GlobeProps {
  isDragging: React.MutableRefObject<boolean>;
  isAnimating: React.MutableRefObject<boolean>;
}

export default function Globe({ isDragging, isAnimating }: GlobeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  const textures = useTexture({
    map: '/textures/earth_daymap.jpg',
    normalMap: '/textures/earth_normal_map.jpg',
    specularMap: '/textures/earth_specular_map.jpg',
  });

  const material = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      map: textures.map,
      normalMap: textures.normalMap,
      normalScale: new THREE.Vector2(0.05, 0.05),
      specularMap: textures.specularMap,
      specular: new THREE.Color(0x333333),
      shininess: 25,
    });
  }, [textures]);

  useFrame(() => {
    if (meshRef.current && !isDragging.current && !isAnimating.current) {
      meshRef.current.rotation.y += 0.0008;
    }
  });

  return (
    <mesh ref={meshRef} material={material}>
      <sphereGeometry args={[2, 64, 64]} />
    </mesh>
  );
}
