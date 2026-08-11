import type { Locale } from "@/lib/locale";

export type LocalizedText = Readonly<Record<Locale, string>>;

export type ContentImage = {
  src: string;
  width: number;
  height: number;
  alt: LocalizedText;
};

type FigureBase = ContentImage & {
  id: string;
  caption: LocalizedText;
};

export type ContentFigure =
  | (FigureBase & { kind: "scene" | "concept" })
  | (FigureBase & {
      kind: "screenshot";
      capturedAt: string;
      appVersion: string;
      dataMode?: "synthetic" | "live-public";
      scenarioId?: string;
      fixtureVersion?: string;
      fixtureSha256?: string;
      productGitDirty?: false;
      productGitSha?: string;
    });

export type ContentSource = {
  title: string;
  url: string;
  accessedAt: string;
};
