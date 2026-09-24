import * as THREE from "three";

export function makeDust(pixelRatio: number, width: number) {
  const count = width < 700 ? 1200 : 2400;
  const positions = new Float32Array(count * 3);
  const formed = new Float32Array(count * 3);
  const sand = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    positions[i * 3] = Math.random() - .5;
    positions[i * 3 + 1] = Math.random() - .5;
    positions[i * 3 + 2] = Math.random() * 11 - 6;
    const sandRadius = Math.sqrt(Math.random());
    const sandAngle = Math.random() * Math.PI * 2;
    sand[i * 3] = Math.cos(sandAngle) * sandRadius * 8.5;
    sand[i * 3 + 1] = -3.0 + Math.pow(1 - sandRadius, 2) * 0.75 + Math.random() * 0.16;
    sand[i * 3 + 2] = Math.sin(sandAngle) * sandRadius * 4.5 + 0.6;
    const a = Math.random()*Math.PI*2, b = Math.random()*Math.PI*2;
    const tube = 2.18 + Math.cos(b)*.135;
    formed[i*3] = Math.cos(a)*tube;
    formed[i*3+1] = Math.sin(a)*tube;
    formed[i*3+2] = Math.sin(b)*.135;
    randoms[i] = Math.random();
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("aForm", new THREE.BufferAttribute(formed, 3));
  geometry.setAttribute("aSand", new THREE.BufferAttribute(sand, 3));
  geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uPointer: {value: new THREE.Vector2()}, uRingMatrix: {value: new THREE.Matrix4()}, uViewport: {value: new THREE.Vector2()}, uTime: { value: 0 }, uScroll: { value: 0 }, uPixelRatio: { value: pixelRatio } },
    vertexShader: `
      attribute vec3 aSand;
      attribute vec3 aForm;
      uniform mat4 uRingMatrix;
      uniform vec2 uViewport;
      uniform vec2 uPointer;
      attribute float aRandom;
      uniform float uTime;
      uniform float uScroll;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        vec3 p = position;
        p.z += sin(uTime * .19 + aRandom * 25.0) * .65;
        p.xy *= uViewport * (1.25 - p.z / 12.0);
        p.x += sin(uTime * (.14 + aRandom*.12) + aRandom * 30.0) * .55;
        p.y += cos(uTime * (.12 + aRandom*.09) + aRandom * 20.0) * .42;
        p.xy += uPointer * (.08 + max(p.z,0.0)*.045);
        float forming = step(.32, aRandom);
        float form = smoothstep(.46 + aRandom * .025, .62, uScroll) * forming;
        vec3 destination = (uRingMatrix * vec4(aForm, 1.0)).xyz;
        p = mix(p, destination, form);
        p.z += sin(form * 3.14159) * sin(aRandom * 60.0) * 1.2;
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_Position = projectionMatrix * mv;
        gl_PointSize = (1.0 + aRandom * 2.0) * uPixelRatio * (10.0 / max(2.0, -mv.z));
        float fade = mix(.8, 1.0 - smoothstep(.61,.68,uScroll), forming);

        float subtlety = mix(.72, .9, form);
        vAlpha = (.35 + aRandom * .6) * smoothstep(.075,.16,uScroll) * fade * subtlety;
      }
    `,
    fragmentShader: `
      varying float vAlpha;
      void main() {
        float d = distance(gl_PointCoord, vec2(.5));
        float glow = 1.0 - smoothstep(.0, .5, d);
        vec3 color = mix(vec3(.62,.31,.045), vec3(1.0,.84,.38), glow);
        gl_FragColor = vec4(color, glow * vAlpha);
      }
    `,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return points;
}
