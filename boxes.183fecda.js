import { E as c, a as m } from "./ecs.76a059f5.js";
import { BoxGeometry as h, ConeGeometry as u } from "https://cdn.skypack.dev/three@0.136";
import { l } from "./loadThreeGeometry.57e0a31d.js";
import "https://cdn.skypack.dev/three@0.136/examples/jsm/utils/BufferGeometryUtils.js";

function y() {
  return new Worker("/ecs/assets/boxes_worker.17b17f9a.js", {
    type: "module"
  })
}
const a = navigator.hardwareConcurrency / 2,
  g = 300100;
let n = new c({
  max: g,
  defaultComponents: !0,
  defaultSystems: !0,
  fps: !0
});
n.registerSystem("prepare", {
  init: function(e) {
    e.registerComponent("isRender", {
        add: function(o) {
          e.addComponent(o, "geometry"),
            e.addComponent(o, "material"),
            e.addComponent(o, "transform")
        }
      }),
      this.geometry = e.getComponent("geometry");
    const t = new h(1, 1, 1);
    this.geometry.registerGeometry("box", l(t));
    const i = new u(1, 1, 4);
    this.geometry.registerGeometry("cone", l(i))
  }
});
n.registerSystem("init", {
  init: function(e) {
    console.log("[init mounted]");
    let t = document.querySelector("#canvas");
    t.width = window.innerWidth,
      t.height = window.innerHeight,
      this.position = e.getData("position"),
      this.geometry = e.getComponent("geometry"),
      this.material = e.getComponent("material"),
      this.scene = e.getScene();
    let i = e.createEntity();
    this.camera = e.addComponent(i, "camera"),
      this.camera.setData(i, {
        aspect: t.clientWidth / t.clientHeight
      }),
      this.position.z[i] = 300;
    for (let o = 0; o < 3e4; ++o)
      this.addCube(o);
    document.querySelector("#slider").addEventListener("input", o => {
        o.target.parentNode.children[0].innerHTML = o.target.value
      }),
      document.querySelector("#slider").addEventListener("change", o => {
        let r = +o.target.value,
          d = e.query(m("isRender"));
        if (r > d.length)
          for (let s = 0; s < r - d.length; s++)
            this.addCube(s);
        else if (r < d.length)
          for (let s = d.length - 1; s > r; s--)
            e.destroyEntity(d[s])
      })
  },
  addCube: function(e) {
    let t = n.createEntity();
    n.addComponent(t, "isRender"),
      this.position.x[t] = (Math.random() - .5) * 200,
      this.position.y[t] = (Math.random() - .5) * 200,
      this.position.z[t] = (Math.random() - .5) * 200,
      this.geometry.setGeometry(t, e % 2 == 0 ? "box" : "cone"),
      this.material.setMaterial(t, "basicColor"),
      this.material.setColor(t, Math.random(), Math.random(), Math.random(), 1),
      n.addChildren(this.scene, t)
  }
});
n.registerSystem("main", {
  init: function(e) {
    console.log("[main mounted]"),
      this.App = e,
      this.ids = this.App.query(m("isRender")),
      this.rotation = e.getData("rotation"),
      this.transform = e.getData("transform"),
      this.initWorker(),
      window.addEventListener("keypress", t => {
        t.code === "Space" && (this.toggle(),
          e.getSystem("orbitControl").toggle())
      })
  },
  tick: async function() {
    let e = this.App.query(m("isRender"));
    if (this.ids !== e) {
      this.ids = e;
      for (let t = 0; t < a; ++t)
        this.pool[t].postMessage({
          type: "update",
          ids: e
        })
    }
    await new Promise(t => {
      let i = 0;
      for (let o = 0; o < a; ++o) {
        let r = this.pool[o];
        r.postMessage("run"),
          r.onmessage = () => {
            i++,
            i == a && t(!0)
          }
      }
    })
  },
  initWorker() {
    this.pool = [];
    for (let e = 0; e < a; ++e) {
      let t = new y;
      t.postMessage({
          type: "init",
          index: e,
          poolSize: a,
          ids: this.ids,
          rotation: this.rotation,
          transform: this.transform
        }),
        this.pool.push(t)
    }
  },
  play: function() {
    console.log("main started")
  },
  pause: function() {
    console.log("main stoped")
  }
});
n.addSystem("prepare");
n.addSystem("init");
n.addSystem("main");
n.addSystem("orbitControl", {
  canvas: document.querySelector("#canvas"),
  autoRotate: !0
});
n.addSystem("transform", {
  poolSize: a
});
n.addSystem("webgpuRenderer", {
  canvas: document.querySelector("#canvas")
});
n.addSystem("fps");
n.start();
