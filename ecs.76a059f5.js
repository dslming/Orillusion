var tt = Object.defineProperty,
  et = Object.defineProperties;
var it = Object.getOwnPropertyDescriptors;
var J = Object.getOwnPropertySymbols;
var rt = Object.prototype.hasOwnProperty,
  nt = Object.prototype.propertyIsEnumerable;
var V = (e, t, r) => t in e ? tt(e, t, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: r
  }) : e[t] = r,
  N = (e, t) => {
    for (var r in t || (t = {}))
      rt.call(t, r) && V(e, r, t[r]);
    if (J)
      for (var r of J(t))
        nt.call(t, r) && V(e, r, t[r]);
    return e
  },
  X = (e, t) => et(e, it(t));
var o = (e, t, r) => (V(e, typeof t != "symbol" ? t + "" : t, r),
  r);
const st = function() {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload"))
    return;
  for (const n of document.querySelectorAll('link[rel="modulepreload"]'))
    i(n);
  new MutationObserver(n => {
    for (const s of n)
      if (s.type === "childList")
        for (const a of s.addedNodes)
          a.tagName === "LINK" && a.rel === "modulepreload" && i(a)
  }).observe(document, {
    childList: !0,
    subtree: !0
  });

  function r(n) {
    const s = {};
    return n.integrity && (s.integrity = n.integrity),
      n.referrerpolicy && (s.referrerPolicy = n.referrerpolicy),
      n.crossorigin === "use-credentials" ? s.credentials = "include" : n.crossorigin === "anonymous" ? s.credentials = "omit" : s.credentials = "same-origin",
      s
  }

  function i(n) {
    if (n.ep)
      return;
    n.ep = !0;
    const s = r(n);
    fetch(n.href, s)
  }
};
st();
if (typeof SharedArrayBuffer == "undefined") {
  // throw new Error("SharedArrayBuffer is not supported");
  window.SharedArrayBuffer = ArrayBuffer
}
const f = {
  any: Array,
  i8: Int8Array,
  u8: Uint8Array,
  i16: Int16Array,
  u16: Uint16Array,
  i32: Int32Array,
  u32: Uint32Array,
  f32: Float32Array,
  f64: Float64Array,
  i64: BigInt64Array,
  u64: BigUint64Array
};

function E(e, t) {
  if (e.BYTES_PER_ELEMENT) {
    let r = e.BYTES_PER_ELEMENT,
      i = new SharedArrayBuffer(r * t);
    return new e(i)
  } else
    return new e(t)
}

function T(...e) {
  return {
    op: 2,
    c: e
  }
}
class at {
  constructor(t) {
    o(this, "_queryCache", new Map);
    o(this, "_idCache", new Map);
    o(this, "App");
    o(this, "maxId");
    o(this, "MAX_ENTITIES");
    o(this, "DEBUG");
    this.App = t,
      this.maxId = t.getMaxId(),
      this.MAX_ENTITIES = t.option.max,
      this.DEBUG = t.option.debug,
      this.DEBUG && console.log(this)
  }
  _loop(t) {
    var n;
    let r = JSON.stringify(t);
    if (((n = r.match(/\"op\"/g)) == null ? void 0 : n.length) === 1) {
      let s = this._idCache.get(r);
      if (s)
        return s
    }
    r = "";
    let i = new Uint8Array(this.MAX_ENTITIES).fill(t.op == 1 ? 0 : 1);
    for (let s of t.c)
      if (typeof s == "string") {
        let a = this.App.getComponent(s);
        if (!a)
          throw new Error("no component:" + s);
        let h = a.ids;
        this._match(i, h, t.op)
      } else {
        let a = this._loop(s);
        this._match(i, a, t.op),
          r = JSON.stringify(s)
      }
    return r === "" && (r = JSON.stringify(t)),
      this._idCache.set(r, i),
      i
  }
  _match(t, r, i) {
    switch (i) {
      case 0:
        for (let n = 0; n < this.maxId; n++)
          t[n] = r[n] ? 0 : t[n];
        break;
      case 1:
        for (let n = 0; n < this.maxId; n++)
          t[n] = r[n] || t[n];
        break;
      case 2:
        for (let n = 0; n < this.maxId; n++)
          t[n] = r[n] && t[n];
        break
    }
  }
  _filter(t) {
    let r = E(Uint32Array, this.maxId),
      i = 0;
    for (let n = 0; n < this.maxId; n++)
      t[n] > 0 && (r[i] = n,
        i++);
    return r.subarray(0, i)
  }
  query(t) {
    let r = JSON.stringify(t),
      i = this._queryCache.get(r);
    if (i)
      return i;
    this.DEBUG && console.time("[query]:" + r),
      this.maxId = this.App.getMaxId();
    let n = this._loop(t),
      s = this._filter(n);
    return this._queryCache.set(r, s),
      this.DEBUG && console.timeEnd("[query]:" + r),
      s
  }
  update(t, r, i) {
    if (this._queryCache.size > 0) {
      this.DEBUG && console.time("[query update]:" + t);
      for (let n of this._idCache.keys())
        n.match(t) && this._idCache.delete(n);
      for (let n of this._queryCache.keys())
        n.match(t) && this._queryCache.delete(n);
      this.DEBUG && console.timeEnd("[query update]:" + t)
    }
  }
}
class ot extends Object {
  constructor(t, r) {
    super();
    o(this, "id");
    this.id = r;
    const i = {
      addChildren: s => {
        t.addChildren(this.id, s)
      },
      removeChildren: s => {
        t.removeChildren(this.id, s)
      },
      addToParent: s => {
        t.addChildren(s, this.id)
      },
      removeFromParent: () => {
        t.removeFromParent(this.id)
      },
      clearChildren: () => {
        t.clearChildren(this.id)
      },
      traverse: s => {
        t.traverse(this.id, s)
      },
      destroyEntity: () => {
        t.destroyEntity(this.id)
      },
      addComponent: s => t.addComponent(this.id, s),
      removeComponent: s => t.removeComponent(this.id, s)
    };
    return new Proxy(this, {
      get: function(s, a) {
        if (a === "children")
          return t.getChildren(s.id);
        if (a === "id")
          return s.id;
        if (a in i)
          return i[a];
        try {
          let h = t.getComponent(a);
          if (h.ids[s.id] === 1) {
            let l = h.getData(s.id);
            return new Proxy(l, {
              set: function(p, c, d) {
                let u = {};
                return u[c] = d,
                  h == null || h.setData(s.id, u),
                  !0
              }
            })
          } else
            return
        } catch {
          return
        }
      },
      set: function(s, a, h) {
        if (a === "id")
          return !0;
        let l = t.getComponent(a);
        return l && l.ids[s.id] === 1 && l.setData(s.id, h),
          !0
      }
    })
  }
}
class ht {
  constructor(t, r) {
    o(this, "name", "");
    o(this, "ids");
    o(this, "data", {});
    o(this, "primitives");
    o(this, "init");
    o(this, "add");
    o(this, "update");
    o(this, "remove");
    o(this, "scheme", {});
    if (this.ids = E(Uint8Array, r),
      "scheme" in t) {
      Object.assign(this.scheme, t.scheme);
      for (let i in this.scheme) {
        let n = this.scheme[i];
        n.offset ? this.data[i] = E(n.type, r * n.offset) : this.data[i] = E(n, r)
      }
    }
    for (let i in t)
      /data|scheme/.test(i) || (this[i] = t[i])
  }
  getData(t) {
    let r = {};
    for (let i in this.scheme) {
      if (i.match(/\_\w+/))
        continue;
      let n = this.scheme[i];
      n.offset ? r[i] = this.data[i].subarray(t * 3, t * 3 + n.offset) : r[i] = this.data[i][t]
    }
    return r
  }
  setData(t, r) {
    for (let i in r) {
      let n = this.scheme[i];
      if (n)
        if (n.offset && r[i].constructor === Array) {
          if (r[i].length > n.offset)
            throw new Error("cannot set data");
          for (let s = 0; s < r[i].length; s++)
            this.data[i][t * n.offset + s] = r[i][s]
        } else
          this.data[i][t] = r[i];
      else
        throw new Error("cannot set data")
    }
    this.update && this.update(t, r)
  }
}
class lt {
  constructor(t) {
    o(this, "name", "");
    o(this, "data");
    o(this, "init");
    o(this, "tick");
    o(this, "remove");
    o(this, "play");
    o(this, "pause");
    o(this, "watch", {});
    o(this, "__active", !0);
    let r = this;
    "data" in t ? this.data = new Proxy(t.data, {
      get: function(i, n) {
        return i[n]
      },
      set: function(i, n, s) {
        var a;
        return i[n] === void 0 ? !1 : (i[n] = s,
          (a = r.watch[n]) == null || a.call(r, s),
          !0)
      }
    }) : this.data = {};
    for (let i in t)
      i !== "data" && (this[i] = t[i])
  }
  toggle() {
    this.__active ? this.stop() : this.start()
  }
  start() {
    var t;
    this.__active = !0,
      (t = this.play) == null || t.call(this)
  }
  stop() {
    var t;
    this.__active = !1,
      (t = this.pause) == null || t.call(this)
  }
}
const ct = {
  name: "_default",
  scheme: {
    x: f.f32
  },
  init: function(e) {
    console.log("init", e)
  },
  add: function(e) {
    console.log("added", e)
  },
  update: function(e) {
    console.log("updated", e)
  },
  remove: function(e) {
    console.log("removed", e)
  }
};
var dt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: ct
});
const ft = {
  name: "position",
  scheme: {
    x: f.f32,
    y: f.f32,
    z: f.f32
  },
  init: function(e) {
    this.App = e
  },
  remove: function(e) {
    this.data.x[e] = 0,
      this.data.y[e] = 0,
      this.data.z[e] = 0
  },
  update: function(e) {
    this.transform || (this.transform = this.App.getData("transform")),
      this.transform.needUpdate[e] = 1
  },
  getDistance(e, t) {
    const r = this.data.x[e],
      i = this.data.y[e],
      n = this.data.z[e],
      s = this.data.x[t],
      a = this.data.y[t],
      h = this.data.z[t],
      l = r - s,
      p = i - a,
      c = n - h;
    return Math.sqrt(l * l + p * p + c * c)
  }
};
var ut = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: ft
});
const mt = {
  name: "rotation",
  scheme: {
    x: f.f32,
    y: f.f32,
    z: f.f32
  },
  init: function(e) {
    this.App = e
  },
  remove: function(e) {
    this.data.x[e] = 0,
      this.data.y[e] = 0,
      this.data.z[e] = 0
  },
  update: function(e) {
    this.transform || (this.transform = this.App.getData("transform")),
      this.transform.needUpdate[e] = 1
  }
};
var pt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: mt
});
const gt = {
  name: "scale",
  scheme: {
    x: f.f32,
    y: f.f32,
    z: f.f32
  },
  init: function(e) {
    this.App = e
  },
  add: function(e) {
    this.data.x[e] = 1,
      this.data.y[e] = 1,
      this.data.z[e] = 1
  },
  update: function(e) {
    this.transform || (this.transform = this.App.getData("transform")),
      this.transform.needUpdate[e] = 1
  }
};
var yt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: gt
});
const vt = {
  name: "transform",
  scheme: {
    localMatrix: {
      offset: 16,
      type: f.f32
    },
    worldMatrix: {
      offset: 16,
      type: f.f32
    },
    needUpdate: f.u8
  },
  init: function(e) {
    this.App = e
  },
  add: function(e) {
    this.App.addComponent(e, "position"),
      this.App.addComponent(e, "rotation"),
      this.App.addComponent(e, "scale");
    let t = e * 16;
    this.data.localMatrix[t + 0] = 1,
      this.data.localMatrix[t + 5] = 1,
      this.data.localMatrix[t + 10] = 1,
      this.data.localMatrix[t + 15] = 1,
      this.data.worldMatrix[t + 0] = 1,
      this.data.worldMatrix[t + 5] = 1,
      this.data.worldMatrix[t + 10] = 1,
      this.data.worldMatrix[t + 15] = 1,
      this.data.needUpdate[e] = 1
  },
  update: function(e) {
    this.data.needUpdate[e] = 1
  }
};
var xt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: vt
});
const _t = {
  name: "camera",
  scheme: {
    fovy: f.f32,
    aspect: f.f32,
    near: f.f32,
    far: f.f32,
    needUpdate: f.u8
  },
  init: function(e) {
    this.App = e
  },
  add: function(e) {
    this.App.addComponent(e, "position"),
      this.App.addComponent(e, "rotation"),
      this.data.fovy[e] = 2 * Math.PI / 5,
      this.data.aspect[e] = 16 / 9,
      this.data.near[e] = 1,
      this.data.far[e] = 1e5,
      this.data.needUpdate[e] = 1
  },
  update: function(e) {
    this.data.needUpdate[e] = 1
  }
};
var wt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: _t
});
const bt = {
  name: "geometry",
  scheme: {
    primitive: f.any,
    lod: f.u8,
    needUpdate: f.u8
  },
  primitives: new Map,
  registerGeometry(e, t) {
    if (this.primitives.has(e))
      throw new Error("geometry already registered");
    this.primitives.set(e, t)
  },
  setGeometry(e, t) {
    if (!this.primitives.has(t))
      throw new Error("Unkown geometry name: " + t);
    this.data.primitive[e] = t,
      this.data.needUpdate[e] = 1
  },
  getGeometry(e) {
    return this.primitives.get(this.data.primitive[e])
  },
  getVertex(e) {
    return this.primitives.get(this.data.primitive[e]).vertex
  },
  getIndex(e) {
    return this.primitives.get(this.data.primitive[e]).index
  },
  getVertexCount(e) {
    return this.primitives.get(this.data.primitive[e]).vertexCount
  },
  update(e) {
    this.data.needUpdate[e] = 1
  }
};
var Pt = Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    def: bt
  }),
  Mt = `[[block]] struct TextureConfig {
    config : i32;
};
[[block]] struct Light {
    config : [[stride(64)]] array<mat4x4<f32>>;
};
[[group(1), binding(0)]] var<uniform> textureConfig: TextureConfig;
[[group(1), binding(1)]] var Sampler: sampler;
[[group(1), binding(2)]] var Texture: texture_2d<f32>;
[[group(1), binding(3)]] var<storage, read> lights: Light;

[[ stage( fragment ) ]]
fn main(
    [[builtin(position)]] position : vec4<f32>,
    [[ location( 0 ) ]] normal : vec3<f32>,
    [[ location( 1 ) ]] uv : vec2<f32>,
    [[ location( 2 ) ]] color : vec4<f32>,
    [[ location( 3 ) ]] fragPosition : vec4<f32>
) -> [[ location( 0 ) ]] vec4<f32> {
    var lightConfig = lights.config[0];
    if(textureConfig.config == 1){
        return textureSample(Texture, Sampler, uv);
    }
    return color;
}`,
  Ct = `[[block]] struct Uniforms {
    matrix : [[stride(64)]] array<mat4x4<f32>>;
};
[[block]] struct TextureConfig {
    config : i32;
};
[[block]] struct Light {
    config : [[stride(64)]] array<mat4x4<f32>>;
};
[[binding(0), group(0)]] var<storage, read> models : Uniforms;
[[group(1), binding(0)]] var<uniform> textureConfig: TextureConfig;
[[group(1), binding(1)]] var Sampler: sampler;
[[group(1), binding(2)]] var Texture: texture_2d<f32>;
[[group(1), binding(3)]] var<storage, read> lights: Light;

[[ stage( fragment ) ]]
fn main(
    [[builtin(position)]] position : vec4<f32>,
    [[ location( 0 ) ]] normal : vec3<f32>,
    [[ location( 1 ) ]] uv : vec2<f32>,
    [[ location( 2 ) ]] Color : vec4<f32>,
    [[ location( 3 ) ]] fragPosition : vec4<f32>
) -> [[ location( 0 ) ]] vec4<f32> {
    var color = Color;
    if(textureConfig.config == 1){
        color = textureSample(Texture, Sampler, uv);
    }
    var index:i32 = 0;
    var ambient: vec3<f32> = vec3<f32>(0.25, 0.25, 0.25);
    var result:vec3<f32> = color.xyz;
    var totalLight:vec3<f32> = vec3<f32>(0.0, 0.0, 0.0);
    loop{
        var lightConfig: mat4x4<f32> = lights.config[index];
        index = index + 1;

        var lightType:i32 = i32(lightConfig[0][1]);
        if(lightType == 0){
            break;
        }
        var id:u32 = u32(lightConfig[0][0]);
        var lightIntensity = lightConfig[0][2];
        var lightDistance = lightConfig[0][3];
        var lightColor = vec3<f32>(lightConfig[1][0],lightConfig[1][1],lightConfig[1][2]);
        var worldMatrix:mat4x4<f32> = models.matrix[id];
        var lightPosition:vec3<f32> = vec3<f32>(worldMatrix[3][0], worldMatrix[3][1], worldMatrix[3][2]);
        // ambient
        if (lightType == 1) {
            ambient = lightColor * lightIntensity;
            continue;
        }
        // pointLight
        if (lightType == 2) {
            var L = lightPosition - fragPosition.xyz;
            var distance = length(L);
            if(distance < lightDistance){
                var lambertFactor: f32 = max(dot(normalize(L), normal), 0.0);
                var localLight:vec3<f32> = lambertFactor * pow(1.0 - distance / lightDistance, 2.0) * lightColor * color.xyz;
                totalLight = totalLight + localLight * lightIntensity;
            }
            continue;
        }
        // DirectionalLight
        if (lightType == 3) {
            var lambertFactor: f32 = max(dot(normalize(lightPosition), normal), 0.0);
            var localLight:vec3<f32> = lambertFactor * lightColor * color.xyz;
            totalLight = totalLight + localLight * lightIntensity;
            continue;
        }
    }
    return vec4<f32>(result * ambient + totalLight, color.a);
}`;
const Tt = {
  name: "material",
  scheme: {
    color: {
      offset: 4,
      type: f.f32
    },
    fragShader: f.any,
    type: f.u8,
    transparent: f.u8,
    side: f.u8,
    blending: f.u8,
    texture: f.any,
    colorUpdate: f.u8,
    needUpdate: f.u8
  },
  primitives: {
    basicColor: Mt,
    lambert: Ct
  },
  add: function(e) {
    this.data.color[e * 4 + 0] = 1,
      this.data.color[e * 4 + 1] = 1,
      this.data.color[e * 4 + 2] = 1,
      this.data.color[e * 4 + 3] = 1,
      this.data.type[e] = 0,
      this.data.colorUpdate[e] = 1,
      this.data.needUpdate[e] = 1
  },
  update: function(e) {
    this.data.needUpdate[e] = 1
  },
  setMaterial(e, t) {
    if (!this.primitives[t])
      throw new Error("Unkown texture name: " + t);
    this.data.fragShader[e] = t,
      this.data.needUpdate[e] = 1
  },
  getMaterial(e) {
    return this.primitives[this.data.fragShader[e]]
  },
  setColor(e, t = 1, r = 1, i = 1, n = 1) {
    if (typeof t == "object")
      this.data.color[e * 4] = t.r || this.data.color[e * 4],
      this.data.color[e * 4 + 1] = t.g || this.data.color[e * 4 + 1],
      this.data.color[e * 4 + 2] = t.b || this.data.color[e * 4 + 2],
      this.data.color[e * 4 + 3] = t.a || this.data.color[e * 4 + 3];
    else if (typeof t == "number")
      this.data.color[e * 4] = t,
      this.data.color[e * 4 + 1] = r,
      this.data.color[e * 4 + 2] = i,
      this.data.color[e * 4 + 3] = n;
    else if (typeof t == "string" && t.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
      const s = +("0x" + t.slice(1, 3)),
        a = +("0x" + t.slice(3, 5)),
        h = +("0x" + t.slice(5, 7));
      this.data.color[e * 4] = s / 255,
        this.data.color[e * 4 + 1] = a / 255,
        this.data.color[e * 4 + 2] = h / 255,
        this.data.color[e * 4 + 3] = 1
    } else
      throw new Error("unknown color type");
    this.data.transparent[e] = this.data.color[e * 4 + 3] < 1,
      this.data.colorUpdate[e] = 1
  }
};
var Et = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: Tt
});
const Gt = {
  name: "light",
  scheme: {
    type: f.u32,
    color: {
      type: f.f32,
      offset: 3
    },
    intensity: f.f32,
    distance: f.f32,
    needUpdate: f.u8
  },
  init: function(e) {
    this.App = e
  },
  add: function(e) {
    this.data.color[e * 3 + 0] = 1,
      this.data.color[e * 3 + 1] = 1,
      this.data.color[e * 3 + 2] = 1,
      this.data.intensity[e] = 1,
      this.data.needUpdate[e] = 1,
      this.App.addComponent(e, "transform")
  },
  update: function(e) {
    this.data.needUpdate[e] = 1
  },
  setColor(e, t = 1, r = 1, i = 1) {
    if (typeof t == "object")
      this.data.color[e * 3] = t.r || this.data.color[e * 3],
      this.data.color[e * 3 + 1] = t.g || this.data.color[e * 3 + 1],
      this.data.color[e * 3 + 2] = t.b || this.data.color[e * 3 + 2];
    else if (typeof t == "number")
      this.data.color[e * 3] = t,
      this.data.color[e * 3 + 1] = r,
      this.data.color[e * 3 + 2] = i;
    else if (typeof t == "string" && t.match(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)) {
      const n = +("0x" + t.slice(1, 3)),
        s = +("0x" + t.slice(3, 5)),
        a = +("0x" + t.slice(5, 7));
      this.data.color[e * 3] = n / 255,
        this.data.color[e * 3 + 1] = s / 255,
        this.data.color[e * 3 + 2] = a / 255
    } else
      throw new Error("unknown color type");
    this.data.needUpdate[e] = 1
  }
};
var It = Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    def: Gt
  }),
  K = Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    template: dt,
    position: ut,
    rotation: pt,
    scale: yt,
    transform: xt,
    camera: wt,
    geometry: Pt,
    material: Et,
    light: It
  });
const Ut = {
  name: "_default",
  data: {},
  watch: {},
  init: async function(e, t) {
    console.log("[system mounted]")
  },
  tick: async function() {},
  play: function() {
    console.log("system started")
  },
  pause: function() {
    console.log("system stoped")
  }
};
var St = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: Ut
});
const Y = 1e-6;

function Bt(e, t, r, i = 0) {
  let n = t[0],
    s = t[1],
    a = t[2],
    h = t[3],
    l = t[4],
    p = t[5],
    c = t[6],
    d = t[7],
    u = t[8],
    m = t[9],
    w = t[10],
    b = t[11],
    P = t[12],
    M = t[13],
    C = t[14],
    g = t[15],
    y = r[i + 0],
    v = r[i + 1],
    x = r[i + 2],
    _ = r[i + 3];
  e[i + 0] = y * n + v * l + x * u + _ * P,
    e[i + 1] = y * s + v * p + x * m + _ * M,
    e[i + 2] = y * a + v * c + x * w + _ * C,
    e[i + 3] = y * h + v * d + x * b + _ * g,
    y = r[i + 4],
    v = r[i + 5],
    x = r[i + 6],
    _ = r[i + 7],
    e[i + 4] = y * n + v * l + x * u + _ * P,
    e[i + 5] = y * s + v * p + x * m + _ * M,
    e[i + 6] = y * a + v * c + x * w + _ * C,
    e[i + 7] = y * h + v * d + x * b + _ * g,
    y = r[i + 8],
    v = r[i + 9],
    x = r[i + 10],
    _ = r[i + 11],
    e[i + 8] = y * n + v * l + x * u + _ * P,
    e[i + 9] = y * s + v * p + x * m + _ * M,
    e[i + 10] = y * a + v * c + x * w + _ * C,
    e[i + 11] = y * h + v * d + x * b + _ * g,
    y = r[i + 12],
    v = r[i + 13],
    x = r[i + 14],
    _ = r[i + 15],
    e[i + 12] = y * n + v * l + x * u + _ * P,
    e[i + 13] = y * s + v * p + x * m + _ * M,
    e[i + 14] = y * a + v * c + x * w + _ * C,
    e[i + 15] = y * h + v * d + x * b + _ * g
}

function Dt(e, t, r, i) {
  const n = r * 16,
    s = i * 16,
    a = e[n + 0],
    h = e[n + 4],
    l = e[n + 8],
    p = e[n + 12],
    c = e[n + 1],
    d = e[n + 5],
    u = e[n + 9],
    m = e[n + 13],
    w = e[n + 2],
    b = e[n + 6],
    P = e[n + 10],
    M = e[n + 14],
    C = e[n + 3],
    g = e[n + 7],
    y = e[n + 11],
    v = e[n + 15],
    x = t[s + 0],
    _ = t[s + 4],
    G = t[s + 8],
    I = t[s + 12],
    U = t[s + 1],
    S = t[s + 5],
    B = t[s + 9],
    D = t[s + 13],
    A = t[s + 2],
    R = t[s + 6],
    z = t[s + 10],
    L = t[s + 14],
    H = t[s + 3],
    k = t[s + 7],
    O = t[s + 11],
    q = t[s + 15];
  e[s + 0] = a * x + h * U + l * A + p * H,
    e[s + 4] = a * _ + h * S + l * R + p * k,
    e[s + 8] = a * G + h * B + l * z + p * O,
    e[s + 12] = a * I + h * D + l * L + p * q,
    e[s + 1] = c * x + d * U + u * A + m * H,
    e[s + 5] = c * _ + d * S + u * R + m * k,
    e[s + 9] = c * G + d * B + u * z + m * O,
    e[s + 13] = c * I + d * D + u * L + m * q,
    e[s + 2] = w * x + b * U + P * A + M * H,
    e[s + 6] = w * _ + b * S + P * R + M * k,
    e[s + 10] = w * G + b * B + P * z + M * O,
    e[s + 14] = w * I + b * D + P * L + M * q,
    e[s + 3] = C * x + g * U + y * A + v * H,
    e[s + 7] = C * _ + g * S + y * R + v * k,
    e[s + 11] = C * G + g * B + y * z + v * O,
    e[s + 15] = C * I + g * D + y * L + v * q
}

function Q() {
  let e = new Float32Array(16);
  return e[0] = 1,
    e[5] = 1,
    e[10] = 1,
    e[15] = 1,
    e
}

function At(e) {
  return e[0] = 1,
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = 0,
    e[5] = 1,
    e[6] = 0,
    e[7] = 0,
    e[8] = 0,
    e[9] = 0,
    e[10] = 1,
    e[11] = 0,
    e[12] = 0,
    e[13] = 0,
    e[14] = 0,
    e[15] = 1,
    e
}

function Rt(e, t, r, i, n, s, a, h, l, p) {
  let c, d, u, m, w, b, P, M, C, g, y = t,
    v = r,
    x = i,
    _ = h,
    G = l,
    I = p,
    U = n,
    S = s,
    B = a;
  return Math.abs(y - U) < Y && Math.abs(v - S) < Y && Math.abs(x - B) < Y ? At(e) : (P = y - U,
    M = v - S,
    C = x - B,
    g = 1 / Math.hypot(P, M, C),
    P *= g,
    M *= g,
    C *= g,
    c = G * C - I * M,
    d = I * P - _ * C,
    u = _ * M - G * P,
    g = Math.hypot(c, d, u),
    g ? (g = 1 / g,
      c *= g,
      d *= g,
      u *= g) : (c = 0,
      d = 0,
      u = 0),
    m = M * u - C * d,
    w = C * c - P * u,
    b = P * d - M * c,
    g = Math.hypot(m, w, b),
    g ? (g = 1 / g,
      m *= g,
      w *= g,
      b *= g) : (m = 0,
      w = 0,
      b = 0),
    e[0] = c,
    e[1] = m,
    e[2] = P,
    e[3] = 0,
    e[4] = d,
    e[5] = w,
    e[6] = M,
    e[7] = 0,
    e[8] = u,
    e[9] = b,
    e[10] = C,
    e[11] = 0,
    e[12] = -(c * y + d * v + u * x),
    e[13] = -(m * y + w * v + b * x),
    e[14] = -(P * y + M * v + C * x),
    e[15] = 1,
    e)
}

function zt(e, t, r, i, n) {
  let s = 1 / Math.tan(t / 2),
    a;
  return e[0] = s / r,
    e[1] = 0,
    e[2] = 0,
    e[3] = 0,
    e[4] = 0,
    e[5] = s,
    e[6] = 0,
    e[7] = 0,
    e[8] = 0,
    e[9] = 0,
    e[11] = -1,
    e[12] = 0,
    e[13] = 0,
    e[15] = 0,
    n != null && n !== 1 / 0 ? (a = 1 / (i - n),
      e[10] = (n + i) * a,
      e[14] = 2 * n * i * a) : (e[10] = -1,
      e[14] = -2 * i),
    e
}

function Lt() {
  return new Worker("./transformWorker.86e50aca.js", {
    type: "module"
  })
}
const Ht = {
  name: "transform",
  data: {
    poolSize: navigator.hardwareConcurrency ? Math.ceil(navigator.hardwareConcurrency / 2) : 2,
    viewProjectionMatrix: E(Float32Array, 16)
  },
  init: function(e, t) {
    console.log("[transform mounted]"),
      this.App = e,
      this.parents = e.getRawParents(),
      this.position = e.getData("position"),
      this.rotation = e.getData("rotation"),
      this.scale = e.getData("scale"),
      this.transform = e.getData("transform"),
      this.ids = e.query(T("transform")),
      this.camera = e.getData("camera"),
      this.activeCamera = e.query(T("camera")),
      this.viewMatrix = Q(),
      this.projectionMatrix = Q(),
      this.writeTransform = !1,
      this.writeCamera = !1,
      t.poolSize && (this.data.poolSize = t.poolSize),
      this.initWorker(this.data.poolSize)
  },
  tick: async function() {
    let e = this.App.query(T("transform"));
    if (this.ids !== e) {
      this.ids = e;
      for (let i of this.pool)
        i.postMessage({
          type: "update",
          ids: e
        })
    }
    this.writeTransform = this.transform.needUpdate.includes(1);
    let t = 0;
    await new Promise(i => {
      this.res = i;
      for (let n of this.pool)
        n.postMessage("run"),
        n.onmessage = () => {
          t++,
          t == this.data.poolSize && i(!0)
        };
      this.updateCamera()
    });
    let r = this.App._children.keys();
    for (let i of r)
      i !== 0 && this.parents[i] === 0 && this.App.traverse(i, n => {
        (this.transform.needUpdate[n] || (this.transform.needUpdate[n] = this.transform.needUpdate[i])) && Dt(this.transform.worldMatrix, this.transform.localMatrix, i, n)
      });
    this.writeTransform && this.transform.needUpdate.fill(0)
  },
  updateCamera() {
    let e = this.activeCamera[0];
    this.camera.needUpdate[e] == 1 && (Rt(this.viewMatrix, this.position.x[e], this.position.y[e], this.position.z[e], 0, 0, 0, 0, 1, 0),
      zt(this.projectionMatrix, this.camera.fovy[e], this.camera.aspect[e], this.camera.near[e], this.camera.far[e]),
      Bt(this.data.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix),
      this.camera.needUpdate[e] = 0,
      this.writeCamera = !0)
  },
  initWorker(e) {
    this.pool = [];
    for (let t = 0; t < e; ++t) {
      let r = new Lt;
      r.postMessage({
          type: "init",
          index: t,
          poolSize: e,
          ids: this.ids,
          parents: this.parents,
          position: this.position,
          scale: this.scale,
          rotation: this.rotation,
          transform: this.transform
        }),
        this.pool.push(r)
    }
  },
  watch: {
    poolSize: function(e) {
      if (!!this.pool) {
        for (let t of this.pool)
          t.terminate(),
          this.res && this.res(!0);
        this.initWorker(e)
      }
    }
  },
  play: function() {
    console.log("transform started")
  },
  pause: function() {
    console.log("transform stoped")
  }
};
var kt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: Ht
});
const Ot = (() => {
    const e = navigator.userAgent.match(/Chrome\/\d+/);
    return e && e[0] ? +e[0].slice(7) : 0
  })(),
  j = new Map,
  F = (e, t) => {
    if (j.has(t))
      return j.get(t);
    const r = e.createShaderModule({
      code: Ot > 98 ? t.replace(/\[\[block\]\]/g, "") : t
    });
    return j.set(t, r),
      r
  };
var qt = `var<private> pos : array<vec2<f32>, 3> = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0), vec2<f32>(-1.0, 3.0), vec2<f32>(3.0, -1.0)
);

[[block]]
struct VertexOutput {
    [[builtin(position)]] position : vec4<f32>;
    [[location(0)]] texCoord : vec2<f32>;
};

[[stage(vertex)]]
fn vertexMain([[builtin(vertex_index)]] vertexIndex : u32) -> VertexOutput {
    var output : VertexOutput;
    output.texCoord = pos[vertexIndex] * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5);
    output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
    return output;
}

[[binding(0), group(0)]] var imgSampler : sampler;
[[binding(1), group(0)]] var img : texture_2d<f32>;

[[stage(fragment)]]
fn fragmentMain([[location(0)]] texCoord : vec2<f32>) -> [[location(0)]] vec4<f32> {
    return textureSample(img, imgSampler, texCoord);
}`;
class Ft {
  constructor(t) {
    o(this, "pipeline");
    o(this, "groupLayout");
    o(this, "sampler");
    o(this, "device");
    this.device = t;
    const r = F(this.device, qt);
    this.pipeline = t.createRenderPipeline({
        vertex: {
          module: r,
          entryPoint: "vertexMain"
        },
        fragment: {
          module: r,
          entryPoint: "fragmentMain",
          targets: [{
            format: "rgba8unorm"
          }]
        }
      }),
      this.sampler = this.device.createSampler({
        minFilter: "linear"
      }),
      this.groupLayout = this.pipeline.getBindGroupLayout(0)
  }
  async load(t) {
    const i = await (await fetch(t)).blob(),
      n = await createImageBitmap(i),
      s = [n.width, n.height],
      a = Math.floor(Math.log2(Math.max(n.width, n.height))) + 1,
      h = this.device.createTexture({
        size: s,
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT,
        mipLevelCount: a
      });
    return this.device.queue.copyExternalImageToTexture({
        source: n
      }, {
        texture: h
      }, s),
      this.getMipmaps(h, a),
      h
  }
  getEmptyTexture(t = 1, r = 1) {
    const i = this.device.createTexture({
        size: [t, r],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT
      }),
      n = document.createElement("canvas");
    n.width = t,
      n.height = r;
    const s = n.getContext("2d");
    return s == null || s.clearRect(0, 0, t, r),
      this.device.queue.copyExternalImageToTexture({
        source: n
      }, {
        texture: i
      }, [t, r]),
      i
  }
  getMipmaps(t, r) {
    let i = t.createView({
      baseMipLevel: 0,
      mipLevelCount: 1
    });
    const n = this.device.createCommandEncoder();
    for (let s = 1; s < r; ++s) {
      const a = t.createView({
          baseMipLevel: s,
          mipLevelCount: 1
        }),
        h = n.beginRenderPass({
          colorAttachments: [{
            view: a,
            loadValue: [0, 0, 0, 0],
            storeOp: "store"
          }]
        }),
        l = this.device.createBindGroup({
          layout: this.groupLayout,
          entries: [{
            binding: 0,
            resource: this.sampler
          }, {
            binding: 1,
            resource: i
          }]
        });
      h.setPipeline(this.pipeline),
        h.setBindGroup(0, l),
        h.draw(3, 1, 0, 0),
        h.endPass(),
        i = a
    }
    this.device.queue.submit([n.finish()])
  }
}
var Vt = `[[block]] struct Uniforms {
    matrix : [[stride(64)]] array<mat4x4<f32>>;
};
[[block]] struct Camera {
    vpMatrix : mat4x4<f32>;
};
[[binding(0), group(0)]] var<storage, read> model : Uniforms;
[[binding(1), group(0)]] var<storage, read> camera : Camera;
[[binding(2), group(0)]] var<storage, write> mvp: Uniforms;

[[stage(compute), workgroup_size(64)]]
fn main(
    [[builtin(global_invocation_id)]] GlobalInvocationID : vec3<u32>,
    [[builtin(num_workgroups)]] GroupSize: vec3<u32>
) {
    var index = GlobalInvocationID.x;
    if(index >= GroupSize.x * u32(64)){
        return;
    }
    var worldMatrix = model.matrix[index];
    mvp.matrix[index] = camera.vpMatrix * worldMatrix;
}`,
  Nt = `[[block]] struct Uniforms {
    matrix : [[stride(64)]] array<mat4x4<f32>>;
};
[[block]] struct Color {
    value : [[stride(16)]] array<vec4<f32>>;
};
[[block]] struct ID {
    id : [[stride(4)]] array<u32>;
};
[[binding(0), group(0)]] var<storage, read> models : Uniforms;
[[binding(1), group(0)]] var<storage, read> mvps : Uniforms;
[[binding(2), group(0)]] var<storage, read> color : Color;
[[binding(0), group(2)]] var<storage, read> ids : ID;

struct VertexOutput {
    [[builtin(position)]] position : vec4<f32>;
    [[location(0)]] normal : vec3<f32>;
    [[location(1)]] uv : vec2<f32>;
    [[location(2)]] color : vec4<f32>;
    [[location(3)]] fragPosition : vec4<f32>;
};
[[stage(vertex)]]
fn main(
    [[builtin(instance_index)]] index : u32,
    [[location(0)]] position : vec3<f32>,
    [[location(1)]] normal : vec3<f32>,
    [[location(2)]] uv : vec2<f32>
) -> VertexOutput {
    let id = ids.id[index];
    let pm = vec4<f32>( position, 1.0 );
    let worldMatrix = models.matrix[id];
    let fragNormal = mat3x3<f32>(worldMatrix[0].xyz, worldMatrix[1].xyz, worldMatrix[2].xyz) * normal;
    let mvp = mvps.matrix[id];
    return VertexOutput(mvp * pm, fragNormal, uv, color.value[id], worldMatrix * pm);
}`;
const Xt = {
  name: "webgpuRenderer",
  data: {
    canvas: null,
    maxEntity: 256e4,
    maxLight: 512,
    hint: !0
  },
  async init(e, t) {
    console.log("[renderer mounted]");
    for (let r in t)
      r in this.data ? this.data[r] = t[r] : console.warn("Ignore unkown option: " + r);
    if (this.App = e,
      this.App.option.max > this.data.maxEntity)
      throw new Error("Exceeded WebGPURenderer maximum number: " + this.data.maxEntity);
    if (this.transform = e.getData("transform"),
      this.light = e.getData("light"),
      this._material = e.getComponent("material"),
      this.material = this._material.data,
      this._geometry = e.getComponent("geometry"),
      this.geometry = this._geometry.data,
      this.renderIds = e.query(T("isRender")),
      this.lastRenderId = this.renderIds[this.renderIds.length - 1],
      this.transformIds = e.query(T("transform")),
      this.lastTransformId = this.transformIds[this.transformIds.length - 1],
      this.lightIds = e.query(T("light")),
      this._transform = e.getSystem("transform"),
      this.cameraMatrix = this._transform.data.viewProjectionMatrix,
      this.pipelines = new Map,
      this.pipelineCache = new Map,
      this.bufferCache = new Map,
      this.viewCache = new Map,
      this.textureGroupCache = new Map,
      this.idGroupCache = new Map,
      this.dynamicGroup = [],
      this.canvas = this.data.canvas,
      !this.canvas)
      throw new Error("no canvas");
    await this.initWebGPU(),
      window.addEventListener("resize", this._resize, !1)
  },
  async initWebGPU() {
    if (!("gpu" in navigator))
      throw new Error("WebGPU is not supported");
    const e = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance"
    });
    if (!e)
      throw new Error("no gpu adapter found");
    if (this.device = await e.requestDevice(),
      !this.device)
      throw new Error("no gpu device found");
    this.context = this.canvas.getContext("webgpu"),
      this.presentationFormat = this.context.getPreferredFormat(e),
      this.initView(),
      this.initTexture(),
      this.initDeviceBuffers(),
      this.initComputePipeline(),
      this.initPipelines()
  },
  initView() {
    this.presentationSize = [this.canvas.clientWidth, this.canvas.clientHeight],
      this.context.configure({
        device: this.device,
        format: this.presentationFormat,
        size: this.presentationSize
      }),
      this.renderTarget && this.renderTarget.destroy(),
      this.renderTarget = this.device.createTexture({
        size: this.presentationSize,
        format: "depth24plus-stencil8",
        usage: GPUTextureUsage.RENDER_ATTACHMENT
      }),
      this.depthTextureView = this.renderTarget.createView(),
      this.renderPassDescriptor ? this.renderPassDescriptor.depthStencilAttachment.view = this.depthTextureView : this.renderPassDescriptor = {
        colorAttachments: [{
          view: void 0,
          loadValue: {
            r: 0,
            g: 0,
            b: 0,
            a: 1
          }
        }],
        depthStencilAttachment: {
          view: this.depthTextureView,
          depthLoadValue: 1,
          depthStoreOp: "store",
          stencilLoadValue: 0,
          stencilStoreOp: "store"
        }
      }
  },
  initTexture() {
    this.linearSampler = this.device.createSampler({
        magFilter: "linear",
        minFilter: "linear"
      }),
      this.textureLoader = new Ft(this.device),
      this.viewCache.set(void 0, this.textureLoader.getEmptyTexture().createView())
  },
  async initDeviceBuffers() {
    this.mMatrixBuffer = this.device.createBuffer({
        label: "Model Matrix Buffer",
        size: this.transform.worldMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      }),
      this.device.queue.writeBuffer(this.mMatrixBuffer, 0, this.transform.worldMatrix, 0, this.lastTransformId * 16 + 16),
      this.cameraMatrixBuffer = this.device.createBuffer({
        label: "Canera View Project Matrix Buffer",
        size: this.cameraMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      }),
      this.device.queue.writeBuffer(this.cameraMatrixBuffer, 0, this.cameraMatrix),
      this.colorBuffer = this.device.createBuffer({
        label: "Material Colors Buffer",
        size: this.material.color.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      }),
      this.device.queue.writeBuffer(this.colorBuffer, 0, this.material.color, 0, this.lastRenderId * 4 + 4),
      this.material.needUpdate.fill(0),
      this.mvpMatrixBuffer = this.device.createBuffer({
        label: "MVP Matrix Buffer",
        size: this.transform.worldMatrix.byteLength,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      }),
      this.lightBuffer = this.device.createBuffer({
        label: "Light Buffer",
        size: this.data.maxLight * 16 * 4,
        usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
      }),
      this.LightArray = new Float32Array(this.lightIds.length * 16)
  },
  async initComputePipeline() {
    this.computePipeline = await this.device.createComputePipelineAsync({
        label: "Transform Compute Pipline",
        compute: {
          module: F(this.device, Vt),
          entryPoint: "main"
        }
      }),
      this.computeGroup = this.device.createBindGroup({
        label: "MVP Compute Group",
        layout: this.computePipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: {
            buffer: this.mMatrixBuffer
          }
        }, {
          binding: 1,
          resource: {
            buffer: this.cameraMatrixBuffer
          }
        }, {
          binding: 2,
          resource: {
            buffer: this.mvpMatrixBuffer
          }
        }]
      })
  },
  async initPipelines() {
    this.pipelines.clear();
    for (let e = 0, t = this.renderIds.length; e < t; ++e) {
      const r = this.renderIds[e],
        i = this._getMaterial(r);
      let n = await this._getPipeline(i, r);
      this.pipelines.has(i) || (n.matMap.clear(),
        this.pipelines.set(i, n));
      const s = this.material.texture[r];
      if (!this.viewCache.has(s)) {
        const p = await this.textureLoader.load(s);
        this.viewCache.set(s, p.createView())
      }
      let a = n.matMap.get(s);
      a || (this.idGroupCache.clear(),
        a = new Map,
        n.matMap.set(s, a));
      const h = this._geometry.getVertex(r);
      let l = a.get(h);
      l ? l.push(r) : (l = [r],
        a.set(h, l))
    }
    this.initGroup()
  },
  initGroup() {
    this.dynamicGroup.length = 0;
    const e = this.device.createRenderBundleEncoder({
      colorFormats: [this.presentationFormat],
      depthStencilFormat: ["depth24plus-stencil8"]
    });
    this.bundleDraw(e),
      this.renderBundle = [e.finish()],
      this.geometry.needUpdate.fill(0)
  },
  bundleDraw(e) {
    this.pipelines.forEach((t, r) => {
      e.setPipeline(t.renderPipeline),
        e.setBindGroup(0, t.uniformGroup),
        t.matMap.forEach((i, n) => {
          const s = this._getTextureGroup(r, n, t.layout1);
          e.setBindGroup(1, s),
            i.forEach(a => {
              const { vertex: h, index: l, vertexCount: p, lod: c } = this._geometry.getGeometry(a[0]);
              let d = this.bufferCache.get(h);
              if (d || (d = this.device.createBuffer({
                    label: "Vertex Buffer",
                    size: h.byteLength,
                    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
                  }),
                  this.device.queue.writeBuffer(d, 0, h),
                  this.bufferCache.set(h, d)),
                e.setVertexBuffer(0, d),
                l) {
                let m = this.bufferCache.get(l);
                m || (m = this.device.createBuffer({
                      label: "Index Buffer",
                      size: l.byteLength,
                      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST
                    }),
                    this.device.queue.writeBuffer(m, 0, l),
                    this.bufferCache.set(l, m)),
                  e.setIndexBuffer(m, "uint16")
              }
              let u = this.idGroupCache.get(a);
              if (!u) {
                const m = new Uint32Array(a),
                  w = Math.min(m.length, 16384, this.device.limits.maxStorageBufferBindingSize / 4 / 16),
                  b = Math.ceil(m.length / w);
                u = [];
                for (let P = 0; P < b; ++P) {
                  const M = m.subarray(P * w, P * w + w),
                    C = this.device.createBuffer({
                      label: "IDs Buffer",
                      size: 4 * Math.min(M.length, w),
                      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
                    });
                  this.device.queue.writeBuffer(C, 0, M);
                  const g = this.device.createBindGroup({
                    layout: t.layout2,
                    entries: [{
                      binding: 0,
                      resource: {
                        buffer: C
                      }
                    }]
                  });
                  u.push({
                      ids: M,
                      idGroup: g
                    }),
                    this.idGroupCache.set(a, u)
                }
              }
              if (c) {
                this.dynamicGroup.push({
                  renderPipeline: t.renderPipeline,
                  group0: t.uniformGroup,
                  group1: s,
                  vertex: h,
                  vertexCount: p,
                  index: l,
                  lod: c,
                  groups: u
                });
                return
              }
              for (let m = 0, w = u.length; m < w; ++m) {
                const b = u[m];
                e.setBindGroup(2, b.idGroup),
                  l ? e.drawIndexed(l.length, b.ids.length, 0, 0, 0) : e.draw(p, b.ids.length, 0, 0)
              }
            })
        })
    })
  },
  dynamicDraw(e) {
    for (let t = 0, r = this.dynamicGroup.length; t < r; ++t) {
      const i = this.dynamicGroup[t];
      e.setPipeline(i.renderPipeline),
        e.setBindGroup(0, i.group0),
        e.setBindGroup(1, i.group1);
      const n = this.bufferCache.get(i.vertex);
      if (e.setVertexBuffer(0, n),
        i.index) {
        const s = this.bufferCache.get(i.index);
        e.setIndexBuffer(s, "uint16")
      }
      for (let s = 0, a = i.groups.length; s < a; ++s) {
        const h = i.groups[s];
        if (e.setBindGroup(2, h.idGroup),
          i.index)
          for (let l = 0; l < h.ids.length; ++l) {
            let p = h.ids[l],
              c = this.geometry.lod[p];
            e.drawIndexed(i.lod[c].count, 1, i.lod[c].offset, 0, l)
          }
        else
          for (let l = 0; l < h.ids.length; ++l) {
            let p = h.ids[l],
              c = this.geometry.lod[p];
            e.draw(i.lod[c].count, 1, i.lod[c].offset, l)
          }
      }
    }
  },
  async checkUpdate() {
    const e = this.App.query(T("isRender"));
    this.renderIds !== e && (this.renderIds = e,
        this.lastRenderId = this.renderIds[this.renderIds.length - 1],
        this.needGroup = !0),
      this.geometry.needUpdate.includes(1) && (this.needGroup = !0,
        this.geometry.needUpdate.fill(0)),
      this.material.needUpdate.includes(1) && (this.needGroup = !0,
        this.material.needUpdate.fill(0));
    const t = this.App.query(T("transform"));
    this.transformIds !== t && (this.transformIds = t,
      this.lastTransformId = this.transformIds[this.transformIds.length - 1]);
    const r = this.App.query(T("light"));
    this.lightIds !== r && (this.lightIds = r,
        this.LightArray = new Float32Array(this.lightIds.length * 16)),
      this.needGroup && (await this.initPipelines(),
        this.needGroup = !1),
      this.checkBuffers()
  },
  checkBuffers() {
    if (this._transform.writeCamera === !0 && (this.device.queue.writeBuffer(this.cameraMatrixBuffer, 0, this.cameraMatrix),
        this._transform.writeCamera = !1,
        this.needUpdate = !0),
      this._transform.writeTransform === !0 && (this.device.queue.writeBuffer(this.mMatrixBuffer, 0, this.transform.worldMatrix, 0, this.lastTransformId * 16 + 16),
        this._transform.writeTransform = !1,
        this.needUpdate = !0),
      this.material.colorUpdate.includes(1) && (this.device.queue.writeBuffer(this.colorBuffer, 0, this.material.color, 0, this.lastRenderId * 4 + 4),
        this.material.colorUpdate.fill(0),
        this.needUpdate = !0),
      this.light.needUpdate.includes(1)) {
      for (let e = 0, t = this.lightIds.length; e < t; ++e) {
        let r = this.lightIds[e],
          i = e * 16,
          n = r * 3;
        this.LightArray[i] = r,
          this.LightArray[i + 1] = this.light.type[r],
          this.LightArray[i + 2] = this.light.intensity[r],
          this.LightArray[i + 3] = this.light.distance[r],
          this.LightArray[i + 4] = this.light.color[n + 0],
          this.LightArray[i + 5] = this.light.color[n + 1],
          this.LightArray[i + 6] = this.light.color[n + 2]
      }
      this.device.queue.writeBuffer(this.lightBuffer, 0, this.LightArray),
        this.light.needUpdate.fill(0),
        this.needUpdate = !0
    }
  },
  async tick() {
    if (!!this.renderBundle && (this.ready || this._ready(),
        this.resized && (this.initView(),
          this.needUpdate = !0,
          this.resized = !1),
        await this.checkUpdate(),
        this.needUpdate)) {
      const e = this.device.createCommandEncoder();
      this.renderPassDescriptor.colorAttachments[0].view = this.context.getCurrentTexture().createView();
      const t = e.beginComputePass();
      t.setPipeline(this.computePipeline),
        t.setBindGroup(0, this.computeGroup),
        t.dispatch(Math.ceil(this.lastTransformId / 64)),
        t.endPass();
      const r = e.beginRenderPass(this.renderPassDescriptor);
      r.executeBundles(this.renderBundle),
        this.dynamicDraw(r),
        r.endPass(),
        this.device.queue.submit([e.finish()]),
        this.needUpdate = !1
    }
  },
  play() {
    console.log("renderer started")
  },
  pause() {
    console.log("renderer stoped")
  },
  _resize() {
    this.resized = !0
  },
  _ready() {
    if (this.ready = !0,
      globalThis.dispatchEvent(new Event("render start")),
      this.data.hint && (document == null ? void 0 : document.createElement)) {
      const e = document.createElement("span");
      e.innerHTML = "WebGPU by ORILLUSION",
        e.setAttribute("style", "position:fixed;bottom:10px;right:10px;color:white;opacity:.5;font-size:16px;font-weight:bold;pointer-events:none;z-index:11111"),
        this.canvas.parentElement.appendChild(e)
    }
  },
  _getBlend(e, t) {
    if (e)
      return {
        alpha: this._getAlphaBlend(t),
        color: this._getColorBlend(t)
      }
  },
  _getAlphaBlend(e) {
    let t = {
      srcFactor: "one",
      dstFactor: "one-minus-src-alpha",
      operation: "add"
    };
    switch (e) {
      case 0:
        break;
      case 1:
        break;
      case 2:
        t = {
          srcFactor: "one-minus-src-color",
          dstFactor: "one-minus-src-alpha",
          operation: "add"
        };
        break;
      case 3:
        t = {
          srcFactor: "zero",
          dstFactor: "src-alpha",
          operation: "add"
        };
        break
    }
    return t
  },
  _getColorBlend(e) {
    const t = {
      srcFactor: null,
      dstFactor: null,
      operation: null
    };
    switch (e) {
      case 0:
        t.srcFactor = "one",
          t.dstFactor = "one-minus-src-alpha",
          t.operation = "add";
        break;
      case 1:
        t.srcFactor = "one",
          t.operation = "add";
        break;
      case 2:
        t.srcFactor = "zero",
          t.dstFactor = "zero",
          t.operation = "add";
        break;
      case 3:
        t.srcFactor = "zero",
          t.dstFactor = "src-color",
          t.operation = "add";
        break
    }
    return t
  },
  _getTextureGroup(e, t, r) {
    const i = e + t;
    if (this.textureGroupCache.has(i))
      return this.textureGroupCache.get(i);
    const n = this.device.createBuffer({
      lable: "Texture Config Buffer",
      size: 4,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      mappedAtCreation: !0
    });
    new Uint32Array(n.getMappedRange()).set([t ? 1 : 0]),
      n.unmap();
    const s = this.device.createBindGroup({
      layout: r,
      entries: [{
        binding: 0,
        resource: {
          buffer: n
        }
      }, {
        binding: 1,
        resource: this.linearSampler
      }, {
        binding: 2,
        resource: this.viewCache.get(t)
      }, {
        binding: 3,
        resource: {
          buffer: this.lightBuffer
        }
      }]
    });
    return this.textureGroupCache.set(i, s),
      s
  },
  _getMaterial(e) {
    const t = this.material,
      r = t.fragShader[e],
      i = t.type[e],
      n = t.transparent[e],
      s = t.side[e],
      a = t.blending[e];
    return `${r}${i}${n}${s}${a}`
  },
  async _getPipeline(e, t) {
    let r = this.pipelineCache.get(e);
    if (!r) {
      const i = this.material,
        n = i.transparent[t],
        s = i.blending[t],
        a = i.type[t],
        h = i.side[t],
        l = await this.device.createRenderPipelineAsync({
          vertex: {
            module: F(this.device, Nt),
            entryPoint: "main",
            buffers: [{
              arrayStride: 8 * 4,
              attributes: [{
                shaderLocation: 0,
                offset: 0,
                format: "float32x3"
              }, {
                shaderLocation: 1,
                offset: 3 * 4,
                format: "float32x3"
              }, {
                shaderLocation: 2,
                offset: 6 * 4,
                format: "float32x2"
              }]
            }]
          },
          fragment: {
            module: F(this.device, this._material.getMaterial(t)),
            entryPoint: "main",
            targets: [{
              format: this.presentationFormat,
              blend: this._getBlend(n, s)
            }]
          },
          primitive: {
            topology: a === 0 ? "triangle-list" : a === 1 ? "point-list" : a === 2 ? "line-list" : a === 3 ? "line-strip" : "triangle-list",
            frontFace: h === 1 ? "cw" : "ccw",
            cullMode: h === 2 ? "none" : "back"
          },
          depthStencil: {
            depthWriteEnabled: !0,
            depthCompare: "less",
            format: "depth24plus-stencil8"
          }
        }),
        p = l.getBindGroupLayout(0),
        c = l.getBindGroupLayout(1),
        d = l.getBindGroupLayout(2),
        u = this.device.createBindGroup({
          layout: p,
          entries: [{
            binding: 0,
            resource: {
              buffer: this.mMatrixBuffer
            }
          }, {
            binding: 1,
            resource: {
              buffer: this.mvpMatrixBuffer
            }
          }, {
            binding: 2,
            resource: {
              buffer: this.colorBuffer
            }
          }]
        });
      r = {
          matMap: new Map,
          renderPipeline: l,
          uniformGroup: u,
          layout0: p,
          layout1: c,
          layout2: d
        },
        this.pipelineCache.set(e, r)
    }
    return r
  }
};
var Yt = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: Xt
});
class jt {
  constructor() {
    o(this, "mode", 0);
    o(this, "container");
    o(this, "beginTime", performance.now());
    o(this, "prevTime", this.beginTime);
    o(this, "frames", 0);
    o(this, "fpsPanel");
    o(this, "msPanel");
    o(this, "memPanel");
    const t = this.container = document.createElement("div");
    t.setAttribute("style", "position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000"),
      t.addEventListener("click", r => {
        r.preventDefault(),
          this.showPanel(++this.mode % t.children.length)
      }, !1),
      this.fpsPanel = this.addPanel(new W("FPS", "#0ff", "#002")),
      this.msPanel = this.addPanel(new W("MS", "#0f0", "#020")),
      this.memPanel = this.addPanel(new W("MB", "#f08", "#201")),
      this.showPanel(0)
  }
  addPanel(t) {
    return this.container.appendChild(t.canvas),
      t
  }
  showPanel(t) {
    for (let r = 0; r < this.container.children.length; r++)
      this.container.children[r].style.display = r === t ? "block" : "none";
    this.mode = t
  }
  begin() {
    this.beginTime = (performance || Date).now()
  }
  end() {
    this.frames++;
    const t = performance.now();
    if (this.msPanel.update(t - this.beginTime, 200),
      t >= this.prevTime + 1e3) {
      this.fpsPanel.update(this.frames * 1e3 / (t - this.prevTime), 100),
        this.prevTime = t,
        this.frames = 0;
      const r = performance.memory;
      this.memPanel.update(r.usedJSHeapSize / 1048576, r.jsHeapSizeLimit / 1048576)
    }
    return t
  }
  update() {
    this.beginTime = this.end()
  }
}
class W {
  constructor(t, r, i) {
    o(this, "min", 1 / 0);
    o(this, "max", 0);
    o(this, "name");
    o(this, "bg");
    o(this, "fg");
    o(this, "PR", 1);
    o(this, "WIDTH", 80 * this.PR);
    o(this, "HEIGHT", 48 * this.PR);
    o(this, "TEXT_X", 3 * this.PR);
    o(this, "TEXT_Y", 2 * this.PR);
    o(this, "GRAPH_X", 3 * this.PR);
    o(this, "GRAPH_Y", 15 * this.PR);
    o(this, "GRAPH_WIDTH", 74 * this.PR);
    o(this, "GRAPH_HEIGHT", 30 * this.PR);
    o(this, "canvas");
    o(this, "context");
    this.name = t,
      this.bg = i,
      this.fg = r;
    const n = this.canvas = document.createElement("canvas");
    n.width = this.WIDTH,
      n.height = this.HEIGHT,
      n.style.cssText = "width:80pxheight:48px";
    const s = this.context = n.getContext("2d");
    s.font = "bold " + 9 * this.PR + "px Helvetica,Arial,sans-serif",
      s.textBaseline = "top",
      s.fillStyle = i,
      s.fillRect(0, 0, this.WIDTH, this.HEIGHT),
      s.fillStyle = r,
      s.fillText(t, this.TEXT_X, this.TEXT_Y),
      s.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT),
      s.fillStyle = i,
      s.globalAlpha = .9,
      s.fillRect(this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH, this.GRAPH_HEIGHT)
  }
  update(t, r) {
    this.min = Math.min(this.min, t),
      this.max = Math.max(this.max, t),
      this.context.fillStyle = this.bg,
      this.context.globalAlpha = 1,
      this.context.fillRect(0, 0, this.WIDTH, this.GRAPH_Y),
      this.context.fillStyle = this.fg,
      this.context.fillText(Math.round(t) + " " + this.name + " (" + Math.round(this.min) + "-" + Math.round(this.max) + ")", this.TEXT_X, this.TEXT_Y),
      this.context.drawImage(this.canvas, this.GRAPH_X + this.PR, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT, this.GRAPH_X, this.GRAPH_Y, this.GRAPH_WIDTH - this.PR, this.GRAPH_HEIGHT),
      this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, this.GRAPH_HEIGHT),
      this.context.fillStyle = this.bg,
      this.context.globalAlpha = .9,
      this.context.fillRect(this.GRAPH_X + this.GRAPH_WIDTH - this.PR, this.GRAPH_Y, this.PR, Math.round((1 - t / r) * this.GRAPH_HEIGHT))
  }
}
const Wt = {
  name: "fps",
  init: function() {
    this.stats = new jt,
      window.addEventListener("render start", () => {
        document.body.appendChild(this.stats.container)
      })
  },
  tick: async function() {
    this.stats.update()
  }
};
var $t = Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  def: Wt
});
const $ = 2e-6,
  Jt = {
    name: "orbitControl",
    init: function(e, t = {}) {
      this.options = Object.assign({
          canvas: null,
          near: 0,
          far: 1e3,
          minDistance: $,
          maxDistance: 1e4,
          autoRotate: !1,
          autoRotateSpeed: .001
        }, t),
        this.options.minDistance < $ && (this.options.minDistance = $);
      let r = this.options.canvas;
      if (!r)
        throw new Error("no canvas");
      this.id = e.query(T("camera"))[0],
        this.camera = e.getData("camera"),
        this.position = e.getData("position"),
        this.rotation = e.getData("rotation");
      const i = this.position.x[this.id],
        n = this.position.y[this.id],
        s = this.position.z[this.id];
      this.r = Math.sqrt(i * i + n * n + s * s);
      let a = Math.atan(i / n),
        h = Math.atan(n / s);
      this.a = a ? a / Math.PI * 180 : 0,
        this.b = h ? h / Math.PI * 180 : 0,
        r.addEventListener("wheel", d => {
          d.stopPropagation(),
            this.r += d.deltaY / 10,
            this.r < this.options.minDistance ? this.r = this.options.minDistance : this.r > this.options.maxDistance && (this.r = this.options.maxDistance),
            this.updateCamera()
        }, {
          passive: !0
        });
      let l = !1,
        p = -1,
        c = -1;
      r.addEventListener("pointerdown", d => {
          l = !0,
            p = d.clientX,
            c = d.clientY
        }),
        r.addEventListener("pointermove", d => {
          if (!l)
            return;
          let u = d.pageX,
            m = d.pageY;
          if (p > 0 && c > 0) {
            const w = -(u - p) / 2,
              b = (m - c) / 2;
            this.a += w,
              this.b += b,
              this.b > 90 ? this.b = 90 : this.b < -90 && (this.b = -90),
              this.updateCamera()
          }
          p = u,
            c = m
        }),
        r.addEventListener("pointerup", () => {
          l = !1
        }),
        r.addEventListener("pointercancel", () => {
          l = !1
        }),
        r.addEventListener("pointerleave", () => {
          l = !1
        }),
        this.options.autoRotate && (this.tick = () => {
          this.a -= .1,
            this.updateCamera()
        }),
        window.addEventListener("resize", () => {
          r.width = window.innerWidth,
            r.height = window.innerHeight,
            this.camera.aspect[this.id] = r.clientWidth / r.clientHeight,
            this.camera.needUpdate[this.id] = 1
        })
    },
    updateCamera() {
      const e = this.a / 180 * Math.PI,
        t = this.b / 180 * Math.PI;
      this.position.x[this.id] = this.r * Math.sin(e) * Math.cos(t),
        this.position.y[this.id] = this.r * Math.sin(t),
        this.position.z[this.id] = this.r * Math.cos(e) * Math.cos(t),
        this.camera.needUpdate[this.id] = 1
    }
  };
var Kt = Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    def: Jt
  }),
  Z = Object.freeze({
    __proto__: null,
    [Symbol.toStringTag]: "Module",
    template: St,
    transform: kt,
    webgpuRenderer: Yt,
    fps: $t,
    orbitControl: Kt
  });
class Zt {
  constructor(t = {}) {
    o(this, "entID", 0);
    o(this, "_ids");
    o(this, "_rms", []);
    o(this, "_components", new Map);
    o(this, "_systems", new Map);
    o(this, "_queue", []);
    o(this, "_query");
    o(this, "_parent");
    o(this, "_children", new Map);
    o(this, "_scene");
    o(this, "MAX", 1024e4);
    o(this, "_frame", 0);
    o(this, "option", {
      max: 1e4,
      debug: !1,
      defaultComponents: !0,
      defaultSystems: !0
    });
    if (t.max && t.max > this.MAX)
      throw new Error("Over max limit: " + this.MAX);
    if (Object.assign(this.option, t),
      this._ids = E(Uint8Array, this.option.max),
      this._parent = E(Uint32Array, this.option.max),
      this._query = new at(this),
      this.option.defaultComponents)
      for (let r in K) {
        let i = K[r].def;
        i.name !== "_default" && this.registerComponent(i.name, i)
      }
    if (this.option.defaultSystems)
      for (let r in Z) {
        let i = Z[r].def;
        i.name !== "_default" && this.registerSystem(i.name, i)
      }
    this._scene = this.createEntity()
  }
  _validID(t) {
    return this._ids[t] !== 0
  }
  _validComponent(t, r) {
    return t.ids[r] !== 0
  }
  getMaxId() {
    return this.entID
  }
  getComponents(t) {
    if (t !== void 0) {
      let r = [];
      return this._components.forEach((i, n) => {
          i.ids[t] === 1 && r.push(n)
        }),
        r
    } else
      return Array.from(this._components.keys())
  }
  getSystems(t) {
    return t ? this._queue.map(r => r.name) : Array.from(this._systems.keys())
  }
  getScene() {
    return this._scene
  }
  getRawParents() {
    return this._parent
  }
  createEntity() {
    if (this._rms.length) {
      const t = this._rms.pop();
      return this._ids[t] = 1,
        t
    } else {
      if (this.entID === this.option.max)
        throw new Error("maximum entity limit reached");
      return this._ids[this.entID] = 1,
        this.entID++
    }
  }
  destroyEntity(t) {
    this._validID(t) && (this._ids[t] = 0,
      this._rms.push(t),
      this._components.forEach((r, i) => {
        r.ids[t] === 1 && (r.ids[t] = 0,
          typeof r.remove == "function" && r.remove(t),
          this._query.update(i, t, !1))
      }),
      this.clearChildren(t, !0))
  }
  addChildren(t, ...r) {
    if (!this._validID(t))
      throw new Error("parent:" + t + " invalid");
    for (let i of r) {
      if (!this._validID(i))
        throw new Error("child: " + i + " invalid");
      if (i === t)
        throw new Error("entiry:" + i + " cannot be added as a child of itself");
      this._parent[i] && this.removeChildren(this._parent[i], i),
        this._parent[i] = t;
      let n = this._children.get(t);
      n ? n.push(i) : (n = [i],
        this._children.set(t, n))
    }
  }
  removeChildren(t, ...r) {
    if (!this._validID(t))
      throw new Error("parent:" + t + " invalid");
    for (let i of r) {
      if (!this._validID(i))
        throw new Error("child: " + i + " invalid");
      let n = this._children.get(t);
      if (n) {
        let s = n.indexOf(i);
        if (s !== -1)
          this._parent[i] = 0,
          n.splice(s, 1);
        else
          throw new Error("entity:" + i + " is not a child of " + t)
      } else
        throw new Error("no children in " + t)
    }
  }
  clearChildren(t, r = !1) {
    if (!this._validID(t) && !r)
      throw new Error("parent:" + t + " invalid");
    let i = this._children.get(t);
    if (i) {
      for (let n of i)
        this._parent[n] = 0;
      this._children.delete(t)
    }
  }
  removeFromParent(t) {
    if (!this._validID(t))
      throw new Error("entity:" + t + " invalid");
    let r = this._parent[t];
    r && this.removeChildren(r, t)
  }
  getParents(t) {
    if (!this._validID(t))
      throw new Error("id:" + t + " invalid");
    if (t == 0)
      return []; {
      let r = [],
        i = this._parent[t];
      for (; i != 0;)
        r.push(i),
        i = this._parent[i];
      return r
    }
  }
  getChildren(t) {
    if (!this._validID(t))
      throw new Error("id:" + t + " invalid");
    return this._children.has(t) ? this._children.get(t) : []
  }
  traverse(t, r) {
    if (!this._validID(t))
      throw new Error("id:" + t + " invalid");
    if (this._children.has(t)) {
      let i = this._children.get(t);
      for (let n = 0, s = i.length; n < s; n++)
        r(i[n]),
        this.traverse(i[n], r)
    }
  }
  getEntities(t, r = !1) {
    let i = this._components.get(t);
    if (!i)
      throw new Error("no component");
    if (r)
      return i == null ? void 0 : i.ids; {
      let n = i == null ? void 0 : i.ids,
        s = E(Uint32Array, this.entID),
        a = 0;
      for (let h = 0; h < this.entID; h++)
        n[h] === 1 && (s[a] = h,
          a++);
      return s.subarray(0, a)
    }
  }
  getObject(t) {
    return new ot(this, t)
  }
  createObject() {
    let t = this.createEntity();
    return this.getObject(t)
  }
  registerComponent(t, r = {}) {
    if (this._components.has(t))
      throw new Error("alreay registered: " + t);
    let i = new ht(X(N({}, r), {
      name: t
    }), this.option.max);
    return this._components.set(t, i),
      typeof i.init == "function" && i.init(this),
      i
  }
  addComponent(t, r) {
    if (!this._validID(t))
      throw new Error("invalid entity id");
    let i = this._components.get(r);
    if (!i)
      throw new Error("no component:" + r);
    if (this._validComponent(i, t))
      throw new Error("alreay add component:" + r);
    return i.ids[t] = 1,
      typeof i.add == "function" && i.add(t),
      this._query.update(r, t, !0),
      i
  }
  removeComponent(t, r) {
    if (!this._validID(t))
      throw new Error("invalid entity id");
    let i = this._components.get(r);
    if (!i)
      throw new Error("no component");
    if (!this._validComponent(i, t))
      throw new Error("no component added");
    return i.ids[t] = 0,
      typeof i.remove == "function" && i.remove(t),
      this._query.update(r, t, !1),
      i
  }
  getComponent(t) {
    let r = this._components.get(t);
    if (!r)
      throw new Error("no component: " + t);
    return r
  }
  getData(t) {
    let r = this._components.get(t);
    if (!r)
      throw new Error("no component:" + t);
    return r.data
  }
  query(t) {
    return this._query.query(t)
  }
  registerSystem(t, r = {}) {
    if (this._systems.has(t))
      throw new Error("alreay registered");
    let i = new lt(X(N({}, r), {
      name: t
    }));
    return this._systems.set(t, i),
      i
  }
  getSystem(t) {
    let r = this._systems.get(t);
    if (!r)
      throw new Error("not system found: " + t);
    return r
  }
  addSystem(t, r = {}) {
    let i = this._systems.get(t);
    if (!i)
      throw new Error("not system found: " + t);
    return i.init && i.init(this, r),
      this._queue.push(i),
      r.autoTick === !1 && (i.__active = !1),
      i
  }
  removeSystem(t) {
    let r = this._systems.get(t);
    if (!r)
      throw new Error("not system found");
    let i = this._queue.indexOf(r);
    if (i === -1)
      throw new Error("system not in the queue");
    this._queue.splice(i, 1),
      r.remove && r.remove()
  }
  startSystem(t) {
    let r = this._systems.get(t);
    if (!r)
      throw new Error("not system found");
    r.start()
  }
  stopSystem(t) {
    let r = this._systems.get(t);
    if (!r)
      throw new Error("not system found");
    r.stop()
  }
  start() {
    this.frame()
  }
  stop() {
    cancelAnimationFrame(this._frame)
  }
  async frame() {
    await this._tickSystem(),
      this._frame = requestAnimationFrame(this.frame.bind(this))
  }
  async _tickSystem() {
    for (let t = 0, r = this._queue.length; t < r; t++) {
      let i = this._queue[t];
      i.__active && i.tick && await i.tick()
    }
  }
}
export { Zt as E, f as T, T as a };
