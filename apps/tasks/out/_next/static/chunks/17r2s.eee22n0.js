(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  89803,
  (e) => {
    const t =
      e.i(67836).default.env.NEXT_PUBLIC_TASKS_API_URL ??
      "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws";
    async function s(e, r = {}) {
      return fetch(`${t}${e}`, {
        ...r,
        headers: { ...r.headers, "Content-Type": "application/json" },
      });
    }
    async function r() {
      const e = await s("/api/services");
      if (!e.ok) throw Error("Failed to fetch services");
      return e.json();
    }
    async function a(e) {
      const t = await s(`/api/services/${e}/messages`);
      if (!t.ok) throw Error("Failed to fetch messages");
      return t.json();
    }
    async function i(e, t, r) {
      const a = await s(`/api/services/${e}/messages`, {
        method: "POST",
        body: JSON.stringify({ body: t, ...r }),
      });
      if (!a.ok) throw Error("Failed to send message");
      return a.json();
    }
    async function n(e, t) {
      const r = t ? `?status=${t}` : "",
        a = await s(`/api/services/${e}/tasks${r}`);
      if (!a.ok) throw Error("Failed to fetch tasks");
      return a.json();
    }
    async function l(e, t) {
      const r = await s(`/api/services/${e}/tasks/${t}`);
      if (!r.ok) throw Error("Failed to fetch task");
      return r.json();
    }
    async function o(e, t, r, a) {
      const i = await s(`/api/services/${e}/tasks/${t}/action`, {
        method: "POST",
        body: JSON.stringify({ action: r, ...a }),
      });
      if (!i.ok) throw Error("Failed to perform action");
      return i.json();
    }
    async function c(e, t) {
      const r = await s(`/api/services/${e}/tasks/${t}/session`);
      if (!r.ok && 404 !== r.status) throw Error("Failed to get session");
      return 404 === r.status ? null : r.json();
    }
    e.s([
      "fetchMessages",
      0,
      a,
      "fetchServices",
      0,
      r,
      "fetchTask",
      0,
      l,
      "fetchTasks",
      0,
      n,
      "getSessionStatus",
      0,
      c,
      "getStreamUrl",
      0,
      (e, s) => `${t}/api/services/${e}/tasks/${s}/stream`,
      "performAction",
      0,
      o,
      "sendMessage",
      0,
      i,
    ]);
  },
  1130,
  27433,
  (e) => {
    var t = e.i(98937);
    const s = (...e) =>
        e
          .filter((e, t, s) => !!e && "" !== e.trim() && s.indexOf(e) === t)
          .join(" ")
          .trim(),
      r = (e) => {
        const t = e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, s) =>
          s ? s.toUpperCase() : t.toLowerCase(),
        );
        return t.charAt(0).toUpperCase() + t.slice(1);
      };
    var a = {
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
    const i = (0, t.createContext)({}),
      n = (0, t.forwardRef)(
        (
          {
            color: e,
            size: r,
            strokeWidth: n,
            absoluteStrokeWidth: l,
            className: o = "",
            children: c,
            iconNode: u,
            ...d
          },
          h,
        ) => {
          const {
              size: p = 24,
              strokeWidth: m = 2,
              absoluteStrokeWidth: f = !1,
              color: x = "currentColor",
              className: y = "",
            } = (0, t.useContext)(i) ?? {},
            g = (l ?? f) ? (24 * Number(n ?? m)) / Number(r ?? p) : (n ?? m);
          return (0, t.createElement)(
            "svg",
            {
              ref: h,
              ...a,
              width: r ?? p ?? a.width,
              height: r ?? p ?? a.height,
              stroke: e ?? x,
              strokeWidth: g,
              className: s("lucide", y, o),
              ...(!c &&
                !((e) => {
                  for (const t in e)
                    if (t.startsWith("aria-") || "role" === t || "title" === t) return !0;
                  return !1;
                })(d) && { "aria-hidden": "true" }),
              ...d,
            },
            [...u.map(([e, s]) => (0, t.createElement)(e, s)), ...(Array.isArray(c) ? c : [c])],
          );
        },
      ),
      l = (e, a) => {
        const i = (0, t.forwardRef)(({ className: i, ...l }, o) =>
          (0, t.createElement)(n, {
            ref: o,
            iconNode: a,
            className: s(
              `lucide-${r(e)
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .toLowerCase()}`,
              `lucide-${e}`,
              i,
            ),
            ...l,
          }),
        );
        return (i.displayName = r(e)), i;
      };
    e.s(["default", 0, l], 1130);
    const o = l("loader-circle", [["path", { d: "M21 12a9 9 0 1 1-6.219-8.56", key: "13zald" }]]);
    e.s(["Loader2", 0, o], 27433);
  },
  67406,
  (e) => {
    let t;
    var s = e.i(6906),
      r = e.i(93771),
      a = e.i(94720),
      i = e.i(41136),
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
        #a = void 0;
        #i = void 0;
        #n;
        #l;
        #s;
        #t;
        #o;
        #c;
        #u;
        #d;
        #h;
        #p;
        #m = new Set();
        bindMethods() {
          this.refetch = this.refetch.bind(this);
        }
        onSubscribe() {
          1 === this.listeners.size &&
            (this.#r.addObserver(this),
            d(this.#r, this.options) ? this.#f() : this.updateResult(),
            this.#x());
        }
        onUnsubscribe() {
          this.hasListeners() || this.destroy();
        }
        shouldFetchOnReconnect() {
          return h(this.#r, this.options, this.options.refetchOnReconnect);
        }
        shouldFetchOnWindowFocus() {
          return h(this.#r, this.options, this.options.refetchOnWindowFocus);
        }
        destroy() {
          (this.listeners = new Set()), this.#y(), this.#g(), this.#r.removeObserver(this);
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
          this.#b(),
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
              this.#v();
          const a = this.#j();
          r &&
            (this.#r !== s ||
              (0, o.resolveEnabled)(this.options.enabled, this.#r) !==
                (0, o.resolveEnabled)(t.enabled, this.#r) ||
              a !== this.#p) &&
            this.#k(a);
        }
        getOptimisticResult(e) {
          var t, s;
          const r = this.#e.getQueryCache().build(this.#e, e),
            a = this.createResult(r, e);
          return (
            (t = this),
            (s = a),
            (0, o.shallowEqualObjects)(t.getCurrentResult(), s) ||
              ((this.#i = a), (this.#l = this.options), (this.#n = this.#r.state)),
            a
          );
        }
        getCurrentResult() {
          return this.#i;
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
            () => (this.updateResult(), this.#i),
          );
        }
        #f(e) {
          this.#b();
          let t = this.#r.fetch(this.options, e);
          return e?.throwOnError || (t = t.catch(o.noop)), t;
        }
        #v() {
          this.#y();
          const e = (0, o.resolveStaleTime)(this.options.staleTime, this.#r);
          if (r.environmentManager.isServer() || this.#i.isStale || !(0, o.isValidTimeout)(e))
            return;
          const t = (0, o.timeUntilStale)(this.#i.dataUpdatedAt, e);
          this.#d = c.timeoutManager.setTimeout(() => {
            this.#i.isStale || this.updateResult();
          }, t + 1);
        }
        #j() {
          return (
            ("function" == typeof this.options.refetchInterval
              ? this.options.refetchInterval(this.#r)
              : this.options.refetchInterval) ?? !1
          );
        }
        #k(e) {
          this.#g(),
            (this.#p = e),
            !r.environmentManager.isServer() &&
              !1 !== (0, o.resolveEnabled)(this.options.enabled, this.#r) &&
              (0, o.isValidTimeout)(this.#p) &&
              0 !== this.#p &&
              (this.#h = c.timeoutManager.setInterval(() => {
                (this.options.refetchIntervalInBackground || s.focusManager.isFocused()) &&
                  this.#f();
              }, this.#p));
        }
        #x() {
          this.#v(), this.#k(this.#j());
        }
        #y() {
          this.#d && (c.timeoutManager.clearTimeout(this.#d), (this.#d = void 0));
        }
        #g() {
          this.#h && (c.timeoutManager.clearInterval(this.#h), (this.#h = void 0));
        }
        createResult(e, t) {
          let s,
            r = this.#r,
            a = this.options,
            n = this.#i,
            c = this.#n,
            u = this.#l,
            h = e !== r ? e.state : this.#a,
            { state: f } = e,
            x = { ...f },
            y = !1;
          if (t._optimisticResults) {
            const s = this.hasListeners(),
              n = !s && d(e, t),
              l = s && p(e, r, t, a);
            (n || l) && (x = { ...x, ...(0, i.fetchState)(f.data, e.options) }),
              "isRestoring" === t._optimisticResults && (x.fetchStatus = "idle");
          }
          let { error: g, errorUpdatedAt: b, status: v } = x;
          s = x.data;
          let j = !1;
          if (void 0 !== t.placeholderData && void 0 === s && "pending" === v) {
            let e;
            n?.isPlaceholderData && t.placeholderData === u?.placeholderData
              ? ((e = n.data), (j = !0))
              : (e =
                  "function" == typeof t.placeholderData
                    ? t.placeholderData(this.#u?.state.data, this.#u)
                    : t.placeholderData),
              void 0 !== e && ((v = "success"), (s = (0, o.replaceData)(n?.data, e, t)), (y = !0));
          }
          if (t.select && void 0 !== s && !j)
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
          this.#t && ((g = this.#t), (s = this.#c), (b = Date.now()), (v = "error"));
          const k = "fetching" === x.fetchStatus,
            R = "pending" === v,
            w = "error" === v,
            N = R && k,
            T = void 0 !== s,
            S = {
              status: v,
              fetchStatus: x.fetchStatus,
              isPending: R,
              isSuccess: "success" === v,
              isError: w,
              isInitialLoading: N,
              isLoading: N,
              data: s,
              dataUpdatedAt: x.dataUpdatedAt,
              error: g,
              errorUpdatedAt: b,
              failureCount: x.fetchFailureCount,
              failureReason: x.fetchFailureReason,
              errorUpdateCount: x.errorUpdateCount,
              isFetched: e.isFetched(),
              isFetchedAfterMount:
                x.dataUpdateCount > h.dataUpdateCount || x.errorUpdateCount > h.errorUpdateCount,
              isFetching: k,
              isRefetching: k && !R,
              isLoadingError: w && !T,
              isPaused: "paused" === x.fetchStatus,
              isPlaceholderData: y,
              isRefetchError: w && T,
              isStale: m(e, t),
              refetch: this.refetch,
              promise: this.#s,
              isEnabled: !1 !== (0, o.resolveEnabled)(t.enabled, e),
            };
          if (this.options.experimental_prefetchInRender) {
            const t = void 0 !== S.data,
              s = "error" === S.status && !t,
              a = (e) => {
                s ? e.reject(S.error) : t && e.resolve(S.data);
              },
              i = () => {
                a((this.#s = S.promise = (0, l.pendingThenable)()));
              },
              n = this.#s;
            switch (n.status) {
              case "pending":
                e.queryHash === r.queryHash && a(n);
                break;
              case "fulfilled":
                (s || S.data !== n.value) && i();
                break;
              case "rejected":
                (s && S.error === n.reason) || i();
            }
          }
          return S;
        }
        updateResult() {
          const e = this.#i,
            t = this.createResult(this.#r, this.options);
          if (
            ((this.#n = this.#r.state),
            (this.#l = this.options),
            void 0 !== this.#n.data && (this.#u = this.#r),
            (0, o.shallowEqualObjects)(t, e))
          )
            return;
          this.#i = t;
          const s = () => {
            if (!e) return !0;
            const { notifyOnChangeProps: t } = this.options,
              s = "function" == typeof t ? t() : t;
            if ("all" === s || (!s && !this.#m.size)) return !0;
            const r = new Set(s ?? this.#m);
            return (
              this.options.throwOnError && r.add("error"),
              Object.keys(this.#i).some((t) => this.#i[t] !== e[t] && r.has(t))
            );
          };
          this.#R({ listeners: s() });
        }
        #b() {
          const e = this.#e.getQueryCache().build(this.#e, this.options);
          if (e === this.#r) return;
          const t = this.#r;
          (this.#r = e),
            (this.#a = e.state),
            this.hasListeners() && (t?.removeObserver(this), e.addObserver(this));
        }
        onQueryUpdate() {
          this.updateResult(), this.hasListeners() && this.#x();
        }
        #R(e) {
          a.notifyManager.batch(() => {
            e.listeners &&
              this.listeners.forEach((e) => {
                e(this.#i);
              }),
              this.#e.getQueryCache().notify({ query: this.#r, type: "observerResultsUpdated" });
          });
        }
      };
    function d(e, t) {
      return (
        (!1 !== (0, o.resolveEnabled)(t.enabled, e) &&
          void 0 === e.state.data &&
          ("error" !== e.state.status || !1 !== t.retryOnMount)) ||
        (void 0 !== e.state.data && h(e, t, t.refetchOnMount))
      );
    }
    function h(e, t, s) {
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
    e.i(67836);
    var f = e.i(98937),
      x = e.i(73048);
    e.i(87111);
    var y = f.createContext(
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
      g = f.createContext(!1);
    g.Provider;
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
            let i,
              n = f.useContext(g),
              l = f.useContext(y),
              c = (0, x.useQueryClient)(s),
              u = c.defaultQueryOptions(e);
            c.getDefaultOptions().queries?._experimental_beforeQuery?.(u);
            const d = c.getQueryCache().get(u.queryHash);
            if (((u._optimisticResults = n ? "isRestoring" : "optimistic"), u.suspense)) {
              const e = (e) => ("static" === e ? e : Math.max(e ?? 1e3, 1e3)),
                t = u.staleTime;
              (u.staleTime = "function" == typeof t ? (...s) => e(t(...s)) : e(t)),
                "number" == typeof u.gcTime && (u.gcTime = Math.max(u.gcTime, 1e3));
            }
            (i =
              d?.state.error && "function" == typeof u.throwOnError
                ? (0, o.shouldThrowError)(u.throwOnError, [d.state.error, d])
                : u.throwOnError),
              (u.suspense || u.experimental_prefetchInRender || i) &&
                !l.isReset() &&
                (u.retryOnMount = !1),
              f.useEffect(() => {
                l.clearReset();
              }, [l]);
            const h = !c.getQueryCache().get(u.queryHash),
              [p] = f.useState(() => new t(c, u)),
              m = p.getOptimisticResult(u),
              v = !n && !1 !== e.subscribed;
            if (
              (f.useSyncExternalStore(
                f.useCallback(
                  (e) => {
                    const t = v ? p.subscribe(a.notifyManager.batchCalls(e)) : o.noop;
                    return p.updateResult(), t;
                  },
                  [p, v],
                ),
                () => p.getCurrentResult(),
                () => p.getCurrentResult(),
              ),
              f.useEffect(() => {
                p.setOptions(u);
              }, [u, p]),
              u?.suspense && m.isPending)
            )
              throw b(u, p, l);
            if (
              (({ result: e, errorResetBoundary: t, throwOnError: s, query: r, suspense: a }) =>
                e.isError &&
                !t.isReset() &&
                !e.isFetching &&
                r &&
                ((a && void 0 === e.data) || (0, o.shouldThrowError)(s, [e.error, r])))({
                result: m,
                errorResetBoundary: l,
                throwOnError: u.throwOnError,
                query: d,
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
              const e = h ? b(u, p, l) : d?.promise;
              e?.catch(o.noop).finally(() => {
                p.updateResult();
              });
            }
            return u.notifyOnChangeProps ? m : p.trackResult(m);
          })(e, u, t),
      ],
      67406,
    );
  },
  10561,
  (e) => {
    var t = e.i(87111),
      s = e.i(89803),
      r = e.i(46111),
      a = e.i(1130);
    const i = (0, a.default)("circle-alert", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["line", { x1: "12", x2: "12", y1: "8", y2: "12", key: "1pkeuh" }],
        ["line", { x1: "12", x2: "12.01", y1: "16", y2: "16", key: "4dfq90" }],
      ]),
      n = (0, a.default)("bot", [
        ["path", { d: "M12 8V4H8", key: "hb8ula" }],
        ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
        ["path", { d: "M2 14h2", key: "vft8re" }],
        ["path", { d: "M20 14h2", key: "4cs60a" }],
        ["path", { d: "M15 13v2", key: "1xurst" }],
        ["path", { d: "M9 13v2", key: "rq6x2g" }],
      ]);
    var l = e.i(45472),
      o = e.i(27433);
    const c = (0, a.default)("wrench", [
      [
        "path",
        {
          d: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z",
          key: "1ngwbx",
        },
      ],
    ]);
    var u = e.i(98937);
    function d({ slug: e, taskId: a, sessionId: h, onComplete: p }) {
      const [m, f] = (0, u.useState)([]),
        [x, y] = (0, u.useState)("connecting"),
        g = (0, u.useRef)(null),
        b = (0, u.useRef)(0),
        v = (0, u.useCallback)((e) => {
          f((t) => [...t, { ...e, id: b.current++ }]);
        }, []);
      (0, u.useEffect)(() => {
        if (!h) return;
        const t = new EventSource((0, s.getStreamUrl)(e, a));
        return (
          (t.onopen = () => y("streaming")),
          (t.onmessage = (e) => {
            try {
              const s = JSON.parse(e.data);
              if ("agent.message" === s.type && s.content) {
                const e = s.content
                  .filter((e) => "text" === e.type)
                  .map((e) => e.text)
                  .join("");
                e && v({ type: "message", text: e });
              } else
                "agent.tool_use" === s.type
                  ? v({ type: "tool", text: `Using ${s.name}` })
                  : "session.status_idle" === s.type &&
                    (y("idle"), v({ type: "status", text: "Agent finished" }), p?.(), t.close());
            } catch {}
          }),
          (t.onerror = () => {
            y("error"), t.close();
          }),
          () => t.close()
        );
      }, [h, e, a, v, p]),
        (0, u.useEffect)(() => {
          g.current?.scrollTo({ top: g.current.scrollHeight, behavior: "smooth" });
        }, [m]);
      const j = { connecting: o.Loader2, streaming: o.Loader2, idle: l.CheckCircle2, error: i }[x];
      return (0, t.jsxs)("div", {
        className: "border border-border rounded-lg overflow-hidden",
        children: [
          (0, t.jsxs)("div", {
            className: "flex items-center justify-between px-4 py-3 border-b border-border",
            children: [
              (0, t.jsxs)("span", {
                className: "text-xs font-semibold flex items-center gap-1.5",
                children: [(0, t.jsx)(n, { size: 13 }), " Agent Activity"],
              }),
              (0, t.jsxs)("span", {
                className: (0, r.cn)(
                  "inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full",
                  {
                    connecting: "bg-amber-50 text-amber-700",
                    streaming: "bg-blue-50 text-blue-700",
                    idle: "bg-emerald-50 text-emerald-700",
                    error: "bg-red-50 text-red-700",
                  }[x],
                ),
                children: [
                  (0, t.jsx)(j, {
                    size: 10,
                    className: "connecting" === x || "streaming" === x ? "animate-spin" : "",
                  }),
                  {
                    connecting: "Connecting",
                    streaming: "Running",
                    idle: "Complete",
                    error: "Error",
                  }[x],
                ],
              }),
            ],
          }),
          (0, t.jsxs)("div", {
            ref: g,
            className: "max-h-80 overflow-y-auto px-4 py-3 space-y-2",
            children: [
              0 === m.length &&
                "connecting" === x &&
                (0, t.jsxs)("div", {
                  className:
                    "flex items-center gap-2 text-xs text-muted-foreground py-4 justify-center",
                  children: [
                    (0, t.jsx)(o.Loader2, { size: 12, className: "animate-spin" }),
                    " Connecting to agent...",
                  ],
                }),
              m.map((e) =>
                (0, t.jsxs)(
                  "div",
                  {
                    className: (0, r.cn)(
                      "flex items-start gap-2 text-sm",
                      "status" === e.type && "justify-center",
                    ),
                    children: [
                      "message" === e.type &&
                        (0, t.jsxs)(t.Fragment, {
                          children: [
                            (0, t.jsx)(n, {
                              size: 14,
                              className: "mt-0.5 shrink-0 text-muted-foreground",
                            }),
                            (0, t.jsx)("p", {
                              className: "whitespace-pre-wrap leading-relaxed",
                              children: e.text,
                            }),
                          ],
                        }),
                      "tool" === e.type &&
                        (0, t.jsxs)(t.Fragment, {
                          children: [
                            (0, t.jsx)(c, { size: 14, className: "mt-0.5 shrink-0 text-blue-500" }),
                            (0, t.jsx)("span", {
                              className: "text-muted-foreground",
                              children: e.text,
                            }),
                          ],
                        }),
                      "status" === e.type &&
                        (0, t.jsxs)("span", {
                          className: "text-xs text-muted-foreground flex items-center gap-1.5 py-1",
                          children: [
                            (0, t.jsx)(l.CheckCircle2, { size: 12, className: "text-emerald-500" }),
                            " ",
                            e.text,
                          ],
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
    var h = e.i(67836),
      p = e.i(67406);
    const m = (0, a.default)("external-link", [
        ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
        ["path", { d: "M10 14 21 3", key: "gplh6r" }],
        ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }],
      ]),
      f =
        h.default.env.NEXT_PUBLIC_API_URL ??
        "https://agfgro77yt22bbazajupls2ebu0jvfcn.lambda-url.us-east-1.on.aws",
      x = /https?:\/\/[^\s<]+/g;
    async function y(e) {
      const t = await fetch(`${f}/api/unfurl?url=${encodeURIComponent(e)}`);
      if (!t.ok) throw Error("Failed to unfurl");
      return t.json();
    }
    function g({ url: e }) {
      const { data: s, isLoading: r } = (0, p.useQuery)({
        queryKey: ["unfurl", e],
        queryFn: () => y(e),
        staleTime: 36e5,
        retry: !1,
      });
      return r
        ? (0, t.jsxs)("div", {
            className: "border border-border rounded-md p-3 animate-pulse",
            children: [
              (0, t.jsx)("div", { className: "h-3 w-2/3 bg-muted rounded" }),
              (0, t.jsx)("div", { className: "h-2 w-1/2 bg-muted rounded mt-2" }),
            ],
          })
        : s?.title
          ? (0, t.jsxs)("a", {
              href: e,
              target: "_blank",
              rel: "noopener noreferrer",
              className:
                "flex gap-3 border border-border rounded-md p-3 hover:bg-muted/50 transition-colors group overflow-hidden",
              children: [
                s.image &&
                  (0, t.jsx)("img", {
                    src: s.image,
                    alt: "",
                    className: "w-16 h-16 rounded object-cover shrink-0",
                    onError: (e) => {
                      e.target.style.display = "none";
                    },
                  }),
                (0, t.jsxs)("div", {
                  className: "min-w-0 flex-1 space-y-0.5",
                  children: [
                    (0, t.jsxs)("div", {
                      className: "flex items-center gap-1.5",
                      children: [
                        s.favicon &&
                          (0, t.jsx)("img", {
                            src: s.favicon,
                            alt: "",
                            className: "w-3.5 h-3.5 rounded-sm shrink-0",
                            onError: (e) => {
                              e.target.style.display = "none";
                            },
                          }),
                        (0, t.jsx)("span", {
                          className: "text-[10px] text-muted-foreground truncate",
                          children: s.siteName ?? new URL(e).hostname,
                        }),
                      ],
                    }),
                    (0, t.jsx)("p", {
                      className:
                        "text-xs font-medium truncate group-hover:text-primary transition-colors",
                      children: s.title,
                    }),
                    s.description &&
                      (0, t.jsx)("p", {
                        className: "text-[11px] text-muted-foreground line-clamp-2 leading-relaxed",
                        children: s.description,
                      }),
                  ],
                }),
                (0, t.jsx)(m, {
                  size: 12,
                  className:
                    "shrink-0 mt-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                }),
              ],
            })
          : null;
    }
    function b({ text: e }) {
      const s = [...new Set(e.match(x) ?? [])];
      return 0 === s.length
        ? null
        : (0, t.jsx)("div", {
            className: "space-y-1.5 mt-2",
            children: s.slice(0, 3).map((e) => (0, t.jsx)(g, { url: e }, e)),
          });
    }
    var v = e.i(94270),
      j = e.i(73048),
      k = e.i(39746);
    const R = (0, a.default)("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]);
    var w = e.i(7198);
    const N = (0, a.default)("copy", [
      ["rect", { width: "14", height: "14", x: "8", y: "8", rx: "2", ry: "2", key: "17jyea" }],
      ["path", { d: "M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2", key: "zix9uf" }],
    ]);
    var T = e.i(13068);
    const S = (0, a.default)("user", [
        ["path", { d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2", key: "975kel" }],
        ["circle", { cx: "12", cy: "7", r: "4", key: "17ys0d" }],
      ]),
      Q = (0, a.default)("circle-x", [
        ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
        ["path", { d: "m15 9-6 6", key: "1uzhvr" }],
        ["path", { d: "m9 9 6 6", key: "z0biqf" }],
      ]);
    var I = e.i(16326),
      C = e.i(98979);
    const E = {
      pending: { label: "Pending", className: "bg-amber-50 text-amber-700", icon: w.Clock },
      assigned: { label: "Assigned", className: "bg-blue-50 text-blue-700", icon: T.MessageSquare },
      processing: { label: "Processing", className: "bg-blue-50 text-blue-700", icon: o.Loader2 },
      awaiting_approval: {
        label: "Awaiting Approval",
        className: "bg-amber-50 text-amber-700",
        icon: k.AlertTriangle,
      },
      completed: {
        label: "Completed",
        className: "bg-emerald-50 text-emerald-700",
        icon: l.CheckCircle2,
      },
      failed: { label: "Failed", className: "bg-red-50 text-red-700", icon: k.AlertTriangle },
    };
    e.s(
      [
        "default",
        0,
        () => {
          const e = (0, I.useParams)(),
            a = (0, I.usePathname)(),
            { slug: i, taskId: n } = (0, u.useMemo)(() => {
              const t = a.split("/").filter(Boolean);
              return t.length >= 3 && "tasks" === t[1]
                ? { slug: t[0], taskId: t[2] }
                : { slug: e.slug, taskId: e.taskId };
            }, [a, e]),
            c = (0, j.useQueryClient)(),
            [h, m] = (0, u.useState)(""),
            [f, x] = (0, u.useState)(!1),
            { data: y, isLoading: g } = (0, p.useQuery)({
              queryKey: ["task", i, n],
              queryFn: () => (0, s.fetchTask)(i, n),
              refetchInterval: 1e4,
            }),
            { data: k, isLoading: O } = (0, p.useQuery)({
              queryKey: ["messages", i, y?.traceId],
              queryFn: () => (0, s.fetchMessages)(i),
              enabled: !!y,
              refetchInterval: 1e4,
              select: (e) => {
                const t = e?.items ?? [];
                return y?.traceId ? t.filter((e) => e.traceId === y.traceId) : t;
              },
            }),
            { data: M } = (0, p.useQuery)({
              queryKey: ["session", i, n],
              queryFn: () => (0, s.getSessionStatus)(i, n),
              refetchInterval: (e) => {
                const t = e.state.data;
                return !!t && "idle" !== t.status && "terminated" !== t.status && 5e3;
              },
            }),
            F = (0, v.useMutation)({
              mutationFn: () => (0, s.performAction)(i, n, "approve", h ? { comment: h } : void 0),
              onSuccess: () => {
                C.toast.success("Task approved"),
                  m(""),
                  c.invalidateQueries({ queryKey: ["task", i, n] });
              },
              onError: () => C.toast.error("Failed to approve"),
            }),
            z = (0, v.useMutation)({
              mutationFn: () => (0, s.performAction)(i, n, "reject", h ? { comment: h } : void 0),
              onSuccess: () => {
                C.toast.success("Task rejected"),
                  m(""),
                  c.invalidateQueries({ queryKey: ["task", i, n] });
              },
              onError: () => C.toast.error("Failed to reject"),
            }),
            q = k ?? [],
            A = y?.status === "awaiting_approval",
            L = F.isPending || z.isPending;
          if (g)
            return (0, t.jsx)("div", {
              className: "max-w-3xl mx-auto px-6 py-10",
              children: (0, t.jsx)("div", {
                className: "flex justify-center py-16",
                children: (0, t.jsx)(o.Loader2, {
                  size: 20,
                  className: "animate-spin text-muted-foreground",
                }),
              }),
            });
          if (!y)
            return (0, t.jsx)("div", {
              className: "max-w-3xl mx-auto px-6 py-10",
              children: (0, t.jsx)("p", {
                className: "text-sm text-muted-foreground text-center py-16",
                children: "Task not found",
              }),
            });
          const P = E[y.status] ?? E.pending,
            U = P.icon,
            _ = i.charAt(0).toUpperCase() + i.slice(1);
          return (0, t.jsxs)("div", {
            className: "max-w-3xl mx-auto px-6 py-10",
            children: [
              (0, t.jsxs)("div", {
                className: "flex items-center gap-2 mb-4 text-xs text-muted-foreground",
                children: [
                  (0, t.jsx)("a", {
                    href: "/",
                    className: "hover:text-foreground transition-colors",
                    children: "All Tasks",
                  }),
                  (0, t.jsx)("span", { children: "/" }),
                  (0, t.jsx)("a", {
                    href: `/${i}`,
                    className: "hover:text-foreground transition-colors",
                    children: _,
                  }),
                  (0, t.jsx)("span", { children: "/" }),
                  (0, t.jsx)("span", { className: "text-foreground", children: "Task" }),
                ],
              }),
              (0, t.jsxs)("div", {
                className: "border border-border rounded-lg p-5 mb-6 space-y-4",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex items-start justify-between gap-3",
                    children: [
                      (0, t.jsxs)("div", {
                        className: "min-w-0 flex-1",
                        children: [
                          (0, t.jsx)("p", {
                            className: "text-sm font-medium leading-relaxed",
                            children: y.body,
                          }),
                          (0, t.jsx)(b, { text: y.body ?? "" }),
                        ],
                      }),
                      (0, t.jsxs)("span", {
                        className: (0, r.cn)(
                          "shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full",
                          P.className,
                        ),
                        children: [(0, t.jsx)(U, { size: 11 }), P.label],
                      }),
                    ],
                  }),
                  (0, t.jsxs)("div", {
                    className: "flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted-foreground",
                    children: [
                      y.type &&
                        "request" !== y.type &&
                        (0, t.jsxs)("div", {
                          className: "flex items-center gap-1.5",
                          children: [
                            (0, t.jsx)(T.MessageSquare, { size: 12 }),
                            (0, t.jsx)("span", {
                              className: "capitalize",
                              children: y.type.replace(/-/g, " "),
                            }),
                          ],
                        }),
                      y.assignedTo &&
                        (0, t.jsxs)("div", {
                          className: "flex items-center gap-1.5",
                          children: [
                            (0, t.jsx)(S, { size: 12 }),
                            (0, t.jsx)("span", { children: y.assignedTo }),
                          ],
                        }),
                      (0, t.jsxs)("div", {
                        className: "flex items-center gap-1.5",
                        children: [
                          (0, t.jsx)(w.Clock, { size: 12 }),
                          (0, t.jsx)("span", {
                            children: new Date(y.createdAt).toLocaleDateString("en-ZA", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            }),
                          }),
                        ],
                      }),
                      (0, t.jsxs)("button", {
                        onClick: () => {
                          navigator.clipboard.writeText(y.id), x(!0), setTimeout(() => x(!1), 2e3);
                        },
                        className:
                          "inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-muted/60 hover:bg-muted transition-colors font-mono text-[11px] text-muted-foreground",
                        title: "Copy task ID",
                        children: [
                          (0, t.jsx)("span", {
                            className: "max-w-[120px] truncate",
                            children: y.id,
                          }),
                          f
                            ? (0, t.jsx)(R, { size: 10, className: "shrink-0 text-emerald-500" })
                            : (0, t.jsx)(N, { size: 10, className: "shrink-0" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              M?.sessionId &&
                (0, t.jsx)("div", {
                  className: "mb-6",
                  children: (0, t.jsx)(d, {
                    slug: i,
                    taskId: n,
                    sessionId: M.sessionId,
                    onComplete: () => c.invalidateQueries({ queryKey: ["task", i, n] }),
                  }),
                }),
              (0, t.jsxs)("div", {
                className: "mb-6",
                children: [
                  (0, t.jsx)("h3", {
                    className: "text-sm font-semibold mb-3",
                    children: "Messages",
                  }),
                  O
                    ? (0, t.jsx)("div", {
                        className: "flex justify-center py-8",
                        children: (0, t.jsx)(o.Loader2, {
                          size: 16,
                          className: "animate-spin text-muted-foreground",
                        }),
                      })
                    : 0 === q.length
                      ? (0, t.jsx)("p", {
                          className: "text-sm text-muted-foreground text-center py-8",
                          children: "No messages yet",
                        })
                      : (0, t.jsx)("div", {
                          className: "space-y-2",
                          children: q.map((e, s) =>
                            (0, t.jsxs)(
                              "div",
                              {
                                className: "border border-border rounded-lg p-4 space-y-1",
                                children: [
                                  (0, t.jsxs)("div", {
                                    className: "flex items-center justify-between gap-2",
                                    children: [
                                      (0, t.jsx)("span", {
                                        className: "text-xs font-medium",
                                        children: "gateway" === e.from ? "You" : e.from,
                                      }),
                                      (0, t.jsx)("span", {
                                        className: "text-[11px] text-muted-foreground",
                                        children: new Date(e.timestamp).toLocaleDateString(
                                          "en-ZA",
                                          {
                                            day: "numeric",
                                            month: "short",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          },
                                        ),
                                      }),
                                    ],
                                  }),
                                  (0, t.jsx)("p", {
                                    className: "text-sm text-muted-foreground whitespace-pre-wrap",
                                    children: e.body,
                                  }),
                                  (0, t.jsx)(b, { text: e.body ?? "" }),
                                ],
                              },
                              e.id ?? s,
                            ),
                          ),
                        }),
                ],
              }),
              A &&
                (0, t.jsxs)("div", {
                  className: "border border-border rounded-lg p-5 space-y-3",
                  children: [
                    (0, t.jsx)("h3", {
                      className: "text-sm font-semibold",
                      children: "Action required",
                    }),
                    (0, t.jsx)("textarea", {
                      value: h,
                      onChange: (e) => m(e.target.value),
                      placeholder: "Optional comment...",
                      rows: 2,
                      className:
                        "w-full text-sm p-3 rounded-md border border-border bg-muted/30 outline-none focus:border-ring resize-none placeholder:text-muted-foreground/50",
                    }),
                    (0, t.jsxs)("div", {
                      className: "flex gap-2 justify-end",
                      children: [
                        (0, t.jsxs)("button", {
                          onClick: () => z.mutate(),
                          disabled: L,
                          className:
                            "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-destructive text-white hover:bg-destructive/90 disabled:opacity-50 transition-colors",
                          children: [
                            z.isPending
                              ? (0, t.jsx)(o.Loader2, { size: 12, className: "animate-spin" })
                              : (0, t.jsx)(Q, { size: 12 }),
                            "Reject",
                          ],
                        }),
                        (0, t.jsxs)("button", {
                          onClick: () => F.mutate(),
                          disabled: L,
                          className:
                            "inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors",
                          children: [
                            F.isPending
                              ? (0, t.jsx)(o.Loader2, { size: 12, className: "animate-spin" })
                              : (0, t.jsx)(l.CheckCircle2, { size: 12 }),
                            "Approve",
                          ],
                        }),
                      ],
                    }),
                  ],
                }),
            ],
          });
        },
      ],
      10561,
    );
  },
]);
