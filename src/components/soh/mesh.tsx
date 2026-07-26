import React from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { smoothSailGeometry } from "./mesh/geometryUtils";
import { useMergedTreeGeometry } from "./mesh/treeInstances";
import {
  useGlassMaterial,
  useLambertMaterials,
  useNightMaterialTint,
} from "./mesh/materials";
import useAnimatedWaterMaterial from "./mesh/waterline/useAnimatedWaterMaterial";
import {
  DOCK_WATERLINE_Y,
  DOCK_LED_MARKERS,
} from "./mesh/waterline/dockWaterline";
import NightFixtures from "./mesh/sceneParts/nightFixtures";
import TaxiCars from "./mesh/sceneParts/taxiCars";
import Trees from "./mesh/sceneParts/trees";
import OperaHouseBuilding from "./mesh/sceneParts/operaHouseBuilding";
import Streetlamps from "./mesh/sceneParts/streetlamps";
import Buildings from "./mesh/sceneParts/buildings";
import Boats from "./mesh/sceneParts/boats";
import GroundAndWater from "./mesh/sceneParts/groundAndWater";
import {
  DEFAULT_DOCK_LIGHTING,
  DEFAULT_SAIL_FLOODLIGHTS,
  DEFAULT_STREETLAMP_LIGHTING,
} from "./mesh/types";
import type { MeshProps } from "./mesh/types";

export type {
  SailFloodlightConfig,
  DockLightingConfig,
  StreetlampLightingConfig,
} from "./mesh/types";
export {
  DEFAULT_SAIL_FLOODLIGHTS,
  DEFAULT_DOCK_LIGHTING,
  DEFAULT_STREETLAMP_LIGHTING,
} from "./mesh/types";

const MODEL_PATH = "/models/sydney-opera-house.gltf";

// Fallback used only if no scene sun direction is supplied.
const DEFAULT_SUN_DIRECTION = new THREE.Vector3(0.6, 0.2, 0.4);

const Mesh = ({
  sunDirection = DEFAULT_SUN_DIRECTION,
  isNight = false,
  sailFloodlights = DEFAULT_SAIL_FLOODLIGHTS,
  dockLighting = DEFAULT_DOCK_LIGHTING,
  streetlampLighting = DEFAULT_STREETLAMP_LIGHTING,
}: MeshProps) => {
  const { nodes, materials } = useLoader(GLTFLoader, MODEL_PATH);

  useNightMaterialTint(materials, isNight);
  const lambertMaterials = useLambertMaterials(materials);
  // Every "hero" mesh below reads its material through this instead of
  // `materials[key]` directly, so the isNight Lambert swap (see
  // mesh/materials.ts) happens in exactly one place rather than at each call
  // site.
  const heroMaterial = (key: string): THREE.Material =>
    isNight ? (lambertMaterials[key] ?? materials[key]) : materials[key];

  const glassMaterial = useGlassMaterial(materials, isNight);

  const sailGeometry = React.useMemo(
    () =>
      smoothSailGeometry((nodes.Sidney_White_Border_0 as THREE.Mesh).geometry),
    [nodes.Sidney_White_Border_0],
  );

  const mergedTreeGeometry = useMergedTreeGeometry(nodes);

  const animatedWaterMaterial = useAnimatedWaterMaterial(
    materials.water_foam,
    sunDirection,
    isNight,
    dockLighting,
  );

  const dockLedMarkerPositions = React.useMemo<[number, number, number][]>(
    () =>
      DOCK_LED_MARKERS.map(([x, z]) => [
        x,
        DOCK_WATERLINE_Y - dockLighting.depth,
        z,
      ]),
    [dockLighting.depth],
  );

  return (
    <group position={[0, 0.6, 0]} dispose={null}>
      <NightFixtures
        isNight={isNight}
        sailFloodlights={sailFloodlights}
        dockLighting={dockLighting}
        dockLedMarkerPositions={dockLedMarkerPositions}
      />
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.0003}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <TaxiCars
            nodes={nodes}
            heroMaterial={heroMaterial}
            glassMaterial={glassMaterial}
          />
          <Trees
            nodes={nodes}
            heroMaterial={heroMaterial}
            mergedTreeGeometry={mergedTreeGeometry}
          />
          <group position={[904.35, 676.99, 907.95]} rotation={[0, 0.09, 0]}>
            <OperaHouseBuilding
              nodes={nodes}
              heroMaterial={heroMaterial}
              glassMaterial={glassMaterial}
              sailGeometry={sailGeometry}
            />
            <Streetlamps
              nodes={nodes}
              heroMaterial={heroMaterial}
              isNight={isNight}
              streetlampLighting={streetlampLighting}
            />
          </group>
          <Buildings
            nodes={nodes}
            heroMaterial={heroMaterial}
            animatedWaterMaterial={animatedWaterMaterial}
            isNight={isNight}
          />
          <Boats
            nodes={nodes}
            heroMaterial={heroMaterial}
            glassMaterial={glassMaterial}
          />
          <GroundAndWater
            nodes={nodes}
            heroMaterial={heroMaterial}
            animatedWaterMaterial={animatedWaterMaterial}
          />
        </group>
      </group>
    </group>
  );
};

export default Mesh;

useGLTF.preload(MODEL_PATH);
