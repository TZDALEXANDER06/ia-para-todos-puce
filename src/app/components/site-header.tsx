"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "../lib/asset";

type NavLink = {
  href: string;
  label: string;
  cta?: boolean;
};

type SiteHeaderProps = {
  brandHref?: string;
  links?: NavLink[];
};

const defaultLinks: NavLink[] = [
  { href: "/#proyecto", label: "Proyecto" },
  { href: "/#videos", label: "Videos" },
  { href: "/#equipo", label: "Equipo" },
  { href: "/#videos", label: "Ver contenidos", cta: true }
];

export default function SiteHeader({
  brandHref = "/",
  links = defaultLinks
}: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        setScrolled(window.scrollY > 8);
        setProgress(max > 0 ? window.scrollY / max : 0);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <header
      className={`topbar ${scrolled ? "scrolled" : ""} ${
        menuOpen ? "menuOpen" : ""
      }`}
    >
      <div
        className="scrollProgress"
        style={{ "--progress": progress } as React.CSSProperties}
        aria-hidden="true"
      />
      <div className="container">
        <Link className="brand" href={brandHref} aria-label="Ir al inicio">
          <span className="brandMark" aria-hidden="true">
            IA
          </span>
          <span className="brandName">IA para Todos</span>
        </Link>

        <div
          className="headerLogo"
          aria-label="Pontificia Universidad Católica del Ecuador"
        >
          <Image
            src={asset("/images/logo_puce.png")}
            alt="Pontificia Universidad Católica del Ecuador"
            width={608}
            height={156}
            priority
          />
        </div>

        <nav className="navLinks" aria-label="Navegación principal">
          {links.map((link, index) => (
            <Link
              key={`${link.href}-${index}`}
              href={link.href}
              className={link.cta ? "navCta" : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          className="navToggle"
          type="button"
          aria-label="Abrir menú"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
