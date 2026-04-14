(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
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
      l = n.useDebugValue;
    function u(e) {
      var t = e.getSnapshot;
      e = e.value;
      try {
        var r = t();
        return !i(e, r);
      } catch (e) {
        return !0;
      }
    }
    var d =
      "u" < typeof window || void 0 === window.document || void 0 === window.document.createElement
        ? (e, t) => t()
        : (e, t) => {
            var r = t(),
              n = s({ inst: { value: r, getSnapshot: t } }),
              i = n[0].inst,
              d = n[1];
            return (
              a(() => {
                (i.value = r), (i.getSnapshot = t), u(i) && d({ inst: i });
              }, [e, r, t]),
              o(
                () => (
                  u(i) && d({ inst: i }),
                  e(() => {
                    u(i) && d({ inst: i });
                  })
                ),
                [e],
              ),
              l(r),
              r
            );
          };
    r.useSyncExternalStore = void 0 !== n.useSyncExternalStore ? n.useSyncExternalStore : d;
  },
  97685,
  (e, t, r) => {
    t.exports = e.r(47411);
  },
  88886,
  8024,
  40020,
  65905,
  1130,
  (e) => {
    let t, r, n, i, s;
    function o(e) {
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
    var a,
      l,
      u,
      d,
      c,
      h,
      p,
      f,
      g,
      m,
      v,
      y,
      k = class {
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
    o(k);
    var b = class e extends Error {
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
    const _ = o(
        class e extends b {
          static kind = "ClerkAPIResponseError";
          status;
          clerkTraceId;
          retryAfter;
          errors;
          constructor(t, r) {
            const { data: n, status: i, clerkTraceId: s, retryAfter: o } = r;
            super({ ...r, message: t, code: "api_response_error" }),
              Object.setPrototypeOf(this, e.prototype),
              (this.status = i),
              (this.clerkTraceId = s),
              (this.retryAfter = o),
              (this.errors = (n || []).map((e) => new k(e)));
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
      ),
      S = Object.freeze({
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
    function P({ packageName: e, customMessages: t }) {
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
      const i = { ...S, ...t };
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
    var w = class e extends b {
      static kind = "ClerkRuntimeError";
      clerkRuntimeError = !0;
      constructor(t, r) {
        super({ ...r, message: t }), Object.setPrototypeOf(this, e.prototype);
      }
    };
    o(w);
    const C = {
        strict_mfa: { afterMinutes: 10, level: "multi_factor" },
        strict: { afterMinutes: 10, level: "second_factor" },
        moderate: { afterMinutes: 60, level: "second_factor" },
        lax: { afterMinutes: 1440, level: "second_factor" },
      },
      E = new Set(["first_factor", "second_factor", "multi_factor"]),
      O = new Set(["strict_mfa", "strict", "moderate", "lax"]),
      j = (e, t) => {
        const { org: r, user: n } = U(e),
          [i, s] = t.split(":"),
          o = s || i;
        return "org" === i
          ? r.includes(o)
          : "user" === i
            ? n.includes(o)
            : [...r, ...n].includes(o);
      },
      U = (e) => {
        const t = e ? e.split(",").map((e) => e.trim()) : [];
        return {
          org: t.filter((e) => e.split(":")[0].includes("o")).map((e) => e.split(":")[1]),
          user: t.filter((e) => e.split(":")[0].includes("u")).map((e) => e.split(":")[1]),
        };
      },
      M = (e) => {
        let t, r;
        if (!e) return !1;
        const n = "string" == typeof e && O.has(e),
          i =
            "object" == typeof e &&
            ((t = e.level), E.has(t)) &&
            "number" == typeof (r = e.afterMinutes) &&
            r > 0;
        return (!!n || !!i) && ((e) => ("string" == typeof e ? C[e] : e)).bind(null, e);
      },
      T = (e) => {
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
    T((e) => (e ? e.replace(/[A-Z]/g, (e) => `_${e.toLowerCase()}`) : "")),
      T((e) => (e ? e.replace(/([-_][a-z])/g, (e) => e.toUpperCase().replace(/-|_/, "")) : ""));
    const z = [
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
      I = (t) =>
        "u" > typeof atob && "function" == typeof atob
          ? atob(t)
          : e.g.Buffer
            ? new e.g.Buffer(t, "base64").toString()
            : t,
      A = "pk_live_";
    function R(e) {
      if (!e.endsWith("$")) return !1;
      const t = e.slice(0, -1);
      return !t.includes("$") && t.includes(".");
    }
    function L(e, t = {}) {
      let r;
      if (!(e = e || "") || !x(e)) {
        if (t.fatal && !e)
          throw Error(
            "Publishable key is missing. Ensure that your publishable key is correctly configured. Double-check your environment configuration for your keys, or access them here: https://dashboard.clerk.com/last-active?path=api-keys",
          );
        if (t.fatal && !x(e)) throw Error("Publishable key not valid.");
        return null;
      }
      const n = e.startsWith(A) ? "production" : "development";
      try {
        r = I(e.split("_")[2]);
      } catch {
        if (t.fatal) throw Error("Publishable key not valid: Failed to decode key.");
        return null;
      }
      if (!R(r)) {
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
    function x(e = "") {
      try {
        if (!(e.startsWith(A) || e.startsWith("pk_test_"))) return !1;
        const t = e.split("_");
        if (3 !== t.length) return !1;
        const r = t[2];
        if (!r) return !1;
        return R(I(r));
      } catch {
        return !1;
      }
    }
    function F(e, t) {
      return { event: "METHOD_CALLED", eventSamplingRate: 0.1, payload: { method: e, ...t } };
    }
    var N = e.i(98937);
    const W = "reverification-error",
      D = (...e) => {};
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
    var K = Object.prototype.hasOwnProperty;
    let $ = new WeakMap(),
      q = () => {},
      V = q(),
      G = Object,
      J = (e) => e === V,
      H = (e, t) => ({ ...e, ...t }),
      Q = {},
      Y = {},
      Z = "undefined",
      X = typeof window != Z,
      ee = typeof document != Z,
      et = X && "Deno" in window,
      er = (e, t) => {
        const r = $.get(e);
        return [
          () => (!J(t) && e.get(t)) || Q,
          (n) => {
            if (!J(t)) {
              const i = e.get(t);
              t in Y || (Y[t] = i), r[5](t, H(i, n), i || Q);
            }
          },
          r[6],
          () => (!J(t) && t in Y ? Y[t] : (!J(t) && e.get(t)) || Q),
        ];
      },
      en = !0,
      [ei, es] =
        X && window.addEventListener
          ? [window.addEventListener.bind(window), window.removeEventListener.bind(window)]
          : [q, q],
      eo = {
        initFocus: (e) => (
          ee && document.addEventListener("visibilitychange", e),
          ei("focus", e),
          () => {
            ee && document.removeEventListener("visibilitychange", e), es("focus", e);
          }
        ),
        initReconnect: (e) => {
          const t = () => {
              (en = !0), e();
            },
            r = () => {
              en = !1;
            };
          return (
            ei("online", t),
            ei("offline", r),
            () => {
              es("online", t), es("offline", r);
            }
          );
        },
      },
      ea = !N.default.useId,
      el = !X || et,
      eu = el ? N.useEffect : N.useLayoutEffect,
      ed = "u" > typeof navigator && navigator.connection,
      ec = !el && ed && (["slow-2g", "2g"].includes(ed.effectiveType) || ed.saveData),
      eh = new WeakMap(),
      ep = (e, t) => e === `[object ${t}]`,
      ef = 0,
      eg = (e) => {
        let t,
          r,
          n = typeof e,
          i = G.prototype.toString.call(e),
          s = ep(i, "Date"),
          o = ep(i, "RegExp"),
          a = ep(i, "Object");
        if (G(e) !== e || s || o)
          t = s
            ? e.toJSON()
            : "symbol" == n
              ? e.toString()
              : "string" == n
                ? JSON.stringify(e)
                : "" + e;
        else {
          if ((t = eh.get(e))) return t;
          if (((t = ++ef + "~"), eh.set(e, t), Array.isArray(e))) {
            for (r = 0, t = "@"; r < e.length; r++) t += eg(e[r]) + ",";
            eh.set(e, t);
          }
          if (a) {
            t = "#";
            const n = G.keys(e).sort();
            while (!J((r = n.pop()))) J(e[r]) || (t += r + ":" + eg(e[r]) + ",");
            eh.set(e, t);
          }
        }
        return t;
      },
      em = (e) => {
        if ("function" == typeof e)
          try {
            e = e();
          } catch (t) {
            e = "";
          }
        const t = e;
        return [(e = "string" == typeof e ? e : (Array.isArray(e) ? e.length : e) ? eg(e) : ""), t];
      },
      ev = 0,
      ey = () => ++ev;
    async function ek(...e) {
      let [t, r, n, i] = e,
        s = H(
          { populateCache: !0, throwOnError: !0 },
          "boolean" == typeof i ? { revalidate: i } : i || {},
        ),
        o = s.populateCache,
        a = s.rollbackOnError,
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
          [d] = em(r);
        if (!d) return;
        const [c, h] = er(t, d),
          [p, f, g, m] = $.get(t),
          v = () => {
            const e = p[d];
            return ("function" == typeof s.revalidate
              ? s.revalidate(c().data, r)
              : !1 !== s.revalidate) && (delete g[d], delete m[d], e && e[0])
              ? e[0](2).then(() => c().data)
              : c().data;
          };
        if (e.length < 3) return v();
        let y = n,
          k = !1,
          b = ey();
        f[d] = [b, 0];
        const _ = !J(l),
          S = c(),
          P = S.data,
          w = S._c,
          C = J(w) ? P : w;
        if (
          (_ && h({ data: (l = "function" == typeof l ? l(C, P) : l), _c: C }),
          "function" == typeof y)
        )
          try {
            y = y(C);
          } catch (e) {
            (i = e), (k = !0);
          }
        if (y && "function" == typeof y.then) {
          let e;
          if (
            ((y = await y.catch((e) => {
              (i = e), (k = !0);
            })),
            b !== f[d][0])
          ) {
            if (k) throw i;
            return y;
          }
          k &&
            _ &&
            ((e = i), "function" == typeof a ? a(e) : !1 !== a) &&
            ((o = !0), h({ data: C, _c: V }));
        }
        if (
          (o &&
            !k &&
            ("function" == typeof o
              ? h({ data: o(y, C), error: V, _c: V })
              : h({ data: y, error: V, _c: V })),
          (f[d][1] = ey()),
          Promise.resolve(v()).then(() => {
            h({ _c: V });
          }),
          k)
        ) {
          if (u) throw i;
          return;
        }
        return y;
      }
    }
    const eb = (e, t) => {
        for (const r in e) e[r][0] && e[r][0](t);
      },
      e_ = (e, t) => {
        if (!$.has(e)) {
          let r = H(eo, t),
            n = Object.create(null),
            i = ek.bind(V, e),
            s = q,
            o = Object.create(null),
            a = (e, t) => {
              const r = o[e] || [];
              return (o[e] = r), r.push(t), () => r.splice(r.indexOf(t), 1);
            },
            l = (t, r, n) => {
              e.set(t, r);
              const i = o[t];
              if (i) for (const e of i) e(r, n);
            },
            u = () => {
              if (
                !$.has(e) &&
                ($.set(e, [
                  n,
                  Object.create(null),
                  Object.create(null),
                  Object.create(null),
                  i,
                  l,
                  a,
                ]),
                !el)
              ) {
                const t = r.initFocus(setTimeout.bind(V, eb.bind(V, n, 0))),
                  i = r.initReconnect(setTimeout.bind(V, eb.bind(V, n, 1)));
                s = () => {
                  t && t(), i && i(), $.delete(e);
                };
              }
            };
          return u(), [e, i, u, s];
        }
        return [e, $.get(e)[4]];
      },
      [eS, eP] = e_(new Map()),
      ew = H(
        {
          onLoadingSlow: q,
          onSuccess: q,
          onError: q,
          onErrorRetry: (e, t, r, n, i) => {
            const s = r.errorRetryCount,
              o = i.retryCount,
              a = ~~((Math.random() + 0.5) * (1 << (o < 8 ? o : 8))) * r.errorRetryInterval;
            (J(s) || !(o > s)) && setTimeout(n, a, i);
          },
          onDiscarded: q,
          revalidateOnFocus: !0,
          revalidateOnReconnect: !0,
          revalidateIfStale: !0,
          shouldRetryOnError: !0,
          errorRetryInterval: ec ? 1e4 : 5e3,
          focusThrottleInterval: 5e3,
          dedupingInterval: 2e3,
          loadingTimeout: ec ? 5e3 : 3e3,
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
                  if ((K.call(t, n) && ++i && !K.call(r, n)) || !(n in r) || !e(t[n], r[n]))
                    return !1;
                return Object.keys(r).length === i;
              }
            }
            return t != t && r != r;
          },
          isPaused: () => !1,
          cache: eS,
          mutate: eP,
          fallback: {},
        },
        {
          isOnline: () => en,
          isVisible: () => {
            const e = ee && document.visibilityState;
            return J(e) || "hidden" !== e;
          },
        },
      ),
      eC = (e, t) => {
        const r = H(e, t);
        if (t) {
          const { use: n, fallback: i } = e,
            { use: s, fallback: o } = t;
          n && s && (r.use = n.concat(s)), i && o && (r.fallback = H(i, o));
        }
        return r;
      },
      eE = (0, N.createContext)({});
    var eO = e.i(3861);
    const ej = "$inf$",
      eU = X && window.__SWR_DEVTOOLS_USE__,
      eM = eU ? window.__SWR_DEVTOOLS_USE__ : [],
      eT = (e) =>
        "function" == typeof e[1]
          ? [e[0], e[1], e[2] || {}]
          : [e[0], null, (null === e[1] ? e[2] : e[1]) || {}],
      ez = () => H(ew, (0, N.useContext)(eE)),
      eI = eM.concat((e) => (t, r, n) => {
        const i =
          r &&
          ((...e) => {
            const [n] = em(t),
              [, , , i] = $.get(eS);
            if (n.startsWith(ej)) return r(...e);
            const s = i[n];
            return J(s) ? r(...e) : (delete i[n], s);
          });
        return e(t, i, n);
      }),
      eA =
        (e, t) =>
        (...r) => {
          const [n, i, s] = eT(r),
            o = (s.use || []).concat(t);
          return e(n, i, { ...s, use: o });
        };
    eU && (window.__SWR_DEVTOOLS_REACT__ = N.default);
    let eR = () => {},
      eL = eR(),
      ex =
        (new WeakMap(),
        N.default.use ||
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
      eN = G.defineProperty(
        (e) => {
          const { value: t } = e,
            r = (0, N.useContext)(eE),
            n = "function" == typeof t,
            i = (0, N.useMemo)(() => (n ? t(r) : t), [n, r, t]),
            s = (0, N.useMemo)(() => (n ? i : eC(r, i)), [n, r, i]),
            o = i && i.provider,
            a = (0, N.useRef)(V);
          o && !a.current && (a.current = e_(o(s.cache || eS), i));
          const l = a.current;
          return (
            l && ((s.cache = l[0]), (s.mutate = l[1])),
            eu(() => {
              if (l) return l[2] && l[2](), l[3];
            }, []),
            (0, N.createElement)(eE.Provider, H(e, { value: s }))
          );
        },
        "defaultValue",
        { value: ew },
      ),
      eW =
        ((t = (e, t, r) => {
          const {
              cache: n,
              compare: i,
              suspense: s,
              fallbackData: o,
              revalidateOnMount: a,
              revalidateIfStale: l,
              refreshInterval: u,
              refreshWhenHidden: d,
              refreshWhenOffline: c,
              keepPreviousData: h,
            } = r,
            [p, f, g, m] = $.get(n),
            [v, y] = em(e),
            k = (0, N.useRef)(!1),
            b = (0, N.useRef)(!1),
            _ = (0, N.useRef)(v),
            S = (0, N.useRef)(t),
            P = (0, N.useRef)(r),
            w = () => P.current.isVisible() && P.current.isOnline(),
            [C, E, O, j] = er(n, v),
            U = (0, N.useRef)({}).current,
            M = J(o) ? (J(r.fallback) ? V : r.fallback[v]) : o,
            T = (e, t) => {
              for (const r in U)
                if ("data" === r) {
                  if (!i(e[r], t[r]) && (!J(e[r]) || !i(D, t[r]))) return !1;
                } else if (t[r] !== e[r]) return !1;
              return !0;
            },
            z = (0, N.useMemo)(() => {
              let e = !!v && !!t && (J(a) ? !P.current.isPaused() && !s && !1 !== l : a),
                r = (t) => {
                  const r = H(t);
                  return (delete r._k, e) ? { isValidating: !0, isLoading: !0, ...r } : r;
                },
                n = C(),
                i = j(),
                o = r(n),
                u = n === i ? o : r(i),
                d = o;
              return [
                () => {
                  const e = r(C());
                  return T(e, d)
                    ? ((d.data = e.data),
                      (d.isLoading = e.isLoading),
                      (d.isValidating = e.isValidating),
                      (d.error = e.error),
                      d)
                    : ((d = e), e);
                },
                () => u,
              ];
            }, [n, v]),
            I = (0, B.useSyncExternalStore)(
              (0, N.useCallback)(
                (e) =>
                  O(v, (t, r) => {
                    T(r, t) || e();
                  }),
                [n, v],
              ),
              z[0],
              z[1],
            ),
            A = !k.current,
            R = p[v] && p[v].length > 0,
            L = I.data,
            x = J(L) ? (M && "function" == typeof M.then ? ex(M) : M) : L,
            F = I.error,
            W = (0, N.useRef)(x),
            D = h ? (J(L) ? (J(W.current) ? x : W.current) : L) : x,
            K =
              (!R || !!J(F)) &&
              (A && !J(a) ? a : !P.current.isPaused() && (s ? !J(x) && l : J(x) || l)),
            q = !!(v && t && A && K),
            G = J(I.isValidating) ? q : I.isValidating,
            Q = J(I.isLoading) ? q : I.isLoading,
            Y = (0, N.useCallback)(
              async (e) => {
                let t,
                  n,
                  s = S.current;
                if (!v || !s || b.current || P.current.isPaused()) return !1;
                let o = !0,
                  a = e || {},
                  l = !g[v] || !a.dedupe,
                  u = () => (ea ? !b.current && v === _.current && k.current : v === _.current),
                  d = { isValidating: !1, isLoading: !1 },
                  c = () => {
                    E(d);
                  },
                  h = () => {
                    const e = g[v];
                    e && e[1] === n && delete g[v];
                  },
                  m = { isValidating: !0 };
                J(C().data) && (m.isLoading = !0);
                try {
                  if (
                    (l &&
                      (E(m),
                      r.loadingTimeout &&
                        J(C().data) &&
                        setTimeout(() => {
                          o && u() && P.current.onLoadingSlow(v, r);
                        }, r.loadingTimeout),
                      (g[v] = [s(y), ey()])),
                    ([t, n] = g[v]),
                    (t = await t),
                    l && setTimeout(h, r.dedupingInterval),
                    !g[v] || g[v][1] !== n)
                  )
                    return l && u() && P.current.onDiscarded(v), !1;
                  d.error = V;
                  const e = f[v];
                  if (!J(e) && (n <= e[0] || n <= e[1] || 0 === e[1]))
                    return c(), l && u() && P.current.onDiscarded(v), !1;
                  const a = C().data;
                  (d.data = i(a, t) ? a : t), l && u() && P.current.onSuccess(t, v, r);
                } catch (r) {
                  h();
                  const e = P.current,
                    { shouldRetryOnError: t } = e;
                  !e.isPaused() &&
                    ((d.error = r), l && u()) &&
                    (e.onError(r, v, e),
                    (!0 === t || ("function" == typeof t && t(r))) &&
                      (!P.current.revalidateOnFocus || !P.current.revalidateOnReconnect || w()) &&
                      e.onErrorRetry(
                        r,
                        v,
                        e,
                        (e) => {
                          const t = p[v];
                          t && t[0] && t[0](eO.ERROR_REVALIDATE_EVENT, e);
                        },
                        { retryCount: (a.retryCount || 0) + 1, dedupe: !0 },
                      ));
                }
                return (o = !1), c(), !0;
              },
              [v, n],
            ),
            ee = (0, N.useCallback)((...e) => ek(n, _.current, ...e), []);
          if (
            (eu(() => {
              (S.current = t), (P.current = r), J(L) || (W.current = L);
            }),
            eu(() => {
              var e;
              let t;
              if (!v) return;
              let r = Y.bind(V, eF),
                n = 0;
              P.current.revalidateOnFocus && (n = Date.now() + P.current.focusThrottleInterval);
              const i =
                ((e = (e, t = {}) => {
                  if (e == eO.FOCUS_EVENT) {
                    const e = Date.now();
                    P.current.revalidateOnFocus &&
                      e > n &&
                      w() &&
                      ((n = e + P.current.focusThrottleInterval), r());
                  } else if (e == eO.RECONNECT_EVENT) P.current.revalidateOnReconnect && w() && r();
                  else if (e == eO.MUTATE_EVENT) return Y();
                  else if (e == eO.ERROR_REVALIDATE_EVENT) return Y(t);
                }),
                (t = p[v] || (p[v] = [])).push(e),
                () => {
                  const r = t.indexOf(e);
                  r >= 0 && ((t[r] = t[t.length - 1]), t.pop());
                });
              if (((b.current = !1), (_.current = v), (k.current = !0), E({ _k: y }), K && !g[v]))
                if (J(x) || el) r();
                else
                  X && typeof window.requestAnimationFrame != Z
                    ? window.requestAnimationFrame(r)
                    : setTimeout(r, 1);
              return () => {
                (b.current = !0), i();
              };
            }, [v]),
            eu(() => {
              let e;
              function t() {
                const t = "function" == typeof u ? u(C().data) : u;
                t && -1 !== e && (e = setTimeout(r, t));
              }
              function r() {
                !C().error && (d || P.current.isVisible()) && (c || P.current.isOnline())
                  ? Y(eF).then(t)
                  : t();
              }
              return (
                t(),
                () => {
                  e && (clearTimeout(e), (e = -1));
                }
              );
            }, [u, d, c, v]),
            (0, N.useDebugValue)(D),
            s && J(x) && v)
          ) {
            if (!ea && el) throw Error("Fallback data is required when using Suspense in SSR.");
            (S.current = t), (P.current = r), (b.current = !1);
            const e = m[v];
            if ((J(e) || ex(ee(e)), J(F))) {
              const e = Y(eF);
              J(D) || ((e.status = "fulfilled"), (e.value = !0)), ex(e);
            } else throw F;
          }
          return {
            mutate: ee,
            get data() {
              return (U.data = !0), D;
            },
            get error() {
              return (U.error = !0), F;
            },
            get isValidating() {
              return (U.isValidating = !0), G;
            },
            get isLoading() {
              return (U.isLoading = !0), Q;
            },
          };
        }),
        (...e) => {
          let r = ez(),
            [n, i, s] = eT(e),
            o = eC(r, s),
            a = t,
            { use: l } = o,
            u = (l || []).concat(eI);
          for (let e = u.length; e--; ) a = u[e](a);
          return a(n, i || o.fetcher || null, o);
        }),
      eD = () => {},
      eB = eD(),
      eK = Object,
      e$ = (e) => e === eB,
      eq = new WeakMap(),
      eV = (e, t) => e === `[object ${t}]`,
      eG = 0,
      eJ = (e) => {
        let t,
          r,
          n = typeof e,
          i = eK.prototype.toString.call(e),
          s = eV(i, "Date"),
          o = eV(i, "RegExp"),
          a = eV(i, "Object");
        if (eK(e) !== e || s || o)
          t = s
            ? e.toJSON()
            : "symbol" == n
              ? e.toString()
              : "string" == n
                ? JSON.stringify(e)
                : "" + e;
        else {
          if ((t = eq.get(e))) return t;
          if (((t = ++eG + "~"), eq.set(e, t), Array.isArray(e))) {
            for (r = 0, t = "@"; r < e.length; r++) t += eJ(e[r]) + ",";
            eq.set(e, t);
          }
          if (a) {
            t = "#";
            const n = eK.keys(e).sort();
            while (!e$((r = n.pop()))) e$(e[r]) || (t += r + ":" + eJ(e[r]) + ",");
            eq.set(e, t);
          }
        }
        return t;
      },
      eH = Promise.resolve(),
      eQ = eA(eW, (e) => (t, r, n) => {
        let i,
          s = (0, N.useRef)(!1),
          {
            cache: o,
            initialSize: a = 1,
            revalidateAll: l = !1,
            persistSize: u = !1,
            revalidateFirstPage: d = !0,
            revalidateOnMount: c = !1,
            parallel: h = !1,
          } = n,
          [, , , p] = $.get(eS);
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
          })(t ? t(0, null) : null)[0]) && (i = ej + i);
        } catch (e) {}
        const [f, g, m] = er(o, i),
          v = (0, N.useCallback)(() => (J(f()._l) ? a : f()._l), [o, i, a]);
        (0, B.useSyncExternalStore)(
          (0, N.useCallback)(
            (e) =>
              i
                ? m(i, () => {
                    e();
                  })
                : () => {},
            [o, i],
          ),
          v,
          v,
        );
        const y = (0, N.useCallback)(() => {
            const e = f()._l;
            return J(e) ? a : e;
          }, [i, a]),
          k = (0, N.useRef)(y());
        eu(() => {
          if (!s.current) {
            s.current = !0;
            return;
          }
          i && g({ _l: u ? k.current : y() });
        }, [i, o]);
        const b = c && !s.current,
          _ = e(
            i,
            async (e) => {
              const i = f()._i,
                s = f()._r;
              g({ _r: V });
              let a = [],
                u = y(),
                [c] = er(o, e),
                m = c().data,
                v = [],
                k = null;
              for (let e = 0; e < u; ++e) {
                const [u, c] = em(t(e, h ? null : k));
                if (!u) break;
                let [f, g] = er(o, u),
                  y = f().data,
                  _ =
                    l ||
                    i ||
                    J(y) ||
                    (d && !e && !J(m)) ||
                    b ||
                    (m && !J(m[e]) && !n.compare(m[e], y));
                if (r && ("function" == typeof s ? s(y, c) : _)) {
                  const t = async () => {
                    if (u in p) {
                      const e = p[u];
                      delete p[u], (y = await e);
                    } else y = await r(c);
                    g({ data: y, _k: c }), (a[e] = y);
                  };
                  h ? v.push(t) : await t();
                } else a[e] = y;
                h || (k = y);
              }
              return h && (await Promise.all(v.map((e) => e()))), g({ _i: V }), a;
            },
            n,
          ),
          S = (0, N.useCallback)(
            (e, t) => {
              const r = "boolean" == typeof t ? { revalidate: t } : t || {},
                n = !1 !== r.revalidate;
              return i
                ? (n && (J(e) ? g({ _i: !0, _r: r.revalidate }) : g({ _i: !1, _r: r.revalidate })),
                  arguments.length ? _.mutate(e, { ...r, revalidate: n }) : _.mutate())
                : eH;
            },
            [i, o],
          ),
          P = (0, N.useCallback)(
            (e) => {
              let r;
              if (!i) return eH;
              const [, n] = er(o, i);
              if (
                ("function" == typeof e ? (r = e(y())) : "number" == typeof e && (r = e),
                "number" != typeof r)
              )
                return eH;
              n({ _l: r }), (k.current = r);
              let s = [],
                [a] = er(o, i),
                l = null;
              for (let e = 0; e < r; ++e) {
                const [r] = em(t(e, l)),
                  [n] = er(o, r),
                  i = r ? n().data : V;
                if (J(i)) return S(a().data);
                s.push(i), (l = i);
              }
              return S(s);
            },
            [i, o, S, y],
          );
        return {
          size: y(),
          setSize: P,
          mutate: S,
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
    var eY = Object.prototype.hasOwnProperty;
    function eZ(e, t, r) {
      for (r of e.keys()) if (eX(r, t)) return r;
    }
    function eX(e, t) {
      var r, n, i;
      if (e === t) return !0;
      if (e && t && (r = e.constructor) === t.constructor) {
        if (r === Date) return e.getTime() === t.getTime();
        if (r === RegExp) return e.toString() === t.toString();
        if (r === Array) {
          if ((n = e.length) === t.length) while (n-- && eX(e[n], t[n]));
          return -1 === n;
        }
        if (r === Set) {
          if (e.size !== t.size) return !1;
          for (n of e)
            if (((i = n) && "object" == typeof i && !(i = eZ(t, i))) || !t.has(i)) return !1;
          return !0;
        }
        if (r === Map) {
          if (e.size !== t.size) return !1;
          for (n of e)
            if (((i = n[0]) && "object" == typeof i && !(i = eZ(t, i))) || !eX(n[1], t.get(i)))
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
            if ((eY.call(e, r) && ++n && !eY.call(t, r)) || !(r in t) || !eX(e[r], t[r])) return !1;
          return Object.keys(t).length === n;
        }
      }
      return e != e && t != t;
    }
    const e0 = ea
        ? (e) => {
            e();
          }
        : N.default.startTransition,
      e1 = eA(eW, () => (e, t, r = {}) => {
        const { mutate: n } = ez(),
          i = (0, N.useRef)(e),
          s = (0, N.useRef)(t),
          o = (0, N.useRef)(r),
          a = (0, N.useRef)(0),
          [l, u, d] = ((e) => {
            const [, t] = (0, N.useState)({}),
              r = (0, N.useRef)(!1),
              n = (0, N.useRef)(e),
              i = (0, N.useRef)({ data: !1, error: !1, isValidating: !1 }),
              s = (0, N.useCallback)((e) => {
                let s = !1,
                  o = n.current;
                for (const t in e)
                  Object.prototype.hasOwnProperty.call(e, t) &&
                    o[t] !== e[t] &&
                    ((o[t] = e[t]), i.current[t] && (s = !0));
                s && !r.current && t({});
              }, []);
            return (
              eu(
                () => (
                  (r.current = !1),
                  () => {
                    r.current = !0;
                  }
                ),
              ),
              [n, i.current, s]
            );
          })({ data: V, error: V, isMutating: !1 }),
          c = l.current,
          h = (0, N.useCallback)(async (e, t) => {
            const [r, l] = em(i.current);
            if (!s.current) throw Error("Can’t trigger the mutation: missing fetcher.");
            if (!r) throw Error("Can’t trigger the mutation: missing key.");
            const u = H(H({ populateCache: !1, throwOnError: !0 }, o.current), t),
              c = ey();
            (a.current = c), d({ isMutating: !0 });
            try {
              const t = await n(r, s.current(l, { arg: e }), H(u, { throwOnError: !0 }));
              return (
                a.current <= c &&
                  (e0(() => d({ data: t, isMutating: !1, error: void 0 })),
                  null == u.onSuccess || u.onSuccess.call(u, t, r, u)),
                t
              );
            } catch (e) {
              if (
                a.current <= c &&
                (e0(() => d({ error: e, isMutating: !1 })),
                null == u.onError || u.onError.call(u, e, r, u),
                u.throwOnError)
              )
                throw e;
            }
          }, []),
          p = (0, N.useCallback)(() => {
            (a.current = ey()), d({ data: V, error: V, isMutating: !1 });
          }, []);
        return (
          eu(() => {
            (i.current = e), (s.current = t), (o.current = r);
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
    function e3(e, t) {
      if (!e) throw "string" == typeof t ? Error(t) : Error(`${t.displayName} not found`);
    }
    const e8 = (e, t) => {
      const { assertCtxFn: r = e3 } = t || {},
        n = N.default.createContext(void 0);
      return (
        (n.displayName = e),
        [
          n,
          () => {
            const t = N.default.useContext(n);
            return r(t, `${e} not found`), t.value;
          },
          () => {
            const e = N.default.useContext(n);
            return e ? e.value : {};
          },
        ]
      );
    };
    function e4({ swrConfig: e, children: t }) {
      return N.default.createElement(eN, { value: e }, t);
    }
    const [e6, e2] = e8("ClerkInstanceContext"),
      [e5, e7] = e8("UserContext"),
      [e9, te] = e8("ClientContext"),
      [tt, tr] = e8("SessionContext");
    N.default.createContext({});
    const [tn, ti] = e8("CheckoutContext"),
      ts = ({ children: e, ...t }) =>
        N.default.createElement(tn.Provider, { value: { value: t } }, e),
      [to, ta] = e8("OrganizationContext"),
      tl = ({ children: e, organization: t, swrConfig: r }) =>
        N.default.createElement(
          e4,
          { swrConfig: r },
          N.default.createElement(to.Provider, { value: { value: { organization: t } } }, e),
        );
    function tu(e) {
      if (!N.default.useContext(e6)) {
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
    function td(e) {
      return {
        queryKey: [e.stablePrefix, e.authenticated, e.tracked, e.untracked],
        invalidationKey: [e.stablePrefix, e.authenticated, e.tracked],
        stableKey: e.stablePrefix,
        authenticated: e.authenticated,
      };
    }
    function tc(e) {
      const { queryKey: t } = e;
      return { type: t[0], ...t[2], ...t[3].args };
    }
    const th = (e, t) => {
      const r = "boolean" == typeof e && e,
        n = (0, N.useRef)(r ? t.initialPage : (e?.initialPage ?? t.initialPage)),
        i = (0, N.useRef)(r ? t.pageSize : (e?.pageSize ?? t.pageSize)),
        s = {};
      for (const n of Object.keys(t)) s[n] = r ? t[n] : (e?.[n] ?? t[n]);
      return { ...s, initialPage: n.current, pageSize: i.current };
    };
    function tp(e, t) {
      const r = new Set(Object.keys(t)),
        n = {};
      for (const t of Object.keys(e)) r.has(t) || (n[t] = e[t]);
      return n;
    }
    const tf = { dedupingInterval: 6e4, focusThrottleInterval: 12e4 },
      tg = { ...tf, revalidateFirstPage: !1 },
      tm = (e) => {
        let t,
          r,
          { fetcher: n, config: i, keys: s } = e,
          [o, a] = (0, N.useState)(i.initialPage ?? 1),
          l = (0, N.useRef)(i.initialPage ?? 1),
          u = (0, N.useRef)(i.pageSize ?? 10),
          d = i.enabled ?? !0,
          c = "cache" === i.__experimental_mode,
          h = i.infinite ?? !1,
          p = i.keepPreviousData ?? !1,
          f = i.isSignedIn,
          g = { ...tc(s), initialPage: o, pageSize: u.current },
          m =
            ((t = (0, N.useRef)(f)),
            (r = (0, N.useRef)(null)),
            t.current !== f && ((r.current = t.current), (t.current = f)),
            r.current),
          v = !h && d && (!!c || !!n),
          {
            data: y,
            isValidating: k,
            isLoading: b,
            error: _,
            mutate: S,
          } = eW(
            "boolean" == typeof f ? ((!0 === m && !1 === f) || (f && v) ? g : null) : v ? g : null,
            !c && n
              ? (e) =>
                  !1 === f || !1 === v ? null : n(tp(e, { type: s.queryKey[0], ...s.queryKey[2] }))
              : null,
            { keepPreviousData: p, ...tf },
          ),
          {
            data: P,
            isLoading: w,
            isValidating: C,
            error: E,
            size: O,
            setSize: j,
            mutate: U,
          } = eQ(
            (e) =>
              h && d && !1 !== f
                ? { ...tc(s), initialPage: l.current + e, pageSize: u.current }
                : null,
            (e) => {
              const t = tp(e, { type: s.queryKey[0], ...s.queryKey[2] });
              return n?.(t);
            },
            tg,
          ),
          M = (0, N.useMemo)(() => (h ? O : o), [h, O, o]),
          T = (0, N.useCallback)((e) => (h ? void j(e) : a(e)), [j, h]),
          z = (0, N.useMemo)(
            () => (h ? (P?.flatMap((e) => e?.data) ?? []) : (y?.data ?? [])),
            [h, y, P],
          ),
          I = (0, N.useMemo)(
            () => (h ? P?.[P?.length - 1]?.total_count || 0 : (y?.total_count ?? 0)),
            [h, y, P],
          ),
          A = h ? w : b,
          R = h ? C : k,
          L = (h ? E : _) ?? null,
          x = (0, N.useCallback)(() => {
            T((e) => Math.max(0, e + 1));
          }, [T]),
          F = (0, N.useCallback)(() => {
            T((e) => Math.max(0, e - 1));
          }, [T]),
          W = (l.current - 1) * u.current;
        return {
          data: z,
          count: I,
          error: L,
          isLoading: A,
          isFetching: R,
          isError: !!L,
          page: M,
          pageCount: Math.ceil((I - W) / u.current),
          fetchPage: T,
          fetchNext: x,
          fetchPrevious: F,
          hasNextPage: I - W * u.current > M * u.current,
          hasPreviousPage: (M - 1) * u.current > W * u.current,
          revalidate: h ? () => U() : () => S(),
          setData: h ? (e) => U(e, { revalidate: !1 }) : (e) => S(e, { revalidate: !1 }),
        };
      },
      tv = () => (tu("useClerk"), e2());
    function ty(e) {
      const t = tv(),
        r = (0, N.useRef)(!1);
      (0, N.useEffect)(() => {
        r.current ||
          ((r.current = !0),
          t.__internal_attemptToEnableEnvironmentSetting?.({ for: "organizations", caller: e }));
      }, [t, e]);
    }
    const tk = {
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
      },
      tb = {
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
      },
      t_ = "u" > typeof window ? N.default.useLayoutEffect : N.default.useEffect,
      tS = "useSession",
      tP = "useSessionList",
      tw = "useUser";
    function tC() {
      tu(tw);
      const e = e7();
      return (e2().telemetry?.record(F(tw)), void 0 === e)
        ? { isLoaded: !1, isSignedIn: void 0, user: void 0 }
        : null === e
          ? { isLoaded: !0, isSignedIn: !1, user: null }
          : { isLoaded: !0, isSignedIn: !0, user: e };
    }
    const tE = eX;
    async function tO(e) {
      try {
        const t = await e;
        if (t instanceof Response) return t.json();
        return t;
      } catch (e) {
        if (_(e) && e.errors.find(({ code: e }) => "session_reverification_required" === e))
          return {
            clerk_error: { type: "forbidden", reason: W, metadata: { reverification: void 0 } },
          };
        throw e;
      }
    }
    function tj({ hookName: e, resourceType: t, useFetcher: r, options: n }) {
      return (i) => {
        const { for: s, enabled: o, ...a } = i || {},
          l = s || "user";
        tu(e);
        const u = r(l),
          d = th(a, {
            initialPage: 1,
            pageSize: 10,
            keepPreviousData: !1,
            infinite: !1,
            __experimental_mode: void 0,
          }),
          c = e2(),
          h = e7(),
          { organization: p } = ta();
        c.telemetry?.record(F(e));
        const f = "organization" === l,
          g = ((e) => {
            const t = e2(),
              r = e?.enabled ?? !0,
              n = t.__unstable__environment,
              i = e7(),
              { organization: s } = ta(),
              o = e?.for === "organization",
              a = o
                ? n?.commerceSettings.billing.organization.enabled
                : n?.commerceSettings.billing.user.enabled,
              l = !(e?.authenticated ?? !0) || ((!o || !!s?.id) && !!i?.id);
            return a && r && t.loaded && l;
          })({ for: l, enabled: o, authenticated: !n?.unauthenticated }),
          m =
            void 0 === a
              ? void 0
              : {
                  initialPage: d.initialPage,
                  pageSize: d.pageSize,
                  ...(n?.unauthenticated ? {} : f ? { orgId: p?.id } : {}),
                },
          v = !!m && c.loaded && !!g;
        return tm({
          fetcher: u,
          config: {
            keepPreviousData: d.keepPreviousData,
            infinite: d.infinite,
            enabled: v,
            ...(n?.unauthenticated ? {} : { isSignedIn: null !== h }),
            __experimental_mode: d.__experimental_mode,
            initialPage: d.initialPage,
            pageSize: d.pageSize,
          },
          keys: td({
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
    tj({
      hookName: "useStatements",
      resourceType: "billing-statements",
      useFetcher: () => {
        const e = e2();
        if (e.loaded) return e.billing.getStatements;
      },
    }),
      tj({
        hookName: "usePaymentAttempts",
        resourceType: "billing-payment-attempts",
        useFetcher: () => {
          const e = e2();
          if (e.loaded) return e.billing.getPaymentAttempts;
        },
      }),
      tj({
        hookName: "usePaymentMethods",
        resourceType: "billing-payment-methods",
        useFetcher: (e) => {
          const { organization: t } = ta(),
            r = e7();
          return "organization" === e ? t?.getPaymentMethods : r?.getPaymentMethods;
        },
      }),
      tj({
        hookName: "usePlans",
        resourceType: "billing-plans",
        useFetcher: (e) => {
          const t = e2();
          if (t.loaded) return (r) => t.billing.getPlans({ ...r, for: e });
        },
        options: { unauthenticated: !0 },
      });
    const tU = (e) => {
        const t = (0, N.useRef)(e);
        return (
          (0, N.useEffect)(() => {
            t.current = e;
          }, [e]),
          t.current
        );
      },
      tM = (e, t, r) => {
        const n = !!r,
          i = (0, N.useRef)(r);
        (0, N.useEffect)(() => {
          i.current = r;
        }, [r]),
          (0, N.useEffect)(() => {
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
      tT = N.default.createContext(null);
    tT.displayName = "ElementsContext";
    const tz = (e, t) => {
        if (!e)
          throw Error(
            `Could not find Elements context; You need to wrap the part of your app that ${t} in an <Elements> provider.`,
          );
        return e;
      },
      tI = ({ stripe: e, options: t, children: r }) => {
        const n = N.default.useMemo(() => tL(e), [e]),
          [i, s] = N.default.useState(() => ({
            stripe: "sync" === n.tag ? n.stripe : null,
            elements: "sync" === n.tag ? n.stripe.elements(t) : null,
          }));
        N.default.useEffect(() => {
          let e = !0,
            r = (e) => {
              s((r) => (r.stripe ? r : { stripe: e, elements: e.elements(t) }));
            };
          return (
            "async" !== n.tag || i.stripe
              ? "sync" !== n.tag || i.stripe || r(n.stripe)
              : n.stripePromise.then((t) => {
                  t && e && r(t);
                }),
            () => {
              e = !1;
            }
          );
        }, [n, i, t]);
        const o = tU(e);
        N.default.useEffect(() => {
          null !== o &&
            o !== e &&
            console.warn(
              "Unsupported prop change on Elements: You cannot change the `stripe` prop after setting it.",
            );
        }, [o, e]);
        const a = tU(t);
        return (
          N.default.useEffect(() => {
            if (!i.elements) return;
            const e = tW(t, a, ["clientSecret", "fonts"]);
            e && i.elements.update(e);
          }, [t, a, i.elements]),
          N.default.createElement(tT.Provider, { value: i }, r)
        );
      },
      tA =
        "Invalid prop `stripe` supplied to `Elements`. We recommend using the `loadStripe` utility from `@stripe/stripe-js`. See https://stripe.com/docs/stripe-js/react#elements-props-stripe for details.",
      tR = (e, t = tA) => {
        if (null === e || tN(e)) return e;
        throw Error(t);
      },
      tL = (e, t = tA) => {
        if (tF(e)) return { tag: "async", stripePromise: Promise.resolve(e).then((e) => tR(e, t)) };
        const r = tR(e, t);
        return null === r ? { tag: "empty" } : { tag: "sync", stripe: r };
      },
      tx = (e) => null !== e && "object" == typeof e,
      tF = (e) => tx(e) && "function" == typeof e.then,
      tN = (e) =>
        tx(e) &&
        "function" == typeof e.elements &&
        "function" == typeof e.createToken &&
        "function" == typeof e.createPaymentMethod &&
        "function" == typeof e.confirmCardPayment,
      tW = (e, t, r) =>
        tx(e)
          ? Object.keys(e).reduce((n, i) => {
              const s = !tx(t) || !tB(e[i], t[i]);
              return r.includes(i)
                ? (s &&
                    console.warn(
                      `Unsupported prop change: options.${i} is not a mutable property.`,
                    ),
                  n)
                : s
                  ? { ...(n || {}), [i]: e[i] }
                  : n;
            }, null)
          : null,
      tD = "[object Object]",
      tB = (e, t) => {
        if (!tx(e) || !tx(t)) return e === t;
        const r = Array.isArray(e);
        if (r !== Array.isArray(t)) return !1;
        const n = Object.prototype.toString.call(e) === tD;
        if (n !== (Object.prototype.toString.call(t) === tD)) return !1;
        if (!n && !r) return e === t;
        const i = Object.keys(e),
          s = Object.keys(t);
        if (i.length !== s.length) return !1;
        const o = {};
        for (let e = 0; e < i.length; e += 1) o[i[e]] = !0;
        for (let e = 0; e < s.length; e += 1) o[s[e]] = !0;
        const a = Object.keys(o);
        return a.length === i.length && a.every((r) => tB(e[r], t[r]));
      },
      tK = (e) => tz(N.default.useContext(tT), e),
      t$ =
        ((a = "payment"),
        (l = "u" < typeof window),
        (r = `${a.charAt(0).toUpperCase() + a.slice(1)}Element`),
        ((n = l
          ? (e) => {
              tK(`mounts <${r}>`);
              const { id: t, className: n } = e;
              return N.default.createElement("div", { id: t, className: n });
            }
          : ({
              id: e,
              className: t,
              fallback: n,
              options: i = {},
              onBlur: s,
              onFocus: o,
              onReady: l,
              onChange: u,
              onEscape: d,
              onClick: c,
              onLoadError: h,
              onLoaderStart: p,
              onNetworksChange: f,
              onConfirm: g,
              onCancel: m,
              onShippingAddressChange: v,
              onShippingRateChange: y,
            }) => {
              let k,
                b = tK(`mounts <${r}>`),
                _ = "elements" in b ? b.elements : null,
                [S, P] = N.default.useState(null),
                w = N.default.useRef(null),
                C = N.default.useRef(null),
                [E, O] = (0, N.useState)(!1);
              tM(S, "blur", s),
                tM(S, "focus", o),
                tM(S, "escape", d),
                tM(S, "click", c),
                tM(S, "loaderror", h),
                tM(S, "loaderstart", p),
                tM(S, "networkschange", f),
                tM(S, "confirm", g),
                tM(S, "cancel", m),
                tM(S, "shippingaddresschange", v),
                tM(S, "shippingratechange", y),
                tM(S, "change", u),
                l &&
                  (k = () => {
                    O(!0), l(S);
                  }),
                tM(S, "ready", k),
                N.default.useLayoutEffect(() => {
                  if (null === w.current && null !== C.current && _) {
                    let e = null;
                    _ && (e = _.create(a, i)), (w.current = e), P(e), e && e.mount(C.current);
                  }
                }, [_, i]);
              const j = tU(i);
              return (
                N.default.useEffect(() => {
                  if (!w.current) return;
                  const e = tW(i, j, ["paymentRequest"]);
                  e && "update" in w.current && w.current.update(e);
                }, [i, j]),
                N.default.useLayoutEffect(
                  () => () => {
                    if (w.current && "function" == typeof w.current.destroy)
                      try {
                        w.current.destroy(), (w.current = null);
                      } catch {}
                  },
                  [],
                ),
                N.default.createElement(
                  N.default.Fragment,
                  null,
                  !E && n,
                  N.default.createElement("div", {
                    id: e,
                    style: { height: E ? "unset" : "0px", visibility: E ? "visible" : "hidden" },
                    className: t,
                    ref: C,
                  }),
                )
              );
            }).displayName = r),
        (n.__elementType = a),
        n),
      [tq, tV] = e8("PaymentElementContext"),
      [tG, tJ] = e8("StripeUtilsContext"),
      tH = ({ children: e }) => {
        const t = (() => {
            const { stripe: e } = tK("calls useStripe()");
            return e;
          })(),
          r = (() => {
            const { elements: e } = tz(N.default.useContext(tT), "calls useElements()");
            return e;
          })();
        return N.default.createElement(
          tG.Provider,
          { value: { value: { stripe: t, elements: r } } },
          e,
        );
      },
      tQ = ({ children: e }) => N.default.createElement(tG.Provider, { value: { value: {} } }, e),
      tY = ({ children: e, ...t }) => {
        const r = ((e = "user") => {
            let t,
              r =
                ((t = tv()),
                eW(
                  "clerk-stripe-sdk",
                  async () => ({ loadStripe: await t.__internal_loadStripeJs() }),
                  { keepPreviousData: !0, revalidateOnFocus: !1, dedupingInterval: 1 / 0 },
                ).data ?? null),
              n = tv().__unstable__environment,
              { initializedPaymentMethod: i, initializePaymentMethod: s } = ((e) => {
                const { for: t = "user" } = e ?? {},
                  { organization: r } = ta(),
                  n = e7(),
                  i = "organization" === t ? r : n,
                  { data: s, trigger: o } = e1(
                    i?.id
                      ? { key: "billing-payment-method-initialize", resourceId: i.id, for: t }
                      : null,
                    () => i?.initializePaymentMethod({ gateway: "stripe" }),
                  );
                return (
                  (0, N.useEffect)(() => {
                    i?.id && o().catch(() => {});
                  }, [i?.id, o]),
                  { initializedPaymentMethod: s, initializePaymentMethod: o }
                );
              })({ for: e }),
              o = n?.commerceSettings.billing.stripePublishableKey ?? void 0;
            return {
              stripe: ((e) => {
                const { stripeClerkLibs: t, externalGatewayId: r, stripePublishableKey: n } = e;
                return eW(
                  t && r && n
                    ? { key: "stripe-sdk", externalGatewayId: r, stripePublishableKey: n }
                    : null,
                  ({ stripePublishableKey: e, externalGatewayId: r }) =>
                    t?.loadStripe(e, { stripeAccount: r }),
                  { keepPreviousData: !0, revalidateOnFocus: !1, dedupingInterval: 6e4 },
                ).data;
              })({
                stripeClerkLibs: r,
                externalGatewayId: i?.externalGatewayId,
                stripePublishableKey: o,
              }),
              initializePaymentMethod: s,
              externalClientSecret: i?.externalClientSecret,
              paymentMethodOrder: i?.paymentMethodOrder,
            };
          })(t.for),
          [n, i] = (0, N.useState)(!1);
        return N.default.createElement(
          tq.Provider,
          {
            value: { value: { ...t, ...r, setIsPaymentElementReady: i, isPaymentElementReady: n } },
          },
          e,
        );
      },
      tZ = (e) => {
        const { stripe: t, externalClientSecret: r, stripeAppearance: n } = tV(),
          i = (() => {
            let e = tv(),
              t = "en";
            try {
              t = e.__internal_getOption("localization")?.locale || "en";
            } catch {}
            return t.split("-")[0];
          })();
        return t && r
          ? N.default.createElement(
              tI,
              {
                key: r,
                stripe: t,
                options: {
                  loader: "never",
                  clientSecret: r,
                  appearance: { variables: n },
                  locale: i,
                },
              },
              N.default.createElement(tH, null, e.children),
            )
          : N.default.createElement(tQ, null, e.children);
      },
      tX = () => {
        throw Error(
          "Clerk: Unable to submit, Stripe libraries are not yet loaded. Be sure to check `isFormReady` before calling `submit`.",
        );
      };
    e.s(
      [
        "ClerkInstanceContext",
        0,
        e6,
        "ClientContext",
        0,
        e9,
        "OrganizationProvider",
        0,
        tl,
        "SessionContext",
        0,
        tt,
        "UserContext",
        0,
        e5,
        "__experimental_CheckoutProvider",
        0,
        ts,
        "__experimental_PaymentElement",
        0,
        ({ fallback: e }) => {
          const {
              setIsPaymentElementReady: t,
              paymentMethodOrder: r,
              checkout: n,
              stripe: i,
              externalClientSecret: s,
              paymentDescription: o,
              for: a,
            } = tV(),
            l = tv().__unstable__environment,
            u = (0, N.useMemo)(() => {
              if (n && n.totals && n.plan)
                return {
                  recurringPaymentRequest: {
                    paymentDescription: o || "",
                    managementURL:
                      "organization" === a
                        ? l?.displayConfig.organizationProfileUrl || ""
                        : l?.displayConfig.userProfileUrl || "",
                    regularBilling: {
                      amount: n.totals.totalDueNow?.amount || n.totals.grandTotal.amount,
                      label: n.plan.name,
                      recurringPaymentIntervalUnit: "annual" === n.planPeriod ? "year" : "month",
                    },
                  },
                };
            }, [n, o, a, l]),
            d = (0, N.useMemo)(
              () => ({
                layout: { type: "tabs", defaultCollapsed: !1 },
                paymentMethodOrder: r,
                applePay: u,
              }),
              [u, r],
            ),
            c = (0, N.useCallback)(() => {
              t(!0);
            }, [t]);
          return i && s
            ? N.default.createElement(t$, { fallback: e, onReady: c, options: d })
            : N.default.createElement(N.default.Fragment, null, e);
        },
        "__experimental_PaymentElementProvider",
        0,
        ({ children: e, ...t }) =>
          N.default.createElement(tY, t, N.default.createElement(tZ, null, e)),
        "__experimental_useCheckout",
        0,
        (e) => {
          const t = ti(),
            { for: r, planId: n, planPeriod: i } = e || t,
            s = tv(),
            { organization: o } = ta(),
            { isLoaded: a, user: l } = tC();
          if (!a)
            throw Error(
              "Clerk: Ensure that `useCheckout` is inside a component wrapped with `<ClerkLoaded />`.",
            );
          if (!l)
            throw Error(
              "Clerk: Ensure that `useCheckout` is inside a component wrapped with `<SignedIn />`.",
            );
          if ("organization" === r && !o)
            throw Error(
              "Clerk: Ensure your flow checks for an active organization. Retrieve `orgId` from `useAuth()` and confirm it is defined. For SSR, see: https://clerk.com/docs/reference/backend/types/auth-object#how-to-access-the-auth-object",
            );
          const u = (0, N.useMemo)(
              () => s.__experimental_checkout({ planId: n, planPeriod: i, for: r }),
              [l.id, o?.id, n, i, r],
            ),
            d = (0, N.useSyncExternalStore)(
              (e) => u.subscribe(e),
              () => u.getState(),
              () => u.getState(),
            );
          return {
            checkout: {
              ...(0, N.useMemo)(() => {
                if (!d.checkout)
                  return {
                    id: null,
                    externalClientSecret: null,
                    externalGatewayId: null,
                    totals: null,
                    isImmediatePlanChange: null,
                    planPeriod: null,
                    plan: null,
                    paymentMethod: null,
                    freeTrialEndsAt: null,
                    payer: null,
                    needsPaymentMethod: null,
                    planPeriodStart: null,
                  };
                const { reload: e, confirm: t, pathRoot: r, ...n } = d.checkout;
                return n;
              }, [d.checkout]),
              getState: u.getState,
              start: u.start,
              confirm: u.confirm,
              clear: u.clear,
              finalize: u.finalize,
              isStarting: d.isStarting,
              isConfirming: d.isConfirming,
              error: d.error,
              status: d.status,
              fetchStatus: d.fetchStatus,
            },
          };
        },
        "__experimental_usePaymentElement",
        0,
        () => {
          const { isPaymentElementReady: e, initializePaymentMethod: t } = tV(),
            { stripe: r, elements: n } = tJ(),
            { externalClientSecret: i } = tV(),
            s = (0, N.useCallback)(async () => {
              if (!r || !n) return tX();
              const { setupIntent: e, error: t } = await r.confirmSetup({
                elements: n,
                confirmParams: { return_url: window.location.href },
                redirect: "if_required",
              });
              return t
                ? {
                    data: null,
                    error: {
                      gateway: "stripe",
                      error: { code: t.code, message: t.message, type: t.type },
                    },
                  }
                : { data: { gateway: "stripe", paymentToken: e.payment_method }, error: null };
            }, [r, n]),
            o = (0, N.useCallback)(async () => {
              if (!r || !n) return tX();
              await t();
            }, [r, n, t]),
            a = !!(r && i);
          return a
            ? {
                submit: s,
                reset: o,
                isFormReady: e,
                provider: { name: "stripe" },
                isProviderReady: a,
              }
            : { submit: tX, reset: tX, isFormReady: !1, provider: void 0, isProviderReady: !1 };
        },
        "createContextAndHook",
        0,
        e8,
        "isDeeplyEqual",
        0,
        tE,
        "useAssertWrappedByClerkProvider",
        0,
        tu,
        "useClerk",
        0,
        tv,
        "useClerkInstanceContext",
        0,
        e2,
        "useClientContext",
        0,
        te,
        "useOrganization",
        0,
        (e) => {
          var t, r;
          const { domains: n, membershipRequests: i, memberships: s, invitations: o } = e || {};
          tu("useOrganization"), ty("useOrganization");
          const { organization: a } = ta(),
            l = tr(),
            u = th(n, {
              initialPage: 1,
              pageSize: 10,
              keepPreviousData: !1,
              infinite: !1,
              enrollmentMode: void 0,
            }),
            d = th(i, {
              initialPage: 1,
              pageSize: 10,
              status: "pending",
              keepPreviousData: !1,
              infinite: !1,
            }),
            c = th(s, {
              initialPage: 1,
              pageSize: 10,
              role: void 0,
              keepPreviousData: !1,
              infinite: !1,
              query: void 0,
            }),
            h = th(o, {
              initialPage: 1,
              pageSize: 10,
              status: ["pending"],
              keepPreviousData: !1,
              infinite: !1,
            }),
            p = e2();
          p.telemetry?.record(F("useOrganization"));
          const f =
              void 0 === n
                ? void 0
                : {
                    initialPage: u.initialPage,
                    pageSize: u.pageSize,
                    enrollmentMode: u.enrollmentMode,
                  },
            g =
              void 0 === i
                ? void 0
                : { initialPage: d.initialPage, pageSize: d.pageSize, status: d.status },
            m =
              void 0 === s
                ? void 0
                : {
                    initialPage: c.initialPage,
                    pageSize: c.pageSize,
                    role: c.role,
                    query: c.query,
                  },
            v =
              void 0 === o
                ? void 0
                : { initialPage: h.initialPage, pageSize: h.pageSize, status: h.status },
            y = tm({
              fetcher: a?.getDomains,
              config: {
                keepPreviousData: u.keepPreviousData,
                infinite: u.infinite,
                enabled: !!f,
                isSignedIn: !!a,
                initialPage: u.initialPage,
                pageSize: u.pageSize,
              },
              keys: td({
                stablePrefix: "domains",
                authenticated: !!a,
                tracked: { organizationId: a?.id },
                untracked: { args: f },
              }),
            }),
            k = tm({
              fetcher: a?.getMembershipRequests,
              config: {
                keepPreviousData: d.keepPreviousData,
                infinite: d.infinite,
                enabled: !!g,
                isSignedIn: !!a,
                initialPage: d.initialPage,
                pageSize: d.pageSize,
              },
              keys: td({
                stablePrefix: "membershipRequests",
                authenticated: !!a,
                tracked: { organizationId: a?.id },
                untracked: { args: g },
              }),
            }),
            b = tm({
              fetcher: a?.getMemberships,
              config: {
                keepPreviousData: c.keepPreviousData,
                infinite: c.infinite,
                enabled: !!m,
                isSignedIn: !!a,
                initialPage: c.initialPage,
                pageSize: c.pageSize,
              },
              keys: td({
                stablePrefix: "memberships",
                authenticated: !!a,
                tracked: { organizationId: a?.id },
                untracked: { args: m },
              }),
            }),
            _ = tm({
              fetcher: a?.getInvitations,
              config: {
                keepPreviousData: h.keepPreviousData,
                infinite: h.infinite,
                enabled: !!v,
                isSignedIn: !!a,
                initialPage: h.initialPage,
                pageSize: h.pageSize,
              },
              keys: td({
                stablePrefix: "invitations",
                authenticated: !!a,
                tracked: { organizationId: a?.id },
                untracked: { args: v },
              }),
            });
          return void 0 === a
            ? {
                isLoaded: !1,
                organization: void 0,
                membership: void 0,
                domains: tk,
                membershipRequests: tk,
                memberships: tk,
                invitations: tk,
              }
            : null === a
              ? {
                  isLoaded: !0,
                  organization: null,
                  membership: null,
                  domains: null,
                  membershipRequests: null,
                  memberships: null,
                  invitations: null,
                }
              : !p.loaded && a
                ? {
                    isLoaded: !0,
                    organization: a,
                    membership: void 0,
                    domains: tk,
                    membershipRequests: tk,
                    memberships: tk,
                    invitations: tk,
                  }
                : {
                    isLoaded: p.loaded,
                    organization: a,
                    membership:
                      ((t = l.user.organizationMemberships),
                      (r = a.id),
                      t.find((e) => e.organization.id === r)),
                    domains: y,
                    membershipRequests: k,
                    memberships: b,
                    invitations: _,
                  };
        },
        "useOrganizationCreationDefaults",
        0,
        (e = {}) => {
          const { keepPreviousData: t = !0, enabled: r = !0 } = e,
            n = e2(),
            i = e7(),
            s =
              n.__unstable__environment?.organizationSettings?.organizationCreationDefaults
                ?.enabled ?? !1;
          n.telemetry?.record(F("useOrganizationCreationDefaults"));
          const { queryKey: o } = ((e) => {
              const { userId: t } = e;
              return (0, N.useMemo)(
                () =>
                  td({
                    stablePrefix: "organizationCreationDefaults",
                    authenticated: !!t,
                    tracked: { userId: t ?? null },
                    untracked: { args: {} },
                  }),
                [t],
              );
            })({ userId: i?.id ?? null }),
            a = eW(
              i && r && s && n.loaded ? o : null,
              () => {
                if (!i) throw Error("User is required to fetch organization creation defaults");
                return i.getOrganizationCreationDefaults();
              },
              { dedupingInterval: 6e4, keepPreviousData: t },
            );
          return {
            data: a.data,
            error: a.error ?? null,
            isLoading: a.isLoading,
            isFetching: a.isValidating,
          };
        },
        "useOrganizationList",
        0,
        (e) => {
          const { userMemberships: t, userInvitations: r, userSuggestions: n } = e || {};
          tu("useOrganizationList"), ty("useOrganizationList");
          const i = th(t, { initialPage: 1, pageSize: 10, keepPreviousData: !1, infinite: !1 }),
            s = th(r, {
              initialPage: 1,
              pageSize: 10,
              status: "pending",
              keepPreviousData: !1,
              infinite: !1,
            }),
            o = th(n, {
              initialPage: 1,
              pageSize: 10,
              status: "pending",
              keepPreviousData: !1,
              infinite: !1,
            }),
            a = e2(),
            l = e7();
          a.telemetry?.record(F("useOrganizationList"));
          const u = void 0 === t ? void 0 : { initialPage: i.initialPage, pageSize: i.pageSize },
            d =
              void 0 === r
                ? void 0
                : { initialPage: s.initialPage, pageSize: s.pageSize, status: s.status },
            c =
              void 0 === n
                ? void 0
                : { initialPage: o.initialPage, pageSize: o.pageSize, status: o.status },
            h = !!(a.loaded && l),
            p = tm({
              fetcher: l?.getOrganizationMemberships,
              config: {
                keepPreviousData: i.keepPreviousData,
                infinite: i.infinite,
                enabled: !!u,
                isSignedIn: !!l,
                initialPage: i.initialPage,
                pageSize: i.pageSize,
              },
              keys: td({
                stablePrefix: "userMemberships",
                authenticated: !!l,
                tracked: { userId: l?.id },
                untracked: { args: u },
              }),
            }),
            f = tm({
              fetcher: l?.getOrganizationInvitations,
              config: {
                keepPreviousData: s.keepPreviousData,
                infinite: s.infinite,
                enabled: !!d,
                isSignedIn: !!l,
                initialPage: s.initialPage,
                pageSize: s.pageSize,
              },
              keys: td({
                stablePrefix: "userInvitations",
                authenticated: !!l,
                tracked: { userId: l?.id },
                untracked: { args: d },
              }),
            }),
            g = tm({
              fetcher: l?.getOrganizationSuggestions,
              config: {
                keepPreviousData: o.keepPreviousData,
                infinite: o.infinite,
                enabled: !!c,
                isSignedIn: !!l,
                initialPage: o.initialPage,
                pageSize: o.pageSize,
              },
              keys: td({
                stablePrefix: "userSuggestions",
                authenticated: !!l,
                tracked: { userId: l?.id },
                untracked: { args: c },
              }),
            });
          return h
            ? {
                isLoaded: h,
                setActive: a.setActive,
                createOrganization: a.createOrganization,
                userMemberships: p,
                userInvitations: f,
                userSuggestions: g,
              }
            : {
                isLoaded: !1,
                createOrganization: void 0,
                setActive: void 0,
                userMemberships: tb,
                userInvitations: tb,
                userSuggestions: tb,
              };
        },
        "useReverification",
        0,
        (e, t) => {
          const { __internal_openReverification: r, telemetry: n } = tv(),
            i = (0, N.useRef)(e),
            s = (0, N.useRef)(t);
          return (
            n?.record(
              F("useReverification", { onNeedsReverification: !!t?.onNeedsReverification }),
            ),
            t_(() => {
              (i.current = e), (s.current = t);
            }),
            (0, N.useCallback)(
              (...e) => {
                var t;
                return ((t = { openUIComponent: r, telemetry: n, ...s.current }),
                (e) =>
                  async (...r) => {
                    let n,
                      i = await tO(e(...r));
                    if (
                      (n = i) &&
                      "object" == typeof n &&
                      "clerk_error" in n &&
                      n.clerk_error?.type === "forbidden" &&
                      n.clerk_error?.reason === W
                    ) {
                      let n,
                        s,
                        o =
                          ((n = D),
                          (s = D),
                          {
                            promise: new Promise((e, t) => {
                              (n = e), (s = t);
                            }),
                            resolve: n,
                            reject: s,
                          }),
                        a = M(i.clerk_error.metadata?.reverification),
                        l = a ? a().level : void 0,
                        u = () => {
                          o.reject(
                            new w("User cancelled attempted verification", {
                              code: "reverification_cancelled",
                            }),
                          );
                        },
                        d = () => {
                          o.resolve(!0);
                        };
                      void 0 === t.onNeedsReverification
                        ? t.openUIComponent?.({
                            level: l,
                            afterVerification: d,
                            afterVerificationCancelled: u,
                          })
                        : t.onNeedsReverification({ cancel: u, complete: d, level: l }),
                        await o.promise,
                        (i = await tO(e(...r)));
                    }
                    return i;
                  })(i.current)(...e);
              },
              [r, n],
            )
          );
        },
        "useSession",
        0,
        () => {
          tu(tS);
          const e = tr(),
            t = e2();
          return (t.telemetry?.record(F(tS)), void 0 === e)
            ? { isLoaded: !1, isSignedIn: void 0, session: void 0 }
            : null === e
              ? { isLoaded: !0, isSignedIn: !1, session: null }
              : { isLoaded: !0, isSignedIn: t.isSignedIn, session: e };
        },
        "useSessionContext",
        0,
        tr,
        "useSessionList",
        0,
        () => {
          tu(tP);
          const e = e2(),
            t = te();
          return (e2().telemetry?.record(F(tP)), t)
            ? { isLoaded: !0, sessions: t.sessions, setActive: e.setActive }
            : { isLoaded: !1, sessions: void 0, setActive: void 0 };
        },
        "useUser",
        0,
        tC,
      ],
      8024,
    );
    var t0 = P({ packageName: "@clerk/clerk-react" });
    function t1(e) {
      t0.setMessages(e).setPackageName(e);
    }
    var [t3, t8] = e8("AuthContext"),
      t4 =
        "You've added multiple <ClerkProvider> components in your React component tree. Wrap your components in a single <ClerkProvider>.",
      t6 = (e) =>
        `You've passed multiple children components to <${e}/>. You can only pass a single child component or text.`,
      t2 =
        "Unsupported usage of isSatellite, domain or proxyUrl. The usage of isSatellite, domain or proxyUrl as function is not supported in non-browser environments.",
      t5 =
        "<UserProfile.Page /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.",
      t7 =
        "<UserProfile.Link /> component needs to be a direct child of `<UserProfile />` or `<UserButton />`.",
      t9 =
        "<OrganizationProfile.Page /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.",
      re =
        "<OrganizationProfile.Link /> component needs to be a direct child of `<OrganizationProfile />` or `<OrganizationSwitcher />`.",
      rt = (e) =>
        `<${e} /> can only accept <${e}.Page /> and <${e}.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.`,
      rr = (e) =>
        `Missing props. <${e}.Page /> component requires the following props: url, label, labelIcon, alongside with children to be rendered inside the page.`,
      rn = (e) =>
        `Missing props. <${e}.Link /> component requires the following props: url, label and labelIcon.`,
      ri =
        "<UserButton /> can only accept <UserButton.UserProfilePage />, <UserButton.UserProfileLink /> and <UserButton.MenuItems /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.",
      rs =
        "<UserButton.MenuItems /> component can only accept <UserButton.Action /> and <UserButton.Link /> as its children. Any other provided component will be ignored. Additionally, please ensure that the component is rendered in a client component.",
      ro = "<UserButton.MenuItems /> component needs to be a direct child of `<UserButton />`.",
      ra =
        "<UserButton.Action /> component needs to be a direct child of `<UserButton.MenuItems />`.",
      rl =
        "<UserButton.Link /> component needs to be a direct child of `<UserButton.MenuItems />`.",
      ru =
        "Missing props. <UserButton.Link /> component requires the following props: href, label and labelIcon.",
      rd = "Missing props. <UserButton.Action /> component requires the following props: label.",
      rc = (e) => {
        tu(() => {
          t0.throwMissingClerkProviderError({ source: e });
        });
      },
      rh = (e) =>
        new Promise((t) => {
          const r = (n) => {
            ["ready", "degraded"].includes(n) && (t(), e.off("status", r));
          };
          e.on("status", r, { notify: !0 });
        }),
      rp = (e, t) => {
        const r =
          ("string" == typeof t ? t : null == t ? void 0 : t.component) ||
          e.displayName ||
          e.name ||
          "Component";
        e.displayName = r;
        const n = "string" == typeof t ? void 0 : t,
          i = (t) => {
            rc(r || "withClerk");
            const i = e2();
            return i.loaded || (null == n ? void 0 : n.renderWhileLoading)
              ? N.default.createElement(e, { ...t, component: r, clerk: i })
              : null;
          };
        return (i.displayName = `withClerk(${r})`), i;
      };
    e.s(
      [
        "AuthContext",
        0,
        t3,
        "IsomorphicClerkContext",
        0,
        e6,
        "customLinkWrongProps",
        0,
        rn,
        "customMenuItemsIgnoredComponent",
        0,
        rs,
        "customPageWrongProps",
        0,
        rr,
        "customPagesIgnoredComponent",
        0,
        rt,
        "errorThrower",
        0,
        t0,
        "multipleChildrenInButtonComponent",
        0,
        t6,
        "multipleClerkProvidersError",
        0,
        t4,
        "organizationProfileLinkRenderedError",
        0,
        re,
        "organizationProfilePageRenderedError",
        0,
        t9,
        "setErrorThrowerOptions",
        0,
        t1,
        "unsupportedNonBrowserDomainOrProxyUrlFunction",
        0,
        t2,
        "useAssertWrappedByClerkProvider",
        0,
        rc,
        "useAuth",
        0,
        (e = {}) => {
          var t;
          rc("useAuth");
          let { treatPendingAsSignedOut: r, ...n } = null != e ? e : {},
            i = t8();
          void 0 === i.sessionId && void 0 === i.userId && (i = null != n ? n : {});
          const s = e2(),
            o = (0, N.useCallback)(
              async (e) => ((await rh(s), s.session) ? s.session.getToken(e) : null),
              [s],
            ),
            a = (0, N.useCallback)(async (...e) => (await rh(s), s.signOut(...e)), [s]);
          return (
            null == (t = s.telemetry) || t.record(F("useAuth", { treatPendingAsSignedOut: r })),
            ((e, { treatPendingAsSignedOut: t = !0 } = {}) => {
              const {
                  userId: r,
                  orgId: n,
                  orgRole: i,
                  has: s,
                  signOut: o,
                  getToken: a,
                  orgPermissions: l,
                  factorVerificationAge: u,
                  sessionClaims: d,
                } = null != e ? e : {},
                c = (0, N.useCallback)(
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
                                ? j(r, e.feature)
                                : e.plan && n
                                  ? j(n, e.plan)
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
                              const r = M(e.reverification);
                              if (!r) return null;
                              const { level: n, afterMinutes: i } = r(),
                                [s, o] = t,
                                a = -1 !== s ? i > s : null,
                                l = -1 !== o ? i > o : null;
                              switch (n) {
                                case "first_factor":
                                  return a;
                                case "second_factor":
                                  return -1 !== o ? l : a;
                                case "multi_factor":
                                  return -1 === o ? a : a && l;
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
                    orgSlug: o,
                    signOut: a,
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
                        signOut: a,
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
                          signOut: a,
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
                            signOut: a,
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
                              orgSlug: o || null,
                              has: u,
                              signOut: a,
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
                                signOut: a,
                                getToken: l,
                              }
                            : void 0)({
                  authObject: { ...e, getToken: a, signOut: o, has: c },
                  options: { treatPendingAsSignedOut: t },
                });
              return (
                h ||
                t0.throw(
                  "Invalid state. Feel free to submit a bug or reach out to support here: https://clerk.com/support",
                )
              );
            })({ ...i, getToken: o, signOut: a }, { treatPendingAsSignedOut: r })
          );
        },
        "useEmailLink",
        0,
        (e) => {
          const { startEmailLinkFlow: t, cancelEmailLinkFlow: r } = N.default.useMemo(
            () => e.createEmailLinkFlow(),
            [e],
          );
          return (
            N.default.useEffect(() => r, []), { startEmailLinkFlow: t, cancelEmailLinkFlow: r }
          );
        },
        "useIsomorphicClerkContext",
        0,
        e2,
        "useSignIn",
        0,
        () => {
          var e;
          rc("useSignIn");
          const t = e2(),
            r = te();
          return (null == (e = t.telemetry) || e.record(F("useSignIn")), r)
            ? { isLoaded: !0, signIn: r.signIn, setActive: t.setActive }
            : { isLoaded: !1, signIn: void 0, setActive: void 0 };
        },
        "useSignUp",
        0,
        () => {
          var e;
          rc("useSignUp");
          const t = e2(),
            r = te();
          return (null == (e = t.telemetry) || e.record(F("useSignUp")), r)
            ? { isLoaded: !0, signUp: r.signUp, setActive: t.setActive }
            : { isLoaded: !1, signUp: void 0, setActive: void 0 };
        },
        "userButtonIgnoredComponent",
        0,
        ri,
        "userButtonMenuActionRenderedError",
        0,
        ra,
        "userButtonMenuItemLinkWrongProps",
        0,
        ru,
        "userButtonMenuItemsActionWrongsProps",
        0,
        rd,
        "userButtonMenuItemsRenderedError",
        0,
        ro,
        "userButtonMenuLinkRenderedError",
        0,
        rl,
        "userProfileLinkRenderedError",
        0,
        t7,
        "userProfilePageRenderedError",
        0,
        t5,
        "withClerk",
        0,
        rp,
      ],
      40020,
    );
    const rf = new Set(),
      rg = (e, t, r) => {
        const n = (() => {
            try {
              return !0;
            } catch {}
            return !1;
          })(),
          i = r ?? e;
        rf.has(i) ||
          n ||
          (rf.add(i),
          console.warn(`Clerk - DEPRECATION WARNING: "${e}" is deprecated and will be removed in the next major release.
${t}`));
      };
    rp(({ clerk: e, ...t }) => {
      const { client: r, session: n } = e,
        i = r.signedInSessions
          ? r.signedInSessions.length > 0
          : r.activeSessions && r.activeSessions.length > 0;
      return (
        N.default.useEffect(() => {
          null === n && i ? e.redirectToAfterSignOut() : e.redirectToSignIn(t);
        }, []),
        null
      );
    }, "RedirectToSignIn"),
      rp(
        ({ clerk: e, ...t }) => (
          N.default.useEffect(() => {
            e.redirectToSignUp(t);
          }, []),
          null
        ),
        "RedirectToSignUp",
      ),
      rp(
        ({ clerk: e, ...t }) => (
          N.default.useEffect(() => {
            e.redirectToTasks(t);
          }, []),
          null
        ),
        "RedirectToTasks",
      ),
      rp(
        ({ clerk: e }) => (
          N.default.useEffect(() => {
            rg("RedirectToUserProfile", "Use the `redirectToUserProfile()` method instead."),
              e.redirectToUserProfile();
          }, []),
          null
        ),
        "RedirectToUserProfile",
      ),
      rp(
        ({ clerk: e }) => (
          N.default.useEffect(() => {
            rg(
              "RedirectToOrganizationProfile",
              "Use the `redirectToOrganizationProfile()` method instead.",
            ),
              e.redirectToOrganizationProfile();
          }, []),
          null
        ),
        "RedirectToOrganizationProfile",
      ),
      rp(
        ({ clerk: e }) => (
          N.default.useEffect(() => {
            rg(
              "RedirectToCreateOrganization",
              "Use the `redirectToCreateOrganization()` method instead.",
            ),
              e.redirectToCreateOrganization();
          }, []),
          null
        ),
        "RedirectToCreateOrganization",
      ),
      rp(
        ({ clerk: e, ...t }) => (
          N.default.useEffect(() => {
            e.handleRedirectCallback(t);
          }, []),
          null
        ),
        "AuthenticateWithRedirectCallback",
      );
    const rm = (e) => {};
    var rv = N,
      ry = e.i(36788);
    const rk = (e, ...t) => {
      const r = { ...e };
      for (const e of t) delete r[e];
      return r;
    };
    var rb = (e) => (t) => {
        try {
          return rv.default.Children.only(e);
        } catch {
          return t0.throw(t6(t));
        }
      },
      r_ = (e, t) => (
        e || (e = t), "string" == typeof e && (e = rv.default.createElement("button", null, e)), e
      ),
      rS =
        (e) =>
        (...t) => {
          if (e && "function" == typeof e) return e(...t);
        };
    function rP(e) {
      return "function" == typeof e;
    }
    var rw = new Map();
    function rC(e, t, r) {
      const n = e.displayName || e.name || t || "Component",
        i = (n) => (
          !((e, t, r = 1) => {
            rv.default.useEffect(() => {
              const n = rw.get(e) || 0;
              return n == r
                ? t0.throw(t)
                : (rw.set(e, n + 1),
                  () => {
                    rw.set(e, (rw.get(e) || 1) - 1);
                  });
            }, []);
          })(t, r),
          rv.default.createElement(e, { ...n })
        );
      return (i.displayName = `withMaxAllowedInstancesGuard(${n})`), i;
    }
    var rE = (e) => {
        const [t, r] = (0, rv.useState)(new Map());
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
            return r ? (0, ry.createPortal)(e.component, r) : null;
          },
        }));
      },
      rO = (e, t) => !!e && rv.default.isValidElement(e) && (null == e ? void 0 : e.type) === t,
      rj = (e, t) =>
        rT(
          {
            children: e,
            reorderItemsLabels: ["account", "security", "billing", "apiKeys"],
            LinkComponent: rV,
            PageComponent: rq,
            MenuItemsComponent: rH,
            componentName: "UserProfile",
          },
          t,
        ),
      rU = (e, t) =>
        rT(
          {
            children: e,
            reorderItemsLabels: ["general", "members", "billing", "apiKeys"],
            LinkComponent: r0,
            PageComponent: rX,
            componentName: "OrganizationProfile",
          },
          t,
        ),
      rM = (e) => {
        const t = [],
          r = [r0, rX, rH, rq, rV];
        return (
          rv.default.Children.forEach(e, (e) => {
            r.some((t) => rO(e, t)) || t.push(e);
          }),
          t
        );
      },
      rT = (e, t) => {
        const {
            children: r,
            LinkComponent: n,
            PageComponent: i,
            MenuItemsComponent: s,
            reorderItemsLabels: o,
            componentName: a,
          } = e,
          { allowForAnyChildren: l = !1 } = t || {},
          u = [];
        rv.default.Children.forEach(r, (e) => {
          if (!rO(e, i) && !rO(e, n) && !rO(e, s)) {
            e && !l && rm(rt(a));
            return;
          }
          const { props: t } = e,
            { children: r, label: d, url: c, labelIcon: h } = t;
          if (rO(e, i))
            if (rz(t, o)) u.push({ label: d });
            else {
              if (!rI(t)) return void rm(rr(a));
              u.push({ label: d, labelIcon: h, children: r, url: c });
            }
          if (rO(e, n))
            if (!rA(t)) return void rm(rn(a));
            else u.push({ label: d, labelIcon: h, url: c });
        });
        const d = [],
          c = [],
          h = [];
        u.forEach((e, t) => {
          if (rI(e)) {
            d.push({ component: e.children, id: t }), c.push({ component: e.labelIcon, id: t });
            return;
          }
          rA(e) && h.push({ component: e.labelIcon, id: t });
        });
        const p = rE(d),
          f = rE(c),
          g = rE(h),
          m = [],
          v = [];
        return (
          u.forEach((e, t) => {
            if (rz(e, o)) return void m.push({ label: e.label });
            if (rI(e)) {
              const { portal: r, mount: n, unmount: i } = p.find((e) => e.id === t),
                { portal: s, mount: o, unmount: a } = f.find((e) => e.id === t);
              m.push({
                label: e.label,
                url: e.url,
                mount: n,
                unmount: i,
                mountIcon: o,
                unmountIcon: a,
              }),
                v.push(r),
                v.push(s);
              return;
            }
            if (rA(e)) {
              const { portal: r, mount: n, unmount: i } = g.find((e) => e.id === t);
              m.push({ label: e.label, url: e.url, mountIcon: n, unmountIcon: i }), v.push(r);
              return;
            }
          }),
          { customPages: m, customPagesPortals: v }
        );
      },
      rz = (e, t) => {
        const { children: r, label: n, url: i, labelIcon: s } = e;
        return !r && !i && !s && t.some((e) => e === n);
      },
      rI = (e) => {
        const { children: t, label: r, url: n, labelIcon: i } = e;
        return !!t && !!n && !!i && !!r;
      },
      rA = (e) => {
        const { children: t, label: r, url: n, labelIcon: i } = e;
        return !t && !!n && !!i && !!r;
      },
      rR = (e, t) => {
        const { children: r, label: n, onClick: i, labelIcon: s } = e;
        return !r && !i && !s && t.some((e) => e === n);
      },
      rL = (e) => {
        const { label: t, labelIcon: r, onClick: n, open: i } = e;
        return !!r && !!t && ("function" == typeof n || "string" == typeof i);
      },
      rx = (e) => {
        const { label: t, href: r, labelIcon: n } = e;
        return !!r && !!n && !!t;
      },
      rF =
        ((i = (u = {
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
              timeout: o = 0,
            } = e;
            if (!n) return void r(Error("No root element provided"));
            let a = n;
            if ((s && (a = null == n ? void 0 : n.querySelector(s)), i(a, s))) return void t();
            const l = new MutationObserver((e) => {
              for (const r of e)
                if (
                  (!a && s && (a = null == n ? void 0 : n.querySelector(s)),
                  ((u.childList && "childList" === r.type) ||
                    (u.attributes && "attributes" === r.type)) &&
                    i(a, s))
                ) {
                  l.disconnect(), t();
                  return;
                }
            });
            l.observe(n, u),
              o > 0 &&
                setTimeout(() => {
                  l.disconnect(), r(Error(`Timeout waiting for ${s}`));
                }, o);
          }));
    function rN(e, t) {
      const r = (0, rv.useRef)(),
        [n, i] = (0, rv.useState)("rendering");
      return (
        (0, rv.useEffect)(() => {
          if (!e) throw Error("Clerk: no component name provided, unable to detect mount.");
          if ("u" > typeof window && !r.current) {
            const n = `[data-clerk-component="${e}"]`,
              s = null == t ? void 0 : t.selector;
            r.current = rF({ selector: s ? n + s : n })
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
    var rW = (e) => (null == e ? void 0 : e.map(({ mountIcon: e, unmountIcon: t, ...r }) => r)),
      rD = class extends rv.default.PureComponent {
        constructor() {
          super(...arguments), (this.rootRef = rv.default.createRef());
        }
        componentDidUpdate(e) {
          var t, r, n, i;
          if (!("mount" in e) || !("mount" in this.props)) return;
          const s = rk(e.props, "customPages", "customMenuItems", "children"),
            o = rk(this.props.props, "customPages", "customMenuItems", "children"),
            a =
              (null == (t = s.customPages) ? void 0 : t.length) !==
              (null == (r = o.customPages) ? void 0 : r.length),
            l =
              (null == (n = s.customMenuItems) ? void 0 : n.length) !==
              (null == (i = o.customMenuItems) ? void 0 : i.length),
            u = rW(e.props.customMenuItems),
            d = rW(this.props.props.customMenuItems);
          (!tE(s, o) || !tE(u, d) || a || l) &&
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
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            !e && rv.default.createElement("div", { ...t }),
            this.props.children,
          );
        }
      },
      rB = (e) => {
        var t, r;
        return rv.default.createElement(
          rv.default.Fragment,
          null,
          null == (t = null == e ? void 0 : e.customPagesPortals)
            ? void 0
            : t.map((e, t) => (0, rv.createElement)(e, { key: t })),
          null == (r = null == e ? void 0 : e.customMenuItemsPortals)
            ? void 0
            : r.map((e, t) => (0, rv.createElement)(e, { key: t })),
        );
      },
      rK = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      ),
      r$ = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      );
    function rq({ children: e }) {
      return rm(t5), rv.default.createElement(rv.default.Fragment, null, e);
    }
    function rV({ children: e }) {
      return rm(t7), rv.default.createElement(rv.default.Fragment, null, e);
    }
    var rG = Object.assign(
        rp(
          ({ clerk: e, component: t, fallback: r, ...n }) => {
            const i = "rendering" === rN(t) || !e.loaded,
              s = { ...(i && r && { style: { display: "none" } }) },
              { customPages: o, customPagesPortals: a } = rj(n.children);
            return rv.default.createElement(
              rv.default.Fragment,
              null,
              i && r,
              rv.default.createElement(
                rD,
                {
                  component: t,
                  mount: e.mountUserProfile,
                  unmount: e.unmountUserProfile,
                  updateProps: e.__unstable__updateProps,
                  props: { ...n, customPages: o },
                  rootProps: s,
                },
                rv.default.createElement(rB, { customPagesPortals: a }),
              ),
            );
          },
          { component: "UserProfile", renderWhileLoading: !0 },
        ),
        { Page: rq, Link: rV },
      ),
      rJ = (0, rv.createContext)({ mount: () => {}, unmount: () => {}, updateProps: () => {} });
    function rH({ children: e }) {
      return rm(ro), rv.default.createElement(rv.default.Fragment, null, e);
    }
    function rQ({ children: e }) {
      return rm(ra), rv.default.createElement(rv.default.Fragment, null, e);
    }
    function rY({ children: e }) {
      return rm(rl), rv.default.createElement(rv.default.Fragment, null, e);
    }
    var rZ = Object.assign(
      rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          var i;
          const s = "rendering" === rN(t) || !e.loaded,
            o = { ...(s && r && { style: { display: "none" } }) },
            { customPages: a, customPagesPortals: l } = rj(n.children, {
              allowForAnyChildren: !!n.__experimental_asProvider,
            }),
            u = { ...n.userProfileProps, customPages: a },
            { customMenuItems: d, customMenuItemsPortals: c } = (({
              children: e,
              MenuItemsComponent: t,
              MenuActionComponent: r,
              MenuLinkComponent: n,
              UserProfileLinkComponent: i,
              UserProfilePageComponent: s,
              reorderItemsLabels: o,
              allowForAnyChildren: a = !1,
            }) => {
              const l = [],
                u = [],
                d = [];
              rv.default.Children.forEach(e, (e) => {
                if (!rO(e, t) && !rO(e, i) && !rO(e, s)) {
                  e && !a && rm(ri);
                  return;
                }
                if (rO(e, i) || rO(e, s)) return;
                const { props: u } = e;
                rv.default.Children.forEach(u.children, (e) => {
                  if (!rO(e, r) && !rO(e, n)) {
                    e && rm(rs);
                    return;
                  }
                  const { props: t } = e,
                    { label: i, labelIcon: s, href: a, onClick: u, open: d } = t;
                  if (rO(e, r))
                    if (rR(t, o)) l.push({ label: i });
                    else {
                      if (!rL(t)) return void rm(rd);
                      const e = { label: i, labelIcon: s };
                      if (void 0 !== u) l.push({ ...e, onClick: u });
                      else {
                        if (void 0 === d)
                          return void rm(
                            "Custom menu item must have either onClick or open property",
                          );
                        l.push({ ...e, open: d.startsWith("/") ? d : `/${d}` });
                      }
                    }
                  if (rO(e, n))
                    if (!rx(t)) return void rm(ru);
                    else l.push({ label: i, labelIcon: s, href: a });
                });
              });
              const c = [],
                h = [];
              l.forEach((e, t) => {
                rL(e) && c.push({ component: e.labelIcon, id: t }),
                  rx(e) && h.push({ component: e.labelIcon, id: t });
              });
              const p = rE(c),
                f = rE(h);
              return (
                l.forEach((e, t) => {
                  if ((rR(e, o) && u.push({ label: e.label }), rL(e))) {
                    const { portal: r, mount: n, unmount: i } = p.find((e) => e.id === t),
                      s = { label: e.label, mountIcon: n, unmountIcon: i };
                    "onClick" in e ? (s.onClick = e.onClick) : "open" in e && (s.open = e.open),
                      u.push(s),
                      d.push(r);
                  }
                  if (rx(e)) {
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
              MenuItemsComponent: rH,
              MenuActionComponent: rQ,
              MenuLinkComponent: rY,
              UserProfileLinkComponent: rV,
              UserProfilePageComponent: rq,
              allowForAnyChildren:
                null !=
                  (i = { allowForAnyChildren: !!n.__experimental_asProvider }
                    .allowForAnyChildren) && i,
            }),
            h = rM(n.children),
            p = {
              mount: e.mountUserButton,
              unmount: e.unmountUserButton,
              updateProps: e.__unstable__updateProps,
              props: { ...n, userProfileProps: u, customMenuItems: d },
            };
          return rv.default.createElement(
            rJ.Provider,
            { value: p },
            s && r,
            e.loaded &&
              rv.default.createElement(
                rD,
                {
                  component: t,
                  ...p,
                  hideRootHtmlElement: !!n.__experimental_asProvider,
                  rootProps: o,
                },
                n.__experimental_asProvider ? h : null,
                rv.default.createElement(rB, { customPagesPortals: l, customMenuItemsPortals: c }),
              ),
          );
        },
        { component: "UserButton", renderWhileLoading: !0 },
      ),
      {
        UserProfilePage: rq,
        UserProfileLink: rV,
        MenuItems: rH,
        Action: rQ,
        Link: rY,
        __experimental_Outlet: (e) => {
          const t = (0, rv.useContext)(rJ),
            r = { ...t, props: { ...t.props, ...e } };
          return rv.default.createElement(rD, { ...r });
        },
      },
    );
    function rX({ children: e }) {
      return rm(t9), rv.default.createElement(rv.default.Fragment, null, e);
    }
    function r0({ children: e }) {
      return rm(re), rv.default.createElement(rv.default.Fragment, null, e);
    }
    var r1 = Object.assign(
        rp(
          ({ clerk: e, component: t, fallback: r, ...n }) => {
            const i = "rendering" === rN(t) || !e.loaded,
              s = { ...(i && r && { style: { display: "none" } }) },
              { customPages: o, customPagesPortals: a } = rU(n.children);
            return rv.default.createElement(
              rv.default.Fragment,
              null,
              i && r,
              e.loaded &&
                rv.default.createElement(
                  rD,
                  {
                    component: t,
                    mount: e.mountOrganizationProfile,
                    unmount: e.unmountOrganizationProfile,
                    updateProps: e.__unstable__updateProps,
                    props: { ...n, customPages: o },
                    rootProps: s,
                  },
                  rv.default.createElement(rB, { customPagesPortals: a }),
                ),
            );
          },
          { component: "OrganizationProfile", renderWhileLoading: !0 },
        ),
        { Page: rX, Link: r0 },
      ),
      r3 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      ),
      r8 = (0, rv.createContext)({ mount: () => {}, unmount: () => {}, updateProps: () => {} }),
      r4 = Object.assign(
        rp(
          ({ clerk: e, component: t, fallback: r, ...n }) => {
            const i = "rendering" === rN(t) || !e.loaded,
              s = { ...(i && r && { style: { display: "none" } }) },
              { customPages: o, customPagesPortals: a } = rU(n.children, {
                allowForAnyChildren: !!n.__experimental_asProvider,
              }),
              l = { ...n.organizationProfileProps, customPages: o },
              u = rM(n.children),
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
              rv.default.createElement(
                r8.Provider,
                { value: d },
                rv.default.createElement(
                  rv.default.Fragment,
                  null,
                  i && r,
                  e.loaded &&
                    rv.default.createElement(
                      rD,
                      { ...d, hideRootHtmlElement: !!n.__experimental_asProvider },
                      n.__experimental_asProvider ? u : null,
                      rv.default.createElement(rB, { customPagesPortals: a }),
                    ),
                ),
              )
            );
          },
          { component: "OrganizationSwitcher", renderWhileLoading: !0 },
        ),
        {
          OrganizationProfilePage: rX,
          OrganizationProfileLink: r0,
          __experimental_Outlet: (e) => {
            const t = (0, rv.useContext)(r8),
              r = { ...t, props: { ...t.props, ...e } };
            return rv.default.createElement(rD, { ...r });
          },
        },
      ),
      r6 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      r2 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      r5 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      r7 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i =
              "rendering" === rN(t, { selector: '[data-component-status="ready"]' }) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      r9 = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      ne = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      nt = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      nr = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
      nn = rp(
        ({ clerk: e, component: t, fallback: r, ...n }) => {
          const i = "rendering" === rN(t) || !e.loaded,
            s = { ...(i && r && { style: { display: "none" } }) };
          return rv.default.createElement(
            rv.default.Fragment,
            null,
            i && r,
            e.loaded &&
              rv.default.createElement(rD, {
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
    e.s(
      [
        "APIKeys",
        0,
        r9,
        "CreateOrganization",
        0,
        r3,
        "GoogleOneTap",
        0,
        r2,
        "OrganizationList",
        0,
        r6,
        "OrganizationProfile",
        0,
        r1,
        "OrganizationSwitcher",
        0,
        r4,
        "PricingTable",
        0,
        r7,
        "SignIn",
        0,
        rK,
        "SignUp",
        0,
        r$,
        "TaskChooseOrganization",
        0,
        nt,
        "TaskResetPassword",
        0,
        nr,
        "TaskSetupMFA",
        0,
        nn,
        "UserAvatar",
        0,
        ne,
        "UserButton",
        0,
        rZ,
        "UserProfile",
        0,
        rG,
        "Waitlist",
        0,
        r5,
        "assertSingleChild",
        0,
        rb,
        "isConstructor",
        0,
        rP,
        "normalizeWithDefaultValue",
        0,
        r_,
        "safeExecute",
        0,
        rS,
        "withMaxAllowedInstancesGuard",
        0,
        rC,
      ],
      65905,
    );
    var ni = (e) => {
        throw TypeError(e);
      },
      ns = (e, t, r) => t.has(e) || ni("Cannot " + r),
      no = (e, t, r) => (ns(e, t, "read from private field"), r ? r.call(e) : t.get(e)),
      na = (e, t, r) =>
        t.has(e)
          ? ni("Cannot add the same private member more than once")
          : t instanceof WeakSet
            ? t.add(e)
            : t.set(e, r),
      nl = (e, t, r, n) => (ns(e, t, "write to private field"), n ? n.call(e, r) : t.set(e, r), r),
      nu = (e, t, r) => (ns(e, t, "access private method"), r);
    const nd = {
        initialDelay: 125,
        maxDelayBetweenRetries: 0,
        factor: 2,
        shouldRetry: (e, t) => t < 5,
        retryImmediately: !1,
        jitter: !0,
      },
      nc = async (e) => new Promise((t) => setTimeout(t, e)),
      nh = (e, t) => (t ? e * (1 + Math.random()) : e),
      np = async (e, t = {}) => {
        var r;
        let n,
          i = 0,
          {
            shouldRetry: s,
            initialDelay: o,
            maxDelayBetweenRetries: a,
            factor: l,
            retryImmediately: u,
            jitter: d,
            onBeforeRetry: c,
          } = { ...nd, ...t },
          h =
            ((r = { initialDelay: o, maxDelayBetweenRetries: a, factor: l, jitter: d }),
            (n = 0),
            async () => {
              let e;
              await nc(
                ((e = nh((e = r.initialDelay * Math.pow(r.factor, n)), r.jitter)),
                Math.min(r.maxDelayBetweenRetries || e, e)),
              ),
                n++;
            });
        for (;;)
          try {
            return await e();
          } catch (e) {
            if (!s(e, ++i)) throw e;
            c && (await c(i)), u && 1 === i ? await nc(nh(100, d)) : await h();
          }
      };
    async function nf(e = "", t) {
      const { async: r, defer: n, beforeLoad: i, crossOrigin: s, nonce: o } = t || {};
      return np(
        () =>
          new Promise((t, a) => {
            e || a(Error("loadScript cannot be called without a src")),
              (document && document.body) ||
                a(Error("loadScript cannot be called when document does not exist"));
            const l = document.createElement("script");
            s && l.setAttribute("crossorigin", s),
              (l.async = r || !1),
              (l.defer = n || !1),
              l.addEventListener("load", () => {
                l.remove(), t(l);
              }),
              l.addEventListener("error", (t) => {
                l.remove(), a(t.error ?? Error(`failed to load script: ${e}`));
              }),
              (l.src = e),
              (l.nonce = o),
              i?.(l),
              document.body.appendChild(l);
          }),
        { shouldRetry: (e, t) => t <= 5 },
      );
    }
    function ng(e) {
      return e.startsWith("/");
    }
    const nm = "failed_to_load_clerk_js",
      nv = "Failed to load Clerk",
      { isDevOrStagingUrl: ny } =
        ((s = new Map()),
        {
          isDevOrStagingUrl: (e) => {
            if (!e) return !1;
            let t = "string" == typeof e ? e : e.hostname,
              r = s.get(t);
            return void 0 === r && ((r = z.some((e) => t.endsWith(e))), s.set(t, r)), r;
          },
        }),
      nk = P({ packageName: "@clerk/shared" });
    function nb() {
      if ("u" < typeof window || !window.Clerk) return !1;
      const e = window.Clerk;
      return "object" == typeof e && "function" == typeof e.load;
    }
    function n_(e, t) {
      return new Promise((r, n) => {
        let i = !1,
          s = (e, t) => {
            clearTimeout(e), clearInterval(t);
          };
        t?.addEventListener("error", () => {
          s(a, l), n(new w(nv, { code: nm }));
        });
        const o = () => {
            !i && nb() && ((i = !0), s(a, l), r(null));
          },
          a = setTimeout(() => {
            i ||
              ((i = !0),
              s(a, l),
              nb() ? r(null) : n(new w(nv, { code: "failed_to_load_clerk_js_timeout" })));
          }, e);
        o();
        const l = setInterval(() => {
          i ? clearInterval(l) : o();
        }, 100);
      });
    }
    const nS = async (e) => {
        const t = e?.scriptLoadTimeout ?? 15e3;
        if (nb()) return null;
        if (!e?.publishableKey) return nk.throwMissingPublishableKeyError(), null;
        const r = nP(e),
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
              return await n_(t, n), null;
            } catch {
              n.remove();
            }
        const i = n_(t);
        return (
          nf(r, { async: !0, crossOrigin: "anonymous", nonce: e.nonce, beforeLoad: nw(e) }).catch(
            (e) => {
              throw new w(nv + (e.message ? `, ${e.message}` : ""), { code: nm, cause: e });
            },
          ),
          i
        );
      },
      nP = (e) => {
        var t;
        const {
          clerkJSUrl: r,
          clerkJSVariant: n,
          clerkJSVersion: i,
          proxyUrl: s,
          domain: o,
          publishableKey: a,
        } = e;
        if (r) return r;
        let l = "";
        if (s && (!s || ((t = s), /^http(s)?:\/\//.test(t || "")) || ng(s)))
          l = (!s ? "" : ng(s) ? new URL(s, window.location.origin).toString() : s).replace(
            /http(s)?:\/\//,
            "",
          );
        else
          l =
            o && !ny(L(a)?.frontendApi || "")
              ? ((e) => {
                  let t;
                  if (!e) return "";
                  if (e.match(/^(clerk\.)+\w*$/)) t = /(clerk\.)*(?=clerk\.)/;
                  else {
                    if (e.match(/\.clerk.accounts/)) return e;
                    t = /^(clerk\.)*/gi;
                  }
                  return `clerk.${e.replace(t, "")}`;
                })(o)
              : L(a)?.frontendApi || "";
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
      nw = (e) => (t) => {
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
    function nC() {
      return "u" > typeof window;
    }
    /bot|spider|crawl|APIs-Google|AdsBot|Googlebot|mediapartners|Google Favicon|FeedFetcher|Google-Read-Aloud|DuplexWeb-Google|googleweblight|bing|yandex|baidu|duckduck|yahoo|ecosia|ia_archiver|facebook|instagram|pinterest|reddit|slack|twitter|whatsapp|youtube|semrush/i;
    const nE = (e, t, r, n, i) => {
        let { notify: s } = i || {},
          o = e.get(r);
        o || ((o = []), e.set(r, o)), o.push(n), s && t.has(r) && n(t.get(r));
      },
      nO = (e, t, r) => (e.get(t) || []).map((e) => e(r)),
      nj = (e, t, r) => {
        const n = e.get(t);
        n && (r ? n.splice(n.indexOf(r) >>> 0, 1) : e.set(t, []));
      },
      nU = "status";
    function nM(e, t, r) {
      return "function" == typeof e ? e(t) : void 0 !== e ? e : void 0 !== r ? r : void 0;
    }
    "u" > typeof window && !window.global && (window.global = e.g),
      rp(
        ({ clerk: e, children: t, ...r }) => {
          const {
              appearance: n,
              signUpFallbackRedirectUrl: i,
              forceRedirectUrl: s,
              fallbackRedirectUrl: o,
              signUpForceRedirectUrl: a,
              mode: l,
              initialValues: u,
              withSignUp: d,
              oauthFlow: c,
              ...h
            } = r,
            p = rb((t = r_(t, "Sign in")))("SignInButton"),
            f = async (t) => {
              let r;
              return (
                p && "object" == typeof p && "props" in p && (await rS(p.props.onClick)(t)),
                (r = {
                  forceRedirectUrl: s,
                  fallbackRedirectUrl: o,
                  signUpFallbackRedirectUrl: i,
                  signUpForceRedirectUrl: a,
                  initialValues: u,
                  withSignUp: d,
                  oauthFlow: c,
                }),
                "modal" === l
                  ? e.openSignIn({ ...r, appearance: n })
                  : e.redirectToSignIn({
                      ...r,
                      signInFallbackRedirectUrl: o,
                      signInForceRedirectUrl: s,
                    })
              );
            },
            g = { ...h, onClick: f };
          return N.default.cloneElement(p, g);
        },
        { component: "SignInButton", renderWhileLoading: !0 },
      ),
      rp(
        ({ clerk: e, children: t, ...r }) => {
          const { redirectUrl: n, ...i } = r,
            s = rb((t = r_(t, "Sign in with Metamask")))("SignInWithMetamaskButton"),
            o = async () => {
              !(async () => {
                await e.authenticateWithMetamask({ redirectUrl: n || void 0 });
              })();
            },
            a = async (e) => (await rS(s.props.onClick)(e), o()),
            l = { ...i, onClick: a };
          return N.default.cloneElement(s, l);
        },
        { component: "SignInWithMetamask", renderWhileLoading: !0 },
      ),
      rp(
        ({ clerk: e, children: t, ...r }) => {
          const { redirectUrl: n = "/", signOutOptions: i, ...s } = r,
            o = rb((t = r_(t, "Sign out")))("SignOutButton"),
            a = async (t) => (await rS(o.props.onClick)(t), e.signOut({ redirectUrl: n, ...i })),
            l = { ...s, onClick: a };
          return N.default.cloneElement(o, l);
        },
        { component: "SignOutButton", renderWhileLoading: !0 },
      ),
      rp(
        ({ clerk: e, children: t, ...r }) => {
          const {
              appearance: n,
              unsafeMetadata: i,
              fallbackRedirectUrl: s,
              forceRedirectUrl: o,
              signInFallbackRedirectUrl: a,
              signInForceRedirectUrl: l,
              mode: u,
              initialValues: d,
              oauthFlow: c,
              ...h
            } = r,
            p = rb((t = r_(t, "Sign up")))("SignUpButton"),
            f = async (t) => {
              let r;
              return (
                p && "object" == typeof p && "props" in p && (await rS(p.props.onClick)(t)),
                (r = {
                  fallbackRedirectUrl: s,
                  forceRedirectUrl: o,
                  signInFallbackRedirectUrl: a,
                  signInForceRedirectUrl: l,
                  initialValues: d,
                  oauthFlow: c,
                }),
                "modal" === u
                  ? e.openSignUp({ ...r, appearance: n, unsafeMetadata: i })
                  : e.redirectToSignUp({
                      ...r,
                      signUpFallbackRedirectUrl: s,
                      signUpForceRedirectUrl: o,
                    })
              );
            },
            g = { ...h, onClick: f };
          return N.default.cloneElement(p, g);
        },
        { component: "SignUpButton", renderWhileLoading: !0 },
      );
    var nT = class {
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
        return nC() && this.isomorphicClerk.loaded ? e()[t] : r;
      }
      gateMethod(e, t) {
        return async (...r) => {
          if (!nC())
            return t0.throw(
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
    var nz = { name: "@clerk/clerk-react", version: "5.61.3", environment: "production" },
      nI = class t {
        constructor(e) {
          na(this, v),
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
            na(this, d, "loading"),
            na(this, c),
            na(this, h),
            na(this, p),
            na(
              this,
              f,
              (() => {
                let e, t, r;
                return (
                  (e = new Map()),
                  (t = new Map()),
                  (r = new Map()),
                  {
                    on: (...r) => nE(e, t, ...r),
                    prioritizedOn: (...e) => nE(r, t, ...e),
                    emit: (n, i) => {
                      t.set(n, i), nO(r, n, i), nO(e, n, i);
                    },
                    off: (...t) => nj(e, ...t),
                    prioritizedOff: (...e) => nj(r, ...e),
                    internal: { retrieveListeners: (t) => e.get(t) || [] },
                  }
                );
              })(),
            ),
            na(this, g),
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
              no(this, f).on(...e);
            }),
            (this.off = (...e) => {
              var t;
              if (null == (t = this.clerkjs) ? void 0 : t.off) return this.clerkjs.off(...e);
              no(this, f).off(...e);
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
                null == (t = no(this, f).internal.retrieveListeners("status")) ||
                  t.forEach((e) => {
                    this.on("status", e, { notify: !0 });
                  }),
                null == (r = no(this, f).internal.retrieveListeners("queryClientStatus")) ||
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
                void 0 === this.clerkjs.status && no(this, f).emit(nU, "ready"),
                this.emitLoaded(),
                this.clerkjs
              );
            }),
            (this.__experimental_checkout = (...e) => {
              var t;
              return null == (t = this.clerkjs) ? void 0 : t.__experimental_checkout(...e);
            }),
            (this.__unstable__updateProps = async (e) => {
              const t = await nu(this, v, y).call(this);
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
              (await nu(this, v, y).call(this)).authenticateWithGoogleOneTap(e)),
            (this.__internal_loadStripeJs = async () =>
              (await nu(this, v, y).call(this)).__internal_loadStripeJs()),
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
          nl(this, p, r),
            nl(this, h, null == e ? void 0 : e.proxyUrl),
            nl(this, c, null == e ? void 0 : e.domain),
            (this.options = e),
            (this.Clerk = t),
            (this.mode = nC() ? "browser" : "server"),
            nl(this, g, new nT(this)),
            this.options.sdkMetadata || (this.options.sdkMetadata = nz),
            no(this, f).emit(nU, "loading"),
            no(this, f).prioritizedOn(nU, (e) => nl(this, d, e)),
            no(this, p) && this.loadClerkJS();
        }
        get publishableKey() {
          return no(this, p);
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
            : no(this, d);
        }
        static getOrCreateInstance(e) {
          return (
            (nC() &&
              no(this, m) &&
              (!e.Clerk || no(this, m).Clerk === e.Clerk) &&
              no(this, m).publishableKey === e.publishableKey) ||
              nl(this, m, new t(e)),
            no(this, m)
          );
        }
        static clearInstance() {
          nl(this, m, null);
        }
        get domain() {
          return "u" > typeof window && window.location
            ? nM(no(this, c), new URL(window.location.href), "")
            : "function" == typeof no(this, c)
              ? t0.throw(t2)
              : no(this, c) || "";
        }
        get proxyUrl() {
          return "u" > typeof window && window.location
            ? nM(no(this, h), new URL(window.location.href), "")
            : "function" == typeof no(this, h)
              ? t0.throw(t2)
              : no(this, h) || "";
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
            ? nM(this.options.isSatellite, new URL(window.location.href), !1)
            : "function" == typeof this.options.isSatellite && t0.throw(t2);
        }
        async loadClerkJS() {
          var t;
          if ("browser" === this.mode && !this.loaded) {
            "u" > typeof window &&
              ((window.__clerk_publishable_key = no(this, p)),
              (window.__clerk_proxy_url = this.proxyUrl),
              (window.__clerk_domain = this.domain));
            try {
              if (this.Clerk) {
                let t;
                rP(this.Clerk)
                  ? ((t = new this.Clerk(no(this, p), {
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
                    (await nS({
                      ...this.options,
                      publishableKey: no(this, p),
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
              no(this, f).emit(nU, "error"), console.error(e.stack || e.message || e);
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
          return this.loaded && this.clerkjs ? this.clerkjs.__internal_state : no(this, g);
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
    function nA(e) {
      var t, r, n;
      let i,
        s,
        o,
        a,
        l,
        u,
        d,
        c,
        h,
        p,
        f,
        g,
        m,
        v,
        y,
        k,
        b,
        _,
        { isomorphicClerkOptions: S, initialState: P, children: w } = e,
        { isomorphicClerk: C, clerkStatus: E } = nR(S),
        [O, j] = N.default.useState({
          client: C.client,
          session: C.session,
          user: C.user,
          organization: C.organization,
        });
      N.default.useEffect(() => C.addListener((e) => j({ ...e })), []);
      const U =
          ((t = C.loaded),
          !t && P
            ? ((i = (r = P).userId),
              (s = r.user),
              (o = r.sessionId),
              (a = r.sessionStatus),
              (l = r.sessionClaims),
              {
                userId: i,
                user: s,
                sessionId: o,
                session: r.session,
                sessionStatus: a,
                sessionClaims: l,
                organization: r.organization,
                orgId: r.orgId,
                orgRole: r.orgRole,
                orgPermissions: r.orgPermissions,
                orgSlug: r.orgSlug,
                actor: r.actor,
                factorVerificationAge: r.factorVerificationAge,
              })
            : ((u = (n = O).user ? n.user.id : n.user),
              (d = n.user),
              (c = n.session ? n.session.id : n.session),
              (h = n.session),
              (p = n.session?.status),
              (f = n.session ? n.session.lastActiveToken?.jwt?.claims : null),
              (g = n.session ? n.session.factorVerificationAge : null),
              (m = h?.actor),
              (v = n.organization),
              (y = n.organization ? n.organization.id : n.organization),
              (k = v?.slug),
              (_ = (b = v ? d?.organizationMemberships?.find((e) => e.organization.id === y) : v)
                ? b.permissions
                : b),
              {
                userId: u,
                user: d,
                sessionId: c,
                session: h,
                sessionStatus: p,
                sessionClaims: f,
                organization: v,
                orgId: y,
                orgRole: b ? b.role : b,
                orgSlug: k,
                orgPermissions: _,
                actor: m,
                factorVerificationAge: g,
              })),
        M = N.default.useMemo(() => ({ value: C }), [E]),
        T = N.default.useMemo(() => ({ value: O.client }), [O.client]),
        {
          sessionId: z,
          sessionStatus: I,
          sessionClaims: A,
          session: R,
          userId: L,
          user: x,
          orgId: F,
          actor: W,
          organization: D,
          orgRole: B,
          orgSlug: K,
          orgPermissions: $,
          factorVerificationAge: q,
        } = U,
        V = N.default.useMemo(
          () => ({
            value: {
              sessionId: z,
              sessionStatus: I,
              sessionClaims: A,
              userId: L,
              actor: W,
              orgId: F,
              orgRole: B,
              orgSlug: K,
              orgPermissions: $,
              factorVerificationAge: q,
            },
          }),
          [z, I, L, W, F, B, K, q, null == A ? void 0 : A.__raw],
        ),
        G = N.default.useMemo(() => ({ value: R }), [z, R]),
        J = N.default.useMemo(() => ({ value: x }), [L, x]),
        H = N.default.useMemo(() => ({ value: { organization: D } }), [F, D]);
      return N.default.createElement(
        e6.Provider,
        { value: M },
        N.default.createElement(
          e9.Provider,
          { value: T },
          N.default.createElement(
            tt.Provider,
            { value: G },
            N.default.createElement(
              tl,
              { ...H.value },
              N.default.createElement(
                t3.Provider,
                { value: V },
                N.default.createElement(
                  e5.Provider,
                  { value: J },
                  N.default.createElement(ts, { value: void 0 }, w),
                ),
              ),
            ),
          ),
        ),
      );
    }
    (d = new WeakMap()),
      (c = new WeakMap()),
      (h = new WeakMap()),
      (p = new WeakMap()),
      (f = new WeakMap()),
      (g = new WeakMap()),
      (m = new WeakMap()),
      (v = new WeakSet()),
      (y = function () {
        return new Promise((e) => {
          this.addOnLoaded(() => e(this.clerkjs));
        });
      }),
      na(nI, m);
    var nR = (e) => {
        const t = N.default.useRef(nI.getOrCreateInstance(e)),
          [r, n] = N.default.useState(t.current.status);
        return (
          N.default.useEffect(() => {
            t.current.__unstable__updateProps({ appearance: e.appearance });
          }, [e.appearance]),
          N.default.useEffect(() => {
            t.current.__unstable__updateProps({ options: e });
          }, [e.localization]),
          N.default.useEffect(
            () => (
              t.current.on("status", n),
              () => {
                t.current && t.current.off("status", n), nI.clearInstance();
              }
            ),
            [],
          ),
          { isomorphicClerk: t.current, clerkStatus: r }
        );
      },
      nL = rC(
        (e) => {
          const {
              initialState: t,
              children: r,
              __internal_bypassMissingPublishableKey: n,
              ...i
            } = e,
            { publishableKey: s = "", Clerk: o } = i;
          return (
            o ||
              n ||
              (s
                ? s && !x(s) && t0.throwInvalidPublishableKeyError({ key: s })
                : t0.throwMissingPublishableKeyError()),
            N.default.createElement(nA, { initialState: t, isomorphicClerkOptions: i }, r)
          );
        },
        "ClerkProvider",
        t4,
      );
    (nL.displayName = "ClerkProvider"),
      t1({ packageName: "@clerk/clerk-react" }),
      nk.setPackageName({ packageName: "@clerk/clerk-react" }),
      e.s(["ClerkProvider", 0, nL], 88886);
    const nx = (...e) =>
        e
          .filter((e, t, r) => !!e && "" !== e.trim() && r.indexOf(e) === t)
          .join(" ")
          .trim(),
      nF = (e) => {
        const t = e.replace(/^([A-Z])|[\s-_]+(\w)/g, (e, t, r) =>
          r ? r.toUpperCase() : t.toLowerCase(),
        );
        return t.charAt(0).toUpperCase() + t.slice(1);
      };
    var nN = {
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
    const nW = (0, N.createContext)({}),
      nD = (0, N.forwardRef)(
        (
          {
            color: e,
            size: t,
            strokeWidth: r,
            absoluteStrokeWidth: n,
            className: i = "",
            children: s,
            iconNode: o,
            ...a
          },
          l,
        ) => {
          const {
              size: u = 24,
              strokeWidth: d = 2,
              absoluteStrokeWidth: c = !1,
              color: h = "currentColor",
              className: p = "",
            } = (0, N.useContext)(nW) ?? {},
            f = (n ?? c) ? (24 * Number(r ?? d)) / Number(t ?? u) : (r ?? d);
          return (0, N.createElement)(
            "svg",
            {
              ref: l,
              ...nN,
              width: t ?? u ?? nN.width,
              height: t ?? u ?? nN.height,
              stroke: e ?? h,
              strokeWidth: f,
              className: nx("lucide", p, i),
              ...(!s &&
                !((e) => {
                  for (const t in e)
                    if (t.startsWith("aria-") || "role" === t || "title" === t) return !0;
                  return !1;
                })(a) && { "aria-hidden": "true" }),
              ...a,
            },
            [...o.map(([e, t]) => (0, N.createElement)(e, t)), ...(Array.isArray(s) ? s : [s])],
          );
        },
      );
    e.s(
      [
        "default",
        0,
        (e, t) => {
          const r = (0, N.forwardRef)(({ className: r, ...n }, i) =>
            (0, N.createElement)(nD, {
              ref: i,
              iconNode: t,
              className: nx(
                `lucide-${nF(e)
                  .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                  .toLowerCase()}`,
                `lucide-${e}`,
                r,
              ),
              ...n,
            }),
          );
          return (r.displayName = nF(e)), r;
        },
      ],
      1130,
    );
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
        u(t)
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
    function l(e) {
      return Array.isArray(e) && e.length === Object.keys(e).length;
    }
    function u(e) {
      if (!d(e)) return !1;
      const t = e.constructor;
      if (void 0 === t) return !0;
      const r = t.prototype;
      return (
        !!d(r) &&
        !!r.hasOwnProperty("isPrototypeOf") &&
        Object.getPrototypeOf(e) === Object.prototype
      );
    }
    function d(e) {
      return "[object Object]" === Object.prototype.toString.call(e);
    }
    var c = Symbol();
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
            : e.queryFn && e.queryFn !== c
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
            queryKey: l,
            stale: u,
          } = e;
          if (l) {
            if (n) {
              if (t.queryHash !== i(l, t.options)) return !1;
            } else if (!o(t.queryKey, l)) return !1;
          }
          if ("all" !== r) {
            const e = t.isActive();
            if (("active" === r && !e) || ("inactive" === r && e)) return !1;
          }
          return (
            ("boolean" != typeof u || t.isStale() === u) &&
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
                  const i = l(t) && l(r);
                  if (!i && !(u(t) && u(r))) return r;
                  let s = (i ? t : Object.keys(t)).length,
                    o = i ? r : Object.keys(r),
                    d = o.length,
                    c = i ? Array(d) : {},
                    h = 0;
                  for (let l = 0; l < d; l++) {
                    const u = i ? l : o[l],
                      d = t[u],
                      p = r[u];
                    if (d === p) {
                      (c[u] = d), (i ? l < s : a.call(t, u)) && h++;
                      continue;
                    }
                    if (null === d || null === p || "object" != typeof d || "object" != typeof p) {
                      c[u] = p;
                      continue;
                    }
                    const f = e(d, p, n + 1);
                    (c[u] = f), f === d && h++;
                  }
                  return s === d && h === s ? t : c;
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
        c,
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
      l =
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
    e.s(["notifyManager", 0, l]);
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
    e.s(["focusManager", 0, r], 6906);
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
  41136,
  13564,
  78408,
  73048,
  (e) => {
    e.i(67836);
    var t = e.i(37519),
      r = e.i(94720),
      n = e.i(6906),
      i = e.i(65548),
      s = e.i(16621),
      o = e.i(93771);
    function a(e) {
      return Math.min(1e3 * 2 ** e, 3e4);
    }
    function l(e) {
      return (e ?? "online") !== "online" || i.onlineManager.isOnline();
    }
    var u = class extends Error {
      constructor(e) {
        super("CancelledError"), (this.revert = e?.revert), (this.silent = e?.silent);
      }
    };
    function d(e) {
      let r,
        d = !1,
        c = 0,
        h = (0, s.pendingThenable)(),
        p = () =>
          n.focusManager.isFocused() &&
          ("always" === e.networkMode || i.onlineManager.isOnline()) &&
          e.canRun(),
        f = () => l(e.networkMode) && e.canRun(),
        g = (e) => {
          "pending" === h.status && (r?.(), h.resolve(e));
        },
        m = (e) => {
          "pending" === h.status && (r?.(), h.reject(e));
        },
        v = () =>
          new Promise((t) => {
            (r = (e) => {
              ("pending" !== h.status || p()) && t(e);
            }),
              e.onPause?.();
          }).then(() => {
            (r = void 0), "pending" === h.status && e.onContinue?.();
          }),
        y = () => {
          let r;
          if ("pending" !== h.status) return;
          const n = 0 === c ? e.initialPromise : void 0;
          try {
            r = n ?? e.fn();
          } catch (e) {
            r = Promise.reject(e);
          }
          Promise.resolve(r)
            .then(g)
            .catch((r) => {
              if ("pending" !== h.status) return;
              const n = e.retry ?? 3 * !o.environmentManager.isServer(),
                i = e.retryDelay ?? a,
                s = "function" == typeof i ? i(c, r) : i,
                l =
                  !0 === n ||
                  ("number" == typeof n && c < n) ||
                  ("function" == typeof n && n(c, r));
              d || !l
                ? m(r)
                : (c++,
                  e.onFail?.(c, r),
                  (0, t.sleep)(s)
                    .then(() => (p() ? void 0 : v()))
                    .then(() => {
                      d ? m(r) : y();
                    }));
            });
        };
      return {
        promise: h,
        status: () => h.status,
        cancel: (t) => {
          if ("pending" === h.status) {
            const r = new u(t);
            m(r), e.onCancel?.(r);
          }
        },
        continue: () => (r?.(), h),
        cancelRetry: () => {
          d = !0;
        },
        continueRetry: () => {
          d = !1;
        },
        canStart: f,
        start: () => (f() ? y() : v().then(y), h),
      };
    }
    e.s(["CancelledError", 0, u, "canFetch", 0, l, "createRetryer", 0, d], 13564);
    var c = e.i(8081),
      h = class {
        #o;
        destroy() {
          this.clearGcTimeout();
        }
        scheduleGc() {
          this.clearGcTimeout(),
            (0, t.isValidTimeout)(this.gcTime) &&
              (this.#o = c.timeoutManager.setTimeout(() => {
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
          this.#o && (c.timeoutManager.clearTimeout(this.#o), (this.#o = void 0));
        }
      };
    e.s(["Removable", 0, h], 78408);
    var p = class extends h {
      #a;
      #l;
      #u;
      #d;
      #c;
      #h;
      #p;
      constructor(e) {
        super(),
          (this.#p = !1),
          (this.#h = e.defaultOptions),
          this.setOptions(e.options),
          (this.observers = []),
          (this.#d = e.client),
          (this.#u = this.#d.getQueryCache()),
          (this.queryKey = e.queryKey),
          (this.queryHash = e.queryHash),
          (this.#a = m(this.options)),
          (this.state = e.state ?? this.#a),
          this.scheduleGc();
      }
      get meta() {
        return this.options.meta;
      }
      get promise() {
        return this.#c?.promise;
      }
      setOptions(e) {
        if (
          ((this.options = { ...this.#h, ...e }),
          this.updateGcTime(this.options.gcTime),
          this.state && void 0 === this.state.data)
        ) {
          const e = m(this.options);
          void 0 !== e.data && (this.setState(g(e.data, e.dataUpdatedAt)), (this.#a = e));
        }
      }
      optionalRemove() {
        this.observers.length || "idle" !== this.state.fetchStatus || this.#u.remove(this);
      }
      setData(e, r) {
        const n = (0, t.replaceData)(this.state.data, e, this.options);
        return (
          this.#f({ data: n, type: "success", dataUpdatedAt: r?.updatedAt, manual: r?.manual }), n
        );
      }
      setState(e, t) {
        this.#f({ type: "setState", state: e, setStateOptions: t });
      }
      cancel(e) {
        const r = this.#c?.promise;
        return this.#c?.cancel(e), r ? r.then(t.noop).catch(t.noop) : Promise.resolve();
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
        e?.refetch({ cancelRefetch: !1 }), this.#c?.continue();
      }
      onOnline() {
        const e = this.observers.find((e) => e.shouldFetchOnReconnect());
        e?.refetch({ cancelRefetch: !1 }), this.#c?.continue();
      }
      addObserver(e) {
        this.observers.includes(e) ||
          (this.observers.push(e),
          this.clearGcTimeout(),
          this.#u.notify({ type: "observerAdded", query: this, observer: e }));
      }
      removeObserver(e) {
        this.observers.includes(e) &&
          ((this.observers = this.observers.filter((t) => t !== e)),
          this.observers.length ||
            (this.#c &&
              (this.#p || this.#g() ? this.#c.cancel({ revert: !0 }) : this.#c.cancelRetry()),
            this.scheduleGc()),
          this.#u.notify({ type: "observerRemoved", query: this, observer: e }));
      }
      getObserversCount() {
        return this.observers.length;
      }
      #g() {
        return "paused" === this.state.fetchStatus && "pending" === this.state.status;
      }
      invalidate() {
        this.state.isInvalidated || this.#f({ type: "invalidate" });
      }
      async fetch(e, r) {
        let n;
        if ("idle" !== this.state.fetchStatus && this.#c?.status() !== "rejected") {
          if (void 0 !== this.state.data && r?.cancelRefetch) this.cancel({ silent: !0 });
          else if (this.#c) return this.#c.continueRetry(), this.#c.promise;
        }
        if ((e && this.setOptions(e), !this.options.queryFn)) {
          const e = this.observers.find((e) => e.options.queryFn);
          e && this.setOptions(e.options);
        }
        const i = new AbortController(),
          s = (e) => {
            Object.defineProperty(e, "signal", {
              enumerable: !0,
              get: () => ((this.#p = !0), i.signal),
            });
          },
          o = () => {
            let e,
              n = (0, t.ensureQueryFn)(this.options, r),
              i = (s((e = { client: this.#d, queryKey: this.queryKey, meta: this.meta })), e);
            return ((this.#p = !1), this.options.persister)
              ? this.options.persister(n, i, this)
              : n(i);
          },
          a =
            (s(
              (n = {
                fetchOptions: r,
                options: this.options,
                queryKey: this.queryKey,
                client: this.#d,
                state: this.state,
                fetchFn: o,
              }),
            ),
            n);
        this.options.behavior?.onFetch(a, this),
          (this.#l = this.state),
          ("idle" === this.state.fetchStatus || this.state.fetchMeta !== a.fetchOptions?.meta) &&
            this.#f({ type: "fetch", meta: a.fetchOptions?.meta }),
          (this.#c = d({
            initialPromise: r?.initialPromise,
            fn: a.fetchFn,
            onCancel: (e) => {
              e instanceof u && e.revert && this.setState({ ...this.#l, fetchStatus: "idle" }),
                i.abort();
            },
            onFail: (e, t) => {
              this.#f({ type: "failed", failureCount: e, error: t });
            },
            onPause: () => {
              this.#f({ type: "pause" });
            },
            onContinue: () => {
              this.#f({ type: "continue" });
            },
            retry: a.options.retry,
            retryDelay: a.options.retryDelay,
            networkMode: a.options.networkMode,
            canRun: () => !0,
          }));
        try {
          const e = await this.#c.start();
          if (void 0 === e) throw Error(`${this.queryHash} data is undefined`);
          return (
            this.setData(e),
            this.#u.config.onSuccess?.(e, this),
            this.#u.config.onSettled?.(e, this.state.error, this),
            e
          );
        } catch (e) {
          if (e instanceof u) {
            if (e.silent) return this.#c.promise;
            else if (e.revert) {
              if (void 0 === this.state.data) throw e;
              return this.state.data;
            }
          }
          throw (
            (this.#f({ type: "error", error: e }),
            this.#u.config.onError?.(e, this),
            this.#u.config.onSettled?.(this.state.data, e, this),
            e)
          );
        } finally {
          this.scheduleGc();
        }
      }
      #f(e) {
        const t = (t) => {
          switch (e.type) {
            case "failed":
              return { ...t, fetchFailureCount: e.failureCount, fetchFailureReason: e.error };
            case "pause":
              return { ...t, fetchStatus: "paused" };
            case "continue":
              return { ...t, fetchStatus: "fetching" };
            case "fetch":
              return { ...t, ...f(t.data, this.options), fetchMeta: e.meta ?? null };
            case "success":
              const r = {
                ...t,
                ...g(e.data, e.dataUpdatedAt),
                dataUpdateCount: t.dataUpdateCount + 1,
                ...(!e.manual && {
                  fetchStatus: "idle",
                  fetchFailureCount: 0,
                  fetchFailureReason: null,
                }),
              };
              return (this.#l = e.manual ? r : void 0), r;
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
              this.#u.notify({ query: this, type: "updated", action: e });
          });
      }
    };
    function f(e, t) {
      return {
        fetchFailureCount: 0,
        fetchFailureReason: null,
        fetchStatus: l(t.networkMode) ? "fetching" : "paused",
        ...(void 0 === e && { error: null, status: "pending" }),
      };
    }
    function g(e, t) {
      return {
        data: e,
        dataUpdatedAt: t ?? Date.now(),
        error: null,
        isInvalidated: !1,
        status: "success",
      };
    }
    function m(e) {
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
    e.s(["Query", 0, p, "fetchState", 0, f], 41136);
    var v = e.i(98937),
      y = e.i(87111),
      k = v.createContext(void 0);
    e.s(
      [
        "QueryClientProvider",
        0,
        ({ client: e, children: t }) => (
          v.useEffect(
            () => (
              e.mount(),
              () => {
                e.unmount();
              }
            ),
            [e],
          ),
          (0, y.jsx)(k.Provider, { value: e, children: t })
        ),
        "useQueryClient",
        0,
        (e) => {
          const t = v.useContext(k);
          if (e) return e;
          if (!t) throw Error("No QueryClient set, use QueryClientProvider to set one");
          return t;
        },
      ],
      73048,
    );
  },
]);
