"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "@/i18n/TranslationProvider";
import LanguageSwitcher from "@/i18n/LanguageSwitcher";

// ─── Types ────────────────────────────────────────────────────────────────────

interface NavLink {
  href: string;
  labelKey: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS: NavLink[] = [
  { href: "/", labelKey: "nav.home" },
  { href: "/about", labelKey: "nav.about" },
  { href: "/library", labelKey: "nav.library" },
];

const SCROLL_THRESHOLD = 50;

// ─── Hooks ────────────────────────────────────────────────────────────────────

const useScrolled = (threshold = SCROLL_THRESHOLD) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return isScrolled;
};

const useOutsideClick = (
  refs: React.RefObject<HTMLElement | null>[],
  active: boolean,
  onOutside: () => void,
) => {
  useEffect(() => {
    if (!active) return;

    const handler = (e: Event) => {
      const path: EventTarget[] =
        (e as any).composedPath?.() ?? (e as any).path ?? [];

      const isInside = refs.some((ref) =>
        path.length
          ? ref.current && path.includes(ref.current)
          : ref.current?.contains(e.target as Node),
      );

      if (!isInside) onOutside();
    };

    document.addEventListener("click", handler);
    document.addEventListener("touchend", handler);
    return () => {
      document.removeEventListener("click", handler);
      document.removeEventListener("touchend", handler);
    };
  }, [refs, active, onOutside]);
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const HamburgerIcon: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className="w-6 h-4 relative">
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out
      ${isOpen ? "rotate-45 translate-y-2.5" : "translate-y-0"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out translate-y-2
      ${isOpen ? "opacity-0" : "opacity-100"}`}
    />
    <span
      className={`absolute h-0.5 w-6 bg-current transition-all duration-300 ease-in-out
      ${isOpen ? "-rotate-45 translate-y-2.5" : "translate-y-4"}`}
    />
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const NavbarPublic: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const isScrolled = useScrolled();
  const pathname = usePathname();
  const { t } = useTranslation();

  const closeMenu = useCallback(() => setIsMenuOpen(false), []);

  useOutsideClick(
    [menuRef, buttonRef as React.RefObject<HTMLElement>],
    isMenuOpen,
    closeMenu,
  );

  // Scroll to top if already on the target page, otherwise navigate normally
  const handleNavClick = useCallback(
    (targetPath: string, e: React.MouseEvent) => {
      if (pathname === targetPath) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      closeMenu();
    },
    [pathname, closeMenu],
  );

  if (pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <nav
      aria-label="Main navigation"
      className="fixed left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-[calc(100%-5rem)] max-w-7xl top-5 z-100"
    >
      <div
        className={`
        relative w-full backdrop-blur-sm transition-all duration-500 ease-out overflow-hidden rounded-4xl
        ${isMenuOpen ? "" : "h-16"}
        ${isScrolled ? "bg-black md:bg-black/60" : "bg-black md:bg-transparent"}
      `}
      >
        {/* ── Top bar ── */}
        <div className="flex h-16 items-center justify-between px-8 md:px-10">
          {/* Logo + Language */}
          <div className="flex items-center gap-4">
            <Link href="/" onClick={(e) => handleNavClick("/", e)}>
              <Image
                src="/bacwayLogoWhite.svg"
                alt="Bacway"
                width={80}
                height={18}
                className="h-4.5"
              />
            </Link>
            <LanguageSwitcher />
          </div>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 text-sm">
            {NAV_LINKS.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                className="text-white/80 hover:text-white transition-colors duration-200"
                onClick={(e) => handleNavClick(href, e)}
              >
                <span suppressHydrationWarning>{t(labelKey)}</span>
              </Link>
            ))}

            {/* Contribute CTA */}
            <Link
              href="/contribute"
              className="text-white border border-white/40 hover:border-white/80 hover:bg-white/5 rounded-2xl px-5 py-1.5 transition-all duration-200"
              onClick={(e) => handleNavClick("/contribute", e)}
            >
              <span suppressHydrationWarning>{t("nav.contribute")}</span>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={buttonRef}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
            className="md:hidden p-2 w-10 h-10 text-white flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen((prev) => !prev);
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
          >
            <HamburgerIcon isOpen={isMenuOpen} />
          </button>
        </div>

        {/* ── Mobile menu ── */}
        <div
          id="mobile-menu"
          ref={menuRef}
          className={`md:hidden transition-all duration-500 ease-in-out overflow-hidden origin-top
            ${isMenuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0 pointer-events-none"}
          `}
        >
          <div
            className={`flex flex-col items-center py-4 gap-4 transition-all duration-500
            ${isMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"}
          `}
          >
            {NAV_LINKS.map(({ href, labelKey }) => (
              <Link
                key={href}
                href={href}
                className="w-full text-center py-2 text-white/80 hover:text-white transition-colors"
                onClick={(e) => handleNavClick(href, e)}
              >
                <span suppressHydrationWarning>{t(labelKey)}</span>
              </Link>
            ))}

            {/* Contribute CTA */}
            <Link
              href="/contribute"
              className="border border-white/40 rounded-2xl px-8 py-1.5 text-white hover:bg-white/5 transition-all duration-200"
              onClick={(e) => handleNavClick("/contribute", e)}
            >
              <span suppressHydrationWarning>{t("nav.contribute")}</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarPublic;
