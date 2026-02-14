"use client";

import styles from "./YouTubeEmbed.module.css";

interface YouTubeEmbedProps {
  videoKey: string;
  title: string;
}

export function YouTubeEmbed({ videoKey, title }: YouTubeEmbedProps) {
  return (
    <div className={styles.embedContainer}>
      <iframe
        src={`https://www.youtube.com/embed/${videoKey}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={styles.iframe}
      />
    </div>
  );
}
