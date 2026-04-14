(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  "object" == typeof document ? document.currentScript : void 0,
  6149,
  75501,
  (e) => {
    var s = e.i(67836);
    const r = [
      {
        name: "Accounting",
        slug: "accounting",
        description: "Financial operations, invoicing, P&L, and bank reconciliation",
        permissionKey: "org:dept:accounting",
        services: ["documents", "accounting", "mcp"],
        googleGroupEmail: s.default.env.DEPT_ACCOUNTING_GROUP_EMAIL,
      },
      {
        name: "Legal",
        slug: "legal",
        description: "Contract review, compliance, signatures, and legal matters",
        permissionKey: "org:dept:legal",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: s.default.env.DEPT_LEGAL_GROUP_EMAIL,
      },
      {
        name: "Operations",
        slug: "operations",
        description: "Day-to-day business operations and logistics",
        permissionKey: "org:dept:operations",
        services: ["documents", "mcp"],
        googleGroupEmail: s.default.env.DEPT_OPERATIONS_GROUP_EMAIL,
      },
      {
        name: "HR",
        slug: "hr",
        description: "People management, hiring, and employee relations",
        permissionKey: "org:dept:hr",
        services: ["documents", "signatures", "mcp"],
        googleGroupEmail: s.default.env.DEPT_HR_GROUP_EMAIL,
      },
    ];
    e.s(["DEPARTMENTS", 0, r], 6149);
    const i = {
      "org:admin": {
        key: "org:admin",
        name: "Admin",
        description: "Full access to everything",
        permissions: [],
        isAdmin: !0,
      },
      "org:accounting_member": {
        key: "org:accounting_member",
        name: "Accounting",
        description: "Financial operations, invoices, reports",
        permissions: [
          "org:dept:accounting",
          "org:accounting:view",
          "org:accounting:manage",
          "org:documents:read",
          "org:documents:write",
          "org:drive:handoff",
          "org:drive:request",
          "org:mcp:access",
        ],
      },
      "org:legal_member": {
        key: "org:legal_member",
        name: "Legal",
        description: "Contracts, compliance, signatures",
        permissions: [
          "org:dept:legal",
          "org:documents:read",
          "org:documents:write",
          "org:documents:approve",
          "org:signatures:request",
          "org:signatures:sign",
          "org:drive:handoff",
          "org:drive:request",
          "org:mcp:access",
        ],
      },
      "org:operations_member": {
        key: "org:operations_member",
        name: "Operations",
        description: "Business operations, documents",
        permissions: [
          "org:dept:operations",
          "org:documents:read",
          "org:drive:handoff",
          "org:drive:request",
          "org:mcp:access",
        ],
      },
      "org:hr_member": {
        key: "org:hr_member",
        name: "HR",
        description: "People management, signatures",
        permissions: [
          "org:dept:hr",
          "org:documents:read",
          "org:documents:write",
          "org:signatures:request",
          "org:signatures:sign",
          "org:drive:handoff",
          "org:drive:request",
          "org:mcp:access",
        ],
      },
      "org:member": {
        key: "org:member",
        name: "Member",
        description: "Basic access only",
        permissions: [],
      },
    };
    Object.keys(i), e.s(["ROLES", 0, i], 75501);
  },
  9092,
  (e) => {
    var s = e.i(87111);
    e.i(88886);
    var r = e.i(8024),
      i = e.i(6149),
      n = e.i(75501);
    const t = (0, e.i(1130).default)("bot", [
      ["path", { d: "M12 8V4H8", key: "hb8ula" }],
      ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
      ["path", { d: "M2 14h2", key: "vft8re" }],
      ["path", { d: "M20 14h2", key: "4cs60a" }],
      ["path", { d: "M15 13v2", key: "1xurst" }],
      ["path", { d: "M9 13v2", key: "rq6x2g" }],
    ]);
    var o = e.i(13611),
      a = e.i(83203);
    function c({ dept: e, memberCount: r }) {
      return (0, s.jsxs)("div", {
        className: "rounded-lg border p-5",
        children: [
          (0, s.jsxs)("div", {
            className: "flex items-start justify-between mb-3",
            children: [
              (0, s.jsxs)("div", {
                className: "flex items-center gap-3",
                children: [
                  (0, s.jsx)("div", {
                    className: "flex items-center justify-center w-10 h-10 rounded-lg bg-muted",
                    children: (0, s.jsx)(o.Building2, {
                      size: 20,
                      className: "text-muted-foreground",
                    }),
                  }),
                  (0, s.jsxs)("div", {
                    children: [
                      (0, s.jsx)("h3", { className: "font-semibold", children: e.name }),
                      (0, s.jsx)("p", {
                        className: "text-xs text-muted-foreground font-mono",
                        children: e.slug,
                      }),
                    ],
                  }),
                ],
              }),
              (0, s.jsxs)("div", {
                className: "flex items-center gap-3 text-xs text-muted-foreground",
                children: [
                  (0, s.jsxs)("span", {
                    className: "flex items-center gap-1",
                    children: [(0, s.jsx)(a.Users, { size: 14 }), r],
                  }),
                  (0, s.jsxs)("span", {
                    className: "flex items-center gap-1",
                    children: [(0, s.jsx)(t, { size: 14 }), "Agent"],
                  }),
                ],
              }),
            ],
          }),
          (0, s.jsx)("p", {
            className: "text-sm text-muted-foreground mb-4",
            children: e.description,
          }),
          (0, s.jsx)("div", {
            className: "flex gap-1.5",
            children: e.services.map((e) =>
              (0, s.jsx)(
                "span",
                {
                  className:
                    "inline-flex items-center px-2 py-0.5 rounded-md bg-muted text-xs text-muted-foreground",
                  children: e,
                },
                e,
              ),
            ),
          }),
        ],
      });
    }
    e.s(
      [
        "default",
        0,
        () => {
          const { memberships: e, isLoaded: t } = (0, r.useOrganization)({
            memberships: { pageSize: 50 },
          });
          if (!t)
            return (0, s.jsx)("div", {
              className: "flex-1 flex items-center justify-center",
              children: (0, s.jsx)("div", {
                className: "animate-pulse text-muted-foreground",
                children: "Loading...",
              }),
            });
          const o = e?.data ?? [];
          return (0, s.jsx)("div", {
            className: "flex-1 p-8 overflow-y-auto",
            children: (0, s.jsxs)("div", {
              className: "max-w-4xl",
              children: [
                (0, s.jsxs)("div", {
                  className: "mb-8",
                  children: [
                    (0, s.jsx)("h1", {
                      className: "text-2xl font-semibold",
                      children: "Departments",
                    }),
                    (0, s.jsx)("p", {
                      className: "text-muted-foreground",
                      children: "Each department has an AI agent and access to specific services.",
                    }),
                  ],
                }),
                (0, s.jsx)("div", {
                  className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                  children: i.DEPARTMENTS.map((e) => {
                    var r;
                    return (0, s.jsx)(
                      c,
                      {
                        dept: e,
                        memberCount:
                          ((r = e.permissionKey),
                          o.filter((e) => {
                            if (n.ROLES[e.role]?.isAdmin) return !0;
                            const s = n.ROLES[e.role];
                            return s?.permissions?.includes(r);
                          }).length),
                      },
                      e.slug,
                    );
                  }),
                }),
              ],
            }),
          });
        },
      ],
      9092,
    );
  },
]);
