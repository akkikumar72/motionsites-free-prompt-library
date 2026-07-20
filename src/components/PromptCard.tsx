import { Link } from "react-router-dom";
import type { CatalogItem } from "../data/prompts.generated";
import { cardMotionStyle, resetCardPointer, updateCardPointer } from "../lib/cardMotion";
import { MediaFrame } from "./MediaFrame";

export function PromptCard({ item }: { item: CatalogItem }) {
  return (
    <article
      className="catalog-card motion-card group relative isolate flex aspect-square overflow-hidden rounded-[16px] bg-[#262626]"
      style={cardMotionStyle}
      onPointerMove={updateCardPointer}
      onPointerLeave={resetCardPointer}
    >
      <div className="motion-card-sheen" aria-hidden="true" />
      <Link to={`/preview/${item.slug}`} className="relative z-10 flex h-full min-h-0 w-full flex-col text-left" aria-label={`Preview ${item.title}`}>
        <MediaFrame item={item} className="min-h-0 flex-1 rounded-b-[10px] rounded-t-[16px]" compact />
        <div className="relative flex min-h-[88px] shrink-0 items-center justify-between gap-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-lg font-bold leading-6 tracking-[-0.03em] text-[#f5f5f5]">
                {item.title}
              </p>
              <p className="mt-1 truncate text-sm font-medium text-[#ababab]">{item.originalCategory || item.category}</p>
            </div>
            <span className="shrink-0 pt-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/38 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
              Preview
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
