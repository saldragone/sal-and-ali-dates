"use client";

import { useRef, useState } from "react";
import { supabase, PHOTO_BUCKET } from "@/lib/supabase";
import { recordPhoto } from "@/app/actions";

export default function PhotoUploader({
  dateId,
  compact = false,
}: {
  dateId: string;
  compact?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${dateId}/${crypto.randomUUID()}.${ext}`;

        // Upload straight from the browser so big phone photos don't
        // have to squeeze through a server action.
        const { error: uploadError } = await supabase.storage
          .from(PHOTO_BUCKET)
          .upload(path, file, { contentType: file.type });
        if (uploadError) throw new Error(uploadError.message);

        const formData = new FormData();
        formData.set("dateId", dateId);
        formData.set("storagePath", path);
        await recordPhoto(formData);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className={
          compact
            ? "rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-500 transition active:scale-95 disabled:opacity-50"
            : "w-full rounded-lg border-2 border-dashed border-rose-200 bg-white/60 px-4 py-3 text-sm font-semibold text-rose-400 transition active:scale-[0.98] disabled:opacity-50"
        }
      >
        {uploading ? "Uploading..." : "📸 Add photos"}
      </button>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}
