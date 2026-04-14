(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  67406,
  6321,
  83203,
  6149,
  24321,
  (e) => {
    let t;
    var r = e.i(6906),
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
          (this.listeners = new Set()), this.#g(), this.#v(), this.#s.removeObserver(this);
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
          this.#R(),
            this.#s.setOptions(this.options),
            t._defaulted &&
              !(0, u.shallowEqualObjects)(this.options, t) &&
              this.#e
                .getQueryCache()
                .notify({ type: "observerOptionsUpdated", query: this.#s, observer: this });
          const s = this.hasListeners();
          s && p(this.#s, r, this.options, t) && this.#m(),
            this.updateResult(),
            s &&
              (this.#s !== r ||
                (0, u.resolveEnabled)(this.options.enabled, this.#s) !==
                  (0, u.resolveEnabled)(t.enabled, this.#s) ||
                (0, u.resolveStaleTime)(this.options.staleTime, this.#s) !==
                  (0, u.resolveStaleTime)(t.staleTime, this.#s)) &&
              this.#b();
          const i = this.#x();
          s &&
            (this.#s !== r ||
              (0, u.resolveEnabled)(this.options.enabled, this.#s) !==
                (0, u.resolveEnabled)(t.enabled, this.#s) ||
              i !== this.#p) &&
            this.#T(i);
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
            () => (this.updateResult(), this.#n),
          );
        }
        #m(e) {
          this.#R();
          let t = this.#s.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(u.noop)), t;
        }
        #b() {
          this.#g();
          const e = (0, u.resolveStaleTime)(this.options.staleTime, this.#s);
          if (s.environmentManager.isServer() || this.#n.isStale || !(0, u.isValidTimeout)(e))
            return;
          const t = (0, u.timeUntilStale)(this.#n.dataUpdatedAt, e);
          this.#h = o.timeoutManager.setTimeout(() => {
            this.#n.isStale || this.updateResult();
          }, t + 1);
        }
        #x() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#s)
              : this.options.refetchInterval) ?? !1
          );
        }
        #T(e) {
          this.#v(),
            (this.#p = e),
            !s.environmentManager.isServer() &&
              !1 !== (0, u.resolveEnabled)(this.options.enabled, this.#s) &&
              (0, u.isValidTimeout)(this.#p) &&
              0 !== this.#p &&
              (this.#d = o.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || r.focusManager.isFocused()) &&
                  this.#m();
              }, this.#p));
        }
        #y() {
          this.#b(), this.#T(this.#x());
        }
        #g() {
          this.#h && (o.timeoutManager.clearTimeout(this.#h), (this.#h = void 0));
        }
        #v() {
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
            g = !1;
          if (t._optimisticResults) {
            const r = this.hasListeners(),
              a = !r && h(e, t),
              l = r && p(e, s, t, i);
            (a || l) && (y = { ...y, ...(0, n.fetchState)(m.data, e.options) }),
              "isRestoring" === t._optimisticResults && (y.fetchStatus = "idle");
          }
          let { error: v, errorUpdatedAt: R, status: b } = y;
          r = y.data;
          let x = !1;
          if (void 0 !== t.placeholderData && void 0 === r && "pending" === b) {
            let e;
            a?.isPlaceholderData && t.placeholderData === c?.placeholderData
              ? ((e = a.data), (x = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#c?.state.data, this.#c)
                    : t.placeholderData),
              void 0 !== e && ((b = "success"), (r = (0, u.replaceData)(a?.data, e, t)), (g = !0));
          }
          if (t.select && void 0 !== r && !x)
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
          this.#t && ((v = this.#t), (r = this.#o), (R = Date.now()), (b = "error"));
          const T = "fetching" === y.fetchStatus,
            E = "pending" === b,
            Q = "error" === b,
            I = E && T,
            O = void 0 !== r,
            S = {
              status: b,
              fetchStatus: y.fetchStatus,
              isPending: E,
              isSuccess: "success" === b,
              isError: Q,
              isInitialLoading: I,
              isLoading: I,
              data: r,
              dataUpdatedAt: y.dataUpdatedAt,
              error: v,
              errorUpdatedAt: R,
              failureCount: y.fetchFailureCount,
              failureReason: y.fetchFailureReason,
              errorUpdateCount: y.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                y.dataUpdateCount > d.dataUpdateCount || y.errorUpdateCount > d.errorUpdateCount,
              isFetching: T,
              isRefetching: T && !E,
              isLoadingError: Q && !O,
              isPaused: "paused" === y.fetchStatus,
              isPlaceholderData: g,
              isRefetchError: Q && O,
              isStale: f(e, t),
              refetch: this.refetch,
              promise: this.#r,
              isEnabled: !1 !== (0, u.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== S.data,
              r = "error" === S.status && !t,
              i = (e) => {
                r ? e.reject(S.error) : t && e.resolve(S.data);
              },
              n = () => {
                i((this.#r = S.promise = (0, l.pendingThenable)()));
              },
              a = this.#r;
            switch (a.status) {
              case "pending":
                e.queryHash === s.queryHash && i(a);
                break;
              case "fulfilled":
                (r || S.data !== a.value) && n();
                break;
              case "rejected":
                (r && S.error === a.reason) || n();
            }
          }
          return S;
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
            if ("all" === r || (!r && !this.#f.size)) return !0;
            const s = new Set(r ?? this.#f);
            return (
              this.options.throwOnError && s.add("error"),
              Object.keys(this.#n).some((t) => this.#n[t] !== e[t] && s.has(t))
            );
          };
          this.#E({ listeners: r() });
        }
        #R() {
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
        #E(e) {
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
        return "always" === s || (!1 !== s && f(e, t));
      }
      return !1;
    }
    function p(e, t, r, s) {
      return (
        (e !== t || !1 === (0, u.resolveEnabled)(s.enabled, e)) &&
        (!r.suspense || "error" !== e.state.status) &&
        f(e, r)
      );
    }
    function f(e, t) {
      return (
        !1 !== (0, u.resolveEnabled)(t.enabled, e) &&
        e.isStaleByTime((0, u.resolveStaleTime)(t.staleTime, e))
      );
    }
    var m = e.i(67836),
      y = e.i(98937),
      g = e.i(73048);
    e.i(87111);
    var v = y.createContext(
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
      R = y.createContext(!1);
    R.Provider;
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
            let n,
              a = y.useContext(R),
              l = y.useContext(v),
              o = (0, g.useQueryClient)(r),
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
              y.useEffect(() => {
                l.clearReset();
              }, [l]);
            const d = !o.getQueryCache().get(c.queryHash),
              [p] = y.useState(() => new t(o, c)),
              f = p.getOptimisticResult(c),
              m = !a && !1 !== e.subscribed;
            if (
              (y.useSyncExternalStore(
                y.useCallback(
                  (e) => {
                    const t = m ? p.subscribe(i.notifyManager.batchCalls(e)) : u.noop;
                    return p.updateResult(), t;
                  },
                  [p, m],
                ),
                () => p.getCurrentResult(),
                () => p.getCurrentResult(),
              ),
              y.useEffect(() => {
                p.setOptions(c);
              }, [c, p]),
              c?.suspense && f.isPending)
            )
              throw b(c, p, l);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: r, query: s, suspense: i }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                s &&
                ((i && void 0 === e.data) || (0, u.shouldThrowError)(r, [e.error, s])))({
                result: f,
                errorResetBoundary: l,
                throwOnError: c.throwOnError,
                query: h,
                suspense: c.suspense,
              })
            )
              throw f.error;
            if (
              (o.getDefaultOptions().queries?._experimental_afterQuery?.(c, f),
              c.experimental_prefetchInRender &&
                !s.environmentManager.isServer() &&
                f.isLoading &&
                f.isFetching &&
                !a)
            ) {
              const e = d ? b(c, p, l) : h?.promise;
              e?.catch(u.noop).finally(() => {
                p.updateResult();
              });
            }
            return c.notifyOnChangeProps ? f : p.trackResult(f);
          })(e, c, t),
      ],
      67406,
    );
    var x = e.i(1130);
    const T = (0, x.default)("file-text", [
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
    e.s(["FileText", 0, T], 6321);
    const E = (0, x.default)("users", [
      ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
      ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
      ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
      ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ]);
    e.s(["Users", 0, E], 83203);
    const Q = [
      {
        name: "Accounting",
        slug: "accounting",
        description: "Financial operations, invoicing, P&L, and bank reconciliation",
        permissionKey: "org:dept:accounting",
        services: ["documents", "accounting", "mcp"],
        googleGroupEmail: m.default.env.DEPT_ACCOUNTING_GROUP_EMAIL,
      },
      {
        name: "Legal",
        slug: "legal",
        description: "Contract review, compliance, signatures, and legal matters",
        permissionKey: "org:dept:legal",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: m.default.env.DEPT_LEGAL_GROUP_EMAIL,
      },
      {
        name: "Operations",
        slug: "operations",
        description: "Day-to-day business operations and logistics",
        permissionKey: "org:dept:operations",
        services: ["documents", "mcp"],
        googleGroupEmail: m.default.env.DEPT_OPERATIONS_GROUP_EMAIL,
      },
      {
        name: "HR",
        slug: "hr",
        description: "People management, hiring, and employee relations",
        permissionKey: "org:dept:hr",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: m.default.env.DEPT_HR_GROUP_EMAIL,
      },
    ];
    e.s(["DEPARTMENTS", 0, Q], 6149),
      e.s(
        [
          "createAuthFetch",
          0,
          (e) => async (t, r) => {
            const s = await e();
            return fetch(
              `https://m2wr2hfp3xgdorhdrkygdulxs40xpewc.lambda-url.us-east-1.on.aws${t}`,
              {
                ...r,
                headers: {
                  ...r?.headers,
                  Authorization: `Bearer ${s}`,
                  "Content-Type": "application/json",
                },
              },
            );
          },
        ],
        24321,
      );
  },
  79080,
  (e) => {
    var t = e.i(87111),
      r = e.i(98937),
      s = e.i(67406);
    e.i(88886);
    var i = e.i(40020),
      n = e.i(6321),
      a = e.i(83203),
      l = e.i(6149),
      u = e.i(24321);
    function o({ slug: e, authFetch: i }) {
      const [u, c] = (0, r.useState)(!1),
        h = l.DEPARTMENTS.find((t) => t.slug === e),
        { data: d, isLoading: p } = (0, s.useQuery)({
          queryKey: ["dept-files", e],
          queryFn: async () => {
            const t = await i(`/api/access/department/${e}`);
            if (!t.ok) throw Error("Failed");
            return t.json();
          },
          enabled: u,
        });
      return (0, t.jsxs)("div", {
        className: "border rounded-lg p-4",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center justify-between cursor-pointer",
            onClick: () => c(!u),
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center gap-2",
                children: [
                  (0, t.jsx)("div", {
                    className: "flex items-center justify-center w-8 h-8 rounded-lg bg-muted",
                    children: (0, t.jsx)(a.Users, { size: 16, className: "text-muted-foreground" }),
                  }),
                  (0, t.jsxs)("div", {
                    children: [
                      (0, t.jsx)("h3", { className: "font-medium text-sm", children: h.name }),
                      (0, t.jsx)("p", {
                        className: "text-xs text-muted-foreground",
                        children: h.googleGroupEmail ?? "No group configured",
                      }),
                    ],
                  }),
                ],
              }),
              (0, t.jsx)("span", {
                className: "text-xs text-muted-foreground",
                children: u ? "Hide" : "Show files",
              }),
            ],
          }),
          u &&
            (0, t.jsxs)("div", {
              className: "mt-3 pt-3 border-t",
              children: [
                p &&
                  (0, t.jsx)("div", {
                    className: "animate-pulse text-sm text-muted-foreground",
                    children: "Loading...",
                  }),
                d?.files?.length === 0 &&
                  (0, t.jsx)("div", {
                    className: "text-xs text-muted-foreground",
                    children: "No files shared",
                  }),
                d?.files?.map((e) =>
                  (0, t.jsxs)(
                    "div",
                    {
                      className:
                        "flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors",
                      children: [
                        (0, t.jsx)(n.FileText, {
                          size: 14,
                          className: "text-muted-foreground shrink-0",
                        }),
                        (0, t.jsx)("span", {
                          className: "text-sm truncate flex-1",
                          children: e.name,
                        }),
                        (0, t.jsx)("span", {
                          className: "text-xs text-muted-foreground shrink-0",
                          children: e.mimeType?.split("/").pop(),
                        }),
                      ],
                    },
                    e.id,
                  ),
                ),
              ],
            }),
        ],
      });
    }
    e.s([
      "default",
      0,
      () => {
        const { getToken: e } = (0, i.useAuth)(),
          r = (0, u.createAuthFetch)(e);
        return (0, t.jsx)("div", {
          className: "flex-1 p-8 overflow-y-auto",
          children: (0, t.jsxs)("div", {
            className: "max-w-5xl",
            children: [
              (0, t.jsxs)("div", {
                className: "mb-8",
                children: [
                  (0, t.jsx)("h1", { className: "text-2xl font-semibold", children: "Drive" }),
                  (0, t.jsx)("p", {
                    className: "text-muted-foreground",
                    children: "File handoffs and department access across Google Drive.",
                  }),
                ],
              }),
              (0, t.jsxs)("div", {
                children: [
                  (0, t.jsx)("h2", {
                    className: "text-lg font-medium mb-3",
                    children: "Department Files",
                  }),
                  (0, t.jsx)("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                    children: l.DEPARTMENTS.map((e) =>
                      (0, t.jsx)(o, { slug: e.slug, authFetch: r }, e.slug),
                    ),
                  }),
                ],
              }),
            ],
          }),
        });
      },
    ]);
  },
]);
