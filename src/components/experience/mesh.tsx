import React from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const MODEL_PATH = "/models/sydneyOperaHouse/sydneyOperaHouse.gltf";

const Mesh = () => {
  const { nodes, materials } = useLoader(GLTFLoader, MODEL_PATH);

  return (
    <group position={[0, 0.25, 0]} dispose={null}>
      <group rotation={[-Math.PI / 2, 0, 0]} scale={0.0003}>
        <group rotation={[Math.PI / 2, 0, 0]}>
          <group position={[588.78, 396.08, 2376.67]}>
            <group position={[912.45, 66.51, -141.47]} rotation={[0, 1.4, 0]}>
              <group
                position={[202.06, 22.85, 492.26]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_car_0 as THREE.Mesh).geometry
                  }
                  material={materials.material}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Glass_0 as THREE.Mesh).geometry
                  }
                  material={materials.Glass}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Pipe_1_0 as THREE.Mesh).geometry
                  }
                  material={materials.Pipe_1}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_Ship_0 as THREE.Mesh).geometry
                  }
                  material={materials.Ship}
                />
              </group>
              <mesh
                geometry={(nodes.Wheels_1_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.82, 527.04]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.wheels_1_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.61, 528.68]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.Wheels_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.82, 454.97]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={(nodes.wheels_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.61, 453.33]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </group>
            <group
              position={[632.39, 66.51, -141.47]}
              rotation={[Math.PI, 1.48, -Math.PI]}
            >
              <group
                position={[202.06, 22.85, 492.26]}
                rotation={[0, -Math.PI / 2, 0]}
              >
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_car_0 as THREE.Mesh).geometry
                  }
                  material={materials.car_0}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Glass_0 as THREE.Mesh).geometry
                  }
                  material={materials.Glass}
                />
                <mesh
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Pipe_1_0 as THREE.Mesh).geometry
                  }
                  material={materials.Pipe_1}
                />
                <mesh
                  castShadow
                  receiveShadow
                  geometry={
                    (nodes.Car_Sedan_Taxi_1_2_Ship_0 as THREE.Mesh).geometry
                  }
                  material={materials.Ship}
                />
              </group>
              <mesh
                geometry={(nodes.Wheels_1_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.82, 527.04]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.wheels_1_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.61, 528.68]}
                rotation={[-Math.PI / 2, 0, Math.PI]}
              />
              <mesh
                geometry={(nodes.Wheels_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[244.09, -5.82, 454.97]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
              <mesh
                geometry={(nodes.wheels_2_wheels_0 as THREE.Mesh).geometry}
                material={materials.wheels}
                position={[141.64, -5.61, 453.33]}
                rotation={[-Math.PI / 2, 0, 0]}
              />
            </group>
          </group>
          <group position={[321.74, 352.86, 2903.36]}>
            <group
              position={[-301.47, -5.81, 128.39]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_15_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_15_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1338.04, 42.07, -50.35]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_14_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_14_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1092.19, -5.81, -81.8]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_13_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_13_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1735.52, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_12_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_12_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1178.98, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_11_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_11_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2035.27, -5.81, -86.69]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_10_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_10_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[1504, -5.81, 20.7]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_9_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_9_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[25.82, -5.81, 60.52]}
              rotation={[0.11, -0.5, 1.54]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_8_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_8_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[247.29, -5.81, -45]}
              rotation={[0.11, -0.5, 1.54]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_7_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_7_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[725.37, -5.81, 20.7]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_6_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_6_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-609.23, -31.36, 87.11]}
              rotation={[1.22, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_4_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_4_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-329.65, -5.81, -135.03]}
              rotation={[3.02, 0.7, -Math.PI / 2]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_1_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_1_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-880.63, -5.81, 48.82]}
              rotation={[0.13, 0.8, 1.39]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[36.92, 72.09, 178.04]}
              rotation={[0, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Grass_Stone_0 as THREE.Mesh).geometry}
                material={materials.Stone}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Grass_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
            </group>
            <group
              position={[443.6, 6.26, 24.37]}
              rotation={[-1.11, 1.41, 2.43]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_3_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_3_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[511.17, -31.36, 23.76]}
              rotation={[1.22, Math.PI / 2, 0]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_2_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_2_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[979.68, 6.26, 40.44]}
              rotation={[-0.28, 0.91, 1.56]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_5_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_5_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2692.46, -5.81, -86.69]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_16_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_16_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2325.74, -5.81, 98.85]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_17_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_17_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-1463.47, -5.81, 80.2]}
              rotation={[0.09, -0.06, 1.5]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_18_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_18_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
            <group
              position={[-2389.95, 6.26, -139.06]}
              rotation={[-1.11, 1.41, 2.43]}
              scale={2}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Tree_3_19_Trees_0 as THREE.Mesh).geometry}
                material={materials.Trees}
              />
              <mesh
                geometry={(nodes.Tree_3_19_Wood_0 as THREE.Mesh).geometry}
                material={materials.Wood}
              />
            </group>
          </group>
          <group position={[904.35, 676.99, 907.95]} rotation={[0, 0.09, 0]}>
            <group
              position={[-1247.34, -400.24, -1058.09]}
              rotation={[0, -0.09, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_Stone_0 as THREE.Mesh).geometry}
                material={materials.Stone_0}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_Stone_0_1 as THREE.Mesh).geometry}
                material={materials.Stone_1}
              />
            </group>
            <group
              position={[-574.21, 4.03, -2224.25]}
              rotation={[-2.7, -1.33, 0.96]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney_Stone_0 as THREE.Mesh).geometry}
                material={materials.Stone}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney_Stone1_0 as THREE.Mesh).geometry}
                material={materials["Stone.1"]}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney_White_Border_0 as THREE.Mesh).geometry}
                material={materials.White_Border}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney_Glass_0 as THREE.Mesh).geometry}
                material={materials.Glass}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Sidney__0 as THREE.Mesh).geometry}
                material={materials.Sidney__0}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={
                (nodes.Streetlight_s_White_Border_0 as THREE.Mesh).geometry
              }
              material={materials.White_Border}
              position={[-50.42, 58.02, -1712.52]}
              rotation={[Math.PI, 1.5, -Math.PI]}
              scale={2}
            />
          </group>
          <group
            position={[931.95, 509.87, 1401.82]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <group
              position={[551.39, 89.05, -2587.33]}
              rotation={[0, -1.56, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_1_Pipe_1_0 as THREE.Mesh).geometry}
                material={materials.Pipe_1}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
              />
              <mesh
                geometry={
                  (nodes.Building_1_water_foam_0 as THREE.Mesh).geometry
                }
                material={materials.water_foam}
              />
            </group>
            <group
              position={[892.26, -49.52, 3663.72]}
              rotation={[0, -0.46, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_1_2_roof_0 as THREE.Mesh).geometry}
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_1_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
              />
              <mesh
                geometry={
                  (nodes.Building_1_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={materials.water_foam}
              />
            </group>
            <group
              position={[-4920.47, 45.21, -45.44]}
              rotation={[0, -0.26, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
              />
              <mesh
                geometry={(nodes.Building_water_foam_0 as THREE.Mesh).geometry}
                material={materials.water_foam}
              />
            </group>
            <group
              position={[-775.48, 120.3, -1076.12]}
              rotation={[3.14, 1.57, -3.14]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_2_roof_0 as THREE.Mesh).geometry}
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
              />
              <mesh
                geometry={
                  (nodes.Building_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={materials.water_foam}
              />
            </group>
            <group
              position={[-332.83, 120.3, -1076.12]}
              rotation={[3.14, 1.57, -3.14]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Building_2_2_roof_0 as THREE.Mesh).geometry}
                material={materials.roof}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={
                  (nodes.Building_2_2_White_Border_0 as THREE.Mesh).geometry
                }
                material={materials.White_Border}
              />
              <mesh
                geometry={
                  (nodes.Building_2_2_water_foam_0 as THREE.Mesh).geometry
                }
                material={materials.water_foam}
              />
            </group>
          </group>
          <group
            position={[-1746.98, 461.43, -538.72]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <group
              position={[-2233.02, -58.99, 2595.18]}
              rotation={[0.1, 1.06, -0.07]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_White_Border_0 as THREE.Mesh).geometry}
                material={materials.White_Border}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_Ship_0 as THREE.Mesh).geometry}
                material={materials.Ship}
              />
              <mesh
                geometry={(nodes.Yacht_Glass_0 as THREE.Mesh).geometry}
                material={materials.Glass}
              />
            </group>
            <group
              position={[-3187.63, -47.83, -6281.06]}
              rotation={[0.26, 1.49, -0.15]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_4_White_Border_0 as THREE.Mesh).geometry}
                material={materials.White_Border}
              />
              <mesh
                geometry={(nodes.Yacht_4_Glass_0 as THREE.Mesh).geometry}
                material={materials.Glass}
              />
            </group>
            <group
              position={[2146.79, -58.99, 2807.03]}
              rotation={[3.02, 1.15, -3.01]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_1_White_Border_0 as THREE.Mesh).geometry}
                material={materials.White_Border}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Yacht_1_Ship_0 as THREE.Mesh).geometry}
                material={materials.Ship}
              />
              <mesh
                geometry={(nodes.Yacht_1_Glass_0 as THREE.Mesh).geometry}
                material={materials.Glass}
              />
            </group>
          </group>
          <group
            position={[69.93, -55.57, -44.55]}
            rotation={[0, -Math.PI / 2, 0]}
          >
            <group
              position={[-94.09, -528.54, 49.23]}
              rotation={[0, Math.PI / 2, 0]}
            >
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_3_Ground_0 as THREE.Mesh).geometry}
                material={materials.Ground}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_3_Ground_0_1 as THREE.Mesh).geometry}
                material={materials.Ground_0}
              />
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Floor_3_Ground_0_2 as THREE.Mesh).geometry}
                material={materials.Ground_1}
              />
            </group>
            <group position={[-90.84, -228.19, 39.01]}>
              <mesh
                castShadow
                receiveShadow
                geometry={(nodes.Stones_2__0 as THREE.Mesh).geometry}
                material={materials.Sidney__0}
                position={[-439.62, 34.01, -1.85]}
                rotation={[Math.PI, Math.PI / 2, 0]}
              />
            </group>
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Water_2_water_foam_0 as THREE.Mesh).geometry}
              material={materials.water_foam}
              position={[-94.09, -222.05, 49.23]}
              rotation={[0, Math.PI / 2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Stones_Stone_0 as THREE.Mesh).geometry}
              material={materials.Stone_2}
              position={[-770.29, -420.19, 39.78]}
              rotation={[Math.PI, Math.PI / 2, 0]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Pipes1_1_Pipe_1_0 as THREE.Mesh).geometry}
              material={materials.Pipe_1}
              position={[-1493.47, -524.33, -558.15]}
              rotation={[-Math.PI / 2, 0, Math.PI / 2]}
            />
            <mesh
              castShadow
              receiveShadow
              geometry={(nodes.Pipes1_Pipe_1_0 as THREE.Mesh).geometry}
              material={materials.Pipe_1}
              position={[711.34, -477.22, 1370.1]}
              rotation={[-Math.PI / 2, 0, -Math.PI / 2]}
            />
          </group>
        </group>
      </group>
    </group>
  );
};

export default Mesh;

useGLTF.preload(MODEL_PATH);
