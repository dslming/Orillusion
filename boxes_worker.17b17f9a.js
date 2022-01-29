(function() { "use strict"; let o, d, a, e, l, r;
  onmessage = function(t) { if (t.data.type) t.data.type === "init" ? (e = t.data.ids, l = t.data.rotation, r = t.data.transform, o = t.data.index, d = t.data.poolSize, a = Math.ceil(e.length / d)) : t.data.type === "update" && (e = t.data.ids, a = Math.ceil(e.length / d));
    else { let s = performance.now(); for (let i = o * a, f = o * a + a; i < f; ++i) { let n = e[i]; if (!n) break;
        l.x[n] = Math.sin(i + s / 1e3), l.z[n] = Math.cos(i + s / 1e3), r.needUpdate[n] = 1 } postMessage(performance.now() - s) } } })();
