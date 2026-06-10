import Image from "next/image";
import { photoUrl } from "@/lib/supabase";
import type { Photo } from "@/lib/supabase";

export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  if (photos.length === 0) return null;

  return (
    <div className="grid grid-cols-3 gap-2">
      {photos.map((photo) => (
        <a
          key={photo.id}
          href={photoUrl(photo.storage_path)}
          target="_blank"
          rel="noreferrer"
          className="relative aspect-square overflow-hidden rounded-lg border border-rose-100 bg-rose-50"
        >
          <Image
            src={photoUrl(photo.storage_path)}
            alt={photo.caption ?? "Date photo"}
            fill
            sizes="(max-width: 448px) 33vw, 150px"
            className="object-cover transition-transform hover:scale-105"
          />
        </a>
      ))}
    </div>
  );
}
