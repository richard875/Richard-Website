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

void main() {
  vUv = uv;
  vec3 pos = position;
  float wave = sin((pos.x + pos.z) * 0.0035 + uTime * 1.35) * 0.28;
  wave += cos((pos.x - pos.z) * 0.0026 - uTime * 1.02) * 0.14;
  pos.y += wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}`;

export const WATER_FRAGMENT_SHADER = `
uniform float uTime;
uniform vec3 uColor;
uniform vec3 uHighlight;
varying vec2 vUv;

void main() {
  float wave = sin(vUv.x * 5.0 + uTime * 1.1) * 0.45 + cos(vUv.y * 4.4 - uTime * 0.9) * 0.45;
  float shimmer = smoothstep(-1.0, 1.0, wave) * 0.08 + 0.04;
  vec3 color = mix(uColor, uHighlight, shimmer);
  vec3 blueTint = vec3(0.18, 0.42, 0.92);
  color = mix(color, blueTint, 0.45);
  gl_FragColor = vec4(color, 0.5);
}`;
