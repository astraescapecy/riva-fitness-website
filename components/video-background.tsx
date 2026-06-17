"use client";

import { useEffect, useRef } from "react";

/** Pexels 3253990 — same free gym clip as Muscle Factory 24 (commercial use OK). */
const PEXELS_VIDEO =
  "https://videos.pexels.com/video-files/3253990/3253990-uhd_2560_1440_24fps.mp4";

const LOCAL_VIDEO = "/fitness-bg.mp4";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;

    const play = () => {
      void video.play().catch(() => {
        /* Autoplay blocked — static scrim still looks fine */
      });
    };

    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });

    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div className="video-background" aria-hidden="true">
      <video
        ref={videoRef}
        className="video-background__video"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/riva-logo.png"
      >
        <source src={LOCAL_VIDEO} type="video/mp4" />
        <source src={PEXELS_VIDEO} type="video/mp4" />
      </video>
      <div className="video-background__scrim" />
      <div className="video-background__glow" />
      <div className="video-background__grain" />
    </div>
  );
}
