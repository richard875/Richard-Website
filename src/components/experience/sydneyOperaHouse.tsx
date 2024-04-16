import React from "react";
import GUI from "lil-gui";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  ColorAverage,
  HueSaturation,
} from "@react-three/postprocessing";
import { Resolution, KernelSize, BlendFunction } from "postprocessing";
import Mesh from "./mesh";
import Inspector from "./inspector";
import { IS_DEV } from "../../constants/environment";
import { INTRO_SOH } from "../../constants/googleTags";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./shader";

const SydneyOperaHouse = React.memo(() => (
  <Canvas
    id={`${INTRO_SOH}_2`}
    className="canvas"
    shadows
    legacy={true}
    camera={{ position: [0, 2.6, 5], fov: 65 }}
  >
    <Model />
  </Canvas>
));

const Model = React.memo(() => {
  const cameraDirection = 50;
  const { scene } = useThree();

  // Hooks
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(0.2);
  const [hemiLightIntensity, setHemiLightIntensity] = React.useState(0.8);
  const [hemiLightColorX, setHemiLightColorX] = React.useState(0.62);
  const [hemiLightColorY, setHemiLightColorY] = React.useState(1);
  const [hemiLightColorZ, setHemiLightColorZ] = React.useState(0.6);
  const [hemiGroundColorX, setHemiGroundColorX] = React.useState(0.095);
  const [hemiGroundColorY, setHemiGroundColorY] = React.useState(1);
  const [hemiGroundColorZ, setHemiGroundColorZ] = React.useState(0.75);
  const [hemiPositionX, setHemiPositionX] = React.useState(0);
  const [hemiPositionY, setHemiPositionY] = React.useState(20);
  const [hemiPositionZ, setHemiPositionZ] = React.useState(0);
  const [dirLightIntensity, setDirLightIntensity] = React.useState(0.5);
  const [dirLightColorX, setDirLightColorX] = React.useState(0.1);
  const [dirLightColorY, setDirLightColorY] = React.useState(1);
  const [dirLightColorZ, setDirLightColorZ] = React.useState(0.95);
  const [dirPositionX, setDirPositionX] = React.useState(1.3);
  const [dirPositionY, setDirPositionY] = React.useState(1);
  const [dirPositionZ, setDirPositionZ] = React.useState(2);
  const [groundColorX, setGroundColorX] = React.useState(0.08);
  const [groundColorY, setGroundColorY] = React.useState(1);
  const [groundColorZ, setGroundColorZ] = React.useState(0.75);
  const [skyOffset, setSkyOffset] = React.useState(43);
  const [skyExponent, setSkyExponent] = React.useState(0.6);
  const [skySphereGeometryX, setSkySphereGeometryX] = React.useState(215);
  const [skySphereGeometryY, setSkySphereGeometryY] = React.useState(32);
  const [skySphereGeometryZ, setSkySphereGeometryZ] = React.useState(15);
  const [bloomIntensity, setBloomIntensity] = React.useState(10.0);
  const [luminanceThreshold, setLuminanceThreshold] = React.useState(1);
  const [luminanceSmoothing, setLuminanceSmoothing] = React.useState(0.5);
  const [brightness, setBrightness] = React.useState(0.15);
  const [contrast, setContrast] = React.useState(-0.2);
  const [hue, setHue] = React.useState(6);
  const [saturation, setSaturation] = React.useState(0.45);

  // Lights
  const hemiLightColor = new THREE.Color();
  hemiLightColor.setHSL(hemiLightColorX, hemiLightColorY, hemiLightColorZ);

  const hemiGroundColor = new THREE.Color();
  hemiGroundColor.setHSL(hemiGroundColorX, hemiGroundColorY, hemiGroundColorZ);

  const hemiPosition = new THREE.Vector3(
    hemiPositionX,
    hemiPositionY,
    hemiPositionZ
  );

  const dirLightColor = new THREE.Color();
  dirLightColor.setHSL(dirLightColorX, dirLightColorY, dirLightColorZ);

  const dirPosition = new THREE.Vector3(
    dirPositionX,
    dirPositionY,
    dirPositionZ
  );

  // Ground
  const groundColor = new THREE.Color();
  groundColor.setHSL(groundColorX, groundColorY, groundColorZ);

  const uniforms = React.useMemo(
    () => ({
      topColor: { value: hemiLightColor },
      bottomColor: { value: new THREE.Color(0xfad6a5) },
      offset: { value: skyOffset },
      exponent: { value: skyExponent },
    }),
    []
  );

  React.useEffect(() => {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 25);
    scene.fog.color.copy(uniforms["bottomColor"].value);

    // Lil GUI Settings
    if (IS_DEV) createPanel();
  }, []);

  const createPanel = () => {
    const panel = new GUI({ width: 310 });
    const ambientLightFolder = panel.addFolder("Ambient Light");
    const hemiLightFolder = panel.addFolder("Hemi Light");
    const dirLightFolder = panel.addFolder("Direct Light");
    const groundFolder = panel.addFolder("Ground");
    const skyFolder = panel.addFolder("Sky");
    const effectsFolder = panel.addFolder("Effects");
    panel.close();

    const settings = {
      ambientLightIntensity: ambientLightIntensity,
      hemiLightIntensity: hemiLightIntensity,
      hemiLightColorX: hemiLightColorX,
      hemiLightColorY: hemiLightColorY,
      hemiLightColorZ: hemiLightColorZ,
      hemiGroundColorX: hemiGroundColorX,
      hemiGroundColorY: hemiGroundColorY,
      hemiGroundColorZ: hemiGroundColorZ,
      hemiPositionX: hemiPositionX,
      hemiPositionY: hemiPositionY,
      hemiPositionZ: hemiPositionZ,
      dirLightIntensity: dirLightIntensity,
      dirLightColorX: dirLightColorX,
      dirLightColorY: dirLightColorY,
      dirLightColorZ: dirLightColorZ,
      dirPositionX: dirPositionX,
      dirPositionY: dirPositionY,
      dirPositionZ: dirPositionZ,
      groundColorX: groundColorX,
      groundColorY: groundColorY,
      groundColorZ: groundColorZ,
      skyOffset: skyOffset,
      skyExponent: skyExponent,
      skySphereGeometryX: skySphereGeometryX,
      skySphereGeometryY: skySphereGeometryY,
      skySphereGeometryZ: skySphereGeometryZ,
      bloomIntensity: bloomIntensity,
      luminanceThreshold: luminanceThreshold,
      luminanceSmoothing: luminanceSmoothing,
      brightness: brightness,
      contrast: contrast,
      hue: hue,
      saturation: saturation,
    };

    ambientLightFolder
      .add(settings, "ambientLightIntensity", 0, 2)
      .name("Intensity")
      .onChange((e: number) => setAmbientLightIntensity(e));
    hemiLightFolder
      .add(settings, "hemiLightIntensity", 0, 4)
      .name("Intensity")
      .onChange((e: number) => setHemiLightIntensity(e));
    hemiLightFolder
      .add(settings, "hemiLightColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setHemiLightColorX(e));
    hemiLightFolder
      .add(settings, "hemiLightColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setHemiLightColorY(e));
    hemiLightFolder
      .add(settings, "hemiLightColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setHemiLightColorZ(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorX", 0, 1)
      .name("Ground Color X")
      .onChange((e: number) => setHemiGroundColorX(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorY", 0, 2)
      .name("Ground Color Y")
      .onChange((e: number) => setHemiGroundColorY(e));
    hemiLightFolder
      .add(settings, "hemiGroundColorZ", 0, 1)
      .name("Ground Color Z")
      .onChange((e: number) => setHemiGroundColorZ(e));
    hemiLightFolder
      .add(settings, "hemiPositionX", -10, 10)
      .name("Position X")
      .onChange((e: number) => setHemiPositionX(e));
    hemiLightFolder
      .add(settings, "hemiPositionY", 0, 100)
      .name("Position Y")
      .onChange((e: number) => setHemiPositionY(e));
    hemiLightFolder
      .add(settings, "hemiPositionZ", -10, 10)
      .name("Position Z")
      .onChange((e: number) => setHemiPositionZ(e));
    dirLightFolder
      .add(settings, "dirLightIntensity", 0, 3.5)
      .name("Intensity")
      .onChange((e: number) => setDirLightIntensity(e));
    dirLightFolder
      .add(settings, "dirLightColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setDirLightColorX(e));
    dirLightFolder
      .add(settings, "dirLightColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setDirLightColorY(e));
    dirLightFolder
      .add(settings, "dirLightColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setDirLightColorZ(e));
    dirLightFolder
      .add(settings, "dirPositionX", -10, 10)
      .name("Position X")
      .onChange((e: number) => setDirPositionX(e));
    dirLightFolder
      .add(settings, "dirPositionY", 0, 100)
      .name("Position Y")
      .onChange((e: number) => setDirPositionY(e));
    dirLightFolder
      .add(settings, "dirPositionZ", -10, 10)
      .name("Position Z")
      .onChange((e: number) => setDirPositionZ(e));
    groundFolder
      .add(settings, "groundColorX", 0, 1)
      .name("Color X")
      .onChange((e: number) => setGroundColorX(e));
    groundFolder
      .add(settings, "groundColorY", 0, 2)
      .name("Color Y")
      .onChange((e: number) => setGroundColorY(e));
    groundFolder
      .add(settings, "groundColorZ", 0, 1)
      .name("Color Z")
      .onChange((e: number) => setGroundColorZ(e));
    skyFolder
      .add(settings, "skyOffset", 0, 100)
      .name("Offset")
      .onChange((e: number) => setSkyOffset(e));
    skyFolder
      .add(settings, "skyExponent", -2, 2)
      .name("Exponent")
      .onChange((e: number) => setSkyExponent(e));
    skyFolder
      .add(settings, "skySphereGeometryX", -500, 500)
      .name("Sphere Geometry X")
      .onChange((e: number) => setSkySphereGeometryX(e));
    skyFolder
      .add(settings, "skySphereGeometryY", -100, 100)
      .name("Sphere Geometry Y")
      .onChange((e: number) => setSkySphereGeometryY(e));
    skyFolder
      .add(settings, "skySphereGeometryZ", -100, 100)
      .name("Sphere Geometry Z")
      .onChange((e: number) => setSkySphereGeometryZ(e));
    effectsFolder
      .add(settings, "bloomIntensity", 0, 20)
      .name("Bloom Intensity")
      .onChange((e: number) => setBloomIntensity(e));
    effectsFolder
      .add(settings, "luminanceThreshold", 0, 2)
      .name("Luminance Threshold")
      .onChange((e: number) => setLuminanceThreshold(e));
    effectsFolder
      .add(settings, "luminanceSmoothing", 0, 1)
      .name("Luminance Smoothing")
      .onChange((e: number) => setLuminanceSmoothing(e));
    effectsFolder
      .add(settings, "brightness", -1, 1)
      .name("Brightness")
      .onChange((e: number) => setBrightness(e));
    effectsFolder
      .add(settings, "contrast", -1, 1)
      .name("Contrast")
      .onChange((e: number) => setContrast(e));
    effectsFolder
      .add(settings, "hue", -10, 10)
      .name("Hue")
      .onChange((e: number) => setHue(e));
    effectsFolder
      .add(settings, "saturation", -1, 2)
      .name("Saturation")
      .onChange((e: number) => setSaturation(e));
  };

  return (
    <React.Suspense fallback={null}>
      {/* Lights */}
      <ambientLight intensity={ambientLightIntensity} />
      <hemisphereLight
        color={hemiLightColor}
        groundColor={hemiGroundColor}
        intensity={hemiLightIntensity}
        position={hemiPosition}
      />
      <directionalLight
        color={dirLightColor}
        intensity={dirLightIntensity}
        position={dirPosition}
        castShadow={true}
        shadow-mapSize-width={3500}
        shadow-mapSize-height={3500}
        shadow-camera-left={-cameraDirection}
        shadow-camera-right={cameraDirection}
        shadow-camera-top={cameraDirection}
        shadow-camera-bottom={-cameraDirection}
        shadow-camera-far={3500}
        shadow-bias={-0.0001}
      />
      {/* Ground */}
      <mesh
        receiveShadow={true}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[50, 25]} />
        <meshLambertMaterial color={groundColor} />
      </mesh>
      {/* Sky */}
      <mesh>
        <sphereGeometry
          args={[skySphereGeometryX, skySphereGeometryY, skySphereGeometryZ]}
        />
        <shaderMaterial
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          uniforms={uniforms}
          side={THREE.BackSide}
        />
      </mesh>
      {/* Model */}
      <Inspector>
        <Mesh />
      </Inspector>
      {/* Effects */}
      <EffectComposer>
        <Bloom
          intensity={bloomIntensity} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          width={Resolution.AUTO_SIZE} // render width
          height={Resolution.AUTO_SIZE} // render height
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={luminanceThreshold} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={luminanceSmoothing} // smoothness of the luminance threshold. Range is [0, 1]
          blendFunction={BlendFunction.REFLECT} // blend mode
        />
        <BrightnessContrast
          brightness={brightness} // brightness. min: -1, max: 1
          contrast={contrast} // contrast: min -1, max: 1
        />
        <ColorAverage
          blendFunction={BlendFunction.OVERLAY} // blend mode
        />
        <HueSaturation
          blendFunction={BlendFunction.ALPHA} // blend mode
          hue={hue} // hue in radians
          saturation={saturation} // saturation in radians
        />
      </EffectComposer>
    </React.Suspense>
  );
});

export default SydneyOperaHouse;
