import React from "react";
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
import { DepthKeepAlive } from "./depthKeepAlive";

export const ScenePostProcessing = ({
  effectiveIsNight,
  bloomIntensity,
  luminanceThreshold,
  luminanceSmoothing,
  brightness,
  contrast,
  hue,
  saturation,
  vignetteDarkness,
  noiseOpacity,
  dofFocusRange,
  dofBokehScale,
}: {
  effectiveIsNight: boolean;
  bloomIntensity: number;
  luminanceThreshold: number;
  luminanceSmoothing: number;
  brightness: number;
  contrast: number;
  hue: number;
  saturation: number;
  vignetteDarkness: number;
  noiseOpacity: number;
  dofFocusRange: number;
  dofBokehScale: number;
}) => (
  // EffectComposer's children type is JSX.Element | JSX.Element[], not
  // ReactNode, so DepthOfField's night-only inclusion below is built as an
  // explicit array rather than an inline `{cond && <X/>}` - the latter
  // would type as `boolean | Element` and fail to satisfy it.
  <EffectComposer>
    {[
      // See DepthKeepAlive - keeps the shared depth texture allocated
      // permanently so DepthOfField mounting/unmounting below never
      // re-triggers the allocation that was corrupting the render.
      <DepthKeepAlive key="depth-keepalive" />,
      // DepthOfField is one of the most expensive effects in this stack -
      // DepthOfFieldEffect.update() unconditionally runs a full CoC pass
      // plus 6 more bokeh/blur render passes every frame it exists,
      // regardless of focusRange/bokehScale, since postprocessing merges
      // it into the same shared EffectPass as Bloom/etc and has no cheaper
      // "disabled but present" state. Clamping its props at night instead
      // of unmounting it paid that full per-frame cost for nothing, so
      // it's skipped outright at night rather than dialed down - safe to
      // do now that the DepthKeepAlive placeholder keeps the depth texture
      // stable across the mount/unmount.
      !effectiveIsNight && (
        <DepthOfField
          key="dof"
          target={[0, 0.45, 0]} // keep the model in focus, let everything else go dreamy
          focusRange={dofFocusRange}
          bokehScale={dofBokehScale}
        />
      ),
      <Bloom
        key="bloom"
        intensity={
          effectiveIsNight ? Math.min(bloomIntensity, 9) : bloomIntensity
        } // The bloom intensity.
        blurPass={undefined} // A blur pass.
        width={Resolution.AUTO_SIZE} // render width
        height={Resolution.AUTO_SIZE} // render height
        kernelSize={effectiveIsNight ? KernelSize.MEDIUM : KernelSize.LARGE} // blur kernel size
        luminanceThreshold={
          effectiveIsNight
            ? Math.max(luminanceThreshold, 1.0)
            : luminanceThreshold
        } // luminance threshold. Raise this value to mask out darker elements in the scene.
        // REFLECT is a steep, non-linear blend - tiny per-frame brightness
        // changes near the threshold (a moving specular hotspot, a bobbing
        // light) swing its output wildly, reading as flicker. ADD is a
        // flat, linear blend that scales smoothly with brightness instead.
        luminanceSmoothing={
          effectiveIsNight
            ? Math.max(luminanceSmoothing, 0.9)
            : luminanceSmoothing
        } // smoothness of the luminance threshold. Range is [0, 1]
        blendFunction={
          effectiveIsNight ? BlendFunction.ADD : BlendFunction.REFLECT
        } // blend mode
      />,
      <BrightnessContrast
        key="brightness-contrast"
        brightness={brightness} // brightness. min: -1, max: 1
        contrast={contrast} // contrast: min -1, max: 1
      />,
      <ColorAverage
        key="color-average"
        blendFunction={BlendFunction.OVERLAY} // blend mode
      />,
      <HueSaturation
        key="hue-saturation"
        blendFunction={BlendFunction.ALPHA} // blend mode
        hue={hue} // hue in radians
        saturation={saturation} // saturation in radians
      />,
      <Vignette
        key="vignette"
        offset={0.3} // vignette offset
        darkness={vignetteDarkness} // vignette darkness
        blendFunction={BlendFunction.NORMAL} // blend mode
      />,
      <Noise
        key="noise"
        opacity={noiseOpacity} // grain opacity
        blendFunction={BlendFunction.OVERLAY} // blend mode
      />,
    ].filter((child): child is React.JSX.Element => Boolean(child))}
  </EffectComposer>
);
