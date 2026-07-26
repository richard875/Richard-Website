import React from "react";
import * as THREE from "three";
import { NightGlowInstances } from "../nightGlow";
import StreetlampSpot from "../streetlampSpot";
import { STREETLAMP_LOCAL_POSITIONS } from "../streetlamps";
import type { StreetlampLightingConfig } from "../types";

// The single baked "Streetlight_s" mesh's own local transform - shared by
// the mesh itself and (at night) the sibling group of glow-ball instances/
// spotlight cones, which need to line up with it exactly.
const STREETLAMP_POSITION: [number, number, number] = [-50.42, 58.02, -1712.52];
const STREETLAMP_ROTATION: [number, number, number] = [Math.PI, 1.5, -Math.PI];
const STREETLAMP_SCALE = 2;

// The single baked "Streetlight_s" mesh (all 14 lamp posts in one geometry)
// plus, at night, the per-post glow-ball instances and real spotlight
// cones. Rendered as a sibling of OperaHouseBuilding inside mesh.tsx's
// shared [904.35, 676.99, 907.95] wrapper group.
const Streetlamps = ({
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
      position={STREETLAMP_POSITION}
      rotation={STREETLAMP_ROTATION}
      scale={STREETLAMP_SCALE}
    />
    {isNight && (
      <group
        position={STREETLAMP_POSITION}
        rotation={STREETLAMP_ROTATION}
        scale={STREETLAMP_SCALE}
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

export default Streetlamps;
