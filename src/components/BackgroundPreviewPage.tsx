import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { findCatalogItemBySlug } from "../lib/catalog";
import { PreviewToolbar } from "./PreviewToolbar";

const fallbackBackgrounds = [
  "radial-gradient(circle at 24% 18%, rgba(255, 105, 140, .42), transparent 30%), linear-gradient(135deg, #292525, #0d0d0d 70%)",
  "radial-gradient(circle at 76% 24%, rgba(255, 183, 74, .38), transparent 28%), linear-gradient(145deg, #171717, #251b1e 58%, #5b1421)",
  "radial-gradient(circle at 32% 78%, rgba(255, 47, 95, .42), transparent 30%), linear-gradient(160deg, #252525, #111111)",
  "linear-gradient(135deg, #242424, #171717 46%, #3d111b), radial-gradient(circle at 70% 18%, rgba(255, 101, 137, .4), transparent 25%)",
];

export function BackgroundPreviewPage() {
  const { slug } = useParams();
  const item = findCatalogItemBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [slug]);

  if (!item || item.mediaType === "none") {
    return (
      <section className="page-shell py-20">
        <div className="max-w-2xl rounded-[28px] border border-white/10 bg-[#202020] p-8">
          <Link to="/backgrounds" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-white/58 transition-colors hover:text-white">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to backgrounds
          </Link>
          <h1 className="text-4xl font-black tracking-[-0.06em]">Background not found</h1>
          <p className="mt-4 leading-7 text-white/58">This media reference is not available in the local catalogue.</p>
        </div>
      </section>
    );
  }

  const sourceMedia = item.mediaUrl || item.posterUrl || item.animatedUrl;
  const poster = item.posterUrl || item.animatedUrl;
  const canPlayVideo = item.mediaType === "video" && Boolean(item.mediaUrl?.toLowerCase().endsWith(".mp4"));
  const fallback = fallbackBackgrounds[item.sortOrder % fallbackBackgrounds.length];

  return (
    <section className="preview-route min-h-screen bg-[#0b0b0b] text-white">
      <PreviewToolbar
        backTo="/backgrounds"
        backLabel="Back to backgrounds"
        title={item.title}
        sourceLabel={`${item.mediaType} background`}
        sourceMedia={sourceMedia}
        copyText={sourceMedia}
        copyLabel="Copy URL"
      />
      <main className="preview-stage relative min-h-[calc(100dvh-88px)] overflow-hidden bg-[#0b0b0b] pt-[88px]">
        <div className="absolute inset-0" style={{ background: fallback }} />
        {canPlayVideo ? (
          <video
            className="absolute inset-0 h-full w-full object-cover"
            src={item.mediaUrl || undefined}
            poster={poster || undefined}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        ) : poster ? (
          <img className="absolute inset-0 h-full w-full object-cover" src={poster} alt="" />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/8 to-black/10" />
        <div className="relative z-10 flex min-h-[calc(100dvh-88px)] items-end p-6 sm:p-10 lg:p-14">
          <div className="max-w-xl">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/62">Full-screen media reference</p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.06em] sm:text-6xl">{item.title}</h2>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/58">{item.category}</p>
          </div>
        </div>
      </main>
    </section>
  );
}
