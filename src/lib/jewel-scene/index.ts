import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/addons/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createJewellery } from "./geometry";
import { makeDust } from "./dust";
import { shotAt } from "./shots";

export function createJewelScene(container: HTMLElement) {
  const scene = new THREE.Scene();
  const swatch = document.createElement("canvas").getContext("2d");
  if (swatch) {
    swatch.fillStyle = getComputedStyle(container).getPropertyValue("--cinematic");
    swatch.fillRect(0, 0, 1, 1);
    const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data;
    scene.background = new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  }
  const camera = new THREE.PerspectiveCamera(31, 1, 0.05, 60);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "low-power" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.72;
  container.appendChild(renderer.domElement);
  const composer = new EffectComposer(renderer);
  const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), 0.3, 0.42, 0.95);
  const output = new OutputPass();
  composer.addPass(new RenderPass(scene, camera));
  composer.addPass(bloom);
  composer.addPass(output);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, 0.04);
  scene.environment = environment.texture;
  room.dispose();
  pmrem.dispose();
  RectAreaLightUniformsLib.init();

  const key = new THREE.RectAreaLight(0xffe2a8, 7, 5, 7);
  key.position.set(-4.5, 6, 5);
  const rim = new THREE.RectAreaLight(0x9bdcff, 8, 3, 6);
  rim.position.set(4.5, 2.8, 3);
  const warm = new THREE.PointLight(0xff9f32, 5, 12, 2);
  warm.position.set(-3, -0.5, 3.5);
  const glint = new THREE.PointLight(0xe4f4ff, 38, 14, 2);
  const spot = new THREE.SpotLight(0xffe5b3, 28, 20, Math.PI / 7, 0.7, 1.2);
  spot.position.set(2, 7, 5);
  spot.target.position.set(0, 1, 0);
  scene.add(key, rim, warm, glint, spot, spot.target);

  const world = new THREE.Group();
  const sculpture = new THREE.Group();
  const { ring, diamond, gold } = createJewellery();
  ring.remove(diamond);
  sculpture.add(ring);
  world.add(sculpture);
  scene.add(world, diamond);
  const dust = makeDust(renderer.getPixelRatio(), container.clientWidth);
  scene.add(dust);
  const anchor = new THREE.Vector3();
  const target = new THREE.Vector3();
  const orientation = new THREE.Quaternion();
  const rotation = new THREE.Euler();
  const smooth = (a: number, b: number, p: number) => THREE.MathUtils.smoothstep(p, a, b);
  const mix = THREE.MathUtils.lerp;
  let width = 0;
  let height = 0;

  function render(p: number) {
    if (width !== container.clientWidth || height !== container.clientHeight) {
      width = container.clientWidth;
      height = container.clientHeight;
      renderer.setSize(width, height);
      composer.setSize(width, height);
      camera.aspect = width / Math.max(1, height);
    }
    const mobile = width < 700;
    const s = shotAt(p);
    camera.fov = s.fov;
    camera.position.set(0, 0, s.cam);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    const vh = 2 * s.cam * Math.tan(THREE.MathUtils.degToRad(s.fov / 2));
    const vw = vh * camera.aspect;
    const reveal = smooth(0.585, 0.65, p);
    const bandFocus = smooth(0.70, 0.76, p) * (1 - smooth(0.84, 0.91, p));
    const size = mobile ? Math.min(s.size * 0.79, vw * 0.79 / vh * 6.4 / 4.7) : s.size;
    const scale = vh * size / 6.4;
    world.position.set(mobile ? 0 : s.x * vw, (s.y + (mobile ? 0.14 : 0)) * vh, 0);
    sculpture.scale.setScalar(scale);
    sculpture.rotation.set(s.rx, s.ry, s.rz);
    ring.position.y = -0.65;
    world.visible = reveal > 0.001;
    ring.traverse((part) => {
      if (part instanceof THREE.Mesh && part.material instanceof THREE.Material) {
        part.material.transparent = true;
        part.material.opacity = reveal;
      }
    });
    world.updateMatrixWorld(true);
    anchor.set(0, 2.82, 0);
    ring.localToWorld(anchor);
    target.set(mobile ? 0 : s.dx * vw, s.dy * vh, 0);
    diamond.position.copy(anchor).lerp(target, s.lift);
    const stoneSize = mobile ? Math.min(s.ds * vh, vw * 0.55) : s.ds * vh;
    diamond.scale.setScalar(mix(scale, stoneSize / 1.64, s.lift));
    ring.getWorldQuaternion(orientation);
    const align = smooth(0.44, 0.65, p);
    const yaw = p <= 0.44 ? p * 13 - 2 * Math.PI : s.ry + (0.44 * 13 - 2 * Math.PI - 0.1) * (1 - align);
    rotation.set(mix(0.24 + Math.sin(p * 10) * 0.12, s.rx, align), yaw, mix(-0.08, s.rz, align));
    diamond.quaternion.setFromEuler(rotation).slerp(orientation, smooth(0.61, 0.65, p));
    diamond.visible = p > 0.14;
    const drift = Math.sin(p * 35 * 0.35) * 0.12;
    key.position.set(-4.5 + Math.sin(p * 8) * 2, 6, 5);
    rim.position.set(4.5 * Math.cos(p * 4), 2.8, 3);
    key.lookAt(diamond.position);
    rim.lookAt(diamond.position);
    glint.position.copy(diamond.position).add(target.set(2.2 + drift * 8, 1.4, 3));
    warm.intensity = 5 + bandFocus * 7;
    gold.roughness = 0.13 - bandFocus * 0.05;
    dust.material.uniforms.uTime.value = p * 35;
    dust.material.uniforms.uScroll.value = p;
    dust.material.uniforms.uRingMatrix.value.copy(ring.matrixWorld);
    dust.material.uniforms.uViewport.value.set(vw, vh);
    bloom.strength = 0.30 + bandFocus * 0.06;
    composer.render();
  }

  function dispose() {
    const materials = new Set<THREE.Material>();
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        object.geometry.dispose();
        const items = Array.isArray(object.material) ? object.material : [object.material];
        items.forEach((material: THREE.Material) => materials.add(material));
      }
    });
    materials.forEach((material) => material.dispose());
    environment.dispose();
    bloom.dispose();
    output.dispose();
    composer.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }

  return { render, dispose };
}
