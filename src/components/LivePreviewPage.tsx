import { ArrowLeft, FileText, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findCatalogItemBySlug } from "../lib/catalog";
import { PromptLiveRenderer } from "./PromptLiveRenderer";
import { PreviewToolbar } from "./PreviewToolbar";

export function LivePreviewPage() {
  const { slug } = useParams();
  const item = findCatalogItemBySlug(slug);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    setShowPrompt(false);
  }, [slug]);

  useEffect(() => {
    if (!showPrompt) return;

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setShowPrompt(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showPrompt]);

  if (!item) {
    return (
      <PreviewMessage
        title="Preview not found"
        copy="This preview route does not match a prompt in the local catalog."
      />
    );
  }

  const sourceLabel = item.sourceMode === "original" ? "Original source" : "Working reconstruction";

  return (
    <section className="preview-route min-h-screen bg-[#f4f4f1] text-[#171717]">
      <PreviewToolbar
        backTo="/landing-pages"
        backLabel="Back to catalogue"
        title={item.title}
        sourceLabel={sourceLabel}
        sourceMedia={item.mediaUrl || item.posterUrl}
        copyText={item.prompt}
        copyLabel="Copy Prompt"
      >
        <button
          type="button"
          onClick={() => setShowPrompt((visible) => !visible)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-4 text-sm font-semibold text-[#171717] shadow-sm transition-colors hover:border-black/20 hover:bg-[#f4f4f1]"
          aria-label="View Prompt"
          aria-expanded={showPrompt}
          aria-controls="preview-prompt-panel"
          title="View Prompt"
        >
          <FileText className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">View Prompt</span>
        </button>
      </PreviewToolbar>

      {showPrompt ? (
        <aside
          id="preview-prompt-panel"
          className="fixed right-3 top-[100px] z-40 flex max-h-[calc(100dvh-116px)] w-[min(560px,calc(100vw-24px))] flex-col overflow-hidden rounded-2xl border border-black/10 bg-[#1c1c1c] text-white shadow-[0_24px_90px_rgba(0,0,0,0.28)] sm:right-6"
          aria-label="Prompt"
        >
          <div className="flex shrink-0 items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/45">Prompt</p>
              <p className="mt-1 truncate text-sm font-semibold text-white/85">{item.title}</p>
            </div>
            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/55 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close prompt"
              title="Close prompt"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
          <pre className="overflow-auto whitespace-pre-wrap px-5 py-5 font-mono text-[12px] leading-6 text-white/70">{item.prompt}</pre>
        </aside>
      ) : null}

      <div className="preview-stage min-h-[calc(100dvh-88px)] pt-[88px]">
        <PromptLiveRenderer item={item} />
      </div>
    </section>
  );
}

function PreviewMessage({ title, copy }: { title: string; copy: string }) {
  return (
    <section className="page-shell py-20">
      <div className="max-w-2xl rounded-[28px] border border-white/10 bg-[#202020] p-8">
        <Link to="/landing-pages" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition-colors hover:text-white">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to catalog
        </Link>
        <h1 className="text-4xl font-black tracking-[-0.06em]">{title}</h1>
        <p className="mt-4 leading-7 text-white/58">{copy}</p>
      </div>
    </section>
  );
}
