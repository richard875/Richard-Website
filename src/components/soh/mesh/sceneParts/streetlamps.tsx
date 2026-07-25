import React from "react";
import * as THREE from "three";
import { NightGlowInstances } from "../nightGlow";
import { StreetlampSpot } from "../streetlampSpot";
import { STREETLAMP_LOCAL_POSITIONS } from "../streetlamps";
import type { StreetlampLightingConfig } from "../types";

// The single baked "Streetlight_s" mesh (all 14 lamp posts in one geometry)
// plus, at night, the per-post glow-ball instances and real spotlight
// cones. Rendered as a sibling of OperaHouseBuilding inside mesh.tsx's
// shared [904.35, 676.99, 907.95] wrapper group.
export const Streetlamps = ({
  nodes,
  heroMaterial,
  isNight,
  streetlampLighting,
}: {
  nodes: Record<string, THREE.Object3D>;
  heroMaterial: (key: string) => THREE.Material;
  isNight: boolean;
  streetlampLighting: StreetlampLightingConfig;
}) => (
  <>
    <mesh
      castShadow
      receiveShadow
      geometry={(nodes.Streetlight_s_White_Border_0 as THREE.Mesh).geometry}
      material={heroMaterial("White_Border")}
      position={[-50.42, 58.02, -1712.52]}
      rotation={[Math.PI, 1.5, -Math.PI]}
      scale={2}
    />
    {isNight && (
      <group
        position={[-50.42, 58.02, -1712.52]}
        rotation={[Math.PI, 1.5, -Math.PI]}
        scale={2}
      >
        <NightGlowInstances
          positions={STREETLAMP_LOCAL_POSITIONS}
          color="#ff9d4d"
          radius={45}
          brightness={0.6}
        />
        {STREETLAMP_LOCAL_POSITIONS.map((lampPosition, i) => (
          <StreetlampSpot
            key={`streetlamp-spot-${i}`}
            position={lampPosition}
            intensity={streetlampLighting.intensity}
            angle={streetlampLighting.angle}
            targetDrop={streetlampLighting.targetDrop}
            targetForwardOffset={streetlampLighting.targetForwardOffset}
          />
        ))}
      </group>
    )}
  </>
);
