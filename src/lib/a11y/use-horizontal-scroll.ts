"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseHorizontalScrollResult {
  containerRef: React.RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollLeft: () => void;
  scrollRight: () => void;
}

export function useHorizontalScroll(): UseHorizontalScrollResult {
  const containerRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollability = useCallback(() => {
    const container = containerRef.current;
    if (!container) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    setCanScrollLeft(container.scrollLeft > 1);
    setCanScrollRight(container.scrollLeft < maxScrollLeft - 1);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const rafId = window.requestAnimationFrame(updateScrollability);

    container.addEventListener("scroll", updateScrollability, { passive: true });
    window.addEventListener("resize", updateScrollability);

    return () => {
      window.cancelAnimationFrame(rafId);
      container.removeEventListener("scroll", updateScrollability);
      window.removeEventListener("resize", updateScrollability);
    };
  }, [updateScrollability]);

  const scrollByDirection = useCallback((direction: 1 | -1) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const distance = Math.max(240, Math.round(container.clientWidth * 0.85));
    container.scrollBy({
      left: distance * direction,
      behavior: "smooth",
    });
  }, []);

  const scrollLeft = useCallback(() => {
    scrollByDirection(-1);
  }, [scrollByDirection]);

  const scrollRight = useCallback(() => {
    scrollByDirection(1);
  }, [scrollByDirection]);

  return {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scrollLeft,
    scrollRight,
  };
}
