(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  48519,
  (e) => {
    const t = (0, e.i(1130).default)("pen-line", [
      ["path", { d: "M13 21h8", key: "1jsn5i" }],
      [
        "path",
        {
          d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
          key: "1a8usu",
        },
      ],
    ]);
    e.s(["PenLine", 0, t], 48519);
  },
  7198,
  (e) => {
    const t = (0, e.i(1130).default)("clock", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
    ]);
    e.s(["Clock", 0, t], 7198);
  },
  27433,
  (e) => {
    const t = (0, e.i(1130).default)("loader-circle", [
      ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }],
    ]);
    e.s(["Loader2", 0, t], 27433);
  },
  95840,
  (e) => {
    var t = e.i(98937);
    const r = {};
    e.s([
      "useRefWithInit",
      0,
      (e, n) => {
        const a = t.useRef(r);
        return a.current === r && (a.current = e(n)), a;
      },
    ]);
  },
  88859,
  84645,
  12040,
  (e) => {
    function t(e, t) {
      return e && !t ? e : !e && t ? t : e || t ? { ...e, ...t } : void 0;
    }
    e.s(["mergeObjects", 0, t], 84645);
    const r = {};
    function n(e, r) {
      return a(r)
        ? r(e)
        : ((e, r) => {
            if (!r) return e;
            for (const n in r) {
              const a = r[n];
              switch (n) {
                case "style":
                  e[n] = t(e.style, a);
                  break;
                case "className":
                  e[n] = l(e.className, a);
                  break;
                default:
                  !((e, t) => {
                    const r = e.charCodeAt(0),
                      n = e.charCodeAt(1),
                      a = e.charCodeAt(2);
                    return (
                      111 === r &&
                      110 === n &&
                      a >= 65 &&
                      a <= 90 &&
                      ("function" == typeof t || void 0 === t)
                    );
                  })(n, a)
                    ? (e[n] = a)
                    : (e[n] = ((e, t) =>
                        t
                          ? e
                            ? (r) => {
                                var n;
                                if (null != (n = r) && "object" == typeof n && "nativeEvent" in n) {
                                  s(r);
                                  const n = t(r);
                                  return r.baseUIHandlerPrevented || e?.(r), n;
                                }
                                const a = t(r);
                                return e?.(r), a;
                              }
                            : t
                          : e)(e[n], a));
              }
            }
            return e;
          })(e, r);
    }
    function a(e) {
      return "function" == typeof e;
    }
    function i(e, t) {
      return a(e) ? e(t) : (e ?? r);
    }
    function s(e) {
      return (
        (e.preventBaseUIHandler = () => {
          e.baseUIHandlerPrevented = !0;
        }),
        e
      );
    }
    function l(e, t) {
      return t ? (e ? t + " " + e : t) : e;
    }
    e.s(
      [
        "makeEventPreventable",
        0,
        s,
        "mergeClassNames",
        0,
        l,
        "mergeProps",
        0,
        (e, t, a, s, l) => {
          let o = { ...i(e, r) };
          return t && (o = n(o, t)), a && (o = n(o, a)), s && (o = n(o, s)), l && (o = n(o, l)), o;
        },
        "mergePropsN",
        0,
        (e) => {
          if (0 === e.length) return r;
          if (1 === e.length) return i(e[0], r);
          let t = { ...i(e[0], r) };
          for (let r = 1; r < e.length; r += 1) t = n(t, e[r]);
          return t;
        },
      ],
      88859,
    );
    const o = (e, ...t) => {
      const r = new URL("https://base-ui.com/production-error");
      return (
        r.searchParams.set("code", e.toString()),
        t.forEach((e) => r.searchParams.append("args[]", e)),
        `Base UI error #${e}; visit ${r} for the full message.`
      );
    };
    e.s(["default", 0, o], 12040);
  },
  93413,
  60435,
  11578,
  57528,
  (e) => {
    e.i(67836);
    var t = e.i(12040),
      r = e.i(98937),
      n = e.i(95840);
    function a(e, t, r, a) {
      var i, o, d, c, u;
      const f = (0, n.useRefWithInit)(s).current;
      return (
        (i = f),
        (o = e),
        (d = t),
        (c = r),
        (u = a),
        (i.refs[0] !== o || i.refs[1] !== d || i.refs[2] !== c || i.refs[3] !== u) &&
          l(f, [e, t, r, a]),
        f.callback
      );
    }
    function i(e) {
      var t, r;
      const a = (0, n.useRefWithInit)(s).current;
      return (
        (t = a),
        (r = e),
        (t.refs.length !== r.length || t.refs.some((e, t) => e !== r[t])) && l(a, e),
        a.callback
      );
    }
    function s() {
      return { callback: null, cleanup: null, refs: [] };
    }
    function l(e, t) {
      if (((e.refs = t), t.every((e) => null == e))) {
        e.callback = null;
        return;
      }
      e.callback = (r) => {
        if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), null != r)) {
          const n = Array(t.length).fill(null);
          for (let e = 0; e < t.length; e += 1) {
            const a = t[e];
            if (null != a)
              switch (typeof a) {
                case "function": {
                  const t = a(r);
                  "function" == typeof t && (n[e] = t);
                  break;
                }
                case "object":
                  a.current = r;
              }
          }
          e.cleanup = () => {
            for (let e = 0; e < t.length; e += 1) {
              const r = t[e];
              if (null != r)
                switch (typeof r) {
                  case "function": {
                    const t = n[e];
                    "function" == typeof t ? t() : r(null);
                    break;
                  }
                  case "object":
                    r.current = null;
                }
            }
          };
        }
      };
    }
    e.s(["useMergedRefs", 0, a, "useMergedRefsN", 0, i], 60435);
    const o = Number.parseInt(r.version, 10);
    function d(e) {
      return o >= e;
    }
    function c(e) {
      if (!r.isValidElement(e)) return null;
      const t = e.props;
      return (d(19) ? t?.ref : e.ref) ?? null;
    }
    e.s(["isReactVersionAtLeast", 0, d], 11578);
    var u = e.i(84645),
      f = e.i(88859);
    Object.freeze([]);
    const m = Object.freeze({});
    e.s(["EMPTY_OBJECT", 0, m, "NOOP", 0, () => {}], 57528);
    const g = Symbol.for("react.lazy");
    e.s(
      [
        "useRenderElement",
        0,
        (e, n, s = {}) => {
          const l = n.render,
            o = ((e, t = {}) => {
              const { className: r, style: n, render: s } = e,
                { state: l = m, ref: o, props: d, stateAttributesMapping: g, enabled: x = !0 } = t,
                p = x ? ("function" == typeof r ? r(l) : r) : void 0,
                h = x ? ("function" == typeof n ? n(l) : n) : void 0,
                v = x
                  ? ((e, t) => {
                      const r = {};
                      for (const n in e) {
                        const a = e[n];
                        if (t?.hasOwnProperty(n)) {
                          const e = t[n](a);
                          null != e && Object.assign(r, e);
                          continue;
                        }
                        !0 === a
                          ? (r[`data-${n.toLowerCase()}`] = "")
                          : a && (r[`data-${n.toLowerCase()}`] = a.toString());
                      }
                      return r;
                    })(l, g)
                  : m,
                b = x
                  ? ((0, u.mergeObjects)(v, Array.isArray(d) ? (0, f.mergePropsN)(d) : d) ?? m)
                  : m;
              return ("u" > typeof document &&
                (x
                  ? Array.isArray(o)
                    ? (b.ref = i([b.ref, c(s), ...o]))
                    : (b.ref = a(b.ref, c(s), o))
                  : a(null, null)),
              x)
                ? (void 0 !== p && (b.className = (0, f.mergeClassNames)(b.className, p)),
                  void 0 !== h && (b.style = (0, u.mergeObjects)(b.style, h)),
                  b)
                : m;
            })(n, s);
          return !1 === s.enabled
            ? null
            : ((e, n, a, i) => {
                if (n) {
                  if ("function" == typeof n) return n(a, i);
                  const e = (0, f.mergeProps)(a, n.props);
                  e.ref = a.ref;
                  let t = n;
                  return t?.$$typeof === g && (t = r.Children.toArray(n)[0]), r.cloneElement(t, e);
                }
                if (e && "string" == typeof e) {
                  var s, l;
                  return (
                    (s = e),
                    (l = a),
                    "button" === s
                      ? (0, r.createElement)("button", { type: "button", ...l, key: l.key })
                      : "img" === s
                        ? (0, r.createElement)("img", { alt: "", ...l, key: l.key })
                        : r.createElement(s, l)
                  );
                }
                throw Error((0, t.default)(8));
              })(e, l, o, s.state ?? m);
        },
      ],
      93413,
    );
  },
  5583,
  (e) => {
    var t = e.i(31373);
    const r = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
      n = t.clsx;
    e.s([
      "cva",
      0,
      (e, t) => (a) => {
        var i;
        if ((null == t ? void 0 : t.variants) == null)
          return n(e, null == a ? void 0 : a.class, null == a ? void 0 : a.className);
        const { variants: s, defaultVariants: l } = t,
          o = Object.keys(s).map((e) => {
            const t = null == a ? void 0 : a[e],
              n = null == l ? void 0 : l[e];
            if (null === t) return null;
            const i = r(t) || r(n);
            return s[e][i];
          }),
          d =
            a &&
            Object.entries(a).reduce((e, t) => {
              const [r, n] = t;
              return void 0 === n || (e[r] = n), e;
            }, {});
        return n(
          e,
          o,
          null == t || null == (i = t.compoundVariants)
            ? void 0
            : i.reduce((e, t) => {
                const { class: r, className: n, ...a } = t;
                return Object.entries(a).every((e) => {
                  const [t, r] = e;
                  return Array.isArray(r) ? r.includes({ ...l, ...d }[t]) : { ...l, ...d }[t] === r;
                })
                  ? [...e, r, n]
                  : e;
              }, []),
          null == a ? void 0 : a.class,
          null == a ? void 0 : a.className,
        );
      },
    ]);
  },
  38874,
  (e) => {
    var t = e.i(93413);
    e.s(["useRender", 0, (e) => (0, t.useRenderElement)(e.defaultTagName ?? "div", e, e)]);
  },
  90595,
  (e) => {
    var t = e.i(88859),
      r = e.i(38874),
      n = e.i(5583),
      a = e.i(83049);
    const i = (0, n.cva)(
      "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
            secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
            destructive:
              "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
            outline:
              "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
            ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
            link: "text-primary underline-offset-4 hover:underline",
          },
        },
        defaultVariants: { variant: "default" },
      },
    );
    e.s([
      "Badge",
      0,
      ({ className: e, variant: n = "default", render: s, ...l }) =>
        (0, r.useRender)({
          defaultTagName: "span",
          props: (0, t.mergeProps)({ className: (0, a.cn)(i({ variant: n }), e) }, l),
          render: s,
          state: { slot: "badge", variant: n },
        }),
    ]);
  },
  38288,
  80898,
  79572,
  47639,
  93500,
  (e) => {
    let t;
    var r = e.i(87111);
    e.i(67836);
    var n = e.i(98937);
    function a() {
      return "u" > typeof window;
    }
    function i(e) {
      return o(e) ? (e.nodeName || "").toLowerCase() : "#document";
    }
    function s(e) {
      var t;
      return (null == e || null == (t = e.ownerDocument) ? void 0 : t.defaultView) || window;
    }
    function l(e) {
      var t;
      return null == (t = (o(e) ? e.ownerDocument : e.document) || window.document)
        ? void 0
        : t.documentElement;
    }
    function o(e) {
      return !!a() && (e instanceof Node || e instanceof s(e).Node);
    }
    function d(e) {
      return !!a() && (e instanceof Element || e instanceof s(e).Element);
    }
    function c(e) {
      return !!a() && (e instanceof HTMLElement || e instanceof s(e).HTMLElement);
    }
    function u(e) {
      return (
        !(!a() || "u" < typeof ShadowRoot) &&
        (e instanceof ShadowRoot || e instanceof s(e).ShadowRoot)
      );
    }
    function f(e) {
      const { overflow: t, overflowX: r, overflowY: n, display: a } = y(e);
      return (
        /auto|scroll|overlay|hidden|clip/.test(t + n + r) && "inline" !== a && "contents" !== a
      );
    }
    function m(e) {
      try {
        if (e.matches(":popover-open")) return !0;
      } catch (e) {}
      try {
        return e.matches(":modal");
      } catch (e) {
        return !1;
      }
    }
    const g = /transform|translate|scale|rotate|perspective|filter/,
      x = /paint|layout|strict|content/,
      p = (e) => !!e && "none" !== e;
    function h(e) {
      const t = d(e) ? y(e) : e;
      return (
        p(t.transform) ||
        p(t.translate) ||
        p(t.scale) ||
        p(t.rotate) ||
        p(t.perspective) ||
        (!v() && (p(t.backdropFilter) || p(t.filter))) ||
        g.test(t.willChange || "") ||
        x.test(t.contain || "")
      );
    }
    function v() {
      return (
        null == t &&
          (t = "u" > typeof CSS && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")),
        t
      );
    }
    function b(e) {
      return /^(html|body|#document)$/.test(i(e));
    }
    function y(e) {
      return s(e).getComputedStyle(e);
    }
    function j(e) {
      if ("html" === i(e)) return e;
      const t = e.assignedSlot || e.parentNode || (u(e) && e.host) || l(e);
      return u(t) ? t.host : t;
    }
    function N(e) {
      return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
    }
    e.s(
      [
        "getComputedStyle",
        0,
        y,
        "getContainingBlock",
        0,
        (e) => {
          let t = j(e);
          while (c(t) && !b(t)) {
            if (h(t)) return t;
            if (m(t)) break;
            t = j(t);
          }
          return null;
        },
        "getDocumentElement",
        0,
        l,
        "getFrameElement",
        0,
        N,
        "getNodeName",
        0,
        i,
        "getNodeScroll",
        0,
        (e) =>
          d(e)
            ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
            : { scrollLeft: e.scrollX, scrollTop: e.scrollY },
        "getOverflowAncestors",
        0,
        function e(t, r, n) {
          var a;
          void 0 === r && (r = []), void 0 === n && (n = !0);
          const i = (function e(t) {
              const r = j(t);
              return b(r)
                ? t.ownerDocument
                  ? t.ownerDocument.body
                  : t.body
                : c(r) && f(r)
                  ? r
                  : e(r);
            })(t),
            l = i === (null == (a = t.ownerDocument) ? void 0 : a.body),
            o = s(i);
          if (!l) return r.concat(i, e(i, [], n));
          {
            const t = N(o);
            return r.concat(o, o.visualViewport || [], f(i) ? i : [], t && n ? e(t) : []);
          }
        },
        "getParentNode",
        0,
        j,
        "getWindow",
        0,
        s,
        "isContainingBlock",
        0,
        h,
        "isElement",
        0,
        d,
        "isHTMLElement",
        0,
        c,
        "isLastTraversableNode",
        0,
        b,
        "isNode",
        0,
        o,
        "isOverflowElement",
        0,
        f,
        "isShadowRoot",
        0,
        u,
        "isTableElement",
        0,
        (e) => /^(table|td|th)$/.test(i(e)),
        "isTopLayer",
        0,
        m,
        "isWebKit",
        0,
        v,
      ],
      80898,
    );
    var k = e.i(95840);
    const w = n[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0, -3)],
      C = w && w !== n.useLayoutEffect ? w : (e) => e();
    function S(e) {
      const t = (0, k.useRefWithInit)(E).current;
      return (t.next = e), C(t.effect), t.trampoline;
    }
    function E() {
      const e = {
        next: void 0,
        callback: z,
        trampoline: (...t) => e.callback?.(...t),
        effect: () => {
          e.callback = e.next;
        },
      };
      return e;
    }
    function z() {}
    e.s(["useStableCallback", 0, S], 79572);
    const P = "u" > typeof document ? n.useLayoutEffect : () => {};
    e.s(["useIsoLayoutEffect", 0, P], 47639);
    var T = e.i(88859),
      L = e.i(12040);
    const O = n.createContext(void 0);
    function B(e = {}) {
      const {
          disabled: t = !1,
          focusableWhenDisabled: r,
          tabIndex: a = 0,
          native: i = !0,
          composite: s,
        } = e,
        l = n.useRef(null),
        o = ((e = !1) => {
          const t = n.useContext(O);
          if (void 0 === t && !e) throw Error((0, L.default)(16));
          return t;
        })(!0),
        d = s ?? void 0 !== o,
        { props: c } = ((e) => {
          const {
              focusableWhenDisabled: t,
              disabled: r,
              composite: a = !1,
              tabIndex: i = 0,
              isNativeButton: s,
            } = e,
            l = a && !1 !== t,
            o = a && !1 === t;
          return {
            props: n.useMemo(() => {
              const e = {
                onKeyDown(e) {
                  r && t && "Tab" !== e.key && e.preventDefault();
                },
              };
              return (
                a || ((e.tabIndex = i), !s && r && (e.tabIndex = t ? i : -1)),
                ((s && (t || l)) || (!s && r)) && (e["aria-disabled"] = r),
                s && (!t || o) && (e.disabled = r),
                e
              );
            }, [a, r, t, l, o, s, i]),
          };
        })({ focusableWhenDisabled: r, disabled: t, composite: d, tabIndex: a, isNativeButton: i }),
        u = n.useCallback(() => {
          const e = l.current;
          D(e) && d && t && void 0 === c.disabled && e.disabled && (e.disabled = !1);
        }, [t, c.disabled, d]);
      return (
        P(u, [u]),
        {
          getButtonProps: n.useCallback(
            (e = {}) => {
              const {
                  onClick: r,
                  onMouseDown: n,
                  onKeyUp: a,
                  onKeyDown: s,
                  onPointerDown: l,
                  ...o
                } = e,
                u = i ? "button" : void 0;
              return (0, T.mergeProps)(
                {
                  type: u,
                  onClick(e) {
                    t ? e.preventDefault() : r?.(e);
                  },
                  onMouseDown(e) {
                    t || n?.(e);
                  },
                  onKeyDown(e) {
                    var n;
                    if (t || ((0, T.makeEventPreventable)(e), s?.(e), e.baseUIHandlerPrevented))
                      return;
                    const a = e.target === e.currentTarget,
                      l = e.currentTarget,
                      o = D(l),
                      c = !i && ((n = l), !!(n?.tagName === "A" && n?.href)),
                      u = a && (i ? o : !c),
                      f = "Enter" === e.key,
                      m = " " === e.key,
                      g = l.getAttribute("role"),
                      x = g?.startsWith("menuitem") || "option" === g || "gridcell" === g;
                    if (a && d && m) {
                      if (e.defaultPrevented && x) return;
                      e.preventDefault(),
                        c || (i && o)
                          ? (l.click(), e.preventBaseUIHandler())
                          : u && (r?.(e), e.preventBaseUIHandler());
                      return;
                    }
                    u && (!i && (m || f) && e.preventDefault(), !i && f && r?.(e));
                  },
                  onKeyUp(e) {
                    t ||
                      (((0, T.makeEventPreventable)(e),
                      a?.(e),
                      e.target === e.currentTarget && i && d && D(e.currentTarget) && " " === e.key)
                        ? e.preventDefault()
                        : !e.baseUIHandlerPrevented &&
                          (e.target !== e.currentTarget || i || d || " " !== e.key || r?.(e)));
                  },
                  onPointerDown(e) {
                    t ? e.preventDefault() : l?.(e);
                  },
                },
                i ? void 0 : { role: "button" },
                c,
                o,
              );
            },
            [t, c, d, i],
          ),
          buttonRef: S((e) => {
            (l.current = e), u();
          }),
        }
      );
    }
    function D(e) {
      return c(e) && "BUTTON" === e.tagName;
    }
    e.s(["useButton", 0, B], 93500);
    var R = e.i(93413);
    const $ = n.forwardRef((e, t) => {
      const {
          render: r,
          className: n,
          disabled: a = !1,
          focusableWhenDisabled: i = !1,
          nativeButton: s = !0,
          ...l
        } = e,
        { getButtonProps: o, buttonRef: d } = B({
          disabled: a,
          focusableWhenDisabled: i,
          native: s,
        });
      return (0, R.useRenderElement)("button", e, {
        state: { disabled: a },
        ref: [t, d],
        props: [l, o],
      });
    });
    var A = e.i(5583),
      I = e.i(83049);
    const M = (0, A.cva)(
      "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      {
        variants: {
          variant: {
            default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
            outline:
              "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50",
            secondary:
              "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
            ghost:
              "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
            destructive:
              "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
            link: "text-primary underline-offset-4 hover:underline",
          },
          size: {
            default:
              "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
            xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
            sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
            lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
            icon: "size-8",
            "icon-xs":
              "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
            "icon-sm":
              "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
            "icon-lg": "size-9",
          },
        },
        defaultVariants: { variant: "default", size: "default" },
      },
    );
    e.s(
      [
        "Button",
        0,
        ({ className: e, variant: t = "default", size: n = "default", ...a }) =>
          (0, r.jsx)($, {
            "data-slot": "button",
            className: (0, I.cn)(M({ variant: t, size: n, className: e })),
            ...a,
          }),
        "buttonVariants",
        0,
        M,
      ],
      38288,
    );
  },
  56,
  (e) => {
    e.i(67836);
    var t = e.i(87111),
      r = e.i(98937),
      n = e.i(1130);
    const a = (0, n.default)("circle-check", [
      ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
      ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
    ]);
    var i = e.i(7198);
    const s = (0, n.default)("eye", [
        [
          "path",
          {
            d: "M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0",
            key: "1nclc0",
          },
        ],
        ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }],
      ]),
      l = (0, n.default)("circle-x", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
        ["path", { d: "m9 9 6 6", key: "z0biqf" }],
      ]),
      o = (0, n.default)("circle-alert", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
        ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
      ]);
    var d = e.i(27433);
    const c = (0, n.default)("shield-check", [
      [
        "path",
        {
          d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
          key: "oel41y",
        },
      ],
      ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
    ]);
    var u = e.i(48519),
      f = e.i(38288),
      m = e.i(90595);
    const g = "http://localhost:3007",
      x = {
        pending: { label: "Pending", color: "bg-orange-100 text-orange-700", icon: i.Clock },
        viewed: { label: "Viewed", color: "bg-blue-100 text-blue-700", icon: s },
        signed: { label: "Signed", color: "bg-emerald-100 text-emerald-700", icon: a },
        declined: { label: "Declined", color: "bg-red-100 text-red-700", icon: l },
        expired: { label: "Expired", color: "bg-gray-100 text-gray-600", icon: o },
      };
    e.s(
      [
        "default",
        0,
        ({ params: e }) => {
          const { token: n } = (0, r.use)(e),
            [i, l] = (0, r.useState)("loading"),
            [p, h] = (0, r.useState)(null),
            [v, b] = (0, r.useState)(""),
            [y, j] = (0, r.useState)(!1),
            [N, k] = (0, r.useState)(""),
            [w, C] = (0, r.useState)(!1),
            [S, E] = (0, r.useState)(""),
            [z, P] = (0, r.useState)(!1),
            [T, L] = (0, r.useState)(!1),
            O = async () => {
              L(!0);
              try {
                const e = await fetch(`${g}/api/sign/${n}/document`);
                if (!e.ok) throw Error("Failed to load document");
                const t = await e.json();
                window.open(t.url, "_blank");
              } catch {
              } finally {
                L(!1);
              }
            };
          (0, r.useEffect)(() => {
            !(async () => {
              try {
                const e = await fetch(`${g}/api/sign/${n}`);
                if (!e.ok) {
                  const t = await e.json().catch(() => ({}));
                  b(t.error || "This signing link is invalid or has expired."), l("error");
                  return;
                }
                const t = await e.json();
                h(t), "signed" === t.signer.status ? l("already-signed") : l("verify");
              } catch {
                b("Failed to load signing information."), l("error");
              }
            })();
          }, [n]);
          const B = async () => {
              j(!0);
              try {
                if (!(await fetch(`${g}/api/sign/${n}/otp`, { method: "POST" })).ok)
                  throw Error("Failed to send OTP");
                l("otp");
              } catch {
                b("Failed to send verification code. Please try again.");
              } finally {
                j(!1);
              }
            },
            D = async () => {
              C(!0);
              try {
                const e = await fetch(`${g}/api/sign/${n}/verify`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ otp: N }),
                });
                if (!e.ok) {
                  const t = await e.json().catch(() => ({}));
                  b(t.error || "Invalid code. Please try again."), C(!1);
                  return;
                }
                b(""), l("sign");
              } catch {
                b("Verification failed. Please try again.");
              } finally {
                C(!1);
              }
            },
            R = async () => {
              if (S.trim()) {
                P(!0);
                try {
                  if (
                    !(
                      await fetch(`${g}/api/sign/${n}/sign`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: S.trim() }),
                      })
                    ).ok
                  )
                    throw Error("Failed to sign");
                  l("done");
                } catch {
                  b("Failed to sign document. Please try again.");
                } finally {
                  P(!1);
                }
              }
            };
          return "loading" === i
            ? (0, t.jsx)("div", {
                className: "w-full max-w-lg mx-4",
                children: (0, t.jsxs)("div", {
                  className:
                    "bg-card rounded-xl shadow-sm border p-8 flex flex-col items-center gap-3",
                  children: [
                    (0, t.jsx)(d.Loader2, {
                      size: 24,
                      className: "animate-spin text-muted-foreground",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-sm text-muted-foreground",
                      children: "Loading...",
                    }),
                  ],
                }),
              })
            : "error" === i
              ? (0, t.jsx)("div", {
                  className: "w-full max-w-lg mx-4",
                  children: (0, t.jsxs)("div", {
                    className: "bg-card rounded-xl shadow-sm border p-8 text-center",
                    children: [
                      (0, t.jsx)("div", {
                        className: "flex justify-center mb-3",
                        children: (0, t.jsx)(o, { size: 32, className: "text-red-500" }),
                      }),
                      (0, t.jsx)("h2", {
                        className: "text-lg font-semibold text-foreground mb-2",
                        children: "Unable to Load",
                      }),
                      (0, t.jsx)("p", { className: "text-sm text-muted-foreground", children: v }),
                    ],
                  }),
                })
              : (0, t.jsx)("div", {
                  className: "w-full max-w-lg mx-4",
                  children: (0, t.jsxs)("div", {
                    className: "bg-card rounded-xl shadow-sm border overflow-hidden",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "px-6 py-5 border-b",
                        children: [
                          (0, t.jsxs)("div", {
                            className: "flex items-center gap-2 mb-4",
                            children: [
                              (0, t.jsx)(
                                () =>
                                  (0, t.jsxs)("svg", {
                                    xmlns: "http://www.w3.org/2000/svg",
                                    viewBox: "0 0 200 200",
                                    width: "28",
                                    height: "28",
                                    children: [
                                      (0, t.jsxs)("defs", {
                                        children: [
                                          (0, t.jsx)("clipPath", {
                                            id: "lc2",
                                            children: (0, t.jsx)("rect", {
                                              width: "200",
                                              height: "200",
                                              x: "0",
                                              y: "0",
                                            }),
                                          }),
                                          (0, t.jsx)("g", {
                                            id: "lg2",
                                            children: (0, t.jsx)("g", {
                                              transform: "matrix(0.997,0,0,1,100.147,100)",
                                              opacity: "1",
                                              children: (0, t.jsx)("g", {
                                                opacity: "1",
                                                transform: "matrix(1,0,0,1,0,0)",
                                                children: (0, t.jsx)("path", {
                                                  fill: "rgb(255,0,0)",
                                                  fillOpacity: "1",
                                                  d: "M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z",
                                                }),
                                              }),
                                            }),
                                          }),
                                          (0, t.jsx)("filter", {
                                            id: "lf2",
                                            filterUnits: "objectBoundingBox",
                                            x: "0%",
                                            y: "0%",
                                            width: "100%",
                                            height: "100%",
                                            children: (0, t.jsx)("feComponentTransfer", {
                                              in: "SourceGraphic",
                                              children: (0, t.jsx)("feFuncA", {
                                                type: "table",
                                                tableValues: "1.0 0.0",
                                              }),
                                            }),
                                          }),
                                          (0, t.jsx)("mask", {
                                            id: "lm2",
                                            maskType: "alpha",
                                            children: (0, t.jsxs)("g", {
                                              filter: "url(#lf2)",
                                              children: [
                                                (0, t.jsx)("rect", {
                                                  width: "200",
                                                  height: "200",
                                                  x: "0",
                                                  y: "0",
                                                  fill: "#ffffff",
                                                  opacity: "0",
                                                }),
                                                (0, t.jsx)("use", { xlinkHref: "#lg2" }),
                                              ],
                                            }),
                                          }),
                                        ],
                                      }),
                                      (0, t.jsx)("g", {
                                        clipPath: "url(#lc2)",
                                        children: (0, t.jsx)("g", {
                                          mask: "url(#lm2)",
                                          children: (0, t.jsx)("g", {
                                            transform: "matrix(1,0,0,1,100,100)",
                                            opacity: "1",
                                            children: (0, t.jsx)("g", {
                                              opacity: "1",
                                              transform: "matrix(1,0,0,1,0,0)",
                                              children: (0, t.jsx)("path", {
                                                fill: "rgb(0,0,0)",
                                                fillOpacity: "1",
                                                d: "M-51.925,-68.428 L51.925,-68.428 L51.925,68.428 L-51.925,68.428z",
                                              }),
                                            }),
                                          }),
                                        }),
                                      }),
                                    ],
                                  }),
                                {},
                              ),
                              (0, t.jsx)("span", {
                                className: "text-sm font-semibold text-foreground",
                                children: "Cometa",
                              }),
                            ],
                          }),
                          (0, t.jsx)("h1", {
                            className: "text-lg font-semibold text-foreground",
                            children: p?.document.name,
                          }),
                          (0, t.jsxs)("p", {
                            className: "text-sm text-muted-foreground mt-1",
                            children: [
                              p?.request.requestedByEmail,
                              " has requested your signature",
                            ],
                          }),
                          p?.request.message &&
                            (0, t.jsx)("div", {
                              className: "mt-3 p-3 bg-muted rounded-lg",
                              children: (0, t.jsxs)("p", {
                                className: "text-sm text-muted-foreground italic",
                                children: ["“", p.request.message, "”"],
                              }),
                            }),
                        ],
                      }),
                      p &&
                        p.signatures.length > 1 &&
                        (0, t.jsxs)("div", {
                          className: "px-6 py-4 border-b",
                          children: [
                            (0, t.jsx)("p", {
                              className:
                                "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2",
                              children: "Signers",
                            }),
                            (0, t.jsx)("div", {
                              className: "space-y-2",
                              children: p.signatures.map((e) => {
                                const r = x[e.status] ?? x.pending,
                                  n = r.icon;
                                return (0, t.jsxs)(
                                  "div",
                                  {
                                    className: "flex items-center justify-between",
                                    children: [
                                      (0, t.jsx)("span", {
                                        className: "text-sm text-muted-foreground",
                                        children: e.name || e.email,
                                      }),
                                      (0, t.jsxs)(m.Badge, {
                                        className: r.color,
                                        children: [(0, t.jsx)(n, { size: 12 }), r.label],
                                      }),
                                    ],
                                  },
                                  e.email,
                                );
                              }),
                            }),
                          ],
                        }),
                      ("sign" === i || "done" === i || "already-signed" === i) &&
                        (0, t.jsx)("div", {
                          className: "px-6 py-4 border-b",
                          children: (0, t.jsxs)(f.Button, {
                            variant: "outline",
                            className: "w-full gap-2 py-2.5",
                            onClick: O,
                            disabled: T,
                            children: [
                              T
                                ? (0, t.jsx)(d.Loader2, { size: 14, className: "animate-spin" })
                                : (0, t.jsx)(s, { size: 14 }),
                              T ? "Opening..." : "View Document",
                            ],
                          }),
                        }),
                      (0, t.jsxs)("div", {
                        className: "px-6 py-6",
                        children: [
                          "already-signed" === i &&
                            (0, t.jsxs)("div", {
                              className: "text-center py-4",
                              children: [
                                (0, t.jsx)("div", {
                                  className: "flex justify-center mb-3",
                                  children: (0, t.jsx)("div", {
                                    className:
                                      "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center",
                                    children: (0, t.jsx)(a, {
                                      size: 24,
                                      className: "text-emerald-600",
                                    }),
                                  }),
                                }),
                                (0, t.jsx)("h2", {
                                  className: "text-lg font-semibold text-foreground mb-1",
                                  children: "Already Signed",
                                }),
                                (0, t.jsx)("p", {
                                  className: "text-sm text-muted-foreground",
                                  children: "You have already signed this document.",
                                }),
                              ],
                            }),
                          "verify" === i &&
                            (0, t.jsxs)("div", {
                              className: "space-y-4",
                              children: [
                                (0, t.jsxs)("div", {
                                  className: "flex items-center gap-3",
                                  children: [
                                    (0, t.jsx)("div", {
                                      className:
                                        "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0",
                                      children: (0, t.jsx)(c, {
                                        size: 16,
                                        className: "text-blue-600",
                                      }),
                                    }),
                                    (0, t.jsxs)("div", {
                                      children: [
                                        (0, t.jsx)("h2", {
                                          className: "text-sm font-semibold text-foreground",
                                          children: "Verify your identity",
                                        }),
                                        (0, t.jsxs)("p", {
                                          className: "text-xs text-muted-foreground",
                                          children: [
                                            "We'll send a verification code to",
                                            " ",
                                            (0, t.jsx)("span", {
                                              className: "font-medium text-muted-foreground",
                                              children: p?.signer.email,
                                            }),
                                          ],
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                (0, t.jsxs)(f.Button, {
                                  className: "w-full gap-1.5",
                                  onClick: B,
                                  disabled: y,
                                  children: [
                                    y
                                      ? (0, t.jsx)(d.Loader2, {
                                          size: 14,
                                          className: "animate-spin",
                                        })
                                      : (0, t.jsx)(c, { size: 14 }),
                                    y ? "Sending..." : "Send Verification Code",
                                  ],
                                }),
                              ],
                            }),
                          "otp" === i &&
                            (0, t.jsxs)("div", {
                              className: "space-y-4",
                              children: [
                                (0, t.jsxs)("div", {
                                  className: "flex items-center gap-3",
                                  children: [
                                    (0, t.jsx)("div", {
                                      className:
                                        "w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0",
                                      children: (0, t.jsx)(c, {
                                        size: 16,
                                        className: "text-blue-600",
                                      }),
                                    }),
                                    (0, t.jsxs)("div", {
                                      children: [
                                        (0, t.jsx)("h2", {
                                          className: "text-sm font-semibold text-foreground",
                                          children: "Enter verification code",
                                        }),
                                        (0, t.jsx)("p", {
                                          className: "text-xs text-muted-foreground",
                                          children: "Check your email for a 6-digit code",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                v &&
                                  (0, t.jsx)("p", {
                                    className: "text-sm text-red-600",
                                    children: v,
                                  }),
                                (0, t.jsx)("input", {
                                  type: "text",
                                  inputMode: "numeric",
                                  maxLength: 6,
                                  value: N,
                                  onChange: (e) => {
                                    k(e.target.value.replace(/\D/g, ""));
                                  },
                                  onKeyDown: (e) => {
                                    "Enter" === e.key && 6 === N.length && D();
                                  },
                                  placeholder: "000000",
                                  className:
                                    "w-full px-4 py-3 text-center text-2xl font-mono tracking-[0.5em] border rounded-lg outline-none focus:border-foreground transition-colors",
                                  autoFocus: !0,
                                }),
                                (0, t.jsxs)("div", {
                                  className: "flex gap-2",
                                  children: [
                                    (0, t.jsx)(f.Button, {
                                      variant: "outline",
                                      className: "flex-1",
                                      onClick: () => {
                                        l("verify"), k(""), b("");
                                      },
                                      children: "Back",
                                    }),
                                    (0, t.jsxs)(f.Button, {
                                      className: "flex-1 gap-1.5",
                                      onClick: D,
                                      disabled: w || 6 !== N.length,
                                      children: [
                                        w
                                          ? (0, t.jsx)(d.Loader2, {
                                              size: 14,
                                              className: "animate-spin",
                                            })
                                          : null,
                                        w ? "Verifying..." : "Verify",
                                      ],
                                    }),
                                  ],
                                }),
                              ],
                            }),
                          "sign" === i &&
                            (0, t.jsxs)("div", {
                              className: "space-y-4",
                              children: [
                                (0, t.jsxs)("div", {
                                  className: "flex items-center gap-3",
                                  children: [
                                    (0, t.jsx)("div", {
                                      className:
                                        "w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0",
                                      children: (0, t.jsx)(u.PenLine, {
                                        size: 16,
                                        className: "text-emerald-600",
                                      }),
                                    }),
                                    (0, t.jsxs)("div", {
                                      children: [
                                        (0, t.jsx)("h2", {
                                          className: "text-sm font-semibold text-foreground",
                                          children: "Sign document",
                                        }),
                                        (0, t.jsx)("p", {
                                          className: "text-xs text-muted-foreground",
                                          children: "Enter your full legal name to sign",
                                        }),
                                      ],
                                    }),
                                  ],
                                }),
                                v &&
                                  (0, t.jsx)("p", {
                                    className: "text-sm text-red-600",
                                    children: v,
                                  }),
                                (0, t.jsxs)("div", {
                                  children: [
                                    (0, t.jsx)("input", {
                                      type: "text",
                                      value: S,
                                      onChange: (e) => E(e.target.value),
                                      onKeyDown: (e) => {
                                        "Enter" === e.key && S.trim() && R();
                                      },
                                      placeholder: "Your full name",
                                      className:
                                        "w-full px-4 py-3 text-sm border rounded-lg outline-none focus:border-foreground transition-colors",
                                      autoFocus: !0,
                                    }),
                                    S.trim() &&
                                      (0, t.jsxs)("div", {
                                        className: "mt-3 px-4 py-3 bg-muted rounded-lg border",
                                        children: [
                                          (0, t.jsx)("p", {
                                            className: "text-xs text-muted-foreground mb-1",
                                            children: "Signature preview",
                                          }),
                                          (0, t.jsx)("p", {
                                            className: "text-xl font-serif italic text-foreground",
                                            children: S,
                                          }),
                                        ],
                                      }),
                                  ],
                                }),
                                (0, t.jsxs)(f.Button, {
                                  className: "w-full gap-1.5",
                                  onClick: R,
                                  disabled: z || !S.trim(),
                                  children: [
                                    z
                                      ? (0, t.jsx)(d.Loader2, {
                                          size: 14,
                                          className: "animate-spin",
                                        })
                                      : (0, t.jsx)(u.PenLine, { size: 14 }),
                                    z ? "Signing..." : "Sign Document",
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className: "text-xs text-muted-foreground/60 text-center",
                                  children:
                                    "By signing, you agree that your electronic signature is legally binding.",
                                }),
                              ],
                            }),
                          "done" === i &&
                            (0, t.jsxs)("div", {
                              className: "text-center py-4",
                              children: [
                                (0, t.jsx)("div", {
                                  className: "flex justify-center mb-3",
                                  children: (0, t.jsx)("div", {
                                    className:
                                      "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center",
                                    children: (0, t.jsx)(a, {
                                      size: 24,
                                      className: "text-emerald-600",
                                    }),
                                  }),
                                }),
                                (0, t.jsx)("h2", {
                                  className: "text-lg font-semibold text-foreground mb-1",
                                  children: "Document Signed",
                                }),
                                (0, t.jsxs)("p", {
                                  className: "text-sm text-muted-foreground",
                                  children: [
                                    "Thank you, ",
                                    S,
                                    ". Your signature has been recorded.",
                                  ],
                                }),
                                (0, t.jsx)("p", {
                                  className: "text-xs text-muted-foreground/60 mt-3",
                                  children: "You may close this page.",
                                }),
                              ],
                            }),
                        ],
                      }),
                      (0, t.jsx)("div", {
                        className: "px-6 py-3 border-t bg-muted",
                        children: (0, t.jsx)("p", {
                          className: "text-xs text-muted-foreground/60 text-center",
                          children: "Secured by Cometa",
                        }),
                      }),
                    ],
                  }),
                });
        },
      ],
      56,
    );
  },
]);
