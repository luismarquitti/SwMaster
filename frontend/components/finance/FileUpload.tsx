"use client";

import { useState, useRef } from "react";

export default function FileUpload({ onUploadComplete }: { onUploadComplete: () => void }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/finance/upload`, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        onUploadComplete();
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer bg-[var(--surface-container)]
        ${isDragging ? "border-[var(--primary)] bg-[var(--primary)]/5" : "border-[rgba(204,195,213,0.1)] hover:border-[rgba(204,195,213,0.2)]"}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) handleUpload(e.dataTransfer.files[0]);
      }}
      onClick={() => fileInputRef.current?.click()}
    >
      <input type="file" className="hidden" ref={fileInputRef} onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])} />
      <span className="material-symbols-outlined text-4xl mb-3 opacity-40">cloud_upload</span>
      <p className="text-sm font-bold">Drag & drop files here</p>
      <p className="text-[10px] opacity-40 uppercase tracking-widest mt-1">Supports CSV, PDF, PNG, JPG</p>
      {isUploading && <div className="mt-4 text-[10px] font-bold text-[var(--primary)] animate-pulse uppercase tracking-widest">Processing...</div>}
    </div>
  );
}
