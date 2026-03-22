'use client';

import { useRef, useCallback, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import Globe from './Globe';
import Atmosphere from './Atmosphere';
import Stars from './Stars';
import CountryMarkers from './CountryMarkers';
import { latLngToVector3 } from '@/lib/utils';
import { Country } from '@/lib/types';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import ErrorBoundary from './ErrorBoundary';
import LoadingSpinner from './LoadingSpinner';

interface SceneProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
  isDragging: React.MutableRefObject<boolean>;
  isAnimating: React.MutableRefObject<boolean>;
  controlsRef: React.MutableRefObject<OrbitControlsType | null>;
}

function Scene({
  selectedCountry,
  onCountrySelect,
  isDragging,
  isAnimating,
  controlsRef,
}: SceneProps) {
  const { camera } = useThree();

  const animateToCountry = useCallback(
    (lat: number, lng: number) => {
      if (!controlsRef.current) return;
      const targetPos = latLngToVector3(lat, lng, 5);
      isAnimating.current = true;

      gsap.to(camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          (camera as THREE.PerspectiveCamera).updateProjectionMatrix();
        },
        onComplete: () => {
          isAnimating.current = false;
        },
      });

      gsap.to(controlsRef.current.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.8,
        ease: 'power3.inOut',
        onUpdate: () => {
          controlsRef.current?.update();
        },
      });
    },
    [camera, controlsRef, isAnimating]
  );

  const handleCountrySelect = useCallback(
    (country: Country) => {
      onCountrySelect(country);
      animateToCountry(country.lat, country.lng);
    },
    [onCountrySelect, animateToCountry]
  );

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-5, -3, -2]} intensity={0.05} color="#4488ff" />

      {/* Scene elements */}
      <Stars />
      <Globe isDragging={isDragging} isAnimating={isAnimating} />
      <Atmosphere />
      <CountryMarkers
        selectedCountry={selectedCountry}
        onCountrySelect={handleCountrySelect}
      />

      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enableZoom
        zoomSpeed={0.5}
        minDistance={3}
        maxDistance={12}
        enablePan={false}
        onStart={() => { isDragging.current = true; }}
        onEnd={() => { isDragging.current = false; }}
      />
    </>
  );
}

interface GlobeSceneProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
}

export default function GlobeScene({ selectedCountry, onCountrySelect }: GlobeSceneProps) {
  const isDragging = useRef<boolean>(false);
  const isAnimating = useRef<boolean>(false);
  const controlsRef = useRef<OrbitControlsType | null>(null);

  return (
    <div className="w-full h-full">
      <ErrorBoundary>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          gl={{ antialias: true, alpha: false }}
          frameloop="always"
          performance={{ min: 0.5 }}
          style={{ background: '#020408' }}
        >
          <Suspense fallback={null}>
            <Scene
              selectedCountry={selectedCountry}
              onCountrySelect={onCountrySelect}
              isDragging={isDragging}
              isAnimating={isAnimating}
              controlsRef={controlsRef}
            />
          </Suspense>
        </Canvas>
      </ErrorBoundary>
    </div>
  );
}
