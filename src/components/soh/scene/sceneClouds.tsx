import React from "react";
import * as THREE from "three";
import { Clouds, Cloud } from "@react-three/drei";
import cloudTexture from "../../../../static/models/cloud.png";

// The background atmosphere puffs. Unlit material (MeshBasicMaterial) so the
// haze reads as the fog/horizon colour itself, rather than being tinted by
// the hemisphere light's blue/orange mix. `cloudColor`/`resolveCloudOpacity`
// come from useDayNightLighting and gui `cloudOpacity` respectively - see
// the callers in sydneyOperaHouse.tsx.
export const SceneClouds = ({
  cloudColor,
  resolveCloudOpacity,
}: {
  cloudColor: (dayColor: string) => string | THREE.Color;
  resolveCloudOpacity: (mult: number) => number;
}) => (
  <Clouds material={THREE.MeshBasicMaterial} limit={400} texture={cloudTexture}>
    <Cloud
      seed={1}
      bounds={[4.5, 0.6, 3.5]}
      volume={5}
      smallestVolume={0.85}
      segments={34}
      color={cloudColor("#ffe3ec")}
      opacity={resolveCloudOpacity(1)}
      fade={2}
      growth={1.5}
      speed={0.08}
      position={[-2.6, -0.15, -1.8]}
    />
    <Cloud
      seed={7}
      bounds={[4.5, 0.6, 3.5]}
      volume={4.6}
      smallestVolume={0.85}
      segments={34}
      color={cloudColor("#ffcad4")}
      opacity={resolveCloudOpacity(0.95)}
      fade={2}
      growth={1.5}
      speed={0.1}
      position={[2.6, -0.25, -2]}
    />
    <Cloud
      seed={13}
      bounds={[4.5, 0.5, 4]}
      volume={4.2}
      smallestVolume={0.85}
      segments={32}
      color={cloudColor("#ffe0c8")}
      opacity={resolveCloudOpacity(0.9)}
      fade={2}
      growth={1.5}
      speed={0.07}
      position={[0.2, -0.35, 2.6]}
    />
    <Cloud
      seed={21}
      bounds={[3.5, 0.5, 3]}
      volume={3.6}
      smallestVolume={0.85}
      segments={28}
      color={cloudColor("#ffb8c6")}
      opacity={resolveCloudOpacity(0.85)}
      fade={2}
      growth={1.5}
      speed={0.09}
      position={[-2, -0.05, 2]}
    />
    <Cloud
      seed={29}
      bounds={[3.5, 0.5, 3]}
      volume={3.6}
      smallestVolume={0.85}
      segments={28}
      color={cloudColor("#fff0e8")}
      opacity={resolveCloudOpacity(0.85)}
      fade={2}
      growth={1.5}
      speed={0.11}
      position={[2.2, 0.05, 1.6]}
    />
    <Cloud
      seed={37}
      bounds={[3.5, 0.45, 3]}
      volume={3.2}
      smallestVolume={0.85}
      segments={26}
      color={cloudColor("#ffcad4")}
      opacity={resolveCloudOpacity(0.8)}
      fade={2}
      growth={1.5}
      speed={0.06}
      position={[0, -0.05, -0.2]}
    />
    <Cloud
      seed={43}
      bounds={[3, 0.4, 2.5]}
      volume={2.8}
      smallestVolume={0.85}
      segments={20}
      color={cloudColor("#ffe0c8")}
      opacity={resolveCloudOpacity(0.7)}
      fade={2}
      growth={1.5}
      speed={0.1}
      position={[-1, -0.15, 0.5]}
    />
    <Cloud
      seed={51}
      bounds={[3, 0.4, 2.5]}
      volume={2.8}
      smallestVolume={0.85}
      segments={20}
      color={cloudColor("#f5c6d6")}
      opacity={resolveCloudOpacity(0.7)}
      fade={2}
      growth={1.5}
      speed={0.12}
      position={[1.2, -0.15, -0.8]}
    />
    {/* Foreground puffs closest to camera, filling the gap at the bottom of frame */}
    <Cloud
      seed={59}
      bounds={[3.5, 0.5, 2]}
      volume={4.2}
      smallestVolume={0.85}
      segments={26}
      color={cloudColor("#ffb8c6")}
      opacity={resolveCloudOpacity(0.9)}
      fade={2}
      growth={1.5}
      speed={0.1}
      position={[-1.5, -0.05, 3.6]}
    />
    <Cloud
      seed={67}
      bounds={[3.5, 0.5, 2]}
      volume={4.2}
      smallestVolume={0.85}
      segments={26}
      color={cloudColor("#ffe3ec")}
      opacity={resolveCloudOpacity(0.9)}
      fade={2}
      growth={1.5}
      speed={0.13}
      position={[1.5, 0.05, 3.8]}
    />
  </Clouds>
);
