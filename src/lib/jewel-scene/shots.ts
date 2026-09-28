import { MathUtils } from "three";
const smooth = (a: number, b: number, v: number) => MathUtils.smoothstep(v, a, b);
const mix = MathUtils.lerp;
const shots = [
  { p: 0, x: 0, y: 0, size: .55, rx: .12, ry: -.3, rz: -.08, lift: 1, dx: 0, dy: -.85, ds: .23, cam: 12, fov: 31 },
  { p: .16, x: 0, y: 0, size: .55, rx: .12, ry: -.3, rz: -.08, lift: 1, dx: 0, dy: -.85, ds: .23, cam: 12, fov: 31 },
  { p: .27, x: 0, y: 0, size: .55, rx: .12, ry: -.3, rz: -.08, lift: 1, dx: 0, dy: 0, ds: .23, cam: 12, fov: 31 },
  { p: .36, x: 0, y: 0, size: .55, rx: .12, ry: -.1, rz: -.08, lift: 1, dx: 0, dy: .11, ds: .23, cam: 12, fov: 31 },
  { p: .44, x: 0, y: 0, size: .55, rx: .12, ry: .1, rz: -.08, lift: 1, dx: 0, dy: .11, ds: .23, cam: 12, fov: 31 },
  { p: .54, x: 0, y: -.015, size: .58, rx: .25, ry: 3.2, rz: -.13, lift: .85, dx: 0, dy: .13, ds: .23, cam: 12, fov: 31 },
  { p: .65, x: 0, y: 0, size: .60, rx: .15, ry: 6.63, rz: -.1, lift: 0, dx: 0, dy: .13, ds: .23, cam: 12, fov: 31 },
  { p: .68, x: 0, y: 0, size: .60, rx: .15, ry: 6.83, rz: -.1, lift: 0, dx: 0, dy: .13, ds: .23, cam: 12, fov: 31 },
  { p: .76, x: -.22, y: .015, size: .63, rx: .3, ry: 7.28, rz: -.18, lift: 0, dx: 0, dy: .09, ds: .23, cam: 12, fov: 31 },
  { p: .84, x: -.22, y: .015, size: .63, rx: .15, ry: 8.68, rz: -.15, lift: 0, dx: 0, dy: .09, ds: .23, cam: 12, fov: 31 },
  { p: .92, x: 0, y: 0, size: .60, rx: .12, ry: 12.18, rz: -.08, lift: 0, dx: 0, dy: .09, ds: .23, cam: 12, fov: 31 },
  { p: 1, x: -.22, y: 0, size: .60, rx: .12, ry: 12.28, rz: -.08, lift: 0, dx: 0, dy: .09, ds: .23, cam: 12, fov: 31 }
];
export function shotAt(p: number) {
  let i = 0;
  while (i < shots.length - 2 && p > shots[i + 1].p)
    i++;
  const a = shots[i], b = shots[i + 1], f = smooth(a.p, b.p, p), out = { ...a };
  for (const key of (Object.keys(a) as (keyof typeof a)[]))
    out[key] = mix(a[key], b[key], f);
  return out;
}
