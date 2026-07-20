"use client";

import React, { useCallback, useRef, useState } from "react";
import { File, X, Loader2, CheckCircle2, XCircle, UploadCloud } from "lucide-react";
import { Button } from "./ui/button";
import Typography from "./Typography";
import { MAX_FILE_SIZE_BYTES, MAX_FILE_COUNT, ACCEPTED_FILE_TYPES } from "@/utils/constants";

type FileStatus = "idle" | "processing" | "done" | "failed";

type DropzoneProps = {
  fileStore: File[];
  fileStatuses: Record<number, FileStatus>;
  onFilesAccepted: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  onError: (type: "unsupported_format" | "file_too_large" | "dropzone_error") => void;
  processing: boolean;
};

const acceptedMimeTypes = Object.keys(ACCEPTED_FILE_TYPES);
const acceptedExtensionsLabel = Array.from(new Set(Object.values(ACCEPTED_FILE_TYPES).flat()))
  .map((ext) => ext.replace(/^\./, "").toUpperCase())
  .join(" · ");

export default function Dropzone({ fileStore, fileStatuses, onFilesAccepted, onFileRemove, onError, processing }: DropzoneProps) {
  const [highlight, setHighlight] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isAcceptedType = (file: File) => acceptedMimeTypes.includes(file.type);
  const isAcceptedSize = (file: File) => file.size <= MAX_FILE_SIZE_BYTES;

  const hasValidExtension = (file: File) => {
    const exts = ACCEPTED_FILE_TYPES[file.type] || [];
    return exts.some((ext) => file.name.toLowerCase().endsWith(ext));
  };

  const handleFiles = useCallback(
    (files: FileList | File[]) => {
      try {
        const fileArray = Array.from(files);
        const newFiles: File[] = [];

        for (const file of fileArray) {
          if (!isAcceptedType(file) || !hasValidExtension(file)) {
            onError("unsupported_format");
            return;
          }

          if (!isAcceptedSize(file)) {
            onError("file_too_large");
            return;
          }

          newFiles.push(file);
        }

        if (newFiles.length > 0) {
          onFilesAccepted(newFiles);
        }

        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (error) {
        console.error(error);
        onError("dropzone_error");
      }
    },
    [onError, onFilesAccepted],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      try {
        e.preventDefault();
        setHighlight(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          handleFiles(e.dataTransfer.files);
          e.dataTransfer.clearData();
        }
      } catch (error) {
        console.error(error);
        onError("dropzone_error");
      }
    },
    [onError, handleFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (e.target.files) handleFiles(e.target.files);
      } catch (error) {
        console.error(error);
        onError("dropzone_error");
      }
    },
    [onError, handleFiles],
  );

  return (
    <div className="w-full flex flex-col gap-4 mx-auto max-w-3xl" aria-label="File dropzone">
      <div
        className={`relative flex flex-col items-center justify-center w-full min-h-[300px] p-10 gap-6 rounded-3xl transition-all duration-300 ${
          highlight ? "bg-accent/10 border-accent scale-[1.02] shadow-xl shadow-accent/5" : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md"
        } ${processing ? "opacity-60 cursor-not-allowed grayscale" : "cursor-pointer"} border`}
        onClick={() => {
          if (!processing && fileInputRef.current) {
            fileInputRef.current.click();
          }
        }}
        onDragOver={(e) => {
          if (!processing) {
            e.preventDefault();
            setHighlight(true);
          }
        }}
        onDragLeave={() => {
          if (!processing) setHighlight(false);
        }}
        onDrop={(e) => {
          if (!processing) handleDrop(e);
        }}
      >
        <input ref={fileInputRef} type="file" multiple accept={acceptedMimeTypes.join(",")} onChange={handleChange} className="hidden" />
        <div className="flex flex-col items-center gap-4 text-center">
          <div className={`p-4 rounded-full transition-colors ${highlight ? "bg-accent/20 text-accent" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500"}`}>
            <UploadCloud size={40} strokeWidth={1.5} />
          </div>
          <div className="space-y-1">
            <Typography as="h3" variant="h2" className="text-xl font-medium tracking-tight text-zinc-800 dark:text-zinc-100">
              Select files to strip
            </Typography>
            <Typography as="p" variant="body" className="text-zinc-500 dark:text-zinc-400">
              or drag and drop them here
            </Typography>
          </div>
        </div>
      </div>
      
      {fileStore.length > 0 && (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 p-4 shadow-sm">
          <ul className="w-full flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {fileStore.map((file, index) => {
              const status = fileStatuses[index] ?? "idle";
              return (
                <li key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors group">
                  <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-zinc-500">
                    <File size={20} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography as="p" variant="bodySm" className="truncate font-medium text-zinc-700 dark:text-zinc-300">
                      {file.name}
                    </Typography>
                    <Typography as="p" variant="legal" className="text-zinc-400">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </Typography>
                  </div>
                  <div className="flex items-center gap-2">
                    {status === "processing" && <Loader2 className="size-5 animate-spin text-accent" />}
                    {status === "done" && <CheckCircle2 className="size-5 text-emerald-500" />}
                    {status === "failed" && <XCircle className="size-5 text-red-500" />}
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        onFileRemove(index);
                      }}
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                      disabled={processing}
                    >
                      <X size={18} />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      <Typography variant="legal" className="text-center text-zinc-400 mt-2">
        Supports: {acceptedExtensionsLabel}
      </Typography>
    </div>
  );
}
