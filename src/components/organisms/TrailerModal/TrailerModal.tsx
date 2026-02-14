"use client";

import { YouTubeEmbed } from "@/components/molecules/YouTubeEmbed";
import { Trailer } from "@/lib/imdb";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import styles from "./TrailerModal.module.css";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailers: Trailer[];
}

function selectBestTrailer(trailers: Trailer[]): Trailer | null {
  if (!trailers || trailers.length === 0) return null;

  // Priority order:
  // 1. Official trailers
  // 2. Official teasers
  // 3. Non-official trailers
  // 4. First available video
  return (
    trailers.find((t) => t.official && t.type === "Trailer") ||
    trailers.find((t) => t.official && t.type === "Teaser") ||
    trailers.find((t) => t.type === "Trailer") ||
    trailers[0]
  );
}

export default function TrailerModal({ isOpen, onClose, trailers }: TrailerModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const trailer = selectBestTrailer(trailers);

  useEffect(() => {
    if (!isOpen) return;

    // Store the element that opened the modal
    previousActiveElement.current = document.activeElement as HTMLElement;

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Focus the close button
    closeButtonRef.current?.focus();

    // Handle ESC key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    // Handle Tab key for focus trap
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !modalRef.current) return;

      const focusableElements = modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.addEventListener("keydown", handleTab);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("keydown", handleTab);

      // Restore focus to the element that opened the modal
      previousActiveElement.current?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trailer) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-title"
    >
      <div className={styles.modalContent} ref={modalRef}>
        <div className={styles.modalHeader}>
          <h2 id="trailer-title" className={styles.modalTitle}>
            {trailer.name}
          </h2>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close trailer"
          >
            ×
          </button>
        </div>

        <div className={styles.modalBody}>
          <YouTubeEmbed videoKey={trailer.key} title={trailer.name} />
        </div>
      </div>
    </div>,
    document.body,
  );
}
