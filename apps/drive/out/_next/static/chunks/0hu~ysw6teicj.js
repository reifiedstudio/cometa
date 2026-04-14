(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  67406,
  6321,
  83203,
  6149,
  24321,
  (e) => {
    let t;
    var s = e.i(6906),
      r = e.i(93771),
      i = e.i(94720),
      a = e.i(41136),
      n = e.i(41357),
      l = e.i(16621),
      o = e.i(37519),
      c = e.i(8081),
      u = class extends n.Subscribable {
        constructor(e, t) {
          super(),
            (this.options = t),
            (this.#e = e),
            (this.#t = null),
            (this.#s = (0, l.pendingThenable)()),
            this.bindMethods(),
            this.setOptions(t);
        }
        #e;
        #r = void 0;
        #i = void 0;
        #a = void 0;
        #n;
        #l;
        #s;
        #t;
        #o;
        #c;
        #u;
        #h;
        #d;
        #p;
        #m = new Set();
        bindMethods() {
          this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
          1 === this.listeners.size &&
            (this.#r.addObserver(this),
            h(this.#r, this.options) ? this.#f() : this.updateResult(),
            this.#y());
        }
        onUnsubscribe() {
          this.hasListeners() || this.destroy();
        }
        shouldFetchOnReconnect() {
          return d(this.#r, this.options, this.options.refetchOnReconnect);
        }
        shouldFetchOnWindowFocus() {
          return d(this.#r, this.options, this.options.refetchOnWindowFocus);
        }
        destroy() {
          (this.listeners = new Set()), this.#x(), this.#g(), this.#r.removeObserver(this);
        }
        setOptions(e) {
          const t = this.options,
            s = this.#r;
          if (
            ((this.options = this.#e.defaultQueryOptions(e)),
            void 0 !== this.options.enabled &&
              "boolean" != typeof this.options.enabled &&
              "function" != typeof this.options.enabled &&
              "boolean" != typeof (0, o.resolveEnabled)(this.options.enabled, this.#r))
          )
            throw Error("Expected enabled to be a boolean or a callback that returns a boolean");
          this.#v(),
            this.#r.setOptions(this.options),
            t._defaulted &&
              !(0, o.shallowEqualObjects)(this.options, t) &&
              this.#e
                .getQueryCache()
                .notify({ type: "observerOptionsUpdated", query: this.#r, observer: this });
          const r = this.hasListeners();
          r && p(this.#r, s, this.options, t) && this.#f(),
            this.updateResult(),
            r &&
              (this.#r !== s ||
                (0, o.resolveEnabled)(this.options.enabled, this.#r) !==
                  (0, o.resolveEnabled)(t.enabled, this.#r) ||
                (0, o.resolveStaleTime)(this.options.staleTime, this.#r) !==
                  (0, o.resolveStaleTime)(t.staleTime, this.#r)) &&
              this.#b();
          const i = this.#R();
          r &&
            (this.#r !== s ||
              (0, o.resolveEnabled)(this.options.enabled, this.#r) !==
                (0, o.resolveEnabled)(t.enabled, this.#r) ||
              i !== this.#p) &&
            this.#j(i);
        }
        getOptimisticResult(e) {
          var t, s;
          const r = this.#e.getQueryCache().build(this.#e, e),
            i = this.createResult(r, e);
          return (
            (t = this),
            (s = i),
            (0, o.shallowEqualObjects)(t.getCurrentResult(), s) ||
              ((this.#a = i), (this.#l = this.options), (this.#n = this.#r.state)),
            i
          );
        }
        getCurrentResult() {
          return this.#a;
        }
        trackResult(e, t) {
          return new Proxy(e, {
            get: (e, s) => (
              this.trackProp(s),
              t?.(s),
              "promise" === s &&
                (this.trackProp("data"),
                this.options.experimental_prefetchInRender ||
                  "pending" !== this.#s.status ||
                  this.#s.reject(
                    Error("experimental_prefetchInRender feature flag is not enabled"),
                  )),
              Reflect.get(e, s)
            ),
          });
        }
        trackProp(e) {
          this.#m.add(e);
        }
        getCurrentQuery() {
          return this.#r;
        }
        refetch({ ...e } = {}) {
          return this.fetch({ ...e });
        }
        fetchOptimistic(e) {
          const t = this.#e.defaultQueryOptions(e),
            s = this.#e.getQueryCache().build(this.#e, t);
          return s.fetch().then(() => this.createResult(s, t));
        }
        fetch(e) {
          return this.#f({ ...e, cancelRefetch: e.cancelRefetch ?? !0 }).then(
            () => (this.updateResult(), this.#a),
          );
        }
        #f(e) {
          this.#v();
          let t = this.#r.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(o.noop)), t;
        }
        #b() {
          this.#x();
          const e = (0, o.resolveStaleTime)(this.options.staleTime, this.#r);
          if (r.environmentManager.isServer() || this.#a.isStale || !(0, o.isValidTimeout)(e))
            return;
          const t = (0, o.timeUntilStale)(this.#a.dataUpdatedAt, e);
          this.#h = c.timeoutManager.setTimeout(() => {
            this.#a.isStale || this.updateResult();
          }, t + 1);
        }
        #R() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#r)
              : this.options.refetchInterval) ?? !1
          );
        }
        #j(e) {
          this.#g(),
            (this.#p = e),
            !r.environmentManager.isServer() &&
              !1 !== (0, o.resolveEnabled)(this.options.enabled, this.#r) &&
              (0, o.isValidTimeout)(this.#p) &&
              0 !== this.#p &&
              (this.#d = c.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || s.focusManager.isFocused()) &&
                  this.#f();
              }, this.#p));
        }
        #y() {
          this.#b(), this.#j(this.#R());
        }
        #x() {
          this.#h && (c.timeoutManager.clearTimeout(this.#h), (this.#h = void 0));
        }
        #g() {
          this.#d && (c.timeoutManager.clearInterval(this.#d), (this.#d = void 0));
        }
        createResult(e, t) {
          let s,
            r = this.#r,
            i = this.options,
            n = this.#a,
            c = this.#n,
            u = this.#l,
            d = e !== r ? e.state : this.#i,
            { state: f } = e,
            y = { ...f },
            x = !1;
          if (t._optimisticResults) {
            const s = this.hasListeners(),
              n = !s && h(e, t),
              l = s && p(e, r, t, i);
            (n || l) && (y = { ...y, ...(0, a.fetchState)(f.data, e.options) }),
              "isRestoring" === t._optimisticResults && (y.fetchStatus = "idle");
          }
          let { error: g, errorUpdatedAt: v, status: b } = y;
          s = y.data;
          let R = !1;
          if (void 0 !== t.placeholderData && void 0 === s && "pending" === b) {
            let e;
            n?.isPlaceholderData && t.placeholderData === u?.placeholderData
              ? ((e = n.data), (R = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#u?.state.data, this.#u)
                    : t.placeholderData),
              void 0 !== e && ((b = "success"), (s = (0, o.replaceData)(n?.data, e, t)), (x = !0));
          }
          if (t.select && void 0 !== s && !R)
            if (n && s === c?.data && t.select === this.#o) s = this.#c;
            else
              try {
                (this.#o = t.select),
                  (s = t.select(s)),
                  (s = (0, o.replaceData)(n?.data, s, t)),
                  (this.#c = s),
                  (this.#t = null);
              } catch (e) {
                this.#t = e;
              }
          this.#t && ((g = this.#t), (s = this.#c), (v = Date.now()), (b = "error"));
          const j = "fetching" === y.fetchStatus,
            T = "pending" === b,
            E = "error" === b,
            Q = T && j,
            I = void 0 !== s,
            N = {
              status: b,
              fetchStatus: y.fetchStatus,
              isPending: T,
              isSuccess: "success" === b,
              isError: E,
              isInitialLoading: Q,
              isLoading: Q,
              data: s,
              dataUpdatedAt: y.dataUpdatedAt,
              error: g,
              errorUpdatedAt: v,
              failureCount: y.fetchFailureCount,
              failureReason: y.fetchFailureReason,
              errorUpdateCount: y.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                y.dataUpdateCount > d.dataUpdateCount || y.errorUpdateCount > d.errorUpdateCount,
              isFetching: j,
              isRefetching: j && !T,
              isLoadingError: E && !I,
              isPaused: "paused" === y.fetchStatus,
              isPlaceholderData: x,
              isRefetchError: E && I,
              isStale: m(e, t),
              refetch: this.refetch,
              promise: this.#s,
              isEnabled: !1 !== (0, o.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== N.data,
              s = "error" === N.status && !t,
              i = (e) => {
                s ? e.reject(N.error) : t && e.resolve(N.data);
              },
              a = () => {
                i((this.#s = N.promise = (0, l.pendingThenable)()));
              },
              n = this.#s;
            switch (n.status) {
              case "pending":
                e.queryHash === r.queryHash && i(n);
                break;
              case "fulfilled":
                (s || N.data !== n.value) && a();
                break;
              case "rejected":
                (s && N.error === n.reason) || a();
            }
          }
          return N;
        }
        updateResult() {
          const e = this.#a,
            t = this.createResult(this.#r, this.options);
          if (
            ((this.#n = this.#r.state),
            (this.#l = this.options),
            void 0 !== this.#n.data && (this.#u = this.#r),
            (0, o.shallowEqualObjects)(t, e))
          )
            return;
          this.#a = t;
          const s = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: t } = this.options,
              s = "function" == typeof t ? t() : t;
            if ("all" === s || (!s && !this.#m.size)) return !0;
            const r = new Set(s ?? this.#m);
            return (
              this.options.throwOnError && r.add("error"),
              Object.keys(this.#a).some((t) => this.#a[t] !== e[t] && r.has(t))
            );
          };
          this.#T({ listeners: s() });
        }
        #v() {
          const e = this.#e.getQueryCache().build(this.#e, this.options);
          if (e === this.#r) return;
          const t = this.#r;
          (this.#r = e),
            (this.#i = e.state),
            this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
        }
        onQueryUpdate() {
          this.updateResult(), this.hasListeners() && this.#y();
        }
        #T(e) {
          i.notifyManager.batch(() => {
            e.listeners &&
              this.listeners.forEach((e) => {
                e(this.#a);
              }),
              this.#e.getQueryCache().notify({ query: this.#r, type: "observerResultsUpdated" });
          });
        }
      };
    function h(e, t) {
      return (
        (!1 !== (0, o.resolveEnabled)(t.enabled, e) &&
          void 0 === e.state.data &&
          ("error" !== e.state.status || !1 !== t.retryOnMount)) ||
        (void 0 !== e.state.data && d(e, t, t.refetchOnMount))
      );
    }
    function d(e, t, s) {
      if (
        !1 !== (0, o.resolveEnabled)(t.enabled, e) &&
        "static" !== (0, o.resolveStaleTime)(t.staleTime, e)
      ) {
        const r = "function" == typeof s ? s(e) : s;
        return "always" === r || (!1 !== r && m(e, t));
      }
      return !1;
    }
    function p(e, t, s, r) {
      return (
        (e !== t || !1 === (0, o.resolveEnabled)(r.enabled, e)) &&
        (!s.suspense || "error" !== e.state.status) &&
        m(e, s)
      );
    }
    function m(e, t) {
      return (
        !1 !== (0, o.resolveEnabled)(t.enabled, e) &&
        e.isStaleByTime((0, o.resolveStaleTime)(t.staleTime, e))
      );
    }
    var f = e.i(67836),
      y = e.i(98937),
      x = e.i(73048);
    e.i(87111);
    var g = y.createContext(
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
      v = y.createContext(!1);
    v.Provider;
    var b = (e, t, s) =>
      t.fetchOptimistic(e).catch(() => {
        s.clearReset();
      });
    e.s(
      [
        "useQuery",
        0,
        (e, t) =>
          ((e, t, s) => {
            let a,
              n = y.useContext(v),
              l = y.useContext(g),
              c = (0, x.useQueryClient)(s),
              u = c.defaultQueryOptions(e);
            c.getDefaultOptions().queries?._experimental_beforeQuery?.(u);
            const h = c.getQueryCache().get(u.queryHash);
            if (((u._optimisticResults = n ? "isRestoring" : "optimistic"), u.suspense)) {
              const e = (e) => ("static" === e ? e : Math.max(e ?? 1e3, 1e3)),
                t = u.staleTime;
              (u.staleTime = "function" == typeof t ? (...s) => e(t(...s)) : e(t)),
                "number" == typeof u.gcTime && (u.gcTime = Math.max(u.gcTime, 1e3));
            }
            (a =
              h?.state.error && "function" == typeof u.throwOnError
                ? (0, o.shouldThrowError)(u.throwOnError, [h.state.error, h])
                : u.throwOnError),
              (u.suspense || u.experimental_prefetchInRender || a) &&
                !l.isReset() &&
                (u.retryOnMount = !1),
              y.useEffect(() => {
                l.clearReset();
              }, [l]);
            const d = !c.getQueryCache().get(u.queryHash),
              [p] = y.useState(() => new t(c, u)),
              m = p.getOptimisticResult(u),
              f = !n && !1 !== e.subscribed;
            if (
              (y.useSyncExternalStore(
                y.useCallback(
                  (e) => {
                    const t = f ? p.subscribe(i.notifyManager.batchCalls(e)) : o.noop;
                    return p.updateResult(), t;
                  },
                  [p, f],
                ),
                () => p.getCurrentResult(),
                () => p.getCurrentResult(),
              ),
              y.useEffect(() => {
                p.setOptions(u);
              }, [u, p]),
              u?.suspense && m.isPending)
            )
              throw b(u, p, l);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: s, query: r, suspense: i }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                r &&
                ((i && void 0 === e.data) || (0, o.shouldThrowError)(s, [e.error, r])))({
                result: m,
                errorResetBoundary: l,
                throwOnError: u.throwOnError,
                query: h,
                suspense: u.suspense,
              })
            )
              throw m.error;
            if (
              (c.getDefaultOptions().queries?._experimental_afterQuery?.(u, m),
              u.experimental_prefetchInRender &&
                !r.environmentManager.isServer() &&
                m.isLoading &&
                m.isFetching &&
                !n)
            ) {
              const e = d ? b(u, p, l) : h?.promise;
              e?.catch(o.noop).finally(() => {
                p.updateResult();
              });
            }
            return u.notifyOnChangeProps ? m : p.trackResult(m);
          })(e, u, t),
      ],
      67406,
    );
    var R = e.i(1130);
    const j = (0, R.default)("file-text", [
      [
        "path",
        {
          d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
          key: "1oefj6",
        },
      ],
      ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
      ["path", { d: "M10 9H8", key: "b1mrlr" }],
      ["path", { d: "M16 13H8", key: "t4e002" }],
      ["path", { d: "M16 17H8", key: "z1uh3a" }],
    ]);
    e.s(["FileText", 0, j], 6321);
    const T = (0, R.default)("users", [
      ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
      ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
      ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
      ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ]);
    e.s(["Users", 0, T], 83203);
    const E = [
      {
        name: "Accounting",
        slug: "accounting",
        description: "Financial operations, invoicing, P&L, and bank reconciliation",
        permissionKey: "org:dept:accounting",
        services: ["documents", "accounting", "mcp"],
        googleGroupEmail: f.default.env.DEPT_ACCOUNTING_GROUP_EMAIL,
      },
      {
        name: "Legal",
        slug: "legal",
        description: "Contract review, compliance, signatures, and legal matters",
        permissionKey: "org:dept:legal",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: f.default.env.DEPT_LEGAL_GROUP_EMAIL,
      },
      {
        name: "Operations",
        slug: "operations",
        description: "Day-to-day business operations and logistics",
        permissionKey: "org:dept:operations",
        services: ["documents", "mcp"],
        googleGroupEmail: f.default.env.DEPT_OPERATIONS_GROUP_EMAIL,
      },
      {
        name: "HR",
        slug: "hr",
        description: "People management, hiring, and employee relations",
        permissionKey: "org:dept:hr",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: f.default.env.DEPT_HR_GROUP_EMAIL,
      },
    ];
    e.s(["DEPARTMENTS", 0, E], 6149),
      e.s(
        [
          "createAuthFetch",
          0,
          (e) => async (t, s) => {
            const r = await e();
            return fetch(
              `https://m2wr2hfp3xgdorhdrkygdulxs40xpewc.lambda-url.us-east-1.on.aws${t}`,
              {
                ...s,
                headers: {
                  ...s?.headers,
                  Authorization: `Bearer ${r}`,
                  "Content-Type": "application/json",
                },
              },
            );
          },
        ],
        24321,
      );
  },
  40066,
  (e) => {
    var t = e.i(87111),
      s = e.i(98937),
      r = e.i(67406);
    e.i(88886);
    var i = e.i(40020),
      a = e.i(6321),
      n = e.i(1130);
    const l = (0, n.default)("search", [
        ["path", { d: "m21 21-4.34-4.34", key: "14j7rj" }],
        ["circle", { cx: "11", cy: "11", r: "8", key: "4ej97u" }],
      ]),
      o = (0, n.default)("shield", [
        [
          "path",
          {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y",
          },
        ],
      ]);
    var c = e.i(83203);
    const u = (0, n.default)("arrow-right", [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }],
      ]),
      h = (0, n.default)("clock", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }],
      ]),
      d = (0, n.default)("circle-check", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }],
      ]);
    var p = e.i(6149),
      m = e.i(24321);
    function f({ perm: e }) {
      const s = p.DEPARTMENTS.find((t) => t.slug === e.department);
      return (0, t.jsxs)("div", {
        className: "flex items-center gap-3 p-3 border rounded-lg",
        children: [
          (0, t.jsx)("div", {
            className: "flex items-center justify-center w-8 h-8 rounded-full bg-muted shrink-0",
            children:
              "group" === e.type
                ? (0, t.jsx)(c.Users, { size: 14, className: "text-muted-foreground" })
                : (0, t.jsx)(o, { size: 14, className: "text-muted-foreground" }),
          }),
          (0, t.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, t.jsx)("span", {
                className: "text-sm font-medium",
                children: e.displayName ?? e.emailAddress ?? e.type,
              }),
              s &&
                (0, t.jsxs)("span", {
                  className: "ml-2 text-xs text-muted-foreground",
                  children: ["(", s.name, ")"],
                }),
            ],
          }),
          (0, t.jsx)("span", {
            className:
              "inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground capitalize",
            children: e.role,
          }),
        ],
      });
    }
    function y({ handoff: e }) {
      const s = p.DEPARTMENTS.find((t) => t.slug === e.toDepartment);
      return (0, t.jsxs)("div", {
        className: "flex items-center gap-3 p-3 border rounded-lg",
        children: [
          (0, t.jsx)("div", {
            className: "flex items-center justify-center w-8 h-8 rounded-lg bg-muted shrink-0",
            children: (0, t.jsx)(a.FileText, { size: 14, className: "text-muted-foreground" }),
          }),
          (0, t.jsxs)("div", {
            className: "flex-1 min-w-0",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center gap-1.5 text-sm",
                children: [
                  (0, t.jsx)("span", { className: "truncate", children: e.fromUserEmail }),
                  (0, t.jsx)(u, { size: 12, className: "text-muted-foreground shrink-0" }),
                  (0, t.jsx)("span", {
                    className: "font-medium",
                    children: s?.name ?? e.toDepartment,
                  }),
                ],
              }),
              e.note &&
                (0, t.jsx)("p", {
                  className: "text-xs text-muted-foreground mt-0.5 truncate",
                  children: e.note,
                }),
            ],
          }),
          (0, t.jsxs)("div", {
            className: "flex items-center gap-2 shrink-0",
            children: [
              "active" === e.status
                ? (0, t.jsxs)("span", {
                    className:
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs",
                    children: [(0, t.jsx)(h, { size: 10 }), " Active"],
                  })
                : (0, t.jsxs)("span", {
                    className:
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs",
                    children: [(0, t.jsx)(d, { size: 10 }), " Done"],
                  }),
              (0, t.jsx)("span", {
                className: "text-xs text-muted-foreground",
                children: new Date(e.createdAt).toLocaleDateString(),
              }),
            ],
          }),
        ],
      });
    }
    function x({ fileId: e, authFetch: s }) {
      const {
        data: i,
        isLoading: n,
        error: l,
      } = (0, r.useQuery)({
        queryKey: ["file-access", e],
        queryFn: async () => {
          const t = await s(`/api/access/file/${e}`);
          if (!t.ok) throw Error("Failed to fetch file access");
          return t.json();
        },
        enabled: !!e,
      });
      return n
        ? (0, t.jsx)("div", {
            className: "animate-pulse text-muted-foreground p-4",
            children: "Loading file info...",
          })
        : l
          ? (0, t.jsx)("div", {
              className: "text-destructive p-4 text-sm",
              children:
                "Could not load file. Check that the file ID is correct and the service account has access.",
            })
          : i
            ? (0, t.jsxs)("div", {
                className: "space-y-6",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex items-center gap-3",
                    children: [
                      (0, t.jsx)("div", {
                        className: "flex items-center justify-center w-10 h-10 rounded-lg bg-muted",
                        children: (0, t.jsx)(a.FileText, {
                          size: 20,
                          className: "text-muted-foreground",
                        }),
                      }),
                      (0, t.jsxs)("div", {
                        children: [
                          (0, t.jsx)("h3", { className: "font-semibold", children: i.file.name }),
                          (0, t.jsx)("p", {
                            className: "text-xs text-muted-foreground",
                            children: i.file.mimeType,
                          }),
                        ],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    children: [
                      (0, t.jsxs)("h4", {
                        className: "text-sm font-medium mb-2",
                        children: ["Permissions (", i.permissions.length, ")"],
                      }),
                      (0, t.jsxs)("div", {
                        className: "space-y-2",
                        children: [
                          i.permissions.map((e) => (0, t.jsx)(f, { perm: e }, e.id)),
                          0 === i.permissions.length &&
                            (0, t.jsx)("p", {
                              className: "text-sm text-muted-foreground",
                              children: "No permissions found",
                            }),
                        ],
                      }),
                    ],
                  }),
                  i.handoffHistory.length > 0 &&
                    (0, t.jsxs)("div", {
                      children: [
                        (0, t.jsxs)("h4", {
                          className: "text-sm font-medium mb-2",
                          children: ["Handoff History (", i.handoffHistory.length, ")"],
                        }),
                        (0, t.jsx)("div", {
                          className: "space-y-2",
                          children: i.handoffHistory.map((e) =>
                            (0, t.jsx)(y, { handoff: e }, e.id),
                          ),
                        }),
                      ],
                    }),
                ],
              })
            : null;
    }
    e.s(
      [
        "default",
        0,
        () => {
          const { getToken: e } = (0, i.useAuth)(),
            r = (0, m.createAuthFetch)(e),
            [a, n] = (0, s.useState)(""),
            [o, c] = (0, s.useState)(null),
            u = () => {
              const e = a.trim();
              if (!e) return;
              const t = e.match(/\/d\/([a-zA-Z0-9_-]+)/);
              c(t ? t[1] : e);
            };
          return (0, t.jsx)("div", {
            className: "flex-1 p-8 overflow-y-auto",
            children: (0, t.jsxs)("div", {
              className: "max-w-3xl",
              children: [
                (0, t.jsxs)("div", {
                  className: "mb-8",
                  children: [
                    (0, t.jsx)("h1", {
                      className: "text-2xl font-semibold",
                      children: "File Lookup",
                    }),
                    (0, t.jsx)("p", {
                      className: "text-muted-foreground",
                      children: "Check permissions and handoff history for any Google Drive file.",
                    }),
                  ],
                }),
                (0, t.jsxs)("div", {
                  className: "flex gap-2 mb-6",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "relative flex-1",
                      children: [
                        (0, t.jsx)(l, {
                          size: 16,
                          className:
                            "absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                        }),
                        (0, t.jsx)("input", {
                          type: "text",
                          value: a,
                          onChange: (e) => n(e.target.value),
                          onKeyDown: (e) => "Enter" === e.key && u(),
                          placeholder: "Paste a Google Drive file ID or URL...",
                          className:
                            "w-full h-10 pl-9 pr-3 rounded-lg border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                        }),
                      ],
                    }),
                    (0, t.jsx)("button", {
                      onClick: u,
                      className:
                        "h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity",
                      children: "Look up",
                    }),
                  ],
                }),
                o &&
                  (0, t.jsx)("div", {
                    className: "border rounded-lg p-5",
                    children: (0, t.jsx)(x, { fileId: o, authFetch: r }),
                  }),
                !o &&
                  (0, t.jsx)("div", {
                    className: "border rounded-lg p-8 text-center text-muted-foreground text-sm",
                    children:
                      "Enter a Google Drive file ID or paste a Drive URL to see who has access and the handoff history.",
                  }),
              ],
            }),
          });
        },
      ],
      40066,
    );
  },
]);
