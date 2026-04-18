"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { Upload, X, GripVertical } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export interface PhotoItem {
  id?: string;
  url: string;
  file?: File;
  storage_path?: string;
  position: number;
}

interface PhotoUploaderProps {
  photos: PhotoItem[];
  onChange: (photos: PhotoItem[]) => void;
  salonId?: string;
}

export function PhotoUploader({ photos, onChange, salonId }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = useCallback(
    (files: FileList) => {
      const newPhotos: PhotoItem[] = [];
      const maxPosition = photos.length;

      Array.from(files).forEach((file, i) => {
        if (!file.type.startsWith("image/")) return;
        newPhotos.push({
          url: URL.createObjectURL(file),
          file,
          position: maxPosition + i,
        });
      });

      onChange([...photos, ...newPhotos]);
    },
    [photos, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        handleFiles(e.dataTransfer.files);
      }
    },
    [handleFiles]
  );

  const removePhoto = useCallback(
    (index: number) => {
      const updated = photos.filter((_, i) => i !== index).map((p, i) => ({
        ...p,
        position: i,
      }));
      onChange(updated);
    },
    [photos, onChange]
  );

  const handleDragStart = (index: number) => {
    setDragIndex(index);
  };

  const handleDragOverItem = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    const updated = [...photos];
    const [moved] = updated.splice(dragIndex, 1);
    updated.splice(index, 0, moved);
    onChange(updated.map((p, i) => ({ ...p, position: i })));
    setDragIndex(index);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  async function uploadAllPhotos(targetSalonId: string): Promise<{ storage_path: string; url: string; position: number }[]> {
    setUploading(true);
    const supabase = createClient();
    const results: { storage_path: string; url: string; position: number }[] = [];

    for (const photo of photos) {
      if (photo.file) {
        const ext = photo.file.name.split(".").pop();
        const path = `${targetSalonId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

        const { error } = await supabase.storage
          .from("salon-photos")
          .upload(path, photo.file, { upsert: true });

        if (!error) {
          const { data: { publicUrl } } = supabase.storage
            .from("salon-photos")
            .getPublicUrl(path);

          results.push({
            storage_path: path,
            url: publicUrl,
            position: photo.position,
          });
        }
      } else if (photo.storage_path) {
        results.push({
          storage_path: photo.storage_path,
          url: photo.url,
          position: photo.position,
        });
      }
    }

    setUploading(false);
    return results;
  }

  return (
    <div>
      <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-2">
        Photos ({photos.length})
      </label>

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer ${
          dragOver
            ? "border-gold bg-gold/5"
            : "border-gold/20 hover:border-gold/40"
        }`}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.accept = "image/*";
          input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files;
            if (files) handleFiles(files);
          };
          input.click();
        }}
      >
        <Upload className="w-8 h-8 text-gold/40 mx-auto mb-2" />
        <p className="font-[var(--font-montserrat)] text-xs text-text-secondary">
          Glissez vos photos ici ou <span className="text-gold-dark font-semibold">cliquez pour sélectionner</span>
        </p>
        <p className="font-[var(--font-montserrat)] text-[10px] text-text-secondary/60 mt-1">
          JPEG, PNG, WebP — max 10 MB par photo
        </p>
      </div>

      {/* Photo grid with drag reorder */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2 mt-4">
          {photos.map((photo, index) => (
            <div
              key={photo.url + index}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDragEnd={handleDragEnd}
              className={`relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-grab active:cursor-grabbing ${
                dragIndex === index
                  ? "border-gold scale-95 opacity-60"
                  : "border-transparent hover:border-gold/30"
              } ${index === 0 ? "ring-2 ring-gold ring-offset-1" : ""}`}
            >
              <Image
                src={photo.url}
                alt={`Photo ${index + 1}`}
                fill
                className="object-cover"
                sizes="150px"
              />

              {/* Drag handle */}
              <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <GripVertical className="w-4 h-4 text-white drop-shadow-lg" />
              </div>

              {/* Position badge */}
              {index === 0 && (
                <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-gold rounded text-[9px] font-bold text-white">
                  Cover
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-1 right-1 w-6 h-6 flex items-center justify-center rounded-full bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {uploading && (
        <p className="font-[var(--font-montserrat)] text-xs text-gold-dark mt-2">
          Upload en cours...
        </p>
      )}
    </div>
  );
}
