"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useChildProfile } from "@/hooks/useChildProfile";
import { apiGet, apiDelete } from "@/lib/api";
import Button from "@/components/ui/Button";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/ui/Modal";

interface ArtworkItem {
  id: number;
  activity_type: string;
  thumbnail_url: string;
  created_at: string;
  file_url?: string;
}

export default function GalleryPage() {
  const { t } = useTranslation("ui");
  const { activeChild } = useChildProfile();
  const [artworks, setArtworks] = useState<ArtworkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState<ArtworkItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchArtworks = useCallback(async () => {
    if (!activeChild) return;
    setLoading(true);
    const res = await apiGet<ArtworkItem[]>(`/api/children/${activeChild.id}/artworks?page=${page}&per_page=20`);
    if (res.success) {
      setArtworks(res.data ?? []);
      // Extract total from the response (paginated endpoint includes meta)
      const raw = res as unknown as { meta?: { total?: number } };
      setTotal(raw.meta?.total ?? res.data?.length ?? 0);
    }
    setLoading(false);
  }, [activeChild, page]);

  useEffect(() => {
    fetchArtworks();
  }, [fetchArtworks]);

  const handleView = async (artwork: ArtworkItem) => {
    if (!activeChild) return;
    const res = await apiGet<ArtworkItem>(`/api/children/${activeChild.id}/artworks/${artwork.id}`);
    if (res.success) {
      setViewing({ ...artwork, file_url: res.data?.file_url || artwork.thumbnail_url });
    } else {
      setViewing({ ...artwork, file_url: artwork.thumbnail_url });
    }
  };

  const handleDelete = async () => {
    if (!activeChild || !viewing) return;
    setDeleting(true);
    const res = await apiDelete(`/api/children/${activeChild.id}/artworks/${viewing.id}`);
    if (res.success) {
      setArtworks((prev) => prev.filter((a) => a.id !== viewing.id));
      setTotal((t) => t - 1);
      setViewing(null);
    }
    setDeleting(false);
  };

  if (!activeChild) return <LoadingSpinner className="py-20" />;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4 text-center">{t("gallery")}</h1>

      {loading ? (
        <LoadingSpinner className="py-10" />
      ) : artworks.length === 0 ? (
        <EmptyState
          icon="🎨"
          title={t("no_artworks")}
          description={t("no_artworks_desc")}
        />
      ) : (
        <>
          <p className="text-sm text-zinc-500 text-center mb-3">
            {total} / 50 {t("artworks")}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {artworks.map((artwork) => (
              <button
                key={artwork.id}
                onClick={() => handleView(artwork)}
                className="rounded-xl overflow-hidden border border-zinc-100 hover:shadow-md transition-shadow"
              >
                <img
                  src={artwork.thumbnail_url}
                  alt={artwork.activity_type}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-2 text-xs text-zinc-500">
                  {new Date(artwork.created_at).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>

          {total > 20 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button
                size="sm"
                variant="ghost"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ←
              </Button>
              <span className="text-sm text-zinc-500 self-center">
                {page} / {Math.ceil(total / 20)}
              </span>
              <Button
                size="sm"
                variant="ghost"
                disabled={page >= Math.ceil(total / 20)}
                onClick={() => setPage((p) => p + 1)}
              >
                →
              </Button>
            </div>
          )}
        </>
      )}

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={t("artwork")}
      >
        {viewing && (
          <div className="text-center">
            <img
              src={viewing.file_url || viewing.thumbnail_url}
              alt={viewing.activity_type}
              className="w-full rounded-xl mb-3"
            />
            <p className="text-sm text-zinc-500 mb-3">
              {viewing.activity_type} — {new Date(viewing.created_at).toLocaleDateString()}
            </p>
            <Button
              variant="ghost"
              size="sm"
              loading={deleting}
              onClick={handleDelete}
              className="text-red-500"
            >
              {t("delete")}
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
