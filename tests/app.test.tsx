import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("app shell", () => {
  it("renders the free library homepage", () => {
    render(
      <MemoryRouter initialEntries={["/"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /unlock your ai design superpowers/i })).toBeInTheDocument();
    expect(screen.getAllByText(/free prompts/i)[0]).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /browse free/i })[0]).toBeInTheDocument();
  });

  it("opens a dedicated full-screen preview route from the catalogue", async () => {
    render(
      <MemoryRouter initialEntries={["/landing-pages"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    const previewLinks = await screen.findAllByRole("link", { name: /Preview Aetheris Voyage/i });
    await userEvent.click(previewLinks[0]);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to catalogue/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /View Prompt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy Prompt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fullscreen preview/i })).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /View Prompt/i }));
    expect(screen.getByRole("complementary", { name: /Prompt/i })).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Close prompt/i }));
    expect(screen.queryByRole("complementary", { name: /Prompt/i })).not.toBeInTheDocument();
  });

  it("renders the four curated collections from existing catalog entries", () => {
    render(
      <MemoryRouter initialEntries={["/landing-pages"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /Cinematic Journeys/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Editorial Studios/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Bento Products/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Experimental Worlds/i })).toBeInTheDocument();
    expect(screen.getByTestId("curated-cinematic-journeys")).toHaveTextContent("Aetheris Voyage");
    expect(screen.getByTestId("curated-editorial-studios")).toHaveTextContent("Prisma Creative Studio");
  });

  it("renders a live preview route for original source prompts", async () => {
    render(
      <MemoryRouter initialEntries={["/preview/20-bold-studio"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByRole("heading", { name: /Bold Studio/i })).toBeInTheDocument();
    expect(screen.getByText(/Original source/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /copy prompt/i })).toBeInTheDocument();
  });

  it("renders prompt-specific live preview UI for Aetheris Voyage", async () => {
    render(
      <MemoryRouter initialEntries={["/preview/60-aetheris-voyage-hero"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Venture/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Universe/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Maiden Crewed Voyage to Mars Arrives 2026/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Production/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/AI Scenery/i)).toBeInTheDocument();
  });

  it("renders prompt-specific live preview UI for Neo Museum", async () => {
    render(
      <MemoryRouter initialEntries={["/preview/999-neo-museum"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/TIMELESS/i)).toBeInTheDocument();
    expect(screen.getAllByText(/WONDERS/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/Explore Our World/i)).toBeInTheDocument();
    expect(screen.getByText(/Reptiles of the Mesozoic/i)).toBeInTheDocument();
  });

  it("exposes live preview for reconstructed free prompts too", async () => {
    render(
      <MemoryRouter initialEntries={["/landing-pages"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    const search = screen.getByPlaceholderText("Search prompts");
    await userEvent.type(search, "Solar Energy Hero");

    expect(screen.getByRole("link", { name: /Preview Solar Energy Hero/i })).toBeInTheDocument();
  });

  it("renders a reconstructed prompt live preview route", async () => {
    render(
      <MemoryRouter initialEntries={["/preview/1-solar-energy-hero"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect((await screen.findAllByRole("heading", { name: /Solar Energy Hero/i })).length).toBeGreaterThan(0);
    expect(screen.getByText(/Working reconstruction/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Power the next era with Solar Energy/i })).toBeInTheDocument();
  });

  it("renders a full-screen background preview with a route back to backgrounds", async () => {
    render(
      <MemoryRouter initialEntries={["/backgrounds/1-solar-energy-hero"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    expect((await screen.findAllByRole("heading", { name: /Solar Energy Hero/i })).length).toBe(2);
    expect(screen.getByRole("link", { name: /Back to backgrounds/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Copy URL/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Open fullscreen preview/i })).toBeInTheDocument();
  });
});
