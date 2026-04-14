(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  27433,
  (e) => {
    const t = (0, e.i(1130).default)("loader-circle", [
      ["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }],
    ]);
    e.s(["Loader2", 0, t], 27433);
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
    function s(e, r) {
      return i(r)
        ? r(e)
        : ((e, r) => {
            if (!r) return e;
            for (const s in r) {
              const i = r[s];
              switch (s) {
                case "style":
                  e[s] = t(e.style, i);
                  break;
                case "className":
                  e[s] = l(e.className, i);
                  break;
                default:
                  !((e, t) => {
                    const r = e.charCodeAt(0),
                      s = e.charCodeAt(1),
                      i = e.charCodeAt(2);
                    return (
                      111 === r &&
                      110 === s &&
                      i >= 65 &&
                      i <= 90 &&
                      ("function" == typeof t || void 0 === t)
                    );
                  })(s, i)
                    ? (e[s] = i)
                    : (e[s] = ((e, t) =>
                        t
                          ? e
                            ? (r) => {
                                var s;
                                if (null != (s = r) && "object" == typeof s && "nativeEvent" in s) {
                                  a(r);
                                  const s = t(r);
                                  return r.baseUIHandlerPrevented || e?.(r), s;
                                }
                                const i = t(r);
                                return e?.(r), i;
                              }
                            : t
                          : e)(e[s], i));
              }
            }
            return e;
          })(e, r);
    }
    function i(e) {
      return "function" == typeof e;
    }
    function n(e, t) {
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
    function l(e, t) {
      return t ? (e ? t + " " + e : t) : e;
    }
    e.s(
      [
        "makeEventPreventable",
        0,
        a,
        "mergeClassNames",
        0,
        l,
        "mergeProps",
        0,
        (e, t, i, a, l) => {
          let u = { ...n(e, r) };
          return t && (u = s(u, t)), i && (u = s(u, i)), a && (u = s(u, a)), l && (u = s(u, l)), u;
        },
        "mergePropsN",
        0,
        (e) => {
          if (0 === e.length) return r;
          if (1 === e.length) return n(e[0], r);
          let t = { ...n(e[0], r) };
          for (let r = 1; r < e.length; r += 1) t = s(t, e[r]);
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
  95840,
  (e) => {
    var t = e.i(98937);
    const r = {};
    e.s([
      "useRefWithInit",
      0,
      (e, s) => {
        const i = t.useRef(r);
        return i.current === r && (i.current = e(s)), i;
      },
    ]);
  },
  93413,
  60435,
  11578,
  57528,
  (e) => {
    e.i(67836);
    var t = e.i(12040),
      r = e.i(98937),
      s = e.i(95840);
    function i(e, t, r, i) {
      var n, u, o, c, h;
      const d = (0, s.useRefWithInit)(a).current;
      return (
        (n = d),
        (u = e),
        (o = t),
        (c = r),
        (h = i),
        (n.refs[0] !== u || n.refs[1] !== o || n.refs[2] !== c || n.refs[3] !== h) &&
          l(d, [e, t, r, i]),
        d.callback
      );
    }
    function n(e) {
      var t, r;
      const i = (0, s.useRefWithInit)(a).current;
      return (
        (t = i),
        (r = e),
        (t.refs.length !== r.length || t.refs.some((e, t) => e !== r[t])) && l(i, e),
        i.callback
      );
    }
    function a() {
      return { callback: null, cleanup: null, refs: [] };
    }
    function l(e, t) {
      if (((e.refs = t), t.every((e) => null == e))) {
        e.callback = null;
        return;
      }
      e.callback = (r) => {
        if ((e.cleanup && (e.cleanup(), (e.cleanup = null)), null != r)) {
          const s = Array(t.length).fill(null);
          for (let e = 0; e < t.length; e += 1) {
            const i = t[e];
            if (null != i)
              switch (typeof i) {
                case "function": {
                  const t = i(r);
                  "function" == typeof t && (s[e] = t);
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
                    const t = s[e];
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
    e.s(["useMergedRefs", 0, i, "useMergedRefsN", 0, n], 60435);
    const u = Number.parseInt(r.version, 10);
    function o(e) {
      return u >= e;
    }
    function c(e) {
      if (!r.isValidElement(e)) return null;
      const t = e.props;
      return (o(19) ? t?.ref : e.ref) ?? null;
    }
    e.s(["isReactVersionAtLeast", 0, o], 11578);
    var h = e.i(84645),
      d = e.i(88859);
    Object.freeze([]);
    const f = Object.freeze({});
    e.s(["EMPTY_OBJECT", 0, f, "NOOP", 0, () => {}], 57528);
    const p = Symbol.for("react.lazy");
    e.s(
      [
        "useRenderElement",
        0,
        (e, s, a = {}) => {
          const l = s.render,
            u = ((e, t = {}) => {
              const { className: r, style: s, render: a } = e,
                { state: l = f, ref: u, props: o, stateAttributesMapping: p, enabled: m = !0 } = t,
                y = m ? ("function" == typeof r ? r(l) : r) : void 0,
                v = m ? ("function" == typeof s ? s(l) : s) : void 0,
                b = m
                  ? ((e, t) => {
                      const r = {};
                      for (const s in e) {
                        const i = e[s];
                        if (t?.hasOwnProperty(s)) {
                          const e = t[s](i);
                          null != e && Object.assign(r, e);
                          continue;
                        }
                        !0 === i
                          ? (r[`data-${s.toLowerCase()}`] = "")
                          : i && (r[`data-${s.toLowerCase()}`] = i.toString());
                      }
                      return r;
                    })(l, p)
                  : f,
                g = m
                  ? ((0, h.mergeObjects)(b, Array.isArray(o) ? (0, d.mergePropsN)(o) : o) ?? f)
                  : f;
              return ("u" > typeof document &&
                (m
                  ? Array.isArray(u)
                    ? (g.ref = n([g.ref, c(a), ...u]))
                    : (g.ref = i(g.ref, c(a), u))
                  : i(null, null)),
              m)
                ? (void 0 !== y && (g.className = (0, d.mergeClassNames)(g.className, y)),
                  void 0 !== v && (g.style = (0, h.mergeObjects)(g.style, v)),
                  g)
                : f;
            })(s, a);
          return !1 === a.enabled
            ? null
            : ((e, s, i, n) => {
                if (s) {
                  if ("function" == typeof s) return s(i, n);
                  const e = (0, d.mergeProps)(i, s.props);
                  e.ref = i.ref;
                  let t = s;
                  return t?.$$typeof === p && (t = r.Children.toArray(s)[0]), r.cloneElement(t, e);
                }
                if (e && "string" == typeof e) {
                  var a, l;
                  return (
                    (a = e),
                    (l = i),
                    "button" === a
                      ? (0, r.createElement)("button", { type: "button", ...l, key: l.key })
                      : "img" === a
                        ? (0, r.createElement)("img", { alt: "", ...l, key: l.key })
                        : r.createElement(a, l)
                  );
                }
                throw Error((0, t.default)(8));
              })(e, l, u, a.state ?? f);
        },
      ],
      93413,
    );
  },
  38874,
  (e) => {
    var t = e.i(93413);
    e.s(["useRender", 0, (e) => (0, t.useRenderElement)(e.defaultTagName ?? "div", e, e)]);
  },
  5583,
  (e) => {
    var t = e.i(31373);
    const r = (e) => ("boolean" == typeof e ? `${e}` : 0 === e ? "0" : e),
      s = t.clsx;
    e.s([
      "cva",
      0,
      (e, t) => (i) => {
        var n;
        if ((null == t ? void 0 : t.variants) == null)
          return s(e, null == i ? void 0 : i.class, null == i ? void 0 : i.className);
        const { variants: a, defaultVariants: l } = t,
          u = Object.keys(a).map((e) => {
            const t = null == i ? void 0 : i[e],
              s = null == l ? void 0 : l[e];
            if (null === t) return null;
            const n = r(t) || r(s);
            return a[e][n];
          }),
          o =
            i &&
            Object.entries(i).reduce((e, t) => {
              const [r, s] = t;
              return void 0 === s || (e[r] = s), e;
            }, {});
        return s(
          e,
          u,
          null == t || null == (n = t.compoundVariants)
            ? void 0
            : n.reduce((e, t) => {
                const { class: r, className: s, ...i } = t;
                return Object.entries(i).every((e) => {
                  const [t, r] = e;
                  return Array.isArray(r) ? r.includes({ ...l, ...o }[t]) : { ...l, ...o }[t] === r;
                })
                  ? [...e, r, s]
                  : e;
              }, []),
          null == i ? void 0 : i.class,
          null == i ? void 0 : i.className,
        );
      },
    ]);
  },
  90595,
  (e) => {
    var t = e.i(88859),
      r = e.i(38874),
      s = e.i(5583),
      i = e.i(83049);
    const n = (0, s.cva)(
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
      ({ className: e, variant: s = "default", render: a, ...l }) =>
        (0, r.useRender)({
          defaultTagName: "span",
          props: (0, t.mergeProps)({ className: (0, i.cn)(n({ variant: s }), e) }, l),
          render: a,
          state: { slot: "badge", variant: s },
        }),
    ]);
  },
  67406,
  40930,
  (e) => {
    let t;
    var r = e.i(34517),
      s = e.i(93771),
      i = e.i(94720),
      n = e.i(41136),
      a = e.i(41357),
      l = e.i(16621),
      u = e.i(37519),
      o = e.i(8081),
      c = class extends a.Subscribable {
        constructor(e, t) {
          super(),
            (this.options = t),
            (this.#e = e),
            (this.#t = null),
            (this.#r = (0, l.pendingThenable)()),
            this.bindMethods(),
            this.setOptions(t);
        }
        #e;
        #s = void 0;
        #i = void 0;
        #n = void 0;
        #a;
        #l;
        #r;
        #t;
        #u;
        #o;
        #c;
        #h;
        #d;
        #f;
        #p = new Set();
        bindMethods() {
          this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
          1 === this.listeners.size &&
            (this.#s.addObserver(this),
            h(this.#s, this.options) ? this.#m() : this.updateResult(),
            this.#y());
        }
        onUnsubscribe() {
          this.hasListeners() || this.destroy();
        }
        shouldFetchOnReconnect() {
          return d(this.#s, this.options, this.options.refetchOnReconnect);
        }
        shouldFetchOnWindowFocus() {
          return d(this.#s, this.options, this.options.refetchOnWindowFocus);
        }
        destroy() {
          (this.listeners = new Set()), this.#v(), this.#b(), this.#s.removeObserver(this);
        }
        setOptions(e) {
          const t = this.options,
            r = this.#s;
          if (
            ((this.options = this.#e.defaultQueryOptions(e)),
            void 0 !== this.options.enabled &&
              "boolean" != typeof this.options.enabled &&
              "function" != typeof this.options.enabled &&
              "boolean" != typeof (0, u.resolveEnabled)(this.options.enabled, this.#s))
          )
            throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
          this.#g(),
            this.#s.setOptions(this.options),
            t._defaulted &&
              !(0, u.shallowEqualObjects)(this.options, t) &&
              this.#e
                .getQueryCache()
                .notify({ type: "observerOptionsUpdated", query: this.#s, observer: this });
          const s = this.hasListeners();
          s && f(this.#s, r, this.options, t) && this.#m(),
            this.updateResult(),
            s &&
              (this.#s !== r ||
                (0, u.resolveEnabled)(this.options.enabled, this.#s) !==
                  (0, u.resolveEnabled)(t.enabled, this.#s) ||
                (0, u.resolveStaleTime)(this.options.staleTime, this.#s) !==
                  (0, u.resolveStaleTime)(t.staleTime, this.#s)) &&
              this.#x();
          const i = this.#R();
          s &&
            (this.#s !== r ||
              (0, u.resolveEnabled)(this.options.enabled, this.#s) !==
                (0, u.resolveEnabled)(t.enabled, this.#s) ||
              i !== this.#f) &&
            this.#Q(i);
        }
        getOptimisticResult(e) {
          var t, r;
          const s = this.#e.getQueryCache().build(this.#e, e),
            i = this.createResult(s, e);
          return (
            (t = this),
            (r = i),
            (0, u.shallowEqualObjects)(t.getCurrentResult(), r) ||
              ((this.#n = i), (this.#l = this.options), (this.#a = this.#s.state)),
            i
          );
        }
        getCurrentResult() {
          return this.#n;
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
          return this.#s;
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
          return this.#m({ ...e, cancelRefetch: e.cancelRefetch ?? !0 }).then(
            () => (this.updateResult(), this.#n),
          );
        }
        #m(e) {
          this.#g();
          let t = this.#s.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(u.noop)), t;
        }
        #x() {
          this.#v();
          const e = (0, u.resolveStaleTime)(this.options.staleTime, this.#s);
          if (s.environmentManager.isServer() || this.#n.isStale || !(0, u.isValidTimeout)(e))
            return;
          const t = (0, u.timeUntilStale)(this.#n.dataUpdatedAt, e);
          this.#h = o.timeoutManager.setTimeout(() => {
            this.#n.isStale || this.updateResult();
          }, t + 1);
        }
        #R() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#s)
              : this.options.refetchInterval) ?? !1
          );
        }
        #Q(e) {
          this.#b(),
            (this.#f = e),
            !s.environmentManager.isServer() &&
              !1 !== (0, u.resolveEnabled)(this.options.enabled, this.#s) &&
              (0, u.isValidTimeout)(this.#f) &&
              0 !== this.#f &&
              (this.#d = o.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || r.focusManager.isFocused()) &&
                  this.#m();
              }, this.#f));
        }
        #y() {
          this.#x(), this.#Q(this.#R());
        }
        #v() {
          this.#h && (o.timeoutManager.clearTimeout(this.#h), (this.#h = void 0));
        }
        #b() {
          this.#d && (o.timeoutManager.clearInterval(this.#d), (this.#d = void 0));
        }
        createResult(e, t) {
          let r,
            s = this.#s,
            i = this.options,
            a = this.#n,
            o = this.#a,
            c = this.#l,
            d = e !== s ? e.state : this.#i,
            { state: m } = e,
            y = { ...m },
            v = !1;
          if (t._optimisticResults) {
            const r = this.hasListeners(),
              a = !r && h(e, t),
              l = r && f(e, s, t, i);
            (a || l) && (y = { ...y, ...(0, n.fetchState)(m.data, e.options) }),
              "isRestoring" === t._optimisticResults && (y.fetchStatus = "idle");
          }
          let { error: b, errorUpdatedAt: g, status: x } = y;
          r = y.data;
          let R = !1;
          if (void 0 !== t.placeholderData && void 0 === r && "pending" === x) {
            let e;
            a?.isPlaceholderData && t.placeholderData === c?.placeholderData
              ? ((e = a.data), (R = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#c?.state.data, this.#c)
                    : t.placeholderData),
              void 0 !== e && ((x = "success"), (r = (0, u.replaceData)(a?.data, e, t)), (v = !0));
          }
          if (t.select && void 0 !== r && !R)
            if (a && r === o?.data && t.select === this.#u) r = this.#o;
            else
              try {
                (this.#u = t.select),
                  (r = t.select(r)),
                  (r = (0, u.replaceData)(a?.data, r, t)),
                  (this.#o = r),
                  (this.#t = null);
              } catch (e) {
                this.#t = e;
              }
          this.#t && ((b = this.#t), (r = this.#o), (g = Date.now()), (x = "error"));
          const Q = "fetching" === y.fetchStatus,
            j = "pending" === x,
            O = "error" === x,
            E = j && Q,
            I = void 0 !== r,
            T = {
              status: x,
              fetchStatus: y.fetchStatus,
              isPending: j,
              isSuccess: "success" === x,
              isError: O,
              isInitialLoading: E,
              isLoading: E,
              data: r,
              dataUpdatedAt: y.dataUpdatedAt,
              error: b,
              errorUpdatedAt: g,
              failureCount: y.fetchFailureCount,
              failureReason: y.fetchFailureReason,
              errorUpdateCount: y.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                y.dataUpdateCount > d.dataUpdateCount || y.errorUpdateCount > d.errorUpdateCount,
              isFetching: Q,
              isRefetching: Q && !j,
              isLoadingError: O && !I,
              isPaused: "paused" === y.fetchStatus,
              isPlaceholderData: v,
              isRefetchError: O && I,
              isStale: p(e, t),
              refetch: this.refetch,
              promise: this.#r,
              isEnabled: !1 !== (0, u.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== T.data,
              r = "error" === T.status && !t,
              i = (e) => {
                r ? e.reject(T.error) : t && e.resolve(T.data);
              },
              n = () => {
                i((this.#r = T.promise = (0, l.pendingThenable)()));
              },
              a = this.#r;
            switch (a.status) {
              case "pending":
                e.queryHash === s.queryHash && i(a);
                break;
              case "fulfilled":
                (r || T.data !== a.value) && n();
                break;
              case "rejected":
                (r && T.error === a.reason) || n();
            }
          }
          return T;
        }
        updateResult() {
          const e = this.#n,
            t = this.createResult(this.#s, this.options);
          if (
            ((this.#a = this.#s.state),
            (this.#l = this.options),
            void 0 !== this.#a.data && (this.#c = this.#s),
            (0, u.shallowEqualObjects)(t, e))
          )
            return;
          this.#n = t;
          const r = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: t } = this.options,
              r = "function" == typeof t ? t() : t;
            if ("all" === r || (!r && !this.#p.size)) return !0;
            const s = new Set(r ?? this.#p);
            return (
              this.options.throwOnError && s.add("error"),
              Object.keys(this.#n).some((t) => this.#n[t] !== e[t] && s.has(t))
            );
          };
          this.#j({ listeners: r() });
        }
        #g() {
          const e = this.#e.getQueryCache().build(this.#e, this.options);
          if (e === this.#s) return;
          const t = this.#s;
          (this.#s = e),
            (this.#i = e.state),
            this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
        }
        onQueryUpdate() {
          this.updateResult(), this.hasListeners() && this.#y();
        }
        #j(e) {
          i.notifyManager.batch(() => {
            e.listeners &&
              this.listeners.forEach((e) => {
                e(this.#n);
              }),
              this.#e.getQueryCache().notify({ query: this.#s, type: "observerResultsUpdated" });
          });
        }
      };
    function h(e, t) {
      return (
        (!1 !== (0, u.resolveEnabled)(t.enabled, e) &&
          void 0 === e.state.data &&
          ("error" !== e.state.status || !1 !== t.retryOnMount)) ||
        (void 0 !== e.state.data && d(e, t, t.refetchOnMount))
      );
    }
    function d(e, t, r) {
      if (
        !1 !== (0, u.resolveEnabled)(t.enabled, e) &&
        "static" !== (0, u.resolveStaleTime)(t.staleTime, e)
      ) {
        const s = "function" == typeof r ? r(e) : r;
        return "always" === s || (!1 !== s && p(e, t));
      }
      return !1;
    }
    function f(e, t, r, s) {
      return (
        (e !== t || !1 === (0, u.resolveEnabled)(s.enabled, e)) &&
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
    var m = e.i(98937),
      y = e.i(73048);
    e.i(87111);
    var v = m.createContext(
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
      b = m.createContext(!1);
    b.Provider;
    var g = (e, t, r) =>
      t.fetchOptimistic(e).catch(() => {
        r.clearReset();
      });
    e.s(
      [
        "useQuery",
        0,
        (e, t) =>
          ((e, t, r) => {
            let n,
              a = m.useContext(b),
              l = m.useContext(v),
              o = (0, y.useQueryClient)(r),
              c = o.defaultQueryOptions(e);
            o.getDefaultOptions().queries?._experimental_beforeQuery?.(c);
            const h = o.getQueryCache().get(c.queryHash);
            if (((c._optimisticResults = a ? "isRestoring" : "optimistic"), c.suspense)) {
              const e = (e) => ("static" === e ? e : Math.max(e ?? 1e3, 1e3)),
                t = c.staleTime;
              (c.staleTime = "function" == typeof t ? (...r) => e(t(...r)) : e(t)),
                "number" == typeof c.gcTime && (c.gcTime = Math.max(c.gcTime, 1e3));
            }
            (n =
              h?.state.error && "function" == typeof c.throwOnError
                ? (0, u.shouldThrowError)(c.throwOnError, [h.state.error, h])
                : c.throwOnError),
              (c.suspense || c.experimental_prefetchInRender || n) &&
                !l.isReset() &&
                (c.retryOnMount = !1),
              m.useEffect(() => {
                l.clearReset();
              }, [l]);
            const d = !o.getQueryCache().get(c.queryHash),
              [f] = m.useState(() => new t(o, c)),
              p = f.getOptimisticResult(c),
              x = !a && !1 !== e.subscribed;
            if (
              (m.useSyncExternalStore(
                m.useCallback(
                  (e) => {
                    const t = x ? f.subscribe(i.notifyManager.batchCalls(e)) : u.noop;
                    return f.updateResult(), t;
                  },
                  [f, x],
                ),
                () => f.getCurrentResult(),
                () => f.getCurrentResult(),
              ),
              m.useEffect(() => {
                f.setOptions(c);
              }, [c, f]),
              c?.suspense && p.isPending)
            )
              throw g(c, f, l);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: r, query: s, suspense: i }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                s &&
                ((i && void 0 === e.data) || (0, u.shouldThrowError)(r, [e.error, s])))({
                result: p,
                errorResetBoundary: l,
                throwOnError: c.throwOnError,
                query: h,
                suspense: c.suspense,
              })
            )
              throw p.error;
            if (
              (o.getDefaultOptions().queries?._experimental_afterQuery?.(c, p),
              c.experimental_prefetchInRender &&
                !s.environmentManager.isServer() &&
                p.isLoading &&
                p.isFetching &&
                !a)
            ) {
              const e = d ? g(c, f, l) : h?.promise;
              e?.catch(u.noop).finally(() => {
                f.updateResult();
              });
            }
            return c.notifyOnChangeProps ? p : f.trackResult(p);
          })(e, c, t),
      ],
      67406,
    );
    const x = (0, e.i(1130).default)("chevron-right", [
      ["path", { d: "m9 18 6-6-6-6", key: "mthhwq" }],
    ]);
    e.s(["default", 0, x], 40930);
  },
  22988,
  (e) => {
    var t = e.i(40930);
    e.s(["ChevronRight", () => t.default]);
  },
  78844,
  (e) => {
    var t = e.i(87111),
      r = e.i(67406),
      s = e.i(52734),
      i = e.i(27433),
      n = e.i(48519),
      a = e.i(22988),
      l = e.i(90595),
      u = e.i(83049),
      o = e.i(5074);
    const c = {
      pending: "bg-amber-50 text-amber-700 border-amber-200/60",
      partial: "bg-blue-50 text-blue-700 border-blue-200/60",
      completed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
      expired: "bg-muted text-muted-foreground border-border",
    };
    function h(e) {
      return new Date(e).toLocaleDateString("en-ZA", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    }
    e.s([
      "default",
      0,
      () => {
        const {
          data: e,
          isLoading: d,
          error: f,
        } = (0, r.useQuery)({
          queryKey: ["signature-requests"],
          queryFn: () => (0, s.listSignatureRequests)(),
        });
        return (0, t.jsxs)("div", {
          className: "flex-1 flex flex-col",
          children: [
            (0, t.jsx)("div", {
              className: "flex items-center justify-between px-6 py-4 border-b",
              children: (0, t.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, t.jsx)(n.PenLine, { size: 20, className: "text-muted-foreground" }),
                  (0, t.jsx)("h1", {
                    className: "text-lg font-semibold text-foreground",
                    children: "Signature Requests",
                  }),
                ],
              }),
            }),
            (0, t.jsx)("div", {
              className: "flex-1 overflow-auto",
              children: d
                ? (0, t.jsxs)("div", {
                    className: "flex items-center justify-center py-20 text-muted-foreground",
                    children: [
                      (0, t.jsx)(i.Loader2, { size: 20, className: "animate-spin mr-2" }),
                      "Loading...",
                    ],
                  })
                : f
                  ? (0, t.jsx)("div", {
                      className: "flex items-center justify-center py-20 text-muted-foreground",
                      children: "Failed to load signature requests.",
                    })
                  : e?.length
                    ? (0, t.jsxs)("table", {
                        className: "w-full text-sm",
                        children: [
                          (0, t.jsx)("thead", {
                            children: (0, t.jsxs)("tr", {
                              className:
                                "border-b text-left text-xs font-medium text-muted-foreground uppercase tracking-wide",
                              children: [
                                (0, t.jsx)("th", {
                                  className: "px-6 py-3",
                                  children: "Source Ref",
                                }),
                                (0, t.jsx)("th", { className: "px-6 py-3", children: "Status" }),
                                (0, t.jsx)("th", { className: "px-6 py-3", children: "Signers" }),
                                (0, t.jsx)("th", { className: "px-6 py-3", children: "Created" }),
                                (0, t.jsx)("th", { className: "px-6 py-3", children: "Expires" }),
                                (0, t.jsx)("th", { className: "px-6 py-3" }),
                              ],
                            }),
                          }),
                          (0, t.jsx)("tbody", {
                            className: "divide-y",
                            children: e.map((e) =>
                              (0, t.jsxs)(
                                "tr",
                                {
                                  className: "hover:bg-muted/50 transition-colors",
                                  children: [
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3",
                                      children: (0, t.jsx)(o.default, {
                                        href: `/requests/${e.id}`,
                                        className: "font-medium text-foreground hover:underline",
                                        children: e.sourceRef || e.id.slice(0, 8),
                                      }),
                                    }),
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3",
                                      children: (0, t.jsx)(l.Badge, {
                                        className: (0, u.cn)("border", c[e.status] ?? c.pending),
                                        children: e.status,
                                      }),
                                    }),
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3 text-muted-foreground",
                                      children: e.signersCount ?? e.signers?.length ?? 0,
                                    }),
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3 text-muted-foreground tabular-nums",
                                      children: h(e.createdAt),
                                    }),
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3 text-muted-foreground tabular-nums",
                                      children: e.expiresAt ? h(e.expiresAt) : "-",
                                    }),
                                    (0, t.jsx)("td", {
                                      className: "px-6 py-3",
                                      children: (0, t.jsx)(o.default, {
                                        href: `/requests/${e.id}`,
                                        children: (0, t.jsx)(a.ChevronRight, {
                                          size: 16,
                                          className: "text-muted-foreground",
                                        }),
                                      }),
                                    }),
                                  ],
                                },
                                e.id,
                              ),
                            ),
                          }),
                        ],
                      })
                    : (0, t.jsxs)("div", {
                        className:
                          "flex flex-col items-center justify-center py-20 text-muted-foreground",
                        children: [
                          (0, t.jsx)(n.PenLine, { size: 32, className: "mb-3 opacity-40" }),
                          (0, t.jsx)("p", {
                            className: "text-sm",
                            children: "No signature requests yet",
                          }),
                        ],
                      }),
            }),
          ],
        });
      },
    ]);
  },
]);
