"use client";

import { useEffect, useRef } from "react";

const HERO_VIDEO = "/hero-bg.mov";

export function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute("webkit-playsinline", "true");

    const play = () => {
      void video.play().catch(() => {
        /* Autoplay blocked — scrim still covers the page */
      });
    };

    if (video.readyState >= 2) play();
    else video.addEventListener("loadeddata", play, { once: true });

    return () => video.removeEventListener("loadeddata", play);
  }, []);

  return (
    <div className="video-background" aria-hidden="true">
      <div className="video-background__media">
        <video
          ref={videoRef}
          className="video-background__video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={HERO_VIDEO} type="video/quicktime" />
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      </div>
      <div className="video-background__scrim" />
      <div className="video-background__glow" />
    </div>
  );
}
