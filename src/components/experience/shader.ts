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
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

export const WATER_VERTEX_SHADER = `
uniform float uTime;
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWaveHeight;

float waveHeight(vec2 pos, float time) {
  float wave = sin((pos.x + pos.y) * 0.0035 + time * 1.35) * 0.28;
  wave += cos((pos.x - pos.y) * 0.0026 - time * 1.02) * 0.14;
  wave += sin(pos.x * 0.011 - pos.y * 0.013 + time * 2.1) * 0.06;
  return wave;
}

void main() {
  vUv = uv;
  vec3 pos = position;

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
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWaveHeight;

void main() {
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  vec3 sunDir = normalize(uSunDirection);

  // Twilight sun: a hot gold-white core fading into a soft amber halo,
  // matching the warm low-angle light actually lighting the scene.
  vec3 sunCore = vec3(1.0, 0.87, 0.6);
  vec3 sunHalo = vec3(1.0, 0.45, 0.32);

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

  vec3 color = mix(uColor, uHighlight, shimmer);

  // Dusky indigo-teal instead of a saturated electric blue, so the water
  // doesn't fight the warm pink/gold sky it's supposed to be reflecting.
  vec3 blueTint = vec3(0.3, 0.2, 0.58);
  color = mix(color, blueTint, 0.4);

  // At grazing angles water mostly reflects the sky, so blend toward the
  // warm horizon colour rather than a cold icy highlight.
  vec3 horizonGlow = vec3(0.97, 0.78, 0.66);
  vec3 grazingColor = mix(uHighlight, horizonGlow, 0.55);
  color = mix(color, grazingColor, fresnel * 0.5);
  color = mix(color, uHighlight, foam * 0.6);
  color = mix(color, sunHalo, glow);
  color += specular * sunCore;
  color *= 1.2;

  float alpha = clamp(mix(0.6, 0.92, fresnel + foam * 0.3), 0.0, 1.0);
  gl_FragColor = vec4(color, alpha);
}`;
