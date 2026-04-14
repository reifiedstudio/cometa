const CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";

// Extract the Clerk Frontend API URL from the publishable key
// pk_test_<base64> → decode to get the frontend API domain
function getFrontendApiUrl(): string {
  const key = CLERK_PUBLISHABLE_KEY.replace("pk_test_", "").replace("pk_live_", "");
  try {
    const decoded = atob(key);
    // Remove trailing $ if present
    const domain = decoded.endsWith("$") ? decoded.slice(0, -1) : decoded;
    return `https://${domain}`;
  } catch {
    return "";
  }
}

export const FRONTEND_API = getFrontendApiUrl();
