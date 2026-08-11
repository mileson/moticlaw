import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "MotiClaw",
    short_name: "MotiClaw",
    description: "本地优先的 AI 智能体控制平台。",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#171411",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icon.svg?v=3",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
