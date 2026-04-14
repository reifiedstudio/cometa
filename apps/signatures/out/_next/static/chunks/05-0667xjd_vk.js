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
  37519,
  8081,
  (e) => {
    e.i(67836);
    var t = {
        setTimeout: (e, t) => setTimeout(e, t),
        clearTimeout: (e) => clearTimeout(e),
        setInterval: (e, t) => setInterval(e, t),
        clearInterval: (e) => clearInterval(e),
      },
      r = new (class {
        #e = t;
        #t = !1;
        setTimeoutProvider(e) {
          this.#e = e;
        }
        setTimeout(e, t) {
          return this.#e.setTimeout(e, t);
        }
        clearTimeout(e) {
          this.#e.clearTimeout(e);
        }
        setInterval(e, t) {
          return this.#e.setInterval(e, t);
        }
        clearInterval(e) {
          this.#e.clearInterval(e);
        }
      })();
    e.s(
      [
        "systemSetTimeoutZero",
        0,
        (e) => {
          setTimeout(e, 0);
        },
        "timeoutManager",
        0,
        r,
      ],
      8081,
    );
    var n = "u" < typeof window || "Deno" in globalThis;
    function i(e, t) {
      return (t?.queryKeyHashFn || s)(e);
    }
    function s(e) {
      return JSON.stringify(e, (e, t) =>
        c(t)
          ? Object.keys(t)
              .sort()
              .reduce((e, r) => ((e[r] = t[r]), e), {})
          : t,
      );
    }
    function o(e, t) {
      return (
        e === t ||
        (typeof e == typeof t &&
          !!e &&
          !!t &&
          "object" == typeof e &&
          "object" == typeof t &&
          Object.keys(t).every((r) => o(e[r], t[r])))
      );
    }
    var a = Object.prototype.hasOwnProperty;
    function u(e) {
      return Array.isArray(e) && e.length === Object.keys(e).length;
    }
    function c(e) {
      if (!l(e)) return !1;
      const t = e.constructor;
      if (void 0 === t) return !0;
      const r = t.prototype;
      return (
        !!l(r) &&
        !!r.hasOwnProperty("isPrototypeOf") &&
        Object.getPrototypeOf(e) === Object.prototype
      );
    }
    function l(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
    var h = Symbol();
    e.s(
      [
        "addConsumeAwareSignal",
        0,
        (e, t, r) => {
          let n,
            i = !1;
          return (
            Object.defineProperty(e, "signal", {
              enumerable: !0,
              get: () => (
                (n ??= t()),
                i || ((i = !0), n.aborted ? r() : n.addEventListener("abort", r, { once: !0 })),
                n
              ),
            }),
            e
          );
        },
        "addToEnd",
        0,
        (e, t, r = 0) => {
          const n = [...e, t];
          return r && n.length > r ? n.slice(1) : n;
        },
        "addToStart",
        0,
        (e, t, r = 0) => {
          const n = [t, ...e];
          return r && n.length > r ? n.slice(0, -1) : n;
        },
        "ensureQueryFn",
        0,
        (e, t) =>
          !e.queryFn && t?.initialPromise
            ? () => t.initialPromise
            : e.queryFn && e.queryFn !== h
              ? e.queryFn
              : () => Promise.reject(Error(`Missing queryFn: '${e.queryHash}'`)),
        "functionalUpdate",
        0,
        (e, t) => ("function" == typeof e ? e(t) : e),
        "hashKey",
        0,
        s,
        "hashQueryKeyByOptions",
        0,
        i,
        "isServer",
        0,
        n,
        "isValidTimeout",
        0,
        (e) => "number" == typeof e && e >= 0 && e !== 1 / 0,
        "matchMutation",
        0,
        (e, t) => {
          const { exact: r, status: n, predicate: i, mutationKey: a } = e;
          if (a) {
            if (!t.options.mutationKey) return !1;
            if (r) {
              if (s(t.options.mutationKey) !== s(a)) return !1;
            } else if (!o(t.options.mutationKey, a)) return !1;
          }
          return (!n || t.state.status === n) && (!i || !!i(t));
        },
        "matchQuery",
        0,
        (e, t) => {
          const {
            type: r = "all",
            exact: n,
            fetchStatus: s,
            predicate: a,
            queryKey: u,
            stale: c,
          } = e;
          if (u) {
            if (n) {
              if (t.queryHash !== i(u, t.options)) return !1;
            } else if (!o(t.queryKey, u)) return !1;
          }
          if ("all" !== r) {
            const e = t.isActive();
            if (("active" === r && !e) || ("inactive" === r && e)) return !1;
          }
          return (
            ("boolean" != typeof c || t.isStale() === c) &&
            (!s || s === t.state.fetchStatus) &&
            (!a || !!a(t))
          );
        },
        "noop",
        0,
        () => {},
        "partialMatchKey",
        0,
        o,
        "replaceData",
        0,
        (e, t, r) =>
          "function" == typeof r.structuralSharing
            ? r.structuralSharing(e, t)
            : !1 !== r.structuralSharing
              ? (function e(t, r, n = 0) {
                  if (t === r) return t;
                  if (n > 500) return r;
                  const i = u(t) && u(r);
                  if (!i && !(c(t) && c(r))) return r;
                  let s = (i ? t : Object.keys(t)).length,
                    o = i ? r : Object.keys(r),
                    l = o.length,
                    h = i ? Array(l) : {},
                    d = 0;
                  for (let u = 0; u < l; u++) {
                    const c = i ? u : o[u],
                      l = t[c],
                      f = r[c];
                    if (l === f) {
                      (h[c] = l), (i ? u < s : a.call(t, c)) && d++;
                      continue;
                    }
                    if (null === l || null === f || "object" != typeof l || "object" != typeof f) {
                      h[c] = f;
                      continue;
                    }
                    const p = e(l, f, n + 1);
                    (h[c] = p), p === l && d++;
                  }
                  return s === l && d === s ? t : h;
                })(e, t)
              : t,
        "resolveEnabled",
        0,
        (e, t) => ("function" == typeof e ? e(t) : e),
        "resolveStaleTime",
        0,
        (e, t) => ("function" == typeof e ? e(t) : e),
        "shallowEqualObjects",
        0,
        (e, t) => {
          if (!t || Object.keys(e).length !== Object.keys(t).length) return !1;
          for (const r in e) if (e[r] !== t[r]) return !1;
          return !0;
        },
        "shouldThrowError",
        0,
        (e, t) => ("function" == typeof e ? e(...t) : !!e),
        "skipToken",
        0,
        h,
        "sleep",
        0,
        (e) =>
          new Promise((t) => {
            r.setTimeout(t, e);
          }),
        "timeUntilStale",
        0,
        (e, t) => Math.max(e + (t || 0) - Date.now(), 0),
      ],
      37519,
    );
  },
  94720,
  (e) => {
    let t, r, n, i, s, o;
    var a = e.i(8081).systemSetTimeoutZero,
      u =
        ((t = []),
        (r = 0),
        (n = (e) => {
          e();
        }),
        (i = (e) => {
          e();
        }),
        (s = a),
        {
          batch: (e) => {
            let o;
            r++;
            try {
              o = e();
            } finally {
              let e;
              --r ||
                ((e = t),
                (t = []),
                e.length &&
                  s(() => {
                    i(() => {
                      e.forEach((e) => {
                        n(e);
                      });
                    });
                  }));
            }
            return o;
          },
          batchCalls:
            (e) =>
            (...t) => {
              o(() => {
                e(...t);
              });
            },
          schedule: (o = (e) => {
            r
              ? t.push(e)
              : s(() => {
                  n(e);
                });
          }),
          setNotifyFunction: (e) => {
            n = e;
          },
          setBatchNotifyFunction: (e) => {
            i = e;
          },
          setScheduler: (e) => {
            s = e;
          },
        });
    e.s(["notifyManager", 0, u]);
  },
  34517,
  41357,
  (e) => {
    var t = class {
      constructor() {
        (this.listeners = new Set()), (this.subscribe = this.subscribe.bind(this));
      }
      subscribe(e) {
        return (
          this.listeners.add(e),
          this.onSubscribe(),
          () => {
            this.listeners.delete(e), this.onUnsubscribe();
          }
        );
      }
      hasListeners() {
        return this.listeners.size > 0;
      }
      onSubscribe() {}
      onUnsubscribe() {}
    };
    e.s(["Subscribable", 0, t], 41357);
    var r = new (class extends t {
      #r;
      #n;
      #i;
      constructor() {
        super(),
          (this.#i = (e) => {
            if ("u" > typeof window && window.addEventListener) {
              const t = () => e();
              return (
                window.addEventListener("visibilitychange", t, !1),
                () => {
                  window.removeEventListener("visibilitychange", t);
                }
              );
            }
          });
      }
      onSubscribe() {
        this.#n || this.setEventListener(this.#i);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#n?.(), (this.#n = void 0));
      }
      setEventListener(e) {
        (this.#i = e),
          this.#n?.(),
          (this.#n = e((e) => {
            "boolean" == typeof e ? this.setFocused(e) : this.onFocus();
          }));
      }
      setFocused(e) {
        this.#r !== e && ((this.#r = e), this.onFocus());
      }
      onFocus() {
        const e = this.isFocused();
        this.listeners.forEach((t) => {
          t(e);
        });
      }
      isFocused() {
        return "boolean" == typeof this.#r
          ? this.#r
          : globalThis.document?.visibilityState !== "hidden";
      }
    })();
    e.s(["focusManager", 0, r], 34517);
  },
  65548,
  16621,
  (e) => {
    var t = e.i(41357),
      r = new (class extends t.Subscribable {
        #s = !0;
        #n;
        #i;
        constructor() {
          super(),
            (this.#i = (e) => {
              if ("u" > typeof window && window.addEventListener) {
                const t = () => e(!0),
                  r = () => e(!1);
                return (
                  window.addEventListener("online", t, !1),
                  window.addEventListener("offline", r, !1),
                  () => {
                    window.removeEventListener("online", t),
                      window.removeEventListener("offline", r);
                  }
                );
              }
            });
        }
        onSubscribe() {
          this.#n || this.setEventListener(this.#i);
        }
        onUnsubscribe() {
          this.hasListeners() || (this.#n?.(), (this.#n = void 0));
        }
        setEventListener(e) {
          (this.#i = e), this.#n?.(), (this.#n = e(this.setOnline.bind(this)));
        }
        setOnline(e) {
          this.#s !== e &&
            ((this.#s = e),
            this.listeners.forEach((t) => {
              t(e);
            }));
        }
        isOnline() {
          return this.#s;
        }
      })();
    e.s(["onlineManager", 0, r], 65548),
      e.i(37519),
      e.s(
        [
          "pendingThenable",
          0,
          () => {
            let e,
              t,
              r = new Promise((r, n) => {
                (e = r), (t = n);
              });
            function n(e) {
              Object.assign(r, e), delete r.resolve, delete r.reject;
            }
            return (
              (r.status = "pending"),
              r.catch(() => {}),
              (r.resolve = (t) => {
                n({ status: "fulfilled", value: t }), e(t);
              }),
              (r.reject = (e) => {
                n({ status: "rejected", reason: e }), t(e);
              }),
              r
            );
          },
        ],
        16621,
      );
  },
  93771,
  (e) => {
    let t;
    var r = e.i(37519),
      n =
        ((t = () => r.isServer),
        {
          isServer: () => t(),
          setIsServer(e) {
            t = e;
          },
        });
    e.s(["environmentManager", 0, n]);
  },
  45213,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = { formatUrl: () => a, formatWithValidation: () => c, urlObjectKeys: () => u };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
    const s = e.r(10380)._(e.r(79643)),
      o = /https?|ftp|gopher|file/;
    function a(e) {
      let { auth: t, hostname: r } = e,
        n = e.protocol || "",
        i = e.pathname || "",
        a = e.hash || "",
        u = e.query || "",
        c = !1;
      (t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : ""),
        e.host
          ? (c = t + e.host)
          : r && ((c = t + (~r.indexOf(":") ? `[${r}]` : r)), e.port && (c += ":" + e.port)),
        u && "object" == typeof u && (u = String(s.urlQueryToSearchParams(u)));
      let l = e.search || (u && `?${u}`) || "";
      return (
        n && !n.endsWith(":") && (n += ":"),
        e.slashes || ((!n || o.test(n)) && !1 !== c)
          ? ((c = "//" + (c || "")), i && "/" !== i[0] && (i = "/" + i))
          : c || (c = ""),
        a && "#" !== a[0] && (a = "#" + a),
        l && "?" !== l[0] && (l = "?" + l),
        (i = i.replace(/[?#]/g, encodeURIComponent)),
        (l = l.replace("#", "%23")),
        `${n}${c}${i}${l}${a}`
      );
    }
    const u = [
      "auth",
      "hash",
      "host",
      "hostname",
      "href",
      "path",
      "pathname",
      "port",
      "protocol",
      "query",
      "search",
      "slashes",
    ];
    function c(e) {
      return a(e);
    }
  },
  67092,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useMergedRef", { enumerable: !0, get: () => i });
    const n = e.r(98937);
    function i(e, t) {
      const r = (0, n.useRef)(null),
        i = (0, n.useRef)(null);
      return (0, n.useCallback)(
        (n) => {
          if (null === n) {
            const e = r.current;
            e && ((r.current = null), e());
            const t = i.current;
            t && ((i.current = null), t());
          } else e && (r.current = s(e, n)), t && (i.current = s(t, n));
        },
        [e, t],
      );
    }
    function s(e, t) {
      if ("function" != typeof e)
        return (
          (e.current = t),
          () => {
            e.current = null;
          }
        );
      {
        const r = e(t);
        return "function" == typeof r ? r : () => e(null);
      }
    }
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  99215,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "isLocalURL", { enumerable: !0, get: () => s });
    const n = e.r(22452),
      i = e.r(5870);
    function s(e) {
      if (!(0, n.isAbsoluteUrl)(e)) return !0;
      try {
        const t = (0, n.getLocationOrigin)(),
          r = new URL(e, t);
        return r.origin === t && (0, i.hasBasePath)(r.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  42765,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "errorOnce", { enumerable: !0, get: () => n });
    const n = (e) => {};
  },
  5074,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 });
    var n = { default: () => m, useLinkStatus: () => g };
    for (var i in n) Object.defineProperty(r, i, { enumerable: !0, get: n[i] });
    const s = e.r(10380),
      o = e.r(87111),
      a = s._(e.r(98937)),
      u = e.r(45213),
      c = e.r(67650),
      l = e.r(67092),
      h = e.r(22452),
      d = e.r(70476);
    e.r(49768);
    const f = e.r(61523),
      p = e.r(8659),
      y = e.r(99215),
      v = e.r(54083);
    function m(t) {
      var r, n;
      let i,
        s,
        m,
        [g, S] = (0, a.useOptimistic)(p.IDLE_LINK_STATUS),
        w = (0, a.useRef)(null),
        {
          href: O,
          as: T,
          children: j,
          prefetch: C = null,
          passHref: E,
          replace: F,
          shallow: P,
          scroll: R,
          onClick: M,
          onMouseEnter: k,
          onTouchStart: q,
          legacyBehavior: U = !1,
          onNavigate: L,
          transitionTypes: A,
          ref: _,
          unstable_dynamicOnHover: D,
          ...I
        } = t;
      (i = j),
        U &&
          ("string" == typeof i || "number" == typeof i) &&
          (i = (0, o.jsx)("a", { children: i }));
      const $ = a.default.useContext(c.AppRouterContext),
        x = !1 !== C,
        K =
          !1 !== C
            ? null === (n = C) || "auto" === n
              ? v.FetchStrategy.PPR
              : v.FetchStrategy.Full
            : v.FetchStrategy.PPR,
        N = "string" == typeof (r = T || O) ? r : (0, u.formatUrl)(r);
      if (U) {
        if (i?.$$typeof === Symbol.for("react.lazy"))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E863", enumerable: !1, configurable: !0 },
          );
        s = a.default.Children.only(i);
      }
      const B = U ? s && "object" == typeof s && s.ref : _,
        Q = a.default.useCallback(
          (e) => (
            null !== $ && (w.current = (0, p.mountLinkInstance)(e, N, $, K, x, S)),
            () => {
              w.current && ((0, p.unmountLinkForCurrentNavigation)(w.current), (w.current = null)),
                (0, p.unmountPrefetchableInstance)(e);
            }
          ),
          [x, N, $, K, S],
        ),
        G = {
          ref: (0, l.useMergedRef)(Q, B),
          onClick(t) {
            U || "function" != typeof M || M(t),
              U && s.props && "function" == typeof s.props.onClick && s.props.onClick(t),
              !$ ||
                t.defaultPrevented ||
                ((t, r, n, i, s, o, u) => {
                  if ("u" > typeof window) {
                    let c,
                      { nodeName: l } = t.currentTarget;
                    if (
                      ("A" === l.toUpperCase() &&
                        (((c = t.currentTarget.getAttribute("target")) && "_self" !== c) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute("download")
                    )
                      return;
                    if (!(0, y.isLocalURL)(r)) {
                      i && (t.preventDefault(), location.replace(r));
                      return;
                    }
                    if ((t.preventDefault(), o)) {
                      let e = !1;
                      if (
                        (o({
                          preventDefault: () => {
                            e = !0;
                          },
                        }),
                        e)
                      )
                        return;
                    }
                    const { dispatchNavigateAction: h } = e.r(13266);
                    a.default.startTransition(() => {
                      h(
                        r,
                        i ? "replace" : "push",
                        !1 === s ? f.ScrollBehavior.NoScroll : f.ScrollBehavior.Default,
                        n.current,
                        u,
                      );
                    });
                  }
                })(t, N, w, F, R, L, A);
          },
          onMouseEnter(e) {
            U || "function" != typeof k || k(e),
              U && s.props && "function" == typeof s.props.onMouseEnter && s.props.onMouseEnter(e),
              $ && x && (0, p.onNavigationIntent)(e.currentTarget, !0 === D);
          },
          onTouchStart: (e) => {
            U || "function" != typeof q || q(e),
              U && s.props && "function" == typeof s.props.onTouchStart && s.props.onTouchStart(e),
              $ && x && (0, p.onNavigationIntent)(e.currentTarget, !0 === D);
          },
        };
      return (
        (0, h.isAbsoluteUrl)(N)
          ? (G.href = N)
          : (U && !E && ("a" !== s.type || "href" in s.props)) || (G.href = (0, d.addBasePath)(N)),
        (m = U ? a.default.cloneElement(s, G) : (0, o.jsx)("a", { ...I, ...G, children: i })),
        (0, o.jsx)(b.Provider, { value: g, children: m })
      );
    }
    e.r(42765);
    const b = (0, a.createContext)(p.IDLE_LINK_STATUS),
      g = () => (0, a.useContext)(b);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  41136,
  13564,
  78408,
  73048,
  52734,
  (e) => {
    e.i(67836);
    var t = e.i(37519),
      r = e.i(94720),
      n = e.i(34517),
      i = e.i(65548),
      s = e.i(16621),
      o = e.i(93771);
    function a(e) {
      return Math.min(1e3 * 2 ** e, 3e4);
    }
    function u(e) {
      return (e ?? "online") !== "online" || i.onlineManager.isOnline();
    }
    var c = class extends Error {
      constructor(e) {
        super("CancelledError"), (this.revert = e?.revert), (this.silent = e?.silent);
      }
    };
    function l(e) {
      let r,
        l = !1,
        h = 0,
        d = (0, s.pendingThenable)(),
        f = () =>
          n.focusManager.isFocused() &&
          ("always" === e.networkMode || i.onlineManager.isOnline()) &&
          e.canRun(),
        p = () => u(e.networkMode) && e.canRun(),
        y = (e) => {
          "pending" === d.status && (r?.(), d.resolve(e));
        },
        v = (e) => {
          "pending" === d.status && (r?.(), d.reject(e));
        },
        m = () =>
          new Promise((t) => {
            (r = (e) => {
              ("pending" !== d.status || f()) && t(e);
            }),
              e.onPause?.();
          }).then(() => {
            (r = void 0), "pending" === d.status && e.onContinue?.();
          }),
        b = () => {
          let r;
          if ("pending" !== d.status) return;
          const n = 0 === h ? e.initialPromise : void 0;
          try {
            r = n ?? e.fn();
          } catch (e) {
            r = Promise.reject(e);
          }
          Promise.resolve(r)
            .then(y)
            .catch((r) => {
              if ("pending" !== d.status) return;
              const n = e.retry ?? 3 * !o.environmentManager.isServer(),
                i = e.retryDelay ?? a,
                s = "function" == typeof i ? i(h, r) : i,
                u =
                  !0 === n ||
                  ("number" == typeof n && h < n) ||
                  ("function" == typeof n && n(h, r));
              l || !u
                ? v(r)
                : (h++,
                  e.onFail?.(h, r),
                  (0, t.sleep)(s)
                    .then(() => (f() ? void 0 : m()))
                    .then(() => {
                      l ? v(r) : b();
                    }));
            });
        };
      return {
        promise: d,
        status: () => d.status,
        cancel: (t) => {
          if ("pending" === d.status) {
            const r = new c(t);
            v(r), e.onCancel?.(r);
          }
        },
        continue: () => (r?.(), d),
        cancelRetry: () => {
          l = !0;
        },
        continueRetry: () => {
          l = !1;
        },
        canStart: p,
        start: () => (p() ? b() : m().then(b), d),
      };
    }
    e.s(["CancelledError", 0, c, "canFetch", 0, u, "createRetryer", 0, l], 13564);
    var h = e.i(8081),
      d = class {
        #o;
        destroy() {
          this.clearGcTimeout();
        }
        scheduleGc() {
          this.clearGcTimeout(),
            (0, t.isValidTimeout)(this.gcTime) &&
              (this.#o = h.timeoutManager.setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime));
        }
        updateGcTime(e) {
          this.gcTime = Math.max(
            this.gcTime || 0,
            e ?? (o.environmentManager.isServer() ? 1 / 0 : 3e5),
          );
        }
        clearGcTimeout() {
          this.#o && (h.timeoutManager.clearTimeout(this.#o), (this.#o = void 0));
        }
      };
    e.s(["Removable", 0, d], 78408);
    var f = class extends d {
      #a;
      #u;
      #c;
      #l;
      #h;
      #d;
      #f;
      constructor(e) {
        super(),
          (this.#f = !1),
          (this.#d = e.defaultOptions),
          this.setOptions(e.options),
          (this.observers = []),
          (this.#l = e.client),
          (this.#c = this.#l.getQueryCache()),
          (this.queryKey = e.queryKey),
          (this.queryHash = e.queryHash),
          (this.#a = v(this.options)),
          (this.state = e.state ?? this.#a),
          this.scheduleGc();
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        return this.#h?.promise;
      }
      setOptions(e) {
        if (
          ((this.options = { ...this.#d, ...e }),
          this.updateGcTime(this.options.gcTime),
          this.state && void 0 === this.state.data)
        ) {
          const e = v(this.options);
          void 0 !== e.data && (this.setState(y(e.data, e.dataUpdatedAt)), (this.#a = e));
        }
      }
      optionalRemove() {
        this.observers.length || "idle" !== this.state.fetchStatus || this.#c.remove(this);
      }
      setData(e, r) {
        const n = (0, t.replaceData)(this.state.data, e, this.options);
        return (
          this.#p({ data: n, type: "success", dataUpdatedAt: r?.updatedAt, manual: r?.manual }), n
        );
      }
      setState(e, t) {
        this.#p({ type: "setState", state: e, setStateOptions: t });
      }
      cancel(e) {
        const r = this.#h?.promise;
        return this.#h?.cancel(e), r ? r.then(t.noop).catch(t.noop) : Promise.resolve();
      }
      destroy() {
        super.destroy(), this.cancel({ silent: !0 });
      }
      get resetState() {
        return this.#a;
      }
      reset() {
        this.destroy(), this.setState(this.resetState);
      }
      isActive() {
        return this.observers.some((e) => !1 !== (0, t.resolveEnabled)(e.options.enabled, this));
      }
      isDisabled() {
        return this.getObserversCount() > 0
          ? !this.isActive()
          : this.options.queryFn === t.skipToken || !this.isFetched();
      }
      isFetched() {
        return this.state.dataUpdateCount + this.state.errorUpdateCount > 0;
      }
      isStatic() {
        return (
          this.getObserversCount() > 0 &&
          this.observers.some(
            (e) => "static" === (0, t.resolveStaleTime)(e.options.staleTime, this),
          )
        );
      }
      isStale() {
        return this.getObserversCount() > 0
          ? this.observers.some((e) => e.getCurrentResult().isStale)
          : void 0 === this.state.data || this.state.isInvalidated;
      }
      isStaleByTime(e = 0) {
        return (
          void 0 === this.state.data ||
          ("static" !== e &&
            (!!this.state.isInvalidated || !(0, t.timeUntilStale)(this.state.dataUpdatedAt, e)))
        );
      }
      onFocus() {
        const e = this.observers.find((e) => e.shouldFetchOnWindowFocus());
        e?.refetch({ cancelRefetch: !1 }), this.#h?.continue();
      }
      onOnline() {
        const e = this.observers.find((e) => e.shouldFetchOnReconnect());
        e?.refetch({ cancelRefetch: !1 }), this.#h?.continue();
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          this.#c.notify({ type: "observerAdded", query: this, observer: e }));
      }
      removeObserver(e) {
        this.observers.includes(e) &&
          ((this.observers = this.observers.filter((t) => t !== e)),
          this.observers.length ||
            (this.#h &&
              (this.#f || this.#y() ? this.#h.cancel({ revert: !0 }) : this.#h.cancelRetry()),
            this.scheduleGc()),
          this.#c.notify({ type: "observerRemoved", query: this, observer: e }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      #y() {
        return "paused" === this.state.fetchStatus && "pending" === this.state.status;
      }
      invalidate() {
        this.state.isInvalidated || this.#p({ type: "invalidate" });
      }
      async fetch(e, r) {
        let n;
        if ("idle" !== this.state.fetchStatus && this.#h?.status() !== "rejected") {
          if (void 0 !== this.state.data && r?.cancelRefetch) this.cancel({ silent: !0 });
          else if (this.#h) return this.#h.continueRetry(), this.#h.promise;
        }
        if ((e && this.setOptions(e), !this.options.queryFn)) {
          const e = this.observers.find((e) => e.options.queryFn);
          e && this.setOptions(e.options);
        }
        const i = new AbortController(),
          s = (e) => {
            Object.defineProperty(e, "signal", {
              enumerable: !0,
              get: () => ((this.#f = !0), i.signal),
            });
          },
          o = () => {
            let e,
              n = (0, t.ensureQueryFn)(this.options, r),
              i = (s((e = { client: this.#l, queryKey: this.queryKey, meta: this.meta })), e);
            return ((this.#f = !1), this.options.persister)
              ? this.options.persister(n, i, this)
              : n(i);
          },
          a =
            (s(
              (n = {
                fetchOptions: r,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#l,
                state: this.state,
                fetchFn: o,
              }),
            ),
            n);
        this.options.behavior?.onFetch(a, this),
          (this.#u = this.state),
          ("idle" === this.state.fetchStatus || this.state.fetchMeta !== a.fetchOptions?.meta) &&
            this.#p({ type: "fetch", meta: a.fetchOptions?.meta }),
          (this.#h = l({
            initialPromise: r?.initialPromise,
            fn: a.fetchFn,
            onCancel: (e) => {
              e instanceof c && e.revert && this.setState({ ...this.#u, fetchStatus: "idle" }),
                i.abort();
            },
            onFail: (e, t) => {
              this.#p({ type: "failed", failureCount: e, error: t });
            },
            onPause: () => {
              this.#p({ type: "pause" });
            },
            onContinue: () => {
              this.#p({ type: "continue" });
            },
            retry: a.options.retry,
            retryDelay: a.options.retryDelay,
            networkMode: a.options.networkMode,
            canRun: () => !0,
          }));
        try {
          const e = await this.#h.start();
          if (void 0 === e) throw Error(`${this.queryHash} data is undefined`);
          return (
            this.setData(e),
            this.#c.config.onSuccess?.(e, this),
            this.#c.config.onSettled?.(e, this.state.error, this),
            e
          );
        } catch (e) {
          if (e instanceof c) {
            if (e.silent) return this.#h.promise;
            else if (e.revert) {
              if (void 0 === this.state.data) throw e;
              return this.state.data;
            }
          }
          throw (
            (this.#p({ type: "error", error: e }),
            this.#c.config.onError?.(e, this),
            this.#c.config.onSettled?.(this.state.data, e, this),
            e)
          );
        } finally {
          this.scheduleGc();
        }
      }
      #p(e) {
        const t = (t) => {
          switch (e.type) {
            case "failed":
              return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
            case "pause":
              return { ...t, fetchStatus: "paused" };
            case "continue":
              return { ...t, fetchStatus: "fetching" };
            case "fetch":
              return { ...t, ...p(t.data, this.options), fetchMeta: e.meta ?? null };
            case "success":
              const r = {
                ...t,
                ...y(e.data, e.dataUpdatedAt),
                dataUpdateCount: t.dataUpdateCount + 1,
                ...(!e.manual && {
                  fetchStatus: "idle",
                  fetchFailureCount: 0,
                  fetchFailureReason: null,
                }),
              };
              return (this.#u = e.manual ? r : void 0), r;
            case "error":
              const n = e.error;
              return {
                ...t,
                error: n,
                errorUpdateCount: t.errorUpdateCount + 1,
                errorUpdatedAt: Date.now(),
                fetchFailureCount: t.fetchFailureCount + 1,
                fetchFailureReason: n,
                fetchStatus: "idle",
                status: "error",
                isInvalidated: !0,
              };
            case "invalidate":
              return { ...t, isInvalidated: !0 };
            case "setState":
              return { ...t, ...e.state };
          }
        };
        (this.state = t(this.state)),
          r.notifyManager.batch(() => {
            this.observers.forEach((e) => {
              e.onQueryUpdate();
            }),
              this.#c.notify({ query: this, type: "updated", action: e });
          });
      }
    };
    function p(e, t) {
      return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: u(t.networkMode) ? "fetching" : "paused",
        ...(void 0 === e && { error: null, status: "pending" }),
      };
    }
    function y(e, t) {
      return {
        data: e,
        dataUpdatedAt: t ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: "success",
      };
    }
    function v(e) {
      const t = "function" == typeof e.initialData ? e.initialData() : e.initialData,
        r = void 0 !== t,
        n = r
          ? "function" == typeof e.initialDataUpdatedAt
            ? e.initialDataUpdatedAt()
            : e.initialDataUpdatedAt
          : 0;
      return {
        data: t,
        dataUpdateCount: 0,
        dataUpdatedAt: r ? (n ?? Date.now()) : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: r ? "success" : "pending",
        fetchStatus: "idle",
      };
    }
    e.s(["Query", 0, f, "fetchState", 0, p], 41136);
    var m = e.i(98937),
      b = e.i(87111),
      g = m.createContext(void 0);
    e.s(
      [
        "QueryClientProvider",
        0,
        ({ client: e, children: t }) => (
          m.useEffect(
            () => (
              e.mount(),
              () => {
                e.unmount();
              }
            ),
            [e],
          ),
          (0, b.jsx)(g.Provider, { value: e, children: t })
        ),
        "useQueryClient",
        0,
        (e) => {
          const t = m.useContext(g);
          if (e) return e;
          if (!t) throw Error("No QueryClient set, use QueryClientProvider to set one");
          return t;
        },
      ],
      73048,
    );
    let S = "http://localhost:3007",
      w = null;
    async function O(e, t = {}) {
      const r = w ? await w() : null,
        n = new Headers(t.headers);
      return (
        r && n.set("Authorization", `Bearer ${r}`),
        n.has("Content-Type") ||
          t.body instanceof FormData ||
          n.set("Content-Type", "application/json"),
        fetch(e, { ...t, headers: n })
      );
    }
    async function T(e) {
      const t = new URLSearchParams();
      e?.status && t.set("status", e.status), e?.limit && t.set("limit", String(e.limit));
      const r = await O(`${S}/api/requests?${t}`);
      if (!r.ok) throw Error("Failed to fetch signature requests");
      return r.json();
    }
    async function j(e) {
      const t = await O(`${S}/api/requests/${e}`);
      if (!t.ok) throw Error("Failed to fetch signature request");
      return t.json();
    }
    async function C(e) {
      const t = await O(`${S}/api/requests/source/${e}`);
      if (!t.ok && 404 !== t.status) throw Error("Failed to get signature status");
      return 404 === t.status ? null : t.json();
    }
    async function E(e, t) {
      const r = await O(`${S}/api/requests/signers`, {
        method: "POST",
        body: JSON.stringify({ requestId: e, email: t }),
      });
      if (!r.ok) throw Error((await r.json().catch(() => ({}))).error || "Failed to add signer");
      return r.json();
    }
    async function F(e) {
      const t = await O(`${S}/api/requests/signers/${e}`, { method: "DELETE" });
      if (!t.ok) throw Error("Failed to remove signer");
      return t.json();
    }
    async function P(e) {
      const t = await O(`${S}/api/requests/signers/${e}/resend`, { method: "POST" });
      if (!t.ok) throw Error("Failed to resend email");
      return t.json();
    }
    async function R(e, t) {
      const r = await O(`${S}/api/requests/${e}`, { method: "PATCH", body: JSON.stringify(t) });
      if (!r.ok) throw Error("Failed to update signature request");
      return r.json();
    }
    async function M() {
      const e = await O(`${S}/api/requests/overdue`);
      if (!e.ok) throw Error("Failed to fetch overdue");
      return e.json();
    }
    e.s(
      [
        "addSignerToRequest",
        0,
        E,
        "fetchOverdueSignatures",
        0,
        M,
        "getSignatureRequest",
        0,
        j,
        "getSignatureStatus",
        0,
        C,
        "listSignatureRequests",
        0,
        T,
        "removeSignerFromRequest",
        0,
        F,
        "resendSignerEmail",
        0,
        P,
        "setTokenGetter",
        0,
        (e) => {
          w = e;
        },
        "updateSignatureRequest",
        0,
        R,
      ],
      52734,
    );
  },
  47411,
  (e, t, r) => {
    var n = e.r(98937),
      i =
        "function" == typeof Object.is
          ? Object.is
          : (e, t) => (e === t && (0 !== e || 1 / e == 1 / t)) || (e != e && t != t),
      s = n.useState,
      o = n.useEffect,
      a = n.useLayoutEffect,
      u = n.useDebugValue;
    function c(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var r = t();
        return !i(e, r);
      } catch (e) {
        return !0;
      }
    }
    var l =
      "u" < typeof window || void 0 === window.document || void 0 === window.document.createElement
        ? (e, t) => t()
        : (e, t) => {
            var r = t(),
              n = s({ inst: { value: r, getSnapshot: t } }),
              i = n[0].inst,
              l = n[1];
            return (
              a(() => {
                (i.value = r), (i.getSnapshot = t), c(i) && l({ inst: i });
              }, [e, r, t]),
              o(
                () => (
                  c(i) && l({ inst: i }),
                  e(() => {
                    c(i) && l({ inst: i });
                  })
                ),
                [e],
              ),
              u(r),
              r
            );
          };
    r.useSyncExternalStore = void 0 !== n.useSyncExternalStore ? n.useSyncExternalStore : l;
  },
  97685,
  (e, t, r) => {
    t.exports = e.r(47411);
  },
]);
