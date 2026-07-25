import React from "react";
import * as THREE from "three";

// The scene's 3 base lights (ambient/hemisphere/directional) - the only
// lights present in day mode; night mode layers the sail floodlights, dock
// lights and streetlamps (see mesh/sceneParts/NightFixtures.tsx etc.) on
// top of these same 3.
const SceneLights = ({
  ambientIntensity,
  hemiColor,
  hemiGroundColor,
  hemiIntensity,
  hemiPosition,
  dirColor,
  dirIntensity,
  dirPosition,
  shadowCameraExtent,
}: {
  ambientIntensity: number;
  hemiColor: THREE.Color;
  hemiGroundColor: THREE.Color;
  hemiIntensity: number;
  hemiPosition: THREE.Vector3;
  dirColor: THREE.Color;
  dirIntensity: number;
  dirPosition: THREE.Vector3;
  shadowCameraExtent: number;
}) => (
  <>
    <ambientLight intensity={ambientIntensity} />
    <hemisphereLight
      color={hemiColor}
      groundColor={hemiGroundColor}
      intensity={hemiIntensity}
      position={hemiPosition}
    />
    <directionalLight
      color={dirColor}
      intensity={dirIntensity}
      position={dirPosition}
      castShadow={true}
      // 2048 across a tight +/-5 unit frustum resolves the model far more
      // sharply than 3500 ever did across +/-50, at roughly a third of the
      // shadow-pass texel cost.
      shadow-mapSize-width={2048}
      shadow-mapSize-height={2048}
      shadow-camera-left={-shadowCameraExtent}
      shadow-camera-right={shadowCameraExtent}
      shadow-camera-top={shadowCameraExtent}
      shadow-camera-bottom={-shadowCameraExtent}
      shadow-camera-far={20}
      shadow-bias={-0.0001}
    />
  </>
);

export default SceneLights;
