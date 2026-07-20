"use client";
import { Button } from "@/components/ui/button";
import Dropzone from "@/components/Dropzone";
import { useState, useEffect } from "react";
import { MAX_FILE_COUNT, MAX_FILE_SIZE_MB } from "@/utils/constants";
import { getFileExtensions } from "@/utils/utils";
import { toast } from "sonner";
import { Loader2, Trash2, Sparkles } from "lucide-react";
import JSZip from "jszip";
import Hero from "@/components/Hero";

type ErrorType = "file_count" | "unsupported_format" | "file_too_large" | "general" | "dropzone_error";

const renameWithSuffix = (file: File, suffix = "_cleaned"): string => {
  const nameParts = file.name.split(".");
  if (nameParts.length < 2) return `${file.name}${suffix}`;
  const ext = nameParts.pop();
  const base = nameParts.join(".");
  return `${base}${suffix}.${ext}`;
};

const showErrorToast = (type: ErrorType) => {
  const messages: Record<ErrorType, { title: string; description: string; severity: "warning" | "error" }> = {
    file_count: {
      title: "Too many files",
      description: `You can only upload up to ${MAX_FILE_COUNT} files.`,
      severity: "warning",
    },
    unsupported_format: {
      title: "Unsupported file format",
      description: `Supported file types: ${getFileExtensions()}`,
      severity: "warning",
    },
    file_too_large: {
      title: "File too large",
      description: `Each file must be under ${MAX_FILE_SIZE_MB}MB.`,
      severity: "warning",
    },
    general: {
      title: "Something went wrong",
      description: "An error occurred while processing your files.",
      severity: "error",
    },
    dropzone_error: {
      title: "Couldn't queue files",
      description: "An error occurred while queuing your files.",
      severity: "error",
    },
  };

  const { title, description, severity } = messages[type];
  const show = severity === "warning" ? toast.warning : toast.error;

  show(title, {
    description,
    duration: 5000,
    dismissible: true,
  });
};

type FileStatus = "idle" | "processing" | "done" | "failed";

export default function Home() {
  const [fileStore, setFileStore] = useState<File[]>([]);
  const [fileStatuses, setFileStatuses] = useState<Record<number, FileStatus>>({});
  const [processing, setProcessing] = useState<boolean>(false);

  const handleFilesAccepted = (newFiles: File[]) => {
    const totalCount = fileStore.length + newFiles.length;
    if (totalCount > MAX_FILE_COUNT) {
      showErrorToast("file_count");
      return;
    }

    setFileStore((prevFiles) => [...prevFiles, ...newFiles].slice(0, MAX_FILE_COUNT));
    toast.success(newFiles.length <= 1 ? "1 file added" : `${newFiles.length} files added`, {
      duration: 1700,
    });
  };

  const handleFileRemoved = (index: number) => {
    setFileStore((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFileStatuses((prev) => {
      const next: Record<number, FileStatus> = {};
      Object.entries(prev).forEach(([k, v]) => {
        const ki = Number(k);
        if (ki < index) next[ki] = v;
        else if (ki > index) next[ki - 1] = v;
      });
      return next;
    });
  };
  
  const handleClearAll = () => {
    setFileStore([]);
    setFileStatuses({});
  };

  const handleMetadataRemoval = async () => {
    setProcessing(true);
    
    try {
      setFileStatuses({});
      await new Promise((res) => setTimeout(res, 1000));

      const { stripImageMetadata, stripPdfMetadata, stripDocxMetadata, stripVideoMetadata, stripAudioMetadata, stripJpegMetadata } =
        await import("@/utils/stripMetadata");

      const cleanedFiles: File[] = [];
      let failedCount = 0;

      for (let i = 0; i < fileStore.length; i++) {
        const file = fileStore[i];
        setFileStatuses((prev) => ({ ...prev, [i]: "processing" }));

        let cleaned: File | null = null;

        if (file.type === "image/jpeg" || file.type === "image/jpg") {
          cleaned = await stripJpegMetadata(file);
        } else if (file.type.startsWith("image/")) {
          cleaned = await stripImageMetadata(file);
        } else if (file.type === "application/pdf") {
          cleaned = await stripPdfMetadata(file);
        } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
          cleaned = await stripDocxMetadata(file);
        } else if (file.type.startsWith("video/")) {
          cleaned = await stripVideoMetadata(file);
        } else if (file.type.startsWith("audio/")) {
          cleaned = await stripAudioMetadata(file);
        } else {
          showErrorToast("unsupported_format");
          setFileStatuses((prev) => ({ ...prev, [i]: "failed" }));
          failedCount++;
          continue;
        }

        if (cleaned) {
          const renamed = new File([cleaned], renameWithSuffix(file), {
            type: cleaned.type,
          });
          cleanedFiles.push(renamed);
          setFileStatuses((prev) => ({ ...prev, [i]: "done" }));
        } else {
          setFileStatuses((prev) => ({ ...prev, [i]: "failed" }));
          failedCount++;
        }
      }

      if (cleanedFiles.length === 1) {
        const file = cleanedFiles[0];
        const url = URL.createObjectURL(file);
        const a = document.createElement("a");
        a.href = url;
        a.download = file.name;
        a.click();
        URL.revokeObjectURL(url);
      } else if (cleanedFiles.length > 1) {
        const zip = new JSZip();
        cleanedFiles.forEach((file) => zip.file(file.name, file));
        const zipBlob = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(zipBlob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "AdiosMetadata_Cleaned.zip";
        a.click();
        URL.revokeObjectURL(url);
      }

      if (failedCount === 0) {
        toast.success("Download ready");
      } else if (cleanedFiles.length > 0) {
        toast.warning(`Download ready - ${failedCount} file${failedCount > 1 ? "s" : ""} failed`);
      } else {
        showErrorToast("general");
      }
    } catch (error) {
      console.error("Error during metadata removal:", error);
      showErrorToast("general");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    document.title = processing ? "Cleaning metadata..." : "Adios Metadata";
  }, [processing]);

  return (
    <div className="w-full flex flex-col h-full items-center fade-in">
      <Hero />
      <div className="w-full max-w-3xl flex flex-col gap-8">
        <Dropzone
          processing={processing}
          fileStore={fileStore}
          fileStatuses={fileStatuses}
          onFilesAccepted={handleFilesAccepted}
          onFileRemove={handleFileRemoved}
          onError={(type: ErrorType) => showErrorToast(type)}
        />
        
        {fileStore.length > 0 && (
          <div className="w-full flex justify-center gap-4 animate-in slide-in-from-bottom-4 fade-in duration-500">
            <Button
              variant="outline"
              className="px-6 py-6 h-auto text-base font-medium rounded-2xl border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all text-zinc-600 dark:text-zinc-400"
              disabled={processing}
              onClick={handleClearAll}
            >
              <Trash2 className="mr-2 size-5" />
              Clear files
            </Button>
            <Button
              className="px-8 py-6 h-auto text-base font-medium rounded-2xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              disabled={processing}
              onClick={handleMetadataRemoval}
            >
              {processing ? (
                <Loader2 className="animate-spin mr-2 size-5" />
              ) : (
                <Sparkles className="mr-2 size-5" />
              )}
              Clean metadata
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
