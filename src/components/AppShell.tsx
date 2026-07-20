import { ArrowUpRight, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { catalogSummary } from "../data/prompts.generated";
import { LiroMark } from "./LiroMark";

const navItems = [
  { label: "Sections", to: "/landing-pages" },
  { label: "Backgrounds", to: "/backgrounds" },
  { label: "Gradients", to: "/gradients" },
  { label: "Contact Us", to: "/contact" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isPreviewRoute = pathname.startsWith("/preview/") || pathname.startsWith("/backgrounds/");

  return (
    <div className={isPreviewRoute ? "min-h-screen overflow-x-clip bg-[#f4f4f1]" : "min-h-screen overflow-x-clip"}>
      {!isPreviewRoute ? <SiteHeader /> : null}

      <main className={isPreviewRoute ? "min-h-screen" : "pt-[84px]"}>{children}</main>
      {!isPreviewRoute ? <Footer /> : null}
    </div>
  );
}

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-40 border-t-2 border-[#b8a5ff] bg-[#141516]/96 backdrop-blur-xl">
        <nav className="page-shell flex h-[84px] items-center justify-between gap-5">
          <NavLink
            to="/"
            className="group flex min-w-0 items-center gap-3 rounded-2xl px-1 py-2 transition-colors hover:bg-white/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            aria-label="liro.prompt home"
          >
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[14px] bg-white/[0.04] ring-1 ring-white/10 transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105">
              <LiroMark className="h-9 w-9" />
            </span>
            <span className="leading-none">
              <span className="block text-[21px] font-black lowercase tracking-[-0.05em] text-white">liro.prompt</span>
              <span className="sr-only">Prompt Library</span>
            </span>
          </NavLink>

          <div className="hidden flex-1 justify-center lg:flex">
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative inline-flex h-12 items-center px-4 text-[15px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141516] ${
                      isActive ? "font-bold text-white" : "font-semibold text-[#a8a8a8] hover:text-white"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="hidden items-center gap-5 lg:flex">
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#a8a8a8]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              {catalogSummary.total} prompts
            </span>
            <NavLink
              to="/landing-pages"
              className="inline-flex h-11 items-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.08] px-4 text-sm font-bold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] transition-colors hover:border-white/25 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141516]"
            >
              Explore
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </NavLink>
          </div>

          <button
            className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/12 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717] lg:hidden"
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
        </nav>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-50 bg-[#171717]/96 backdrop-blur-xl lg:hidden" role="dialog" aria-modal="true">
          <div className="page-shell flex h-20 items-center justify-between">
            <NavLink to="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 text-xl font-black lowercase tracking-[-0.05em] text-white">
              <LiroMark className="h-8 w-8" />liro.prompt
            </NavLink>
            <button
              className="grid h-11 w-11 place-items-center rounded-[14px] border border-white/12 bg-white/[0.04] text-white transition-colors hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close navigation"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="page-shell pt-10">
            <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/38">Explore the library</p>
            <div className="divide-y divide-white/10 border-y border-white/10">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-16 items-center justify-between gap-3 text-2xl font-black tracking-[-0.04em] text-white transition-colors hover:text-[#d9caff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#a47cff]"
                >
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
            <NavLink
              to="/landing-pages"
              onClick={() => setMenuOpen(false)}
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-[14px] bg-white px-5 text-sm font-bold text-[#171717] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a47cff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#171717]"
            >
              Browse
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </NavLink>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 py-12">
      <div className="page-shell grid gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <LiroMark className="h-8 w-8" />
            <span className="text-xl font-black lowercase tracking-[-0.05em]">liro.prompt</span>
          </div>
          <p className="mt-5 max-w-md text-sm leading-6 text-white/52">
            A free prompt catalogue built from the local prompt archive. Copy prompts, preview references, and ship
            landing pages without paid gates.
          </p>
        </div>
        <FooterColumn title="Explore" items={navItems.slice(0, 3)} />
        <FooterColumn title="Info" items={navItems.slice(3)} />
      </div>
    </footer>
  );
}

function FooterColumn({ title, items }: { title: string; items: { label: string; to: string }[] }) {
  return (
    <div>
      <h2 className="text-xs font-black uppercase tracking-[0.18em] text-white/82">{title}</h2>
      <div className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <NavLink key={item.to} to={item.to} className="text-sm text-white/52 transition-colors hover:text-white">
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  );
}
