"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { asset } from "../lib/asset";

const BUBBLE_TEXT = "¡Hola! Aprende conmigo sobre la IA";

type Particle = {
  left: number;
  size: number;
  delay: string;
  duration: string;
};

export default function Hero() {
  const [typed, setTyped] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 16 }, () => ({
        left: Math.round(Math.random() * 100),
        size: 4 + Math.round(Math.random() * 9),
        delay: (Math.random() * 7).toFixed(2),
        duration: (7 + Math.random() * 7).toFixed(2)
      }))
    );

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(BUBBLE_TEXT);
      return;
    }

    let index = 0;
    let timeout: ReturnType<typeof setTimeout>;
    const startDelay = setTimeout(function type() {
      index += 1;
      setTyped(BUBBLE_TEXT.slice(0, index));
      if (index < BUBBLE_TEXT.length) {
        timeout = setTimeout(type, 52);
      }
    }, 1100);

    return () => {
      clearTimeout(startDelay);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="inicio" className="hero">
      <div className="container">
        <div className="heroInner">
          <div className="heroCopy">
            <span className="heroBadge">
              <span className="dot" aria-hidden="true" />
              Proyecto de Vinculación · PUCE Sistemas 2026
            </span>

            <h1 className="heroTitle">
              <span className="line">Aprende sobre</span>
              <span className="line">
                <span className="gradientText">Inteligencia Artificial</span>
              </span>
              <span className="line">con Aurelio</span>
            </h1>

            <p className="heroLead">
              Educación, ética y tecnología para acercar la IA a estudiantes,
              docentes y a toda la comunidad. Videos, recursos y evidencias del
              proyecto en un solo lugar.
            </p>

            <div className="heroActions">
              <Link className="button primary" href="#videos">
                Ver contenidos
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
              <Link className="button secondary" href="#equipo">
                Conoce al equipo
              </Link>
            </div>

            <ul className="heroTrust">
              <li>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                100% gratuito
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Contenido en español
              </li>
              <li>
                <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Hecho en la PUCE
              </li>
            </ul>
          </div>

          <div className="heroStage">
            <div className="stageGlow" aria-hidden="true" />

            <svg className="heroNeural" viewBox="0 0 400 500" fill="none" aria-hidden="true" preserveAspectRatio="xMidYMid slice">
              <line x1="60" y1="90" x2="150" y2="150" />
              <line x1="150" y1="150" x2="90" y2="260" />
              <line x1="150" y1="150" x2="300" y2="120" />
              <line x1="300" y1="120" x2="340" y2="250" />
              <line x1="90" y1="260" x2="70" y2="400" />
              <line x1="340" y1="250" x2="300" y2="410" />
              <line x1="150" y1="150" x2="340" y2="250" />
              <circle cx="60" cy="90" r="5" />
              <circle cx="150" cy="150" r="6" />
              <circle cx="300" cy="120" r="5" />
              <circle cx="90" cy="260" r="4" />
              <circle cx="340" cy="250" r="5" />
              <circle cx="70" cy="400" r="4" />
              <circle cx="300" cy="410" r="5" />
            </svg>

            <div className="heroParticles" aria-hidden="true">
              {particles.map((p, i) => (
                <span
                  key={i}
                  style={{
                    left: `${p.left}%`,
                    width: `${p.size}px`,
                    height: `${p.size}px`,
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`
                  }}
                />
              ))}
            </div>

            <span className="chip chip1">
              <span className="chipDot" aria-hidden="true" />
              IA Generativa
            </span>
            <span className="chip chip2">
              <span className="chipDot" aria-hidden="true" />
              Ética digital
            </span>
            <span className="chip chip3">
              <span className="chipDot" aria-hidden="true" />
              Educación
            </span>

            <div
              className="speechBubble"
              role="img"
              aria-label={BUBBLE_TEXT}
            >
              <span aria-hidden="true">
                {typed}
                <span className="caret">|</span>
              </span>
            </div>

            <div className="heroBearWrap">
              <Image
                className="heroBear"
                src={asset("/images/aurelio-hero.png")}
                alt="Aurelio, la mascota oso de la PUCE, saludando"
                width={636}
                height={1170}
                priority
                unoptimized
              />
              <span className="heroBearShadow" aria-hidden="true" />
            </div>
          </div>
        </div>
      </div>

      <Link className="scrollCue" href="#videos" aria-label="Ver contenidos">
        <span>Explorar</span>
        <span className="mouse" aria-hidden="true" />
      </Link>
    </section>
  );
}
