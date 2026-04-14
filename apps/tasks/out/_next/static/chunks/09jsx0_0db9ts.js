(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  8081,
  (e) => {
    var t = {
        setTimeout: (e, t) => setTimeout(e, t),
        clearTimeout: (e) => clearTimeout(e),
        setInterval: (e, t) => setInterval(e, t),
        clearInterval: (e) => clearInterval(e),
      },
      i = new (class {
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
    e.s([
      "systemSetTimeoutZero",
      0,
      (e) => {
        setTimeout(e, 0);
      },
      "timeoutManager",
      0,
      i,
    ]);
  },
  37519,
  (e) => {
    var t = e.i(8081),
      i = "u" < typeof window || "Deno" in globalThis;
    function s(e, t) {
      return (t?.queryKeyHashFn || r)(e);
    }
    function r(e) {
      return JSON.stringify(e, (e, t) =>
        u(t)
          ? Object.keys(t)
              .sort()
              .reduce((e, i) => ((e[i] = t[i]), e), {})
          : t,
      );
    }
    function n(e, t) {
      return (
        e === t ||
        (typeof e == typeof t &&
          !!e &&
          !!t &&
          "object" == typeof e &&
          "object" == typeof t &&
          Object.keys(t).every((i) => n(e[i], t[i])))
      );
    }
    var a = Object.prototype.hasOwnProperty;
    function o(e) {
      return Array.isArray(e) && e.length === Object.keys(e).length;
    }
    function u(e) {
      if (!h(e)) return !1;
      const t = e.constructor;
      if (void 0 === t) return !0;
      const i = t.prototype;
      return (
        !!h(i) &&
        !!i.hasOwnProperty("isPrototypeOf") &&
        Object.getPrototypeOf(e) === Object.prototype
      );
    }
    function h(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
    var c = Symbol();
    e.s([
      "addConsumeAwareSignal",
      0,
      (e, t, i) => {
        let s,
          r = !1;
        return (
          Object.defineProperty(e, "signal", {
            enumerable: !0,
            get: () => (
              (s ??= t()),
              r || ((r = !0), s.aborted ? i() : s.addEventListener("abort", i, { once: !0 })),
              s
            ),
          }),
          e
        );
      },
      "addToEnd",
      0,
      (e, t, i = 0) => {
        const s = [...e, t];
        return i && s.length > i ? s.slice(1) : s;
      },
      "addToStart",
      0,
      (e, t, i = 0) => {
        const s = [t, ...e];
        return i && s.length > i ? s.slice(0, -1) : s;
      },
      "ensureQueryFn",
      0,
      (e, t) =>
        !e.queryFn && t?.initialPromise
          ? () => t.initialPromise
          : e.queryFn && e.queryFn !== c
            ? e.queryFn
            : () => Promise.reject(Error(`Missing queryFn: '${e.queryHash}'`)),
      "functionalUpdate",
      0,
      (e, t) => ("function" == typeof e ? e(t) : e),
      "hashKey",
      0,
      r,
      "hashQueryKeyByOptions",
      0,
      s,
      "isServer",
      0,
      i,
      "isValidTimeout",
      0,
      (e) => "number" == typeof e && e >= 0 && e !== 1 / 0,
      "matchMutation",
      0,
      (e, t) => {
        const { exact: i, status: s, predicate: a, mutationKey: o } = e;
        if (o) {
          if (!t.options.mutationKey) return !1;
          if (i) {
            if (r(t.options.mutationKey) !== r(o)) return !1;
          } else if (!n(t.options.mutationKey, o)) return !1;
        }
        return (!s || t.state.status === s) && (!a || !!a(t));
      },
      "matchQuery",
      0,
      (e, t) => {
        const {
          type: i = "all",
          exact: r,
          fetchStatus: a,
          predicate: o,
          queryKey: u,
          stale: h,
        } = e;
        if (u) {
          if (r) {
            if (t.queryHash !== s(u, t.options)) return !1;
          } else if (!n(t.queryKey, u)) return !1;
        }
        if ("all" !== i) {
          const e = t.isActive();
          if (("active" === i && !e) || ("inactive" === i && e)) return !1;
        }
        return (
          ("boolean" != typeof h || t.isStale() === h) &&
          (!a || a === t.state.fetchStatus) &&
          (!o || !!o(t))
        );
      },
      "noop",
      0,
      () => {},
      "partialMatchKey",
      0,
      n,
      "replaceData",
      0,
      (e, t, i) =>
        "function" == typeof i.structuralSharing
          ? i.structuralSharing(e, t)
          : !1 !== i.structuralSharing
            ? (function e(t, i, s = 0) {
                if (t === i) return t;
                if (s > 500) return i;
                const r = o(t) && o(i);
                if (!r && !(u(t) && u(i))) return i;
                let n = (r ? t : Object.keys(t)).length,
                  h = r ? i : Object.keys(i),
                  c = h.length,
                  l = r ? Array(c) : {},
                  d = 0;
                for (let o = 0; o < c; o++) {
                  const u = r ? o : h[o],
                    c = t[u],
                    f = i[u];
                  if (c === f) {
                    (l[u] = c), (r ? o < n : a.call(t, u)) && d++;
                    continue;
                  }
                  if (null === c || null === f || "object" != typeof c || "object" != typeof f) {
                    l[u] = f;
                    continue;
                  }
                  const y = e(c, f, s + 1);
                  (l[u] = y), y === c && d++;
                }
                return n === c && d === n ? t : l;
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
        for (const i in e) if (e[i] !== t[i]) return !1;
        return !0;
      },
      "shouldThrowError",
      0,
      (e, t) => ("function" == typeof e ? e(...t) : !!e),
      "skipToken",
      0,
      c,
      "sleep",
      0,
      (e) =>
        new Promise((i) => {
          t.timeoutManager.setTimeout(i, e);
        }),
      "timeUntilStale",
      0,
      (e, t) => Math.max(e + (t || 0) - Date.now(), 0),
    ]);
  },
  94720,
  (e) => {
    let t, i, s, r, n, a;
    var o = e.i(8081).systemSetTimeoutZero,
      u =
        ((t = []),
        (i = 0),
        (s = (e) => {
          e();
        }),
        (r = (e) => {
          e();
        }),
        (n = o),
        {
          batch: (e) => {
            let a;
            i++;
            try {
              a = e();
            } finally {
              let e;
              --i ||
                ((e = t),
                (t = []),
                e.length &&
                  n(() => {
                    r(() => {
                      e.forEach((e) => {
                        s(e);
                      });
                    });
                  }));
            }
            return a;
          },
          batchCalls:
            (e) =>
            (...t) => {
              a(() => {
                e(...t);
              });
            },
          schedule: (a = (e) => {
            i
              ? t.push(e)
              : n(() => {
                  s(e);
                });
          }),
          setNotifyFunction: (e) => {
            s = e;
          },
          setBatchNotifyFunction: (e) => {
            r = e;
          },
          setScheduler: (e) => {
            n = e;
          },
        });
    e.s(["notifyManager", 0, u]);
  },
  6906,
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
    var i = new (class extends t {
      #i;
      #s;
      #r;
      constructor() {
        super(),
          (this.#r = (e) => {
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
        this.#s || this.setEventListener(this.#r);
      }
      onUnsubscribe() {
        this.hasListeners() || (this.#s?.(), (this.#s = void 0));
      }
      setEventListener(e) {
        (this.#r = e),
          this.#s?.(),
          (this.#s = e((e) => {
            "boolean" == typeof e ? this.setFocused(e) : this.onFocus();
          }));
      }
      setFocused(e) {
        this.#i !== e && ((this.#i = e), this.onFocus());
      }
      onFocus() {
        const e = this.isFocused();
        this.listeners.forEach((t) => {
          t(e);
        });
      }
      isFocused() {
        return "boolean" == typeof this.#i
          ? this.#i
          : globalThis.document?.visibilityState !== "hidden";
      }
    })();
    e.s(["focusManager", 0, i], 6906);
  },
  65548,
  16621,
  (e) => {
    var t = e.i(41357),
      i = new (class extends t.Subscribable {
        #n = !0;
        #s;
        #r;
        constructor() {
          super(),
            (this.#r = (e) => {
              if ("u" > typeof window && window.addEventListener) {
                const t = () => e(!0),
                  i = () => e(!1);
                return (
                  window.addEventListener("online", t, !1),
                  window.addEventListener("offline", i, !1),
                  () => {
                    window.removeEventListener("online", t),
                      window.removeEventListener("offline", i);
                  }
                );
              }
            });
        }
        onSubscribe() {
          this.#s || this.setEventListener(this.#r);
        }
        onUnsubscribe() {
          this.hasListeners() || (this.#s?.(), (this.#s = void 0));
        }
        setEventListener(e) {
          (this.#r = e), this.#s?.(), (this.#s = e(this.setOnline.bind(this)));
        }
        setOnline(e) {
          this.#n !== e &&
            ((this.#n = e),
            this.listeners.forEach((t) => {
              t(e);
            }));
        }
        isOnline() {
          return this.#n;
        }
      })();
    e.s(["onlineManager", 0, i], 65548),
      e.i(37519),
      e.s(
        [
          "pendingThenable",
          0,
          () => {
            let e,
              t,
              i = new Promise((i, s) => {
                (e = i), (t = s);
              });
            function s(e) {
              Object.assign(i, e), delete i.resolve, delete i.reject;
            }
            return (
              (i.status = "pending"),
              i.catch(() => {}),
              (i.resolve = (t) => {
                s({ status: "fulfilled", value: t }), e(t);
              }),
              (i.reject = (e) => {
                s({ status: "rejected", reason: e }), t(e);
              }),
              i
            );
          },
        ],
        16621,
      );
  },
  93771,
  (e) => {
    let t;
    var i = e.i(37519),
      s =
        ((t = () => i.isServer),
        {
          isServer: () => t(),
          setIsServer(e) {
            t = e;
          },
        });
    e.s(["environmentManager", 0, s]);
  },
  13564,
  (e) => {
    var t = e.i(6906),
      i = e.i(65548),
      s = e.i(16621),
      r = e.i(93771),
      n = e.i(37519);
    function a(e) {
      return Math.min(1e3 * 2 ** e, 3e4);
    }
    function o(e) {
      return (e ?? "online") !== "online" || i.onlineManager.isOnline();
    }
    var u = class extends Error {
      constructor(e) {
        super("CancelledError"), (this.revert = e?.revert), (this.silent = e?.silent);
      }
    };
    e.s([
      "CancelledError",
      0,
      u,
      "canFetch",
      0,
      o,
      "createRetryer",
      0,
      (e) => {
        let h,
          c = !1,
          l = 0,
          d = (0, s.pendingThenable)(),
          f = () =>
            t.focusManager.isFocused() &&
            ("always" === e.networkMode || i.onlineManager.isOnline()) &&
            e.canRun(),
          y = () => o(e.networkMode) && e.canRun(),
          p = (e) => {
            "pending" === d.status && (h?.(), d.resolve(e));
          },
          m = (e) => {
            "pending" === d.status && (h?.(), d.reject(e));
          },
          v = () =>
            new Promise((t) => {
              (h = (e) => {
                ("pending" !== d.status || f()) && t(e);
              }),
                e.onPause?.();
            }).then(() => {
              (h = void 0), "pending" === d.status && e.onContinue?.();
            }),
          g = () => {
            let t;
            if ("pending" !== d.status) return;
            const i = 0 === l ? e.initialPromise : void 0;
            try {
              t = i ?? e.fn();
            } catch (e) {
              t = Promise.reject(e);
            }
            Promise.resolve(t)
              .then(p)
              .catch((t) => {
                if ("pending" !== d.status) return;
                const i = e.retry ?? 3 * !r.environmentManager.isServer(),
                  s = e.retryDelay ?? a,
                  o = "function" == typeof s ? s(l, t) : s,
                  u =
                    !0 === i ||
                    ("number" == typeof i && l < i) ||
                    ("function" == typeof i && i(l, t));
                c || !u
                  ? m(t)
                  : (l++,
                    e.onFail?.(l, t),
                    (0, n.sleep)(o)
                      .then(() => (f() ? void 0 : v()))
                      .then(() => {
                        c ? m(t) : g();
                      }));
              });
          };
        return {
          promise: d,
          status: () => d.status,
          cancel: (t) => {
            if ("pending" === d.status) {
              const i = new u(t);
              m(i), e.onCancel?.(i);
            }
          },
          continue: () => (h?.(), d),
          cancelRetry: () => {
            c = !0;
          },
          continueRetry: () => {
            c = !1;
          },
          canStart: y,
          start: () => (y() ? g() : v().then(g), d),
        };
      },
    ]);
  },
  78408,
  (e) => {
    var t = e.i(8081),
      i = e.i(93771),
      s = e.i(37519),
      r = class {
        #a;
        destroy() {
          this.clearGcTimeout();
        }
        scheduleGc() {
          this.clearGcTimeout(),
            (0, s.isValidTimeout)(this.gcTime) &&
              (this.#a = t.timeoutManager.setTimeout(() => {
                this.optionalRemove();
              }, this.gcTime));
        }
        updateGcTime(e) {
          this.gcTime = Math.max(
            this.gcTime || 0,
            e ?? (i.environmentManager.isServer() ? 1 / 0 : 3e5),
          );
        }
        clearGcTimeout() {
          this.#a && (t.timeoutManager.clearTimeout(this.#a), (this.#a = void 0));
        }
      };
    e.s(["Removable", 0, r]);
  },
  41136,
  (e) => {
    var t = e.i(37519),
      i = e.i(94720),
      s = e.i(13564),
      r = e.i(78408),
      n = class extends r.Removable {
        #o;
        #u;
        #h;
        #c;
        #l;
        #d;
        #f;
        constructor(e) {
          super(),
            (this.#f = !1),
            (this.#d = e.defaultOptions),
            this.setOptions(e.options),
            (this.observers = []),
            (this.#c = e.client),
            (this.#h = this.#c.getQueryCache()),
            (this.queryKey = e.queryKey),
            (this.queryHash = e.queryHash),
            (this.#o = u(this.options)),
            (this.state = e.state ?? this.#o),
            this.scheduleGc();
        }
        get meta() {
          return this.options.meta;
        }
        get promise() {
          return this.#l?.promise;
        }
        setOptions(e) {
          if (
            ((this.options = { ...this.#d, ...e }),
            this.updateGcTime(this.options.gcTime),
            this.state && void 0 === this.state.data)
          ) {
            const e = u(this.options);
            void 0 !== e.data && (this.setState(o(e.data, e.dataUpdatedAt)), (this.#o = e));
          }
        }
        optionalRemove() {
          this.observers.length || "idle" !== this.state.fetchStatus || this.#h.remove(this);
        }
        setData(e, i) {
          const s = (0, t.replaceData)(this.state.data, e, this.options);
          return (
            this.#y({ data: s, type: "success", dataUpdatedAt: i?.updatedAt, manual: i?.manual }), s
          );
        }
        setState(e, t) {
          this.#y({ type: "setState", state: e, setStateOptions: t });
        }
        cancel(e) {
          const i = this.#l?.promise;
          return this.#l?.cancel(e), i ? i.then(t.noop).catch(t.noop) : Promise.resolve();
        }
        destroy() {
          super.destroy(), this.cancel({ silent: !0 });
        }
        get resetState() {
          return this.#o;
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
          e?.refetch({ cancelRefetch: !1 }), this.#l?.continue();
        }
        onOnline() {
          const e = this.observers.find((e) => e.shouldFetchOnReconnect());
          e?.refetch({ cancelRefetch: !1 }), this.#l?.continue();
        }
        addObserver(e) {
          this.observers.includes(e) ||
            (this.observers.push(e),
            this.clearGcTimeout(),
            this.#h.notify({ type: "observerAdded", query: this, observer: e }));
        }
        removeObserver(e) {
          this.observers.includes(e) &&
            ((this.observers = this.observers.filter((t) => t !== e)),
            this.observers.length ||
              (this.#l &&
                (this.#f || this.#p() ? this.#l.cancel({ revert: !0 }) : this.#l.cancelRetry()),
              this.scheduleGc()),
            this.#h.notify({ type: "observerRemoved", query: this, observer: e }));
        }
        getObserversCount() {
          return this.observers.length;
        }
        #p() {
          return "paused" === this.state.fetchStatus && "pending" === this.state.status;
        }
        invalidate() {
          this.state.isInvalidated || this.#y({ type: "invalidate" });
        }
        async fetch(e, i) {
          let r;
          if ("idle" !== this.state.fetchStatus && this.#l?.status() !== "rejected") {
            if (void 0 !== this.state.data && i?.cancelRefetch) this.cancel({ silent: !0 });
            else if (this.#l) return this.#l.continueRetry(), this.#l.promise;
          }
          if ((e && this.setOptions(e), !this.options.queryFn)) {
            const e = this.observers.find((e) => e.options.queryFn);
            e && this.setOptions(e.options);
          }
          const n = new AbortController(),
            a = (e) => {
              Object.defineProperty(e, "signal", {
                enumerable: !0,
                get: () => ((this.#f = !0), n.signal),
              });
            },
            o = () => {
              let e,
                s = (0, t.ensureQueryFn)(this.options, i),
                r = (a((e = { client: this.#c, queryKey: this.queryKey, meta: this.meta })), e);
              return ((this.#f = !1), this.options.persister)
                ? this.options.persister(s, r, this)
                : s(r);
            },
            u =
              (a(
                (r = {
                  fetchOptions: i,
                  options: this.options,
                  queryKey: this.queryKey,
                  client: this.#c,
                  state: this.state,
                  fetchFn: o,
                }),
              ),
              r);
          this.options.behavior?.onFetch(u, this),
            (this.#u = this.state),
            ("idle" === this.state.fetchStatus || this.state.fetchMeta !== u.fetchOptions?.meta) &&
              this.#y({ type: "fetch", meta: u.fetchOptions?.meta }),
            (this.#l = (0, s.createRetryer)({
              initialPromise: i?.initialPromise,
              fn: u.fetchFn,
              onCancel: (e) => {
                e instanceof s.CancelledError &&
                  e.revert &&
                  this.setState({ ...this.#u, fetchStatus: "idle" }),
                  n.abort();
              },
              onFail: (e, t) => {
                this.#y({ type: "failed", failureCount: e, error: t });
              },
              onPause: () => {
                this.#y({ type: "pause" });
              },
              onContinue: () => {
                this.#y({ type: "continue" });
              },
              retry: u.options.retry,
              retryDelay: u.options.retryDelay,
              networkMode: u.options.networkMode,
              canRun: () => !0,
            }));
          try {
            const e = await this.#l.start();
            if (void 0 === e) throw Error(`${this.queryHash} data is undefined`);
            return (
              this.setData(e),
              this.#h.config.onSuccess?.(e, this),
              this.#h.config.onSettled?.(e, this.state.error, this),
              e
            );
          } catch (e) {
            if (e instanceof s.CancelledError) {
              if (e.silent) return this.#l.promise;
              else if (e.revert) {
                if (void 0 === this.state.data) throw e;
                return this.state.data;
              }
            }
            throw (
              (this.#y({ type: "error", error: e }),
              this.#h.config.onError?.(e, this),
              this.#h.config.onSettled?.(this.state.data, e, this),
              e)
            );
          } finally {
            this.scheduleGc();
          }
        }
        #y(e) {
          const t = (t) => {
            switch (e.type) {
              case "failed":
                return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
              case "pause":
                return { ...t, fetchStatus: "paused" };
              case "continue":
                return { ...t, fetchStatus: "fetching" };
              case "fetch":
                return { ...t, ...a(t.data, this.options), fetchMeta: e.meta ?? null };
              case "success":
                const i = {
                  ...t,
                  ...o(e.data, e.dataUpdatedAt),
                  dataUpdateCount: t.dataUpdateCount + 1,
                  ...(!e.manual && {
                    fetchStatus: "idle",
                    fetchFailureCount: 0,
                    fetchFailureReason: null,
                  }),
                };
                return (this.#u = e.manual ? i : void 0), i;
              case "error":
                const s = e.error;
                return {
                  ...t,
                  error: s,
                  errorUpdateCount: t.errorUpdateCount + 1,
                  errorUpdatedAt: Date.now(),
                  fetchFailureCount: t.fetchFailureCount + 1,
                  fetchFailureReason: s,
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
            i.notifyManager.batch(() => {
              this.observers.forEach((e) => {
                e.onQueryUpdate();
              }),
                this.#h.notify({ query: this, type: "updated", action: e });
            });
        }
      };
    function a(e, t) {
      return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: (0, s.canFetch)(t.networkMode) ? "fetching" : "paused",
        ...(void 0 === e && { error: null, status: "pending" }),
      };
    }
    function o(e, t) {
      return {
        data: e,
        dataUpdatedAt: t ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: "success",
      };
    }
    function u(e) {
      const t = "function" == typeof e.initialData ? e.initialData() : e.initialData,
        i = void 0 !== t,
        s = i
          ? "function" == typeof e.initialDataUpdatedAt
            ? e.initialDataUpdatedAt()
            : e.initialDataUpdatedAt
          : 0;
      return {
        data: t,
        dataUpdateCount: 0,
        dataUpdatedAt: i ? (s ?? Date.now()) : 0,
        error: null,
        errorUpdateCount: 0,
        errorUpdatedAt: 0,
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchMeta: null,
        isInvalidated: !1,
        status: i ? "success" : "pending",
        fetchStatus: "idle",
      };
    }
    e.s(["Query", 0, n, "fetchState", 0, a]);
  },
  73048,
  (e) => {
    var t = e.i(98937),
      i = e.i(87111),
      s = t.createContext(void 0);
    e.s([
      "QueryClientProvider",
      0,
      ({ client: e, children: r }) => (
        t.useEffect(
          () => (
            e.mount(),
            () => {
              e.unmount();
            }
          ),
          [e],
        ),
        (0, i.jsx)(s.Provider, { value: e, children: r })
      ),
      "useQueryClient",
      0,
      (e) => {
        const i = t.useContext(s);
        if (e) return e;
        if (!i) throw Error("No QueryClient set, use QueryClientProvider to set one");
        return i;
      },
    ]);
  },
  48859,
  (e) => {
    var t = e.i(87111),
      i = e.i(37519),
      s = e.i(41136),
      r = e.i(94720),
      n = e.i(41357),
      a = class extends n.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#m = new Map());
        }
        #m;
        build(e, t, r) {
          let n = t.queryKey,
            a = t.queryHash ?? (0, i.hashQueryKeyByOptions)(n, t),
            o = this.get(a);
          return (
            o ||
              ((o = new s.Query({
                client: e,
                queryKey: n,
                queryHash: a,
                options: e.defaultQueryOptions(t),
                state: r,
                defaultOptions: e.getQueryDefaults(n),
              })),
              this.add(o)),
            o
          );
        }
        add(e) {
          this.#m.has(e.queryHash) ||
            (this.#m.set(e.queryHash, e), this.notify({ type: "added", query: e }));
        }
        remove(e) {
          const t = this.#m.get(e.queryHash);
          t &&
            (e.destroy(),
            t === e && this.#m.delete(e.queryHash),
            this.notify({ type: "removed", query: e }));
        }
        clear() {
          r.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              this.remove(e);
            });
          });
        }
        get(e) {
          return this.#m.get(e);
        }
        getAll() {
          return [...this.#m.values()];
        }
        find(e) {
          const t = { exact: !0, ...e };
          return this.getAll().find((e) => (0, i.matchQuery)(t, e));
        }
        findAll(e = {}) {
          const t = this.getAll();
          return Object.keys(e).length > 0 ? t.filter((t) => (0, i.matchQuery)(e, t)) : t;
        }
        notify(e) {
          r.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        onFocus() {
          r.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onFocus();
            });
          });
        }
        onOnline() {
          r.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onOnline();
            });
          });
        }
      },
      o = e.i(85101),
      u = n,
      h = class extends u.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#v = new Set()), (this.#g = new Map()), (this.#b = 0);
        }
        #v;
        #g;
        #b;
        build(e, t, i) {
          const s = new o.Mutation({
            client: e,
            mutationCache: this,
            mutationId: ++this.#b,
            options: e.defaultMutationOptions(t),
            state: i,
          });
          return this.add(s), s;
        }
        add(e) {
          this.#v.add(e);
          const t = c(e);
          if ("string" == typeof t) {
            const i = this.#g.get(t);
            i ? i.push(e) : this.#g.set(t, [e]);
          }
          this.notify({ type: "added", mutation: e });
        }
        remove(e) {
          if (this.#v.delete(e)) {
            const t = c(e);
            if ("string" == typeof t) {
              const i = this.#g.get(t);
              if (i)
                if (i.length > 1) {
                  const t = i.indexOf(e);
                  -1 !== t && i.splice(t, 1);
                } else i[0] === e && this.#g.delete(t);
            }
          }
          this.notify({ type: "removed", mutation: e });
        }
        canRun(e) {
          const t = c(e);
          if ("string" != typeof t) return !0;
          {
            const i = this.#g.get(t),
              s = i?.find((e) => "pending" === e.state.status);
            return !s || s === e;
          }
        }
        runNext(e) {
          const t = c(e);
          if ("string" != typeof t) return Promise.resolve();
          {
            const i = this.#g.get(t)?.find((t) => t !== e && t.state.isPaused);
            return i?.continue() ?? Promise.resolve();
          }
        }
        clear() {
          r.notifyManager.batch(() => {
            this.#v.forEach((e) => {
              this.notify({ type: "removed", mutation: e });
            }),
              this.#v.clear(),
              this.#g.clear();
          });
        }
        getAll() {
          return Array.from(this.#v);
        }
        find(e) {
          const t = { exact: !0, ...e };
          return this.getAll().find((e) => (0, i.matchMutation)(t, e));
        }
        findAll(e = {}) {
          return this.getAll().filter((t) => (0, i.matchMutation)(e, t));
        }
        notify(e) {
          r.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        resumePausedMutations() {
          const e = this.getAll().filter((e) => e.state.isPaused);
          return r.notifyManager.batch(() => Promise.all(e.map((e) => e.continue().catch(i.noop))));
        }
      };
    function c(e) {
      return e.options.scope?.id;
    }
    var l = e.i(6906),
      d = e.i(65548);
    function f(e) {
      return {
        onFetch: (t, s) => {
          let r = t.options,
            n = t.fetchOptions?.meta?.fetchMore?.direction,
            a = t.state.data?.pages || [],
            o = t.state.data?.pageParams || [],
            u = { pages: [], pageParams: [] },
            h = 0,
            c = async () => {
              let s = !1,
                c = (0, i.ensureQueryFn)(t.options, t.fetchOptions),
                l = async (e, r, n) => {
                  let a;
                  if (s) return Promise.reject();
                  if (null == r && e.pages.length) return Promise.resolve(e);
                  const o =
                      ((a = {
                        client: t.client,
                        queryKey: t.queryKey,
                        pageParam: r,
                        direction: n ? "backward" : "forward",
                        meta: t.options.meta,
                      }),
                      (0, i.addConsumeAwareSignal)(
                        a,
                        () => t.signal,
                        () => (s = !0),
                      ),
                      a),
                    u = await c(o),
                    { maxPages: h } = t.options,
                    l = n ? i.addToStart : i.addToEnd;
                  return { pages: l(e.pages, u, h), pageParams: l(e.pageParams, r, h) };
                };
              if (n && a.length) {
                const e = "backward" === n,
                  t = { pages: a, pageParams: o },
                  i = (
                    e
                      ? (e, { pages: t, pageParams: i }) =>
                          t.length > 0 ? e.getPreviousPageParam?.(t[0], t, i[0], i) : void 0
                      : y
                  )(r, t);
                u = await l(t, i, e);
              } else {
                const t = e ?? a.length;
                do {
                  const e = 0 === h ? (o[0] ?? r.initialPageParam) : y(r, u);
                  if (h > 0 && null == e) break;
                  (u = await l(u, e)), h++;
                } while (h < t);
              }
              return u;
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
                  s,
                ))
            : (t.fetchFn = c);
        },
      };
    }
    function y(e, { pages: t, pageParams: i }) {
      const s = t.length - 1;
      return t.length > 0 ? e.getNextPageParam(t[s], t, i[s], i) : void 0;
    }
    var p = class {
        #O;
        #S;
        #d;
        #C;
        #w;
        #q;
        #M;
        #P;
        constructor(e = {}) {
          (this.#O = e.queryCache || new a()),
            (this.#S = e.mutationCache || new h()),
            (this.#d = e.defaultOptions || {}),
            (this.#C = new Map()),
            (this.#w = new Map()),
            (this.#q = 0);
        }
        mount() {
          this.#q++,
            1 === this.#q &&
              ((this.#M = l.focusManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#O.onFocus());
              })),
              (this.#P = d.onlineManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#O.onOnline());
              })));
        }
        unmount() {
          this.#q--,
            0 === this.#q && (this.#M?.(), (this.#M = void 0), this.#P?.(), (this.#P = void 0));
        }
        isFetching(e) {
          return this.#O.findAll({ ...e, fetchStatus: "fetching" }).length;
        }
        isMutating(e) {
          return this.#S.findAll({ ...e, status: "pending" }).length;
        }
        getQueryData(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#O.get(t.queryHash)?.state.data;
        }
        ensureQueryData(e) {
          const t = this.defaultQueryOptions(e),
            s = this.#O.build(this, t),
            r = s.state.data;
          return void 0 === r
            ? this.fetchQuery(e)
            : (e.revalidateIfStale &&
                s.isStaleByTime((0, i.resolveStaleTime)(t.staleTime, s)) &&
                this.prefetchQuery(t),
              Promise.resolve(r));
        }
        getQueriesData(e) {
          return this.#O.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
        }
        setQueryData(e, t, s) {
          const r = this.defaultQueryOptions({ queryKey: e }),
            n = this.#O.get(r.queryHash),
            a = n?.state.data,
            o = (0, i.functionalUpdate)(t, a);
          if (void 0 !== o) return this.#O.build(this, r).setData(o, { ...s, manual: !0 });
        }
        setQueriesData(e, t, i) {
          return r.notifyManager.batch(() =>
            this.#O.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, i)]),
          );
        }
        getQueryState(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#O.get(t.queryHash)?.state;
        }
        removeQueries(e) {
          const t = this.#O;
          r.notifyManager.batch(() => {
            t.findAll(e).forEach((e) => {
              t.remove(e);
            });
          });
        }
        resetQueries(e, t) {
          const i = this.#O;
          return r.notifyManager.batch(
            () => (
              i.findAll(e).forEach((e) => {
                e.reset();
              }),
              this.refetchQueries({ type: "active", ...e }, t)
            ),
          );
        }
        cancelQueries(e, t = {}) {
          const s = { revert: !0, ...t };
          return Promise.all(
            r.notifyManager.batch(() => this.#O.findAll(e).map((e) => e.cancel(s))),
          )
            .then(i.noop)
            .catch(i.noop);
        }
        invalidateQueries(e, t = {}) {
          return r.notifyManager.batch(() =>
            (this.#O.findAll(e).forEach((e) => {
              e.invalidate();
            }),
            e?.refetchType === "none")
              ? Promise.resolve()
              : this.refetchQueries({ ...e, type: e?.refetchType ?? e?.type ?? "active" }, t),
          );
        }
        refetchQueries(e, t = {}) {
          const s = { ...t, cancelRefetch: t.cancelRefetch ?? !0 };
          return Promise.all(
            r.notifyManager.batch(() =>
              this.#O
                .findAll(e)
                .filter((e) => !e.isDisabled() && !e.isStatic())
                .map((e) => {
                  let t = e.fetch(void 0, s);
                  return (
                    s.throwOnError || (t = t.catch(i.noop)),
                    "paused" === e.state.fetchStatus ? Promise.resolve() : t
                  );
                }),
            ),
          ).then(i.noop);
        }
        fetchQuery(e) {
          const t = this.defaultQueryOptions(e);
          void 0 === t.retry && (t.retry = !1);
          const s = this.#O.build(this, t);
          return s.isStaleByTime((0, i.resolveStaleTime)(t.staleTime, s))
            ? s.fetch(t)
            : Promise.resolve(s.state.data);
        }
        prefetchQuery(e) {
          return this.fetchQuery(e).then(i.noop).catch(i.noop);
        }
        fetchInfiniteQuery(e) {
          return (e.behavior = f(e.pages)), this.fetchQuery(e);
        }
        prefetchInfiniteQuery(e) {
          return this.fetchInfiniteQuery(e).then(i.noop).catch(i.noop);
        }
        ensureInfiniteQueryData(e) {
          return (e.behavior = f(e.pages)), this.ensureQueryData(e);
        }
        resumePausedMutations() {
          return d.onlineManager.isOnline() ? this.#S.resumePausedMutations() : Promise.resolve();
        }
        getQueryCache() {
          return this.#O;
        }
        getMutationCache() {
          return this.#S;
        }
        getDefaultOptions() {
          return this.#d;
        }
        setDefaultOptions(e) {
          this.#d = e;
        }
        setQueryDefaults(e, t) {
          this.#C.set((0, i.hashKey)(e), { queryKey: e, defaultOptions: t });
        }
        getQueryDefaults(e) {
          const t = [...this.#C.values()],
            s = {};
          return (
            t.forEach((t) => {
              (0, i.partialMatchKey)(e, t.queryKey) && Object.assign(s, t.defaultOptions);
            }),
            s
          );
        }
        setMutationDefaults(e, t) {
          this.#w.set((0, i.hashKey)(e), { mutationKey: e, defaultOptions: t });
        }
        getMutationDefaults(e) {
          const t = [...this.#w.values()],
            s = {};
          return (
            t.forEach((t) => {
              (0, i.partialMatchKey)(e, t.mutationKey) && Object.assign(s, t.defaultOptions);
            }),
            s
          );
        }
        defaultQueryOptions(e) {
          if (e._defaulted) return e;
          const t = {
            ...this.#d.queries,
            ...this.getQueryDefaults(e.queryKey),
            ...e,
            _defaulted: !0,
          };
          return (
            t.queryHash || (t.queryHash = (0, i.hashQueryKeyByOptions)(t.queryKey, t)),
            void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = "always" !== t.networkMode),
            void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
            !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
            t.queryFn === i.skipToken && (t.enabled = !1),
            t
          );
        }
        defaultMutationOptions(e) {
          return e?._defaulted
            ? e
            : {
                ...this.#d.mutations,
                ...(e?.mutationKey && this.getMutationDefaults(e.mutationKey)),
                ...e,
                _defaulted: !0,
              };
        }
        clear() {
          this.#O.clear(), this.#S.clear();
        }
      },
      m = e.i(73048),
      v = e.i(98937);
    e.s(
      [
        "QueryProvider",
        0,
        ({ children: e }) => {
          const [i] = (0, v.useState)(() => new p());
          return (0, t.jsx)(m.QueryClientProvider, { client: i, children: e });
        },
      ],
      48859,
    );
  },
]);
