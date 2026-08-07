import React from "react";
import * as THREE from "three";

// Every non-glass/water material in the GLTF (ground, pavement, grass,
// stone, roofs, boats...) is baked with warm daytime-sunset colors. A
// strong moon light alone can't make those read as "night" - a pink
// pavement just becomes a *brighter* pink pavement. So at night we also
// desaturate and darken each material's base color and pull it toward a
// cool navy, the way moonlight actually flattens color perception.
const NIGHT_MATERIAL_TINT = new THREE.Color("#39456e");
const NIGHT_TINTED_MATERIALS = new Set(["Glass", "water_foam"]);

export const useNightMaterialTint = (
  materials: Record<string, THREE.Material>,
  isNight: boolean,
) => {
  const originalColors = React.useRef(new Map<string, THREE.Color>());

  React.useEffect(() => {
    Object.entries(materials).forEach(([name, material]) => {
      if (NIGHT_TINTED_MATERIALS.has(name)) return;
      const mat = material as THREE.MeshStandardMaterial;
      if (!mat.color) return;

      let original = originalColors.current.get(name);
      if (!original) {
        original = mat.color.clone();
        originalColors.current.set(name, original);
      }

      if (isNight) {
        const hsl = { h: 0, s: 0, l: 0 };
        original.getHSL(hsl);
        mat.color
          .setHSL(hsl.h, hsl.s * 0.2, THREE.MathUtils.clamp(hsl.l * 0.15, 0, 1))
          .lerp(NIGHT_MATERIAL_TINT, 0.55);
      } else {
        mat.color.copy(original);
      }
    });
  }, [materials, isNight]);
};

// MeshLambertMaterial evaluates the same lights as MeshStandardMaterial but
// with a much cheaper pure-diffuse model, skipping the roughness/metalness
// Cook-Torrance BRDF and Fresnel term entirely - real savings multiplied
// across every real light in the scene, which matters most at night when
// ~30 real dynamic lights are active at once. Every key below is every mesh's
// material key that isn't handled by its own dedicated material elsewhere
// (Glass uses glassMaterial below for real transmission; water_foam uses
// useAnimatedWaterMaterial, a fully custom shader with no scene-light
// dependency at all - neither participates in this lighting model regardless
// of isNight, so neither is in this list).
//
// This used to be split into two tiers - MeshLambertMaterial for surfaces
// that are barely ever seen (ground, pipes, wheels, rocks), and
// MeshPhongMaterial for the visible "hero" surfaces (building, sails/trim,
// boats, cars, promenade, roofs) to preserve a specular sheen - but Phong's
// Blinn-Phong highlight needed careful shininess/specular tuning to avoid
// blowing out under the sail floodlights (a "modest" first attempt
// multiplied out to over 2x pure white at point-blank range, since Phong's
// specular term isn't energy-conserving the way Standard's roughness-based
// BRDF is). MeshLambertMaterial has no specular term to tune at all, so
// every material - hero or hidden - uses it here for a consistent, simpler
// result.
//
// Applied only at night via heroMaterial() in mesh.tsx - the day scene has
// just the 3 base lights (ambient/hemisphere/directional, no sail/dock/
// streetlamp fixtures), so there's no light-count cost to offset there, and
// it swaps back to the GLTF's original untouched MeshStandardMaterial that
// the day look was actually tuned against.
export const LAMBERT_MATERIAL_KEYS = [
  "Ground",
  "Ground_0",
  "Ground_1",
  "Pipe_1",
  "wheels",
  "Stone_2",
  "material",
  "Ship",
  "car_0",
  "Trees",
  "Wood",
  "Stone",
  "Stone_0",
  "Stone_1",
  "Stone.1",
  "White_Border",
  "Sidney__0",
  "roof",
];

export const useLambertMaterials = (
  materials: Record<string, THREE.Material>,
) =>
  React.useMemo(() => {
    const lambertMaterials: Record<string, THREE.MeshLambertMaterial> = {};
    LAMBERT_MATERIAL_KEYS.forEach((key) => {
      const source = materials[key] as THREE.MeshStandardMaterial | undefined;
      if (!source?.color) return;
      const lambert = new THREE.MeshLambertMaterial({
        color: source.color,
        // Every material in this GLTF is double-sided (checked against the
        // source file) - MeshLambertMaterial defaults to THREE.FrontSide,
        // which would silently cull backfaces (thin sail/tree/leaf geometry
        // especially) the Standard material was rendering fine.
        side: THREE.DoubleSide,
      });
      // Re-pointed to the SAME Color instance rather than the copy the
      // constructor made above, so useNightMaterialTint's in-place
      // setHSL/lerp mutations on the source material apply here
      // automatically too - both materials just read the one Color object.
      lambert.color = source.color;
      lambertMaterials[key] = lambert;
    });
    return lambertMaterials;
  }, [materials]);

// The GLTF "Glass" material is fully opaque (no real transmission); swap in a
// physically-based transmissive material so windows/glass actually refract.
// At night it also picks up a warm emissive glow, so every window in the
// model (opera house, boats, car) reads as lit from within.
export const useGlassMaterial = (
  materials: Record<string, THREE.Material>,
  isNight: boolean,
) =>
  React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: (materials.Glass as THREE.MeshStandardMaterial).color,
        transmission: 1,
        thickness: 0.4,
        // A near-mirror 0.08 roughness catches a sharp specular hotspot from
        // the sail floodlights that flares up huge whenever Float's gentle
        // bobbing sweeps the surface through the reflection angle. Softening
        // it at night spreads that highlight out instead.
        roughness: isNight ? 0.35 : 0.08,
        ior: 1.5,
        metalness: 0,
        // This IS the "light coming from within" for every window in the
        // model (opera house, boats, car) - no separate glow lights needed,
        // this glass itself is what should read as brightly lit.
        emissive: isNight
          ? new THREE.Color("#ff9d4d")
          : new THREE.Color("#000000"),
        emissiveIntensity: isNight ? 1.4 : 0,
      }),
    [materials.Glass, isNight],
  );
