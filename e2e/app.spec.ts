import { expect, test } from "@playwright/test";

test("homepage, catalogue, modal, and copy actions work", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");

  await expect(page).toHaveTitle(/MotionSites Free Prompt Library/);
  await expect(page.getByRole("heading", { name: /Unlock your AI Design Superpowers/i })).toBeVisible();
  await expect(page.getByText("Free prompts").last()).toBeVisible();

  await page.getByRole("link", { name: /Browse Free/i }).first().click();
  await expect(page).toHaveURL(/\/landing-pages/);
  await expect(page.getByRole("heading", { name: /Real Landing Pages/i })).toBeVisible();

  await page.getByPlaceholder("Search prompts").fill("solar");
  await expect(page.getByText(/Solar Energy Hero/i).first()).toBeVisible();
  const solarCard = page.locator("article").filter({ hasText: "Solar Energy Hero" }).first();
  await expect(solarCard.getByRole("link", { name: /Live Preview/i })).toHaveCount(1);
  await page.getByRole("button", { name: /Preview Solar Energy Hero/i }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("link", { name: /Live Preview/i })).toBeVisible();
  await dialog.getByRole("button", { name: /^Copy Prompt$/i }).click();
  await expect(dialog.getByRole("button", { name: /Copied/i })).toBeVisible();
});

test("original free prompts open live preview routes", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/landing-pages");
  await page.getByPlaceholder("Search prompts").fill("bold studio");
  await expect(page.getByText("Bold Studio").first()).toBeVisible();
  await page.getByRole("link", { name: /Live Preview/i }).click();

  await expect(page).toHaveURL(/\/preview\/20-bold-studio/);
  await expect(page.getByRole("heading", { name: /Bold Studio/i })).toBeVisible();
  await expect(page.getByText(/Original source/i)).toBeVisible();
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
  await expect(page.getByText(/Working reconstruction/i)).toBeVisible();
  await expect(page.getByRole("heading", { name: /Power the next era with Solar Energy/i })).toBeVisible();
  await expect(page.getByText(/Solar Energy/i).first()).toBeVisible();
});

test("background and gradient copy surfaces render", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);

  await page.goto("/backgrounds");
  await expect(page.getByRole("heading", { name: /Preview media references/i })).toBeVisible();
  await page.getByRole("button", { name: /Copy URL/i }).first().click();
  await expect(page.getByRole("button", { name: /Copied/i }).first()).toBeVisible();

  await page.goto("/gradients");
  await expect(page.getByRole("heading", { name: /Production-ready gradients in high resolution/i })).toBeVisible();
  await page.getByRole("button", { name: /Copy CSS/i }).first().click();
  await expect(page.getByRole("button", { name: /Copied/i }).first()).toBeVisible();
});
