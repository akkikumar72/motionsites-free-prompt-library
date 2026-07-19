import { ArrowLeft, Expand, Link2 } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CopyButton } from "./CopyButton";

export function PreviewToolbar({
  backTo,
  backLabel,
  title,
  sourceLabel,
  sourceMedia,
  copyText,
  copyLabel,
  children,
}: {
  backTo: string;
  backLabel: string;
  title: string;
  sourceLabel?: string;
  sourceMedia?: string | null;
  copyText: string;
  copyLabel: string;
  children?: ReactNode;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  async function toggleFullscreen() {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
        return;
      }
      await document.documentElement.requestFullscreen?.();
    } catch {
      // Fullscreen can be unavailable in embedded browsers; the route remains the preview surface.
    }
  }

  return (
    <header className="preview-toolbar fixed inset-x-0 top-0 z-50 flex h-[88px] items-center gap-3 border-b border-black/10 bg-[#fbfbf8]/95 px-4 text-[#171717] backdrop-blur-xl sm:px-6 lg:px-8">
      <Link
        to={backTo}
        className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl px-2 text-[#5d626a] transition-colors hover:bg-black/[0.06] hover:text-[#171717] sm:px-3"
        aria-label={backLabel}
        title={backLabel}
      >
        <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        <span className="hidden text-sm font-semibold sm:inline">Back</span>
      </Link>
      <div className="flex min-w-0 flex-1 items-center gap-2 text-sm">
        <h1 className="truncate font-bold tracking-[-0.02em] text-[#171717]" title={title}>{title}</h1>
        {sourceLabel ? (
          <span className="hidden shrink-0 text-[10px] font-black uppercase tracking-[0.14em] text-[#9a9da3] lg:inline">
            {sourceLabel}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={toggleFullscreen}
          className="grid h-12 w-10 place-items-center rounded-xl text-[#5d626a] transition-colors hover:bg-black/[0.06] hover:text-[#171717] sm:w-12"
          aria-label={isFullscreen ? "Exit fullscreen preview" : "Open fullscreen preview"}
          title={isFullscreen ? "Exit fullscreen preview" : "Open fullscreen preview"}
        >
          <Expand className="h-5 w-5" aria-hidden="true" />
        </button>
        {sourceMedia ? (
          <a
            href={sourceMedia}
            target="_blank"
            rel="noreferrer"
            className="grid h-12 w-10 place-items-center rounded-xl text-[#5d626a] transition-colors hover:bg-black/[0.06] hover:text-[#171717] sm:w-12"
            aria-label="Open source media"
            title="Open source media"
          >
            <Link2 className="h-5 w-5" aria-hidden="true" />
          </a>
        ) : null}
        {children}
        <CopyButton text={copyText} label={copyLabel} variant="toolbar" />
      </div>
    </header>
  );
}
