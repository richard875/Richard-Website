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

  // The boat's own rotation is fixed after mount (baseRotation only changes
  // if the position/rotation props themselves change), so each sample
  // point's rotated offset from the hull center is constant too - it was
  // previously being recomputed via a fresh Vector3.clone().applyEuler()
  // for all 9 points, on every frame, for each of the 3 boats on screen.
  // Resolving each offset to a plain {x, z} once here turns that into a
  // zero-allocation lookup in the per-frame loop below.
  const sampleOffsets = React.useMemo(() => {
    const halfL = boatLength * 0.5;
    const halfW = boatWidth * 0.5;
    const rotated = (x: number, z: number) => {
      const v = new THREE.Vector3(x, 0, z).applyEuler(baseRotation);
      return { x: v.x, z: v.z };
    };
    return {
      center: rotated(0, 0),
      bow: rotated(0, halfL),
      stern: rotated(0, -halfL),
      port: rotated(-halfW, 0),
      starboard: rotated(halfW, 0),
      bowPort: rotated(-halfW * 0.6, halfL * 0.6),
      bowStarboard: rotated(halfW * 0.6, halfL * 0.6),
      sternPort: rotated(-halfW * 0.6, -halfL * 0.6),
      sternStarboard: rotated(halfW * 0.6, -halfL * 0.6),
    };
  }, [boatLength, boatWidth, baseRotation]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;

    const elapsed = clock.getElapsedTime();

    const heightAt = (offset: { x: number; z: number }) =>
      sampleWaveHeight(
        waves,
        basePosition.x + offset.x,
        basePosition.z + offset.z,
        elapsed,
      );

    const centerHeight = heightAt(sampleOffsets.center);
    const bowHeight = heightAt(sampleOffsets.bow);
    const sternHeight = heightAt(sampleOffsets.stern);
    const portHeight = heightAt(sampleOffsets.port);
    const starboardHeight = heightAt(sampleOffsets.starboard);
    const bowPortHeight = heightAt(sampleOffsets.bowPort);
    const bowStarboardHeight = heightAt(sampleOffsets.bowStarboard);
    const sternPortHeight = heightAt(sampleOffsets.sternPort);
    const sternStarboardHeight = heightAt(sampleOffsets.sternStarboard);

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

    // Lerped component-by-component (rather than via a fresh
    // `new THREE.Vector3(...)` handed to `Vector3.lerp`) so this allocates
    // nothing - this runs 3x/frame (one AnimatedBoat per yacht), and a
    // scalar MathUtils.lerp is exactly what Vector3.lerp does internally
    // anyway, just without the temporary target object.
    state.position.x = THREE.MathUtils.lerp(
      state.position.x,
      basePosition.x + driftX + swayX,
      posLerp,
    );
    state.position.y = THREE.MathUtils.lerp(state.position.y, targetY, posLerp);
    state.position.z = THREE.MathUtils.lerp(
      state.position.z,
      basePosition.z + driftZ + swayZ,
      posLerp,
    );

    const maxRoll = THREE.MathUtils.degToRad(11.52);
    const maxPitch = THREE.MathUtils.degToRad(7.68);
    const maxYaw = THREE.MathUtils.degToRad(5.12);

    // Same idea as above - the target Euler angles are computed as plain
    // numbers and lerped directly into state.rotation, instead of
    // allocating a `new THREE.Euler(...)` purely to read its x/y/z back out
    // one line later.
    const targetRotationX =
      baseRotation.x +
      THREE.MathUtils.clamp(pitch * 0.864 + timePitch, -maxPitch, maxPitch) +
      orientationOffsetEuler.x;
    const targetRotationY =
      baseRotation.y +
      THREE.MathUtils.clamp(yaw * 0.768 + timeYaw, -maxYaw, maxYaw) +
      orientationOffsetEuler.y;
    const targetRotationZ =
      baseRotation.z -
      THREE.MathUtils.clamp(roll * 0.864 + timeRoll, -maxRoll, maxRoll) +
      orientationOffsetEuler.z;

    state.rotation.x = THREE.MathUtils.lerp(
      state.rotation.x,
      targetRotationX,
      rotLerp,
    );
    state.rotation.y = THREE.MathUtils.lerp(
      state.rotation.y,
      targetRotationY,
      rotLerp * 0.6,
    );
    state.rotation.z = THREE.MathUtils.lerp(
      state.rotation.z,
      targetRotationZ,
      rotLerp,
    );

    groupRef.current.position.copy(state.position);
    groupRef.current.rotation.copy(state.rotation);
  });

  return <group ref={groupRef}>{children}</group>;
};

export default AnimatedBoat;
