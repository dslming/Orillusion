import { mergeBufferGeometries as l } from "https://cdn.skypack.dev/three@0.136/examples/jsm/utils/BufferGeometryUtils.js";

function c(i) { const n = i.attributes.position.count,
    e = i.attributes.position,
    o = i.attributes.normal,
    s = i.attributes.uv,
    a = e.itemSize + o.itemSize + s.itemSize,
    r = new Float32Array(n * a); for (let t = 0; t < n; ++t) r.set(e.array.subarray(t * e.itemSize, (t + 1) * e.itemSize), t * a), r.set(o.array.subarray(t * o.itemSize, (t + 1) * o.itemSize), t * a + e.itemSize), r.set(s.array.subarray(t * s.itemSize, (t + 1) * s.itemSize), t * a + e.itemSize + o.itemSize); return r }

function m(...i) { let n, e; if (i.length > 1) { n = []; let r = 0; for (let t = 0; t < i.length; ++t) { let u = i[t];
      n.push({ offset: r, count: u.index.count }), r += u.index.array.length } e = l(i) } else e = i[0]; const o = c(e),
    s = e.attributes.position.count,
    a = new Uint16Array(e.index.array); for (let r of i) r.dispose(); return e.dispose(), { vertex: o, vertexCount: s, index: a, lod: n } }
export { m as l };
