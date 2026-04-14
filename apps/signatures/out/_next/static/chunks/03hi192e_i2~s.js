(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
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
        const i = t.useRef(r);
        return i.current === r && (i.current = e(n)), i;
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
      return i(r)
        ? r(e)
        : ((e, r) => {
            if (!r) return e;
            for (const n in r) {
              const i = r[n];
              switch (n) {
                case "style":
                  e[n] = t(e.style, i);
                  break;
                case "className":
                  e[n] = o(e.className, i);
                  break;
                default:
                  !((e, t) => {
                    const r = e.charCodeAt(0),
                      n = e.charCodeAt(1),
                      i = e.charCodeAt(2);
                    return (
                      111 === r &&
                      110 === n &&
                      i >= 65 &&
                      i <= 90 &&
                      ("function" == typeof t || void 0 === t)
                    );
                  })(n, i)
                    ? (e[n] = i)
                    : (e[n] = ((e, t) =>
                        t
                          ? e
                            ? (r) => {
                                var n;
                                if (null != (n = r) && "object" == typeof n && "nativeEvent" in n) {
                                  a(r);
                                  const n = t(r);
                                  return r.baseUIHandlerPrevented || e?.(r), n;
                                }
                                const i = t(r);
                                return e?.(r), i;
                              }
                            : t
                          : e)(e[n], i));
              }
            }
            return e;
          })(e, r);
    }
    function i(e) {
      return "function" == typeof e;
    }
    function s(e, t) {
      return i(e) ? e(t) : (e ?? r);
    }
    function a(e) {
      return (
        (e.preventBaseUIHandler = () => {
          e.baseUIHandlerPrevented = !0;
        }),
        e
      );
    }
    function o(e, t) {
      return t ? (e ? t + " " + e : t) : e;
    }
    e.s(
      [
        "makeEventPreventable",
        0,
        a,
        "mergeClassNames",
        0,
        o,
        "mergeProps",
        0,
        (e, t, i, a, o) => {
          let u = { ...s(e, r) };
          return t && (u = n(u, t)), i && (u = n(u, i)), a && (u = n(u, a)), o && (u = n(u, o)), u;
        },
        "mergePropsN",
        0,
        (e) => {
          if (0 === e.length) return r;
          if (1 === e.length) return s(e[0], r);
          let t = { ...s(e[0], r) };
          for (let r = 1; r < e.length; r += 1) t = n(t, e[r]);
          return t;
        },
      ],
      88859,
    );
    const u = (e, ...t) => {
      const r = new URL("https://base-ui.com/production-error");
      return (
        r.searchParams.set("code", e.toString()),
        t.forEach((e) => r.searchParams.append("args[]", e)),
        `Base UI error #${e}; visit ${r} for the full message.`
      );
    };
    e.s(["default", 0, u], 12040);
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
    function i(e, t, r, i) {
      var s, u, l, c, d;
      const h = (0, n.useRefWithInit)(a).current;
      return (
        (s = h),
        (u = e),
        (l = t),
        (c = r),
        (d = i),
        (s.refs[0] !== u || s.refs[1] !== l || s.refs[2] !== c || s.refs[3] !== d) &&
          o(h, [e, t, r, i]),
        h.callback
      );
    }
    function s(e) {
      var t, r;
      const i = (0, n.useRefWithInit)(a).current;
      return (
        (t = i),
        (r = e),
        (t.refs.length !== r.length || t.refs.some((e, t) => e !== r[t])) && o(i, e),
        i.callback
      );
    }
    function a() {
      return { callback: null, cleanup: null, refs: [] };
    }
    function o(e, t) {
      if (((e.refs = t), t.every((e) => null == e))) {
        e.callback = null;
        return;
      }
      e.callback = (r) => {
        if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), null != r)) {
          const n = Array(t.length).fill(null);
          for (let e = 0; e < t.length; e += 1) {
            const i = t[e];
            if (null != i)
              switch (typeof i) {
                case "function": {
                  const t = i(r);
                  "function" == typeof t && (n[e] = t);
                  break;
                }
                case "object":
                  i.current = r;
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
    e.s(["useMergedRefs", 0, i, "useMergedRefsN", 0, s], 60435);
    const u = Number.parseInt(r.version, 10);
    function l(e) {
      return u >= e;
    }
    function c(e) {
      if (!r.isValidElement(e)) return null;
      const t = e.props;
      return (l(19) ? t?.ref : e.ref) ?? null;
    }
    e.s(["isReactVersionAtLeast", 0, l], 11578);
    var d = e.i(84645),
      h = e.i(88859);
    Object.freeze([]);
    const f = Object.freeze({});
    e.s(["EMPTY_OBJECT", 0, f, "NOOP", 0, () => {}], 57528);
    const p = Symbol.for("react.lazy");
    e.s(
      [
        "useRenderElement",
        0,
        (e, n, a = {}) => {
          const o = n.render,
            u = ((e, t = {}) => {
              const { className: r, style: n, render: a } = e,
                { state: o = f, ref: u, props: l, stateAttributesMapping: p, enabled: v = !0 } = t,
                b = v ? ("function" == typeof r ? r(o) : r) : void 0,
                g = v ? ("function" == typeof n ? n(o) : n) : void 0,
                m = v
                  ? ((e, t) => {
                      const r = {};
                      for (const n in e) {
                        const i = e[n];
                        if (t?.hasOwnProperty(n)) {
                          const e = t[n](i);
                          null != e && Object.assign(r, e);
                          continue;
                        }
                        !0 === i
                          ? (r[`data-${n.toLowerCase()}`] = "")
                          : i && (r[`data-${n.toLowerCase()}`] = i.toString());
                      }
                      return r;
                    })(o, p)
                  : f,
                y = v
                  ? ((0, d.mergeObjects)(m, Array.isArray(l) ? (0, h.mergePropsN)(l) : l) ?? f)
                  : f;
              return ("u" > typeof document &&
                (v
                  ? Array.isArray(u)
                    ? (y.ref = s([y.ref, c(a), ...u]))
                    : (y.ref = i(y.ref, c(a), u))
                  : i(null, null)),
              v)
                ? (void 0 !== b && (y.className = (0, h.mergeClassNames)(y.className, b)),
                  void 0 !== g && (y.style = (0, d.mergeObjects)(y.style, g)),
                  y)
                : f;
            })(n, a);
          return !1 === a.enabled
            ? null
            : ((e, n, i, s) => {
                if (n) {
                  if ("function" == typeof n) return n(i, s);
                  const e = (0, h.mergeProps)(i, n.props);
                  e.ref = i.ref;
                  let t = n;
                  return t?.$$typeof === p && (t = r.Children.toArray(n)[0]), r.cloneElement(t, e);
                }
                if (e && "string" == typeof e) {
                  var a, o;
                  return (
                    (a = e),
                    (o = i),
                    "button" === a
                      ? (0, r.createElement)("button", { type: "button", ...o, key: o.key })
                      : "img" === a
                        ? (0, r.createElement)("img", { alt: "", ...o, key: o.key })
                        : r.createElement(a, o)
                  );
                }
                throw Error((0, t.default)(8));
              })(e, o, u, a.state ?? f);
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
      (e, t) => (i) => {
        var s;
        if ((null == t ? void 0 : t.variants) == null)
          return n(e, null == i ? void 0 : i.class, null == i ? void 0 : i.className);
        const { variants: a, defaultVariants: o } = t,
          u = Object.keys(a).map((e) => {
            const t = null == i ? void 0 : i[e],
              n = null == o ? void 0 : o[e];
            if (null === t) return null;
            const s = r(t) || r(n);
            return a[e][s];
          }),
          l =
            i &&
            Object.entries(i).reduce((e, t) => {
              const [r, n] = t;
              return void 0 === n || (e[r] = n), e;
            }, {});
        return n(
          e,
          u,
          null == t || null == (s = t.compoundVariants)
            ? void 0
            : s.reduce((e, t) => {
                const { class: r, className: n, ...i } = t;
                return Object.entries(i).every((e) => {
                  const [t, r] = e;
                  return Array.isArray(r) ? r.includes({ ...o, ...l }[t]) : { ...o, ...l }[t] === r;
                })
                  ? [...e, r, n]
                  : e;
              }, []),
          null == i ? void 0 : i.class,
          null == i ? void 0 : i.className,
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
      i = e.i(83049);
    const s = (0, n.cva)(
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
      ({ className: e, variant: n = "default", render: a, ...o }) =>
        (0, r.useRender)({
          defaultTagName: "span",
          props: (0, t.mergeProps)({ className: (0, i.cn)(s({ variant: n }), e) }, o),
          render: a,
          state: { slot: "badge", variant: n },
        }),
    ]);
  },
  67406,
  40930,
  (e) => {
    let t;
    var r = e.i(34517),
      n = e.i(93771),
      i = e.i(94720),
      s = e.i(41136),
      a = e.i(41357),
      o = e.i(16621),
      u = e.i(37519),
      l = e.i(8081),
      c = class extends a.Subscribable {
        constructor(e, t) {
          super(),
            (this.options = t),
            (this.#e = e),
            (this.#t = null),
            (this.#r = (0, o.pendingThenable)()),
            this.bindMethods(),
            this.setOptions(t);
        }
        #e;
        #n = void 0;
        #i = void 0;
        #s = void 0;
        #a;
        #o;
        #r;
        #t;
        #u;
        #l;
        #c;
        #d;
        #h;
        #f;
        #p = new Set();
        bindMethods() {
          this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
          1 === this.listeners.size &&
            (this.#n.addObserver(this),
            d(this.#n, this.options) ? this.#v() : this.updateResult(),
            this.#b());
        }
        onUnsubscribe() {
          this.hasListeners() || this.destroy();
        }
        shouldFetchOnReconnect() {
          return h(this.#n, this.options, this.options.refetchOnReconnect);
        }
        shouldFetchOnWindowFocus() {
          return h(this.#n, this.options, this.options.refetchOnWindowFocus);
        }
        destroy() {
          (this.listeners = new Set()), this.#g(), this.#m(), this.#n.removeObserver(this);
        }
        setOptions(e) {
          const t = this.options,
            r = this.#n;
          if (
            ((this.options = this.#e.defaultQueryOptions(e)),
            void 0 !== this.options.enabled &&
              "boolean" != typeof this.options.enabled &&
              "function" != typeof this.options.enabled &&
              "boolean" != typeof (0, u.resolveEnabled)(this.options.enabled, this.#n))
          )
            throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
          this.#y(),
            this.#n.setOptions(this.options),
            t._defaulted &&
              !(0, u.shallowEqualObjects)(this.options, t) &&
              this.#e
                .getQueryCache()
                .notify({ type: "observerOptionsUpdated", query: this.#n, observer: this });
          const n = this.hasListeners();
          n && f(this.#n, r, this.options, t) && this.#v(),
            this.updateResult(),
            n &&
              (this.#n !== r ||
                (0, u.resolveEnabled)(this.options.enabled, this.#n) !==
                  (0, u.resolveEnabled)(t.enabled, this.#n) ||
                (0, u.resolveStaleTime)(this.options.staleTime, this.#n) !==
                  (0, u.resolveStaleTime)(t.staleTime, this.#n)) &&
              this.#R();
          const i = this.#x();
          n &&
            (this.#n !== r ||
              (0, u.resolveEnabled)(this.options.enabled, this.#n) !==
                (0, u.resolveEnabled)(t.enabled, this.#n) ||
              i !== this.#f) &&
            this.#E(i);
        }
        getOptimisticResult(e) {
          var t, r;
          const n = this.#e.getQueryCache().build(this.#e, e),
            i = this.createResult(n, e);
          return (
            (t = this),
            (r = i),
            (0, u.shallowEqualObjects)(t.getCurrentResult(), r) ||
              ((this.#s = i), (this.#o = this.options), (this.#a = this.#n.state)),
            i
          );
        }
        getCurrentResult() {
          return this.#s;
        }
        trackResult(e, t) {
          return new Proxy(e, {
            get: (e, r) => (
              this.trackProp(r),
              t?.(r),
              "promise" === r &&
                (this.trackProp("data"),
                this.options.experimental_prefetchInRender ||
                  "pending" !== this.#r.status ||
                  this.#r.reject(
                    Error("experimental_prefetchInRender feature flag is not enabled"),
                  )),
              Reflect.get(e, r)
            ),
          });
        }
        trackProp(e) {
          this.#p.add(e);
        }
        getCurrentQuery() {
          return this.#n;
        }
        refetch({ ...e } = {}) {
          return this.fetch({ ...e });
        }
        fetchOptimistic(e) {
          const t = this.#e.defaultQueryOptions(e),
            r = this.#e.getQueryCache().build(this.#e, t);
          return r.fetch().then(() => this.createResult(r, t));
        }
        fetch(e) {
          return this.#v({ ...e, cancelRefetch: e.cancelRefetch ?? !0 }).then(
            () => (this.updateResult(), this.#s),
          );
        }
        #v(e) {
          this.#y();
          let t = this.#n.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(u.noop)), t;
        }
        #R() {
          this.#g();
          const e = (0, u.resolveStaleTime)(this.options.staleTime, this.#n);
          if (n.environmentManager.isServer() || this.#s.isStale || !(0, u.isValidTimeout)(e))
            return;
          const t = (0, u.timeUntilStale)(this.#s.dataUpdatedAt, e);
          this.#d = l.timeoutManager.setTimeout(() => {
            this.#s.isStale || this.updateResult();
          }, t + 1);
        }
        #x() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#n)
              : this.options.refetchInterval) ?? !1
          );
        }
        #E(e) {
          this.#m(),
            (this.#f = e),
            !n.environmentManager.isServer() &&
              !1 !== (0, u.resolveEnabled)(this.options.enabled, this.#n) &&
              (0, u.isValidTimeout)(this.#f) &&
              0 !== this.#f &&
              (this.#h = l.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || r.focusManager.isFocused()) &&
                  this.#v();
              }, this.#f));
        }
        #b() {
          this.#R(), this.#E(this.#x());
        }
        #g() {
          this.#d && (l.timeoutManager.clearTimeout(this.#d), (this.#d = void 0));
        }
        #m() {
          this.#h && (l.timeoutManager.clearInterval(this.#h), (this.#h = void 0));
        }
        createResult(e, t) {
          let r,
            n = this.#n,
            i = this.options,
            a = this.#s,
            l = this.#a,
            c = this.#o,
            h = e !== n ? e.state : this.#i,
            { state: v } = e,
            b = { ...v },
            g = !1;
          if (t._optimisticResults) {
            const r = this.hasListeners(),
              a = !r && d(e, t),
              o = r && f(e, n, t, i);
            (a || o) && (b = { ...b, ...(0, s.fetchState)(v.data, e.options) }),
              "isRestoring" === t._optimisticResults && (b.fetchStatus = "idle");
          }
          let { error: m, errorUpdatedAt: y, status: R } = b;
          r = b.data;
          let x = !1;
          if (void 0 !== t.placeholderData && void 0 === r && "pending" === R) {
            let e;
            a?.isPlaceholderData && t.placeholderData === c?.placeholderData
              ? ((e = a.data), (x = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#c?.state.data, this.#c)
                    : t.placeholderData),
              void 0 !== e && ((R = "success"), (r = (0, u.replaceData)(a?.data, e, t)), (g = !0));
          }
          if (t.select && void 0 !== r && !x)
            if (a && r === l?.data && t.select === this.#u) r = this.#l;
            else
              try {
                (this.#u = t.select),
                  (r = t.select(r)),
                  (r = (0, u.replaceData)(a?.data, r, t)),
                  (this.#l = r),
                  (this.#t = null);
              } catch (e) {
                this.#t = e;
              }
          this.#t && ((m = this.#t), (r = this.#l), (y = Date.now()), (R = "error"));
          const E = "fetching" === b.fetchStatus,
            k = "pending" === R,
            w = "error" === R,
            T = k && E,
            I = void 0 !== r,
            O = {
              status: R,
              fetchStatus: b.fetchStatus,
              isPending: k,
              isSuccess: "success" === R,
              isError: w,
              isInitialLoading: T,
              isLoading: T,
              data: r,
              dataUpdatedAt: b.dataUpdatedAt,
              error: m,
              errorUpdatedAt: y,
              failureCount: b.fetchFailureCount,
              failureReason: b.fetchFailureReason,
              errorUpdateCount: b.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                b.dataUpdateCount > h.dataUpdateCount || b.errorUpdateCount > h.errorUpdateCount,
              isFetching: E,
              isRefetching: E && !k,
              isLoadingError: w && !I,
              isPaused: "paused" === b.fetchStatus,
              isPlaceholderData: g,
              isRefetchError: w && I,
              isStale: p(e, t),
              refetch: this.refetch,
              promise: this.#r,
              isEnabled: !1 !== (0, u.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== O.data,
              r = "error" === O.status && !t,
              i = (e) => {
                r ? e.reject(O.error) : t && e.resolve(O.data);
              },
              s = () => {
                i((this.#r = O.promise = (0, o.pendingThenable)()));
              },
              a = this.#r;
            switch (a.status) {
              case "pending":
                e.queryHash === n.queryHash && i(a);
                break;
              case "fulfilled":
                (r || O.data !== a.value) && s();
                break;
              case "rejected":
                (r && O.error === a.reason) || s();
            }
          }
          return O;
        }
        updateResult() {
          const e = this.#s,
            t = this.createResult(this.#n, this.options);
          if (
            ((this.#a = this.#n.state),
            (this.#o = this.options),
            void 0 !== this.#a.data && (this.#c = this.#n),
            (0, u.shallowEqualObjects)(t, e))
          )
            return;
          this.#s = t;
          const r = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: t } = this.options,
              r = "function" == typeof t ? t() : t;
            if ("all" === r || (!r && !this.#p.size)) return !0;
            const n = new Set(r ?? this.#p);
            return (
              this.options.throwOnError && n.add("error"),
              Object.keys(this.#s).some((t) => this.#s[t] !== e[t] && n.has(t))
            );
          };
          this.#k({ listeners: r() });
        }
        #y() {
          const e = this.#e.getQueryCache().build(this.#e, this.options);
          if (e === this.#n) return;
          const t = this.#n;
          (this.#n = e),
            (this.#i = e.state),
            this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
        }
        onQueryUpdate() {
          this.updateResult(), this.hasListeners() && this.#b();
        }
        #k(e) {
          i.notifyManager.batch(() => {
            e.listeners &&
              this.listeners.forEach((e) => {
                e(this.#s);
              }),
              this.#e.getQueryCache().notify({ query: this.#n, type: "observerResultsUpdated" });
          });
        }
      };
    function d(e, t) {
      return (
        (!1 !== (0, u.resolveEnabled)(t.enabled, e) &&
          void 0 === e.state.data &&
          ("error" !== e.state.status || !1 !== t.retryOnMount)) ||
        (void 0 !== e.state.data && h(e, t, t.refetchOnMount))
      );
    }
    function h(e, t, r) {
      if (
        !1 !== (0, u.resolveEnabled)(t.enabled, e) &&
        "static" !== (0, u.resolveStaleTime)(t.staleTime, e)
      ) {
        const n = "function" == typeof r ? r(e) : r;
        return "always" === n || (!1 !== n && p(e, t));
      }
      return !1;
    }
    function f(e, t, r, n) {
      return (
        (e !== t || !1 === (0, u.resolveEnabled)(n.enabled, e)) &&
        (!r.suspense || "error" !== e.state.status) &&
        p(e, r)
      );
    }
    function p(e, t) {
      return (
        !1 !== (0, u.resolveEnabled)(t.enabled, e) &&
        e.isStaleByTime((0, u.resolveStaleTime)(t.staleTime, e))
      );
    }
    e.i(67836);
    var v = e.i(98937),
      b = e.i(73048);
    e.i(87111);
    var g = v.createContext(
        ((t = !1),
        {
          clearReset: () => {
            t = !1;
          },
          reset: () => {
            t = !0;
          },
          isReset: () => t,
        }),
      ),
      m = v.createContext(!1);
    m.Provider;
    var y = (e, t, r) =>
      t.fetchOptimistic(e).catch(() => {
        r.clearReset();
      });
    e.s(
      [
        "useQuery",
        0,
        (e, t) =>
          ((e, t, r) => {
            let s,
              a = v.useContext(m),
              o = v.useContext(g),
              l = (0, b.useQueryClient)(r),
              c = l.defaultQueryOptions(e);
            l.getDefaultOptions().queries?._experimental_beforeQuery?.(c);
            const d = l.getQueryCache().get(c.queryHash);
            if (((c._optimisticResults = a ? "isRestoring" : "optimistic"), c.suspense)) {
              const e = (e) => ("static" === e ? e : Math.max(e ?? 1e3, 1e3)),
                t = c.staleTime;
              (c.staleTime = "function" == typeof t ? (...r) => e(t(...r)) : e(t)),
                "number" == typeof c.gcTime && (c.gcTime = Math.max(c.gcTime, 1e3));
            }
            (s =
              d?.state.error && "function" == typeof c.throwOnError
                ? (0, u.shouldThrowError)(c.throwOnError, [d.state.error, d])
                : c.throwOnError),
              (c.suspense || c.experimental_prefetchInRender || s) &&
                !o.isReset() &&
                (c.retryOnMount = !1),
              v.useEffect(() => {
                o.clearReset();
              }, [o]);
            const h = !l.getQueryCache().get(c.queryHash),
              [f] = v.useState(() => new t(l, c)),
              p = f.getOptimisticResult(c),
              R = !a && !1 !== e.subscribed;
            if (
              (v.useSyncExternalStore(
                v.useCallback(
                  (e) => {
                    const t = R ? f.subscribe(i.notifyManager.batchCalls(e)) : u.noop;
                    return f.updateResult(), t;
                  },
                  [f, R],
                ),
                () => f.getCurrentResult(),
                () => f.getCurrentResult(),
              ),
              v.useEffect(() => {
                f.setOptions(c);
              }, [c, f]),
              c?.suspense && p.isPending)
            )
              throw y(c, f, o);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: r, query: n, suspense: i }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                n &&
                ((i && void 0 === e.data) || (0, u.shouldThrowError)(r, [e.error, n])))({
                result: p,
                errorResetBoundary: o,
                throwOnError: c.throwOnError,
                query: d,
                suspense: c.suspense,
              })
            )
              throw p.error;
            if (
              (l.getDefaultOptions().queries?._experimental_afterQuery?.(c, p),
              c.experimental_prefetchInRender &&
                !n.environmentManager.isServer() &&
                p.isLoading &&
                p.isFetching &&
                !a)
            ) {
              const e = h ? y(c, f, o) : d?.promise;
              e?.catch(u.noop).finally(() => {
                f.updateResult();
              });
            }
            return c.notifyOnChangeProps ? p : f.trackResult(p);
          })(e, c, t),
      ],
      67406,
    );
    const R = (0, e.i(1130).default)("chevron-right", [
      ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
    ]);
    e.s(["default", 0, R], 40930);
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
    function i() {
      return "u" > typeof window;
    }
    function s(e) {
      return u(e) ? (e.nodeName || "").toLowerCase() : "#document";
    }
    function a(e) {
      var t;
      return (null == e || null == (t = e.ownerDocument) ? void 0 : t.defaultView) || window;
    }
    function o(e) {
      var t;
      return null == (t = (u(e) ? e.ownerDocument : e.document) || window.document)
        ? void 0
        : t.documentElement;
    }
    function u(e) {
      return !!i() && (e instanceof Node || e instanceof a(e).Node);
    }
    function l(e) {
      return !!i() && (e instanceof Element || e instanceof a(e).Element);
    }
    function c(e) {
      return !!i() && (e instanceof HTMLElement || e instanceof a(e).HTMLElement);
    }
    function d(e) {
      return (
        !(!i() || "u" < typeof ShadowRoot) &&
        (e instanceof ShadowRoot || e instanceof a(e).ShadowRoot)
      );
    }
    function h(e) {
      const { overflow: t, overflowX: r, overflowY: n, display: i } = R(e);
      return (
        /auto|scroll|overlay|hidden|clip/.test(t + n + r) && "inline" !== i && "contents" !== i
      );
    }
    function f(e) {
      try {
        if (e.matches(":popover-open")) return !0;
      } catch (e) {}
      try {
        return e.matches(":modal");
      } catch (e) {
        return !1;
      }
    }
    const p = /transform|translate|scale|rotate|perspective|filter/,
      v = /paint|layout|strict|content/,
      b = (e) => !!e && "none" !== e;
    function g(e) {
      const t = l(e) ? R(e) : e;
      return (
        b(t.transform) ||
        b(t.translate) ||
        b(t.scale) ||
        b(t.rotate) ||
        b(t.perspective) ||
        (!m() && (b(t.backdropFilter) || b(t.filter))) ||
        p.test(t.willChange || "") ||
        v.test(t.contain || "")
      );
    }
    function m() {
      return (
        null == t &&
          (t = "u" > typeof CSS && CSS.supports && CSS.supports("-webkit-backdrop-filter", "none")),
        t
      );
    }
    function y(e) {
      return /^(html|body|#document)$/.test(s(e));
    }
    function R(e) {
      return a(e).getComputedStyle(e);
    }
    function x(e) {
      if ("html" === s(e)) return e;
      const t = e.assignedSlot || e.parentNode || (d(e) && e.host) || o(e);
      return d(t) ? t.host : t;
    }
    function E(e) {
      return e.parent && Object.getPrototypeOf(e.parent) ? e.frameElement : null;
    }
    e.s(
      [
        "getComputedStyle",
        0,
        R,
        "getContainingBlock",
        0,
        (e) => {
          let t = x(e);
          while (c(t) && !y(t)) {
            if (g(t)) return t;
            if (f(t)) break;
            t = x(t);
          }
          return null;
        },
        "getDocumentElement",
        0,
        o,
        "getFrameElement",
        0,
        E,
        "getNodeName",
        0,
        s,
        "getNodeScroll",
        0,
        (e) =>
          l(e)
            ? { scrollLeft: e.scrollLeft, scrollTop: e.scrollTop }
            : { scrollLeft: e.scrollX, scrollTop: e.scrollY },
        "getOverflowAncestors",
        0,
        function e(t, r, n) {
          var i;
          void 0 === r && (r = []), void 0 === n && (n = !0);
          const s = (function e(t) {
              const r = x(t);
              return y(r)
                ? t.ownerDocument
                  ? t.ownerDocument.body
                  : t.body
                : c(r) && h(r)
                  ? r
                  : e(r);
            })(t),
            o = s === (null == (i = t.ownerDocument) ? void 0 : i.body),
            u = a(s);
          if (!o) return r.concat(s, e(s, [], n));
          {
            const t = E(u);
            return r.concat(u, u.visualViewport || [], h(s) ? s : [], t && n ? e(t) : []);
          }
        },
        "getParentNode",
        0,
        x,
        "getWindow",
        0,
        a,
        "isContainingBlock",
        0,
        g,
        "isElement",
        0,
        l,
        "isHTMLElement",
        0,
        c,
        "isLastTraversableNode",
        0,
        y,
        "isNode",
        0,
        u,
        "isOverflowElement",
        0,
        h,
        "isShadowRoot",
        0,
        d,
        "isTableElement",
        0,
        (e) => /^(table|td|th)$/.test(s(e)),
        "isTopLayer",
        0,
        f,
        "isWebKit",
        0,
        m,
      ],
      80898,
    );
    var k = e.i(95840);
    const w = n[`useInsertionEffect${Math.random().toFixed(1)}`.slice(0, -3)],
      T = w && w !== n.useLayoutEffect ? w : (e) => e();
    function I(e) {
      const t = (0, k.useRefWithInit)(O).current;
      return (t.next = e), T(t.effect), t.trampoline;
    }
    function O() {
      const e = {
        next: void 0,
        callback: S,
        trampoline: (...t) => e.callback?.(...t),
        effect: () => {
          e.callback = e.next;
        },
      };
      return e;
    }
    function S() {}
    e.s(["useStableCallback", 0, I], 79572);
    const Q = "u" > typeof document ? n.useLayoutEffect : () => {};
    e.s(["useIsoLayoutEffect", 0, Q], 47639);
    var C = e.i(88859),
      D = e.i(12040);
    const P = n.createContext(void 0);
    function N(e = {}) {
      const {
          disabled: t = !1,
          focusableWhenDisabled: r,
          tabIndex: i = 0,
          native: s = !0,
          composite: a,
        } = e,
        o = n.useRef(null),
        u = ((e = !1) => {
          const t = n.useContext(P);
          if (void 0 === t && !e) throw Error((0, D.default)(16));
          return t;
        })(!0),
        l = a ?? void 0 !== u,
        { props: c } = ((e) => {
          const {
              focusableWhenDisabled: t,
              disabled: r,
              composite: i = !1,
              tabIndex: s = 0,
              isNativeButton: a,
            } = e,
            o = i && !1 !== t,
            u = i && !1 === t;
          return {
            props: n.useMemo(() => {
              const e = {
                onKeyDown(e) {
                  r && t && "Tab" !== e.key && e.preventDefault();
                },
              };
              return (
                i || ((e.tabIndex = s), !a && r && (e.tabIndex = t ? s : -1)),
                ((a && (t || o)) || (!a && r)) && (e["aria-disabled"] = r),
                a && (!t || u) && (e.disabled = r),
                e
              );
            }, [i, r, t, o, u, a, s]),
          };
        })({ focusableWhenDisabled: r, disabled: t, composite: l, tabIndex: i, isNativeButton: s }),
        d = n.useCallback(() => {
          const e = o.current;
          M(e) && l && t && void 0 === c.disabled && e.disabled && (e.disabled = !1);
        }, [t, c.disabled, l]);
      return (
        Q(d, [d]),
        {
          getButtonProps: n.useCallback(
            (e = {}) => {
              const {
                  onClick: r,
                  onMouseDown: n,
                  onKeyUp: i,
                  onKeyDown: a,
                  onPointerDown: o,
                  ...u
                } = e,
                d = s ? "button" : void 0;
              return (0, C.mergeProps)(
                {
                  type: d,
                  onClick(e) {
                    t ? e.preventDefault() : r?.(e);
                  },
                  onMouseDown(e) {
                    t || n?.(e);
                  },
                  onKeyDown(e) {
                    var n;
                    if (t || ((0, C.makeEventPreventable)(e), a?.(e), e.baseUIHandlerPrevented))
                      return;
                    const i = e.target === e.currentTarget,
                      o = e.currentTarget,
                      u = M(o),
                      c = !s && ((n = o), !!(n?.tagName === "A" && n?.href)),
                      d = i && (s ? u : !c),
                      h = "Enter" === e.key,
                      f = " " === e.key,
                      p = o.getAttribute("role"),
                      v = p?.startsWith("menuitem") || "option" === p || "gridcell" === p;
                    if (i && l && f) {
                      if (e.defaultPrevented && v) return;
                      e.preventDefault(),
                        c || (s && u)
                          ? (o.click(), e.preventBaseUIHandler())
                          : d && (r?.(e), e.preventBaseUIHandler());
                      return;
                    }
                    d && (!s && (f || h) && e.preventDefault(), !s && h && r?.(e));
                  },
                  onKeyUp(e) {
                    t ||
                      (((0, C.makeEventPreventable)(e),
                      i?.(e),
                      e.target === e.currentTarget && s && l && M(e.currentTarget) && " " === e.key)
                        ? e.preventDefault()
                        : !e.baseUIHandlerPrevented &&
                          (e.target !== e.currentTarget || s || l || " " !== e.key || r?.(e)));
                  },
                  onPointerDown(e) {
                    t ? e.preventDefault() : o?.(e);
                  },
                },
                s ? void 0 : { role: "button" },
                c,
                u,
              );
            },
            [t, c, l, s],
          ),
          buttonRef: I((e) => {
            (o.current = e), d();
          }),
        }
      );
    }
    function M(e) {
      return c(e) && "BUTTON" === e.tagName;
    }
    e.s(["useButton", 0, N], 93500);
    var U = e.i(93413);
    const L = n.forwardRef((e, t) => {
      const {
          render: r,
          className: n,
          disabled: i = !1,
          focusableWhenDisabled: s = !1,
          nativeButton: a = !0,
          ...o
        } = e,
        { getButtonProps: u, buttonRef: l } = N({
          disabled: i,
          focusableWhenDisabled: s,
          native: a,
        });
      return (0, U.useRenderElement)("button", e, {
        state: { disabled: i },
        ref: [t, l],
        props: [o, u],
      });
    });
    var j = e.i(5583),
      F = e.i(83049);
    const _ = (0, j.cva)(
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
        ({ className: e, variant: t = "default", size: n = "default", ...i }) =>
          (0, r.jsx)(L, {
            "data-slot": "button",
            className: (0, F.cn)(_({ variant: t, size: n, className: e })),
            ...i,
          }),
        "buttonVariants",
        0,
        _,
      ],
      38288,
    );
  },
]);
