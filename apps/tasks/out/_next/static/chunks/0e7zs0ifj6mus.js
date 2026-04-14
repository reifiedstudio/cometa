(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  89803,
  (e) => {
    const t =
      e.i(67836).default.env.NEXT_PUBLIC_TASKS_API_URL ??
      "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws";
    async function r(e, s = {}) {
      return fetch(`${t}${e}`, {
        ...s,
        headers: { ...s.headers, "Content-Type": "application/json" },
      });
    }
    async function s() {
      const e = await r("/api/services");
      if (!e.ok) throw Error("Failed to fetch services");
      return e.json();
    }
    async function i(e) {
      const t = await r(`/api/services/${e}/messages`);
      if (!t.ok) throw Error("Failed to fetch messages");
      return t.json();
    }
    async function a(e, t, s) {
      const i = await r(`/api/services/${e}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: t, ...s }),
      });
      if (!i.ok) throw Error("Failed to send message");
      return i.json();
    }
    async function n(e, t) {
      const s = t ? `?status=${t}` : "",
        i = await r(`/api/services/${e}/tasks${s}`);
      if (!i.ok) throw Error("Failed to fetch tasks");
      return i.json();
    }
    async function o(e, t) {
      const s = await r(`/api/services/${e}/tasks/${t}`);
      if (!s.ok) throw Error("Failed to fetch task");
      return s.json();
    }
    async function l(e, t, s, i) {
      const a = await r(`/api/services/${e}/tasks/${t}/action`, {
        method: "POST",
        body: JSON.stringify({ action: s, ...i }),
      });
      if (!a.ok) throw Error("Failed to perform action");
      return a.json();
    }
    async function u(e, t) {
      const s = await r(`/api/services/${e}/tasks/${t}/session`);
      if (!s.ok && 404 !== s.status) throw Error("Failed to get session");
      return 404 === s.status ? null : s.json();
    }
    e.s([
      "fetchMessages",
      0,
      i,
      "fetchServices",
      0,
      s,
      "fetchTask",
      0,
      o,
      "fetchTasks",
      0,
      n,
      "getSessionStatus",
      0,
      u,
      "getStreamUrl",
      0,
      (e, r) => `${t}/api/services/${e}/tasks/${r}/stream`,
      "performAction",
      0,
      l,
      "sendMessage",
      0,
      a,
    ]);
  },
  67406,
  (e) => {
    let t;
    var r = e.i(6906),
      s = e.i(93771),
      i = e.i(94720),
      a = e.i(41136),
      n = e.i(41357),
      o = e.i(16621),
      l = e.i(37519),
      u = e.i(8081),
      c = class extends n.Subscribable {
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
        #s = void 0;
        #i = void 0;
        #a = void 0;
        #n;
        #o;
        #r;
        #t;
        #l;
        #u;
        #c;
        #h;
        #d;
        #p;
        #f = new Set();
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
          (this.listeners = new Set()), this.#v(), this.#g(), this.#s.removeObserver(this);
        }
        setOptions(e) {
          const t = this.options,
            r = this.#s;
          if (
            ((this.options = this.#e.defaultQueryOptions(e)),
            void 0 !== this.options.enabled &&
              "boolean" != typeof this.options.enabled &&
              "function" != typeof this.options.enabled &&
              "boolean" != typeof (0, l.resolveEnabled)(this.options.enabled, this.#s))
          )
            throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
          this.#b(),
            this.#s.setOptions(this.options),
            t._defaulted &&
              !(0, l.shallowEqualObjects)(this.options, t) &&
              this.#e
                .getQueryCache()
                .notify({ type: "observerOptionsUpdated", query: this.#s, observer: this });
          const s = this.hasListeners();
          s && p(this.#s, r, this.options, t) && this.#m(),
            this.updateResult(),
            s &&
              (this.#s !== r ||
                (0, l.resolveEnabled)(this.options.enabled, this.#s) !==
                  (0, l.resolveEnabled)(t.enabled, this.#s) ||
                (0, l.resolveStaleTime)(this.options.staleTime, this.#s) !==
                  (0, l.resolveStaleTime)(t.staleTime, this.#s)) &&
              this.#R();
          const i = this.#x();
          s &&
            (this.#s !== r ||
              (0, l.resolveEnabled)(this.options.enabled, this.#s) !==
                (0, l.resolveEnabled)(t.enabled, this.#s) ||
              i !== this.#p) &&
            this.#Q(i);
        }
        getOptimisticResult(e) {
          var t, r;
          const s = this.#e.getQueryCache().build(this.#e, e),
            i = this.createResult(s, e);
          return (
            (t = this),
            (r = i),
            (0, l.shallowEqualObjects)(t.getCurrentResult(), r) ||
              ((this.#a = i), (this.#o = this.options), (this.#n = this.#s.state)),
            i
          );
        }
        getCurrentResult() {
          return this.#a;
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
          this.#f.add(e);
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
            () => (this.updateResult(), this.#a),
          );
        }
        #m(e) {
          this.#b();
          let t = this.#s.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(l.noop)), t;
        }
        #R() {
          this.#v();
          const e = (0, l.resolveStaleTime)(this.options.staleTime, this.#s);
          if (s.environmentManager.isServer() || this.#a.isStale || !(0, l.isValidTimeout)(e))
            return;
          const t = (0, l.timeUntilStale)(this.#a.dataUpdatedAt, e);
          this.#h = u.timeoutManager.setTimeout(() => {
            this.#a.isStale || this.updateResult();
          }, t + 1);
        }
        #x() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#s)
              : this.options.refetchInterval) ?? !1
          );
        }
        #Q(e) {
          this.#g(),
            (this.#p = e),
            !s.environmentManager.isServer() &&
              !1 !== (0, l.resolveEnabled)(this.options.enabled, this.#s) &&
              (0, l.isValidTimeout)(this.#p) &&
              0 !== this.#p &&
              (this.#d = u.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || r.focusManager.isFocused()) &&
                  this.#m();
              }, this.#p));
        }
        #y() {
          this.#R(), this.#Q(this.#x());
        }
        #v() {
          this.#h && (u.timeoutManager.clearTimeout(this.#h), (this.#h = void 0));
        }
        #g() {
          this.#d && (u.timeoutManager.clearInterval(this.#d), (this.#d = void 0));
        }
        createResult(e, t) {
          let r,
            s = this.#s,
            i = this.options,
            n = this.#a,
            u = this.#n,
            c = this.#o,
            d = e !== s ? e.state : this.#i,
            { state: m } = e,
            y = { ...m },
            v = !1;
          if (t._optimisticResults) {
            const r = this.hasListeners(),
              n = !r && h(e, t),
              o = r && p(e, s, t, i);
            (n || o) && (y = { ...y, ...(0, a.fetchState)(m.data, e.options) }),
              "isRestoring" === t._optimisticResults && (y.fetchStatus = "idle");
          }
          let { error: g, errorUpdatedAt: b, status: R } = y;
          r = y.data;
          let x = !1;
          if (void 0 !== t.placeholderData && void 0 === r && "pending" === R) {
            let e;
            n?.isPlaceholderData && t.placeholderData === c?.placeholderData
              ? ((e = n.data), (x = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#c?.state.data, this.#c)
                    : t.placeholderData),
              void 0 !== e && ((R = "success"), (r = (0, l.replaceData)(n?.data, e, t)), (v = !0));
          }
          if (t.select && void 0 !== r && !x)
            if (n && r === u?.data && t.select === this.#l) r = this.#u;
            else
              try {
                (this.#l = t.select),
                  (r = t.select(r)),
                  (r = (0, l.replaceData)(n?.data, r, t)),
                  (this.#u = r),
                  (this.#t = null);
              } catch (e) {
                this.#t = e;
              }
          this.#t && ((g = this.#t), (r = this.#u), (b = Date.now()), (R = "error"));
          const Q = "fetching" === y.fetchStatus,
            w = "pending" === R,
            T = "error" === R,
            S = w && Q,
            k = void 0 !== r,
            E = {
              status: R,
              fetchStatus: y.fetchStatus,
              isPending: w,
              isSuccess: "success" === R,
              isError: T,
              isInitialLoading: S,
              isLoading: S,
              data: r,
              dataUpdatedAt: y.dataUpdatedAt,
              error: g,
              errorUpdatedAt: b,
              failureCount: y.fetchFailureCount,
              failureReason: y.fetchFailureReason,
              errorUpdateCount: y.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                y.dataUpdateCount > d.dataUpdateCount || y.errorUpdateCount > d.errorUpdateCount,
              isFetching: Q,
              isRefetching: Q && !w,
              isLoadingError: T && !k,
              isPaused: "paused" === y.fetchStatus,
              isPlaceholderData: v,
              isRefetchError: T && k,
              isStale: f(e, t),
              refetch: this.refetch,
              promise: this.#r,
              isEnabled: !1 !== (0, l.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== E.data,
              r = "error" === E.status && !t,
              i = (e) => {
                r ? e.reject(E.error) : t && e.resolve(E.data);
              },
              a = () => {
                i((this.#r = E.promise = (0, o.pendingThenable)()));
              },
              n = this.#r;
            switch (n.status) {
              case "pending":
                e.queryHash === s.queryHash && i(n);
                break;
              case "fulfilled":
                (r || E.data !== n.value) && a();
                break;
              case "rejected":
                (r && E.error === n.reason) || a();
            }
          }
          return E;
        }
        updateResult() {
          const e = this.#a,
            t = this.createResult(this.#s, this.options);
          if (
            ((this.#n = this.#s.state),
            (this.#o = this.options),
            void 0 !== this.#n.data && (this.#c = this.#s),
            (0, l.shallowEqualObjects)(t, e))
          )
            return;
          this.#a = t;
          const r = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: t } = this.options,
              r = "function" == typeof t ? t() : t;
            if ("all" === r || (!r && !this.#f.size)) return !0;
            const s = new Set(r ?? this.#f);
            return (
              this.options.throwOnError && s.add("error"),
              Object.keys(this.#a).some((t) => this.#a[t] !== e[t] && s.has(t))
            );
          };
          this.#w({ listeners: r() });
        }
        #b() {
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
        #w(e) {
          i.notifyManager.batch(() => {
            e.listeners &&
              this.listeners.forEach((e) => {
                e(this.#a);
              }),
              this.#e.getQueryCache().notify({ query: this.#s, type: "observerResultsUpdated" });
          });
        }
      };
    function h(e, t) {
      return (
        (!1 !== (0, l.resolveEnabled)(t.enabled, e) &&
          void 0 === e.state.data &&
          ("error" !== e.state.status || !1 !== t.retryOnMount)) ||
        (void 0 !== e.state.data && d(e, t, t.refetchOnMount))
      );
    }
    function d(e, t, r) {
      if (
        !1 !== (0, l.resolveEnabled)(t.enabled, e) &&
        "static" !== (0, l.resolveStaleTime)(t.staleTime, e)
      ) {
        const s = "function" == typeof r ? r(e) : r;
        return "always" === s || (!1 !== s && f(e, t));
      }
      return !1;
    }
    function p(e, t, r, s) {
      return (
        (e !== t || !1 === (0, l.resolveEnabled)(s.enabled, e)) &&
        (!r.suspense || "error" !== e.state.status) &&
        f(e, r)
      );
    }
    function f(e, t) {
      return (
        !1 !== (0, l.resolveEnabled)(t.enabled, e) &&
        e.isStaleByTime((0, l.resolveStaleTime)(t.staleTime, e))
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
      g = m.createContext(!1);
    g.Provider;
    var b = (e, t, r) =>
      t.fetchOptimistic(e).catch(() => {
        r.clearReset();
      });
    e.s(
      [
        "useQuery",
        0,
        (e, t) =>
          ((e, t, r) => {
            let a,
              n = m.useContext(g),
              o = m.useContext(v),
              u = (0, y.useQueryClient)(r),
              c = u.defaultQueryOptions(e);
            u.getDefaultOptions().queries?._experimental_beforeQuery?.(c);
            const h = u.getQueryCache().get(c.queryHash);
            if (((c._optimisticResults = n ? "isRestoring" : "optimistic"), c.suspense)) {
              const e = (e) => ("static" === e ? e : Math.max(e ?? 1e3, 1e3)),
                t = c.staleTime;
              (c.staleTime = "function" == typeof t ? (...r) => e(t(...r)) : e(t)),
                "number" == typeof c.gcTime && (c.gcTime = Math.max(c.gcTime, 1e3));
            }
            (a =
              h?.state.error && "function" == typeof c.throwOnError
                ? (0, l.shouldThrowError)(c.throwOnError, [h.state.error, h])
                : c.throwOnError),
              (c.suspense || c.experimental_prefetchInRender || a) &&
                !o.isReset() &&
                (c.retryOnMount = !1),
              m.useEffect(() => {
                o.clearReset();
              }, [o]);
            const d = !u.getQueryCache().get(c.queryHash),
              [p] = m.useState(() => new t(u, c)),
              f = p.getOptimisticResult(c),
              R = !n && !1 !== e.subscribed;
            if (
              (m.useSyncExternalStore(
                m.useCallback(
                  (e) => {
                    const t = R ? p.subscribe(i.notifyManager.batchCalls(e)) : l.noop;
                    return p.updateResult(), t;
                  },
                  [p, R],
                ),
                () => p.getCurrentResult(),
                () => p.getCurrentResult(),
              ),
              m.useEffect(() => {
                p.setOptions(c);
              }, [c, p]),
              c?.suspense && f.isPending)
            )
              throw b(c, p, o);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: r, query: s, suspense: i }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                s &&
                ((i && void 0 === e.data) || (0, l.shouldThrowError)(r, [e.error, s])))({
                result: f,
                errorResetBoundary: o,
                throwOnError: c.throwOnError,
                query: h,
                suspense: c.suspense,
              })
            )
              throw f.error;
            if (
              (u.getDefaultOptions().queries?._experimental_afterQuery?.(c, f),
              c.experimental_prefetchInRender &&
                !s.environmentManager.isServer() &&
                f.isLoading &&
                f.isFetching &&
                !n)
            ) {
              const e = d ? b(c, p, o) : h?.promise;
              e?.catch(l.noop).finally(() => {
                p.updateResult();
              });
            }
            return c.notifyOnChangeProps ? f : p.trackResult(f);
          })(e, c, t),
      ],
      67406,
    );
  },
  1130,
  27433,
  (e) => {
    var t = e.i(98937);
    const r = (...e) =>
        e
          .filter((e, t, r) => !!e && "" !== e.trim() && r.indexOf(e) === t)
          .join(" ")
          .trim(),
      s = (e) => {
        const t = e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, r) =>
          r ? r.toUpperCase() : t.toLowerCase(),
        );
        return t.charAt(0).toUpperCase() + t.slice(1);
      };
    var i = {
      xmlns: "http://www.w3.org/2000/svg",
      width: 24,
      height: 24,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 2,
      strokeLinecap: "round",
      strokeLinejoin: "round",
    };
    const a = (0, t.createContext)({}),
      n = (0, t.forwardRef)(
        (
          {
            color: e,
            size: s,
            strokeWidth: n,
            absoluteStrokeWidth: o,
            className: l = "",
            children: u,
            iconNode: c,
            ...h
          },
          d,
        ) => {
          const {
              size: p = 24,
              strokeWidth: f = 2,
              absoluteStrokeWidth: m = !1,
              color: y = "currentColor",
              className: v = "",
            } = (0, t.useContext)(a) ?? {},
            g = (o ?? m) ? (24 * Number(n ?? f)) / Number(s ?? p) : (n ?? f);
          return (0, t.createElement)(
            "svg",
            {
              ref: d,
              ...i,
              width: s ?? p ?? i.width,
              height: s ?? p ?? i.height,
              stroke: e ?? y,
              strokeWidth: g,
              className: r("lucide", v, l),
              ...(!u &&
                !((e) => {
                  for (const t in e)
                    if (t.startsWith("aria-") || "role" === t || "title" === t) return !0;
                  return !1;
                })(h) && { "aria-hidden": "true" }),
              ...h,
            },
            [...c.map(([e, r]) => (0, t.createElement)(e, r)), ...(Array.isArray(u) ? u : [u])],
          );
        },
      ),
      o = (e, i) => {
        const a = (0, t.forwardRef)(({ className: a, ...o }, l) =>
          (0, t.createElement)(n, {
            ref: l,
            iconNode: i,
            className: r(
              `lucide-${s(e)
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .toLowerCase()}`,
              `lucide-${e}`,
              a,
            ),
            ...o,
          }),
        );
        return (a.displayName = s(e)), a;
      };
    e.s(["default", 0, o], 1130);
    const l = o("loader-circle", [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]]);
    e.s(["Loader2", 0, l], 27433);
  },
  4949,
  (e) => {
    var t = e.i(87111),
      r = e.i(89803),
      s = e.i(67406),
      i = e.i(1130);
    const a = (0, i.default)("arrow-right", [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
      ]),
      n = (0, i.default)("building-2", [
        ["path", { d: "M10 12h4", key: "a56b0p" }],
        ["path", { d: "M10 8h4", key: "1sr2af" }],
        ["path", { d: "M14 21v-3a2 2 0 0 0-4 0v3", key: "1rgiei" }],
        [
          "path",
          {
            d: "M6 10H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2",
            key: "secmi2",
          },
        ],
        ["path", { d: "M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16", key: "16ra0t" }],
      ]);
    var o = e.i(27433);
    const l = {
      accounting: { label: "Accounting", description: "Invoices, expenses, payments" },
      legal: { label: "Legal", description: "Contracts, compliance, reviews" },
    };
    function u({ slug: e }) {
      const i = l[e] ?? { label: e, description: "" },
        { data: o } = (0, s.useQuery)({
          queryKey: ["tasks", e],
          queryFn: () => (0, r.fetchTasks)(e),
        }),
        c = o?.items ?? [],
        h = c.filter((e) => "awaiting_approval" === e.status).length,
        d = c.filter((e) => "processing" === e.status).length;
      return (0, t.jsxs)("a", {
        href: `/${e}`,
        className:
          "group border border-border rounded-lg p-5 hover:border-foreground/20 transition-colors",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-start justify-between mb-3",
            children: [
              (0, t.jsx)("div", {
                className: "size-9 rounded-lg bg-muted flex items-center justify-center",
                children: (0, t.jsx)(n, { size: 16, className: "text-muted-foreground" }),
              }),
              (0, t.jsx)(a, {
                size: 14,
                className:
                  "text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-1",
              }),
            ],
          }),
          (0, t.jsx)("h3", { className: "text-sm font-semibold mb-0.5", children: i.label }),
          (0, t.jsx)("p", {
            className: "text-xs text-muted-foreground mb-3",
            children: i.description,
          }),
          (0, t.jsxs)("div", {
            className: "flex gap-3 text-xs text-muted-foreground",
            children: [
              h > 0 &&
                (0, t.jsxs)("span", {
                  className: "text-amber-600 font-medium",
                  children: [h, " awaiting approval"],
                }),
              d > 0 &&
                (0, t.jsxs)("span", {
                  className: "text-blue-600 font-medium",
                  children: [d, " processing"],
                }),
              0 === h &&
                0 === d &&
                c.length > 0 &&
                (0, t.jsxs)("span", { children: [c.length, " tasks"] }),
            ],
          }),
        ],
      });
    }
    e.s(
      [
        "default",
        0,
        () => {
          const { data: e, isLoading: i } = (0, s.useQuery)({
              queryKey: ["services"],
              queryFn: r.fetchServices,
            }),
            a = e?.services?.length ? e.services.map((e) => e.slug) : ["accounting", "legal"];
          return (0, t.jsxs)("div", {
            className: "max-w-3xl mx-auto px-6 py-10",
            children: [
              (0, t.jsx)("h1", { className: "text-lg font-semibold mb-1", children: "Tasks" }),
              (0, t.jsx)("p", {
                className: "text-sm text-muted-foreground mb-6",
                children:
                  "AI-powered task management — approvals, processing, and cross-department coordination.",
              }),
              i
                ? (0, t.jsx)("div", {
                    className: "flex justify-center py-16",
                    children: (0, t.jsx)(o.Loader2, {
                      size: 20,
                      className: "animate-spin text-muted-foreground",
                    }),
                  })
                : (0, t.jsx)("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: a.map((e) => (0, t.jsx)(u, { slug: e }, e)),
                  }),
            ],
          });
        },
      ],
      4949,
    );
  },
]);
