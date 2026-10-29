// Original, dependency-free, absolute-time motion primitives. Angles are radians.
export const TAU = Math.PI * 2;
export const clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const progress = (time, start, end) => {
  if (!(end > start)) throw new RangeError('Progress requires end > start');
  return clamp((time - start) / (end - start));
};
export const smooth = x => { const t = clamp(x); return t * t * (3 - 2 * t); };
export const smoother = x => { const t = clamp(x); return t * t * t * (t * (t * 6 - 15) + 10); };
export const outCubic = x => 1 - Math.pow(1 - clamp(x), 3);
export const inCubic = x => Math.pow(clamp(x), 3);

// Solve the x coordinate before evaluating y; y(t) alone is not a CSS Bezier.
export function cubicBezier(x1, y1, x2, y2) {
  if (![x1, y1, x2, y2].every(Number.isFinite) || x1 < 0 || x1 > 1 || x2 < 0 || x2 > 1) {
    throw new RangeError('Bezier x controls must be in [0,1], all controls finite');
  }
  const axis = (t, a, b) => 3 * (1 - t) ** 2 * t * a + 3 * (1 - t) * t ** 2 * b + t ** 3;
  return x => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let low = 0, high = 1, t = x;
    for (let i = 0; i < 32; i++) {
      const value = axis(t, x1, x2);
      if (value < x) low = t; else high = t;
      t = (low + high) * 0.5;
    }
    return axis(t, y1, y2);
  };
}
export const arrive = cubicBezier(0.16, 1, 0.30, 1);
export const depart = cubicBezier(0.55, 0, 0.85, 0.35);

// A finite underdamped step response. Exact endpoint is blended over the last
// 20%, avoiding a nonzero residual when the next scene inherits the object.
export function spring01(value, damping = 7.5, cycles = 1.1) {
  if(![value,damping,cycles].every(Number.isFinite)||damping<0||cycles<=0)throw new RangeError('Spring requires finite value, nonnegative damping and positive cycles');
  const u = clamp(value);
  if (u === 0 || u === 1) return u;
  const w = TAU * cycles;
  const response = 1 - Math.exp(-damping * u) * (Math.cos(w * u) + damping / w * Math.sin(w * u));
  return lerp(response, 1, smoother(progress(u, 0.8, 1)));
}

export function hash01(id, seed = 1) {
  let x = (Math.imul((id | 0) ^ (seed | 0), 0x45d9f3b) ^ 0x9e3779b9) >>> 0;
  x ^= x >>> 16; x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15; x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}
export const stagger = (time, start, duration, delay, index) => progress(time, start + delay * index, start + delay * index + duration);
export const mixPoint = (a, b, u) => ({x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), z: lerp(a.z ?? 0, b.z ?? 0, u)});

export function regularPolygonRadius(angle, sides, circumradius = 1) {
  if (!Number.isInteger(sides) || sides < 3) throw new RangeError('At least three polygon sides');
  const sector = TAU / sides;
  const local = ((angle + Math.PI / sides) % sector + sector) % sector - Math.PI / sides;
  return circumradius * Math.cos(Math.PI / sides) / Math.cos(local);
}

// Equal angular samples preserve index correspondence. phase rotates the
// entire shape; do not change it independently between morph endpoints.
export function polarContour({count = 96, radius = 1, sides = 0, phase = 0} = {}) {
  if (!Number.isInteger(count) || count < 3) throw new RangeError('Contour needs >= 3 points');
  return Array.from({length: count}, (_, i) => {
    const a = i / count * TAU;
    const r = sides ? regularPolygonRadius(a, sides, radius) : radius;
    return {x: r * Math.cos(a + phase), y: r * Math.sin(a + phase)};
  });
}
export function morphContours(a, b, u) {
  if (a.length !== b.length || a.length < 3) throw new RangeError('Morph contours require equal sample counts');
  return a.map((p, i) => mixPoint(p, b[i], u));
}

export function rotate3(point, rx = 0, ry = 0, rz = 0) {
  let {x, y, z} = point;
  [y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)];
  [x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)];
  [x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)];
  return {x, y, z};
}

// Positive z recedes from a camera at (0,0,-distance). Returns null when clipped.
export function project3(point, {cx = 960, cy = 540, focal = 1050, distance = 1050, near = 40, far = 10000} = {}) {
  const depth = point.z + distance;
  if (depth <= near || depth >= far) return null;
  const scale = focal / depth;
  return {x: cx + point.x * scale, y: cy + point.y * scale, depth, scale};
}

export function spherePoint(id, count, radius = 1) {
  if (!Number.isInteger(id)||!Number.isInteger(count)||id < 0 || id >= count || count < 1||!Number.isFinite(radius)||radius<0) throw new RangeError('Invalid sphere point parameters');
  const y = 1 - 2 * ((id + 0.5) / count);
  const ring = Math.sqrt(Math.max(0, 1 - y * y));
  const angle = id * Math.PI * (3 - Math.sqrt(5));
  return {x: radius * ring * Math.cos(angle), y: radius * y, z: radius * ring * Math.sin(angle)};
}
export function torusPoint(id, count, major = 1, minor = 0.35) {
  if(!Number.isInteger(id)||!Number.isInteger(count)||count<1||id<0||id>=count||![major,minor].every(Number.isFinite)||major<=0||minor<0)throw new RangeError('Invalid torus point parameters');
  const u = TAU * id / count;
  const v = TAU * ((id * 0.618033988749895) % 1);
  return {x: (major + minor * Math.cos(v)) * Math.cos(u), y: minor * Math.sin(v), z: (major + minor * Math.cos(v)) * Math.sin(u)};
}
export const radialWave = (x, y, time, {frequency = 0.55, speed = 4, decay = 0.025} = {}) => Math.sin(Math.hypot(x, y) * frequency - time * speed) * Math.exp(-Math.hypot(x, y) * decay);
export function coverRadius(cx, cy, width, height, margin = 2) {
  return Math.max(...[[0, 0], [width, 0], [0, height], [width, height]].map(([x, y]) => Math.hypot(x - cx, y - cy))) + margin;
}

export function visibleTextBounds(ctx, text) {
  const m = ctx.measureText(text);
  return {left: -m.actualBoundingBoxLeft, right: m.actualBoundingBoxRight, top: -m.actualBoundingBoxAscent, bottom: m.actualBoundingBoxDescent, advance: m.width};
}

export function fitFont(ctx, text, family, weight, maxWidth, maxHeight, initialSize = 400) {
  let low = 1, high = initialSize;
  for (let i = 0; i < 18; i++) {
    const size = (low + high) / 2;
    ctx.font = `${weight} ${size}px ${family}`;
    const b = visibleTextBounds(ctx, text);
    if (b.right - b.left <= maxWidth && b.bottom - b.top <= maxHeight) low = size; else high = size;
  }
  ctx.font = `${weight} ${low}px ${family}`;
  return {size: low, ...visibleTextBounds(ctx, text)};
}
