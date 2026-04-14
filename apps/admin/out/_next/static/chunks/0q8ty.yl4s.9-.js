(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  13611,
  1130,
  83203,
  (e) => {
    var t = e.i(98937);
    const r = (...e) =>
        e
          .filter((e, t, r) => !!e && "" !== e.trim() && r.indexOf(e) === t)
          .join(" ")
          .trim(),
      a = (e) => {
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
    const s = (0, t.createContext)({}),
      o = (0, t.forwardRef)(
        (
          {
            color: e,
            size: a,
            strokeWidth: o,
            absoluteStrokeWidth: l,
            className: h = "",
            children: d,
            iconNode: n,
            ...c
          },
          u,
        ) => {
          const {
              size: p = 24,
              strokeWidth: k = 2,
              absoluteStrokeWidth: m = !1,
              color: y = "currentColor",
              className: g = "",
            } = (0, t.useContext)(s) ?? {},
            f = (l ?? m) ? (24 * Number(o ?? k)) / Number(a ?? p) : (o ?? k);
          return (0, t.createElement)(
            "svg",
            {
              ref: u,
              ...i,
              width: a ?? p ?? i.width,
              height: a ?? p ?? i.height,
              stroke: e ?? y,
              strokeWidth: f,
              className: r("lucide", g, h),
              ...(!d &&
                !((e) => {
                  for (const t in e)
                    if (t.startsWith("aria-") || "role" === t || "title" === t) return !0;
                  return !1;
                })(c) && { "aria-hidden": "true" }),
              ...c,
            },
            [...n.map(([e, r]) => (0, t.createElement)(e, r)), ...(Array.isArray(d) ? d : [d])],
          );
        },
      ),
      l = (e, i) => {
        const s = (0, t.forwardRef)(({ className: s, ...l }, h) =>
          (0, t.createElement)(o, {
            ref: h,
            iconNode: i,
            className: r(
              `lucide-${a(e)
                .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
                .toLowerCase()}`,
              `lucide-${e}`,
              s,
            ),
            ...l,
          }),
        );
        return (s.displayName = a(e)), s;
      };
    e.s(["default", 0, l], 1130);
    const h = l("building-2", [
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
    e.s(["Building2", 0, h], 13611);
    const d = l("users", [
      ["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2", key: "1yyitq" }],
      ["path", { d: "M16 3.128a4 4 0 0 1 0 7.744", key: "16gr8j" }],
      ["path", { d: "M22 21v-2a4 4 0 0 0-3-3.87", key: "kshegd" }],
      ["circle", { cx: "9", cy: "7", r: "4", key: "nufk8" }],
    ]);
    e.s(["Users", 0, d], 83203);
  },
]);
