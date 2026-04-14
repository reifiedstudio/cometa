(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  45213,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 });
    var o = { formatUrl: () => i, formatWithValidation: () => c, urlObjectKeys: () => l };
    for (var s in o) Object.defineProperty(r, s, { enumerable: !0, get: o[s] });
    const a = e.r(10380)._(e.r(79643)),
      n = /https?|ftp|gopher|file/;
    function i(e) {
      let { auth: t, hostname: r } = e,
        o = e.protocol || "",
        s = e.pathname || "",
        i = e.hash || "",
        l = e.query || "",
        c = !1;
      (t = t ? encodeURIComponent(t).replace(/%3A/i, ":") + "@" : ""),
        e.host
          ? (c = t + e.host)
          : r && ((c = t + (~r.indexOf(":") ? `[${r}]` : r)), e.port && (c += ":" + e.port)),
        l && "object" == typeof l && (l = String(a.urlQueryToSearchParams(l)));
      let u = e.search || (l && `?${l}`) || "";
      return (
        o && !o.endsWith(":") && (o += ":"),
        e.slashes || ((!o || n.test(o)) && !1 !== c)
          ? ((c = "//" + (c || "")), s && "/" !== s[0] && (s = "/" + s))
          : c || (c = ""),
        i && "#" !== i[0] && (i = "#" + i),
        u && "?" !== u[0] && (u = "?" + u),
        (s = s.replace(/[?#]/g, encodeURIComponent)),
        (u = u.replace("#", "%23")),
        `${o}${c}${s}${u}${i}`
      );
    }
    const l = [
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
      return i(e);
    }
  },
  67092,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "useMergedRef", { enumerable: !0, get: () => s });
    const o = e.r(98937);
    function s(e, t) {
      const r = (0, o.useRef)(null),
        s = (0, o.useRef)(null);
      return (0, o.useCallback)(
        (o) => {
          if (null === o) {
            const e = r.current;
            e && ((r.current = null), e());
            const t = s.current;
            t && ((s.current = null), t());
          } else e && (r.current = a(e, o)), t && (s.current = a(t, o));
        },
        [e, t],
      );
    }
    function a(e, t) {
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
      Object.defineProperty(r, "isLocalURL", { enumerable: !0, get: () => a });
    const o = e.r(22452),
      s = e.r(5870);
    function a(e) {
      if (!(0, o.isAbsoluteUrl)(e)) return !0;
      try {
        const t = (0, o.getLocationOrigin)(),
          r = new URL(e, t);
        return r.origin === t && (0, s.hasBasePath)(r.pathname);
      } catch (e) {
        return !1;
      }
    }
  },
  42765,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 }),
      Object.defineProperty(r, "errorOnce", { enumerable: !0, get: () => o });
    const o = (e) => {};
  },
  5074,
  (e, t, r) => {
    Object.defineProperty(r, "__esModule", { value: !0 });
    var o = { default: () => g, useLinkStatus: () => v };
    for (var s in o) Object.defineProperty(r, s, { enumerable: !0, get: o[s] });
    const a = e.r(10380),
      n = e.r(87111),
      i = a._(e.r(98937)),
      l = e.r(45213),
      c = e.r(67650),
      u = e.r(67092),
      d = e.r(22452),
      h = e.r(70476);
    e.r(49768);
    const p = e.r(61523),
      f = e.r(8659),
      m = e.r(99215),
      b = e.r(54083);
    function g(t) {
      var r, o;
      let s,
        a,
        g,
        [v, x] = (0, i.useOptimistic)(f.IDLE_LINK_STATUS),
        w = (0, i.useRef)(null),
        {
          href: k,
          as: C,
          children: j,
          prefetch: O = null,
          passHref: M,
          replace: P,
          shallow: z,
          scroll: q,
          onClick: S,
          onMouseEnter: Q,
          onTouchStart: A,
          legacyBehavior: T = !1,
          onNavigate: R,
          transitionTypes: _,
          ref: D,
          unstable_dynamicOnHover: E,
          ...N
        } = t;
      (s = j),
        T &&
          ("string" == typeof s || "number" == typeof s) &&
          (s = (0, n.jsx)("a", { children: s }));
      const I = i.default.useContext(c.AppRouterContext),
        K = !1 !== O,
        F =
          !1 !== O
            ? null === (o = O) || "auto" === o
              ? b.FetchStrategy.PPR
              : b.FetchStrategy.Full
            : b.FetchStrategy.PPR,
        L = "string" == typeof (r = C || k) ? r : (0, l.formatUrl)(r);
      if (T) {
        if (s?.$$typeof === Symbol.for("react.lazy"))
          throw Object.defineProperty(
            Error(
              "`<Link legacyBehavior>` received a direct child that is either a Server Component, or JSX that was loaded with React.lazy(). This is not supported. Either remove legacyBehavior, or make the direct child a Client Component that renders the Link's `<a>` tag.",
            ),
            "__NEXT_ERROR_CODE",
            { value: "E863", enumerable: !1, configurable: !0 },
          );
        a = i.default.Children.only(s);
      }
      const U = T ? a && "object" == typeof a && a.ref : D,
        G = i.default.useCallback(
          (e) => (
            null !== I && (w.current = (0, f.mountLinkInstance)(e, L, I, F, K, x)),
            () => {
              w.current && ((0, f.unmountLinkForCurrentNavigation)(w.current), (w.current = null)),
                (0, f.unmountPrefetchableInstance)(e);
            }
          ),
          [K, L, I, F, x],
        ),
        $ = {
          ref: (0, u.useMergedRef)(G, U),
          onClick(t) {
            T || "function" != typeof S || S(t),
              T && a.props && "function" == typeof a.props.onClick && a.props.onClick(t),
              !I ||
                t.defaultPrevented ||
                ((t, r, o, s, a, n, l) => {
                  if ("u" > typeof window) {
                    let c,
                      { nodeName: u } = t.currentTarget;
                    if (
                      ("A" === u.toUpperCase() &&
                        (((c = t.currentTarget.getAttribute("target")) && "_self" !== c) ||
                          t.metaKey ||
                          t.ctrlKey ||
                          t.shiftKey ||
                          t.altKey ||
                          (t.nativeEvent && 2 === t.nativeEvent.which))) ||
                      t.currentTarget.hasAttribute("download")
                    )
                      return;
                    if (!(0, m.isLocalURL)(r)) {
                      s && (t.preventDefault(), location.replace(r));
                      return;
                    }
                    if ((t.preventDefault(), n)) {
                      let e = !1;
                      if (
                        (n({
                          preventDefault: () => {
                            e = !0;
                          },
                        }),
                        e)
                      )
                        return;
                    }
                    const { dispatchNavigateAction: d } = e.r(13266);
                    i.default.startTransition(() => {
                      d(
                        r,
                        s ? "replace" : "push",
                        !1 === a ? p.ScrollBehavior.NoScroll : p.ScrollBehavior.Default,
                        o.current,
                        l,
                      );
                    });
                  }
                })(t, L, w, P, q, R, _);
          },
          onMouseEnter(e) {
            T || "function" != typeof Q || Q(e),
              T && a.props && "function" == typeof a.props.onMouseEnter && a.props.onMouseEnter(e),
              I && K && (0, f.onNavigationIntent)(e.currentTarget, !0 === E);
          },
          onTouchStart: (e) => {
            T || "function" != typeof A || A(e),
              T && a.props && "function" == typeof a.props.onTouchStart && a.props.onTouchStart(e),
              I && K && (0, f.onNavigationIntent)(e.currentTarget, !0 === E);
          },
        };
      return (
        (0, d.isAbsoluteUrl)(L)
          ? ($.href = L)
          : (T && !M && ("a" !== a.type || "href" in a.props)) || ($.href = (0, h.addBasePath)(L)),
        (g = T ? i.default.cloneElement(a, $) : (0, n.jsx)("a", { ...N, ...$, children: s })),
        (0, n.jsx)(y.Provider, { value: v, children: g })
      );
    }
    e.r(42765);
    const y = (0, i.createContext)(f.IDLE_LINK_STATUS),
      v = () => (0, i.useContext)(y);
    ("function" == typeof r.default || ("object" == typeof r.default && null !== r.default)) &&
      void 0 === r.default.__esModule &&
      (Object.defineProperty(r.default, "__esModule", { value: !0 }),
      Object.assign(r.default, r),
      (t.exports = r.default));
  },
  16326,
  (e, t, r) => {
    t.exports = e.r(54420);
  },
  16612,
  (e) => {
    var t = e.i(87111),
      r = e.i(88886),
      o = e.i(65905),
      s = e.i(1130);
    const a = (0, s.default)("folder-sync", [
        [
          "path",
          {
            d: "M9 20H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H20a2 2 0 0 1 2 2v.5",
            key: "1dkoa9",
          },
        ],
        ["path", { d: "M12 10v4h4", key: "1czhmt" }],
        ["path", { d: "m12 14 1.535-1.605a5 5 0 0 1 8 1.5", key: "lvuxfi" }],
        ["path", { d: "M22 22v-4h-4", key: "1ewp4q" }],
        ["path", { d: "m22 18-1.535 1.605a5 5 0 0 1-8-1.5", key: "14ync0" }],
      ]),
      n = (0, s.default)("file-search", [
        [
          "path",
          {
            d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
            key: "1oefj6",
          },
        ],
        ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
        ["circle", { cx: "11.5", cy: "14.5", r: "2.5", key: "1bq0ko" }],
        ["path", { d: "M13.3 16.3 15 18", key: "2quom7" }],
      ]),
      i = (0, s.default)("arrow-left-right", [
        ["path", { d: "M8 3 4 7l4 4", key: "9rb6wj" }],
        ["path", { d: "M4 7h16", key: "6tx8e3" }],
        ["path", { d: "m16 21 4-4-4-4", key: "siv7j2" }],
        ["path", { d: "M20 17H4", key: "h6l3hr" }],
      ]);
    e.i(67836);
    var l = e.i(40020),
      c = e.i(8024),
      u = e.i(98937);
    function d({ children: e }) {
      const { orgId: r } = (0, l.useAuth)(),
        { userMemberships: o, setActive: s } = (0, c.useOrganizationList)({
          userMemberships: { infinite: !0 },
        });
      return (
        (0, u.useEffect)(() => {
          !r && o?.data?.length && s && s({ organization: o.data[0].organization.id });
        }, [r, o?.data, s]),
        (0, t.jsx)(t.Fragment, { children: e })
      );
    }
    function h({ children: e }) {
      const { isSignedIn: r, isLoaded: s } = (0, c.useUser)();
      return s
        ? r
          ? (0, t.jsx)(d, { children: e })
          : (0, t.jsx)("div", {
              className: "flex-1 flex items-center justify-center",
              children: (0, t.jsx)(o.SignIn, { routing: "hash" }),
            })
        : (0, t.jsx)("div", {
            className: "flex-1 flex items-center justify-center",
            children: (0, t.jsx)("div", {
              className: "animate-pulse text-muted-foreground",
              children: "Loading...",
            }),
          });
    }
    function p({ children: e }) {
      return (0, t.jsx)(r.ClerkProvider, {
        publishableKey: "pk_test_Y29vbC1yZWRmaXNoLTU2LmNsZXJrLmFjY291bnRzLmRldiQ",
        children: (0, t.jsx)(h, { children: e }),
      });
    }
    var f = e.i(37519),
      m = e.i(41136),
      b = e.i(94720),
      g = e.i(41357),
      y = class extends g.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#e = new Map());
        }
        #e;
        build(e, t, r) {
          let o = t.queryKey,
            s = t.queryHash ?? (0, f.hashQueryKeyByOptions)(o, t),
            a = this.get(s);
          return (
            a ||
              ((a = new m.Query({
                client: e,
                queryKey: o,
                queryHash: s,
                options: e.defaultQueryOptions(t),
                state: r,
                defaultOptions: e.getQueryDefaults(o),
              })),
              this.add(a)),
            a
          );
        }
        add(e) {
          this.#e.has(e.queryHash) ||
            (this.#e.set(e.queryHash, e), this.notify({ type: "added", query: e }));
        }
        remove(e) {
          const t = this.#e.get(e.queryHash);
          t &&
            (e.destroy(),
            t === e && this.#e.delete(e.queryHash),
            this.notify({ type: "removed", query: e }));
        }
        clear() {
          b.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              this.remove(e);
            });
          });
        }
        get(e) {
          return this.#e.get(e);
        }
        getAll() {
          return [...this.#e.values()];
        }
        find(e) {
          const t = { exact: !0, ...e };
          return this.getAll().find((e) => (0, f.matchQuery)(t, e));
        }
        findAll(e = {}) {
          const t = this.getAll();
          return Object.keys(e).length > 0 ? t.filter((t) => (0, f.matchQuery)(e, t)) : t;
        }
        notify(e) {
          b.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        onFocus() {
          b.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onFocus();
            });
          });
        }
        onOnline() {
          b.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onOnline();
            });
          });
        }
      },
      v = e.i(78408),
      x = e.i(13564),
      w = class extends v.Removable {
        #t;
        #r;
        #o;
        #s;
        constructor(e) {
          super(),
            (this.#t = e.client),
            (this.mutationId = e.mutationId),
            (this.#o = e.mutationCache),
            (this.#r = []),
            (this.state = e.state || {
              context: void 0,
              data: void 0,
              error: null,
              failureCount: 0,
              failureReason: null,
              isPaused: !1,
              status: "idle",
              variables: void 0,
              submittedAt: 0,
            }),
            this.setOptions(e.options),
            this.scheduleGc();
        }
        setOptions(e) {
          (this.options = e), this.updateGcTime(this.options.gcTime);
        }
        get meta() {
          return this.options.meta;
        }
        addObserver(e) {
          this.#r.includes(e) ||
            (this.#r.push(e),
            this.clearGcTimeout(),
            this.#o.notify({ type: "observerAdded", mutation: this, observer: e }));
        }
        removeObserver(e) {
          (this.#r = this.#r.filter((t) => t !== e)),
            this.scheduleGc(),
            this.#o.notify({ type: "observerRemoved", mutation: this, observer: e });
        }
        optionalRemove() {
          this.#r.length ||
            ("pending" === this.state.status ? this.scheduleGc() : this.#o.remove(this));
        }
        continue() {
          return this.#s?.continue() ?? this.execute(this.state.variables);
        }
        async execute(e) {
          const t = () => {
              this.#a({ type: "continue" });
            },
            r = { client: this.#t, meta: this.options.meta, mutationKey: this.options.mutationKey };
          this.#s = (0, x.createRetryer)({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(e, r)
                : Promise.reject(Error("No mutationFn found")),
            onFail: (e, t) => {
              this.#a({ type: "failed", failureCount: e, error: t });
            },
            onPause: () => {
              this.#a({ type: "pause" });
            },
            onContinue: t,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => this.#o.canRun(this),
          });
          const o = "pending" === this.state.status,
            s = !this.#s.canStart();
          try {
            if (o) t();
            else {
              this.#a({ type: "pending", variables: e, isPaused: s }),
                this.#o.config.onMutate && (await this.#o.config.onMutate(e, this, r));
              const t = await this.options.onMutate?.(e, r);
              t !== this.state.context &&
                this.#a({ type: "pending", context: t, variables: e, isPaused: s });
            }
            const a = await this.#s.start();
            return (
              await this.#o.config.onSuccess?.(a, e, this.state.context, this, r),
              await this.options.onSuccess?.(a, e, this.state.context, r),
              await this.#o.config.onSettled?.(
                a,
                null,
                this.state.variables,
                this.state.context,
                this,
                r,
              ),
              await this.options.onSettled?.(a, null, e, this.state.context, r),
              this.#a({ type: "success", data: a }),
              a
            );
          } catch (t) {
            try {
              await this.#o.config.onError?.(t, e, this.state.context, this, r);
            } catch (e) {
              Promise.reject(e);
            }
            try {
              await this.options.onError?.(t, e, this.state.context, r);
            } catch (e) {
              Promise.reject(e);
            }
            try {
              await this.#o.config.onSettled?.(
                void 0,
                t,
                this.state.variables,
                this.state.context,
                this,
                r,
              );
            } catch (e) {
              Promise.reject(e);
            }
            try {
              await this.options.onSettled?.(void 0, t, e, this.state.context, r);
            } catch (e) {
              Promise.reject(e);
            }
            throw (this.#a({ type: "error", error: t }), t);
          } finally {
            this.#o.runNext(this);
          }
        }
        #a(e) {
          (this.state = ((t) => {
            switch (e.type) {
              case "failed":
                return { ...t, failureCount: e.failureCount, failureReason: e.error };
              case "pause":
                return { ...t, isPaused: !0 };
              case "continue":
                return { ...t, isPaused: !1 };
              case "pending":
                return {
                  ...t,
                  context: e.context,
                  data: void 0,
                  failureCount: 0,
                  failureReason: null,
                  error: null,
                  isPaused: e.isPaused,
                  status: "pending",
                  variables: e.variables,
                  submittedAt: Date.now(),
                };
              case "success":
                return {
                  ...t,
                  data: e.data,
                  failureCount: 0,
                  failureReason: null,
                  error: null,
                  status: "success",
                  isPaused: !1,
                };
              case "error":
                return {
                  ...t,
                  data: void 0,
                  error: e.error,
                  failureCount: t.failureCount + 1,
                  failureReason: e.error,
                  isPaused: !1,
                  status: "error",
                };
            }
          })(this.state)),
            b.notifyManager.batch(() => {
              this.#r.forEach((t) => {
                t.onMutationUpdate(e);
              }),
                this.#o.notify({ mutation: this, type: "updated", action: e });
            });
        }
      },
      k = g,
      C = class extends k.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#n = new Set()), (this.#i = new Map()), (this.#l = 0);
        }
        #n;
        #i;
        #l;
        build(e, t, r) {
          const o = new w({
            client: e,
            mutationCache: this,
            mutationId: ++this.#l,
            options: e.defaultMutationOptions(t),
            state: r,
          });
          return this.add(o), o;
        }
        add(e) {
          this.#n.add(e);
          const t = j(e);
          if ("string" == typeof t) {
            const r = this.#i.get(t);
            r ? r.push(e) : this.#i.set(t, [e]);
          }
          this.notify({ type: "added", mutation: e });
        }
        remove(e) {
          if (this.#n.delete(e)) {
            const t = j(e);
            if ("string" == typeof t) {
              const r = this.#i.get(t);
              if (r)
                if (r.length > 1) {
                  const t = r.indexOf(e);
                  -1 !== t && r.splice(t, 1);
                } else r[0] === e && this.#i.delete(t);
            }
          }
          this.notify({ type: "removed", mutation: e });
        }
        canRun(e) {
          const t = j(e);
          if ("string" != typeof t) return !0;
          {
            const r = this.#i.get(t),
              o = r?.find((e) => "pending" === e.state.status);
            return !o || o === e;
          }
        }
        runNext(e) {
          const t = j(e);
          if ("string" != typeof t) return Promise.resolve();
          {
            const r = this.#i.get(t)?.find((t) => t !== e && t.state.isPaused);
            return r?.continue() ?? Promise.resolve();
          }
        }
        clear() {
          b.notifyManager.batch(() => {
            this.#n.forEach((e) => {
              this.notify({ type: "removed", mutation: e });
            }),
              this.#n.clear(),
              this.#i.clear();
          });
        }
        getAll() {
          return Array.from(this.#n);
        }
        find(e) {
          const t = { exact: !0, ...e };
          return this.getAll().find((e) => (0, f.matchMutation)(t, e));
        }
        findAll(e = {}) {
          return this.getAll().filter((t) => (0, f.matchMutation)(e, t));
        }
        notify(e) {
          b.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        resumePausedMutations() {
          const e = this.getAll().filter((e) => e.state.isPaused);
          return b.notifyManager.batch(() => Promise.all(e.map((e) => e.continue().catch(f.noop))));
        }
      };
    function j(e) {
      return e.options.scope?.id;
    }
    var O = e.i(6906),
      M = e.i(65548);
    function P(e) {
      return {
        onFetch: (t, r) => {
          let o = t.options,
            s = t.fetchOptions?.meta?.fetchMore?.direction,
            a = t.state.data?.pages || [],
            n = t.state.data?.pageParams || [],
            i = { pages: [], pageParams: [] },
            l = 0,
            c = async () => {
              let r = !1,
                c = (0, f.ensureQueryFn)(t.options, t.fetchOptions),
                u = async (e, o, s) => {
                  let a;
                  if (r) return Promise.reject();
                  if (null == o && e.pages.length) return Promise.resolve(e);
                  const n =
                      ((a = {
                        client: t.client,
                        queryKey: t.queryKey,
                        pageParam: o,
                        direction: s ? "backward" : "forward",
                        meta: t.options.meta,
                      }),
                      (0, f.addConsumeAwareSignal)(
                        a,
                        () => t.signal,
                        () => (r = !0),
                      ),
                      a),
                    i = await c(n),
                    { maxPages: l } = t.options,
                    u = s ? f.addToStart : f.addToEnd;
                  return { pages: u(e.pages, i, l), pageParams: u(e.pageParams, o, l) };
                };
              if (s && a.length) {
                const e = "backward" === s,
                  t = { pages: a, pageParams: n },
                  r = (
                    e
                      ? (e, { pages: t, pageParams: r }) =>
                          t.length > 0 ? e.getPreviousPageParam?.(t[0], t, r[0], r) : void 0
                      : z
                  )(o, t);
                i = await u(t, r, e);
              } else {
                const t = e ?? a.length;
                do {
                  const e = 0 === l ? (n[0] ?? o.initialPageParam) : z(o, i);
                  if (l > 0 && null == e) break;
                  (i = await u(i, e)), l++;
                } while (l < t);
              }
              return i;
            };
          t.options.persister
            ? (t.fetchFn = () =>
                t.options.persister?.(
                  c,
                  {
                    client: t.client,
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  r,
                ))
            : (t.fetchFn = c);
        },
      };
    }
    function z(e, { pages: t, pageParams: r }) {
      const o = t.length - 1;
      return t.length > 0 ? e.getNextPageParam(t[o], t, r[o], r) : void 0;
    }
    var q = class {
        #c;
        #o;
        #u;
        #d;
        #h;
        #p;
        #f;
        #m;
        constructor(e = {}) {
          (this.#c = e.queryCache || new y()),
            (this.#o = e.mutationCache || new C()),
            (this.#u = e.defaultOptions || {}),
            (this.#d = new Map()),
            (this.#h = new Map()),
            (this.#p = 0);
        }
        mount() {
          this.#p++,
            1 === this.#p &&
              ((this.#f = O.focusManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#c.onFocus());
              })),
              (this.#m = M.onlineManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#c.onOnline());
              })));
        }
        unmount() {
          this.#p--,
            0 === this.#p && (this.#f?.(), (this.#f = void 0), this.#m?.(), (this.#m = void 0));
        }
        isFetching(e) {
          return this.#c.findAll({ ...e, fetchStatus: "fetching" }).length;
        }
        isMutating(e) {
          return this.#o.findAll({ ...e, status: "pending" }).length;
        }
        getQueryData(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#c.get(t.queryHash)?.state.data;
        }
        ensureQueryData(e) {
          const t = this.defaultQueryOptions(e),
            r = this.#c.build(this, t),
            o = r.state.data;
          return void 0 === o
            ? this.fetchQuery(e)
            : (e.revalidateIfStale &&
                r.isStaleByTime((0, f.resolveStaleTime)(t.staleTime, r)) &&
                this.prefetchQuery(t),
              Promise.resolve(o));
        }
        getQueriesData(e) {
          return this.#c.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
        }
        setQueryData(e, t, r) {
          const o = this.defaultQueryOptions({ queryKey: e }),
            s = this.#c.get(o.queryHash),
            a = s?.state.data,
            n = (0, f.functionalUpdate)(t, a);
          if (void 0 !== n) return this.#c.build(this, o).setData(n, { ...r, manual: !0 });
        }
        setQueriesData(e, t, r) {
          return b.notifyManager.batch(() =>
            this.#c.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, r)]),
          );
        }
        getQueryState(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#c.get(t.queryHash)?.state;
        }
        removeQueries(e) {
          const t = this.#c;
          b.notifyManager.batch(() => {
            t.findAll(e).forEach((e) => {
              t.remove(e);
            });
          });
        }
        resetQueries(e, t) {
          const r = this.#c;
          return b.notifyManager.batch(
            () => (
              r.findAll(e).forEach((e) => {
                e.reset();
              }),
              this.refetchQueries({ type: "active", ...e }, t)
            ),
          );
        }
        cancelQueries(e, t = {}) {
          const r = { revert: !0, ...t };
          return Promise.all(
            b.notifyManager.batch(() => this.#c.findAll(e).map((e) => e.cancel(r))),
          )
            .then(f.noop)
            .catch(f.noop);
        }
        invalidateQueries(e, t = {}) {
          return b.notifyManager.batch(() =>
            (this.#c.findAll(e).forEach((e) => {
              e.invalidate();
            }),
            e?.refetchType === "none")
              ? Promise.resolve()
              : this.refetchQueries({ ...e, type: e?.refetchType ?? e?.type ?? "active" }, t),
          );
        }
        refetchQueries(e, t = {}) {
          const r = { ...t, cancelRefetch: t.cancelRefetch ?? !0 };
          return Promise.all(
            b.notifyManager.batch(() =>
              this.#c
                .findAll(e)
                .filter((e) => !e.isDisabled() && !e.isStatic())
                .map((e) => {
                  let t = e.fetch(void 0, r);
                  return (
                    r.throwOnError || (t = t.catch(f.noop)),
                    "paused" === e.state.fetchStatus ? Promise.resolve() : t
                  );
                }),
            ),
          ).then(f.noop);
        }
        fetchQuery(e) {
          const t = this.defaultQueryOptions(e);
          void 0 === t.retry && (t.retry = !1);
          const r = this.#c.build(this, t);
          return r.isStaleByTime((0, f.resolveStaleTime)(t.staleTime, r))
            ? r.fetch(t)
            : Promise.resolve(r.state.data);
        }
        prefetchQuery(e) {
          return this.fetchQuery(e).then(f.noop).catch(f.noop);
        }
        fetchInfiniteQuery(e) {
          return (e.behavior = P(e.pages)), this.fetchQuery(e);
        }
        prefetchInfiniteQuery(e) {
          return this.fetchInfiniteQuery(e).then(f.noop).catch(f.noop);
        }
        ensureInfiniteQueryData(e) {
          return (e.behavior = P(e.pages)), this.ensureQueryData(e);
        }
        resumePausedMutations() {
          return M.onlineManager.isOnline() ? this.#o.resumePausedMutations() : Promise.resolve();
        }
        getQueryCache() {
          return this.#c;
        }
        getMutationCache() {
          return this.#o;
        }
        getDefaultOptions() {
          return this.#u;
        }
        setDefaultOptions(e) {
          this.#u = e;
        }
        setQueryDefaults(e, t) {
          this.#d.set((0, f.hashKey)(e), { queryKey: e, defaultOptions: t });
        }
        getQueryDefaults(e) {
          const t = [...this.#d.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, f.partialMatchKey)(e, t.queryKey) && Object.assign(r, t.defaultOptions);
            }),
            r
          );
        }
        setMutationDefaults(e, t) {
          this.#h.set((0, f.hashKey)(e), { mutationKey: e, defaultOptions: t });
        }
        getMutationDefaults(e) {
          const t = [...this.#h.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, f.partialMatchKey)(e, t.mutationKey) && Object.assign(r, t.defaultOptions);
            }),
            r
          );
        }
        defaultQueryOptions(e) {
          if (e._defaulted) return e;
          const t = {
            ...this.#u.queries,
            ...this.getQueryDefaults(e.queryKey),
            ...e,
            _defaulted: !0,
          };
          return (
            t.queryHash || (t.queryHash = (0, f.hashQueryKeyByOptions)(t.queryKey, t)),
            void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = "always" !== t.networkMode),
            void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
            !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
            t.queryFn === f.skipToken && (t.enabled = !1),
            t
          );
        }
        defaultMutationOptions(e) {
          return e?._defaulted
            ? e
            : {
                ...this.#u.mutations,
                ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
                ...e,
                _defaulted: !0,
              };
        }
        clear() {
          this.#c.clear(), this.#o.clear();
        }
      },
      S = e.i(73048);
    function Q({ children: e }) {
      const [r] = (0, u.useState)(
        () => new q({ defaultOptions: { queries: { staleTime: 3e4, refetchOnWindowFocus: !0 } } }),
      );
      return (0, t.jsx)(S.QueryClientProvider, { client: r, children: e });
    }
    var A = e.i(5074),
      T = e.i(16326);
    const R = (e = new Map(), t = null, r) => ({ nextPart: e, validators: t, classGroupId: r }),
      _ = [],
      D = (e, t, r) => {
        if (0 == e.length - t) return r.classGroupId;
        const o = e[t],
          s = r.nextPart.get(o);
        if (s) {
          const r = D(e, t + 1, s);
          if (r) return r;
        }
        const a = r.validators;
        if (null === a) return;
        const n = 0 === t ? e.join("-") : e.slice(t).join("-"),
          i = a.length;
        for (let e = 0; e < i; e++) {
          const t = a[e];
          if (t.validator(n)) return t.classGroupId;
        }
      },
      E = (e, t) => {
        const r = R();
        for (const o in e) N(e[o], r, o, t);
        return r;
      },
      N = (e, t, r, o) => {
        const s = e.length;
        for (let a = 0; a < s; a++) I(e[a], t, r, o);
      },
      I = (e, t, r, o) => {
        "string" == typeof e ? K(e, t, r) : "function" == typeof e ? F(e, t, r, o) : L(e, t, r, o);
      },
      K = (e, t, r) => {
        ("" === e ? t : U(t, e)).classGroupId = r;
      },
      F = (e, t, r, o) => {
        G(e)
          ? N(e(o), t, r, o)
          : (null === t.validators && (t.validators = []),
            t.validators.push({ classGroupId: r, validator: e }));
      },
      L = (e, t, r, o) => {
        const s = Object.entries(e),
          a = s.length;
        for (let e = 0; e < a; e++) {
          const [a, n] = s[e];
          N(n, U(t, a), r, o);
        }
      },
      U = (e, t) => {
        let r = e,
          o = t.split("-"),
          s = o.length;
        for (let e = 0; e < s; e++) {
          let t = o[e],
            s = r.nextPart.get(t);
          s || ((s = R()), r.nextPart.set(t, s)), (r = s);
        }
        return r;
      },
      G = (e) => "isThemeGetter" in e && !0 === e.isThemeGetter,
      $ = [],
      H = (e, t, r, o, s) => ({
        modifiers: e,
        hasImportantModifier: t,
        baseClassName: r,
        maybePostfixModifierPosition: o,
        isExternal: s,
      }),
      B = /\s+/,
      W = (e) => {
        let t;
        if ("string" == typeof e) return e;
        let r = "";
        for (let o = 0; o < e.length; o++) e[o] && (t = W(e[o])) && (r && (r += " "), (r += t));
        return r;
      },
      X = [],
      V = (e) => {
        const t = (t) => t[e] || X;
        return (t.isThemeGetter = !0), t;
      },
      J = /^\[(?:(\w[\w-]*):)?(.+)\]$/i,
      Y = /^\((?:(\w[\w-]*):)?(.+)\)$/i,
      Z = /^\d+(?:\.\d+)?\/\d+(?:\.\d+)?$/,
      ee = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/,
      et =
        /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/,
      er = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/,
      eo = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/,
      es =
        /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/,
      ea = (e) => Z.test(e),
      en = (e) => !!e && !Number.isNaN(Number(e)),
      ei = (e) => !!e && Number.isInteger(Number(e)),
      el = (e) => e.endsWith("%") && en(e.slice(0, -1)),
      ec = (e) => ee.test(e),
      eu = () => !0,
      ed = (e) => et.test(e) && !er.test(e),
      eh = () => !1,
      ep = (e) => eo.test(e),
      ef = (e) => es.test(e),
      em = (e) => !eg(e) && !eO(e),
      eb = (e) => eT(e, eE, eh),
      eg = (e) => J.test(e),
      ey = (e) => eT(e, eN, ed),
      ev = (e) => eT(e, eI, en),
      ex = (e) => eT(e, eF, eu),
      ew = (e) => eT(e, eK, eh),
      ek = (e) => eT(e, e_, eh),
      eC = (e) => eT(e, eD, ef),
      ej = (e) => eT(e, eL, ep),
      eO = (e) => Y.test(e),
      eM = (e) => eR(e, eN),
      eP = (e) => eR(e, eK),
      ez = (e) => eR(e, e_),
      eq = (e) => eR(e, eE),
      eS = (e) => eR(e, eD),
      eQ = (e) => eR(e, eL, !0),
      eA = (e) => eR(e, eF, !0),
      eT = (e, t, r) => {
        const o = J.exec(e);
        return !!o && (o[1] ? t(o[1]) : r(o[2]));
      },
      eR = (e, t, r = !1) => {
        const o = Y.exec(e);
        return !!o && (o[1] ? t(o[1]) : r);
      },
      e_ = (e) => "position" === e || "percentage" === e,
      eD = (e) => "image" === e || "url" === e,
      eE = (e) => "length" === e || "size" === e || "bg-size" === e,
      eN = (e) => "length" === e,
      eI = (e) => "number" === e,
      eK = (e) => "family-name" === e,
      eF = (e) => "number" === e || "weight" === e,
      eL = (e) => "shadow" === e,
      eU = ((e, ...t) => {
        let r,
          o,
          s,
          a,
          n = (e) => {
            const t = o(e);
            if (t) return t;
            const a = ((e, t) => {
              let {
                  parseClassName: r,
                  getClassGroupId: o,
                  getConflictingClassGroupIds: s,
                  sortModifiers: a,
                } = t,
                n = [],
                i = e.trim().split(B),
                l = "";
              for (let e = i.length - 1; e >= 0; e -= 1) {
                const t = i[e],
                  {
                    isExternal: c,
                    modifiers: u,
                    hasImportantModifier: d,
                    baseClassName: h,
                    maybePostfixModifierPosition: p,
                  } = r(t);
                if (c) {
                  l = t + (l.length > 0 ? " " + l : l);
                  continue;
                }
                let f = !!p,
                  m = o(f ? h.substring(0, p) : h);
                if (!m) {
                  if (!f || !(m = o(h))) {
                    l = t + (l.length > 0 ? " " + l : l);
                    continue;
                  }
                  f = !1;
                }
                const b = 0 === u.length ? "" : 1 === u.length ? u[0] : a(u).join(":"),
                  g = d ? b + "!" : b,
                  y = g + m;
                if (n.indexOf(y) > -1) continue;
                n.push(y);
                const v = s(m, f);
                for (let e = 0; e < v.length; ++e) {
                  const t = v[e];
                  n.push(g + t);
                }
                l = t + (l.length > 0 ? " " + l : l);
              }
              return l;
            })(e, r);
            return s(e, a), a;
          };
        return (
          (a = (i) => {
            var l;
            let c;
            return (
              (o = (r = {
                cache: ((e) => {
                  if (e < 1) return { get: () => void 0, set: () => {} };
                  let t = 0,
                    r = Object.create(null),
                    o = Object.create(null),
                    s = (s, a) => {
                      (r[s] = a), ++t > e && ((t = 0), (o = r), (r = Object.create(null)));
                    };
                  return {
                    get(e) {
                      let t = r[e];
                      return void 0 !== t ? t : void 0 !== (t = o[e]) ? (s(e, t), t) : void 0;
                    },
                    set(e, t) {
                      e in r ? (r[e] = t) : s(e, t);
                    },
                  };
                })((l = t.reduce((e, t) => t(e), e())).cacheSize),
                parseClassName: ((e) => {
                  let { prefix: t, experimentalParseClassName: r } = e,
                    o = (e) => {
                      let t,
                        r = [],
                        o = 0,
                        s = 0,
                        a = 0,
                        n = e.length;
                      for (let i = 0; i < n; i++) {
                        const n = e[i];
                        if (0 === o && 0 === s) {
                          if (":" === n) {
                            r.push(e.slice(a, i)), (a = i + 1);
                            continue;
                          }
                          if ("/" === n) {
                            t = i;
                            continue;
                          }
                        }
                        "[" === n ? o++ : "]" === n ? o-- : "(" === n ? s++ : ")" === n && s--;
                      }
                      let i = 0 === r.length ? e : e.slice(a),
                        l = i,
                        c = !1;
                      return (
                        i.endsWith("!")
                          ? ((l = i.slice(0, -1)), (c = !0))
                          : i.startsWith("!") && ((l = i.slice(1)), (c = !0)),
                        H(r, c, l, t && t > a ? t - a : void 0)
                      );
                    };
                  if (t) {
                    const e = t + ":",
                      r = o;
                    o = (t) => (t.startsWith(e) ? r(t.slice(e.length)) : H($, !1, t, void 0, !0));
                  }
                  if (r) {
                    const e = o;
                    o = (t) => r({ className: t, parseClassName: e });
                  }
                  return o;
                })(l),
                sortModifiers:
                  ((c = new Map()),
                  l.orderSensitiveModifiers.forEach((e, t) => {
                    c.set(e, 1e6 + t);
                  }),
                  (e) => {
                    let t = [],
                      r = [];
                    for (let o = 0; o < e.length; o++) {
                      const s = e[o],
                        a = "[" === s[0],
                        n = c.has(s);
                      a || n
                        ? (r.length > 0 && (r.sort(), t.push(...r), (r = [])), t.push(s))
                        : r.push(s);
                    }
                    return r.length > 0 && (r.sort(), t.push(...r)), t;
                  }),
                ...((e) => {
                  const t = ((e) => {
                      const { theme: t, classGroups: r } = e;
                      return E(r, t);
                    })(e),
                    { conflictingClassGroups: r, conflictingClassGroupModifiers: o } = e;
                  return {
                    getClassGroupId: (e) => {
                      if (e.startsWith("[") && e.endsWith("]")) {
                        var r;
                        let t, o, s;
                        return -1 === (r = e).slice(1, -1).indexOf(":")
                          ? void 0
                          : ((o = (t = r.slice(1, -1)).indexOf(":")),
                            (s = t.slice(0, o)) ? "arbitrary.." + s : void 0);
                      }
                      const o = e.split("-"),
                        s = +("" === o[0] && o.length > 1);
                      return D(o, s, t);
                    },
                    getConflictingClassGroupIds: (e, t) => {
                      if (t) {
                        const t = o[e],
                          s = r[e];
                        if (t) {
                          if (s) {
                            const e = Array(s.length + t.length);
                            for (let t = 0; t < s.length; t++) e[t] = s[t];
                            for (let r = 0; r < t.length; r++) e[s.length + r] = t[r];
                            return e;
                          }
                          return t;
                        }
                        return s || _;
                      }
                      return r[e] || _;
                    },
                  };
                })(l),
              }).cache.get),
              (s = r.cache.set),
              (a = n),
              n(i)
            );
          }),
          (...e) =>
            a(
              ((...e) => {
                let t,
                  r,
                  o = 0,
                  s = "";
                while (o < e.length) (t = e[o++]) && (r = W(t)) && (s && (s += " "), (s += r));
                return s;
              })(...e),
            )
        );
      })(() => {
        const e = V("color"),
          t = V("font"),
          r = V("text"),
          o = V("font-weight"),
          s = V("tracking"),
          a = V("leading"),
          n = V("breakpoint"),
          i = V("container"),
          l = V("spacing"),
          c = V("radius"),
          u = V("shadow"),
          d = V("inset-shadow"),
          h = V("text-shadow"),
          p = V("drop-shadow"),
          f = V("blur"),
          m = V("perspective"),
          b = V("aspect"),
          g = V("ease"),
          y = V("animate"),
          v = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"],
          x = () => [
            "center",
            "top",
            "bottom",
            "left",
            "right",
            "top-left",
            "left-top",
            "top-right",
            "right-top",
            "bottom-right",
            "right-bottom",
            "bottom-left",
            "left-bottom",
          ],
          w = () => [...x(), eO, eg],
          k = () => ["auto", "hidden", "clip", "visible", "scroll"],
          C = () => ["auto", "contain", "none"],
          j = () => [eO, eg, l],
          O = () => [ea, "full", "auto", ...j()],
          M = () => [ei, "none", "subgrid", eO, eg],
          P = () => ["auto", { span: ["full", ei, eO, eg] }, ei, eO, eg],
          z = () => [ei, "auto", eO, eg],
          q = () => ["auto", "min", "max", "fr", eO, eg],
          S = () => [
            "start",
            "end",
            "center",
            "between",
            "around",
            "evenly",
            "stretch",
            "baseline",
            "center-safe",
            "end-safe",
          ],
          Q = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"],
          A = () => ["auto", ...j()],
          T = () => [
            ea,
            "auto",
            "full",
            "dvw",
            "dvh",
            "lvw",
            "lvh",
            "svw",
            "svh",
            "min",
            "max",
            "fit",
            ...j(),
          ],
          R = () => [ea, "screen", "full", "dvw", "lvw", "svw", "min", "max", "fit", ...j()],
          _ = () => [ea, "screen", "full", "lh", "dvh", "lvh", "svh", "min", "max", "fit", ...j()],
          D = () => [e, eO, eg],
          E = () => [...x(), ez, ek, { position: [eO, eg] }],
          N = () => ["no-repeat", { repeat: ["", "x", "y", "space", "round"] }],
          I = () => ["auto", "cover", "contain", eq, eb, { size: [eO, eg] }],
          K = () => [el, eM, ey],
          F = () => ["", "none", "full", c, eO, eg],
          L = () => ["", en, eM, ey],
          U = () => ["solid", "dashed", "dotted", "double"],
          G = () => [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "darken",
            "lighten",
            "color-dodge",
            "color-burn",
            "hard-light",
            "soft-light",
            "difference",
            "exclusion",
            "hue",
            "saturation",
            "color",
            "luminosity",
          ],
          $ = () => [en, el, ez, ek],
          H = () => ["", "none", f, eO, eg],
          B = () => ["none", en, eO, eg],
          W = () => ["none", en, eO, eg],
          X = () => [en, eO, eg],
          J = () => [ea, "full", ...j()];
        return {
          cacheSize: 500,
          theme: {
            animate: ["spin", "ping", "pulse", "bounce"],
            aspect: ["video"],
            blur: [ec],
            breakpoint: [ec],
            color: [eu],
            container: [ec],
            "drop-shadow": [ec],
            ease: ["in", "out", "in-out"],
            font: [em],
            "font-weight": [
              "thin",
              "extralight",
              "light",
              "normal",
              "medium",
              "semibold",
              "bold",
              "extrabold",
              "black",
            ],
            "inset-shadow": [ec],
            leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
            perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
            radius: [ec],
            shadow: [ec],
            spacing: ["px", en],
            text: [ec],
            "text-shadow": [ec],
            tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"],
          },
          classGroups: {
            aspect: [{ aspect: ["auto", "square", ea, eg, eO, b] }],
            container: ["container"],
            columns: [{ columns: [en, eg, eO, i] }],
            "break-after": [{ "break-after": v() }],
            "break-before": [{ "break-before": v() }],
            "break-inside": [{ "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"] }],
            "box-decoration": [{ "box-decoration": ["slice", "clone"] }],
            box: [{ box: ["border", "content"] }],
            display: [
              "block",
              "inline-block",
              "inline",
              "flex",
              "inline-flex",
              "table",
              "inline-table",
              "table-caption",
              "table-cell",
              "table-column",
              "table-column-group",
              "table-footer-group",
              "table-header-group",
              "table-row-group",
              "table-row",
              "flow-root",
              "grid",
              "inline-grid",
              "contents",
              "list-item",
              "hidden",
            ],
            sr: ["sr-only", "not-sr-only"],
            float: [{ float: ["right", "left", "none", "start", "end"] }],
            clear: [{ clear: ["left", "right", "both", "none", "start", "end"] }],
            isolation: ["isolate", "isolation-auto"],
            "object-fit": [{ object: ["contain", "cover", "fill", "none", "scale-down"] }],
            "object-position": [{ object: w() }],
            overflow: [{ overflow: k() }],
            "overflow-x": [{ "overflow-x": k() }],
            "overflow-y": [{ "overflow-y": k() }],
            overscroll: [{ overscroll: C() }],
            "overscroll-x": [{ "overscroll-x": C() }],
            "overscroll-y": [{ "overscroll-y": C() }],
            position: ["static", "fixed", "absolute", "relative", "sticky"],
            inset: [{ inset: O() }],
            "inset-x": [{ "inset-x": O() }],
            "inset-y": [{ "inset-y": O() }],
            start: [{ "inset-s": O(), start: O() }],
            end: [{ "inset-e": O(), end: O() }],
            "inset-bs": [{ "inset-bs": O() }],
            "inset-be": [{ "inset-be": O() }],
            top: [{ top: O() }],
            right: [{ right: O() }],
            bottom: [{ bottom: O() }],
            left: [{ left: O() }],
            visibility: ["visible", "invisible", "collapse"],
            z: [{ z: [ei, "auto", eO, eg] }],
            basis: [{ basis: [ea, "full", "auto", i, ...j()] }],
            "flex-direction": [{ flex: ["row", "row-reverse", "col", "col-reverse"] }],
            "flex-wrap": [{ flex: ["nowrap", "wrap", "wrap-reverse"] }],
            flex: [{ flex: [en, ea, "auto", "initial", "none", eg] }],
            grow: [{ grow: ["", en, eO, eg] }],
            shrink: [{ shrink: ["", en, eO, eg] }],
            order: [{ order: [ei, "first", "last", "none", eO, eg] }],
            "grid-cols": [{ "grid-cols": M() }],
            "col-start-end": [{ col: P() }],
            "col-start": [{ "col-start": z() }],
            "col-end": [{ "col-end": z() }],
            "grid-rows": [{ "grid-rows": M() }],
            "row-start-end": [{ row: P() }],
            "row-start": [{ "row-start": z() }],
            "row-end": [{ "row-end": z() }],
            "grid-flow": [{ "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"] }],
            "auto-cols": [{ "auto-cols": q() }],
            "auto-rows": [{ "auto-rows": q() }],
            gap: [{ gap: j() }],
            "gap-x": [{ "gap-x": j() }],
            "gap-y": [{ "gap-y": j() }],
            "justify-content": [{ justify: [...S(), "normal"] }],
            "justify-items": [{ "justify-items": [...Q(), "normal"] }],
            "justify-self": [{ "justify-self": ["auto", ...Q()] }],
            "align-content": [{ content: ["normal", ...S()] }],
            "align-items": [{ items: [...Q(), { baseline: ["", "last"] }] }],
            "align-self": [{ self: ["auto", ...Q(), { baseline: ["", "last"] }] }],
            "place-content": [{ "place-content": S() }],
            "place-items": [{ "place-items": [...Q(), "baseline"] }],
            "place-self": [{ "place-self": ["auto", ...Q()] }],
            p: [{ p: j() }],
            px: [{ px: j() }],
            py: [{ py: j() }],
            ps: [{ ps: j() }],
            pe: [{ pe: j() }],
            pbs: [{ pbs: j() }],
            pbe: [{ pbe: j() }],
            pt: [{ pt: j() }],
            pr: [{ pr: j() }],
            pb: [{ pb: j() }],
            pl: [{ pl: j() }],
            m: [{ m: A() }],
            mx: [{ mx: A() }],
            my: [{ my: A() }],
            ms: [{ ms: A() }],
            me: [{ me: A() }],
            mbs: [{ mbs: A() }],
            mbe: [{ mbe: A() }],
            mt: [{ mt: A() }],
            mr: [{ mr: A() }],
            mb: [{ mb: A() }],
            ml: [{ ml: A() }],
            "space-x": [{ "space-x": j() }],
            "space-x-reverse": ["space-x-reverse"],
            "space-y": [{ "space-y": j() }],
            "space-y-reverse": ["space-y-reverse"],
            size: [{ size: T() }],
            "inline-size": [{ inline: ["auto", ...R()] }],
            "min-inline-size": [{ "min-inline": ["auto", ...R()] }],
            "max-inline-size": [{ "max-inline": ["none", ...R()] }],
            "block-size": [{ block: ["auto", ..._()] }],
            "min-block-size": [{ "min-block": ["auto", ..._()] }],
            "max-block-size": [{ "max-block": ["none", ..._()] }],
            w: [{ w: [i, "screen", ...T()] }],
            "min-w": [{ "min-w": [i, "screen", "none", ...T()] }],
            "max-w": [{ "max-w": [i, "screen", "none", "prose", { screen: [n] }, ...T()] }],
            h: [{ h: ["screen", "lh", ...T()] }],
            "min-h": [{ "min-h": ["screen", "lh", "none", ...T()] }],
            "max-h": [{ "max-h": ["screen", "lh", ...T()] }],
            "font-size": [{ text: ["base", r, eM, ey] }],
            "font-smoothing": ["antialiased", "subpixel-antialiased"],
            "font-style": ["italic", "not-italic"],
            "font-weight": [{ font: [o, eA, ex] }],
            "font-stretch": [
              {
                "font-stretch": [
                  "ultra-condensed",
                  "extra-condensed",
                  "condensed",
                  "semi-condensed",
                  "normal",
                  "semi-expanded",
                  "expanded",
                  "extra-expanded",
                  "ultra-expanded",
                  el,
                  eg,
                ],
              },
            ],
            "font-family": [{ font: [eP, ew, t] }],
            "font-features": [{ "font-features": [eg] }],
            "fvn-normal": ["normal-nums"],
            "fvn-ordinal": ["ordinal"],
            "fvn-slashed-zero": ["slashed-zero"],
            "fvn-figure": ["lining-nums", "oldstyle-nums"],
            "fvn-spacing": ["proportional-nums", "tabular-nums"],
            "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
            tracking: [{ tracking: [s, eO, eg] }],
            "line-clamp": [{ "line-clamp": [en, "none", eO, ev] }],
            leading: [{ leading: [a, ...j()] }],
            "list-image": [{ "list-image": ["none", eO, eg] }],
            "list-style-position": [{ list: ["inside", "outside"] }],
            "list-style-type": [{ list: ["disc", "decimal", "none", eO, eg] }],
            "text-alignment": [{ text: ["left", "center", "right", "justify", "start", "end"] }],
            "placeholder-color": [{ placeholder: D() }],
            "text-color": [{ text: D() }],
            "text-decoration": ["underline", "overline", "line-through", "no-underline"],
            "text-decoration-style": [{ decoration: [...U(), "wavy"] }],
            "text-decoration-thickness": [{ decoration: [en, "from-font", "auto", eO, ey] }],
            "text-decoration-color": [{ decoration: D() }],
            "underline-offset": [{ "underline-offset": [en, "auto", eO, eg] }],
            "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
            "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
            "text-wrap": [{ text: ["wrap", "nowrap", "balance", "pretty"] }],
            indent: [{ indent: j() }],
            "vertical-align": [
              {
                align: [
                  "baseline",
                  "top",
                  "middle",
                  "bottom",
                  "text-top",
                  "text-bottom",
                  "sub",
                  "super",
                  eO,
                  eg,
                ],
              },
            ],
            whitespace: [
              { whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"] },
            ],
            break: [{ break: ["normal", "words", "all", "keep"] }],
            wrap: [{ wrap: ["break-word", "anywhere", "normal"] }],
            hyphens: [{ hyphens: ["none", "manual", "auto"] }],
            content: [{ content: ["none", eO, eg] }],
            "bg-attachment": [{ bg: ["fixed", "local", "scroll"] }],
            "bg-clip": [{ "bg-clip": ["border", "padding", "content", "text"] }],
            "bg-origin": [{ "bg-origin": ["border", "padding", "content"] }],
            "bg-position": [{ bg: E() }],
            "bg-repeat": [{ bg: N() }],
            "bg-size": [{ bg: I() }],
            "bg-image": [
              {
                bg: [
                  "none",
                  {
                    linear: [{ to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"] }, ei, eO, eg],
                    radial: ["", eO, eg],
                    conic: [ei, eO, eg],
                  },
                  eS,
                  eC,
                ],
              },
            ],
            "bg-color": [{ bg: D() }],
            "gradient-from-pos": [{ from: K() }],
            "gradient-via-pos": [{ via: K() }],
            "gradient-to-pos": [{ to: K() }],
            "gradient-from": [{ from: D() }],
            "gradient-via": [{ via: D() }],
            "gradient-to": [{ to: D() }],
            rounded: [{ rounded: F() }],
            "rounded-s": [{ "rounded-s": F() }],
            "rounded-e": [{ "rounded-e": F() }],
            "rounded-t": [{ "rounded-t": F() }],
            "rounded-r": [{ "rounded-r": F() }],
            "rounded-b": [{ "rounded-b": F() }],
            "rounded-l": [{ "rounded-l": F() }],
            "rounded-ss": [{ "rounded-ss": F() }],
            "rounded-se": [{ "rounded-se": F() }],
            "rounded-ee": [{ "rounded-ee": F() }],
            "rounded-es": [{ "rounded-es": F() }],
            "rounded-tl": [{ "rounded-tl": F() }],
            "rounded-tr": [{ "rounded-tr": F() }],
            "rounded-br": [{ "rounded-br": F() }],
            "rounded-bl": [{ "rounded-bl": F() }],
            "border-w": [{ border: L() }],
            "border-w-x": [{ "border-x": L() }],
            "border-w-y": [{ "border-y": L() }],
            "border-w-s": [{ "border-s": L() }],
            "border-w-e": [{ "border-e": L() }],
            "border-w-bs": [{ "border-bs": L() }],
            "border-w-be": [{ "border-be": L() }],
            "border-w-t": [{ "border-t": L() }],
            "border-w-r": [{ "border-r": L() }],
            "border-w-b": [{ "border-b": L() }],
            "border-w-l": [{ "border-l": L() }],
            "divide-x": [{ "divide-x": L() }],
            "divide-x-reverse": ["divide-x-reverse"],
            "divide-y": [{ "divide-y": L() }],
            "divide-y-reverse": ["divide-y-reverse"],
            "border-style": [{ border: [...U(), "hidden", "none"] }],
            "divide-style": [{ divide: [...U(), "hidden", "none"] }],
            "border-color": [{ border: D() }],
            "border-color-x": [{ "border-x": D() }],
            "border-color-y": [{ "border-y": D() }],
            "border-color-s": [{ "border-s": D() }],
            "border-color-e": [{ "border-e": D() }],
            "border-color-bs": [{ "border-bs": D() }],
            "border-color-be": [{ "border-be": D() }],
            "border-color-t": [{ "border-t": D() }],
            "border-color-r": [{ "border-r": D() }],
            "border-color-b": [{ "border-b": D() }],
            "border-color-l": [{ "border-l": D() }],
            "divide-color": [{ divide: D() }],
            "outline-style": [{ outline: [...U(), "none", "hidden"] }],
            "outline-offset": [{ "outline-offset": [en, eO, eg] }],
            "outline-w": [{ outline: ["", en, eM, ey] }],
            "outline-color": [{ outline: D() }],
            shadow: [{ shadow: ["", "none", u, eQ, ej] }],
            "shadow-color": [{ shadow: D() }],
            "inset-shadow": [{ "inset-shadow": ["none", d, eQ, ej] }],
            "inset-shadow-color": [{ "inset-shadow": D() }],
            "ring-w": [{ ring: L() }],
            "ring-w-inset": ["ring-inset"],
            "ring-color": [{ ring: D() }],
            "ring-offset-w": [{ "ring-offset": [en, ey] }],
            "ring-offset-color": [{ "ring-offset": D() }],
            "inset-ring-w": [{ "inset-ring": L() }],
            "inset-ring-color": [{ "inset-ring": D() }],
            "text-shadow": [{ "text-shadow": ["none", h, eQ, ej] }],
            "text-shadow-color": [{ "text-shadow": D() }],
            opacity: [{ opacity: [en, eO, eg] }],
            "mix-blend": [{ "mix-blend": [...G(), "plus-darker", "plus-lighter"] }],
            "bg-blend": [{ "bg-blend": G() }],
            "mask-clip": [
              { "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"] },
              "mask-no-clip",
            ],
            "mask-composite": [{ mask: ["add", "subtract", "intersect", "exclude"] }],
            "mask-image-linear-pos": [{ "mask-linear": [en] }],
            "mask-image-linear-from-pos": [{ "mask-linear-from": $() }],
            "mask-image-linear-to-pos": [{ "mask-linear-to": $() }],
            "mask-image-linear-from-color": [{ "mask-linear-from": D() }],
            "mask-image-linear-to-color": [{ "mask-linear-to": D() }],
            "mask-image-t-from-pos": [{ "mask-t-from": $() }],
            "mask-image-t-to-pos": [{ "mask-t-to": $() }],
            "mask-image-t-from-color": [{ "mask-t-from": D() }],
            "mask-image-t-to-color": [{ "mask-t-to": D() }],
            "mask-image-r-from-pos": [{ "mask-r-from": $() }],
            "mask-image-r-to-pos": [{ "mask-r-to": $() }],
            "mask-image-r-from-color": [{ "mask-r-from": D() }],
            "mask-image-r-to-color": [{ "mask-r-to": D() }],
            "mask-image-b-from-pos": [{ "mask-b-from": $() }],
            "mask-image-b-to-pos": [{ "mask-b-to": $() }],
            "mask-image-b-from-color": [{ "mask-b-from": D() }],
            "mask-image-b-to-color": [{ "mask-b-to": D() }],
            "mask-image-l-from-pos": [{ "mask-l-from": $() }],
            "mask-image-l-to-pos": [{ "mask-l-to": $() }],
            "mask-image-l-from-color": [{ "mask-l-from": D() }],
            "mask-image-l-to-color": [{ "mask-l-to": D() }],
            "mask-image-x-from-pos": [{ "mask-x-from": $() }],
            "mask-image-x-to-pos": [{ "mask-x-to": $() }],
            "mask-image-x-from-color": [{ "mask-x-from": D() }],
            "mask-image-x-to-color": [{ "mask-x-to": D() }],
            "mask-image-y-from-pos": [{ "mask-y-from": $() }],
            "mask-image-y-to-pos": [{ "mask-y-to": $() }],
            "mask-image-y-from-color": [{ "mask-y-from": D() }],
            "mask-image-y-to-color": [{ "mask-y-to": D() }],
            "mask-image-radial": [{ "mask-radial": [eO, eg] }],
            "mask-image-radial-from-pos": [{ "mask-radial-from": $() }],
            "mask-image-radial-to-pos": [{ "mask-radial-to": $() }],
            "mask-image-radial-from-color": [{ "mask-radial-from": D() }],
            "mask-image-radial-to-color": [{ "mask-radial-to": D() }],
            "mask-image-radial-shape": [{ "mask-radial": ["circle", "ellipse"] }],
            "mask-image-radial-size": [
              { "mask-radial": [{ closest: ["side", "corner"], farthest: ["side", "corner"] }] },
            ],
            "mask-image-radial-pos": [{ "mask-radial-at": x() }],
            "mask-image-conic-pos": [{ "mask-conic": [en] }],
            "mask-image-conic-from-pos": [{ "mask-conic-from": $() }],
            "mask-image-conic-to-pos": [{ "mask-conic-to": $() }],
            "mask-image-conic-from-color": [{ "mask-conic-from": D() }],
            "mask-image-conic-to-color": [{ "mask-conic-to": D() }],
            "mask-mode": [{ mask: ["alpha", "luminance", "match"] }],
            "mask-origin": [
              { "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"] },
            ],
            "mask-position": [{ mask: E() }],
            "mask-repeat": [{ mask: N() }],
            "mask-size": [{ mask: I() }],
            "mask-type": [{ "mask-type": ["alpha", "luminance"] }],
            "mask-image": [{ mask: ["none", eO, eg] }],
            filter: [{ filter: ["", "none", eO, eg] }],
            blur: [{ blur: H() }],
            brightness: [{ brightness: [en, eO, eg] }],
            contrast: [{ contrast: [en, eO, eg] }],
            "drop-shadow": [{ "drop-shadow": ["", "none", p, eQ, ej] }],
            "drop-shadow-color": [{ "drop-shadow": D() }],
            grayscale: [{ grayscale: ["", en, eO, eg] }],
            "hue-rotate": [{ "hue-rotate": [en, eO, eg] }],
            invert: [{ invert: ["", en, eO, eg] }],
            saturate: [{ saturate: [en, eO, eg] }],
            sepia: [{ sepia: ["", en, eO, eg] }],
            "backdrop-filter": [{ "backdrop-filter": ["", "none", eO, eg] }],
            "backdrop-blur": [{ "backdrop-blur": H() }],
            "backdrop-brightness": [{ "backdrop-brightness": [en, eO, eg] }],
            "backdrop-contrast": [{ "backdrop-contrast": [en, eO, eg] }],
            "backdrop-grayscale": [{ "backdrop-grayscale": ["", en, eO, eg] }],
            "backdrop-hue-rotate": [{ "backdrop-hue-rotate": [en, eO, eg] }],
            "backdrop-invert": [{ "backdrop-invert": ["", en, eO, eg] }],
            "backdrop-opacity": [{ "backdrop-opacity": [en, eO, eg] }],
            "backdrop-saturate": [{ "backdrop-saturate": [en, eO, eg] }],
            "backdrop-sepia": [{ "backdrop-sepia": ["", en, eO, eg] }],
            "border-collapse": [{ border: ["collapse", "separate"] }],
            "border-spacing": [{ "border-spacing": j() }],
            "border-spacing-x": [{ "border-spacing-x": j() }],
            "border-spacing-y": [{ "border-spacing-y": j() }],
            "table-layout": [{ table: ["auto", "fixed"] }],
            caption: [{ caption: ["top", "bottom"] }],
            transition: [
              {
                transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", eO, eg],
              },
            ],
            "transition-behavior": [{ transition: ["normal", "discrete"] }],
            duration: [{ duration: [en, "initial", eO, eg] }],
            ease: [{ ease: ["linear", "initial", g, eO, eg] }],
            delay: [{ delay: [en, eO, eg] }],
            animate: [{ animate: ["none", y, eO, eg] }],
            backface: [{ backface: ["hidden", "visible"] }],
            perspective: [{ perspective: [m, eO, eg] }],
            "perspective-origin": [{ "perspective-origin": w() }],
            rotate: [{ rotate: B() }],
            "rotate-x": [{ "rotate-x": B() }],
            "rotate-y": [{ "rotate-y": B() }],
            "rotate-z": [{ "rotate-z": B() }],
            scale: [{ scale: W() }],
            "scale-x": [{ "scale-x": W() }],
            "scale-y": [{ "scale-y": W() }],
            "scale-z": [{ "scale-z": W() }],
            "scale-3d": ["scale-3d"],
            skew: [{ skew: X() }],
            "skew-x": [{ "skew-x": X() }],
            "skew-y": [{ "skew-y": X() }],
            transform: [{ transform: [eO, eg, "", "none", "gpu", "cpu"] }],
            "transform-origin": [{ origin: w() }],
            "transform-style": [{ transform: ["3d", "flat"] }],
            translate: [{ translate: J() }],
            "translate-x": [{ "translate-x": J() }],
            "translate-y": [{ "translate-y": J() }],
            "translate-z": [{ "translate-z": J() }],
            "translate-none": ["translate-none"],
            accent: [{ accent: D() }],
            appearance: [{ appearance: ["none", "auto"] }],
            "caret-color": [{ caret: D() }],
            "color-scheme": [
              { scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"] },
            ],
            cursor: [
              {
                cursor: [
                  "auto",
                  "default",
                  "pointer",
                  "wait",
                  "text",
                  "move",
                  "help",
                  "not-allowed",
                  "none",
                  "context-menu",
                  "progress",
                  "cell",
                  "crosshair",
                  "vertical-text",
                  "alias",
                  "copy",
                  "no-drop",
                  "grab",
                  "grabbing",
                  "all-scroll",
                  "col-resize",
                  "row-resize",
                  "n-resize",
                  "e-resize",
                  "s-resize",
                  "w-resize",
                  "ne-resize",
                  "nw-resize",
                  "se-resize",
                  "sw-resize",
                  "ew-resize",
                  "ns-resize",
                  "nesw-resize",
                  "nwse-resize",
                  "zoom-in",
                  "zoom-out",
                  eO,
                  eg,
                ],
              },
            ],
            "field-sizing": [{ "field-sizing": ["fixed", "content"] }],
            "pointer-events": [{ "pointer-events": ["auto", "none"] }],
            resize: [{ resize: ["none", "", "y", "x"] }],
            "scroll-behavior": [{ scroll: ["auto", "smooth"] }],
            "scroll-m": [{ "scroll-m": j() }],
            "scroll-mx": [{ "scroll-mx": j() }],
            "scroll-my": [{ "scroll-my": j() }],
            "scroll-ms": [{ "scroll-ms": j() }],
            "scroll-me": [{ "scroll-me": j() }],
            "scroll-mbs": [{ "scroll-mbs": j() }],
            "scroll-mbe": [{ "scroll-mbe": j() }],
            "scroll-mt": [{ "scroll-mt": j() }],
            "scroll-mr": [{ "scroll-mr": j() }],
            "scroll-mb": [{ "scroll-mb": j() }],
            "scroll-ml": [{ "scroll-ml": j() }],
            "scroll-p": [{ "scroll-p": j() }],
            "scroll-px": [{ "scroll-px": j() }],
            "scroll-py": [{ "scroll-py": j() }],
            "scroll-ps": [{ "scroll-ps": j() }],
            "scroll-pe": [{ "scroll-pe": j() }],
            "scroll-pbs": [{ "scroll-pbs": j() }],
            "scroll-pbe": [{ "scroll-pbe": j() }],
            "scroll-pt": [{ "scroll-pt": j() }],
            "scroll-pr": [{ "scroll-pr": j() }],
            "scroll-pb": [{ "scroll-pb": j() }],
            "scroll-pl": [{ "scroll-pl": j() }],
            "snap-align": [{ snap: ["start", "end", "center", "align-none"] }],
            "snap-stop": [{ snap: ["normal", "always"] }],
            "snap-type": [{ snap: ["none", "x", "y", "both"] }],
            "snap-strictness": [{ snap: ["mandatory", "proximity"] }],
            touch: [{ touch: ["auto", "none", "manipulation"] }],
            "touch-x": [{ "touch-pan": ["x", "left", "right"] }],
            "touch-y": [{ "touch-pan": ["y", "up", "down"] }],
            "touch-pz": ["touch-pinch-zoom"],
            select: [{ select: ["none", "text", "all", "auto"] }],
            "will-change": [{ "will-change": ["auto", "scroll", "contents", "transform", eO, eg] }],
            fill: [{ fill: ["none", ...D()] }],
            "stroke-w": [{ stroke: [en, eM, ey, ev] }],
            stroke: [{ stroke: ["none", ...D()] }],
            "forced-color-adjust": [{ "forced-color-adjust": ["auto", "none"] }],
          },
          conflictingClassGroups: {
            overflow: ["overflow-x", "overflow-y"],
            overscroll: ["overscroll-x", "overscroll-y"],
            inset: [
              "inset-x",
              "inset-y",
              "inset-bs",
              "inset-be",
              "start",
              "end",
              "top",
              "right",
              "bottom",
              "left",
            ],
            "inset-x": ["right", "left"],
            "inset-y": ["top", "bottom"],
            flex: ["basis", "grow", "shrink"],
            gap: ["gap-x", "gap-y"],
            p: ["px", "py", "ps", "pe", "pbs", "pbe", "pt", "pr", "pb", "pl"],
            px: ["pr", "pl"],
            py: ["pt", "pb"],
            m: ["mx", "my", "ms", "me", "mbs", "mbe", "mt", "mr", "mb", "ml"],
            mx: ["mr", "ml"],
            my: ["mt", "mb"],
            size: ["w", "h"],
            "font-size": ["leading"],
            "fvn-normal": [
              "fvn-ordinal",
              "fvn-slashed-zero",
              "fvn-figure",
              "fvn-spacing",
              "fvn-fraction",
            ],
            "fvn-ordinal": ["fvn-normal"],
            "fvn-slashed-zero": ["fvn-normal"],
            "fvn-figure": ["fvn-normal"],
            "fvn-spacing": ["fvn-normal"],
            "fvn-fraction": ["fvn-normal"],
            "line-clamp": ["display", "overflow"],
            rounded: [
              "rounded-s",
              "rounded-e",
              "rounded-t",
              "rounded-r",
              "rounded-b",
              "rounded-l",
              "rounded-ss",
              "rounded-se",
              "rounded-ee",
              "rounded-es",
              "rounded-tl",
              "rounded-tr",
              "rounded-br",
              "rounded-bl",
            ],
            "rounded-s": ["rounded-ss", "rounded-es"],
            "rounded-e": ["rounded-se", "rounded-ee"],
            "rounded-t": ["rounded-tl", "rounded-tr"],
            "rounded-r": ["rounded-tr", "rounded-br"],
            "rounded-b": ["rounded-br", "rounded-bl"],
            "rounded-l": ["rounded-tl", "rounded-bl"],
            "border-spacing": ["border-spacing-x", "border-spacing-y"],
            "border-w": [
              "border-w-x",
              "border-w-y",
              "border-w-s",
              "border-w-e",
              "border-w-bs",
              "border-w-be",
              "border-w-t",
              "border-w-r",
              "border-w-b",
              "border-w-l",
            ],
            "border-w-x": ["border-w-r", "border-w-l"],
            "border-w-y": ["border-w-t", "border-w-b"],
            "border-color": [
              "border-color-x",
              "border-color-y",
              "border-color-s",
              "border-color-e",
              "border-color-bs",
              "border-color-be",
              "border-color-t",
              "border-color-r",
              "border-color-b",
              "border-color-l",
            ],
            "border-color-x": ["border-color-r", "border-color-l"],
            "border-color-y": ["border-color-t", "border-color-b"],
            translate: ["translate-x", "translate-y", "translate-none"],
            "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
            "scroll-m": [
              "scroll-mx",
              "scroll-my",
              "scroll-ms",
              "scroll-me",
              "scroll-mbs",
              "scroll-mbe",
              "scroll-mt",
              "scroll-mr",
              "scroll-mb",
              "scroll-ml",
            ],
            "scroll-mx": ["scroll-mr", "scroll-ml"],
            "scroll-my": ["scroll-mt", "scroll-mb"],
            "scroll-p": [
              "scroll-px",
              "scroll-py",
              "scroll-ps",
              "scroll-pe",
              "scroll-pbs",
              "scroll-pbe",
              "scroll-pt",
              "scroll-pr",
              "scroll-pb",
              "scroll-pl",
            ],
            "scroll-px": ["scroll-pr", "scroll-pl"],
            "scroll-py": ["scroll-pt", "scroll-pb"],
            touch: ["touch-x", "touch-y", "touch-pz"],
            "touch-x": ["touch"],
            "touch-y": ["touch"],
            "touch-pz": ["touch"],
          },
          conflictingClassGroupModifiers: { "font-size": ["leading"] },
          orderSensitiveModifiers: [
            "*",
            "**",
            "after",
            "backdrop",
            "before",
            "details-content",
            "file",
            "first-letter",
            "first-line",
            "marker",
            "placeholder",
            "selection",
          ],
        };
      });
    function eG({ href: e, icon: r, label: o }) {
      const s = (0, T.usePathname)(),
        a = s === e || ("/" !== e && s?.startsWith(e));
      return (0, t.jsx)(A.default, {
        href: e,
        title: o,
        className: ((...e) =>
          eU(
            (() => {
              for (var e, t, r = 0, o = "", s = arguments.length; r < s; r++)
                (e = arguments[r]) &&
                  (t = (function e(t) {
                    var r,
                      o,
                      s = "";
                    if ("string" == typeof t || "number" == typeof t) s += t;
                    else if ("object" == typeof t)
                      if (Array.isArray(t)) {
                        var a = t.length;
                        for (r = 0; r < a; r++)
                          t[r] && (o = e(t[r])) && (s && (s += " "), (s += o));
                      } else for (o in t) t[o] && (s && (s += " "), (s += o));
                    return s;
                  })(e)) &&
                  (o && (o += " "), (o += t));
              return o;
            })(e),
          ))(
          "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
          a
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ),
        children: r,
      });
    }
    function e$() {
      return (0, t.jsxs)("aside", {
        className: "flex flex-col items-center w-[60px] border-r bg-card py-4",
        children: [
          (0, t.jsx)("div", {
            className: "mb-4",
            children: (0, t.jsx)(a, { size: 24, className: "text-foreground" }),
          }),
          (0, t.jsxs)("nav", {
            className: "flex flex-col items-center gap-1 flex-1",
            children: [
              (0, t.jsx)(eG, { href: "/", icon: (0, t.jsx)(i, { size: 20 }), label: "Handoffs" }),
              (0, t.jsx)(eG, {
                href: "/lookup",
                icon: (0, t.jsx)(n, { size: 20 }),
                label: "File Lookup",
              }),
            ],
          }),
          (0, t.jsx)("div", { className: "mt-auto", children: (0, t.jsx)(o.UserButton, {}) }),
        ],
      });
    }
    e.s(
      [
        "default",
        0,
        ({ children: e }) =>
          (0, t.jsx)(p, {
            children: (0, t.jsxs)(Q, {
              children: [
                (0, t.jsx)(e$, {}),
                (0, t.jsx)("main", { className: "flex-1 flex flex-col min-h-0", children: e }),
              ],
            }),
          }),
      ],
      16612,
    );
  },
]);
