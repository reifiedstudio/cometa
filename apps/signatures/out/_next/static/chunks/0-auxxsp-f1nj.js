(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  16326,
  (e, t, r) => {
    t.exports = e.r(54420);
  },
  28,
  (e) => {
    let t, r, n, i, s, a, o;
    var l,
      u,
      d,
      c,
      h,
      p,
      f,
      g,
      m,
      y,
      k,
      v,
      b,
      _,
      P,
      w = e.i(87111),
      C = e.i(98937);
    function S(e) {
      return function (t) {
        const r = t ?? this;
        if (!r) throw TypeError(`${e.kind || e.name} type guard requires an error object`);
        return (
          (!!e.kind &&
            "object" == typeof r &&
            null !== r &&
            "constructor" in r &&
            r.constructor?.kind === e.kind) ||
          r instanceof e
        );
      };
    }
    e.i(67836);
    var j = class {
      static kind = "ClerkApiError";
      code;
      message;
      longMessage;
      meta;
      constructor(e) {
        const t = {
          code: e.code,
          message: e.message,
          longMessage: e.long_message,
          meta: {
            paramName: e.meta?.param_name,
            sessionId: e.meta?.session_id,
            emailAddresses: e.meta?.email_addresses,
            identifiers: e.meta?.identifiers,
            zxcvbn: e.meta?.zxcvbn,
            plan: e.meta?.plan,
            isPlanUpgradePossible: e.meta?.is_plan_upgrade_possible,
          },
        };
        (this.code = t.code),
          (this.message = t.message),
          (this.longMessage = t.longMessage),
          (this.meta = t.meta);
      }
    };
    S(j);
    var O = class e extends Error {
      static kind = "ClerkError";
      clerkError = !0;
      code;
      longMessage;
      docsUrl;
      cause;
      get name() {
        return this.constructor.name;
      }
      constructor(t) {
        super(new.target.formatMessage(new.target.kind, t.message, t.code, t.docsUrl), {
          cause: t.cause,
        }),
          Object.setPrototypeOf(this, e.prototype),
          (this.code = t.code),
          (this.docsUrl = t.docsUrl),
          (this.longMessage = t.longMessage),
          (this.cause = t.cause);
      }
      toString() {
        return `[${this.name}]
Message:${this.message}`;
      }
      static formatMessage(e, t, r, n) {
        const i = "Clerk:",
          s = RegExp(i.replace(" ", "\\s*"), "i");
        return (
          (t = t.replace(s, "")),
          (t = `${i} ${t.trim()}

(code="${r}")

`),
          n &&
            (t += `

Docs: ${n}`),
          t
        );
      }
    };
    S(
      class e extends O {
        static kind = "ClerkAPIResponseError";
        status;
        clerkTraceId;
        retryAfter;
        errors;
        constructor(t, r) {
          const { data: n, status: i, clerkTraceId: s, retryAfter: a } = r;
          super({ ...r, message: t, code: "api_response_error" }),
            Object.setPrototypeOf(this, e.prototype),
            (this.status = i),
            (this.clerkTraceId = s),
            (this.retryAfter = a),
            (this.errors = (n || []).map((e) => new j(e)));
        }
        toString() {
          let e = `[${this.name}]
Message:${this.message}
Status:${this.status}
Serialized errors: ${this.errors.map((e) => JSON.stringify(e))}`;
          return (
            this.clerkTraceId &&
              (e += `
Clerk Trace ID: ${this.clerkTraceId}`),
            e
          );
        }
        static formatMessage(e, t, r, n) {
          return t;
        }
      },
    );
    const E = Object.freeze({
      InvalidProxyUrlErrorMessage:
        "The proxyUrl passed to Clerk is invalid. The expected value for proxyUrl is an absolute URL or a relative path with a leading '/'. (key={{url}})",
      InvalidPublishableKeyErrorMessage:
        "The publishableKey passed to Clerk is invalid. You can get your Publishable key at https://dashboard.clerk.com/last-active?path=api-keys. (key={{key}})",
      MissingPublishableKeyErrorMessage:
        "Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
      MissingSecretKeyErrorMessage:
        "Missing secretKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys.",
      MissingClerkProvider:
        "{{source}} can only be used within the <ClerkProvider /> component. Learn more: https://clerk.com/docs/components/clerk-provider",
    });
    function M({ packageName: e, customMessages: t }) {
      let r = e;
      function n(e, t) {
        if (!t) return `${r}: ${e}`;
        let n = e;
        for (const r of e.matchAll(/{{([a-zA-Z0-9-_]+)}}/g)) {
          const e = (t[r[1]] || "").toString();
          n = n.replace(`{{${r[1]}}}`, e);
        }
        return `${r}: ${n}`;
      }
      const i = { ...E, ...t };
      return {
        setPackageName({ packageName: e }) {
          return "string" == typeof e && (r = e), this;
        },
        setMessages({ customMessages: e }) {
          return Object.assign(i, e || {}), this;
        },
        throwInvalidPublishableKeyError(e) {
          throw Error(n(i.InvalidPublishableKeyErrorMessage, e));
        },
        throwInvalidProxyUrl(e) {
          throw Error(n(i.InvalidProxyUrlErrorMessage, e));
        },
        throwMissingPublishableKeyError() {
          throw Error(n(i.MissingPublishableKeyErrorMessage));
        },
        throwMissingSecretKeyError() {
          throw Error(n(i.MissingSecretKeyErrorMessage));
        },
        throwMissingClerkProviderError(e) {
          throw Error(n(i.MissingClerkProvider, e));
        },
        throw(e) {
          throw Error(n(e));
        },
      };
    }
    var U = class e extends O {
      static kind = "ClerkRuntimeError";
      clerkRuntimeError = !0;
      constructor(t, r) {
        super({ ...r, message: t }), Object.setPrototypeOf(this, e.prototype);
      }
    };
    S(U);
    const T = {
        strict_mfa: { afterMinutes: 10, level: "multi_factor" },
        strict: { afterMinutes: 10, level: "second_factor" },
        moderate: { afterMinutes: 60, level: "second_factor" },
        lax: { afterMinutes: 1440, level: "second_factor" },
      },
      x = new Set(["first_factor", "second_factor", "multi_factor"]),
      A = new Set(["strict_mfa", "strict", "moderate", "lax"]),
      z = (e, t) => {
        const { org: r, user: n } = I(e),
          [i, s] = t.split(":"),
          a = s || i;
        return "org" === i
          ? r.includes(a)
          : "user" === i
            ? n.includes(a)
            : [...r, ...n].includes(a);
      },
      I = (e) => {
        const t = e ? e.split(",").map((e) => e.trim()) : [];
        return {
          org: t.filter((e) => e.split(":")[0].includes("o")).map((e) => e.split(":")[1]),
          user: t.filter((e) => e.split(":")[0].includes("u")).map((e) => e.split(":")[1]),
        };
      },
      R = (e) => {
        const t = (r) => {
          if (!r) return r;
          if (Array.isArray(r))
            return r.map((e) => ("object" == typeof e || Array.isArray(e) ? t(e) : e));
          const n = { ...r };
          for (const r of Object.keys(n)) {
            const i = e(r.toString());
            i !== r && ((n[i] = n[r]), delete n[r]), "object" == typeof n[i] && (n[i] = t(n[i]));
          }
          return n;
        };
        return t;
      };
    R((e) => (e ? e.replace(/[A-Z]/g, (e) => `_${e.toLowerCase()}`) : "")),
      R((e) => (e ? e.replace(/([-_][a-z])/g, (e) => e.toUpperCase().replace(/-|_/, "")) : ""));
    const L = [
        ".lcl.dev",
        ".stg.dev",
        ".lclstage.dev",
        ".stgstage.dev",
        ".dev.lclclerk.com",
        ".stg.lclclerk.com",
        ".accounts.lclclerk.com",
        "accountsstage.dev",
        "accounts.dev",
      ],
      N = (t) =>
        "u" > typeof atob && "function" == typeof atob
          ? atob(t)
          : e.g.Buffer
            ? new e.g.Buffer(t, "base64").toString()
            : t,
      W = "pk_live_";
    function F(e) {
      if (!e.endsWith("$")) return !1;
      const t = e.slice(0, -1);
      return !t.includes("$") && t.includes(".");
    }
    function D(e, t = {}) {
      let r;
      if (!(e = e || "") || !q(e)) {
        if (t.fatal && !e)
          throw Error(
            "Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys",
          );
        if (t.fatal && !q(e)) throw Error("Publishable key not valid.");
        return null;
      }
      const n = e.startsWith(W) ? "production" : "development";
      try {
        r = N(e.split("_")[2]);
      } catch {
        if (t.fatal) throw Error("Publishable key not valid: Failed to decode key.");
        return null;
      }
      if (!F(r)) {
        if (t.fatal) throw Error("Publishable key not valid: Decoded key has invalid format.");
        return null;
      }
      let i = r.slice(0, -1);
      return (
        t.proxyUrl
          ? (i = t.proxyUrl)
          : "development" !== n && t.domain && t.isSatellite && (i = `clerk.${t.domain}`),
        { instanceType: n, frontendApi: i }
      );
    }
    function q(e = "") {
      try {
        if (!(e.startsWith(W) || e.startsWith("pk_test_"))) return !1;
        const t = e.split("_");
        if (3 !== t.length) return !1;
        const r = t[2];
        if (!r) return !1;
        return F(N(r));
      } catch {
        return !1;
      }
    }
    function K(e, t) {
      return { event: "METHOD_CALLED", eventSamplingRate: 0.1, payload: { method: e, ...t } };
    }
    var B = e.i(97685);
    e.s(
      [
        "ERROR_REVALIDATE_EVENT",
        0,
        3,
        "FOCUS_EVENT",
        0,
        0,
        "MUTATE_EVENT",
        0,
        2,
        "RECONNECT_EVENT",
        0,
        1,
      ],
      3861,
    );
    var $ = Object.prototype.hasOwnProperty;
    let V = new WeakMap(),
      Q = () => {},
      G = Q(),
      H = Object,
      J = (e) => e === G,
      Y = (e, t) => ({ ...e, ...t }),
      X = {},
      Z = {},
      ee = "undefined",
      et = typeof window != ee,
      er = typeof document != ee,
      en = et && "Deno" in window,
      ei = (e, t) => {
        const r = V.get(e);
        return [
          () => (!J(t) && e.get(t)) || X,
          (n) => {
            if (!J(t)) {
              const i = e.get(t);
              t in Z || (Z[t] = i), r[5](t, Y(i, n), i || X);
            }
          },
          r[6],
          () => (!J(t) && t in Z ? Z[t] : (!J(t) && e.get(t)) || X),
        ];
      },
      es = !0,
      [ea, eo] =
        et && window.addEventListener
          ? [window.addEventListener.bind(window), window.removeEventListener.bind(window)]
          : [Q, Q],
      el = {
        initFocus: (e) => (
          er && document.addEventListener("visibilitychange", e),
          ea("focus", e),
          () => {
            er && document.removeEventListener("visibilitychange", e), eo("focus", e);
          }
        ),
        initReconnect: (e) => {
          const t = () => {
              (es = !0), e();
            },
            r = () => {
              es = !1;
            };
          return (
            ea("online", t),
            ea("offline", r),
            () => {
              eo("online", t), eo("offline", r);
            }
          );
        },
      },
      eu = !C.default.useId,
      ed = !et || en,
      ec = ed ? C.useEffect : C.useLayoutEffect,
      eh = "u" > typeof navigator && navigator.connection,
      ep = !ed && eh && (["slow-2g", "2g"].includes(eh.effectiveType) || eh.saveData),
      ef = new WeakMap(),
      eg = (e, t) => e === `[object ${t}]`,
      em = 0,
      ey = (e) => {
        let t,
          r,
          n = typeof e,
          i = H.prototype.toString.call(e),
          s = eg(i, "Date"),
          a = eg(i, "RegExp"),
          o = eg(i, "Object");
        if (H(e) !== e || s || a)
          t = s
            ? e.toJSON()
            : "symbol" == n
              ? e.toString()
              : "string" == n
                ? JSON.stringify(e)
                : "" + e;
        else {
          if ((t = ef.get(e))) return t;
          if (((t = ++em + "~"), ef.set(e, t), Array.isArray(e))) {
            for (r = 0, t = "@"; r < e.length; r++) t += ey(e[r]) + ",";
            ef.set(e, t);
          }
          if (o) {
            t = "#";
            const n = H.keys(e).sort();
            while (!J((r = n.pop()))) J(e[r]) || (t += r + ":" + ey(e[r]) + ",");
            ef.set(e, t);
          }
        }
        return t;
      },
      ek = (e) => {
        if ("function" == typeof e)
          try {
            e = e();
          } catch (t) {
            e = "";
          }
        const t = e;
        return [(e = "string" == typeof e ? e : (Array.isArray(e) ? e.length : e) ? ey(e) : ""), t];
      },
      ev = 0,
      eb = () => ++ev;
    async function e_(...e) {
      let [t, r, n, i] = e,
        s = Y(
          { populateCache: !0, throwOnError: !0 },
          "boolean" == typeof i ? { revalidate: i } : i || {},
        ),
        a = s.populateCache,
        o = s.rollbackOnError,
        l = s.optimisticData,
        u = s.throwOnError;
      if ("function" == typeof r) {
        const e = [];
        for (const n of t.keys()) !/^\$(inf|sub)\$/.test(n) && r(t.get(n)._k) && e.push(n);
        return Promise.all(e.map(d));
      }
      return d(r);
      async function d(r) {
        let i,
          [d] = ek(r);
        if (!d) return;
        const [c, h] = ei(t, d),
          [p, f, g, m] = V.get(t),
          y = () => {
            const e = p[d];
            return ("function" == typeof s.revalidate
              ? s.revalidate(c().data, r)
              : !1 !== s.revalidate) && (delete g[d], delete m[d], e && e[0])
              ? e[0](2).then(() => c().data)
              : c().data;
          };
        if (e.length < 3) return y();
        let k = n,
          v = !1,
          b = eb();
        f[d] = [b, 0];
        const _ = !J(l),
          P = c(),
          w = P.data,
          C = P._c,
          S = J(C) ? w : C;
        if (
          (_ && h({ data: (l = "function" == typeof l ? l(S, w) : l), _c: S }),
          "function" == typeof k)
        )
          try {
            k = k(S);
          } catch (e) {
            (i = e), (v = !0);
          }
        if (k && "function" == typeof k.then) {
          let e;
          if (
            ((k = await k.catch((e) => {
              (i = e), (v = !0);
            })),
            b !== f[d][0])
          ) {
            if (v) throw i;
            return k;
          }
          v &&
            _ &&
            ((e = i), "function" == typeof o ? o(e) : !1 !== o) &&
            ((a = !0), h({ data: S, _c: G }));
        }
        if (
          (a &&
            !v &&
            ("function" == typeof a
              ? h({ data: a(k, S), error: G, _c: G })
              : h({ data: k, error: G, _c: G })),
          (f[d][1] = eb()),
          Promise.resolve(y()).then(() => {
            h({ _c: G });
          }),
          v)
        ) {
          if (u) throw i;
          return;
        }
        return k;
      }
    }
    const eP = (e, t) => {
        for (const r in e) e[r][0] && e[r][0](t);
      },
      ew = (e, t) => {
        if (!V.has(e)) {
          let r = Y(el, t),
            n = Object.create(null),
            i = e_.bind(G, e),
            s = Q,
            a = Object.create(null),
            o = (e, t) => {
              const r = a[e] || [];
              return (a[e] = r), r.push(t), () => r.splice(r.indexOf(t), 1);
            },
            l = (t, r, n) => {
              e.set(t, r);
              const i = a[t];
              if (i) for (const e of i) e(r, n);
            },
            u = () => {
              if (
                !V.has(e) &&
                (V.set(e, [
                  n,
                  Object.create(null),
                  Object.create(null),
                  Object.create(null),
                  i,
                  l,
                  o,
                ]),
                !ed)
              ) {
                const t = r.initFocus(setTimeout.bind(G, eP.bind(G, n, 0))),
                  i = r.initReconnect(setTimeout.bind(G, eP.bind(G, n, 1)));
                s = () => {
                  t && t(), i && i(), V.delete(e);
                };
              }
            };
          return u(), [e, i, u, s];
        }
        return [e, V.get(e)[4]];
      },
      [eC, eS] = ew(new Map()),
      ej = Y(
        {
          onLoadingSlow: Q,
          onSuccess: Q,
          onError: Q,
          onErrorRetry: (e, t, r, n, i) => {
            const s = r.errorRetryCount,
              a = i.retryCount,
              o = ~~((Math.random() + 0.5) * (1 << (a < 8 ? a : 8))) * r.errorRetryInterval;
            (J(s) || !(a > s)) && setTimeout(n, o, i);
          },
          onDiscarded: Q,
          revalidateOnFocus: !0,
          revalidateOnReconnect: !0,
          revalidateIfStale: !0,
          shouldRetryOnError: !0,
          errorRetryInterval: ep ? 1e4 : 5e3,
          focusThrottleInterval: 5e3,
          dedupingInterval: 2e3,
          loadingTimeout: ep ? 5e3 : 3e3,
          compare: function e(t, r) {
            var n, i;
            if (t === r) return !0;
            if (t && r && (n = t.constructor) === r.constructor) {
              if (n === Date) return t.getTime() === r.getTime();
              if (n === RegExp) return t.toString() === r.toString();
              if (n === Array) {
                if ((i = t.length) === r.length) while (i-- && e(t[i], r[i]));
                return -1 === i;
              }
              if (!n || "object" == typeof t) {
                for (n in ((i = 0), t))
                  if (($.call(t, n) && ++i && !$.call(r, n)) || !(n in r) || !e(t[n], r[n]))
                    return !1;
                return Object.keys(r).length === i;
              }
            }
            return t != t && r != r;
          },
          isPaused: () => !1,
          cache: eC,
          mutate: eS,
          fallback: {},
        },
        {
          isOnline: () => es,
          isVisible: () => {
            const e = er && document.visibilityState;
            return J(e) || "hidden" !== e;
          },
        },
      ),
      eO = (e, t) => {
        const r = Y(e, t);
        if (t) {
          const { use: n, fallback: i } = e,
            { use: s, fallback: a } = t;
          n && s && (r.use = n.concat(s)), i && a && (r.fallback = Y(i, a));
        }
        return r;
      },
      eE = (0, C.createContext)({});
    var eM = e.i(3861);
    const eU = "$inf$",
      eT = et && window.__SWR_DEVTOOLS_USE__,
      ex = eT ? window.__SWR_DEVTOOLS_USE__ : [],
      eA = (e) =>
        "function" == typeof e[1]
          ? [e[0], e[1], e[2] || {}]
          : [e[0], null, (null === e[1] ? e[2] : e[1]) || {}],
      ez = () => Y(ej, (0, C.useContext)(eE)),
      eI = ex.concat((e) => (t, r, n) => {
        const i =
          r &&
          ((...e) => {
            const [n] = ek(t),
              [, , , i] = V.get(eC);
            if (n.startsWith(eU)) return r(...e);
            const s = i[n];
            return J(s) ? r(...e) : (delete i[n], s);
          });
        return e(t, i, n);
      }),
      eR =
        (e, t) =>
        (...r) => {
          const [n, i, s] = eA(r),
            a = (s.use || []).concat(t);
          return e(n, i, { ...s, use: a });
        };
    eT && (window.__SWR_DEVTOOLS_REACT__ = C.default);
    let eL = () => {},
      eN = eL(),
      eW =
        (new WeakMap(),
        C.default.use ||
          ((e) => {
            switch (e.status) {
              case "pending":
                throw e;
              case "fulfilled":
                return e.value;
              case "rejected":
                throw e.reason;
              default:
                throw (
                  ((e.status = "pending"),
                  e.then(
                    (t) => {
                      (e.status = "fulfilled"), (e.value = t);
                    },
                    (t) => {
                      (e.status = "rejected"), (e.reason = t);
                    },
                  ),
                  e)
                );
            }
          })),
      eF = { dedupe: !0 },
      eD = H.defineProperty(
        (e) => {
          const { value: t } = e,
            r = (0, C.useContext)(eE),
            n = "function" == typeof t,
            i = (0, C.useMemo)(() => (n ? t(r) : t), [n, r, t]),
            s = (0, C.useMemo)(() => (n ? i : eO(r, i)), [n, r, i]),
            a = i && i.provider,
            o = (0, C.useRef)(G);
          a && !o.current && (o.current = ew(a(s.cache || eC), i));
          const l = o.current;
          return (
            l && ((s.cache = l[0]), (s.mutate = l[1])),
            ec(() => {
              if (l) return l[2] && l[2](), l[3];
            }, []),
            (0, C.createElement)(eE.Provider, Y(e, { value: s }))
          );
        },
        "defaultValue",
        { value: ej },
      ),
      eq =
        ((t = (e, t, r) => {
          const {
              cache: n,
              compare: i,
              suspense: s,
              fallbackData: a,
              revalidateOnMount: o,
              revalidateIfStale: l,
              refreshInterval: u,
              refreshWhenHidden: d,
              refreshWhenOffline: c,
              keepPreviousData: h,
            } = r,
            [p, f, g, m] = V.get(n),
            [y, k] = ek(e),
            v = (0, C.useRef)(!1),
            b = (0, C.useRef)(!1),
            _ = (0, C.useRef)(y),
            P = (0, C.useRef)(t),
            w = (0, C.useRef)(r),
            S = () => w.current.isVisible() && w.current.isOnline(),
            [j, O, E, M] = ei(n, y),
            U = (0, C.useRef)({}).current,
            T = J(a) ? (J(r.fallback) ? G : r.fallback[y]) : a,
            x = (e, t) => {
              for (const r in U)
                if ("data" === r) {
                  if (!i(e[r], t[r]) && (!J(e[r]) || !i(D, t[r]))) return !1;
                } else if (t[r] !== e[r]) return !1;
              return !0;
            },
            A = (0, C.useMemo)(() => {
              let e = !!y && !!t && (J(o) ? !w.current.isPaused() && !s && !1 !== l : o),
                r = (t) => {
                  const r = Y(t);
                  return (delete r._k, e) ? { isValidating: !0, isLoading: !0, ...r } : r;
                },
                n = j(),
                i = M(),
                a = r(n),
                u = n === i ? a : r(i),
                d = a;
              return [
                () => {
                  const e = r(j());
                  return x(e, d)
                    ? ((d.data = e.data),
                      (d.isLoading = e.isLoading),
                      (d.isValidating = e.isValidating),
                      (d.error = e.error),
                      d)
                    : ((d = e), e);
                },
                () => u,
              ];
            }, [n, y]),
            z = (0, B.useSyncExternalStore)(
              (0, C.useCallback)(
                (e) =>
                  E(y, (t, r) => {
                    x(r, t) || e();
                  }),
                [n, y],
              ),
              A[0],
              A[1],
            ),
            I = !v.current,
            R = p[y] && p[y].length > 0,
            L = z.data,
            N = J(L) ? (T && "function" == typeof T.then ? eW(T) : T) : L,
            W = z.error,
            F = (0, C.useRef)(N),
            D = h ? (J(L) ? (J(F.current) ? N : F.current) : L) : N,
            q =
              (!R || !!J(W)) &&
              (I && !J(o) ? o : !w.current.isPaused() && (s ? !J(N) && l : J(N) || l)),
            K = !!(y && t && I && q),
            $ = J(z.isValidating) ? K : z.isValidating,
            Q = J(z.isLoading) ? K : z.isLoading,
            H = (0, C.useCallback)(
              async (e) => {
                let t,
                  n,
                  s = P.current;
                if (!y || !s || b.current || w.current.isPaused()) return !1;
                let a = !0,
                  o = e || {},
                  l = !g[y] || !o.dedupe,
                  u = () => (eu ? !b.current && y === _.current && v.current : y === _.current),
                  d = { isValidating: !1, isLoading: !1 },
                  c = () => {
                    O(d);
                  },
                  h = () => {
                    const e = g[y];
                    e && e[1] === n && delete g[y];
                  },
                  m = { isValidating: !0 };
                J(j().data) && (m.isLoading = !0);
                try {
                  if (
                    (l &&
                      (O(m),
                      r.loadingTimeout &&
                        J(j().data) &&
                        setTimeout(() => {
                          a && u() && w.current.onLoadingSlow(y, r);
                        }, r.loadingTimeout),
                      (g[y] = [s(k), eb()])),
                    ([t, n] = g[y]),
                    (t = await t),
                    l && setTimeout(h, r.dedupingInterval),
                    !g[y] || g[y][1] !== n)
                  )
                    return l && u() && w.current.onDiscarded(y), !1;
                  d.error = G;
                  const e = f[y];
                  if (!J(e) && (n <= e[0] || n <= e[1] || 0 === e[1]))
                    return c(), l && u() && w.current.onDiscarded(y), !1;
                  const o = j().data;
                  (d.data = i(o, t) ? o : t), l && u() && w.current.onSuccess(t, y, r);
                } catch (r) {
                  h();
                  const e = w.current,
                    { shouldRetryOnError: t } = e;
                  !e.isPaused() &&
                    ((d.error = r), l && u()) &&
                    (e.onError(r, y, e),
                    (!0 === t || ("function" == typeof t && t(r))) &&
                      (!w.current.revalidateOnFocus || !w.current.revalidateOnReconnect || S()) &&
                      e.onErrorRetry(
                        r,
                        y,
                        e,
                        (e) => {
                          const t = p[y];
                          t && t[0] && t[0](eM.ERROR_REVALIDATE_EVENT, e);
                        },
                        { retryCount: (o.retryCount || 0) + 1, dedupe: !0 },
                      ));
                }
                return (a = !1), c(), !0;
              },
              [y, n],
            ),
            X = (0, C.useCallback)((...e) => e_(n, _.current, ...e), []);
          if (
            (ec(() => {
              (P.current = t), (w.current = r), J(L) || (F.current = L);
            }),
            ec(() => {
              var e;
              let t;
              if (!y) return;
              let r = H.bind(G, eF),
                n = 0;
              w.current.revalidateOnFocus && (n = Date.now() + w.current.focusThrottleInterval);
              const i =
                ((e = (e, t = {}) => {
                  if (e == eM.FOCUS_EVENT) {
                    const e = Date.now();
                    w.current.revalidateOnFocus &&
                      e > n &&
                      S() &&
                      ((n = e + w.current.focusThrottleInterval), r());
                  } else if (e == eM.RECONNECT_EVENT) w.current.revalidateOnReconnect && S() && r();
                  else if (e == eM.MUTATE_EVENT) return H();
                  else if (e == eM.ERROR_REVALIDATE_EVENT) return H(t);
                }),
                (t = p[y] || (p[y] = [])).push(e),
                () => {
                  const r = t.indexOf(e);
                  r >= 0 && ((t[r] = t[t.length - 1]), t.pop());
                });
              if (((b.current = !1), (_.current = y), (v.current = !0), O({ _k: k }), q && !g[y]))
                if (J(N) || ed) r();
                else
                  et && typeof window.requestAnimationFrame != ee
                    ? window.requestAnimationFrame(r)
                    : setTimeout(r, 1);
              return () => {
                (b.current = !0), i();
              };
            }, [y]),
            ec(() => {
              let e;
              function t() {
                const t = "function" == typeof u ? u(j().data) : u;
                t && -1 !== e && (e = setTimeout(r, t));
              }
              function r() {
                !j().error && (d || w.current.isVisible()) && (c || w.current.isOnline())
                  ? H(eF).then(t)
                  : t();
              }
              return (
                t(),
                () => {
                  e && (clearTimeout(e), (e = -1));
                }
              );
            }, [u, d, c, y]),
            (0, C.useDebugValue)(D),
            s && J(N) && y)
          ) {
            if (!eu && ed) throw Error("Fallback data is required when using Suspense in SSR.");
            (P.current = t), (w.current = r), (b.current = !1);
            const e = m[y];
            if ((J(e) || eW(X(e)), J(W))) {
              const e = H(eF);
              J(D) || ((e.status = "fulfilled"), (e.value = !0)), eW(e);
            } else throw W;
          }
          return {
            mutate: X,
            get data() {
              return (U.data = !0), D;
            },
            get error() {
              return (U.error = !0), W;
            },
            get isValidating() {
              return (U.isValidating = !0), $;
            },
            get isLoading() {
              return (U.isLoading = !0), Q;
            },
          };
        }),
        (...e) => {
          let r = ez(),
            [n, i, s] = eA(e),
            a = eO(r, s),
            o = t,
            { use: l } = a,
            u = (l || []).concat(eI);
          for (let e = u.length; e--; ) o = u[e](o);
          return o(n, i || a.fetcher || null, a);
        }),
      eK = () => {},
      eB = eK(),
      e$ = Object,
      eV = (e) => e === eB,
      eQ = new WeakMap(),
      eG = (e, t) => e === `[object ${t}]`,
      eH = 0,
      eJ = (e) => {
        let t,
          r,
          n = typeof e,
          i = e$.prototype.toString.call(e),
          s = eG(i, "Date"),
          a = eG(i, "RegExp"),
          o = eG(i, "Object");
        if (e$(e) !== e || s || a)
          t = s
            ? e.toJSON()
            : "symbol" == n
              ? e.toString()
              : "string" == n
                ? JSON.stringify(e)
                : "" + e;
        else {
          if ((t = eQ.get(e))) return t;
          if (((t = ++eH + "~"), eQ.set(e, t), Array.isArray(e))) {
            for (r = 0, t = "@"; r < e.length; r++) t += eJ(e[r]) + ",";
            eQ.set(e, t);
          }
          if (o) {
            t = "#";
            const n = e$.keys(e).sort();
            while (!eV((r = n.pop()))) eV(e[r]) || (t += r + ":" + eJ(e[r]) + ",");
            eQ.set(e, t);
          }
        }
        return t;
      },
      eY = Promise.resolve(),
      eX = eR(eq, (e) => (t, r, n) => {
        let i,
          s = (0, C.useRef)(!1),
          {
            cache: a,
            initialSize: o = 1,
            revalidateAll: l = !1,
            persistSize: u = !1,
            revalidateFirstPage: d = !0,
            revalidateOnMount: c = !1,
            parallel: h = !1,
          } = n,
          [, , , p] = V.get(eC);
        try {
          (i = ((e) => {
            if ("function" == typeof e)
              try {
                e = e();
              } catch (t) {
                e = "";
              }
            const t = e;
            return [
              (e = "string" == typeof e ? e : (Array.isArray(e) ? e.length : e) ? eJ(e) : ""),
              t,
            ];
          })(t ? t(0, null) : null)[0]) && (i = eU + i);
        } catch (e) {}
        const [f, g, m] = ei(a, i),
          y = (0, C.useCallback)(() => (J(f()._l) ? o : f()._l), [a, i, o]);
        (0, B.useSyncExternalStore)(
          (0, C.useCallback)(
            (e) =>
              i
                ? m(i, () => {
                    e();
                  })
                : () => {},
            [a, i],
          ),
          y,
          y,
        );
        const k = (0, C.useCallback)(() => {
            const e = f()._l;
            return J(e) ? o : e;
          }, [i, o]),
          v = (0, C.useRef)(k());
        ec(() => {
          if (!s.current) {
            s.current = !0;
            return;
          }
          i && g({ _l: u ? v.current : k() });
        }, [i, a]);
        const b = c && !s.current,
          _ = e(
            i,
            async (e) => {
              const i = f()._i,
                s = f()._r;
              g({ _r: G });
              let o = [],
                u = k(),
                [c] = ei(a, e),
                m = c().data,
                y = [],
                v = null;
              for (let e = 0; e < u; ++e) {
                const [u, c] = ek(t(e, h ? null : v));
                if (!u) break;
                let [f, g] = ei(a, u),
                  k = f().data,
                  _ =
                    l ||
                    i ||
                    J(k) ||
                    (d && !e && !J(m)) ||
                    b ||
                    (m && !J(m[e]) && !n.compare(m[e], k));
                if (r && ("function" == typeof s ? s(k, c) : _)) {
                  const t = async () => {
                    if (u in p) {
                      const e = p[u];
                      delete p[u], (k = await e);
                    } else k = await r(c);
                    g({ data: k, _k: c }), (o[e] = k);
                  };
                  h ? y.push(t) : await t();
                } else o[e] = k;
                h || (v = k);
              }
              return h && (await Promise.all(y.map((e) => e()))), g({ _i: G }), o;
            },
            n,
          ),
          P = (0, C.useCallback)(
            (e, t) => {
              const r = "boolean" == typeof t ? { revalidate: t } : t || {},
                n = !1 !== r.revalidate;
              return i
                ? (n && (J(e) ? g({ _i: !0, _r: r.revalidate }) : g({ _i: !1, _r: r.revalidate })),
                  arguments.length ? _.mutate(e, { ...r, revalidate: n }) : _.mutate())
                : eY;
            },
            [i, a],
          ),
          w = (0, C.useCallback)(
            (e) => {
              let r;
              if (!i) return eY;
              const [, n] = ei(a, i);
              if (
                ("function" == typeof e ? (r = e(k())) : "number" == typeof e && (r = e),
                "number" != typeof r)
              )
                return eY;
              n({ _l: r }), (v.current = r);
              let s = [],
                [o] = ei(a, i),
                l = null;
              for (let e = 0; e < r; ++e) {
                const [r] = ek(t(e, l)),
                  [n] = ei(a, r),
                  i = r ? n().data : G;
                if (J(i)) return P(o().data);
                s.push(i), (l = i);
              }
              return P(s);
            },
            [i, a, P, k],
          );
        return {
          size: k(),
          setSize: w,
          mutate: P,
          get data() {
            return _.data;
          },
          get error() {
            return _.error;
          },
          get isValidating() {
            return _.isValidating;
          },
          get isLoading() {
            return _.isLoading;
          },
        };
      });
    var eZ = Object.prototype.hasOwnProperty;
    function e0(e, t, r) {
      for (r of e.keys()) if (e1(r, t)) return r;
    }
    function e1(e, t) {
      var r, n, i;
      if (e === t) return !0;
      if (e && t && (r = e.constructor) === t.constructor) {
        if (r === Date) return e.getTime() === t.getTime();
        if (r === RegExp) return e.toString() === t.toString();
        if (r === Array) {
          if ((n = e.length) === t.length) while (n-- && e1(e[n], t[n]));
          return -1 === n;
        }
        if (r === Set) {
          if (e.size !== t.size) return !1;
          for (n of e)
            if (((i = n) && "object" == typeof i && !(i = e0(t, i))) || !t.has(i)) return !1;
          return !0;
        }
        if (r === Map) {
          if (e.size !== t.size) return !1;
          for (n of e)
            if (((i = n[0]) && "object" == typeof i && !(i = e0(t, i))) || !e1(n[1], t.get(i)))
              return !1;
          return !0;
        }
        if (r === ArrayBuffer) (e = new Uint8Array(e)), (t = new Uint8Array(t));
        else if (r === DataView) {
          if ((n = e.byteLength) === t.byteLength) while (n-- && e.getInt8(n) === t.getInt8(n));
          return -1 === n;
        }
        if (ArrayBuffer.isView(e)) {
          if ((n = e.byteLength) === t.byteLength) while (n-- && e[n] === t[n]);
          return -1 === n;
        }
        if (!r || "object" == typeof e) {
          for (r in ((n = 0), e))
            if ((eZ.call(e, r) && ++n && !eZ.call(t, r)) || !(r in t) || !e1(e[r], t[r])) return !1;
          return Object.keys(t).length === n;
        }
      }
      return e != e && t != t;
    }
    const e5 = eu
      ? (e) => {
          e();
        }
      : C.default.startTransition;
    function e2(e, t) {
      if (!e) throw "string" == typeof t ? Error(t) : Error(`${t.displayName} not found`);
    }
    eR(eq, () => (e, t, r = {}) => {
      const { mutate: n } = ez(),
        i = (0, C.useRef)(e),
        s = (0, C.useRef)(t),
        a = (0, C.useRef)(r),
        o = (0, C.useRef)(0),
        [l, u, d] = ((e) => {
          const [, t] = (0, C.useState)({}),
            r = (0, C.useRef)(!1),
            n = (0, C.useRef)(e),
            i = (0, C.useRef)({ data: !1, error: !1, isValidating: !1 }),
            s = (0, C.useCallback)((e) => {
              let s = !1,
                a = n.current;
              for (const t in e)
                Object.prototype.hasOwnProperty.call(e, t) &&
                  a[t] !== e[t] &&
                  ((a[t] = e[t]), i.current[t] && (s = !0));
              s && !r.current && t({});
            }, []);
          return (
            ec(
              () => (
                (r.current = !1),
                () => {
                  r.current = !0;
                }
              ),
            ),
            [n, i.current, s]
          );
        })({ data: G, error: G, isMutating: !1 }),
        c = l.current,
        h = (0, C.useCallback)(async (e, t) => {
          const [r, l] = ek(i.current);
          if (!s.current) throw Error("Can’t trigger the mutation: missing fetcher.");
          if (!r) throw Error("Can’t trigger the mutation: missing key.");
          const u = Y(Y({ populateCache: !1, throwOnError: !0 }, a.current), t),
            c = eb();
          (o.current = c), d({ isMutating: !0 });
          try {
            const t = await n(r, s.current(l, { arg: e }), Y(u, { throwOnError: !0 }));
            return (
              o.current <= c &&
                (e5(() => d({ data: t, isMutating: !1, error: void 0 })),
                null == u.onSuccess || u.onSuccess.call(u, t, r, u)),
              t
            );
          } catch (e) {
            if (
              o.current <= c &&
              (e5(() => d({ error: e, isMutating: !1 })),
              null == u.onError || u.onError.call(u, e, r, u),
              u.throwOnError)
            )
              throw e;
          }
        }, []),
        p = (0, C.useCallback)(() => {
          (o.current = eb()), d({ data: G, error: G, isMutating: !1 });
        }, []);
      return (
        ec(() => {
          (i.current = e), (s.current = t), (a.current = r);
        }),
        {
          trigger: h,
          reset: p,
          get data() {
            return (u.data = !0), c.data;
          },
          get error() {
            return (u.error = !0), c.error;
          },
          get isMutating() {
            return (u.isMutating = !0), c.isMutating;
          },
        }
      );
    });
    const e9 = (e, t) => {
      const { assertCtxFn: r = e2 } = t || {},
        n = C.default.createContext(void 0);
      return (
        (n.displayName = e),
        [
          n,
          () => {
            const t = C.default.useContext(n);
            return r(t, `${e} not found`), t.value;
          },
          () => {
            const e = C.default.useContext(n);
            return e ? e.value : {};
          },
        ]
      );
    };
    function e8({ swrConfig: e, children: t }) {
      return C.default.createElement(eD, { value: e }, t);
    }
    const [e4, e6] = e9("ClerkInstanceContext"),
      [e3, e7] = e9("UserContext"),
      [te, tt] = e9("ClientContext"),
      [tr, tn] = e9("SessionContext");
    C.default.createContext({});
    const [ti, ts] = e9("CheckoutContext"),
      ta = ({ children: e, ...t }) =>
        C.default.createElement(ti.Provider, { value: { value: t } }, e),
      [to, tl] = e9("OrganizationContext"),
      tu = ({ children: e, organization: t, swrConfig: r }) =>
        C.default.createElement(
          e8,
          { swrConfig: r },
          C.default.createElement(to.Provider, { value: { value: { organization: t } } }, e),
        );
    function td(e) {
      if (!C.default.useContext(e4)) {
        if ("function" == typeof e) return void e();
        throw Error(
          `${e} can only be used within the <ClerkProvider /> component.

Possible fixes:
1. Ensure that the <ClerkProvider /> is correctly wrapping your application where this component is used.
2. Check for multiple versions of the \`@clerk/shared\` package in your project. Use a tool like \`npm ls @clerk/shared\` to identify multiple versions, and update your dependencies to only rely on one.

Learn more: https://clerk.com/docs/components/clerk-provider`.trim(),
        );
      }
    }
    function tc(e) {
      return {
        queryKey: [e.stablePrefix, e.authenticated, e.tracked, e.untracked],
        invalidationKey: [e.stablePrefix, e.authenticated, e.tracked],
        stableKey: e.stablePrefix,
        authenticated: e.authenticated,
      };
    }
    function th(e) {
      const { queryKey: t } = e;
      return { type: t[0], ...t[2], ...t[3].args };
    }
    const tp = (e, t) => {
      const r = "boolean" == typeof e && e,
        n = (0, C.useRef)(r ? t.initialPage : (e?.initialPage ?? t.initialPage)),
        i = (0, C.useRef)(r ? t.pageSize : (e?.pageSize ?? t.pageSize)),
        s = {};
      for (const n of Object.keys(t)) s[n] = r ? t[n] : (e?.[n] ?? t[n]);
      return { ...s, initialPage: n.current, pageSize: i.current };
    };
    function tf(e, t) {
      const r = new Set(Object.keys(t)),
        n = {};
      for (const t of Object.keys(e)) r.has(t) || (n[t] = e[t]);
      return n;
    }
    const tg = { dedupingInterval: 6e4, focusThrottleInterval: 12e4 },
      tm = { ...tg, revalidateFirstPage: !1 },
      ty = (e) => {
        let t,
          r,
          { fetcher: n, config: i, keys: s } = e,
          [a, o] = (0, C.useState)(i.initialPage ?? 1),
          l = (0, C.useRef)(i.initialPage ?? 1),
          u = (0, C.useRef)(i.pageSize ?? 10),
          d = i.enabled ?? !0,
          c = "cache" === i.__experimental_mode,
          h = i.infinite ?? !1,
          p = i.keepPreviousData ?? !1,
          f = i.isSignedIn,
          g = { ...th(s), initialPage: a, pageSize: u.current },
          m =
            ((t = (0, C.useRef)(f)),
            (r = (0, C.useRef)(null)),
            t.current !== f && ((r.current = t.current), (t.current = f)),
            r.current),
          y = !h && d && (!!c || !!n),
          {
            data: k,
            isValidating: v,
            isLoading: b,
            error: _,
            mutate: P,
          } = eq(
            "boolean" == typeof f ? ((!0 === m && !1 === f) || (f && y) ? g : null) : y ? g : null,
            !c && n
              ? (e) =>
                  !1 === f || !1 === y ? null : n(tf(e, { type: s.queryKey[0], ...s.queryKey[2] }))
              : null,
            { keepPreviousData: p, ...tg },
          ),
          {
            data: w,
            isLoading: S,
            isValidating: j,
            error: O,
            size: E,
            setSize: M,
            mutate: U,
          } = eX(
            (e) =>
              h && d && !1 !== f
                ? { ...th(s), initialPage: l.current + e, pageSize: u.current }
                : null,
            (e) => {
              const t = tf(e, { type: s.queryKey[0], ...s.queryKey[2] });
              return n?.(t);
            },
            tm,
          ),
          T = (0, C.useMemo)(() => (h ? E : a), [h, E, a]),
          x = (0, C.useCallback)((e) => (h ? void M(e) : o(e)), [M, h]),
          A = (0, C.useMemo)(
            () => (h ? (w?.flatMap((e) => e?.data) ?? []) : (k?.data ?? [])),
            [h, k, w],
          ),
          z = (0, C.useMemo)(
            () => (h ? w?.[w?.length - 1]?.total_count || 0 : (k?.total_count ?? 0)),
            [h, k, w],
          ),
          I = h ? S : b,
          R = h ? j : v,
          L = (h ? O : _) ?? null,
          N = (0, C.useCallback)(() => {
            x((e) => Math.max(0, e + 1));
          }, [x]),
          W = (0, C.useCallback)(() => {
            x((e) => Math.max(0, e - 1));
          }, [x]),
          F = (l.current - 1) * u.current;
        return {
          data: A,
          count: z,
          error: L,
          isLoading: I,
          isFetching: R,
          isError: !!L,
          page: T,
          pageCount: Math.ceil((z - F) / u.current),
          fetchPage: x,
          fetchNext: N,
          fetchPrevious: W,
          hasNextPage: z - F * u.current > T * u.current,
          hasPreviousPage: (T - 1) * u.current > F * u.current,
          revalidate: h ? () => U() : () => P(),
          setData: h ? (e) => U(e, { revalidate: !1 }) : (e) => P(e, { revalidate: !1 }),
        };
      },
      tk = {
        data: void 0,
        count: void 0,
        error: void 0,
        isLoading: !1,
        isFetching: !1,
        isError: !1,
        page: void 0,
        pageCount: void 0,
        fetchPage: void 0,
        fetchNext: void 0,
        fetchPrevious: void 0,
        hasNextPage: !1,
        hasPreviousPage: !1,
        revalidate: void 0,
        setData: void 0,
      };
    "u" > typeof window ? C.default.useLayoutEffect : C.default.useEffect;
    const tv = "useUser",
      tb = e1;
    function t_({ hookName: e, resourceType: t, useFetcher: r, options: n }) {
      return (i) => {
        const { for: s, enabled: a, ...o } = i || {},
          l = s || "user";
        td(e);
        const u = r(l),
          d = tp(o, {
            initialPage: 1,
            pageSize: 10,
            keepPreviousData: !1,
            infinite: !1,
            __experimental_mode: void 0,
          }),
          c = e6(),
          h = e7(),
          { organization: p } = tl();
        c.telemetry?.record(K(e));
        const f = "organization" === l,
          g = ((e) => {
            const t = e6(),
              r = e?.enabled ?? !0,
              n = t.__unstable__environment,
              i = e7(),
              { organization: s } = tl(),
              a = e?.for === "organization",
              o = a
                ? n?.commerceSettings.billing.organization.enabled
                : n?.commerceSettings.billing.user.enabled,
              l = !(e?.authenticated ?? !0) || ((!a || !!s?.id) && !!i?.id);
            return o && r && t.loaded && l;
          })({ for: l, enabled: a, authenticated: !n?.unauthenticated }),
          m =
            void 0 === o
              ? void 0
              : {
                  initialPage: d.initialPage,
                  pageSize: d.pageSize,
                  ...(n?.unauthenticated ? {} : f ? { orgId: p?.id } : {}),
                },
          y = !!m && c.loaded && !!g;
        return ty({
          fetcher: u,
          config: {
            keepPreviousData: d.keepPreviousData,
            infinite: d.infinite,
            enabled: y,
            ...(n?.unauthenticated ? {} : { isSignedIn: null !== h }),
            __experimental_mode: d.__experimental_mode,
            initialPage: d.initialPage,
            pageSize: d.pageSize,
          },
          keys: tc({
            stablePrefix: t,
            authenticated: !n?.unauthenticated,
            tracked: n?.unauthenticated
              ? { for: l }
              : { userId: h?.id, ...(f ? { _orgId: p?.id } : {}) },
            untracked: { args: m },
          }),
        });
      };
    }
    t_({
      hookName: "useStatements",
      resourceType: "billing-statements",
      useFetcher: () => {
        const e = e6();
        if (e.loaded) return e.billing.getStatements;
      },
    }),
      t_({
        hookName: "usePaymentAttempts",
        resourceType: "billing-payment-attempts",
        useFetcher: () => {
          const e = e6();
          if (e.loaded) return e.billing.getPaymentAttempts;
        },
      }),
      t_({
        hookName: "usePaymentMethods",
        resourceType: "billing-payment-methods",
        useFetcher: (e) => {
          const { organization: t } = tl(),
            r = e7();
          return "organization" === e ? t?.getPaymentMethods : r?.getPaymentMethods;
        },
      }),
      t_({
        hookName: "usePlans",
        resourceType: "billing-plans",
        useFetcher: (e) => {
          const t = e6();
          if (t.loaded) return (r) => t.billing.getPlans({ ...r, for: e });
        },
        options: { unauthenticated: !0 },
      });
    const tP = (e, t, r) => {
        const n = !!r,
          i = (0, C.useRef)(r);
        (0, C.useEffect)(() => {
          i.current = r;
        }, [r]),
          (0, C.useEffect)(() => {
            if (!n || !e) return () => {};
            const r = (...e) => {
              i.current && i.current(...e);
            };
            return (
              e.on(t, r),
              () => {
                e.off(t, r);
              }
            );
          }, [n, t, e, i]);
      },
      tw = C.default.createContext(null);
    tw.displayName = "ElementsContext";
    const tC = (e) => null !== e && "object" == typeof e,
      tS = "[object Object]",
      tj = (e, t) => {
        if (!tC(e) || !tC(t)) return e === t;
        const r = Array.isArray(e);
        if (r !== Array.isArray(t)) return !1;
        const n = Object.prototype.toString.call(e) === tS;
        if (n !== (Object.prototype.toString.call(t) === tS)) return !1;
        if (!n && !r) return e === t;
        const i = Object.keys(e),
          s = Object.keys(t);
        if (i.length !== s.length) return !1;
        const a = {};
        for (let e = 0; e < i.length; e += 1) a[i[e]] = !0;
        for (let e = 0; e < s.length; e += 1) a[s[e]] = !0;
        const o = Object.keys(a);
        return o.length === i.length && o.every((r) => tj(e[r], t[r]));
      },
      tO = (e) =>
        ((e, t) => {
          if (!e)
            throw Error(
              `Could not find Elements context; You need to wrap the part of your app that ${t} in an <Elements> provider.`,
            );
          return e;
        })(C.default.useContext(tw), e);
    (l = "payment"),
      (u = "u" < typeof window),
      (r = `${l.charAt(0).toUpperCase() + l.slice(1)}Element`),
      ((n = u
        ? (e) => {
            tO(`mounts <${r}>`);
            const { id: t, className: n } = e;
            return C.default.createElement("div", { id: t, className: n });
          }
        : ({
            id: e,
            className: t,
            fallback: n,
            options: i = {},
            onBlur: s,
            onFocus: a,
            onReady: o,
            onChange: u,
            onEscape: d,
            onClick: c,
            onLoadError: h,
            onLoaderStart: p,
            onNetworksChange: f,
            onConfirm: g,
            onCancel: m,
            onShippingAddressChange: y,
            onShippingRateChange: k,
          }) => {
            let v,
              b,
              _ = tO(`mounts <${r}>`),
              P = "elements" in _ ? _.elements : null,
              [w, S] = C.default.useState(null),
              j = C.default.useRef(null),
              O = C.default.useRef(null),
              [E, M] = (0, C.useState)(!1);
            tP(w, "blur", s),
              tP(w, "focus", a),
              tP(w, "escape", d),
              tP(w, "click", c),
              tP(w, "loaderror", h),
              tP(w, "loaderstart", p),
              tP(w, "networkschange", f),
              tP(w, "confirm", g),
              tP(w, "cancel", m),
              tP(w, "shippingaddresschange", y),
              tP(w, "shippingratechange", k),
              tP(w, "change", u),
              o &&
                (v = () => {
                  M(!0), o(w);
                }),
              tP(w, "ready", v),
              C.default.useLayoutEffect(() => {
                if (null === j.current && null !== O.current && P) {
                  let e = null;
                  P && (e = P.create(l, i)), (j.current = e), S(e), e && e.mount(O.current);
                }
              }, [P, i]);
            const U =
              ((b = (0, C.useRef)(i)),
              (0, C.useEffect)(() => {
                b.current = i;
              }, [i]),
              b.current);
            return (
              C.default.useEffect(() => {
                var e;
                if (!j.current) return;
                const t =
                  ((e = ["paymentRequest"]),
                  tC(i)
                    ? Object.keys(i).reduce((t, r) => {
                        const n = !tC(U) || !tj(i[r], U[r]);
                        return e.includes(r)
                          ? (n &&
                              console.warn(
                                `Unsupported prop change: options.${r} is not a mutable property.`,
                              ),
                            t)
                          : n
                            ? { ...(t || {}), [r]: i[r] }
                            : t;
                      }, null)
                    : null);
                t && "update" in j.current && j.current.update(t);
              }, [i, U]),
              C.default.useLayoutEffect(
                () => () => {
                  if (j.current && "function" == typeof j.current.destroy)
                    try {
                      j.current.destroy(), (j.current = null);
                    } catch {}
                },
                [],
              ),
              C.default.createElement(
                C.default.Fragment,
                null,
                !E && n,
                C.default.createElement("div", {
                  id: e,
                  style: { height: E ? "unset" : "0px", visibility: E ? "visible" : "hidden" },
                  className: t,
                  ref: O,
                }),
              )
            );
          }).displayName = r),
      (n.__elementType = l);
    const [tE, tM] = e9("PaymentElementContext"),
      [tU, tT] = e9("StripeUtilsContext");
    var tx = M({ packageName: "@clerk/clerk-react" }),
      [tA, tz] = e9("AuthContext"),
      tI =
        "Unsupported usage of isSatellite, domain or proxyUrl. The usage of isSatellite, domain or proxyUrl as function is not supported in non-browser environments.",
      tR = (e) => {
        td(() => {
          tx.throwMissingClerkProviderError({ source: e });
        });
      },
      tL = (e) =>
        new Promise((t) => {
          const r = (n) => {
            ["ready", "degraded"].includes(n) && (t(), e.off("status", r));
          };
          e.on("status", r, { notify: !0 });
        }),
      tN = (e = {}) => {
        var t;
        tR("useAuth");
        let { treatPendingAsSignedOut: r, ...n } = null != e ? e : {},
          i = tz();
        void 0 === i.sessionId && void 0 === i.userId && (i = null != n ? n : {});
        const s = e6(),
          a = (0, C.useCallback)(
            async (e) => ((await tL(s), s.session) ? s.session.getToken(e) : null),
            [s],
          ),
          o = (0, C.useCallback)(async (...e) => (await tL(s), s.signOut(...e)), [s]);
        return (
          null == (t = s.telemetry) || t.record(K("useAuth", { treatPendingAsSignedOut: r })),
          ((e, { treatPendingAsSignedOut: t = !0 } = {}) => {
            const {
                userId: r,
                orgId: n,
                orgRole: i,
                has: s,
                signOut: a,
                getToken: o,
                orgPermissions: l,
                factorVerificationAge: u,
                sessionClaims: d,
              } = null != e ? e : {},
              c = (0, C.useCallback)(
                (e) => {
                  let t;
                  return s
                    ? s(e)
                    : ((t = {
                        userId: r,
                        orgId: n,
                        orgRole: i,
                        orgPermissions: l,
                        factorVerificationAge: u,
                        features: (null == d ? void 0 : d.fea) || "",
                        plans: (null == d ? void 0 : d.pla) || "",
                      }),
                      (e) => {
                        if (!t.userId) return !1;
                        const r = ((e, t) => {
                            const { features: r, plans: n } = t;
                            return e.feature && r
                              ? z(r, e.feature)
                              : e.plan && n
                                ? z(n, e.plan)
                                : null;
                          })(e, t),
                          n = ((e, t) => {
                            const { orgId: r, orgRole: n, orgPermissions: i } = t;
                            return (e.role || e.permission) && r && n && i
                              ? e.permission
                                ? i.includes(e.permission.replace(/^(org:)*/, "org:"))
                                : e.role
                                  ? n.replace(/^(org:)*/, "org:") ===
                                    e.role.replace(/^(org:)*/, "org:")
                                  : null
                              : null;
                          })(e, t),
                          i = ((e, { factorVerificationAge: t }) => {
                            if (!e.reverification || !t) return null;
                            const r = ((e) => {
                              let t, r;
                              if (!e) return !1;
                              const n = "string" == typeof e && A.has(e),
                                i =
                                  "object" == typeof e &&
                                  ((t = e.level), x.has(t)) &&
                                  "number" == typeof (r = e.afterMinutes) &&
                                  r > 0;
                              return (
                                (!!n || !!i) &&
                                ((e) => ("string" == typeof e ? T[e] : e)).bind(null, e)
                              );
                            })(e.reverification);
                            if (!r) return null;
                            const { level: n, afterMinutes: i } = r(),
                              [s, a] = t,
                              o = -1 !== s ? i > s : null,
                              l = -1 !== a ? i > a : null;
                            switch (n) {
                              case "first_factor":
                                return o;
                              case "second_factor":
                                return -1 !== a ? l : o;
                              case "multi_factor":
                                return -1 === a ? o : o && l;
                            }
                          })(e, t);
                        return [r || n, i].some((e) => null === e)
                          ? [r || n, i].some((e) => !0 === e)
                          : [r || n, i].every((e) => !0 === e);
                      })(e);
                },
                [s, r, n, i, l, u, d],
              ),
              h = (({
                authObject: {
                  sessionId: e,
                  sessionStatus: t,
                  userId: r,
                  actor: n,
                  orgId: i,
                  orgRole: s,
                  orgSlug: a,
                  signOut: o,
                  getToken: l,
                  has: u,
                  sessionClaims: d,
                },
                options: { treatPendingAsSignedOut: c = !0 },
              }) =>
                void 0 === e && void 0 === r
                  ? {
                      isLoaded: !1,
                      isSignedIn: void 0,
                      sessionId: e,
                      sessionClaims: void 0,
                      userId: r,
                      actor: void 0,
                      orgId: void 0,
                      orgRole: void 0,
                      orgSlug: void 0,
                      has: void 0,
                      signOut: o,
                      getToken: l,
                    }
                  : null === e && null === r
                    ? {
                        isLoaded: !0,
                        isSignedIn: !1,
                        sessionId: e,
                        userId: r,
                        sessionClaims: null,
                        actor: null,
                        orgId: null,
                        orgRole: null,
                        orgSlug: null,
                        has: () => !1,
                        signOut: o,
                        getToken: l,
                      }
                    : c && "pending" === t
                      ? {
                          isLoaded: !0,
                          isSignedIn: !1,
                          sessionId: null,
                          userId: null,
                          sessionClaims: null,
                          actor: null,
                          orgId: null,
                          orgRole: null,
                          orgSlug: null,
                          has: () => !1,
                          signOut: o,
                          getToken: l,
                        }
                      : e && d && r && i && s
                        ? {
                            isLoaded: !0,
                            isSignedIn: !0,
                            sessionId: e,
                            sessionClaims: d,
                            userId: r,
                            actor: n || null,
                            orgId: i,
                            orgRole: s,
                            orgSlug: a || null,
                            has: u,
                            signOut: o,
                            getToken: l,
                          }
                        : e && d && r && !i
                          ? {
                              isLoaded: !0,
                              isSignedIn: !0,
                              sessionId: e,
                              sessionClaims: d,
                              userId: r,
                              actor: n || null,
                              orgId: null,
                              orgRole: null,
                              orgSlug: null,
                              has: u,
                              signOut: o,
                              getToken: l,
                            }
                          : void 0)({
                authObject: { ...e, getToken: o, signOut: a, has: c },
                options: { treatPendingAsSignedOut: t },
              });
            return (
              h ||
              tx.throw(
                "Invalid state. Feel free to submit a bug or reach out to support here: https://clerk.com/support",
              )
            );
          })({ ...i, getToken: a, signOut: o }, { treatPendingAsSignedOut: r })
        );
      },
      tW = (e, t) => {
        const r =
          ("string" == typeof t ? t : null == t ? void 0 : t.component) ||
          e.displayName ||
          e.name ||
          "Component";
        e.displayName = r;
        const n = "string" == typeof t ? void 0 : t,
          i = (t) => {
            tR(r || "withClerk");
            const i = e6();
            return i.loaded || (null == n ? void 0 : n.renderWhileLoading)
              ? C.default.createElement(e, { ...t, component: r, clerk: i })
              : null;
          };
        return (i.displayName = `withClerk(${r})`), i;
      };
    const tF = new Set(),
      tD = (e, t, r) => {
        const n = (() => {
            try {
              return !0;
            } catch {}
            return !1;
          })(),
          i = r ?? e;
        tF.has(i) ||
          n ||
          (tF.add(i),
          console.warn(`Clerk - DEPRECATION WARNING: "${e}" is deprecated and will be removed in the next major release.
${t}`));
      };
    tW(({ clerk: e, ...t }) => {
      const { client: r, session: n } = e,
        i = r.signedInSessions
          ? r.signedInSessions.length > 0
          : r.activeSessions && r.activeSessions.length > 0;
      return (
        C.default.useEffect(() => {
          null === n && i ? e.redirectToAfterSignOut() : e.redirectToSignIn(t);
        }, []),
        null
      );
    }, "RedirectToSignIn"),
      tW(
        ({ clerk: e, ...t }) => (
          C.default.useEffect(() => {
            e.redirectToSignUp(t);
          }, []),
          null
        ),
        "RedirectToSignUp",
      ),
      tW(
        ({ clerk: e, ...t }) => (
          C.default.useEffect(() => {
            e.redirectToTasks(t);
          }, []),
          null
        ),
        "RedirectToTasks",
      ),
      tW(
        ({ clerk: e }) => (
          C.default.useEffect(() => {
            tD("RedirectToUserProfile", "Use the `redirectToUserProfile()` method instead."),
              e.redirectToUserProfile();
          }, []),
          null
        ),
        "RedirectToUserProfile",
      ),
      tW(
        ({ clerk: e }) => (
          C.default.useEffect(() => {
            tD(
              "RedirectToOrganizationProfile",
              "Use the `redirectToOrganizationProfile()` method instead.",
            ),
              e.redirectToOrganizationProfile();
          }, []),
          null
        ),
        "RedirectToOrganizationProfile",
      ),
      tW(
        ({ clerk: e }) => (
          C.default.useEffect(() => {
            tD(
              "RedirectToCreateOrganization",
              "Use the `redirectToCreateOrganization()` method instead.",
            ),
              e.redirectToCreateOrganization();
          }, []),
          null
        ),
        "RedirectToCreateOrganization",
      ),
      tW(
        ({ clerk: e, ...t }) => (
          C.default.useEffect(() => {
            e.handleRedirectCallback(t);
          }, []),
          null
        ),
        "AuthenticateWithRedirectCallback",
      );
    const tq = (e) => {};
    var tK = C,
      tB = e.i(36788);
    const t$ = (e, ...t) => {
      const r = { ...e };
      for (const e of t) delete r[e];
      return r;
    };
    var tV = (e) => (t) => {
        try {
          return tK.default.Children.only(e);
        } catch {
          return tx.throw(
            `You've passed multiple children components to <${t}/>. You can only pass a single child component or text.`,
          );
        }
      },
      tQ = (e, t) => (
        e || (e = t), "string" == typeof e && (e = tK.default.createElement("button", null, e)), e
      ),
      tG =
        (e) =>
        (...t) => {
          if (e && "function" == typeof e) return e(...t);
        },
      tH = new Map(),
      tJ = (e) => {
        const [t, r] = (0, tK.useState)(new Map());
        return e.map((e) => ({
          id: e.id,
          mount: (t) => r((r) => new Map(r).set(String(e.id), t)),
          unmount: () =>
            r((t) => {
              const r = new Map(t);
              return r.set(String(e.id), null), r;
            }),
          portal: () => {
            const r = t.get(String(e.id));
            return r ? (0, tB.createPortal)(e.component, r) : null;
          },
        }));
      },
      tY = (e, t) => !!e && tK.default.isValidElement(e) && (null == e ? void 0 : e.type) === t,
      tX = (e, t) =>
        t1(
          {
            children: e,
            reorderItemsLabels: ["account", "security", "billing", "apiKeys"],
            LinkComponent: rs,
            PageComponent: ri,
            MenuItemsComponent: ro,
            componentName: "UserProfile",
          },
          t,
        ),
      tZ = (e, t) =>
        t1(
          {
            children: e,
            reorderItemsLabels: ["general", "members", "billing", "apiKeys"],
            LinkComponent: rh,
            PageComponent: rc,
            componentName: "OrganizationProfile",
          },
          t,
        ),
      t0 = (e) => {
        const t = [],
          r = [rh, rc, ro, ri, rs];
        return (
          tK.default.Children.forEach(e, (e) => {
            r.some((t) => tY(e, t)) || t.push(e);
          }),
          t
        );
      },
      t1 = (e, t) => {
        const {
            children: r,
            LinkComponent: n,
            PageComponent: i,
            MenuItemsComponent: s,
            reorderItemsLabels: a,
            componentName: o,
          } = e,
          { allowForAnyChildren: l = !1 } = t || {},
          u = [];
        tK.default.Children.forEach(r, (e) => {
          if (!tY(e, i) && !tY(e, n) && !tY(e, s)) {
            e &&
              !l &&
              tq(
                `<${o} /> can only accept <${o}.Page /> and <${o}.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`,
              );
            return;
          }
          const { props: t } = e,
            { children: r, label: d, url: c, labelIcon: h } = t;
          if (tY(e, i))
            if (t5(t, a)) u.push({ label: d });
            else if (t2(t)) u.push({ label: d, labelIcon: h, children: r, url: c });
            else
              return void tq(
                `Missing props. <${o}.Page /> component requires the following props: url, label, labelIcon, alongside with children to be rendered inside the page.`,
              );
          if (tY(e, n))
            if (t9(t)) u.push({ label: d, labelIcon: h, url: c });
            else
              return void tq(
                `Missing props. <${o}.Link /> component requires the following props: url, label and labelIcon.`,
              );
        });
        const d = [],
          c = [],
          h = [];
        u.forEach((e, t) => {
          if (t2(e)) {
            d.push({ component: e.children, id: t }), c.push({ component: e.labelIcon, id: t });
            return;
          }
          t9(e) && h.push({ component: e.labelIcon, id: t });
        });
        const p = tJ(d),
          f = tJ(c),
          g = tJ(h),
          m = [],
          y = [];
        return (
          u.forEach((e, t) => {
            if (t5(e, a)) return void m.push({ label: e.label });
            if (t2(e)) {
              const { portal: r, mount: n, unmount: i } = p.find((e) => e.id === t),
                { portal: s, mount: a, unmount: o } = f.find((e) => e.id === t);
              m.push({
                label: e.label,
                url: e.url,
                mount: n,
                unmount: i,
                mountIcon: a,
                unmountIcon: o,
              }),
                y.push(r),
                y.push(s);
              return;
            }
            if (t9(e)) {
              const { portal: r, mount: n, unmount: i } = g.find((e) => e.id === t);
              m.push({ label: e.label, url: e.url, mountIcon: n, unmountIcon: i }), y.push(r);
              return;
            }
          }),
          { customPages: m, customPagesPortals: y }
        );
      },
      t5 = (e, t) => {
        const { children: r, label: n, url: i, labelIcon: s } = e;
        return !r && !i && !s && t.some((e) => e === n);
      },
      t2 = (e) => {
        const { children: t, label: r, url: n, labelIcon: i } = e;
        return !!t && !!n && !!i && !!r;
      },
      t9 = (e) => {
        const { children: t, label: r, url: n, labelIcon: i } = e;
        return !t && !!n && !!i && !!r;
      },
      t8 = (e, t) => {
        const { children: r, label: n, onClick: i, labelIcon: s } = e;
        return !r && !i && !s && t.some((e) => e === n);
      },
      t4 = (e) => {
        const { label: t, labelIcon: r, onClick: n, open: i } = e;
        return !!r && !!t && ("function" == typeof n || "string" == typeof i);
      },
      t6 = (e) => {
        const { label: t, href: r, labelIcon: n } = e;
        return !!r && !!n && !!t;
      },
      t3 =
        ((i = (d = {
          childList: !0,
          subtree: !0,
          isReady: (e, t) => {
            var r;
            return (
              !!(null == e ? void 0 : e.childElementCount) &&
              (null == (r = null == e ? void 0 : e.matches) ? void 0 : r.call(e, t)) &&
              e.childElementCount > 0
            );
          },
        }).isReady),
        (e) =>
          new Promise((t, r) => {
            const {
              root: n = null == document ? void 0 : document.body,
              selector: s,
              timeout: a = 0,
            } = e;
            if (!n) return void r(Error("No root element provided"));
            let o = n;
            if ((s && (o = null == n ? void 0 : n.querySelector(s)), i(o, s))) return void t();
            const l = new MutationObserver((e) => {
              for (const r of e)
                if (
                  (!o && s && (o = null == n ? void 0 : n.querySelector(s)),
                  ((d.childList && "childList" === r.type) ||
                    (d.attributes && "attributes" === r.type)) &&
                    i(o, s))
                ) {
                  l.disconnect(), t();
                  return;
                }
            });
            l.observe(n, d),
              a > 0 &&
                setTimeout(() => {
                  l.disconnect(), r(Error(`Timeout waiting for ${s}`));
                }, a);
          }));
    function t7(e, t) {
      const r = (0, tK.useRef)(),
        [n, i] = (0, tK.useState)("rendering");
      return (
        (0, tK.useEffect)(() => {
          if (!e) throw Error("Clerk: no component name provided, unable to detect mount.");
          if ("u" > typeof window && !r.current) {
            const n = `[data-clerk-component="${e}"]`,
              s = null == t ? void 0 : t.selector;
            r.current = t3({ selector: s ? n + s : n })
              .then(() => {
                i("rendered");
              })
              .catch(() => {
                i("error");
              });
          }
        }, [e, null == t ? void 0 : t.selector]),
        n
      );
    }
    var re = (e) => (null == e ? void 0 : e.map(({ mountIcon: e, unmountIcon: t, ...r }) => r)),
      rt = class extends tK.default.PureComponent {
        constructor() {
          super(...arguments), (this.rootRef = tK.default.createRef());
        }
        componentDidUpdate(e) {
          var t, r, n, i;
          if (!("mount" in e) || !("mount" in this.props)) return;
          const s = t$(e.props, "customPages", "customMenuItems", "children"),
            a = t$(this.props.props, "customPages", "customMenuItems", "children"),
            o =
              (null == (t = s.customPages) ? void 0 : t.length) !==
              (null == (r = a.customPages) ? void 0 : r.length),
            l =
              (null == (n = s.customMenuItems) ? void 0 : n.length) !==
              (null == (i = a.customMenuItems) ? void 0 : i.length),
            u = re(e.props.customMenuItems),
            d = re(this.props.props.customMenuItems);
          (!tb(s, a) || !tb(u, d) || o || l) &&
            this.rootRef.current &&
            this.props.updateProps({ node: this.rootRef.current, props: this.props.props });
        }
        componentDidMount() {
          this.rootRef.current &&
            ("mount" in this.props && this.props.mount(this.rootRef.current, this.props.props),
            "open" in this.props && this.props.open(this.props.props));
        }
        componentWillUnmount() {
          this.rootRef.current &&
            ("mount" in this.props && this.props.unmount(this.rootRef.current),
            "open" in this.props && this.props.close());
        }
        render() {
          const { hideRootHtmlElement: e = !1 } = this.props,
            t = {
              ref: this.rootRef,
              ...this.props.rootProps,
              ...(this.props.component && { "data-clerk-component": this.props.component }),
            };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            !e && tK.default.createElement("div", { ...t }),
            this.props.children,
          );
        }
      },
      rr = (e) => {
        var t, r;
        return tK.default.createElement(
          tK.default.Fragment,
          null,
          null == (t = null == e ? void 0 : e.customPagesPortals)
            ? void 0
            : t.map((e, t) => (0, tK.createElement)(e, { key: t })),
          null == (r = null == e ? void 0 : e.customMenuItemsPortals)
            ? void 0
            : r.map((e, t) => (0, tK.createElement)(e, { key: t })),
        );
      },
      rn = tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountSignIn,
                unmount: e.unmountSignIn,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "SignIn", renderWhileLoading: !0 },
      );
    function ri({ children: e }) {
      return (
        tq(
          "<UserProfile.Page /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    function rs({ children: e }) {
      return (
        tq(
          "<UserProfile.Link /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    tW(
      ({ clerk: e, component: t, fallback: r, ...n }) => {
        const i = "rendering" === t7(t) || !e.loaded,
          s = { ...(i && r && { style: { display: "none" } }) };
        return tK.default.createElement(
          tK.default.Fragment,
          null,
          i && r,
          e.loaded &&
            tK.default.createElement(rt, {
              component: t,
              mount: e.mountSignUp,
              unmount: e.unmountSignUp,
              updateProps: e.__unstable__updateProps,
              props: n,
              rootProps: s,
            }),
        );
      },
      { component: "SignUp", renderWhileLoading: !0 },
    ),
      Object.assign(
        tW(
          ({ clerk: e, component: t, fallback: r, ...n }) => {
            const i = "rendering" === t7(t) || !e.loaded,
              s = { ...(i && r && { style: { display: "none" } }) },
              { customPages: a, customPagesPortals: o } = tX(n.children);
            return tK.default.createElement(
              tK.default.Fragment,
              null,
              i && r,
              tK.default.createElement(
                rt,
                {
                  component: t,
                  mount: e.mountUserProfile,
                  unmount: e.unmountUserProfile,
                  updateProps: e.__unstable__updateProps,
                  props: { ...n, customPages: a },
                  rootProps: s,
                },
                tK.default.createElement(rr, { customPagesPortals: o }),
              ),
            );
          },
          { component: "UserProfile", renderWhileLoading: !0 },
        ),
        { Page: ri, Link: rs },
      );
    var ra = (0, tK.createContext)({ mount: () => {}, unmount: () => {}, updateProps: () => {} });
    function ro({ children: e }) {
      return (
        tq("<UserButton.MenuItems /> component needs to be a direct child of `<UserButton />`."),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    function rl({ children: e }) {
      return (
        tq(
          "<UserButton.Action /> component needs to be a direct child of `<UserButton.MenuItems />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    function ru({ children: e }) {
      return (
        tq(
          "<UserButton.Link /> component needs to be a direct child of `<UserButton.MenuItems />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    var rd = Object.assign(
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          var i;
          const s = "rendering" === t7(t) || !e.loaded,
            a = { ...(s && r && { style: { display: "none" } }) },
            { customPages: o, customPagesPortals: l } = tX(n.children, {
              allowForAnyChildren: !!n.__experimental_asProvider,
            }),
            u = { ...n.userProfileProps, customPages: o },
            { customMenuItems: d, customMenuItemsPortals: c } = (({
              children: e,
              MenuItemsComponent: t,
              MenuActionComponent: r,
              MenuLinkComponent: n,
              UserProfileLinkComponent: i,
              UserProfilePageComponent: s,
              reorderItemsLabels: a,
              allowForAnyChildren: o = !1,
            }) => {
              const l = [],
                u = [],
                d = [];
              tK.default.Children.forEach(e, (e) => {
                if (!tY(e, t) && !tY(e, i) && !tY(e, s)) {
                  e &&
                    !o &&
                    tq(
                      "<UserButton /> can only accept <UserButton.UserProfilePage />, <UserButton.UserProfileLink /> and <UserButton.MenuItems /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.",
                    );
                  return;
                }
                if (tY(e, i) || tY(e, s)) return;
                const { props: u } = e;
                tK.default.Children.forEach(u.children, (e) => {
                  if (!tY(e, r) && !tY(e, n)) {
                    e &&
                      tq(
                        "<UserButton.MenuItems /> component can only accept <UserButton.Action /> and <UserButton.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.",
                      );
                    return;
                  }
                  const { props: t } = e,
                    { label: i, labelIcon: s, href: o, onClick: u, open: d } = t;
                  if (tY(e, r))
                    if (t8(t, a)) l.push({ label: i });
                    else {
                      if (!t4(t))
                        return void tq(
                          "Missing props. <UserButton.Action /> component requires the following props: label.",
                        );
                      const e = { label: i, labelIcon: s };
                      if (void 0 !== u) l.push({ ...e, onClick: u });
                      else {
                        if (void 0 === d)
                          return void tq(
                            "Custom menu item must have either onClick or open property",
                          );
                        l.push({ ...e, open: d.startsWith("/") ? d : `/${d}` });
                      }
                    }
                  if (tY(e, n))
                    if (!t6(t))
                      return void tq(
                        "Missing props. <UserButton.Link /> component requires the following props: href, label and labelIcon.",
                      );
                    else l.push({ label: i, labelIcon: s, href: o });
                });
              });
              const c = [],
                h = [];
              l.forEach((e, t) => {
                t4(e) && c.push({ component: e.labelIcon, id: t }),
                  t6(e) && h.push({ component: e.labelIcon, id: t });
              });
              const p = tJ(c),
                f = tJ(h);
              return (
                l.forEach((e, t) => {
                  if ((t8(e, a) && u.push({ label: e.label }), t4(e))) {
                    const { portal: r, mount: n, unmount: i } = p.find((e) => e.id === t),
                      s = { label: e.label, mountIcon: n, unmountIcon: i };
                    "onClick" in e ? (s.onClick = e.onClick) : "open" in e && (s.open = e.open),
                      u.push(s),
                      d.push(r);
                  }
                  if (t6(e)) {
                    const { portal: r, mount: n, unmount: i } = f.find((e) => e.id === t);
                    u.push({ label: e.label, href: e.href, mountIcon: n, unmountIcon: i }),
                      d.push(r);
                  }
                }),
                { customMenuItems: u, customMenuItemsPortals: d }
              );
            })({
              children: n.children,
              reorderItemsLabels: ["manageAccount", "signOut"],
              MenuItemsComponent: ro,
              MenuActionComponent: rl,
              MenuLinkComponent: ru,
              UserProfileLinkComponent: rs,
              UserProfilePageComponent: ri,
              allowForAnyChildren:
                null !=
                  (i = { allowForAnyChildren: !!n.__experimental_asProvider }
                    .allowForAnyChildren) && i,
            }),
            h = t0(n.children),
            p = {
              mount: e.mountUserButton,
              unmount: e.unmountUserButton,
              updateProps: e.__unstable__updateProps,
              props: { ...n, userProfileProps: u, customMenuItems: d },
            };
          return tK.default.createElement(
            ra.Provider,
            { value: p },
            s && r,
            e.loaded &&
              tK.default.createElement(
                rt,
                {
                  component: t,
                  ...p,
                  hideRootHtmlElement: !!n.__experimental_asProvider,
                  rootProps: a,
                },
                n.__experimental_asProvider ? h : null,
                tK.default.createElement(rr, { customPagesPortals: l, customMenuItemsPortals: c }),
              ),
          );
        },
        { component: "UserButton", renderWhileLoading: !0 },
      ),
      {
        UserProfilePage: ri,
        UserProfileLink: rs,
        MenuItems: ro,
        Action: rl,
        Link: ru,
        __experimental_Outlet: (e) => {
          const t = (0, tK.useContext)(ra),
            r = { ...t, props: { ...t.props, ...e } };
          return tK.default.createElement(rt, { ...r });
        },
      },
    );
    function rc({ children: e }) {
      return (
        tq(
          "<OrganizationProfile.Page /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    function rh({ children: e }) {
      return (
        tq(
          "<OrganizationProfile.Link /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.",
        ),
        tK.default.createElement(tK.default.Fragment, null, e)
      );
    }
    Object.assign(
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) },
            { customPages: a, customPagesPortals: o } = tZ(n.children);
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(
                rt,
                {
                  component: t,
                  mount: e.mountOrganizationProfile,
                  unmount: e.unmountOrganizationProfile,
                  updateProps: e.__unstable__updateProps,
                  props: { ...n, customPages: a },
                  rootProps: s,
                },
                tK.default.createElement(rr, { customPagesPortals: o }),
              ),
          );
        },
        { component: "OrganizationProfile", renderWhileLoading: !0 },
      ),
      { Page: rc, Link: rh },
    ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountCreateOrganization,
                unmount: e.unmountCreateOrganization,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "CreateOrganization", renderWhileLoading: !0 },
      );
    var rp = (0, tK.createContext)({ mount: () => {}, unmount: () => {}, updateProps: () => {} });
    Object.assign(
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) },
            { customPages: a, customPagesPortals: o } = tZ(n.children, {
              allowForAnyChildren: !!n.__experimental_asProvider,
            }),
            l = { ...n.organizationProfileProps, customPages: a },
            u = t0(n.children),
            d = {
              mount: e.mountOrganizationSwitcher,
              unmount: e.unmountOrganizationSwitcher,
              updateProps: e.__unstable__updateProps,
              props: { ...n, organizationProfileProps: l },
              rootProps: s,
              component: t,
            };
          return (
            e.__experimental_prefetchOrganizationSwitcher(),
            tK.default.createElement(
              rp.Provider,
              { value: d },
              tK.default.createElement(
                tK.default.Fragment,
                null,
                i && r,
                e.loaded &&
                  tK.default.createElement(
                    rt,
                    { ...d, hideRootHtmlElement: !!n.__experimental_asProvider },
                    n.__experimental_asProvider ? u : null,
                    tK.default.createElement(rr, { customPagesPortals: o }),
                  ),
              ),
            )
          );
        },
        { component: "OrganizationSwitcher", renderWhileLoading: !0 },
      ),
      {
        OrganizationProfilePage: rc,
        OrganizationProfileLink: rh,
        __experimental_Outlet: (e) => {
          const t = (0, tK.useContext)(rp),
            r = { ...t, props: { ...t.props, ...e } };
          return tK.default.createElement(rt, { ...r });
        },
      },
    ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountOrganizationList,
                unmount: e.unmountOrganizationList,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "OrganizationList", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                open: e.openGoogleOneTap,
                close: e.closeGoogleOneTap,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "GoogleOneTap", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountWaitlist,
                unmount: e.unmountWaitlist,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "Waitlist", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i =
              "rendering" === t7(t, { selector: '[data-component-status="ready"]' }) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountPricingTable,
                unmount: e.unmountPricingTable,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "PricingTable", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountAPIKeys,
                unmount: e.unmountAPIKeys,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "ApiKeys", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountUserAvatar,
                unmount: e.unmountUserAvatar,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "UserAvatar", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountTaskChooseOrganization,
                unmount: e.unmountTaskChooseOrganization,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "TaskChooseOrganization", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountTaskResetPassword,
                unmount: e.unmountTaskResetPassword,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "TaskResetPassword", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === t7(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return tK.default.createElement(
            tK.default.Fragment,
            null,
            i && r,
            e.loaded &&
              tK.default.createElement(rt, {
                component: t,
                mount: e.mountTaskSetupMFA,
                unmount: e.unmountTaskSetupMFA,
                updateProps: e.__unstable__updateProps,
                props: n,
                rootProps: s,
              }),
          );
        },
        { component: "TaskSetupMFA", renderWhileLoading: !0 },
      );
    var rf = (e) => {
        throw TypeError(e);
      },
      rg = (e, t, r) => t.has(e) || rf("Cannot " + r),
      rm = (e, t, r) => (rg(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
      ry = (e, t, r) =>
        t.has(e)
          ? rf("Cannot add the same private member more than once")
          : t instanceof WeakSet
            ? t.add(e)
            : t.set(e, r),
      rk = (e, t, r, n) => (rg(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r),
      rv = (e, t, r) => (rg(e, t, "access private method"), r);
    const rb = {
        initialDelay: 125,
        maxDelayBetweenRetries: 0,
        factor: 2,
        shouldRetry: (e, t) => t < 5,
        retryImmediately: !1,
        jitter: !0,
      },
      r_ = async (e) => new Promise((t) => setTimeout(t, e)),
      rP = (e, t) => (t ? e * (1 + Math.random()) : e),
      rw = async (e, t = {}) => {
        var r;
        let n,
          i = 0,
          {
            shouldRetry: s,
            initialDelay: a,
            maxDelayBetweenRetries: o,
            factor: l,
            retryImmediately: u,
            jitter: d,
            onBeforeRetry: c,
          } = { ...rb, ...t },
          h =
            ((r = { initialDelay: a, maxDelayBetweenRetries: o, factor: l, jitter: d }),
            (n = 0),
            async () => {
              let e;
              await r_(
                ((e = rP((e = r.initialDelay * Math.pow(r.factor, n)), r.jitter)),
                Math.min(r.maxDelayBetweenRetries || e, e)),
              ),
                n++;
            });
        for (;;)
          try {
            return await e();
          } catch (e) {
            if (!s(e, ++i)) throw e;
            c && (await c(i)), u && 1 === i ? await r_(rP(100, d)) : await h();
          }
      };
    async function rC(e = "", t) {
      const { async: r, defer: n, beforeLoad: i, crossOrigin: s, nonce: a } = t || {};
      return rw(
        () =>
          new Promise((t, o) => {
            e || o(Error("loadScript cannot be called without a src")),
              (document && document.body) ||
                o(Error("loadScript cannot be called when document does not exist"));
            const l = document.createElement("script");
            s && l.setAttribute("crossorigin", s),
              (l.async = r || !1),
              (l.defer = n || !1),
              l.addEventListener("load", () => {
                l.remove(), t(l);
              }),
              l.addEventListener("error", (t) => {
                l.remove(), o(t.error ?? Error(`failed to load script: ${e}`));
              }),
              (l.src = e),
              (l.nonce = a),
              i?.(l),
              document.body.appendChild(l);
          }),
        { shouldRetry: (e, t) => t <= 5 },
      );
    }
    function rS(e) {
      return e.startsWith("/");
    }
    const rj = "failed_to_load_clerk_js",
      rO = "Failed to load Clerk",
      { isDevOrStagingUrl: rE } =
        ((s = new Map()),
        {
          isDevOrStagingUrl: (e) => {
            if (!e) return !1;
            let t = "string" == typeof e ? e : e.hostname,
              r = s.get(t);
            return void 0 === r && ((r = L.some((e) => t.endsWith(e))), s.set(t, r)), r;
          },
        }),
      rM = M({ packageName: "@clerk/shared" });
    function rU() {
      if ("u" < typeof window || !window.Clerk) return !1;
      const e = window.Clerk;
      return "object" == typeof e && "function" == typeof e.load;
    }
    function rT(e, t) {
      return new Promise((r, n) => {
        let i = !1,
          s = (e, t) => {
            clearTimeout(e), clearInterval(t);
          };
        t?.addEventListener("error", () => {
          s(o, l), n(new U(rO, { code: rj }));
        });
        const a = () => {
            !i && rU() && ((i = !0), s(o, l), r(null));
          },
          o = setTimeout(() => {
            i ||
              ((i = !0),
              s(o, l),
              rU() ? r(null) : n(new U(rO, { code: "failed_to_load_clerk_js_timeout" })));
          }, e);
        a();
        const l = setInterval(() => {
          i ? clearInterval(l) : a();
        }, 100);
      });
    }
    const rx = async (e) => {
        const t = e?.scriptLoadTimeout ?? 15e3;
        if (rU()) return null;
        if (!e?.publishableKey) return rM.throwMissingPublishableKeyError(), null;
        const r = rA(e),
          n = document.querySelector("script[data-clerk-js-script]");
        if (n)
          if (
            ((e) => {
              if ("u" < typeof window || !window.performance) return !1;
              const t = performance.getEntriesByName(e, "resource");
              if (0 === t.length) return !1;
              const r = t[t.length - 1];
              if (
                0 === r.transferSize &&
                0 === r.decodedBodySize &&
                (0 === r.responseEnd ||
                  (r.responseEnd > 0 && r.responseStart > 0) ||
                  ("responseStatus" in r && (r.responseStatus >= 400 || 0 === r.responseStatus)))
              )
                return !0;
              return !1;
            })(r)
          )
            n.remove();
          else
            try {
              return await rT(t, n), null;
            } catch {
              n.remove();
            }
        const i = rT(t);
        return (
          rC(r, { async: !0, crossOrigin: "anonymous", nonce: e.nonce, beforeLoad: rz(e) }).catch(
            (e) => {
              throw new U(rO + (e.message ? `, ${e.message}` : ""), { code: rj, cause: e });
            },
          ),
          i
        );
      },
      rA = (e) => {
        var t;
        const {
          clerkJSUrl: r,
          clerkJSVariant: n,
          clerkJSVersion: i,
          proxyUrl: s,
          domain: a,
          publishableKey: o,
        } = e;
        if (r) return r;
        let l = "";
        if (s && (!s || ((t = s), /^http(s)?:\/\//.test(t || "")) || rS(s)))
          l = (!s ? "" : rS(s) ? new URL(s, window.location.origin).toString() : s).replace(
            /http(s)?:\/\//,
            "",
          );
        else
          l =
            a && !rE(D(o)?.frontendApi || "")
              ? ((e) => {
                  let t;
                  if (!e) return "";
                  if (e.match(/^(clerk\.)+\w*$/)) t = /(clerk\.)*(?=clerk\.)/;
                  else {
                    if (e.match(/\.clerk.accounts/)) return e;
                    t = /^(clerk\.)*/gi;
                  }
                  return `clerk.${e.replace(t, "")}`;
                })(a)
              : D(o)?.frontendApi || "";
        const u = n ? `${n.replace(/\.+$/, "")}.` : "",
          d = ((e, t = "5.125.7") => {
            let r;
            if (e) return e;
            const n =
              ((r = t),
              r
                .trim()
                .replace(/^v/, "")
                .match(/-(.+?)(\.|$)/)?.[1]);
            if (n) return "snapshot" === n ? "5.125.7" : n;
            return t.trim().replace(/^v/, "").split(".")[0];
          })(i);
        return `https://${l}/npm/@clerk/clerk-js@${d}/dist/clerk.${u}browser.js`;
      },
      rz = (e) => (t) => {
        let r,
          n =
            ((r = {}),
            e.publishableKey && (r["data-clerk-publishable-key"] = e.publishableKey),
            e.proxyUrl && (r["data-clerk-proxy-url"] = e.proxyUrl),
            e.domain && (r["data-clerk-domain"] = e.domain),
            e.nonce && (r.nonce = e.nonce),
            r);
        for (const e in n) t.setAttribute(e, n[e]);
      };
    function rI() {
      return "u" > typeof window;
    }
    /bot|spider|crawl|APIs-Google|AdsBot|Googlebot|mediapartners|Google Favicon|FeedFetcher|Google-Read-Aloud|DuplexWeb-Google|googleweblight|bing|yandex|baidu|duckduck|yahoo|ecosia|ia_archiver|facebook|instagram|pinterest|reddit|slack|twitter|whatsapp|youtube|semrush/i;
    const rR = (e, t, r, n, i) => {
        let { notify: s } = i || {},
          a = e.get(r);
        a || ((a = []), e.set(r, a)), a.push(n), s && t.has(r) && n(t.get(r));
      },
      rL = (e, t, r) => (e.get(t) || []).map((e) => e(r)),
      rN = (e, t, r) => {
        const n = e.get(t);
        n && (r ? n.splice(n.indexOf(r) >>> 0, 1) : e.set(t, []));
      },
      rW = "status";
    function rF(e, t, r) {
      return "function" == typeof e ? e(t) : void 0 !== e ? e : void 0 !== r ? r : void 0;
    }
    "u" > typeof window && !window.global && (window.global = e.g),
      tW(
        ({ clerk: e, children: t, ...r }) => {
          const {
              appearance: n,
              signUpFallbackRedirectUrl: i,
              forceRedirectUrl: s,
              fallbackRedirectUrl: a,
              signUpForceRedirectUrl: o,
              mode: l,
              initialValues: u,
              withSignUp: d,
              oauthFlow: c,
              ...h
            } = r,
            p = tV((t = tQ(t, "Sign in")))("SignInButton"),
            f = async (t) => {
              let r;
              return (
                p && "object" == typeof p && "props" in p && (await tG(p.props.onClick)(t)),
                (r = {
                  forceRedirectUrl: s,
                  fallbackRedirectUrl: a,
                  signUpFallbackRedirectUrl: i,
                  signUpForceRedirectUrl: o,
                  initialValues: u,
                  withSignUp: d,
                  oauthFlow: c,
                }),
                "modal" === l
                  ? e.openSignIn({ ...r, appearance: n })
                  : e.redirectToSignIn({
                      ...r,
                      signInFallbackRedirectUrl: a,
                      signInForceRedirectUrl: s,
                    })
              );
            },
            g = { ...h, onClick: f };
          return C.default.cloneElement(p, g);
        },
        { component: "SignInButton", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, children: t, ...r }) => {
          const { redirectUrl: n, ...i } = r,
            s = tV((t = tQ(t, "Sign in with Metamask")))("SignInWithMetamaskButton"),
            a = async () => {
              !(async () => {
                await e.authenticateWithMetamask({ redirectUrl: n || void 0 });
              })();
            },
            o = async (e) => (await tG(s.props.onClick)(e), a()),
            l = { ...i, onClick: o };
          return C.default.cloneElement(s, l);
        },
        { component: "SignInWithMetamask", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, children: t, ...r }) => {
          const { redirectUrl: n = "/", signOutOptions: i, ...s } = r,
            a = tV((t = tQ(t, "Sign out")))("SignOutButton"),
            o = async (t) => (await tG(a.props.onClick)(t), e.signOut({ redirectUrl: n, ...i })),
            l = { ...s, onClick: o };
          return C.default.cloneElement(a, l);
        },
        { component: "SignOutButton", renderWhileLoading: !0 },
      ),
      tW(
        ({ clerk: e, children: t, ...r }) => {
          const {
              appearance: n,
              unsafeMetadata: i,
              fallbackRedirectUrl: s,
              forceRedirectUrl: a,
              signInFallbackRedirectUrl: o,
              signInForceRedirectUrl: l,
              mode: u,
              initialValues: d,
              oauthFlow: c,
              ...h
            } = r,
            p = tV((t = tQ(t, "Sign up")))("SignUpButton"),
            f = async (t) => {
              let r;
              return (
                p && "object" == typeof p && "props" in p && (await tG(p.props.onClick)(t)),
                (r = {
                  fallbackRedirectUrl: s,
                  forceRedirectUrl: a,
                  signInFallbackRedirectUrl: o,
                  signInForceRedirectUrl: l,
                  initialValues: d,
                  oauthFlow: c,
                }),
                "modal" === u
                  ? e.openSignUp({ ...r, appearance: n, unsafeMetadata: i })
                  : e.redirectToSignUp({
                      ...r,
                      signUpFallbackRedirectUrl: s,
                      signUpForceRedirectUrl: a,
                    })
              );
            },
            g = { ...h, onClick: f };
          return C.default.cloneElement(p, g);
        },
        { component: "SignUpButton", renderWhileLoading: !0 },
      );
    var rD = class {
      constructor(e) {
        (this.isomorphicClerk = e),
          (this.signInSignalProxy = this.buildSignInProxy()),
          (this.signUpSignalProxy = this.buildSignUpProxy());
      }
      signInSignal() {
        return this.signInSignalProxy;
      }
      signUpSignal() {
        return this.signUpSignalProxy;
      }
      buildSignInProxy() {
        const e = this.gateProperty.bind(this),
          t = () => this.client.signIn.__internal_future;
        return {
          errors: {
            fields: { identifier: null, password: null, code: null },
            raw: null,
            global: null,
          },
          fetchStatus: "idle",
          signIn: {
            status: "needs_identifier",
            availableStrategies: [],
            isTransferable: !1,
            get id() {
              return e(t, "id", void 0);
            },
            get supportedFirstFactors() {
              return e(t, "supportedFirstFactors", []);
            },
            get supportedSecondFactors() {
              return e(t, "supportedSecondFactors", []);
            },
            get secondFactorVerification() {
              return e(t, "secondFactorVerification", {
                status: null,
                error: null,
                expireAt: null,
                externalVerificationRedirectURL: null,
                nonce: null,
                attempts: null,
                message: null,
                strategy: null,
                verifiedAtClient: null,
                verifiedFromTheSameClient: () => !1,
                __internal_toSnapshot: () => {
                  throw Error("__internal_toSnapshot called before Clerk is loaded");
                },
                pathRoot: "",
                reload: () => {
                  throw Error("__internal_toSnapshot called before Clerk is loaded");
                },
              });
            },
            get identifier() {
              return e(t, "identifier", null);
            },
            get createdSessionId() {
              return e(t, "createdSessionId", null);
            },
            get userData() {
              return e(t, "userData", {});
            },
            get firstFactorVerification() {
              return e(t, "firstFactorVerification", {
                status: null,
                error: null,
                expireAt: null,
                externalVerificationRedirectURL: null,
                nonce: null,
                attempts: null,
                message: null,
                strategy: null,
                verifiedAtClient: null,
                verifiedFromTheSameClient: () => !1,
                __internal_toSnapshot: () => {
                  throw Error("__internal_toSnapshot called before Clerk is loaded");
                },
                pathRoot: "",
                reload: () => {
                  throw Error("__internal_toSnapshot called before Clerk is loaded");
                },
              });
            },
            create: this.gateMethod(t, "create"),
            password: this.gateMethod(t, "password"),
            sso: this.gateMethod(t, "sso"),
            finalize: this.gateMethod(t, "finalize"),
            emailCode: this.wrapMethods(() => t().emailCode, ["sendCode", "verifyCode"]),
            emailLink: this.wrapStruct(
              () => t().emailLink,
              ["sendLink", "waitForVerification"],
              ["verification"],
              { verification: null },
            ),
            resetPasswordEmailCode: this.wrapMethods(
              () => t().resetPasswordEmailCode,
              ["sendCode", "verifyCode", "submitPassword"],
            ),
            phoneCode: this.wrapMethods(() => t().phoneCode, ["sendCode", "verifyCode"]),
            mfa: this.wrapMethods(
              () => t().mfa,
              ["sendPhoneCode", "verifyPhoneCode", "verifyTOTP", "verifyBackupCode"],
            ),
            ticket: this.gateMethod(t, "ticket"),
            passkey: this.gateMethod(t, "passkey"),
            web3: this.gateMethod(t, "web3"),
          },
        };
      }
      buildSignUpProxy() {
        const e = this.gateProperty.bind(this),
          t = this.gateMethod.bind(this),
          r = this.wrapMethods.bind(this),
          n = () => this.client.signUp.__internal_future;
        return {
          errors: {
            fields: {
              firstName: null,
              lastName: null,
              emailAddress: null,
              phoneNumber: null,
              password: null,
              username: null,
              code: null,
              captcha: null,
              legalAccepted: null,
            },
            raw: null,
            global: null,
          },
          fetchStatus: "idle",
          signUp: {
            get id() {
              return e(n, "id", void 0);
            },
            get requiredFields() {
              return e(n, "requiredFields", []);
            },
            get optionalFields() {
              return e(n, "optionalFields", []);
            },
            get missingFields() {
              return e(n, "missingFields", []);
            },
            get username() {
              return e(n, "username", null);
            },
            get firstName() {
              return e(n, "firstName", null);
            },
            get lastName() {
              return e(n, "lastName", null);
            },
            get emailAddress() {
              return e(n, "emailAddress", null);
            },
            get phoneNumber() {
              return e(n, "phoneNumber", null);
            },
            get web3Wallet() {
              return e(n, "web3Wallet", null);
            },
            get hasPassword() {
              return e(n, "hasPassword", !1);
            },
            get unsafeMetadata() {
              return e(n, "unsafeMetadata", {});
            },
            get createdSessionId() {
              return e(n, "createdSessionId", null);
            },
            get createdUserId() {
              return e(n, "createdUserId", null);
            },
            get abandonAt() {
              return e(n, "abandonAt", null);
            },
            get legalAcceptedAt() {
              return e(n, "legalAcceptedAt", null);
            },
            get locale() {
              return e(n, "locale", null);
            },
            get status() {
              return e(n, "status", "missing_requirements");
            },
            get unverifiedFields() {
              return e(n, "unverifiedFields", []);
            },
            get isTransferable() {
              return e(n, "isTransferable", !1);
            },
            create: t(n, "create"),
            update: t(n, "update"),
            sso: t(n, "sso"),
            password: t(n, "password"),
            ticket: t(n, "ticket"),
            web3: t(n, "web3"),
            finalize: t(n, "finalize"),
            verifications: r(
              () => n().verifications,
              ["sendEmailCode", "verifyEmailCode", "sendPhoneCode", "verifyPhoneCode"],
            ),
          },
        };
      }
      __internal_effect(e) {
        throw Error("__internal_effect called before Clerk is loaded");
      }
      __internal_computed(e) {
        throw Error("__internal_computed called before Clerk is loaded");
      }
      get client() {
        const e = this.isomorphicClerk.client;
        if (!e) throw Error("Clerk client not ready");
        return e;
      }
      gateProperty(e, t, r) {
        return rI() && this.isomorphicClerk.loaded ? e()[t] : r;
      }
      gateMethod(e, t) {
        return async (...r) => {
          if (!rI())
            return tx.throw(
              `Attempted to call a method (${t}) that is not supported on the server.`,
            );
          this.isomorphicClerk.loaded ||
            (await new Promise((e) => this.isomorphicClerk.addOnLoaded(e)));
          const n = e();
          return n[t].apply(n, r);
        };
      }
      wrapMethods(e, t) {
        return Object.fromEntries(t.map((t) => [t, this.gateMethod(e, t)]));
      }
      wrapStruct(e, t, r, n) {
        const i = {};
        for (const r of t) i[r] = this.gateMethod(e, r);
        for (const t of r)
          Object.defineProperty(i, t, { get: () => this.gateProperty(e, t, n[t]), enumerable: !0 });
        return i;
      }
    };
    void 0 === globalThis.__BUILD_DISABLE_RHC__ && (globalThis.__BUILD_DISABLE_RHC__ = !1);
    var rq = { name: "@clerk/clerk-react", version: "5.61.3", environment: "production" },
      rK = class t {
        constructor(e) {
          ry(this, _),
            (this.clerkjs = null),
            (this.preopenOneTap = null),
            (this.preopenUserVerification = null),
            (this.preopenEnableOrganizationsPrompt = null),
            (this.preopenSignIn = null),
            (this.preopenCheckout = null),
            (this.preopenPlanDetails = null),
            (this.preopenSubscriptionDetails = null),
            (this.preopenSignUp = null),
            (this.preopenUserProfile = null),
            (this.preopenOrganizationProfile = null),
            (this.preopenCreateOrganization = null),
            (this.preOpenWaitlist = null),
            (this.premountSignInNodes = new Map()),
            (this.premountSignUpNodes = new Map()),
            (this.premountUserAvatarNodes = new Map()),
            (this.premountUserProfileNodes = new Map()),
            (this.premountUserButtonNodes = new Map()),
            (this.premountOrganizationProfileNodes = new Map()),
            (this.premountCreateOrganizationNodes = new Map()),
            (this.premountOrganizationSwitcherNodes = new Map()),
            (this.premountOrganizationListNodes = new Map()),
            (this.premountMethodCalls = new Map()),
            (this.premountWaitlistNodes = new Map()),
            (this.premountPricingTableNodes = new Map()),
            (this.premountAPIKeysNodes = new Map()),
            (this.premountOAuthConsentNodes = new Map()),
            (this.premountTaskChooseOrganizationNodes = new Map()),
            (this.premountTaskResetPasswordNodes = new Map()),
            (this.premountTaskSetupMFANodes = new Map()),
            (this.premountAddListenerCalls = new Map()),
            (this.loadedListeners = []),
            ry(this, f, "loading"),
            ry(this, g),
            ry(this, m),
            ry(this, y),
            ry(
              this,
              k,
              (() => {
                let e, t, r;
                return (
                  (e = new Map()),
                  (t = new Map()),
                  (r = new Map()),
                  {
                    on: (...r) => rR(e, t, ...r),
                    prioritizedOn: (...e) => rR(r, t, ...e),
                    emit: (n, i) => {
                      t.set(n, i), rL(r, n, i), rL(e, n, i);
                    },
                    off: (...t) => rN(e, ...t),
                    prioritizedOff: (...e) => rN(r, ...e),
                    internal: { retrieveListeners: (t) => e.get(t) || [] },
                  }
                );
              })(),
            ),
            ry(this, v),
            (this.buildSignInUrl = (e) => {
              const t = () => {
                var t;
                return (null == (t = this.clerkjs) ? void 0 : t.buildSignInUrl(e)) || "";
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("buildSignInUrl", t);
            }),
            (this.buildSignUpUrl = (e) => {
              const t = () => {
                var t;
                return (null == (t = this.clerkjs) ? void 0 : t.buildSignUpUrl(e)) || "";
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("buildSignUpUrl", t);
            }),
            (this.buildAfterSignInUrl = (...e) => {
              const t = () => {
                var t;
                return (null == (t = this.clerkjs) ? void 0 : t.buildAfterSignInUrl(...e)) || "";
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("buildAfterSignInUrl", t);
            }),
            (this.buildAfterSignUpUrl = (...e) => {
              const t = () => {
                var t;
                return (null == (t = this.clerkjs) ? void 0 : t.buildAfterSignUpUrl(...e)) || "";
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("buildAfterSignUpUrl", t);
            }),
            (this.buildAfterSignOutUrl = () => {
              const e = () => {
                var e;
                return (null == (e = this.clerkjs) ? void 0 : e.buildAfterSignOutUrl()) || "";
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildAfterSignOutUrl", e);
            }),
            (this.buildNewSubscriptionRedirectUrl = () => {
              const e = () => {
                var e;
                return (
                  (null == (e = this.clerkjs) ? void 0 : e.buildNewSubscriptionRedirectUrl()) || ""
                );
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildNewSubscriptionRedirectUrl", e);
            }),
            (this.buildAfterMultiSessionSingleSignOutUrl = () => {
              const e = () => {
                var e;
                return (
                  (null == (e = this.clerkjs)
                    ? void 0
                    : e.buildAfterMultiSessionSingleSignOutUrl()) || ""
                );
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildAfterMultiSessionSingleSignOutUrl", e);
            }),
            (this.buildUserProfileUrl = () => {
              const e = () => {
                var e;
                return (null == (e = this.clerkjs) ? void 0 : e.buildUserProfileUrl()) || "";
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildUserProfileUrl", e);
            }),
            (this.buildCreateOrganizationUrl = () => {
              const e = () => {
                var e;
                return (null == (e = this.clerkjs) ? void 0 : e.buildCreateOrganizationUrl()) || "";
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildCreateOrganizationUrl", e);
            }),
            (this.buildOrganizationProfileUrl = () => {
              const e = () => {
                var e;
                return (
                  (null == (e = this.clerkjs) ? void 0 : e.buildOrganizationProfileUrl()) || ""
                );
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildOrganizationProfileUrl", e);
            }),
            (this.buildWaitlistUrl = () => {
              const e = () => {
                var e;
                return (null == (e = this.clerkjs) ? void 0 : e.buildWaitlistUrl()) || "";
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildWaitlistUrl", e);
            }),
            (this.buildTasksUrl = () => {
              const e = () => {
                var e;
                return (null == (e = this.clerkjs) ? void 0 : e.buildTasksUrl()) || "";
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("buildTasksUrl", e);
            }),
            (this.buildUrlWithAuth = (e) => {
              const t = () => {
                var t;
                return (null == (t = this.clerkjs) ? void 0 : t.buildUrlWithAuth(e)) || "";
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("buildUrlWithAuth", t);
            }),
            (this.handleUnauthenticated = async () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.handleUnauthenticated();
              };
              this.clerkjs && this.loaded
                ? e()
                : this.premountMethodCalls.set("handleUnauthenticated", e);
            }),
            (this.on = (...e) => {
              var t;
              if (null == (t = this.clerkjs) ? void 0 : t.on) return this.clerkjs.on(...e);
              rm(this, k).on(...e);
            }),
            (this.off = (...e) => {
              var t;
              if (null == (t = this.clerkjs) ? void 0 : t.off) return this.clerkjs.off(...e);
              rm(this, k).off(...e);
            }),
            (this.addOnLoaded = (e) => {
              this.loadedListeners.push(e), this.loaded && this.emitLoaded();
            }),
            (this.emitLoaded = () => {
              this.loadedListeners.forEach((e) => e()), (this.loadedListeners = []);
            }),
            (this.beforeLoad = (e) => {
              if (!e) throw Error("Failed to hydrate latest Clerk JS");
            }),
            (this.hydrateClerkJS = (e) => {
              var t, r;
              if (!e) throw Error("Failed to hydrate latest Clerk JS");
              return (
                (this.clerkjs = e),
                this.premountMethodCalls.forEach((e) => e()),
                this.premountAddListenerCalls.forEach((t, r) => {
                  t.nativeUnsubscribe = e.addListener(r);
                }),
                null == (t = rm(this, k).internal.retrieveListeners("status")) ||
                  t.forEach((e) => {
                    this.on("status", e, { notify: !0 });
                  }),
                null == (r = rm(this, k).internal.retrieveListeners("queryClientStatus")) ||
                  r.forEach((e) => {
                    this.on("queryClientStatus", e, { notify: !0 });
                  }),
                null !== this.preopenSignIn && e.openSignIn(this.preopenSignIn),
                null !== this.preopenCheckout && e.__internal_openCheckout(this.preopenCheckout),
                null !== this.preopenPlanDetails &&
                  e.__internal_openPlanDetails(this.preopenPlanDetails),
                null !== this.preopenSubscriptionDetails &&
                  e.__internal_openSubscriptionDetails(this.preopenSubscriptionDetails),
                null !== this.preopenSignUp && e.openSignUp(this.preopenSignUp),
                null !== this.preopenUserProfile && e.openUserProfile(this.preopenUserProfile),
                null !== this.preopenUserVerification &&
                  e.__internal_openReverification(this.preopenUserVerification),
                null !== this.preopenOneTap && e.openGoogleOneTap(this.preopenOneTap),
                null !== this.preopenOrganizationProfile &&
                  e.openOrganizationProfile(this.preopenOrganizationProfile),
                null !== this.preopenCreateOrganization &&
                  e.openCreateOrganization(this.preopenCreateOrganization),
                null !== this.preOpenWaitlist && e.openWaitlist(this.preOpenWaitlist),
                this.preopenEnableOrganizationsPrompt &&
                  e.__internal_openEnableOrganizationsPrompt(this.preopenEnableOrganizationsPrompt),
                this.premountSignInNodes.forEach((t, r) => {
                  e.mountSignIn(r, t);
                }),
                this.premountSignUpNodes.forEach((t, r) => {
                  e.mountSignUp(r, t);
                }),
                this.premountUserProfileNodes.forEach((t, r) => {
                  e.mountUserProfile(r, t);
                }),
                this.premountUserAvatarNodes.forEach((t, r) => {
                  e.mountUserAvatar(r, t);
                }),
                this.premountUserButtonNodes.forEach((t, r) => {
                  e.mountUserButton(r, t);
                }),
                this.premountOrganizationListNodes.forEach((t, r) => {
                  e.mountOrganizationList(r, t);
                }),
                this.premountWaitlistNodes.forEach((t, r) => {
                  e.mountWaitlist(r, t);
                }),
                this.premountPricingTableNodes.forEach((t, r) => {
                  e.mountPricingTable(r, t);
                }),
                this.premountAPIKeysNodes.forEach((t, r) => {
                  e.mountAPIKeys(r, t);
                }),
                this.premountOAuthConsentNodes.forEach((t, r) => {
                  e.__internal_mountOAuthConsent(r, t);
                }),
                this.premountTaskChooseOrganizationNodes.forEach((t, r) => {
                  e.mountTaskChooseOrganization(r, t);
                }),
                this.premountTaskResetPasswordNodes.forEach((t, r) => {
                  e.mountTaskResetPassword(r, t);
                }),
                this.premountTaskSetupMFANodes.forEach((t, r) => {
                  e.mountTaskSetupMFA(r, t);
                }),
                void 0 === this.clerkjs.status && rm(this, k).emit(rW, "ready"),
                this.emitLoaded(),
                this.clerkjs
              );
            }),
            (this.__experimental_checkout = (...e) => {
              var t;
              return null == (t = this.clerkjs) ? void 0 : t.__experimental_checkout(...e);
            }),
            (this.__unstable__updateProps = async (e) => {
              const t = await rv(this, _, P).call(this);
              if (t && "__unstable__updateProps" in t) return t.__unstable__updateProps(e);
            }),
            (this.setActive = (e) => (this.clerkjs ? this.clerkjs.setActive(e) : Promise.reject())),
            (this.openSignIn = (e) => {
              this.clerkjs && this.loaded ? this.clerkjs.openSignIn(e) : (this.preopenSignIn = e);
            }),
            (this.closeSignIn = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeSignIn()
                : (this.preopenSignIn = null);
            }),
            (this.__internal_openCheckout = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_openCheckout(e)
                : (this.preopenCheckout = e);
            }),
            (this.__internal_closeCheckout = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_closeCheckout()
                : (this.preopenCheckout = null);
            }),
            (this.__internal_openPlanDetails = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_openPlanDetails(e)
                : (this.preopenPlanDetails = e);
            }),
            (this.__internal_closePlanDetails = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_closePlanDetails()
                : (this.preopenPlanDetails = null);
            }),
            (this.__internal_openSubscriptionDetails = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_openSubscriptionDetails(e)
                : (this.preopenSubscriptionDetails = null != e ? e : null);
            }),
            (this.__internal_closeSubscriptionDetails = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_closeSubscriptionDetails()
                : (this.preopenSubscriptionDetails = null);
            }),
            (this.__internal_openReverification = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_openReverification(e)
                : (this.preopenUserVerification = e);
            }),
            (this.__internal_closeReverification = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_closeReverification()
                : (this.preopenUserVerification = null);
            }),
            (this.__internal_openEnableOrganizationsPrompt = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_openEnableOrganizationsPrompt(e)
                : (this.preopenEnableOrganizationsPrompt = e);
            }),
            (this.__internal_closeEnableOrganizationsPrompt = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_closeEnableOrganizationsPrompt()
                : (this.preopenEnableOrganizationsPrompt = null);
            }),
            (this.openGoogleOneTap = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.openGoogleOneTap(e)
                : (this.preopenOneTap = e);
            }),
            (this.closeGoogleOneTap = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeGoogleOneTap()
                : (this.preopenOneTap = null);
            }),
            (this.openUserProfile = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.openUserProfile(e)
                : (this.preopenUserProfile = e);
            }),
            (this.closeUserProfile = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeUserProfile()
                : (this.preopenUserProfile = null);
            }),
            (this.openOrganizationProfile = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.openOrganizationProfile(e)
                : (this.preopenOrganizationProfile = e);
            }),
            (this.closeOrganizationProfile = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeOrganizationProfile()
                : (this.preopenOrganizationProfile = null);
            }),
            (this.openCreateOrganization = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.openCreateOrganization(e)
                : (this.preopenCreateOrganization = e);
            }),
            (this.closeCreateOrganization = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeCreateOrganization()
                : (this.preopenCreateOrganization = null);
            }),
            (this.openWaitlist = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.openWaitlist(e)
                : (this.preOpenWaitlist = e);
            }),
            (this.closeWaitlist = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeWaitlist()
                : (this.preOpenWaitlist = null);
            }),
            (this.openSignUp = (e) => {
              this.clerkjs && this.loaded ? this.clerkjs.openSignUp(e) : (this.preopenSignUp = e);
            }),
            (this.closeSignUp = () => {
              this.clerkjs && this.loaded
                ? this.clerkjs.closeSignUp()
                : (this.preopenSignUp = null);
            }),
            (this.mountSignIn = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountSignIn(e, t)
                : this.premountSignInNodes.set(e, t);
            }),
            (this.unmountSignIn = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountSignIn(e)
                : this.premountSignInNodes.delete(e);
            }),
            (this.mountSignUp = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountSignUp(e, t)
                : this.premountSignUpNodes.set(e, t);
            }),
            (this.unmountSignUp = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountSignUp(e)
                : this.premountSignUpNodes.delete(e);
            }),
            (this.mountUserAvatar = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountUserAvatar(e, t)
                : this.premountUserAvatarNodes.set(e, t);
            }),
            (this.unmountUserAvatar = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountUserAvatar(e)
                : this.premountUserAvatarNodes.delete(e);
            }),
            (this.mountUserProfile = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountUserProfile(e, t)
                : this.premountUserProfileNodes.set(e, t);
            }),
            (this.unmountUserProfile = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountUserProfile(e)
                : this.premountUserProfileNodes.delete(e);
            }),
            (this.mountOrganizationProfile = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountOrganizationProfile(e, t)
                : this.premountOrganizationProfileNodes.set(e, t);
            }),
            (this.unmountOrganizationProfile = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountOrganizationProfile(e)
                : this.premountOrganizationProfileNodes.delete(e);
            }),
            (this.mountCreateOrganization = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountCreateOrganization(e, t)
                : this.premountCreateOrganizationNodes.set(e, t);
            }),
            (this.unmountCreateOrganization = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountCreateOrganization(e)
                : this.premountCreateOrganizationNodes.delete(e);
            }),
            (this.mountOrganizationSwitcher = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountOrganizationSwitcher(e, t)
                : this.premountOrganizationSwitcherNodes.set(e, t);
            }),
            (this.unmountOrganizationSwitcher = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountOrganizationSwitcher(e)
                : this.premountOrganizationSwitcherNodes.delete(e);
            }),
            (this.__experimental_prefetchOrganizationSwitcher = () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs)
                  ? void 0
                  : e.__experimental_prefetchOrganizationSwitcher();
              };
              this.clerkjs && this.loaded
                ? e()
                : this.premountMethodCalls.set("__experimental_prefetchOrganizationSwitcher", e);
            }),
            (this.mountOrganizationList = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountOrganizationList(e, t)
                : this.premountOrganizationListNodes.set(e, t);
            }),
            (this.unmountOrganizationList = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountOrganizationList(e)
                : this.premountOrganizationListNodes.delete(e);
            }),
            (this.mountUserButton = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountUserButton(e, t)
                : this.premountUserButtonNodes.set(e, t);
            }),
            (this.unmountUserButton = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountUserButton(e)
                : this.premountUserButtonNodes.delete(e);
            }),
            (this.mountWaitlist = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountWaitlist(e, t)
                : this.premountWaitlistNodes.set(e, t);
            }),
            (this.unmountWaitlist = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountWaitlist(e)
                : this.premountWaitlistNodes.delete(e);
            }),
            (this.mountPricingTable = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountPricingTable(e, t)
                : this.premountPricingTableNodes.set(e, t);
            }),
            (this.unmountPricingTable = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountPricingTable(e)
                : this.premountPricingTableNodes.delete(e);
            }),
            (this.mountAPIKeys = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountAPIKeys(e, t)
                : this.premountAPIKeysNodes.set(e, t);
            }),
            (this.unmountAPIKeys = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountAPIKeys(e)
                : this.premountAPIKeysNodes.delete(e);
            }),
            (this.__internal_mountOAuthConsent = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_mountOAuthConsent(e, t)
                : this.premountOAuthConsentNodes.set(e, t);
            }),
            (this.__internal_unmountOAuthConsent = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.__internal_unmountOAuthConsent(e)
                : this.premountOAuthConsentNodes.delete(e);
            }),
            (this.mountTaskChooseOrganization = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountTaskChooseOrganization(e, t)
                : this.premountTaskChooseOrganizationNodes.set(e, t);
            }),
            (this.unmountTaskChooseOrganization = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountTaskChooseOrganization(e)
                : this.premountTaskChooseOrganizationNodes.delete(e);
            }),
            (this.mountTaskResetPassword = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountTaskResetPassword(e, t)
                : this.premountTaskResetPasswordNodes.set(e, t);
            }),
            (this.unmountTaskResetPassword = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountTaskResetPassword(e)
                : this.premountTaskResetPasswordNodes.delete(e);
            }),
            (this.mountTaskSetupMFA = (e, t) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.mountTaskSetupMFA(e, t)
                : this.premountTaskSetupMFANodes.set(e, t);
            }),
            (this.unmountTaskSetupMFA = (e) => {
              this.clerkjs && this.loaded
                ? this.clerkjs.unmountTaskSetupMFA(e)
                : this.premountTaskSetupMFANodes.delete(e);
            }),
            (this.addListener = (e) => {
              if (this.clerkjs) return this.clerkjs.addListener(e);
              {
                const t = () => {
                  var t;
                  const r = this.premountAddListenerCalls.get(e);
                  r &&
                    (null == (t = r.nativeUnsubscribe) || t.call(r),
                    this.premountAddListenerCalls.delete(e));
                };
                return (
                  this.premountAddListenerCalls.set(e, {
                    unsubscribe: t,
                    nativeUnsubscribe: void 0,
                  }),
                  t
                );
              }
            }),
            (this.navigate = (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.navigate(e);
              };
              this.clerkjs && this.loaded ? t() : this.premountMethodCalls.set("navigate", t);
            }),
            (this.redirectWithAuth = async (...e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.redirectWithAuth(...e);
              };
              return this.clerkjs && this.loaded
                ? t()
                : void this.premountMethodCalls.set("redirectWithAuth", t);
            }),
            (this.redirectToSignIn = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.redirectToSignIn(e);
              };
              return this.clerkjs && this.loaded
                ? t()
                : void this.premountMethodCalls.set("redirectToSignIn", t);
            }),
            (this.redirectToSignUp = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.redirectToSignUp(e);
              };
              return this.clerkjs && this.loaded
                ? t()
                : void this.premountMethodCalls.set("redirectToSignUp", t);
            }),
            (this.redirectToUserProfile = async () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToUserProfile();
              };
              return this.clerkjs && this.loaded
                ? e()
                : void this.premountMethodCalls.set("redirectToUserProfile", e);
            }),
            (this.redirectToAfterSignUp = () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToAfterSignUp();
              };
              if (this.clerkjs && this.loaded) return e();
              this.premountMethodCalls.set("redirectToAfterSignUp", e);
            }),
            (this.redirectToAfterSignIn = () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToAfterSignIn();
              };
              this.clerkjs && this.loaded
                ? e()
                : this.premountMethodCalls.set("redirectToAfterSignIn", e);
            }),
            (this.redirectToAfterSignOut = () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToAfterSignOut();
              };
              this.clerkjs && this.loaded
                ? e()
                : this.premountMethodCalls.set("redirectToAfterSignOut", e);
            }),
            (this.redirectToOrganizationProfile = async () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToOrganizationProfile();
              };
              return this.clerkjs && this.loaded
                ? e()
                : void this.premountMethodCalls.set("redirectToOrganizationProfile", e);
            }),
            (this.redirectToCreateOrganization = async () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToCreateOrganization();
              };
              return this.clerkjs && this.loaded
                ? e()
                : void this.premountMethodCalls.set("redirectToCreateOrganization", e);
            }),
            (this.redirectToWaitlist = async () => {
              const e = () => {
                var e;
                return null == (e = this.clerkjs) ? void 0 : e.redirectToWaitlist();
              };
              return this.clerkjs && this.loaded
                ? e()
                : void this.premountMethodCalls.set("redirectToWaitlist", e);
            }),
            (this.redirectToTasks = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.redirectToTasks(e);
              };
              return this.clerkjs && this.loaded
                ? t()
                : void this.premountMethodCalls.set("redirectToTasks", t);
            }),
            (this.handleRedirectCallback = async (e) => {
              var t;
              const r = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.handleRedirectCallback(e);
              };
              this.clerkjs && this.loaded
                ? null == (t = r()) || t.catch(() => {})
                : this.premountMethodCalls.set("handleRedirectCallback", r);
            }),
            (this.handleGoogleOneTapCallback = async (e, t) => {
              var r;
              const n = () => {
                var r;
                return null == (r = this.clerkjs) ? void 0 : r.handleGoogleOneTapCallback(e, t);
              };
              this.clerkjs && this.loaded
                ? null == (r = n()) || r.catch(() => {})
                : this.premountMethodCalls.set("handleGoogleOneTapCallback", n);
            }),
            (this.handleEmailLinkVerification = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.handleEmailLinkVerification(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("handleEmailLinkVerification", t);
            }),
            (this.authenticateWithMetamask = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithMetamask(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithMetamask", t);
            }),
            (this.authenticateWithCoinbaseWallet = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithCoinbaseWallet(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithCoinbaseWallet", t);
            }),
            (this.authenticateWithBase = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithBase(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithBase", t);
            }),
            (this.authenticateWithOKXWallet = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithOKXWallet(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithOKXWallet", t);
            }),
            (this.authenticateWithSolana = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithSolana(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithSolana", t);
            }),
            (this.authenticateWithWeb3 = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.authenticateWithWeb3(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("authenticateWithWeb3", t);
            }),
            (this.authenticateWithGoogleOneTap = async (e) =>
              (await rv(this, _, P).call(this)).authenticateWithGoogleOneTap(e)),
            (this.__internal_loadStripeJs = async () =>
              (await rv(this, _, P).call(this)).__internal_loadStripeJs()),
            (this.createOrganization = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.createOrganization(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("createOrganization", t);
            }),
            (this.getOrganization = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.getOrganization(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("getOrganization", t);
            }),
            (this.joinWaitlist = async (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.joinWaitlist(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("joinWaitlist", t);
            }),
            (this.signOut = async (...e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs) ? void 0 : t.signOut(...e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("signOut", t);
            }),
            (this.__internal_attemptToEnableEnvironmentSetting = (e) => {
              const t = () => {
                var t;
                return null == (t = this.clerkjs)
                  ? void 0
                  : t.__internal_attemptToEnableEnvironmentSetting(e);
              };
              if (this.clerkjs && this.loaded) return t();
              this.premountMethodCalls.set("__internal_attemptToEnableEnvironmentSetting", t);
            });
          const { Clerk: t = null, publishableKey: r } = e || {};
          rk(this, y, r),
            rk(this, m, null == e ? void 0 : e.proxyUrl),
            rk(this, g, null == e ? void 0 : e.domain),
            (this.options = e),
            (this.Clerk = t),
            (this.mode = rI() ? "browser" : "server"),
            rk(this, v, new rD(this)),
            this.options.sdkMetadata || (this.options.sdkMetadata = rq),
            rm(this, k).emit(rW, "loading"),
            rm(this, k).prioritizedOn(rW, (e) => rk(this, f, e)),
            rm(this, y) && this.loadClerkJS();
        }
        get publishableKey() {
          return rm(this, y);
        }
        get loaded() {
          var e;
          return (null == (e = this.clerkjs) ? void 0 : e.loaded) || !1;
        }
        get status() {
          var e;
          return this.clerkjs
            ? (null == (e = this.clerkjs) ? void 0 : e.status) ||
                (this.clerkjs.loaded ? "ready" : "loading")
            : rm(this, f);
        }
        static getOrCreateInstance(e) {
          return (
            (rI() &&
              rm(this, b) &&
              (!e.Clerk || rm(this, b).Clerk === e.Clerk) &&
              rm(this, b).publishableKey === e.publishableKey) ||
              rk(this, b, new t(e)),
            rm(this, b)
          );
        }
        static clearInstance() {
          rk(this, b, null);
        }
        get domain() {
          return "u" > typeof window && window.location
            ? rF(rm(this, g), new URL(window.location.href), "")
            : "function" == typeof rm(this, g)
              ? tx.throw(tI)
              : rm(this, g) || "";
        }
        get proxyUrl() {
          return "u" > typeof window && window.location
            ? rF(rm(this, m), new URL(window.location.href), "")
            : "function" == typeof rm(this, m)
              ? tx.throw(tI)
              : rm(this, m) || "";
        }
        __internal_getOption(e) {
          var t, r;
          return (null == (t = this.clerkjs) ? void 0 : t.__internal_getOption)
            ? null == (r = this.clerkjs)
              ? void 0
              : r.__internal_getOption(e)
            : this.options[e];
        }
        get sdkMetadata() {
          var e;
          return (
            (null == (e = this.clerkjs) ? void 0 : e.sdkMetadata) ||
            this.options.sdkMetadata ||
            void 0
          );
        }
        get instanceType() {
          var e;
          return null == (e = this.clerkjs) ? void 0 : e.instanceType;
        }
        get frontendApi() {
          var e;
          return (null == (e = this.clerkjs) ? void 0 : e.frontendApi) || "";
        }
        get isStandardBrowser() {
          var e;
          return (
            (null == (e = this.clerkjs) ? void 0 : e.isStandardBrowser) ||
            this.options.standardBrowser ||
            !1
          );
        }
        get __internal_queryClient() {
          var e;
          return null == (e = this.clerkjs) ? void 0 : e.__internal_queryClient;
        }
        get isSatellite() {
          return "u" > typeof window && window.location
            ? rF(this.options.isSatellite, new URL(window.location.href), !1)
            : "function" == typeof this.options.isSatellite && tx.throw(tI);
        }
        async loadClerkJS() {
          var t, r;
          if ("browser" === this.mode && !this.loaded) {
            "u" > typeof window &&
              ((window.__clerk_publishable_key = rm(this, y)),
              (window.__clerk_proxy_url = this.proxyUrl),
              (window.__clerk_domain = this.domain));
            try {
              if (this.Clerk) {
                let t;
                ((r = this.Clerk), "function" == typeof r)
                  ? ((t = new this.Clerk(rm(this, y), {
                      proxyUrl: this.proxyUrl,
                      domain: this.domain,
                    })),
                    this.beforeLoad(t),
                    await t.load(this.options))
                  : (t = this.Clerk).loaded || (this.beforeLoad(t), await t.load(this.options)),
                  (e.g.Clerk = t);
              } else if (!__BUILD_DISABLE_RHC__) {
                if (
                  (e.g.Clerk ||
                    (await rx({
                      ...this.options,
                      publishableKey: rm(this, y),
                      proxyUrl: this.proxyUrl,
                      domain: this.domain,
                      nonce: this.options.nonce,
                    })),
                  !e.g.Clerk)
                )
                  throw Error("Failed to download latest ClerkJS. Contact support@clerk.com.");
                this.beforeLoad(e.g.Clerk), await e.g.Clerk.load(this.options);
              }
              if (null == (t = e.g.Clerk) ? void 0 : t.loaded)
                return this.hydrateClerkJS(e.g.Clerk);
              return;
            } catch (e) {
              rm(this, k).emit(rW, "error"), console.error(e.stack || e.message || e);
              return;
            }
          }
        }
        get version() {
          var e;
          return null == (e = this.clerkjs) ? void 0 : e.version;
        }
        get client() {
          return this.clerkjs ? this.clerkjs.client : void 0;
        }
        get session() {
          return this.clerkjs ? this.clerkjs.session : void 0;
        }
        get user() {
          return this.clerkjs ? this.clerkjs.user : void 0;
        }
        get organization() {
          return this.clerkjs ? this.clerkjs.organization : void 0;
        }
        get telemetry() {
          return this.clerkjs ? this.clerkjs.telemetry : void 0;
        }
        get __unstable__environment() {
          return this.clerkjs ? this.clerkjs.__unstable__environment : void 0;
        }
        get isSignedIn() {
          return !!this.clerkjs && this.clerkjs.isSignedIn;
        }
        get billing() {
          var e;
          return null == (e = this.clerkjs) ? void 0 : e.billing;
        }
        get __internal_state() {
          return this.loaded && this.clerkjs ? this.clerkjs.__internal_state : rm(this, v);
        }
        get apiKeys() {
          var e;
          return null == (e = this.clerkjs) ? void 0 : e.apiKeys;
        }
        __unstable__setEnvironment(...e) {
          this.clerkjs &&
            "__unstable__setEnvironment" in this.clerkjs &&
            this.clerkjs.__unstable__setEnvironment(e);
        }
      };
    function rB(e) {
      var t, r, n;
      let i,
        s,
        a,
        o,
        l,
        u,
        d,
        c,
        h,
        p,
        f,
        g,
        m,
        y,
        k,
        v,
        b,
        _,
        { isomorphicClerkOptions: P, initialState: w, children: S } = e,
        { isomorphicClerk: j, clerkStatus: O } = r$(P),
        [E, M] = C.default.useState({
          client: j.client,
          session: j.session,
          user: j.user,
          organization: j.organization,
        });
      C.default.useEffect(() => j.addListener((e) => M({ ...e })), []);
      const U =
          ((t = j.loaded),
          !t && w
            ? ((i = (r = w).userId),
              (s = r.user),
              (a = r.sessionId),
              (o = r.sessionStatus),
              (l = r.sessionClaims),
              {
                userId: i,
                user: s,
                sessionId: a,
                session: r.session,
                sessionStatus: o,
                sessionClaims: l,
                organization: r.organization,
                orgId: r.orgId,
                orgRole: r.orgRole,
                orgPermissions: r.orgPermissions,
                orgSlug: r.orgSlug,
                actor: r.actor,
                factorVerificationAge: r.factorVerificationAge,
              })
            : ((u = (n = E).user ? n.user.id : n.user),
              (d = n.user),
              (c = n.session ? n.session.id : n.session),
              (h = n.session),
              (p = n.session?.status),
              (f = n.session ? n.session.lastActiveToken?.jwt?.claims : null),
              (g = n.session ? n.session.factorVerificationAge : null),
              (m = h?.actor),
              (y = n.organization),
              (k = n.organization ? n.organization.id : n.organization),
              (v = y?.slug),
              (_ = (b = y ? d?.organizationMemberships?.find((e) => e.organization.id === k) : y)
                ? b.permissions
                : b),
              {
                userId: u,
                user: d,
                sessionId: c,
                session: h,
                sessionStatus: p,
                sessionClaims: f,
                organization: y,
                orgId: k,
                orgRole: b ? b.role : b,
                orgSlug: v,
                orgPermissions: _,
                actor: m,
                factorVerificationAge: g,
              })),
        T = C.default.useMemo(() => ({ value: j }), [O]),
        x = C.default.useMemo(() => ({ value: E.client }), [E.client]),
        {
          sessionId: A,
          sessionStatus: z,
          sessionClaims: I,
          session: R,
          userId: L,
          user: N,
          orgId: W,
          actor: F,
          organization: D,
          orgRole: q,
          orgSlug: K,
          orgPermissions: B,
          factorVerificationAge: $,
        } = U,
        V = C.default.useMemo(
          () => ({
            value: {
              sessionId: A,
              sessionStatus: z,
              sessionClaims: I,
              userId: L,
              actor: F,
              orgId: W,
              orgRole: q,
              orgSlug: K,
              orgPermissions: B,
              factorVerificationAge: $,
            },
          }),
          [A, z, L, F, W, q, K, $, null == I ? void 0 : I.__raw],
        ),
        Q = C.default.useMemo(() => ({ value: R }), [A, R]),
        G = C.default.useMemo(() => ({ value: N }), [L, N]),
        H = C.default.useMemo(() => ({ value: { organization: D } }), [W, D]);
      return C.default.createElement(
        e4.Provider,
        { value: T },
        C.default.createElement(
          te.Provider,
          { value: x },
          C.default.createElement(
            tr.Provider,
            { value: Q },
            C.default.createElement(
              tu,
              { ...H.value },
              C.default.createElement(
                tA.Provider,
                { value: V },
                C.default.createElement(
                  e3.Provider,
                  { value: G },
                  C.default.createElement(ta, { value: void 0 }, S),
                ),
              ),
            ),
          ),
        ),
      );
    }
    (f = new WeakMap()),
      (g = new WeakMap()),
      (m = new WeakMap()),
      (y = new WeakMap()),
      (k = new WeakMap()),
      (v = new WeakMap()),
      (b = new WeakMap()),
      (_ = new WeakSet()),
      (P = function () {
        return new Promise((e) => {
          this.addOnLoaded(() => e(this.clerkjs));
        });
      }),
      ry(rK, b);
    var r$ = (e) => {
        const t = C.default.useRef(rK.getOrCreateInstance(e)),
          [r, n] = C.default.useState(t.current.status);
        return (
          C.default.useEffect(() => {
            t.current.__unstable__updateProps({ appearance: e.appearance });
          }, [e.appearance]),
          C.default.useEffect(() => {
            t.current.__unstable__updateProps({ options: e });
          }, [e.localization]),
          C.default.useEffect(
            () => (
              t.current.on("status", n),
              () => {
                t.current && t.current.off("status", n), rK.clearInstance();
              }
            ),
            [],
          ),
          { isomorphicClerk: t.current, clerkStatus: r }
        );
      },
      rV =
        ((h = "ClerkProvider"),
        (a =
          (c = (e) => {
            const {
                initialState: t,
                children: r,
                __internal_bypassMissingPublishableKey: n,
                ...i
              } = e,
              { publishableKey: s = "", Clerk: a } = i;
            return (
              a ||
                n ||
                (s
                  ? s && !q(s) && tx.throwInvalidPublishableKeyError({ key: s })
                  : tx.throwMissingPublishableKeyError()),
              C.default.createElement(rB, { initialState: t, isomorphicClerkOptions: i }, r)
            );
          }).displayName ||
          c.name ||
          h ||
          "Component"),
        ((o = (e) => (
          !((e, t, r = 1) => {
            tK.default.useEffect(() => {
              const n = tH.get(e) || 0;
              return n == r
                ? tx.throw(t)
                : (tH.set(e, n + 1),
                  () => {
                    tH.set(e, (tH.get(e) || 1) - 1);
                  });
            }, []);
          })(
            h,
            "You've added multiple <ClerkProvider> components in your React component tree. Wrap your components in a single <ClerkProvider>.",
          ),
          tK.default.createElement(c, { ...e })
        )).displayName = `withMaxAllowedInstancesGuard(${a})`),
        o);
    (rV.displayName = "ClerkProvider"),
      (p = { packageName: "@clerk/clerk-react" }),
      tx.setMessages(p).setPackageName(p),
      rM.setPackageName({ packageName: "@clerk/clerk-react" });
    var rQ = e.i(48519),
      rG = e.i(7198);
    function rH({ children: e }) {
      const { orgId: t } = tN(),
        { userMemberships: r, setActive: n } = ((e) => {
          let t,
            r,
            { userMemberships: n, userInvitations: i, userSuggestions: s } = e || {};
          td("useOrganizationList"),
            td("useClerk"),
            (t = e6()),
            (r = (0, C.useRef)(!1)),
            (0, C.useEffect)(() => {
              r.current ||
                ((r.current = !0),
                t.__internal_attemptToEnableEnvironmentSetting?.({
                  for: "organizations",
                  caller: "useOrganizationList",
                }));
            }, [t, "useOrganizationList"]);
          const a = tp(n, { initialPage: 1, pageSize: 10, keepPreviousData: !1, infinite: !1 }),
            o = tp(i, {
              initialPage: 1,
              pageSize: 10,
              status: "pending",
              keepPreviousData: !1,
              infinite: !1,
            }),
            l = tp(s, {
              initialPage: 1,
              pageSize: 10,
              status: "pending",
              keepPreviousData: !1,
              infinite: !1,
            }),
            u = e6(),
            d = e7();
          u.telemetry?.record(K("useOrganizationList"));
          const c = void 0 === n ? void 0 : { initialPage: a.initialPage, pageSize: a.pageSize },
            h =
              void 0 === i
                ? void 0
                : { initialPage: o.initialPage, pageSize: o.pageSize, status: o.status },
            p =
              void 0 === s
                ? void 0
                : { initialPage: l.initialPage, pageSize: l.pageSize, status: l.status },
            f = !!(u.loaded && d),
            g = ty({
              fetcher: d?.getOrganizationMemberships,
              config: {
                keepPreviousData: a.keepPreviousData,
                infinite: a.infinite,
                enabled: !!c,
                isSignedIn: !!d,
                initialPage: a.initialPage,
                pageSize: a.pageSize,
              },
              keys: tc({
                stablePrefix: "userMemberships",
                authenticated: !!d,
                tracked: { userId: d?.id },
                untracked: { args: c },
              }),
            }),
            m = ty({
              fetcher: d?.getOrganizationInvitations,
              config: {
                keepPreviousData: o.keepPreviousData,
                infinite: o.infinite,
                enabled: !!h,
                isSignedIn: !!d,
                initialPage: o.initialPage,
                pageSize: o.pageSize,
              },
              keys: tc({
                stablePrefix: "userInvitations",
                authenticated: !!d,
                tracked: { userId: d?.id },
                untracked: { args: h },
              }),
            }),
            y = ty({
              fetcher: d?.getOrganizationSuggestions,
              config: {
                keepPreviousData: l.keepPreviousData,
                infinite: l.infinite,
                enabled: !!p,
                isSignedIn: !!d,
                initialPage: l.initialPage,
                pageSize: l.pageSize,
              },
              keys: tc({
                stablePrefix: "userSuggestions",
                authenticated: !!d,
                tracked: { userId: d?.id },
                untracked: { args: p },
              }),
            });
          return f
            ? {
                isLoaded: f,
                setActive: u.setActive,
                createOrganization: u.createOrganization,
                userMemberships: g,
                userInvitations: m,
                userSuggestions: y,
              }
            : {
                isLoaded: !1,
                createOrganization: void 0,
                setActive: void 0,
                userMemberships: tk,
                userInvitations: tk,
                userSuggestions: tk,
              };
        })({ userMemberships: { infinite: !0 } });
      return (
        (0, C.useEffect)(() => {
          !t && r?.data?.length && n && n({ organization: r.data[0].organization.id });
        }, [t, r?.data, n]),
        (0, w.jsx)(w.Fragment, { children: e })
      );
    }
    function rJ({ children: e }) {
      let t,
        { isSignedIn: r, isLoaded: n } =
          (td(tv),
          (t = e7()),
          (e6().telemetry?.record(K(tv)), void 0 === t)
            ? { isLoaded: !1, isSignedIn: void 0, user: void 0 }
            : null === t
              ? { isLoaded: !0, isSignedIn: !1, user: null }
              : { isLoaded: !0, isSignedIn: !0, user: t });
      return n
        ? r
          ? (0, w.jsx)(rH, { children: e })
          : (0, w.jsx)("div", {
              className: "flex-1 flex items-center justify-center",
              children: (0, w.jsx)(rn, { routing: "hash" }),
            })
        : (0, w.jsx)("div", {
            className: "flex-1 flex items-center justify-center",
            children: (0, w.jsx)("div", {
              className: "animate-pulse text-muted-foreground",
              children: "Loading...",
            }),
          });
    }
    function rY({ children: e }) {
      return (0, w.jsx)(rV, {
        publishableKey: "pk_test_Y29vbC1yZWRmaXNoLTU2LmNsZXJrLmFjY291bnRzLmRldiQ",
        children: (0, w.jsx)(rJ, { children: e }),
      });
    }
    var rX = e.i(37519),
      rZ = e.i(41136),
      r0 = e.i(94720),
      r1 = e.i(41357),
      r5 = class extends r1.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#e = new Map());
        }
        #e;
        build(e, t, r) {
          let n = t.queryKey,
            i = t.queryHash ?? (0, rX.hashQueryKeyByOptions)(n, t),
            s = this.get(i);
          return (
            s ||
              ((s = new rZ.Query({
                client: e,
                queryKey: n,
                queryHash: i,
                options: e.defaultQueryOptions(t),
                state: r,
                defaultOptions: e.getQueryDefaults(n),
              })),
              this.add(s)),
            s
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
          r0.notifyManager.batch(() => {
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
          return this.getAll().find((e) => (0, rX.matchQuery)(t, e));
        }
        findAll(e = {}) {
          const t = this.getAll();
          return Object.keys(e).length > 0 ? t.filter((t) => (0, rX.matchQuery)(e, t)) : t;
        }
        notify(e) {
          r0.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        onFocus() {
          r0.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onFocus();
            });
          });
        }
        onOnline() {
          r0.notifyManager.batch(() => {
            this.getAll().forEach((e) => {
              e.onOnline();
            });
          });
        }
      },
      r2 = e.i(78408),
      r9 = e.i(13564),
      r8 = class extends r2.Removable {
        #t;
        #r;
        #n;
        #i;
        constructor(e) {
          super(),
            (this.#t = e.client),
            (this.mutationId = e.mutationId),
            (this.#n = e.mutationCache),
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
            this.#n.notify({ type: "observerAdded", mutation: this, observer: e }));
        }
        removeObserver(e) {
          (this.#r = this.#r.filter((t) => t !== e)),
            this.scheduleGc(),
            this.#n.notify({ type: "observerRemoved", mutation: this, observer: e });
        }
        optionalRemove() {
          this.#r.length ||
            ("pending" === this.state.status ? this.scheduleGc() : this.#n.remove(this));
        }
        continue() {
          return this.#i?.continue() ?? this.execute(this.state.variables);
        }
        async execute(e) {
          const t = () => {
              this.#s({ type: "continue" });
            },
            r = { client: this.#t, meta: this.options.meta, mutationKey: this.options.mutationKey };
          this.#i = (0, r9.createRetryer)({
            fn: () =>
              this.options.mutationFn
                ? this.options.mutationFn(e, r)
                : Promise.reject(Error("No mutationFn found")),
            onFail: (e, t) => {
              this.#s({ type: "failed", failureCount: e, error: t });
            },
            onPause: () => {
              this.#s({ type: "pause" });
            },
            onContinue: t,
            retry: this.options.retry ?? 0,
            retryDelay: this.options.retryDelay,
            networkMode: this.options.networkMode,
            canRun: () => this.#n.canRun(this),
          });
          const n = "pending" === this.state.status,
            i = !this.#i.canStart();
          try {
            if (n) t();
            else {
              this.#s({ type: "pending", variables: e, isPaused: i }),
                this.#n.config.onMutate && (await this.#n.config.onMutate(e, this, r));
              const t = await this.options.onMutate?.(e, r);
              t !== this.state.context &&
                this.#s({ type: "pending", context: t, variables: e, isPaused: i });
            }
            const s = await this.#i.start();
            return (
              await this.#n.config.onSuccess?.(s, e, this.state.context, this, r),
              await this.options.onSuccess?.(s, e, this.state.context, r),
              await this.#n.config.onSettled?.(
                s,
                null,
                this.state.variables,
                this.state.context,
                this,
                r,
              ),
              await this.options.onSettled?.(s, null, e, this.state.context, r),
              this.#s({ type: "success", data: s }),
              s
            );
          } catch (t) {
            try {
              await this.#n.config.onError?.(t, e, this.state.context, this, r);
            } catch (e) {
              Promise.reject(e);
            }
            try {
              await this.options.onError?.(t, e, this.state.context, r);
            } catch (e) {
              Promise.reject(e);
            }
            try {
              await this.#n.config.onSettled?.(
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
            throw (this.#s({ type: "error", error: t }), t);
          } finally {
            this.#n.runNext(this);
          }
        }
        #s(e) {
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
            r0.notifyManager.batch(() => {
              this.#r.forEach((t) => {
                t.onMutationUpdate(e);
              }),
                this.#n.notify({ mutation: this, type: "updated", action: e });
            });
        }
      },
      r4 = r1,
      r6 = class extends r4.Subscribable {
        constructor(e = {}) {
          super(), (this.config = e), (this.#a = new Set()), (this.#o = new Map()), (this.#l = 0);
        }
        #a;
        #o;
        #l;
        build(e, t, r) {
          const n = new r8({
            client: e,
            mutationCache: this,
            mutationId: ++this.#l,
            options: e.defaultMutationOptions(t),
            state: r,
          });
          return this.add(n), n;
        }
        add(e) {
          this.#a.add(e);
          const t = r3(e);
          if ("string" == typeof t) {
            const r = this.#o.get(t);
            r ? r.push(e) : this.#o.set(t, [e]);
          }
          this.notify({ type: "added", mutation: e });
        }
        remove(e) {
          if (this.#a.delete(e)) {
            const t = r3(e);
            if ("string" == typeof t) {
              const r = this.#o.get(t);
              if (r)
                if (r.length > 1) {
                  const t = r.indexOf(e);
                  -1 !== t && r.splice(t, 1);
                } else r[0] === e && this.#o.delete(t);
            }
          }
          this.notify({ type: "removed", mutation: e });
        }
        canRun(e) {
          const t = r3(e);
          if ("string" != typeof t) return !0;
          {
            const r = this.#o.get(t),
              n = r?.find((e) => "pending" === e.state.status);
            return !n || n === e;
          }
        }
        runNext(e) {
          const t = r3(e);
          if ("string" != typeof t) return Promise.resolve();
          {
            const r = this.#o.get(t)?.find((t) => t !== e && t.state.isPaused);
            return r?.continue() ?? Promise.resolve();
          }
        }
        clear() {
          r0.notifyManager.batch(() => {
            this.#a.forEach((e) => {
              this.notify({ type: "removed", mutation: e });
            }),
              this.#a.clear(),
              this.#o.clear();
          });
        }
        getAll() {
          return Array.from(this.#a);
        }
        find(e) {
          const t = { exact: !0, ...e };
          return this.getAll().find((e) => (0, rX.matchMutation)(t, e));
        }
        findAll(e = {}) {
          return this.getAll().filter((t) => (0, rX.matchMutation)(e, t));
        }
        notify(e) {
          r0.notifyManager.batch(() => {
            this.listeners.forEach((t) => {
              t(e);
            });
          });
        }
        resumePausedMutations() {
          const e = this.getAll().filter((e) => e.state.isPaused);
          return r0.notifyManager.batch(() =>
            Promise.all(e.map((e) => e.continue().catch(rX.noop))),
          );
        }
      };
    function r3(e) {
      return e.options.scope?.id;
    }
    var r7 = e.i(34517),
      ne = e.i(65548);
    function nt(e) {
      return {
        onFetch: (t, r) => {
          let n = t.options,
            i = t.fetchOptions?.meta?.fetchMore?.direction,
            s = t.state.data?.pages || [],
            a = t.state.data?.pageParams || [],
            o = { pages: [], pageParams: [] },
            l = 0,
            u = async () => {
              let r = !1,
                u = (0, rX.ensureQueryFn)(t.options, t.fetchOptions),
                d = async (e, n, i) => {
                  let s;
                  if (r) return Promise.reject();
                  if (null == n && e.pages.length) return Promise.resolve(e);
                  const a =
                      ((s = {
                        client: t.client,
                        queryKey: t.queryKey,
                        pageParam: n,
                        direction: i ? "backward" : "forward",
                        meta: t.options.meta,
                      }),
                      (0, rX.addConsumeAwareSignal)(
                        s,
                        () => t.signal,
                        () => (r = !0),
                      ),
                      s),
                    o = await u(a),
                    { maxPages: l } = t.options,
                    d = i ? rX.addToStart : rX.addToEnd;
                  return { pages: d(e.pages, o, l), pageParams: d(e.pageParams, n, l) };
                };
              if (i && s.length) {
                const e = "backward" === i,
                  t = { pages: s, pageParams: a },
                  r = (
                    e
                      ? (e, { pages: t, pageParams: r }) =>
                          t.length > 0 ? e.getPreviousPageParam?.(t[0], t, r[0], r) : void 0
                      : nr
                  )(n, t);
                o = await d(t, r, e);
              } else {
                const t = e ?? s.length;
                do {
                  const e = 0 === l ? (a[0] ?? n.initialPageParam) : nr(n, o);
                  if (l > 0 && null == e) break;
                  (o = await d(o, e)), l++;
                } while (l < t);
              }
              return o;
            };
          t.options.persister
            ? (t.fetchFn = () =>
                t.options.persister?.(
                  u,
                  {
                    client: t.client,
                    queryKey: t.queryKey,
                    meta: t.options.meta,
                    signal: t.signal,
                  },
                  r,
                ))
            : (t.fetchFn = u);
        },
      };
    }
    function nr(e, { pages: t, pageParams: r }) {
      const n = t.length - 1;
      return t.length > 0 ? e.getNextPageParam(t[n], t, r[n], r) : void 0;
    }
    var nn = class {
        #u;
        #n;
        #d;
        #c;
        #h;
        #p;
        #f;
        #g;
        constructor(e = {}) {
          (this.#u = e.queryCache || new r5()),
            (this.#n = e.mutationCache || new r6()),
            (this.#d = e.defaultOptions || {}),
            (this.#c = new Map()),
            (this.#h = new Map()),
            (this.#p = 0);
        }
        mount() {
          this.#p++,
            1 === this.#p &&
              ((this.#f = r7.focusManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#u.onFocus());
              })),
              (this.#g = ne.onlineManager.subscribe(async (e) => {
                e && (await this.resumePausedMutations(), this.#u.onOnline());
              })));
        }
        unmount() {
          this.#p--,
            0 === this.#p && (this.#f?.(), (this.#f = void 0), this.#g?.(), (this.#g = void 0));
        }
        isFetching(e) {
          return this.#u.findAll({ ...e, fetchStatus: "fetching" }).length;
        }
        isMutating(e) {
          return this.#n.findAll({ ...e, status: "pending" }).length;
        }
        getQueryData(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#u.get(t.queryHash)?.state.data;
        }
        ensureQueryData(e) {
          const t = this.defaultQueryOptions(e),
            r = this.#u.build(this, t),
            n = r.state.data;
          return void 0 === n
            ? this.fetchQuery(e)
            : (e.revalidateIfStale &&
                r.isStaleByTime((0, rX.resolveStaleTime)(t.staleTime, r)) &&
                this.prefetchQuery(t),
              Promise.resolve(n));
        }
        getQueriesData(e) {
          return this.#u.findAll(e).map(({ queryKey: e, state: t }) => [e, t.data]);
        }
        setQueryData(e, t, r) {
          const n = this.defaultQueryOptions({ queryKey: e }),
            i = this.#u.get(n.queryHash),
            s = i?.state.data,
            a = (0, rX.functionalUpdate)(t, s);
          if (void 0 !== a) return this.#u.build(this, n).setData(a, { ...r, manual: !0 });
        }
        setQueriesData(e, t, r) {
          return r0.notifyManager.batch(() =>
            this.#u.findAll(e).map(({ queryKey: e }) => [e, this.setQueryData(e, t, r)]),
          );
        }
        getQueryState(e) {
          const t = this.defaultQueryOptions({ queryKey: e });
          return this.#u.get(t.queryHash)?.state;
        }
        removeQueries(e) {
          const t = this.#u;
          r0.notifyManager.batch(() => {
            t.findAll(e).forEach((e) => {
              t.remove(e);
            });
          });
        }
        resetQueries(e, t) {
          const r = this.#u;
          return r0.notifyManager.batch(
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
            r0.notifyManager.batch(() => this.#u.findAll(e).map((e) => e.cancel(r))),
          )
            .then(rX.noop)
            .catch(rX.noop);
        }
        invalidateQueries(e, t = {}) {
          return r0.notifyManager.batch(() =>
            (this.#u.findAll(e).forEach((e) => {
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
            r0.notifyManager.batch(() =>
              this.#u
                .findAll(e)
                .filter((e) => !e.isDisabled() && !e.isStatic())
                .map((e) => {
                  let t = e.fetch(void 0, r);
                  return (
                    r.throwOnError || (t = t.catch(rX.noop)),
                    "paused" === e.state.fetchStatus ? Promise.resolve() : t
                  );
                }),
            ),
          ).then(rX.noop);
        }
        fetchQuery(e) {
          const t = this.defaultQueryOptions(e);
          void 0 === t.retry && (t.retry = !1);
          const r = this.#u.build(this, t);
          return r.isStaleByTime((0, rX.resolveStaleTime)(t.staleTime, r))
            ? r.fetch(t)
            : Promise.resolve(r.state.data);
        }
        prefetchQuery(e) {
          return this.fetchQuery(e).then(rX.noop).catch(rX.noop);
        }
        fetchInfiniteQuery(e) {
          return (e.behavior = nt(e.pages)), this.fetchQuery(e);
        }
        prefetchInfiniteQuery(e) {
          return this.fetchInfiniteQuery(e).then(rX.noop).catch(rX.noop);
        }
        ensureInfiniteQueryData(e) {
          return (e.behavior = nt(e.pages)), this.ensureQueryData(e);
        }
        resumePausedMutations() {
          return ne.onlineManager.isOnline() ? this.#n.resumePausedMutations() : Promise.resolve();
        }
        getQueryCache() {
          return this.#u;
        }
        getMutationCache() {
          return this.#n;
        }
        getDefaultOptions() {
          return this.#d;
        }
        setDefaultOptions(e) {
          this.#d = e;
        }
        setQueryDefaults(e, t) {
          this.#c.set((0, rX.hashKey)(e), { queryKey: e, defaultOptions: t });
        }
        getQueryDefaults(e) {
          const t = [...this.#c.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, rX.partialMatchKey)(e, t.queryKey) && Object.assign(r, t.defaultOptions);
            }),
            r
          );
        }
        setMutationDefaults(e, t) {
          this.#h.set((0, rX.hashKey)(e), { mutationKey: e, defaultOptions: t });
        }
        getMutationDefaults(e) {
          const t = [...this.#h.values()],
            r = {};
          return (
            t.forEach((t) => {
              (0, rX.partialMatchKey)(e, t.mutationKey) && Object.assign(r, t.defaultOptions);
            }),
            r
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
            t.queryHash || (t.queryHash = (0, rX.hashQueryKeyByOptions)(t.queryKey, t)),
            void 0 === t.refetchOnReconnect && (t.refetchOnReconnect = "always" !== t.networkMode),
            void 0 === t.throwOnError && (t.throwOnError = !!t.suspense),
            !t.networkMode && t.persister && (t.networkMode = "offlineFirst"),
            t.queryFn === rX.skipToken && (t.enabled = !1),
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
          this.#u.clear(), this.#n.clear();
        }
      },
      ni = e.i(73048);
    function ns({ children: e }) {
      const [t] = (0, C.useState)(
        () => new nn({ defaultOptions: { queries: { staleTime: 3e4, refetchOnWindowFocus: !0 } } }),
      );
      return (0, w.jsx)(ni.QueryClientProvider, { client: t, children: e });
    }
    var na = e.i(5074),
      no = e.i(16326),
      nl = e.i(83049),
      nu = e.i(52734);
    function nd({ href: e, icon: t, label: r }) {
      const n = (0, no.usePathname)(),
        i = n === e || ("/" !== e && n?.startsWith(e));
      return (0, w.jsx)(na.default, {
        href: e,
        title: r,
        className: (0, nl.cn)(
          "w-10 h-10 flex items-center justify-center rounded-lg transition-colors",
          i
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
        ),
        children: t,
      });
    }
    function nc() {
      return (0, w.jsxs)("aside", {
        className: "flex flex-col items-center w-[60px] border-r bg-card py-4",
        children: [
          (0, w.jsx)("div", {
            className: "mb-4",
            children: (0, w.jsxs)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              viewBox: "0 0 200 200",
              width: "32",
              height: "32",
              children: [
                (0, w.jsxs)("defs", {
                  children: [
                    (0, w.jsx)("clipPath", {
                      id: "lc",
                      children: (0, w.jsx)("rect", { width: "200", height: "200", x: "0", y: "0" }),
                    }),
                    (0, w.jsx)("g", {
                      id: "lg",
                      children: (0, w.jsx)("g", {
                        transform: "matrix(0.997,0,0,1,100.147,100)",
                        opacity: "1",
                        children: (0, w.jsx)("g", {
                          opacity: "1",
                          transform: "matrix(1,0,0,1,0,0)",
                          children: (0, w.jsx)("path", {
                            fill: "rgb(255,0,0)",
                            fillOpacity: "1",
                            d: "M51.995,-68.599 C51.995,-31.97 22.612,-2.586 -14.017,-2.586 C-14.017,-2.586 -51.854,-2.586 -51.854,-2.586 C-53.188,-2.586 -54.269,-1.505 -54.269,-0.171 C-54.269,1.163 -53.188,2.244 -51.854,2.244 C-51.854,2.244 -14.017,2.244 -14.017,2.244 C22.612,2.244 51.995,31.628 51.995,68.257 C51.995,68.257 52.995,68.257 52.995,68.257 C52.995,68.257 52.995,-68.599 52.995,-68.599 C52.995,-68.599 51.995,-68.599 51.995,-68.599z",
                          }),
                        }),
                      }),
                    }),
                    (0, w.jsx)("filter", {
                      id: "lf",
                      filterUnits: "objectBoundingBox",
                      x: "0%",
                      y: "0%",
                      width: "100%",
                      height: "100%",
                      children: (0, w.jsx)("feComponentTransfer", {
                        in: "SourceGraphic",
                        children: (0, w.jsx)("feFuncA", { type: "table", tableValues: "1.0 0.0" }),
                      }),
                    }),
                    (0, w.jsx)("mask", {
                      id: "lm",
                      maskType: "alpha",
                      children: (0, w.jsxs)("g", {
                        filter: "url(#lf)",
                        children: [
                          (0, w.jsx)("rect", {
                            width: "200",
                            height: "200",
                            x: "0",
                            y: "0",
                            fill: "#ffffff",
                            opacity: "0",
                          }),
                          (0, w.jsx)("use", { xlinkHref: "#lg" }),
                        ],
                      }),
                    }),
                  ],
                }),
                (0, w.jsx)("g", {
                  clipPath: "url(#lc)",
                  children: (0, w.jsx)("g", {
                    mask: "url(#lm)",
                    children: (0, w.jsx)("g", {
                      transform: "matrix(1,0,0,1,100,100)",
                      opacity: "1",
                      children: (0, w.jsx)("g", {
                        opacity: "1",
                        transform: "matrix(1,0,0,1,0,0)",
                        children: (0, w.jsx)("path", {
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
          }),
          (0, w.jsxs)("nav", {
            className: "flex flex-col items-center gap-1 flex-1",
            children: [
              (0, w.jsx)(nd, {
                href: "/",
                icon: (0, w.jsx)(rQ.PenLine, { size: 20 }),
                label: "Requests",
              }),
              (0, w.jsx)(nd, {
                href: "/overdue",
                icon: (0, w.jsx)(rG.Clock, { size: 20 }),
                label: "Overdue",
              }),
            ],
          }),
          (0, w.jsx)("div", { className: "mt-auto", children: (0, w.jsx)(rd, {}) }),
        ],
      });
    }
    function nh() {
      const { getToken: e } = tN();
      return (
        (0, C.useEffect)(() => {
          (0, nu.setTokenGetter)(e);
        }, [e]),
        null
      );
    }
    e.s(
      [
        "default",
        0,
        ({ children: e }) =>
          (0, w.jsxs)(rY, {
            children: [
              (0, w.jsx)(nh, {}),
              (0, w.jsxs)(ns, {
                children: [
                  (0, w.jsx)(nc, {}),
                  (0, w.jsx)("main", { className: "flex-1 flex flex-col min-h-0", children: e }),
                ],
              }),
            ],
          }),
      ],
      28,
    );
  },
]);
