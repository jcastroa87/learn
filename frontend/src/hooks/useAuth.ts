"use client";

import { useState, useCallback, useEffect } from "react";
import { apiGet, apiPost, apiDelete } from "@/lib/api";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<User>("/api/user");
    if (res.success) {
      setUser(res.data);
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const register = useCallback(
    async (email: string, password: string, passwordConfirmation: string) => {
      const res = await apiPost<User>("/register", {
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
      if (res.success) {
        setUser(res.data);
      }
      return res;
    },
    []
  );

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiPost<User>("/login", { email, password });
    if (res.success) {
      setUser(res.data);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    await apiPost("/logout");
    setUser(null);
  }, []);

  const forgotPassword = useCallback(async (email: string) => {
    return apiPost<{ message: string }>("/forgot-password", { email });
  }, []);

  const resetPassword = useCallback(
    async (
      token: string,
      email: string,
      password: string,
      passwordConfirmation: string
    ) => {
      return apiPost("/reset-password", {
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      });
    },
    []
  );

  const resendVerification = useCallback(async () => {
    return apiPost<{ message: string }>("/email/verification-notification");
  }, []);

  const deleteAccount = useCallback(async () => {
    const res = await apiDelete("/api/user");
    if (res.success) {
      setUser(null);
    }
    return res;
  }, []);

  return {
    user,
    loading,
    register,
    login,
    logout,
    fetchUser,
    forgotPassword,
    resetPassword,
    resendVerification,
    deleteAccount,
  };
}
