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
    const t = {
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
    Object.keys(t), e.s(["ROLES", 0, t], 75501);
  },
  70842,
  (e) => {
    var s = e.i(87111);
    e.i(88886);
    var r = e.i(8024),
      t = e.i(6149),
      i = e.i(75501);
    const n = {
        "org:dept:accounting": {
          key: "org:dept:accounting",
          name: "Accounting",
          description: "Access to accounting department and its services",
          service: "departments",
        },
        "org:dept:legal": {
          key: "org:dept:legal",
          name: "Legal",
          description: "Access to legal department and its services",
          service: "departments",
        },
        "org:dept:operations": {
          key: "org:dept:operations",
          name: "Operations",
          description: "Access to operations department and its services",
          service: "departments",
        },
        "org:dept:hr": {
          key: "org:dept:hr",
          name: "HR",
          description: "Access to HR department and its services",
          service: "departments",
        },
        "org:documents:read": {
          key: "org:documents:read",
          name: "Read documents",
          description: "View and download documents",
          service: "documents",
        },
        "org:documents:write": {
          key: "org:documents:write",
          name: "Write documents",
          description: "Upload and edit documents",
          service: "documents",
        },
        "org:documents:approve": {
          key: "org:documents:approve",
          name: "Approve documents",
          description: "Approve documents and invoices",
          service: "documents",
        },
        "org:signatures:request": {
          key: "org:signatures:request",
          name: "Request signatures",
          description: "Send documents for e-signature",
          service: "signatures",
        },
        "org:signatures:sign": {
          key: "org:signatures:sign",
          name: "Sign documents",
          description: "Sign documents sent for signature",
          service: "signatures",
        },
        "org:accounting:view": {
          key: "org:accounting:view",
          name: "View financials",
          description: "View financial reports, P&L, and balances",
          service: "accounting",
        },
        "org:accounting:manage": {
          key: "org:accounting:manage",
          name: "Manage financials",
          description: "Manage invoices, transactions, and reconciliation",
          service: "accounting",
        },
        "org:drive:handoff": {
          key: "org:drive:handoff",
          name: "Handoff files",
          description: "Hand off Google Drive files to departments",
          service: "drive",
        },
        "org:drive:request": {
          key: "org:drive:request",
          name: "Request file access",
          description: "Request access to Google Drive files",
          service: "drive",
        },
        "org:mcp:access": {
          key: "org:mcp:access",
          name: "MCP access",
          description: "Access AI tools via MCP gateway",
          service: "gateway",
        },
      },
      a = Object.keys(n);
    var o = e.i(13611),
      c = e.i(1130);
    const l = (0, c.default)("check", [["path", { d: "M20 6 9 17l-5-5", key: "1gmf2c" }]]),
      d = (0, c.default)("ellipsis", [
        ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
        ["circle", { cx: "19", cy: "12", r: "1", key: "1wjl8i" }],
        ["circle", { cx: "5", cy: "12", r: "1", key: "1pcz8c" }],
      ]),
      m = (0, c.default)("plus", [
        ["path", { d: "M5 12h14", key: "1ays0h" }],
        ["path", { d: "M12 5v14", key: "s699le" }],
      ]),
      u = (0, c.default)("shield", [
        [
          "path",
          {
            d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
            key: "oel41y",
          },
        ],
      ]);
    var g = e.i(83203);
    const p = (0, c.default)("x", [
      ["path", { d: "M18 6 6 18", key: "1bl5f8" }],
      ["path", { d: "m6 6 12 12", key: "d8bk6v" }],
    ]);
    var x = e.i(98937);
    const f = Object.values(i.ROLES),
      h = {
        "org:admin": "bg-violet-50 text-violet-700",
        "org:accounting_member": "bg-emerald-50 text-emerald-700",
        "org:legal_member": "bg-blue-50 text-blue-700",
        "org:operations_member": "bg-amber-50 text-amber-700",
        "org:hr_member": "bg-rose-50 text-rose-700",
        "org:member": "bg-muted text-muted-foreground",
      };
    function b({ role: e }) {
      const r = i.ROLES[e];
      return (0, s.jsx)("span", {
        className: `inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${h[e] ?? h["org:member"]}`,
        children: r?.name ?? e,
      });
    }
    function v({ icon: e, label: r, value: t }) {
      return (0, s.jsxs)("div", {
        className: "flex items-center gap-3 rounded-lg border p-4",
        children: [
          (0, s.jsx)("div", {
            className: "flex items-center justify-center w-10 h-10 rounded-lg bg-muted",
            children: e,
          }),
          (0, s.jsxs)("div", {
            children: [
              (0, s.jsx)("p", { className: "text-2xl font-semibold", children: t }),
              (0, s.jsx)("p", { className: "text-sm text-muted-foreground", children: r }),
            ],
          }),
        ],
      });
    }
    function j({ onClose: e, onInvite: r }) {
      const [t, i] = (0, x.useState)(""),
        [n, a] = (0, x.useState)("org:member"),
        [o, c] = (0, x.useState)(!1),
        l = async (e) => {
          e.preventDefault(), t && (c(!0), await r(t, n), c(!1));
        };
      return (0, s.jsx)("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/40",
        onClick: e,
        children: (0, s.jsxs)("div", {
          className: "bg-white rounded-xl shadow-lg w-full max-w-md p-6",
          onClick: (e) => e.stopPropagation(),
          children: [
            (0, s.jsxs)("div", {
              className: "flex items-center justify-between mb-4",
              children: [
                (0, s.jsx)("h2", { className: "text-lg font-semibold", children: "Invite Member" }),
                (0, s.jsx)("button", {
                  onClick: e,
                  className: "p-1 rounded hover:bg-muted",
                  children: (0, s.jsx)(p, { size: 18 }),
                }),
              ],
            }),
            (0, s.jsxs)("form", {
              onSubmit: l,
              className: "space-y-4",
              children: [
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("label", {
                      className: "block text-sm font-medium mb-1",
                      children: "Email",
                    }),
                    (0, s.jsx)("input", {
                      type: "email",
                      value: t,
                      onChange: (e) => i(e.target.value),
                      placeholder: "name@company.com",
                      className:
                        "w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
                      autoFocus: !0,
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("label", {
                      className: "block text-sm font-medium mb-2",
                      children: "Role",
                    }),
                    (0, s.jsx)("div", {
                      className: "space-y-1",
                      children: f.map((e) =>
                        (0, s.jsxs)(
                          "label",
                          {
                            className: `flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${n === e.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`,
                            children: [
                              (0, s.jsx)("input", {
                                type: "radio",
                                name: "role",
                                value: e.key,
                                checked: n === e.key,
                                onChange: () => a(e.key),
                                className: "sr-only",
                              }),
                              (0, s.jsx)("div", {
                                className: `w-4 h-4 rounded-full border-2 flex items-center justify-center ${n === e.key ? "border-primary" : "border-muted-foreground/30"}`,
                                children:
                                  n === e.key &&
                                  (0, s.jsx)("div", {
                                    className: "w-2 h-2 rounded-full bg-primary",
                                  }),
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex-1",
                                children: [
                                  (0, s.jsx)("p", {
                                    className: "text-sm font-medium",
                                    children: e.name,
                                  }),
                                  (0, s.jsx)("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: e.description,
                                  }),
                                ],
                              }),
                            ],
                          },
                          e.key,
                        ),
                      ),
                    }),
                  ],
                }),
                (0, s.jsx)("button", {
                  type: "submit",
                  disabled: !t || o,
                  className:
                    "w-full py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50",
                  children: o ? "Inviting..." : "Send Invite",
                }),
              ],
            }),
          ],
        }),
      });
    }
    function y({ member: e, onClose: r, onChangeRole: t }) {
      const o = e.role,
        c = e.publicMetadata?.extraPermissions ?? [],
        d = ((e, s) => {
          const r = i.ROLES[e];
          if (r?.isAdmin) return [...a];
          const t = new Set(r?.permissions ?? []);
          if (s) for (const e of s) a.includes(e) && t.add(e);
          return [...t];
        })(o, c),
        m = (() => {
          const e = {};
          for (const s of Object.values(n))
            e[s.service] || (e[s.service] = []), e[s.service].push(s);
          return e;
        })(),
        u = i.ROLES[o];
      return (0, s.jsx)("div", {
        className: "fixed inset-0 z-50 flex justify-end bg-black/40",
        onClick: r,
        children: (0, s.jsxs)("div", {
          className: "bg-white w-full max-w-lg h-full overflow-y-auto shadow-xl",
          onClick: (e) => e.stopPropagation(),
          children: [
            (0, s.jsxs)("div", {
              className:
                "sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between",
              children: [
                (0, s.jsx)("h2", {
                  className: "text-lg font-semibold",
                  children: "Member Details",
                }),
                (0, s.jsx)("button", {
                  onClick: r,
                  className: "p-1 rounded hover:bg-muted",
                  children: (0, s.jsx)(p, { size: 18 }),
                }),
              ],
            }),
            (0, s.jsxs)("div", {
              className: "p-6 space-y-6",
              children: [
                (0, s.jsxs)("div", {
                  className: "flex items-center gap-4",
                  children: [
                    e.publicUserData.imageUrl
                      ? (0, s.jsx)("img", {
                          src: e.publicUserData.imageUrl,
                          alt: "",
                          className: "w-12 h-12 rounded-full",
                        })
                      : (0, s.jsx)("div", {
                          className:
                            "w-12 h-12 rounded-full bg-muted flex items-center justify-center text-lg font-medium",
                          children: (e.publicUserData.firstName?.[0] ?? "?").toUpperCase(),
                        }),
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("p", {
                          className: "font-semibold",
                          children:
                            [e.publicUserData.firstName, e.publicUserData.lastName]
                              .filter(Boolean)
                              .join(" ") || "—",
                        }),
                        (0, s.jsx)("p", {
                          className: "text-sm text-muted-foreground",
                          children: e.publicUserData.identifier,
                        }),
                      ],
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsx)("h3", { className: "text-sm font-medium mb-2", children: "Role" }),
                    (0, s.jsx)("div", {
                      className: "space-y-1",
                      children: f.map((e) =>
                        (0, s.jsxs)(
                          "button",
                          {
                            onClick: () => t(e.key),
                            className: `w-full text-left flex items-center justify-between p-3 rounded-lg border transition-colors ${o === e.key ? "border-primary bg-primary/5" : "hover:bg-muted/50"}`,
                            children: [
                              (0, s.jsxs)("div", {
                                children: [
                                  (0, s.jsx)("p", {
                                    className: "text-sm font-medium",
                                    children: e.name,
                                  }),
                                  (0, s.jsx)("p", {
                                    className: "text-xs text-muted-foreground",
                                    children: e.description,
                                  }),
                                ],
                              }),
                              o === e.key &&
                                (0, s.jsx)(l, { size: 16, className: "text-primary shrink-0" }),
                            ],
                          },
                          e.key,
                        ),
                      ),
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  children: [
                    (0, s.jsxs)("h3", {
                      className: "text-sm font-medium mb-2",
                      children: [
                        "Permissions",
                        u?.isAdmin &&
                          (0, s.jsx)("span", {
                            className: "ml-2 text-xs text-muted-foreground font-normal",
                            children: "(admin — all granted)",
                          }),
                      ],
                    }),
                    Object.entries(m).map(([e, r]) =>
                      (0, s.jsxs)(
                        "div",
                        {
                          className: "mb-3",
                          children: [
                            (0, s.jsx)("p", {
                              className:
                                "text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1",
                              children: e,
                            }),
                            (0, s.jsx)("div", {
                              className: "space-y-0.5",
                              children: r.map((e) => {
                                const r = d.includes(e.key),
                                  t = i.ROLES[o]?.permissions?.includes(e.key),
                                  n = c.includes(e.key);
                                return (0, s.jsxs)(
                                  "div",
                                  {
                                    className: `flex items-center justify-between py-1.5 px-2 rounded text-sm ${r ? "" : "text-muted-foreground"}`,
                                    children: [
                                      (0, s.jsxs)("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                          (0, s.jsx)("div", {
                                            className: `w-2 h-2 rounded-full ${r ? "bg-emerald-500" : "bg-muted-foreground/20"}`,
                                          }),
                                          (0, s.jsx)("span", { children: e.name }),
                                        ],
                                      }),
                                      (0, s.jsx)("span", {
                                        className: "text-xs text-muted-foreground",
                                        children: u?.isAdmin
                                          ? "admin"
                                          : t
                                            ? "role"
                                            : n
                                              ? "custom"
                                              : "—",
                                      }),
                                    ],
                                  },
                                  e.key,
                                );
                              }),
                            }),
                          ],
                        },
                        e,
                      ),
                    ),
                  ],
                }),
              ],
            }),
          ],
        }),
      });
    }
    e.s(
      [
        "default",
        0,
        () => {
          const {
              organization: e,
              membership: n,
              memberships: a,
              isLoaded: c,
            } = (0, r.useOrganization)({ memberships: { pageSize: 50 } }),
            [l, p] = (0, x.useState)(!1),
            [f, h] = (0, x.useState)(null);
          if (!c)
            return (0, s.jsx)("div", {
              className: "flex-1 flex items-center justify-center",
              children: (0, s.jsx)("div", {
                className: "animate-pulse text-muted-foreground",
                children: "Loading...",
              }),
            });
          if (!e)
            return (0, s.jsx)("div", {
              className: "flex-1 flex items-center justify-center",
              children: (0, s.jsx)("p", {
                className: "text-muted-foreground",
                children: "No organization found.",
              }),
            });
          const N = a?.data ?? [],
            k = async (s, r) => {
              try {
                await e.inviteMember({ emailAddress: s, role: r }), p(!1), a?.revalidate?.();
              } catch (e) {
                console.error("Invite failed:", e);
              }
            },
            w = async (e) => {
              if (f)
                try {
                  await f.update({ role: e }), a?.revalidate?.();
                } catch (e) {
                  console.error("Role change failed:", e);
                }
            };
          return (0, s.jsx)("div", {
            className: "flex-1 p-8 overflow-y-auto",
            children: (0, s.jsxs)("div", {
              className: "max-w-4xl",
              children: [
                (0, s.jsxs)("div", {
                  className: "flex items-center justify-between mb-8",
                  children: [
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsx)("h1", { className: "text-2xl font-semibold", children: e.name }),
                        (0, s.jsx)("p", {
                          className: "text-muted-foreground",
                          children: "Manage members and access",
                        }),
                      ],
                    }),
                    (0, s.jsxs)("button", {
                      onClick: () => p(!0),
                      className:
                        "inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors",
                      children: [(0, s.jsx)(m, { size: 16 }), "Invite"],
                    }),
                  ],
                }),
                (0, s.jsxs)("div", {
                  className: "grid grid-cols-3 gap-4 mb-8",
                  children: [
                    (0, s.jsx)(v, {
                      icon: (0, s.jsx)(g.Users, { size: 20, className: "text-muted-foreground" }),
                      label: "Members",
                      value: String(N.length),
                    }),
                    (0, s.jsx)(v, {
                      icon: (0, s.jsx)(o.Building2, {
                        size: 20,
                        className: "text-muted-foreground",
                      }),
                      label: "Departments",
                      value: String(t.DEPARTMENTS.length),
                    }),
                    (0, s.jsx)(v, {
                      icon: (0, s.jsx)(u, { size: 20, className: "text-muted-foreground" }),
                      label: "Your Role",
                      value: i.ROLES[n?.role]?.name ?? "Member",
                    }),
                  ],
                }),
                (0, s.jsx)("div", {
                  className: "rounded-lg border",
                  children: (0, s.jsxs)("table", {
                    className: "w-full",
                    children: [
                      (0, s.jsx)("thead", {
                        children: (0, s.jsxs)("tr", {
                          className: "border-b bg-muted/50",
                          children: [
                            (0, s.jsx)("th", {
                              className:
                                "text-left text-xs font-medium text-muted-foreground px-4 py-3",
                              children: "Member",
                            }),
                            (0, s.jsx)("th", {
                              className:
                                "text-left text-xs font-medium text-muted-foreground px-4 py-3",
                              children: "Role",
                            }),
                            (0, s.jsx)("th", {
                              className:
                                "text-left text-xs font-medium text-muted-foreground px-4 py-3",
                              children: "Joined",
                            }),
                            (0, s.jsx)("th", { className: "w-10" }),
                          ],
                        }),
                      }),
                      (0, s.jsx)("tbody", {
                        children: N.map((e) =>
                          (0, s.jsxs)(
                            "tr",
                            {
                              className:
                                "border-b last:border-0 hover:bg-muted/30 transition-colors cursor-pointer",
                              onClick: () => h(e),
                              children: [
                                (0, s.jsx)("td", {
                                  className: "px-4 py-3",
                                  children: (0, s.jsxs)("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                      e.publicUserData?.imageUrl
                                        ? (0, s.jsx)("img", {
                                            src: e.publicUserData?.imageUrl,
                                            alt: "",
                                            className: "w-8 h-8 rounded-full",
                                          })
                                        : (0, s.jsx)("div", {
                                            className:
                                              "w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium",
                                            children: (
                                              e.publicUserData?.firstName?.[0] ??
                                              e.publicUserData?.identifier?.[0] ??
                                              "?"
                                            ).toUpperCase(),
                                          }),
                                      (0, s.jsxs)("div", {
                                        children: [
                                          (0, s.jsx)("p", {
                                            className: "text-sm font-medium",
                                            children:
                                              [
                                                e.publicUserData?.firstName,
                                                e.publicUserData?.lastName,
                                              ]
                                                .filter(Boolean)
                                                .join(" ") || "—",
                                          }),
                                          (0, s.jsx)("p", {
                                            className: "text-xs text-muted-foreground",
                                            children: e.publicUserData?.identifier,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                }),
                                (0, s.jsx)("td", {
                                  className: "px-4 py-3",
                                  children: (0, s.jsx)(b, { role: e.role }),
                                }),
                                (0, s.jsx)("td", {
                                  className: "px-4 py-3",
                                  children: (0, s.jsx)("span", {
                                    className: "text-sm text-muted-foreground",
                                    children: new Date(e.createdAt).toLocaleDateString("en-ZA", {
                                      day: "numeric",
                                      month: "short",
                                      year: "numeric",
                                    }),
                                  }),
                                }),
                                (0, s.jsx)("td", {
                                  className: "px-4 py-3",
                                  children: (0, s.jsx)(d, {
                                    size: 16,
                                    className: "text-muted-foreground",
                                  }),
                                }),
                              ],
                            },
                            e.id,
                          ),
                        ),
                      }),
                    ],
                  }),
                }),
                l && (0, s.jsx)(j, { onClose: () => p(!1), onInvite: k }),
                f && (0, s.jsx)(y, { member: f, onClose: () => h(null), onChangeRole: w }),
              ],
            }),
          });
        },
      ],
      70842,
    );
  },
]);
