"use client";

import { createElement, useEffect, useRef, useState } from "react";

// Wrapper leve de fade+translateY ao entrar na viewport. Respeita
// prefers-reduced-motion via CSS (a transição é anulada globalmente).
export default function Reveal({
  children,
  as = "div",
  className,
  delay,
}: {
  children: React.ReactNode;
  as?: string;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return createElement(
    as,
    {
      ref,
      className: "reveal" + (visible ? " in-view" : "") + (className ? ` ${className}` : ""),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children
  );
}
