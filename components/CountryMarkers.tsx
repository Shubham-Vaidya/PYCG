'use client';

import { useMemo, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { COUNTRIES } from '@/lib/countries';
import { latLngToVector3 } from '@/lib/utils';
import { Country } from '@/lib/types';

interface CountryMarkersProps {
  selectedCountry: Country | null;
  onCountrySelect: (country: Country) => void;
}

const NORMAL_COLOR = new THREE.Color('#00ffcc');
const HOVER_COLOR = new THREE.Color('#ff6b35');
const SELECTED_COLOR = new THREE.Color('#ffffff');

const normalMat = new THREE.MeshBasicMaterial({ color: NORMAL_COLOR });
const hoverMat = new THREE.MeshBasicMaterial({ color: HOVER_COLOR });
const selectedMat = new THREE.MeshBasicMaterial({ color: SELECTED_COLOR });

export default function CountryMarkers({
  selectedCountry,
  onCountrySelect,
}: CountryMarkersProps) {
  const [hovered, setHovered] = useState<string | null>(null);

  const markerGeometry = useMemo(() => new THREE.SphereGeometry(0.03, 8, 8), []);

  const markers = useMemo(
    () =>
      COUNTRIES.map((country) => ({
        country,
        position: latLngToVector3(country.lat, country.lng, 2.05),
      })),
    []
  );

  return (
    <>
      {markers.map(({ country, position }, idx) => {
        const isSelected = selectedCountry?.code === country.code;
        const isHovered = hovered === country.code;
        const material = isSelected ? selectedMat : isHovered ? hoverMat : normalMat;

        return (
          <mesh
            key={`${country.code}-${idx}`}
            position={position}
            geometry={markerGeometry}
            material={material}
            onPointerOver={(e: ThreeEvent<PointerEvent>) => {
              e.stopPropagation();
              setHovered(country.code);
              document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
              setHovered(null);
              document.body.style.cursor = 'default';
            }}
            onClick={(e: ThreeEvent<MouseEvent>) => {
              e.stopPropagation();
              onCountrySelect(country);
            }}
          />
        );
      })}
    </>
  );
}
