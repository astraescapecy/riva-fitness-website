"use client";

import Image from "next/image";

type RivaLogoProps = {
  size?: number;
  priority?: boolean;
};

export function RivaLogo({ size = 72, priority = false }: RivaLogoProps) {
  return (
    <Image
      className="logo"
      src="/riva-logo.png"
      alt="Riva Fitness"
      width={size}
      height={size}
      priority={priority}
    />
  );
}
