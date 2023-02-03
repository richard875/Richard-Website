import * as React from "react";
import * as THREE from "three";
import { Canvas, useThree } from "@react-three/fiber";
import {
  EffectComposer,
  Bloom,
  BrightnessContrast,
  ColorAverage,
  HueSaturation,
} from "@react-three/postprocessing";
import { Resizer, KernelSize, BlendFunction } from "postprocessing";
import Mesh from "./mesh";
import Inspector from "./inspector";

const VERTEX_SHADER = `varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

const FRAGMENT_SHADER = `uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

const SydneyOperaHouse = () => {
  return (
    <Canvas
      shadows
      colorManagement
      dpr={[1, 2]}
      camera={{ position: [0, 2.6, 5], fov: 65 }}
      style={{ background: "#fff8f0" }}
    >
      <Model />
    </Canvas>
  );
};

const Model = () => {
  const sydneyOperaHouseRef = React.useRef();
  const { scene } = useThree();

  React.useEffect(() => {
    // Scene
    scene.background = new THREE.Color().setHSL(0.6, 0, 1);
    scene.fog = new THREE.Fog(scene.background, 1, 25);

    // Lights
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.62, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(-2, 1.3, 2);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 3500;
    dirLight.shadow.mapSize.height = 3500;

    const d = 50;

    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = -0.0001;

    // Ground
    const groundGeo = new THREE.PlaneGeometry(50, 25);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xfad6a5 });
    groundMat.color.setHSL(0.095, 1, 0.75);

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = -1;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Sky
    const uniforms = {
      topColor: { value: new THREE.Color(0x0077ff) },
      bottomColor: { value: new THREE.Color(0xfad6a5) },
      offset: { value: 43 },
      exponent: { value: 0.6 },
    };
    uniforms["topColor"].value.copy(hemiLight.color);

    scene.fog.color.copy(uniforms["bottomColor"].value);

    const skyGeo = new THREE.SphereGeometry(200, 32, 15);
    const skyMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      side: THREE.BackSide,
    });

    const sky = new THREE.Mesh(skyGeo, skyMat);
    scene.add(sky);
  }, []);

  return (
    <>
      <ambientLight intensity={0.2} />
      <Inspector>
        <Mesh ref={sydneyOperaHouseRef} />
      </Inspector>
      <EffectComposer>
        <Bloom
          intensity={10.0} // The bloom intensity.
          blurPass={undefined} // A blur pass.
          width={Resizer.AUTO_SIZE} // render width
          height={Resizer.AUTO_SIZE} // render height
          kernelSize={KernelSize.LARGE} // blur kernel size
          luminanceThreshold={1} // luminance threshold. Raise this value to mask out darker elements in the scene.
          luminanceSmoothing={0.5} // smoothness of the luminance threshold. Range is [0, 1]
          //   blendFunction={BlendFunction.VIVID_LIGHT} // blend mode
          blendFunction={BlendFunction.REFLECT} // blend mode
        />
        <BrightnessContrast
          brightness={0.04} // brightness. min: -1, max: 1
          contrast={0.15} // contrast: min -1, max: 1
        />
        <ColorAverage
          blendFunction={BlendFunction.OVERLAY} // blend mode
        />
        <HueSaturation
          blendFunction={BlendFunction.ALPHA} // blend mode
          hue={6} // hue in radians
          saturation={0.45} // saturation in radians
        />
      </EffectComposer>
    </>
  );
};

export default SydneyOperaHouse;
