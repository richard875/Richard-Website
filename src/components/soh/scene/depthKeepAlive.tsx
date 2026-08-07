import React from "react";
import { Effect, EffectAttribute, BlendFunction } from "postprocessing";
import { DEPTH_KEEPALIVE_FRAGMENT_SHADER } from "../shader";

// Keeps postprocessing's shared depth texture allocated for the entire
// lifetime of the EffectComposer - DepthOfField is the only effect in this
// scene that ever needs depth, and it mounts/unmounts with day/night;
// without something else permanently requiring depth too, EffectComposer's
// addPass/removePass allocate and free a whole WebGLRenderTarget (see
// createDepthTexture/deleteDepthTexture in the postprocessing package) every
// single time DepthOfField mounts/unmounts, which is what was corrupting the
// render on every day/night toggle. Built as a minimal custom Effect rather
// than using postprocessing's own <Depth> (which exists to visualize depth,
// so its mainImage signature takes a `depth` param) - EffectPass only reads
// the depth texture into the merged shader when some effect's mainImage
// signature literally declares that param (see the depthParamRegExp check in
// integrateEffect), so keeping it out of this shader entirely means this
// costs nothing beyond the DEPTH attribute flag that keeps the texture
// alive - not even the one extra per-pixel texture sample <Depth> would add.
// Not a subclass of Effect - Gatsby's babel target down-levels `class X
// extends Effect` in application code to an ES5-style super call, but
// Effect (imported straight from node_modules, left untranspiled) is a
// genuine native class that throws ("Class constructor Effect cannot be
// invoked without 'new'") when called that way. Constructing a plain Effect
// instance directly and handing it to <primitive> - the same pattern
// several of @react-three/postprocessing's own built-ins use internally -
// sidesteps that entirely.
const DepthKeepAlive = () => {
  const effect = React.useMemo(
    () =>
      new Effect("DepthKeepAliveEffect", DEPTH_KEEPALIVE_FRAGMENT_SHADER, {
        blendFunction: BlendFunction.SKIP,
        attributes: EffectAttribute.DEPTH,
      }),
    [],
  );
  return <primitive object={effect} />;
};

export default DepthKeepAlive;
