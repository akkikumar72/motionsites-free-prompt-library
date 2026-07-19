import { expect, test } from "@playwright/test";

test("homepage, catalogue, dedicated preview, and copy actions work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await expect(page).toHaveTitle(/liro\.prompt.*Free Prompt Library/);
  await expect(page.getByRole("heading", { name: /Unlock your AI Design Superpowers/i })).toBeVisible();
  await expect(page.getByText("Free prompts").last()).toBeVisible();

  await page.getByRole("link", { name: /Browse Free/i }).first().click();
  await expect(page).toHaveURL(/\/landing-pages/);
  await expect(page.getByRole("heading", { name: /Real Landing Pages/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Cinematic Journeys/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Editorial Studios/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Bento Products/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Experimental Worlds/i })).toBeVisible();

  await page.getByPlaceholder("Search prompts").fill("solar");
  await expect(page.getByText(/Solar Energy Hero/i).first()).toBeVisible();
  const solarCard = page.locator("article").filter({ hasText: "Solar Energy Hero" }).first();
  await expect(solarCard.getByRole("link", { name: /Preview Solar Energy Hero/i })).toHaveCount(1);
  await expect(solarCard.getByRole("button")).toHaveCount(0);
  await expect(solarCard.getByText("Live Preview")).toHaveCount(0);
  await solarCard.getByRole("link", { name: /Preview Solar Energy Hero/i }).click();
  await expect(page).toHaveURL(/\/preview\/1-solar-energy-hero/);
  await expect(page.getByRole("link", { name: /Back to catalogue/i })).toBeVisible();
  await page.getByRole("button", { name: /View Prompt/i }).click();
  await expect(page.getByRole("complementary", { name: /Prompt/i })).toBeVisible();
  await page.getByRole("button", { name: /Close prompt/i }).click();
  await expect(page.getByRole("button", { name: /Open fullscreen preview/i })).toBeVisible();
  await page.getByRole("button", { name: /Copy Prompt/i }).click();
  await expect(page.getByRole("button", { name: /Copied/i })).toBeVisible();
});

test("original free prompts open live preview routes", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/landing-pages");
  await page.getByPlaceholder("Search prompts").fill("bold studio");
  await expect(page.getByText("Bold Studio").first()).toBeVisible();
  const editorialCollection = page.getByTestId("curated-editorial-studios");
  const boldStudioPreview = editorialCollection.getByRole("link", { name: "Preview Bold Studio" });
  await expect(boldStudioPreview).toHaveCount(1);
  await boldStudioPreview.click();

  await expect(page).toHaveURL(/\/preview\/20-bold-studio/);
  await expect(page.getByRole("heading", { name: /Bold Studio/i })).toBeVisible();
  await expect(page.getByText(/Original source/i)).toHaveCount(1);
  await expect(page.getByText(/VANGUARD/i).first()).toBeVisible();
  await page.getByRole("button", { name: /Copy Prompt/i }).click();
  await expect(page.getByRole("button", { name: /Copied/i })).toBeVisible();
});

test("prompt-specific original previews render their own designs", async ({ page }) => {
  await page.goto("/preview/60-aetheris-voyage-hero");
  await expect(page.getByText(/Venture/i).first()).toBeVisible();
  await expect(page.getByText(/Maiden Crewed Voyage to Mars Arrives 2026/i)).toBeVisible();
  await expect(page.getByText(/AI Scenery/i)).toBeVisible();

  await page.goto("/preview/999-neo-museum");
  await expect(page.getByText(/TIMELESS/i)).toBeVisible();
  await expect(page.getByText(/Explore Our World/i)).toBeVisible();
  await expect(page.getByText(/Reptiles of the Mesozoic/i)).toBeVisible();
});

test("reconstructed free prompts render live preview routes", async ({ page }) => {
  await page.goto("/preview/1-solar-energy-hero");
  await expect(page.getByText(/Working reconstruction/i)).toHaveCount(1);
  await expect(page.getByRole("heading", { name: /Power the next era with Solar Energy/i })).toBeVisible();
  await expect(page.getByText(/Solar Energy/i).first()).toBeVisible();
});

test("background and gradient copy surfaces render", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/backgrounds");
  await expect(page.getByRole("heading", { name: /Preview media references/i })).toBeVisible();
  await page.getByRole("button", { name: /Copy URL/i }).first().click();
  await expect(page.getByRole("button", { name: /Copied/i }).first()).toBeVisible();
  await page.getByRole("link", { name: /Open full-screen preview for Solar Energy Hero/i }).click();
  await expect(page).toHaveURL(/\/backgrounds\/1-solar-energy-hero/);
  await expect(page.getByRole("heading", { name: /Solar Energy Hero/i })).toHaveCount(2);
  await expect(page.getByRole("link", { name: /Back to backgrounds/i })).toBeVisible();
  await expect(page.getByRole("button", { name: /Copy URL/i })).toBeVisible();

  await page.goto("/gradients");
  await expect(page.getByRole("heading", { name: /Production-ready gradients in high resolution/i })).toBeVisible();
  await page.getByRole("button", { name: /Copy CSS/i }).first().click();
  await expect(page.getByRole("button", { name: /Copied/i }).first()).toBeVisible();
});

test("curated collections remain usable on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/landing-pages");

  await expect(page.getByRole("heading", { name: /Cinematic Journeys/i })).toBeVisible();
  await expect(page.getByRole("heading", { name: /Experimental Worlds/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Preview Aetheris Voyage/i }).first()).toBeVisible();

  const dimensions = await page.evaluate(() => ({
    bodyWidth: document.body.scrollWidth,
    viewportWidth: window.innerWidth,
  }));
  expect(dimensions.bodyWidth).toBeLessThanOrEqual(dimensions.viewportWidth + 1);
});

test("curated collections keep the liro.prompt four-column rhythm", async ({ page }) => {
  await page.goto("/landing-pages");

  const gridLayout = await page.evaluate(() => ({
    columns: Array.from(document.querySelectorAll(".curated-grid")).map(
      (grid) => getComputedStyle(grid).gridTemplateColumns.split(" ").length,
    ),
    viewportWidth: window.innerWidth,
  }));

  const expectedColumns = gridLayout.viewportWidth >= 1024 ? 4 : 1;
  expect(gridLayout.columns).toEqual([expectedColumns, expectedColumns, expectedColumns, expectedColumns]);
});

test("Celestia uses a local poster when its source video is unavailable", async ({ page }) => {
  await page.goto("/landing-pages");

  const collection = page.getByTestId("curated-cinematic-journeys");
  const celestiaCard = collection.locator("article").filter({ hasText: "Celestia" });
  await expect(celestiaCard).toHaveCount(1);

  const poster = celestiaCard.locator("img");
  await expect(poster).toHaveCount(1);
  await expect(poster).toHaveAttribute("src", "/assets/celestia-hero-poster.png");
});
