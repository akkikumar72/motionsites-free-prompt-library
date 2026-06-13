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

  it("opens a prompt preview modal from the catalogue route", async () => {
    render(
      <MemoryRouter initialEntries={["/landing-pages"]} future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <App />
      </MemoryRouter>,
    );

    const previewButtons = await screen.findAllByRole("button", { name: /preview/i });
    await userEvent.click(previewButtons[0]);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Prompt")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /copy prompt/i }).length).toBeGreaterThan(0);
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

    expect(screen.getByRole("link", { name: /live preview/i })).toBeInTheDocument();
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
});
