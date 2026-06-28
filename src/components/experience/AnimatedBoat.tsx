import React from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface WaveComponent {
  amplitude: number;
  frequency: number;
  direction: THREE.Vector2;
  phase: number;
  speed: number;
}

interface BoatPhysicsState {
  position: THREE.Vector3;
  rotation: THREE.Euler;
  velocity: THREE.Vector3;
  angularVelocity: THREE.Euler;
}

export type AnimatedBoatProps = {
  children: React.ReactNode;
  position: [number, number, number];
  rotation: [number, number, number];
  speed?: number;
  amplitude?: number;
  drift?: number;
  phase?: number;
  boatLength?: number;
  boatWidth?: number;
  orientationOffset?: [number, number, number];
};

const createWaveField = (
  baseSpeed: number,
  baseAmplitude: number,
  phase: number,
): WaveComponent[] => [
  {
    amplitude: baseAmplitude * 0.6,
    frequency: 0.0006,
    direction: new THREE.Vector2(1, 0.15).normalize(),
    phase: phase,
    speed: baseSpeed * 0.9,
  },
  {
    amplitude: baseAmplitude * 0.35,
    frequency: 0.0011,
    direction: new THREE.Vector2(0.8, -0.3).normalize(),
    phase: phase + 1.2,
    speed: baseSpeed * 1.15,
  },
  {
    amplitude: baseAmplitude * 0.2,
    frequency: 0.0018,
    direction: new THREE.Vector2(0.4, 0.9).normalize(),
    phase: phase + 2.7,
    speed: baseSpeed * 1.4,
  },
  {
    amplitude: baseAmplitude * 0.1,
    frequency: 0.0028,
    direction: new THREE.Vector2(-0.2, 1).normalize(),
    phase: phase + 4.1,
    speed: baseSpeed * 1.7,
  },
];

const sampleWaveHeight = (
  waves: WaveComponent[],
  x: number,
  z: number,
  time: number,
): number => {
  let height = 0;
  for (const wave of waves) {
    const dot = wave.direction.x * x + wave.direction.y * z;
    height +=
      wave.amplitude *
      Math.sin(wave.frequency * dot - wave.speed * time + wave.phase);
  }
  return height;
};

const AnimatedBoat = ({
  children,
  position,
  rotation,
  speed = 1.0,
  amplitude = 0.15,
  drift = 0.08,
  phase = 0,
  boatLength = 40,
  boatWidth = 12,
  orientationOffset = [0, 0, 0],
}: AnimatedBoatProps) => {
  const groupRef = React.useRef<THREE.Group>(null);
  const basePosition = React.useMemo(
    () => new THREE.Vector3(position[0], position[1], position[2]),
    [position[0], position[1], position[2]],
  );
  const baseRotation = React.useMemo(
    () => new THREE.Euler(rotation[0], rotation[1], rotation[2]),
    [rotation[0], rotation[1], rotation[2]],
  );
  const orientationOffsetEuler = React.useMemo(
    () =>
      new THREE.Euler(
        orientationOffset[0],
        orientationOffset[1],
        orientationOffset[2],
      ),
    [orientationOffset[0], orientationOffset[1], orientationOffset[2]],
  );

  const motionSeed = React.useRef((Math.random() - 0.5) * Math.PI * 2);
  const motionPhase = phase + motionSeed.current;
  const waves = React.useMemo(
    () => createWaveField(speed, amplitude, motionPhase),
    [speed, amplitude, motionPhase],
  );
  const stateRef = React.useRef<BoatPhysicsState>({
    position: basePosition.clone(),
    rotation: baseRotation.clone(),
    velocity: new THREE.Vector3(),
    angularVelocity: new THREE.Euler(),
  });

  React.useLayoutEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.copy(basePosition);
      groupRef.current.rotation.copy(baseRotation);
    }
  }, [basePosition, baseRotation]);

  const samplePoints = React.useMemo(() => {
    const halfL = boatLength * 0.5;
    const halfW = boatWidth * 0.5;
    return [
      { name: "center", offset: new THREE.Vector3(0, 0, 0) },
      { name: "bow", offset: new THREE.Vector3(0, 0, halfL) },
      { name: "stern", offset: new THREE.Vector3(0, 0, -halfL) },
      { name: "port", offset: new THREE.Vector3(-halfW, 0, 0) },
      { name: "starboard", offset: new THREE.Vector3(halfW, 0, 0) },
      {
        name: "bowPort",
        offset: new THREE.Vector3(-halfW * 0.6, 0, halfL * 0.6),
      },
      {
        name: "bowStarboard",
        offset: new THREE.Vector3(halfW * 0.6, 0, halfL * 0.6),
      },
      {
        name: "sternPort",
        offset: new THREE.Vector3(-halfW * 0.6, 0, -halfL * 0.6),
      },
      {
        name: "sternStarboard",
        offset: new THREE.Vector3(halfW * 0.6, 0, -halfL * 0.6),
      },
    ];
  }, [boatLength, boatWidth]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();

    const heights = samplePoints.map((p) => {
      const offset = p.offset.clone().applyEuler(baseRotation);
      const sampleX = basePosition.x + offset.x;
      const sampleZ = basePosition.z + offset.z;
      return {
        point: p.name,
        height: sampleWaveHeight(waves, sampleX, sampleZ, elapsed),
      };
    });

    const centerHeight = heights.find((h) => h.point === "center")?.height ?? 0;
    const bowHeight = heights.find((h) => h.point === "bow")?.height ?? 0;
    const sternHeight = heights.find((h) => h.point === "stern")?.height ?? 0;
    const portHeight = heights.find((h) => h.point === "port")?.height ?? 0;
    const starboardHeight =
      heights.find((h) => h.point === "starboard")?.height ?? 0;
    const bowPortHeight =
      heights.find((h) => h.point === "bowPort")?.height ?? 0;
    const bowStarboardHeight =
      heights.find((h) => h.point === "bowStarboard")?.height ?? 0;
    const sternPortHeight =
      heights.find((h) => h.point === "sternPort")?.height ?? 0;
    const sternStarboardHeight =
      heights.find((h) => h.point === "sternStarboard")?.height ?? 0;

    const pitch = (bowHeight - sternHeight) / boatLength;
    const roll = (starboardHeight - portHeight) / boatWidth;

    const bowRoll = (bowStarboardHeight - bowPortHeight) / (boatWidth * 0.6);
    const sternRoll =
      (sternStarboardHeight - sternPortHeight) / (boatWidth * 0.6);
    const yaw = (bowRoll - sternRoll) * 0.35;

    const timePitch = Math.sin(elapsed * speed * 0.95 + motionPhase) * 0.0384;
    const timeRoll =
      Math.cos(elapsed * speed * 0.8 + motionPhase * 1.15) * 0.032;
    const timeYaw =
      Math.sin(elapsed * speed * 0.55 + motionPhase * 0.7) * 0.0192;

    const targetY = basePosition.y + centerHeight + amplitude * 0.3;

    const driftTime = elapsed * speed * 0.15 + motionSeed.current * 0.35;
    const driftX = Math.sin(driftTime + motionPhase) * drift * 0.5;
    const driftZ = Math.cos(driftTime * 0.85 + motionPhase * 1.3) * drift * 0.5;

    const swayTime = elapsed * speed * 0.8 + motionPhase * 2.1;
    const swayX = Math.sin(swayTime + motionSeed.current) * amplitude * 0.3;
    const swayZ =
      Math.cos(swayTime * 1.2 + motionSeed.current * 0.6) * amplitude * 0.25;

    const state = stateRef.current;
    const posLerp = 0.08;
    const rotLerp = 0.1;

    state.position.lerp(
      new THREE.Vector3(
        basePosition.x + driftX + swayX,
        targetY,
        basePosition.z + driftZ + swayZ,
      ),
      posLerp,
    );

    const maxRoll = THREE.MathUtils.degToRad(11.52);
    const maxPitch = THREE.MathUtils.degToRad(7.68);
    const maxYaw = THREE.MathUtils.degToRad(5.12);

    const targetRotation = new THREE.Euler(
      baseRotation.x +
        THREE.MathUtils.clamp(pitch * 0.864 + timePitch, -maxPitch, maxPitch) +
        orientationOffsetEuler.x,
      baseRotation.y +
        THREE.MathUtils.clamp(yaw * 0.768 + timeYaw, -maxYaw, maxYaw) +
        orientationOffsetEuler.y,
      baseRotation.z -
        THREE.MathUtils.clamp(roll * 0.864 + timeRoll, -maxRoll, maxRoll) +
        orientationOffsetEuler.z,
    );

    state.rotation.x = THREE.MathUtils.lerp(
      state.rotation.x,
      targetRotation.x,
      rotLerp,
    );
    state.rotation.y = THREE.MathUtils.lerp(
      state.rotation.y,
      targetRotation.y,
      rotLerp * 0.6,
    );
    state.rotation.z = THREE.MathUtils.lerp(
      state.rotation.z,
      targetRotation.z,
      rotLerp,
    );

    groupRef.current.position.copy(state.position);
    groupRef.current.rotation.copy(state.rotation);
  });

  return <group ref={groupRef}>{children}</group>;
};

export default AnimatedBoat;
