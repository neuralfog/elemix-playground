//#region src/runtime/reactive.ts
var e = () => ({
	subs: null,
	subSlots: 0
}), t = null, n = null, r = !1, i = null, a = (e, t) => {
	let n = e.subs;
	if (Array.isArray(n)) {
		let r = e.subSlots, i = n.pop(), a = r.pop();
		t < n.length && (n[t] = i, r[t] = a, Array.isArray(i.depSlots) ? i.depSlots[a] = t : i.depSlots = t);
	} else e.subs = null;
}, o = (e) => {
	let t = e.deps;
	if (t !== null) if (Array.isArray(t)) {
		let n = e.depSlots;
		for (let e = 0; e < t.length; e++) a(t[e], n[e]);
		t.length = 0, n.length = 0;
	} else a(t, e.depSlots), e.deps = null, e.depSlots = 0;
}, s = (e) => {
	o(e);
	let n = t;
	t = e;
	try {
		e.fn();
	} finally {
		t = n;
	}
}, c = (e) => s(e), l = (e) => {
	let t = n, a = r;
	n = null, r = !0;
	try {
		return e();
	} finally {
		i = n, n = t, r = a;
	}
}, u = () => {
	let e = i;
	return i = null, e;
}, d = (e) => {
	let t = e;
	for (; t;) {
		o(t);
		let e = t.next;
		t.next = null, t = e;
	}
}, f = (e) => {
	let n = t;
	t = null;
	try {
		return e();
	} finally {
		t = n;
	}
}, p = (e, t) => {
	let n = e.deps;
	return n === null ? (e.deps = t, 0) : Array.isArray(n) ? (n.push(t), e.depSlots.push(0), n.length - 1) : (e.deps = [n, t], e.depSlots = [e.depSlots, 0], 1);
}, m = (e, t, n) => {
	Array.isArray(e.depSlots) ? e.depSlots[t] = n : e.depSlots = n;
}, h = (e) => {
	let n = t;
	if (n === null) return;
	let r = e.subs;
	if (r !== n) if (Array.isArray(r)) {
		if (r[r.length - 1] === n) return;
		let t = p(n, e);
		m(n, t, r.length), e.subSlots.push(t), r.push(n);
	} else if (r === null) {
		let t = p(n, e);
		m(n, t, 0), e.subs = n, e.subSlots = t;
	} else {
		let t = p(n, e);
		m(n, t, 1), e.subs = [r, n], e.subSlots = [e.subSlots, t];
	}
}, g = (e) => {
	let n = e.subs;
	if (n !== null) if (Array.isArray(n)) {
		let e = n.slice();
		for (let n = 0; n < e.length; n++) e[n] !== t && s(e[n]);
	} else n !== t && s(n);
}, _ = (e) => {
	let t = {
		deps: null,
		depSlots: 0,
		fn: e,
		next: null
	};
	r && (t.next = n, n = t), s(t);
}, v = (e, t) => {
	_(() => {
		for (let e = 0; e < t.length; e++) h(t[e]);
		e();
	});
}, y = (t) => {
	let n = t;
	for (let t of Object.keys(n)) {
		let r = n[t], i = e();
		Object.defineProperty(n, t, {
			enumerable: !0,
			configurable: !0,
			get() {
				return h(i), r;
			},
			set(e) {
				r !== e && (r = e, g(i));
			}
		});
	}
	return t;
}, b = Symbol(), x = Symbol(), S = Symbol(), C = Symbol.for("elemix.raw"), w = new Set([
	"push",
	"pop",
	"shift",
	"unshift",
	"splice",
	"sort",
	"reverse"
]), T = /* @__PURE__ */ new WeakMap(), E = /* @__PURE__ */ new WeakMap(), D = (t, n) => {
	let r = E.get(t);
	r || (r = /* @__PURE__ */ new Map(), E.set(t, r));
	let i = r.get(n);
	return i || (i = e(), r.set(n, i)), i;
}, O = (e, t) => {
	let n = e[b];
	return D(n ?? e, t);
}, k = (e) => e?.[b] ?? e, A = Object.prototype.hasOwnProperty, j = {
	get(e, t) {
		if (t === b) return e;
		let n = e[t];
		return typeof n != "object" || !n ? (typeof t != "symbol" && h(D(e, t)), n) : (typeof t != "symbol" && (h(D(e, t)), Array.isArray(n) && h(D(n, x))), I(n));
	},
	set(e, t, n) {
		return e[t] === n ? !0 : (e[t] = n, typeof t != "symbol" && g(D(e, t)), !0);
	}
}, ee = {
	get(e, t, n) {
		if (t === b) return e;
		let r = A.call(e, t) ? e[t] : Reflect.get(e, t, n);
		return typeof r != "object" || !r ? (typeof t != "symbol" && h(D(e, t)), r) : (typeof t != "symbol" && (h(D(e, t)), Array.isArray(r) && h(D(r, x))), I(r));
	},
	set(e, t, n) {
		return e[t] === n ? !0 : (e[t] = n, typeof t != "symbol" && g(D(e, t)), !0);
	}
}, M = {
	get(e, t) {
		if (t === b) return e;
		if (typeof t == "string" && w.has(t)) return (...n) => {
			let r = e[t].apply(e, n);
			return g(D(e, x)), r;
		};
		let n = e[t];
		return Array.isArray(n) && h(D(n, x)), I(n);
	},
	set(e, t, n) {
		let r = e[t];
		return e[t] = n, r !== n && g(D(e, x)), !0;
	}
}, N = (e) => e instanceof Map || e instanceof Set || e instanceof WeakMap || e instanceof WeakSet, P = (e, t, n) => {
	h(D(e, S));
	let r = e[t]();
	return {
		next() {
			let e = r.next();
			if (e.done) return e;
			let t = e.value;
			return {
				done: !1,
				value: n ? [I(t[0]), I(t[1])] : I(t)
			};
		},
		[Symbol.iterator]() {
			return this;
		}
	};
}, F = { get(e, t) {
	if (t === b) return e;
	let n = e, r = e instanceof Map || e instanceof WeakMap;
	switch (t) {
		case "size": return h(D(e, S)), n.size;
		case "get": return (t) => (h(D(e, S)), I(n.get(t)));
		case "has": return (t) => (h(D(e, S)), n.has(t));
		case "add": return (t) => (n.has(t) || (e.add(t), g(D(e, S))), T.get(e));
		case "set": return (t, r) => {
			let i = n.has(t), a = n.get(t);
			return (!i || a !== r) && (n.set(t, r), g(D(e, S))), T.get(e);
		};
		case "delete": return (t) => {
			let r = n.has(t), i = n.delete(t);
			return r && g(D(e, S)), i;
		};
		case "clear": return () => {
			n.size > 0 && (n.clear(), g(D(e, S)));
		};
		case "forEach": return (t, r) => {
			h(D(e, S));
			let i = T.get(e);
			n.forEach((e, n) => {
				t.call(r, I(e), I(n), i);
			});
		};
		case "keys": return () => P(e, "keys", !1);
		case "values": return () => P(e, "values", !1);
		case "entries": return () => P(e, "entries", !0);
		case Symbol.iterator: return () => P(e, Symbol.iterator, r);
	}
	let i = e[t];
	return typeof i == "function" ? i.bind(e) : i;
} }, te = (e) => {
	let t = Object.getPrototypeOf(e);
	return t === Object.prototype || t === null;
}, I = (e) => {
	if (typeof e != "object" || !e) return e;
	let t = e;
	if (t[b] !== void 0) return t;
	let n = T.get(t);
	if (n) return n;
	if (t[C] === !0) return t;
	let r = Array.isArray(t) ? M : N(t) ? F : te(t) ? j : ee, i = new Proxy(t, r);
	return T.set(t, i), i;
}, ne = (e) => I(e), L = (e) => typeof e == "string" ? e : e == null ? "" : String(e), R = new Int32Array(), z = new Int32Array(), B = (e) => {
	let t = e.length;
	if (t === 0) return [];
	R.length < t && (R = new Int32Array(t), z = new Int32Array(t));
	let n = R, r = z, i = 0;
	for (let a = 0; a < t; a++) {
		let t = 0, o = i;
		for (; t < o;) {
			let n = t + o >>> 1;
			e[r[n]] < e[a] ? t = n + 1 : o = n;
		}
		r[t] = a, t === i && i++, n[a] = t > 0 ? r[t - 1] : -1;
	}
	let a = Array(i), o = r[i - 1];
	for (let e = i - 1; e >= 0; e--) a[e] = o, o = n[o];
	return a;
}, V = (e) => {
	let t = document.createElement("template");
	return t.innerHTML = e, document.importNode(t.content, !0);
}, H = (e) => e.cloneNode(!0), U = (e) => {
	let t = document.createElement("template");
	t.innerHTML = e;
	let n = t.content.firstElementChild;
	return document.importNode(n, !0);
}, W = (e) => e.cloneNode(!0), G = /* @__PURE__ */ new Map(), K = (e) => {
	if (typeof e != "string") return e;
	let t = G.get(e);
	return t || (t = new CSSStyleSheet(), t.replaceSync(e), G.set(e, t)), t;
}, q = (e) => Array.isArray(e) ? e.map(K) : [K(e)], J = (e, t) => {
	customElements.get(e) === void 0 && customElements.define(e, t);
}, Y = (e, t) => {
	_(() => {
		let n = t();
		e.value !== n.value && (e.value = n.value);
	}), e.oninput = () => {
		let n = t();
		if (e.value === n.value) return;
		let r = e.__onmodel;
		r && (e.value = r(e.value)), n.value = e.value;
	};
}, X = (e, t) => {
	e.__onmodel = t;
}, re = (e, t, n) => {
	e[`on${t}`] = n;
}, ie = (e, t) => {
	t.value = e;
}, ae = (e, t) => {
	let n = null, r = null;
	_(() => {
		let i = e.parentNode;
		if (!i) return;
		let a = l(() => t()), o = u(), s = a instanceof Node ? a : document.createTextNode(L(a));
		if (n === s) {
			d(o);
			return;
		}
		d(r), r = o, n ? i.replaceChild(s, n) : i.insertBefore(s, e), n = s;
	});
}, Z = (e, t, n, r) => {
	if (t === e.firstChild && n.nextSibling === r && r.nextSibling === null) e.replaceChildren(r);
	else {
		let e = document.createRange();
		e.setStartBefore(t), e.setEndAfter(n), e.deleteContents();
	}
}, oe = (e, t, n, r) => {
	let i = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), o = [];
	_(() => {
		let s = e.parentNode;
		if (!s) return;
		let c = t(), p = k(c), m = p.length, h = Array(m);
		f(() => {
			for (let e = 0; e < m; e++) h[e] = n(p[e], e);
		});
		let g = o;
		o = h;
		let _ = g.length;
		if (m === 0) {
			_ > 0 && (Z(s, i.get(g[0]), i.get(g[_ - 1]), e), f(() => {
				for (let e of a.values()) d(e);
			}), a.clear(), i.clear());
			return;
		}
		let v = 0, y = _ - 1, b = m - 1;
		for (; v <= y && v <= b && g[v] === h[v];) v++;
		for (; v <= y && v <= b && g[y] === h[b];) y--, b--;
		if (v > y) {
			if (v <= b) {
				let t = b + 1 < m ? i.get(h[b + 1]) : e, n = document.createDocumentFragment();
				f(() => {
					for (let e = v; e <= b; e++) {
						let t = l(() => r(c[e], e));
						a.set(h[e], u()), i.set(h[e], t), n.appendChild(t);
					}
				}), s.insertBefore(n, t);
			}
			return;
		}
		if (v > b) {
			for (let e = v; e <= y; e++) {
				let t = g[e];
				i.get(t).remove(), d(a.get(t) ?? null), a.delete(t), i.delete(t);
			}
			return;
		}
		if (m === _ && h[v] === g[b] && h[b] === g[v]) {
			let e = !0;
			for (let t = v + 1; t < b; t++) if (h[t] !== g[t]) {
				e = !1;
				break;
			}
			if (e) {
				let e = i.get(g[b]), t = i.get(g[v]), n = e.nextSibling;
				s.insertBefore(e, t), s.insertBefore(t, n);
				return;
			}
		}
		let x = b - v + 1, S = /* @__PURE__ */ new Map();
		for (let e = v; e <= b; e++) S.set(h[e], e);
		if (S.size !== x) {
			o = g;
			return;
		}
		let C = new Int32Array(x), w = [], T = 0, E = !1, D = -1;
		for (let e = v; e <= y; e++) {
			let t = g[e], n = T < x ? S.get(t) : void 0;
			n === void 0 ? w.push(t) : (C[n - v] = e + 1, n >= D ? D = n : E = !0, T++);
		}
		let O = b + 1 < m ? i.get(h[b + 1]) : e;
		if (T === 0) {
			for (let e = v; e <= b; e++) if (i.has(h[e])) {
				o = g;
				return;
			}
			Z(s, i.get(g[v]), i.get(g[y]), O);
			for (let e = 0; e < w.length; e++) {
				let t = w[e];
				d(a.get(t) ?? null), a.delete(t), i.delete(t);
			}
			let e = document.createDocumentFragment();
			f(() => {
				for (let t = v; t <= b; t++) {
					let n = l(() => r(c[t], t));
					a.set(h[t], u()), i.set(h[t], n), e.appendChild(n);
				}
			}), s.insertBefore(e, O);
			return;
		}
		for (let e = 0; e < w.length; e++) {
			let t = w[e];
			i.get(t).remove(), d(a.get(t) ?? null), a.delete(t), i.delete(t);
		}
		let A = null;
		if (E) {
			let e = [], t = [];
			for (let n = 0; n < x; n++) C[n] !== 0 && (e.push(C[n]), t.push(n));
			let n = B(e);
			A = new Uint8Array(x);
			for (let e = 0; e < n.length; e++) A[t[n[e]]] = 1;
		}
		f(() => {
			for (let t = x - 1; t >= 0; t--) {
				let n = C[t] === 0;
				if (!n && (!E || A[t] === 1)) continue;
				let o = v + t, d = h[o], f = o + 1 < m ? i.get(h[o + 1]) : e;
				if (n) {
					let e = l(() => r(c[o], o));
					a.set(d, u()), i.set(d, e), s.insertBefore(e, f);
				} else s.insertBefore(i.get(d), f);
			}
		});
	});
}, Q = /* @__PURE__ */ new Map(), $ = (e, t) => {
	let n = typeof t == "string" ? t : t == null ? "" : String(t), r = e;
	r.__t !== n && (r.__t = n, e.data = n);
}, se = (e, t, n) => {
	let r = Q.get(t);
	r === void 0 && (r = `__a_${t}`, Q.set(t, r));
	let i = e;
	if (i[r] === n) return;
	i[r] = n;
	let a = n === !1 || n == null ? null : n === !0 ? "" : String(n);
	a === null ? e.removeAttribute(t) : e.setAttribute(t, a);
}, ce = (e) => {
	let t = /* @__PURE__ */ new Set(), n = "";
	for (let r of e.split(" ")) r && !t.has(r) && (t.add(r), n += n.length ? ` ${r}` : r);
	return n;
}, le = (e, t, n) => {
	let r;
	if (typeof n == "string") r = n.indexOf(" ") === -1 ? n : ce(n);
	else if (typeof n == "object" && n) {
		r = "";
		let e = n;
		for (let t in e) e[t] && (r += r.length ? ` ${t}` : t);
	} else r = "";
	let i = e;
	if (i.__c === r) return;
	let a = i.__c === void 0;
	i.__c = r, !(a && r === "") && e.setAttribute("class", r);
}, ue = (e, t) => {
	let n = "";
	if (typeof t == "string") n = t;
	else if (typeof t == "object" && t) {
		let e = t;
		for (let t in e) {
			let r = e[t];
			r != null && r !== !1 && (n += `${t}:${String(r)};`);
		}
	}
	let r = e;
	r.__s !== n && (r.__s = n, e.style.cssText = n);
}, de = (e, t, n) => {
	let r = e;
	if (r.props) {
		r.props[t] = n;
		return;
	}
	r.__pendingProps ||= {}, r.__pendingProps[t] = n;
};
//#endregion
export { g as A, e as C, c as D, y as E, u as O, l as S, _ as T, U as _, X as a, k as b, le as c, $ as d, H as f, V as g, q as h, Y as i, f as j, h as k, de as l, J as m, re as n, ie as o, W as p, oe as r, se as s, ae as t, ue as u, O as v, d as w, v as x, ne as y };
