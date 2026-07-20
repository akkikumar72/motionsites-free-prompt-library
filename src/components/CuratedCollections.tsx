import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import type { CatalogItem } from "../data/prompts.generated";
import { cardMotionStyle, resetCardPointer, updateCardPointer } from "../lib/cardMotion";
import { MediaFrame } from "./MediaFrame";

type CollectionDefinition = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  slugs: readonly string[];
};

const collectionDefinitions: readonly CollectionDefinition[] = [
  {
    id: "cinematic-journeys",
    eyebrow: "Collection 01 / immersive direction",
    title: "Cinematic Journeys",
    description: "Long-form hero compositions for travel, space, and stories that need room to breathe.",
    slugs: [
      "60-aetheris-voyage-hero",
      "999-travel-hero",
      "260-celestia-hero",
      "240-portal-hero",
      "999-wanderful-hero",
      "80-vex-ventures-hero",
    ],
  },
  {
    id: "editorial-studios",
    eyebrow: "Collection 02 / art direction",
    title: "Editorial Studios",
    description: "Confident typography, deliberate contrast, and agency systems built to make the work feel authored.",
    slugs: [
      "25-prisma-landing",
      "20-bold-studio",
      "30-3d-jack-portfolio-hero",
      "40-velorah-hero",
      "340-vortex-studio-hero",
      "999-creative-studio",
    ],
  },
  {
    id: "bento-products",
    eyebrow: "Collection 03 / product systems",
    title: "Bento Products",
    description: "Modular product stories with clear hierarchy, flexible surfaces, and enough density to sell the system.",
    slugs: [
      "70-codercrest-hero",
      "480-nexora-hero",
      "280-mindloop-landing",
      "220-securify-hero",
      "560-taskly-hero",
      "600-datacore-booking-hero",
    ],
  },
  {
    id: "experimental-worlds",
    eyebrow: "Collection 04 / unconventional systems",
    title: "Experimental Worlds",
    description: "Web3, portfolio, and future-facing references for pages that should feel more like an environment than a template.",
    slugs: [
      "50-9",
      "180-orbis-nft-landing",
      "200-portfolio-cosmic-hero",
      "999-cyberpunk-reveal",
      "160-innovation-landing",
      "999-dreamcore-landing",
    ],
  },
];

export function CuratedCollections({ items }: { items: readonly CatalogItem[] }) {
  const availableItems = new Map(items.map((item) => [item.slug, item]));
  const collections = collectionDefinitions
    .map((definition) => ({
      ...definition,
      items: definition.slugs
        .map((slug) => availableItems.get(slug))
        .filter((item): item is CatalogItem => Boolean(item)),
    }))
    .filter((collection) => collection.items.length > 0);

  if (collections.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="curated-collections-title">
      <div className="mb-7 flex flex-col gap-3 border-t border-white/10 pt-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-[#b8a5ff]">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Curated directions
          </p>
          <h2 id="curated-collections-title" className="text-2xl font-black tracking-[-0.045em] text-white sm:text-3xl">
            Four directions, one free catalogue
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-white/48">
          A quick route through the archive, grouped by composition and creative intent. Every tile still uses the same prompt, media, and live-preview actions as the main grid.
        </p>
      </div>

      <div className="space-y-16">
        {collections.map((collection) => (
          <CollectionSection key={collection.id} collection={collection} />
        ))}
      </div>
    </section>
  );
}

function CollectionSection({
  collection,
}: {
  collection: CollectionDefinition & { items: CatalogItem[] };
}) {
  return (
    <section className="curated-collection" aria-labelledby={`${collection.id}-title`} data-testid={`curated-${collection.id}`}>
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/38">{collection.eyebrow}</p>
          <h3 id={`${collection.id}-title`} className="text-xl font-black tracking-[-0.04em] text-white sm:text-2xl">
            {collection.title}
          </h3>
        </div>
        <p className="max-w-xl text-sm leading-6 text-white/48 sm:text-right">{collection.description}</p>
      </div>

      <CollectionGrid items={collection.items} />
    </section>
  );
}

function CollectionGrid({
  items,
}: {
  items: CatalogItem[];
}) {
  return (
    <div className="curated-grid grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <CollectionTile key={item.slug} item={item} />
      ))}
    </div>
  );
}

function CollectionTile({ item }: { item: CatalogItem }) {
  return (
    <article
      className="catalog-card collection-tile motion-card group relative isolate flex aspect-square overflow-hidden rounded-[18px] bg-[#262626]"
      style={cardMotionStyle}
      onPointerMove={updateCardPointer}
      onPointerLeave={resetCardPointer}
    >
      <div className="motion-card-sheen" aria-hidden="true" />
      <Link to={`/preview/${item.slug}`} className="relative z-10 flex h-full min-h-0 w-full flex-col text-left" aria-label={`Preview ${item.title}`}>
        <MediaFrame item={item} className="min-h-0 flex-1 w-full" compact />
        <div className="relative flex min-h-[88px] shrink-0 items-center justify-between gap-3 p-4 sm:p-5">
          <div className="min-w-0">
            <h4 className="truncate text-lg font-black leading-6 tracking-[-0.035em] text-white">{item.title}</h4>
            <p className="mt-1 truncate text-[11px] font-black uppercase tracking-[0.15em] text-white/40">{item.originalCategory || item.category}</p>
          </div>
          <span className="shrink-0 pt-1 text-[10px] font-black uppercase tracking-[0.14em] text-white/38 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
            Preview
          </span>
        </div>
      </Link>
    </article>
  );
}
