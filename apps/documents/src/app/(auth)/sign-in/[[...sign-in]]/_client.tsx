"use client";

import { SignIn } from "@clerk/clerk-react";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-muted">
      <SignIn />
    </div>
  );
}
