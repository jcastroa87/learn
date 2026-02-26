"use client";

import { useState, useCallback, useEffect } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import type { ChildProfile } from "@/types";

const ACTIVE_CHILD_KEY = "gorila_active_child_id";

export function useChildProfile() {
  const [children, setChildren] = useState<ChildProfile[]>([]);
  const [activeChild, setActiveChild] = useState<ChildProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChildren = useCallback(async () => {
    setLoading(true);
    const res = await apiGet<ChildProfile[]>("/api/children");
    if (res.success) {
      setChildren(res.data);

      const savedId = localStorage.getItem(ACTIVE_CHILD_KEY);
      if (savedId) {
        const found = res.data.find((c) => c.id === Number(savedId));
        if (found) {
          setActiveChild(found);
        } else if (res.data.length > 0) {
          setActiveChild(res.data[0]);
        }
      } else if (res.data.length > 0) {
        setActiveChild(res.data[0]);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchChildren();
  }, [fetchChildren]);

  const switchChild = useCallback(
    (child: ChildProfile) => {
      setActiveChild(child);
      localStorage.setItem(ACTIVE_CHILD_KEY, String(child.id));
    },
    []
  );

  const createChild = useCallback(
    async (data: {
      name: string;
      age: number;
      avatar: string;
      language: string;
    }) => {
      const res = await apiPost<ChildProfile>("/api/children", data);
      if (res.success) {
        setChildren((prev) => [...prev, res.data]);
        switchChild(res.data);
      }
      return res;
    },
    [switchChild]
  );

  const updateChild = useCallback(
    async (
      id: number,
      data: Partial<{
        name: string;
        age: number;
        avatar: string;
        language: string;
      }>
    ) => {
      const res = await apiPut<ChildProfile>(`/api/children/${id}`, data);
      if (res.success) {
        setChildren((prev) =>
          prev.map((c) => (c.id === id ? res.data : c))
        );
        if (activeChild?.id === id) {
          setActiveChild(res.data);
        }
      }
      return res;
    },
    [activeChild]
  );

  const deleteChild = useCallback(
    async (id: number) => {
      const res = await apiDelete(`/api/children/${id}`);
      if (res.success) {
        setChildren((prev) => prev.filter((c) => c.id !== id));
        if (activeChild?.id === id) {
          setActiveChild(null);
          localStorage.removeItem(ACTIVE_CHILD_KEY);
        }
      }
      return res;
    },
    [activeChild]
  );

  const refreshActiveChild = useCallback(async () => {
    if (!activeChild) return;
    const res = await apiGet<ChildProfile>(`/api/children/${activeChild.id}`);
    if (res.success) {
      setActiveChild(res.data);
      setChildren((prev) =>
        prev.map((c) => (c.id === activeChild.id ? res.data : c))
      );
    }
  }, [activeChild]);

  return {
    children,
    activeChild,
    loading,
    fetchChildren,
    switchChild,
    createChild,
    updateChild,
    deleteChild,
    refreshActiveChild,
  };
}
