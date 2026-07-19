import { describe, expect, it } from "vitest";
import { catalogItems, catalogSummary } from "../src/data/prompts.generated";
import { filterCatalog, findCatalogItemBySlug, getBackgroundItems, getCategoryStats } from "../src/lib/catalog";
import { buildLivePreviewContent } from "../src/lib/livePreview";

describe("catalog data", () => {
  it("publishes all archived prompts as free working prompts", () => {
    expect(catalogItems).toHaveLength(253);
    expect(catalogSummary.total).toBe(253);
    expect(catalogItems.every((item) => item.access === "free")).toBe(true);
    expect(catalogItems.every((item) => item.prompt.trim().length > 40)).toBe(true);
  });

  it("keeps original and reconstructed source metadata without gating", () => {
    expect(catalogSummary.sourceModes.original).toBe(89);
    expect(catalogSummary.sourceModes.reconstructed).toBe(164);
    expect(catalogItems.some((item) => item.sourceMode === "reconstructed" && item.access === "free")).toBe(true);
  });

  it("supports category, search, and background collections", () => {
    expect(getCategoryStats().some((category) => category.name === "Landing Pages")).toBe(true);
    expect(filterCatalog(catalogItems, "All", "solar").length).toBeGreaterThan(0);
    expect(getBackgroundItems(catalogItems).length).toBe(catalogSummary.media.video + catalogSummary.media.image);
  });

  it("resolves every catalog item to a prompt-driven preview route", () => {
    const original = catalogItems.find((item) => item.sourceMode === "original");
    const reconstructed = catalogItems.find((item) => item.sourceMode === "reconstructed");

    expect(original).toBeDefined();
    expect(reconstructed).toBeDefined();
    expect(catalogItems.every((item) => item.prompt.trim().length > 0)).toBe(true);
    expect(catalogItems.every((item) => findCatalogItemBySlug(item.slug)?.id === item.id)).toBe(true);
    expect(findCatalogItemBySlug(original!.slug)?.id).toBe(original!.id);
  });

  it("extracts safe live preview content with fallbacks", () => {
    const original = catalogItems.find((item) => item.sourceMode === "original")!;
    const content = buildLivePreviewContent(original);

    expect(content.brand.length).toBeGreaterThan(0);
    expect(content.headline.length).toBeGreaterThan(0);
    expect(content.primaryCta.length).toBeGreaterThan(0);
    expect(content.navItems.length).toBeGreaterThanOrEqual(3);
    expect(content.stats).toHaveLength(3);
    expect(content.features).toHaveLength(3);
  });
});
