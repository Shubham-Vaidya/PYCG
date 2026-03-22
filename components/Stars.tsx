'use client';

import { useMemo } from 'react';
import * as THREE from 'three';

export default function Stars() {
  const [positions, sizes] = useMemo(() => {
    const count = 3000;
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    let added = 0;

    while (added < count) {
      const x = Math.random() * 600 - 300;
      const y = Math.random() * 600 - 300;
      const z = Math.random() * 600 - 300;

      // Filter out stars too close to origin
      if (Math.sqrt(x * x + y * y + z * z) < 50) continue;

      pos[added * 3] = x;
      pos[added * 3 + 1] = y;
      pos[added * 3 + 2] = z;
      sz[added] = 0.7;
      added++;
    }

    return [pos, sz];
  }, []);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    return geo;
  }, [positions, sizes]);

  const material = useMemo(() => {
    return new THREE.PointsMaterial({
      color: '#ffffff',
      size: 0.7,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
    });
  }, []);

  return <points geometry={geometry} material={material} />;
}
