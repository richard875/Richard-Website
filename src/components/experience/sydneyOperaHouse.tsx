import React from "react";
import GUI from "lil-gui";
import * as THREE from "three";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { Float, Sparkles, Clouds, Cloud } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  ColorAverage,
  HueSaturation,
  Vignette,
  Noise,
  DepthOfField,
} from "@react-three/postprocessing";
import { Resolution, KernelSize, BlendFunction } from "postprocessing";
import Mesh from "./mesh";
import Inspector from "./inspector";
import { IS_DEV } from "../../constants/environment";
import { INTRO_SOH } from "../../constants/googleTags";
import { GLOBAL_VERTEX_SHADER, GLOBAL_FRAGMENT_SHADER } from "./shader";
import cloudTexture from "../../../static/models/sydneyOperaHouse/cloud.png";

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
  const { scene, camera } = useThree();

  // Hooks
  // three r155 removed `useLegacyLights`; light intensities are now physically
  // scaled and render dimmer. Multiply the original (three 0.154) values by PI
  // to restore the pre-r155 brightness the scene was tuned for.
  const [ambientLightIntensity, setAmbientLightIntensity] = React.useState(
    0.2 * Math.PI,
  );
  const [hemiLightIntensity, setHemiLightIntensity] = React.useState(
    0.8 * Math.PI,
  );
  const [hemiLightColorX, setHemiLightColorX] = React.useState(0.62);
  const [hemiLightColorY, setHemiLightColorY] = React.useState(1);
  const [hemiLightColorZ, setHemiLightColorZ] = React.useState(0.6);
  const [hemiGroundColorX, setHemiGroundColorX] = React.useState(0.095);
  const [hemiGroundColorY, setHemiGroundColorY] = React.useState(1);
  const [hemiGroundColorZ, setHemiGroundColorZ] = React.useState(0.75);
  const [hemiPositionX, setHemiPositionX] = React.useState(0);
  const [hemiPositionY, setHemiPositionY] = React.useState(20);
  const [hemiPositionZ, setHemiPositionZ] = React.useState(0);
  const [dirLightIntensity, setDirLightIntensity] = React.useState(
    0.5 * Math.PI,
  );
  const [dirLightColorX, setDirLightColorX] = React.useState(0.1);
  const [dirLightColorY, setDirLightColorY] = React.useState(1);
  const [dirLightColorZ, setDirLightColorZ] = React.useState(0.95);
  const [dirPositionX, setDirPositionX] = React.useState(
    Math.random() * 20 - 10,
  );
  const [dirPositionY, setDirPositionY] = React.useState(1);
  const [dirPositionZ, setDirPositionZ] = React.useState(
    Math.floor(Math.random() * 10) + 1,
  );
  const [groundColorX, setGroundColorX] = React.useState(0.08);
  const [groundColorY, setGroundColorY] = React.useState(1);
  const [groundColorZ, setGroundColorZ] = React.useState(0.75);
  const [skyOffset, setSkyOffset] = React.useState(43);
  const [skyExponent, setSkyExponent] = React.useState(0.6);
  const [skySphereGeometryX, setSkySphereGeometryX] = React.useState(215);
  const [skySphereGeometryY, setSkySphereGeometryY] = React.useState(0);
  const [skySphereGeometryZ, setSkySphereGeometryZ] = React.useState(15);
  const [bloomIntensity, setBloomIntensity] = React.useState(10.0);
  const [luminanceThreshold, setLuminanceThreshold] = React.useState(1);
  const [luminanceSmoothing, setLuminanceSmoothing] = React.useState(0.5);
  const [brightness, setBrightness] = React.useState(0.15);
  const [contrast, setContrast] = React.useState(-0.2);
  const [hue, setHue] = React.useState(6);
  const [saturation, setSaturation] = React.useState(0.4);
  const [sparklesOpacity, setSparklesOpacity] = React.useState(0.2);
  const [cloudOpacity, setCloudOpacity] = React.useState(0.95);
  const [floatIntensity, setFloatIntensity] = React.useState(2);
  const [parallaxStrength, setParallaxStrength] = React.useState(2);
  const [vignetteDarkness, setVignetteDarkness] = React.useState(0.65);
  const [noiseOpacity, setNoiseOpacity] = React.useState(0.025);
  const [dofFocusRange, setDofFocusRange] = React.useState(8.5);
  const [dofBokehScale, setDofBokehScale] = React.useState(5);
  const [groundCloudGap, setGroundCloudGap] = React.useState(2.5);

  // Lights
  const hemiLightColor = new THREE.Color();
  hemiLightColor.setHSL(hemiLightColorX, hemiLightColorY, hemiLightColorZ);

  const hemiGroundColor = new THREE.Color();
  hemiGroundColor.setHSL(hemiGroundColorX, hemiGroundColorY, hemiGroundColorZ);

  const hemiPosition = new THREE.Vector3(
    hemiPositionX,
    hemiPositionY,
    hemiPositionZ,
  );

  const dirLightColor = new THREE.Color();
  dirLightColor.setHSL(dirLightColorX, dirLightColorY, dirLightColorZ);

  const dirPosition = new THREE.Vector3(
    dirPositionX,
    dirPositionY,
    dirPositionZ,
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
    [],
  );

  React.useEffect(() => {
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 25);
    scene.fog.color.copy(uniforms["bottomColor"].value);

    // Lil GUI Settings
    if (IS_DEV) createPanel();
  }, []);

  // Subtle camera parallax that drifts toward the pointer for a sense of depth.
  useFrame((state, delta) => {
    const targetX = state.pointer.x * parallaxStrength;
    const targetY = 2.8 + state.pointer.y * parallaxStrength * 0.4;
    camera.position.x = THREE.MathUtils.damp(
      camera.position.x,
      targetX,
      10,
      delta,
    );
    camera.position.y = THREE.MathUtils.damp(
      camera.position.y,
      targetY,
      10,
      delta,
    );
    camera.lookAt(0, 0.5, 0);
  });

  const createPanel = () => {
    const panel = new GUI({ width: 310 });
    const ambientLightFolder = panel.addFolder("Ambient Light");
    const hemiLightFolder = panel.addFolder("Hemi Light");
    const dirLightFolder = panel.addFolder("Direct Light");
    const groundFolder = panel.addFolder("Ground");
    const skyFolder = panel.addFolder("Sky");
    const atmosphereFolder = panel.addFolder("Atmosphere");
    const effectsFolder = panel.addFolder("Effects");
    panel.close();

    // Position the lil-gui panel at the top-left so it doesn't block the view
    (panel as any).domElement.style.position = "absolute";
    (panel as any).domElement.style.top = "0px";
    (panel as any).domElement.style.left = "30px";
    (panel as any).domElement.style.right = "auto";
    (panel as any).domElement.style.zIndex = "1000";
    (panel as any).domElement.style.border = "1px solid #ccc";

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
      sparklesOpacity: sparklesOpacity,
      cloudOpacity: cloudOpacity,
      floatIntensity: floatIntensity,
      parallaxStrength: parallaxStrength,
      vignetteDarkness: vignetteDarkness,
      noiseOpacity: noiseOpacity,
      dofFocusRange: dofFocusRange,
      dofBokehScale: dofBokehScale,
      groundCloudGap: groundCloudGap,
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
    atmosphereFolder
      .add(settings, "sparklesOpacity", 0, 1)
      .name("Sparkles Opacity")
      .onChange((e: number) => setSparklesOpacity(e));
    atmosphereFolder
      .add(settings, "cloudOpacity", 0, 1)
      .name("Cloud Opacity")
      .onChange((e: number) => setCloudOpacity(e));
    atmosphereFolder
      .add(settings, "floatIntensity", 0, 10)
      .name("Float Intensity")
      .onChange((e: number) => setFloatIntensity(e));
    atmosphereFolder
      .add(settings, "parallaxStrength", 0, 5)
      .name("Parallax Strength")
      .onChange((e: number) => setParallaxStrength(e));
    atmosphereFolder
      .add(settings, "groundCloudGap", 0, 10)
      .name("Ground/Cloud Gap")
      .onChange((e: number) => setGroundCloudGap(e));
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
      .add(settings, "saturation", -3, 5)
      .name("Saturation")
      .onChange((e: number) => setSaturation(e));
    effectsFolder
      .add(settings, "vignetteDarkness", 0, 1)
      .name("Vignette Darkness")
      .onChange((e: number) => setVignetteDarkness(e));
    effectsFolder
      .add(settings, "noiseOpacity", 0, 0.2)
      .name("Noise Opacity")
      .onChange((e: number) => setNoiseOpacity(e));
    effectsFolder
      .add(settings, "dofFocusRange", 0.2, 10)
      .name("Focus Range")
      .onChange((e: number) => setDofFocusRange(e));
    effectsFolder
      .add(settings, "dofBokehScale", 0, 10)
      .name("Bokeh Scale")
      .onChange((e: number) => setDofBokehScale(e));
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
      <group position={[0, -groundCloudGap, 0]}>
        <mesh
          receiveShadow={true}
          position={[0, -0.5, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[50, 25]} />
          <meshLambertMaterial color={groundColor} />
        </mesh>
      </group>
      {/* Sky */}
      <mesh>
        <sphereGeometry
          args={[skySphereGeometryX, skySphereGeometryY, skySphereGeometryZ]}
        />
        <shaderMaterial
          vertexShader={GLOBAL_VERTEX_SHADER}
          fragmentShader={GLOBAL_FRAGMENT_SHADER}
          uniforms={uniforms}
          side={THREE.BackSide}
        />
      </mesh>
      <Sparkles
        count={60}
        scale={[4, 2.2, 4]}
        size={1.8}
        speed={0.25}
        opacity={sparklesOpacity}
        color="#fff3e0"
        position={[0, 0.6, 0]}
      />
      {/* Model */}
      <Float
        speed={1.2}
        rotationIntensity={0}
        floatIntensity={floatIntensity}
        floatingRange={[-0.06, 0.06]}
      >
        <group position={[0, -groundCloudGap, 0]}>
          {/* Atmosphere */}
          {/* Unlit material so the haze reads as the fog/horizon colour itself,
              rather than being tinted by the hemisphere light's blue/orange mix. */}
          <Clouds
            material={THREE.MeshBasicMaterial}
            limit={400}
            texture={cloudTexture}
          >
            <Cloud
              seed={1}
              bounds={[4.5, 0.6, 3.5]}
              volume={5}
              smallestVolume={0.85}
              segments={34}
              color="#ffe3ec"
              opacity={cloudOpacity}
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
              color="#ffcad4"
              opacity={cloudOpacity * 0.95}
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
              color="#ffe0c8"
              opacity={cloudOpacity * 0.9}
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
              color="#ffb8c6"
              opacity={cloudOpacity * 0.85}
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
              color="#fff0e8"
              opacity={cloudOpacity * 0.85}
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
              color="#ffcad4"
              opacity={cloudOpacity * 0.8}
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
              color="#ffe0c8"
              opacity={cloudOpacity * 0.7}
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
              color="#f5c6d6"
              opacity={cloudOpacity * 0.7}
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
              color="#ffb8c6"
              opacity={cloudOpacity * 0.9}
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
              color="#ffe3ec"
              opacity={cloudOpacity * 0.9}
              fade={2}
              growth={1.5}
              speed={0.13}
              position={[1.5, 0.05, 3.8]}
            />
          </Clouds>
        </group>
        <Inspector>
          <Mesh sunDirection={dirPosition} />
        </Inspector>
      </Float>
      {/* Effects */}
      <EffectComposer>
        <DepthOfField
          target={[0, 0.45, 0]} // keep the model in focus, let everything else go dreamy
          focusRange={dofFocusRange} // world-unit band around the model that stays sharp
          bokehScale={dofBokehScale} // strength of the soft blur outside that band
        />
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
        <Vignette
          offset={0.3} // vignette offset
          darkness={vignetteDarkness} // vignette darkness
          blendFunction={BlendFunction.NORMAL} // blend mode
        />
        <Noise
          opacity={noiseOpacity} // grain opacity
          blendFunction={BlendFunction.OVERLAY} // blend mode
        />
      </EffectComposer>
    </React.Suspense>
  );
});

export default SydneyOperaHouse;
