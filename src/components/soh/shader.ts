export const GLOBAL_VERTEX_SHADER = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz; 

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;

export const GLOBAL_FRAGMENT_SHADER = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;
void main() {
  // offset is a scalar meant to bias the gradient's height reference alone
  // (raising/lowering where the topColor/bottomColor transition falls) - GLSL
  // broadcasts a float added to a vec3 across all three components though, so
  // "vWorldPosition + offset" was also shifting X/Z, tilting the sky's "up"
  // reference diagonally off true zenith instead of just vertically. That
  // skew is what made the gradient read as a directional wedge coming from
  // one corner rather than a level horizon band, most visible against a
  // saturated, high-contrast palette. Applying offset to Y alone keeps the
  // intended vertical bias without the unintended diagonal one.
  vec3 dir = vec3( vWorldPosition.x, vWorldPosition.y + offset, vWorldPosition.z );
  float h = normalize( dir ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

export const WATER_VERTEX_SHADER = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWaveHeight;
varying vec2 vLocalXZ;

float waveHeight(vec2 pos, float time) {
  float wave = sin((pos.x + pos.y) * 0.0035 + time * 1.35) * 0.28;
  wave += cos((pos.x - pos.y) * 0.0026 - time * 1.02) * 0.14;
  wave += sin(pos.x * 0.011 - pos.y * 0.013 + time * 2.1) * 0.06;
  return wave;
}

void main() {
  vUv = uv;
  vec3 pos = position;
  // Raw, pre-displacement local x/z - the same space the dock-light glow
  // sample points are precomputed into (see DOCK_GLOW_POINTS_WATER_LOCAL in
  // mesh.tsx), so the underwater glow below can compare distances directly
  // without caring about Float/Inspector's world-space transform.
  vLocalXZ = pos.xz;

  float wave = waveHeight(pos.xz, uTime);
  pos.y += wave;
  vWaveHeight = wave;

  // Slope of the height field doubles as a normal, so the surface catches
  // light and glints instead of reading as a flat painted plane.
  float eps = 40.0;
  float slopeX = (waveHeight(pos.xz + vec2(eps, 0.0), uTime) - wave) / eps;
  float slopeZ = (waveHeight(pos.xz + vec2(0.0, eps), uTime) - wave) / eps;
  vec3 localNormal = normalize(vec3(-slopeX, 1.0, -slopeZ));
  vNormal = normalize(mat3(modelMatrix) * localNormal);

  vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

export const WATER_FRAGMENT_SHADER = `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHighlight;
uniform vec3 uSunDirection;
uniform float uNightMix;
uniform vec2 uDockGlowPoints[32];
uniform vec3 uDockGlowColor;
uniform float uDockGlowRadius;
uniform float uDockGlowIntensity;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWaveHeight;
varying vec2 vLocalXZ;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 sunDir = normalize(uSunDirection);

  // Twilight sun: a hot gold-white core fading into a soft amber halo,
  // matching the warm low-angle light actually lighting the scene. At night
  // uSunDirection instead points at the moon, so blend toward a pale, cool
  // glint instead of the golden dusk tones.
  vec3 sunCore = mix(vec3(1.0, 0.87, 0.6), vec3(0.82, 0.9, 1.0), uNightMix);
  vec3 sunHalo = mix(vec3(1.0, 0.45, 0.32), vec3(0.45, 0.58, 0.85), uNightMix);

  // uHighlight is a bright pale blue meant for sunlit daytime shimmer/foam -
  // at night it gets pulled way down so those same highlights read as a dim
  // moonlit glint instead of staying lit up like midday water.
  vec3 highlight = mix(uHighlight, vec3(0.14, 0.18, 0.26), uNightMix);

  // Fresnel: water turns pale and mirror-like at grazing angles.
  float fresnel = pow(1.0 - clamp(dot(normal, viewDir), 0.0, 1.0), 3.0);

  // Drifting shimmer pattern, independent of the geometric wave so the
  // surface still sparkles where the displacement is flat.
  float shimmerWave = sin(vUv.x * 5.0 + uTime * 1.1) * 0.45 + cos(vUv.y * 4.4 - uTime * 0.9) * 0.45;
  float shimmer = smoothstep(-1.0, 1.0, shimmerWave) * 0.1 + 0.05;

  // Sun glint off the wave normal: a wide warm halo plus a tight hot core.
  vec3 halfDir = normalize(sunDir + viewDir);
  float sunDot = max(dot(normal, halfDir), 0.0);
  float glow = pow(sunDot, 8.0) * 0.35;
  float specular = pow(sunDot, 70.0) * 1.4;

  // Foam along the crest of the taller waves.
  float foam = smoothstep(0.32, 0.42, vWaveHeight);

  vec3 color = mix(uColor, highlight, shimmer);

  // Dusky indigo-teal instead of a saturated electric blue, so the water
  // doesn't fight the warm pink/gold sky it's supposed to be reflecting.
  // At night this deepens further into a near-black navy.
  vec3 blueTint = mix(vec3(0.3, 0.2, 0.58), vec3(0.01, 0.02, 0.05), uNightMix);
  color = mix(color, blueTint, mix(0.4, 0.85, uNightMix));

  // At grazing angles water mostly reflects the sky, so blend toward the
  // warm horizon colour rather than a cold icy highlight. By night the sky
  // itself is a dark navy, so the grazing reflection follows suit.
  vec3 horizonGlow = mix(vec3(0.97, 0.78, 0.66), vec3(0.04, 0.06, 0.12), uNightMix);
  vec3 grazingColor = mix(highlight, horizonGlow, 0.55);
  color = mix(color, grazingColor, fresnel * 0.5);
  color = mix(color, highlight, foam * 0.6);
  // Glow/specular are the moon's glint on the water - dimmed at night so
  // they read as one small bright streak, not a wash across the surface.
  color = mix(color, sunHalo, glow * mix(1.0, 0.35, uNightMix));
  color += specular * sunCore * mix(1.0, 0.5, uNightMix);
  color *= mix(1.2, 0.45, uNightMix);

  // Underwater LED dock lighting: a per-fragment distance-to-nearest-sample
  // falloff is inherently seamless (no discrete cone-overlap gaps to hide),
  // and far cheaper than lighting the water with dozens of real spotLights.
  // uDockGlowPoints is fixed-size to match DOCK_GLOW_SAMPLES in mesh.tsx.
  float dockGlowDist = 1000.0;
  for (int i = 0; i < 32; i++) {
    dockGlowDist = min(dockGlowDist, distance(vLocalXZ, uDockGlowPoints[i]));
  }
  // Exponential falloff - a simple stand-in for physically-based underwater
  // light attenuation (Beer-Lambert-style extinction with distance).
  float dockAttenuation = exp(-dockGlowDist / max(uDockGlowRadius, 0.0001));
  // A slow two-axis ripple stands in for animated caustics - much cheaper
  // than simulating real caustic focusing, and reads correctly because it
  // only modulates glow that's already localised to the seawall, not the
  // whole surface.
  float caustic = 0.65 + 0.35 * sin(vLocalXZ.x * 26.0 + uTime * 1.6) * cos(vLocalXZ.y * 23.0 - uTime * 1.3);
  float dockGlow = dockAttenuation * caustic * uDockGlowIntensity * uNightMix;
  color += uDockGlowColor * dockGlow;
  // The glow also catches the surface itself at grazing angles - light
  // scattering up through the water rather than only lighting what's below.
  color = mix(color, uDockGlowColor, fresnel * dockGlow * 0.5);

  float alpha = clamp(mix(0.6, 0.92, fresnel + foam * 0.3), 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}`;

// Deliberately takes no `depth` parameter - see DepthKeepAlive in
// sydneyOperaHouse.tsx for why: postprocessing's EffectPass only reads the
// depth texture into its merged shader when some effect's mainImage
// signature literally declares that param, so leaving it out keeps this
// effect's only cost to the DEPTH attribute flag it exists to hold.
export const DEPTH_KEEPALIVE_FRAGMENT_SHADER = `
void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  outputColor = inputColor;
}`;
