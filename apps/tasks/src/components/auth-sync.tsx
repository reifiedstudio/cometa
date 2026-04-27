"use client";

import { setTokenGetter } from "@/lib/api";
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";

export function AuthSync() {
  const { getToken } = useAuth();

  useEffect(() => {
    setTokenGetter(getToken);
  }, [getToken]);

  return null;
}
