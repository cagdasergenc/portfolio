export const VERT = `#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`

/**
 * Real refraction: the glass region resamples the cover texture with
 * displaced UVs, so cover pixels genuinely bend. This is not a blur.
 *
 * The capsule is an SDF rounded box. Refraction strength rises sharply near
 * its edge — that edge gradient is what reads as thickness, the same way a
 * real lens distorts most at its rim.
 */
export const FRAG = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform sampler2D uCover;
uniform vec2  uRes;
uniform vec2  uPush;      // 0..1 pointer field
uniform float uForce;     // 0..1 pointer speed
uniform vec4  uCapsule;   // xy = centre (0..1), zw = half-size (0..1)
uniform float uRadius;    // corner radius, normalised to width
uniform vec3  uVoid;       // --color-void, as 0..1 floats — no hardcoded duplicate
uniform vec4  uScrimTop;   // height, alpha at band start, alpha at midpoint, unused
uniform vec4  uScrimBot;   // height, alpha at band start, alpha at midpoint, unused

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

/* Piecewise-linear, matching a 3-stop CSS gradient exactly rather than an
   eased curve — this is a relocation of existing behaviour, not a redesign
   of it. t is 0 at the band's outer edge, 1 where it has faded to nothing. */
float scrimAlpha(float t, float a0, float a1) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5 ? mix(a0, a1, t / 0.5) : mix(a1, 0.0, (t - 0.5) / 0.5);
}

void main() {
  float aspect = uRes.x / max(uRes.y, 1.0);
  vec2 p = (vUv - uCapsule.xy) * vec2(aspect, 1.0);
  vec2 b = uCapsule.zw * vec2(aspect, 1.0);

  float d = sdRoundBox(p, b, uRadius);

  // Inside the capsule only. edge = 0 at the rim, 1 deep inside.
  float inside = step(d, 0.0);
  float edge = smoothstep(0.0, -0.06, d);

  // Lens: push UVs outward from the capsule centre, hardest at the rim.
  vec2 dir = normalize(p + 1e-6);
  float lens = (1.0 - edge) * inside * 0.045;

  // Pointer displacement, strongest near the cursor and scaled by speed.
  vec2 toCursor = vUv - uPush;
  float prox = exp(-dot(toCursor, toCursor) * 14.0);
  vec2 drag = toCursor * prox * uForce * 0.05 * inside;

  vec2 uv = vUv + dir * lens + drag;
  vec3 col = texture(uCover, clamp(uv, 0.0, 1.0)).rgb;

  // Chromatic split at the rim — subtle, and only where refraction is strong.
  float ca = (1.0 - edge) * inside * 0.006;
  col.r = texture(uCover, clamp(uv + dir * ca, 0.0, 1.0)).r;
  col.b = texture(uCover, clamp(uv - dir * ca, 0.0, 1.0)).b;

  // Glass tint and lit rim.
  col = mix(col, col * 0.55 + 0.06, inside * 0.55);
  float rim = smoothstep(0.004, 0.0, abs(d));
  col += rim * 0.22;

  // In-shader scrims. vUv.y = 1 at the top of the frame, 0 at the bottom
  // (confirmed empirically when the capsule position was first tuned).
  // Top band runs from the top edge down through uScrimTop.x of the frame;
  // bottom band runs from the bottom edge up through uScrimBot.x.
  float topT = (1.0 - vUv.y) / max(uScrimTop.x, 1e-4);
  float topA = (vUv.y > 1.0 - uScrimTop.x) ? scrimAlpha(topT, uScrimTop.y, uScrimTop.z) : 0.0;

  float botT = vUv.y / max(uScrimBot.x, 1e-4);
  float botA = (vUv.y < uScrimBot.x) ? scrimAlpha(botT, uScrimBot.y, uScrimBot.z) : 0.0;

  col = mix(col, uVoid, max(topA, botA));

  outColor = vec4(col, 1.0);
}`
