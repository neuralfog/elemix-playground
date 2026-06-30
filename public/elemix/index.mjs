import { D as e, E as t, O as n, S as r, h as i, j as a, m as o, w as s } from "./dom-C6MXY3ik.js";
import { t as c } from "./uncompiled-qZvvEwEF.js";
//#region src/component/Component.ts
var l = class extends HTMLElement {
	static formAssociated;
	static __sheets;
	static __noShadow;
	$props;
	connected = !1;
	scopes = null;
	effectScopes = null;
	isMounted = !1;
	internals;
	get root() {
		return this.shadowRoot ?? this;
	}
	get props() {
		return this.$props;
	}
	initProps() {
		let e = this;
		this.$props = t(e.__pendingProps ?? {}), e.__pendingProps = void 0;
	}
	constructor() {
		super(), this.constructor.__noShadow || this.attachShadow({ mode: "open" }), this.setAttribute("data-cloak", "");
	}
	connectedCallback() {
		this.connected || (this.connected = !0, a(() => {
			if (this.adoptStyles(), this.attachFormInternals(), this.initProps(), this.beforeMount?.(), this.view) {
				let e = this.view, t = r(() => e.call(this));
				this.scopes = n(), (this.shadowRoot ?? this).appendChild(t);
			}
			if (this.effects) {
				let e = this.effects;
				r(() => e.call(this)), this.effectScopes = n();
			}
			this.removeAttribute("data-cloak"), this.onMount?.();
		}), this.isMounted = !0);
	}
	attachFormInternals() {
		this.internals || this.constructor.formAssociated && (this.internals = this.attachInternals());
	}
	disconnectedCallback() {
		queueMicrotask(() => {
			this.isConnected || (a(() => {
				s(this.scopes), this.scopes = null, s(this.effectScopes), this.effectScopes = null, this.onDispose?.();
			}), this.isMounted = !1);
		});
	}
	render() {
		let t = this.scopes;
		for (; t;) e(t), t = t.next;
	}
	adoptStyles(e) {
		let t = e === void 0 ? this.constructor.__sheets : i(e);
		this.shadowRoot && t && t.length && (this.shadowRoot.adoptedStyleSheets = t);
	}
	hasSlot(e) {
		return Array.from(this.children).some((t) => t.getAttribute("slot") === e);
	}
}, u = (e) => ({ value: e }), d = Symbol.for("elemix.raw"), f = (e) => (Object.isExtensible(e) && Object.defineProperty(e, d, {
	value: !0,
	configurable: !0
}), e), p = (e, ...t) => c("tpl");
//#endregion
export { l as Component, o as defineComponent, f as raw, u as ref, p as tpl };
