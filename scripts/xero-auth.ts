#!/usr/bin/env bun
/**
 * One-time Xero OAuth2 authorization script.
 *
 * Run: bun scripts/xero-auth.ts
 *
 * Opens your browser to authorize the Cometa app with Xero.
 * After you click "Allow", it saves the tokens to .env and DynamoDB.
 * You only need to run this once.
 */

const CLIENT_ID = "8A508136A5D748A1B6C4A1C9D32A16C0";
const CLIENT_SECRET = "_6Mbh7txyxDRkpabqjZnGaozz7zFa2IhP7V2klnewW1m_Kwd";
const REDIRECT_URI = "http://localhost:3333/callback";
const SCOPES = "openid profile email offline_access accounting.invoices accounting.payments accounting.contacts accounting.settings";

const AUTH_URL = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&scope=${encodeURIComponent(SCOPES)}`;

console.log("==> Opening browser for Xero authorization...");
console.log(`    URL: ${AUTH_URL}\n`);

// Open browser
const proc = Bun.spawn(["open", AUTH_URL]);
await proc.exited;

// Start local server to catch the callback
const server = Bun.serve({
  port: 3333,
  async fetch(req) {
    const url = new URL(req.url);

    if (url.pathname === "/callback") {
      const code = url.searchParams.get("code");

      if (!code) {
        return new Response("No authorization code received. Check the URL.", { status: 400 });
      }

      console.log("==> Received authorization code, exchanging for tokens...");

      // Exchange code for tokens
      const tokenRes = await fetch("https://identity.xero.com/connect/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: REDIRECT_URI,
        }),
      });

      if (!tokenRes.ok) {
        const err = await tokenRes.text();
        console.error("Token exchange failed:", err);
        return new Response(`Token exchange failed: ${err}`, { status: 500 });
      }

      const tokens = await tokenRes.json();
      console.log("\n==> Tokens received!");
      console.log(`    Access token: ${tokens.access_token.substring(0, 30)}...`);
      console.log(`    Refresh token: ${tokens.refresh_token.substring(0, 30)}...`);
      console.log(`    Expires in: ${tokens.expires_in}s`);

      // Get the tenant ID (org)
      const connectionsRes = await fetch("https://api.xero.com/connections", {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const connections = await connectionsRes.json();
      const tenantId = connections[0]?.tenantId;
      console.log(`    Tenant ID: ${tenantId}`);
      console.log(`    Org name: ${connections[0]?.tenantName}`);

      // Save to a file
      const envContent = `
# Xero API (generated ${new Date().toISOString()})
XERO_CLIENT_ID=${CLIENT_ID}
XERO_CLIENT_SECRET=${CLIENT_SECRET}
XERO_TENANT_ID=${tenantId}
XERO_REFRESH_TOKEN=${tokens.refresh_token}
`;

      await Bun.write("./scripts/.xero-tokens.env", envContent.trim());
      console.log("\n==> Saved to scripts/.xero-tokens.env");
      console.log("    Add XERO_* vars to your .env or Terraform secrets.\n");

      // Also append to root .env
      const envFile = await Bun.file("./.env").text();
      if (!envFile.includes("XERO_CLIENT_ID")) {
        await Bun.write("./.env", envFile.trimEnd() + "\n" + envContent);
        console.log("==> Appended to .env");
      }

      console.log("\n==> Done! You can close this browser tab.");

      // Shutdown after a short delay
      setTimeout(() => {
        server.stop();
        process.exit(0);
      }, 1000);

      return new Response(`
        <html><body style="font-family: system-ui; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0;">
          <div style="text-align: center;">
            <h1>✅ Xero Connected</h1>
            <p>Org: <strong>${connections[0]?.tenantName}</strong></p>
            <p style="color: #666;">Tokens saved. You can close this tab.</p>
          </div>
        </body></html>
      `, { headers: { "Content-Type": "text/html" } });
    }

    return new Response("Waiting for Xero callback...", { status: 200 });
  },
});

console.log(`==> Callback server running on http://localhost:3333`);
console.log("    Waiting for you to authorize in the browser...\n");
