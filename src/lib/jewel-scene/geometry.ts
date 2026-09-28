import * as THREE from "three";
export function createJewellery() {
  const gold = new THREE.MeshPhysicalMaterial({
    color: 0xd6a84d,
    metalness: 1,
    roughness: 0.12,
    clearcoat: 0.55,
    clearcoatRoughness: 0.08,
    envMapIntensity: 1.4,
  });
  const darkGold = new THREE.MeshPhysicalMaterial({
    color: 0x8d5e1b,
    metalness: 1,
    roughness: 0.2,
    clearcoat: 0.4,
    envMapIntensity: 1.8,
  });
  const platinum = new THREE.MeshPhysicalMaterial({
    color: 0xd6d6d0,
    metalness: 0.92,
    roughness: 0.11,
    clearcoat: 1,
    envMapIntensity: 2.8,
  });
  function makeRing() {
    const group = new THREE.Group();
    const band = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.135, 32, 180), gold);
    band.castShadow = true;
    band.receiveShadow = true;
    group.add(band);
    const innerBand = new THREE.Mesh(new THREE.TorusGeometry(2.18, 0.139, 20, 180), darkGold);
    innerBand.scale.set(0.985, 0.985, 0.985);
    innerBand.position.z = -0.018;
    group.add(innerBand);
    const leftCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.18, 1.83, 0),
      new THREE.Vector3(-0.82, 2.25, 0.04),
      new THREE.Vector3(-0.55, 2.55, 0.1),
      new THREE.Vector3(-0.42, 2.68, 0.12),
    ]);
    const rightCurve = new THREE.CatmullRomCurve3(leftCurve.points.map((point) => new THREE.Vector3(-point.x, point.y, point.z)));
    for (const curve of [leftCurve, rightCurve]) {
      const shoulder = new THREE.Mesh(new THREE.TubeGeometry(curve, 48, 0.105, 12, false), gold);
      shoulder.castShadow = true;
      group.add(shoulder);
    }
    const diamondY = 2.82;
    const basket = new THREE.Mesh(new THREE.TorusGeometry(0.76, 0.052, 16, 96), platinum);
    basket.position.y = diamondY - 0.24;
    basket.rotation.x = Math.PI / 2;
    basket.scale.z = 0.92;
    group.add(basket);
    for (let i = 0; i < 4; i += 1) {
      const angle = Math.PI / 4 + (i / 4) * Math.PI * 2;
      const start = new THREE.Vector3(Math.cos(angle) * 0.69, diamondY - 0.42, Math.sin(angle) * 0.69);
      const end = new THREE.Vector3(Math.cos(angle) * 0.75, diamondY + 0.075, Math.sin(angle) * 0.75);
      group.add(cylinderBetween(start, end, 0.047, platinum));
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.06, 18, 12), platinum);
      tip.position.copy(end);
      tip.scale.y = 1.3;
      tip.castShadow = true;
      group.add(tip);
    }
    const diamond = makeDiamond();
    diamond.position.y = diamondY;
    diamond.rotation.y = Math.PI / 8;
    group.add(diamond);
    return { ring: group, diamond, gold };
  }
  function cylinderBetween(start: THREE.Vector3, end: THREE.Vector3, radius: number, material: THREE.Material) {
    const direction = new THREE.Vector3().subVectors(end, start);
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.78, radius, direction.length(), 14), material);
    mesh.position.copy(start).add(end).multiplyScalar(0.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    mesh.castShadow = true;
    return mesh;
  }
  function makeDiamondGeometry() {
    const sides = 16;
    const tableRadius = 0.43;
    const girdleRadius = 0.82;
    const lowerRadius = 0.39;
    const tableY = 0.34;
    const girdleY = 0.02;
    const lowerY = -0.32;
    const culetY = -0.65;
    const positions: number[] = [];
    const pushTri = (a: number[], b: number[], c: number[]) => positions.push(...a, ...b, ...c);
    const ringPoint = (radius: number, y: number, angle: number) => [Math.cos(angle) * radius, y, Math.sin(angle) * radius];
    for (let i = 0; i < sides; i += 1) {
      const a0 = (i / sides) * Math.PI * 2;
      const a1 = ((i + 1) / sides) * Math.PI * 2;
      const shifted0 = a0 + Math.PI / sides;
      const shifted1 = a1 + Math.PI / sides;
      const t0 = ringPoint(tableRadius, tableY, a0);
      const t1 = ringPoint(tableRadius, tableY, a1);
      const g0 = ringPoint(girdleRadius, girdleY, shifted0);
      const g1 = ringPoint(girdleRadius, girdleY, shifted1);
      const l0 = ringPoint(lowerRadius, lowerY, a0);
      const l1 = ringPoint(lowerRadius, lowerY, a1);
      pushTri([0, tableY, 0], t1, t0);
      pushTri(t0, t1, g0);
      pushTri(t1, g1, g0);
      pushTri(g0, g1, l0);
      pushTri(g1, l1, l0);
      pushTri(l0, l1, [0, culetY, 0]);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    return geometry;
  }
  function makeDiamond() {
    const group = new THREE.Group();
    const geometry = makeDiamondGeometry();
    const material = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.015,
      transmission: 1,
      thickness: 1.7,
      ior: 2.417,
      dispersion: 0.5,
      attenuationColor: new THREE.Color(0xdff7ff),
      attenuationDistance: 3.5,
      clearcoat: 1,
      clearcoatRoughness: 0,
      specularIntensity: 1,
      envMapIntensity: 2.4,
      side: THREE.DoubleSide,
      flatShading: true,
    });
    const stone = new THREE.Mesh(geometry, material);
    stone.castShadow = true;
    group.add(stone);
    return group;
  }
  return makeRing();
}
