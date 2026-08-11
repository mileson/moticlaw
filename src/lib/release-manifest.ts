export type PlatformKey =
  | "darwin-arm64"
  | "darwin-x64"
  | "windows-x64"
  | "windows-arm64"
  | "linux-deb-x64"
  | "linux-deb-arm64"
  | "linux-appimage-x64"
  | "linux-appimage-arm64"
  | "linux-rpm-x64";

export type PlatformGroup = "macos" | "windows" | "linux";

export type ReleaseArchive = {
  id: string;
  platform: PlatformGroup;
  arch: "arm64" | "x64";
  variant: "dmg" | "setup" | "portable" | "deb" | "appimage" | "rpm";
  display_name?: string;
  filename: string;
  relative_path: string;
  url: string;
  sha256?: string;
  size_bytes?: number;
  content_type?: string;
  recommended_for?: string[];
};

export type ReleaseManifest = {
  version: string;
  channel?: string;
  release_date?: string;
  generated_at?: string;
  release_url?: string;
  display_version?: string;
  release_name?: string;
  artifacts: Partial<Record<PlatformKey, { archive: ReleaseArchive }>>;
};

type OssReleaseArtifact = ReleaseArchive;

type OssLatestReleaseManifest = {
  version?: string;
  channel?: string;
  release_date?: string;
  generated_at?: string;
  release_url?: string;
  display_version?: string;
  release_name?: string;
  artifacts?: OssReleaseArtifact[];
};

export const ossLatestReleaseManifestUrl = "https://moticlaw.oss-cn-hangzhou.aliyuncs.com/desktop/releases/latest.json";

const publicPlatformKeys = new Set<PlatformKey>(["darwin-arm64", "darwin-x64", "windows-x64"]);

export const publicPlatformGroups: PlatformGroup[] = ["macos", "windows"];

const platformKeyMap = new Map<string, PlatformKey>([
  ["macos-arm64-dmg", "darwin-arm64"],
  ["macos-x64-dmg", "darwin-x64"],
  ["windows-x64-setup", "windows-x64"],
  ["windows-arm64-setup", "windows-arm64"],
  ["linux-x64-deb", "linux-deb-x64"],
  ["linux-arm64-deb", "linux-deb-arm64"],
  ["linux-x64-appimage", "linux-appimage-x64"],
  ["linux-arm64-appimage", "linux-appimage-arm64"],
  ["linux-x64-rpm", "linux-rpm-x64"],
]);

const semanticVersionPattern = /(?:^|[^\d])v?(\d+\.\d+\.\d+)(?:[^\d]|$)/i;

export function normalizeVersion(value: string | undefined) {
  const match = (value || "").match(semanticVersionPattern);
  return match?.[1] ?? "";
}

export function isPublicPlatformKey(key: PlatformKey) {
  return publicPlatformKeys.has(key);
}

export function isPublicPlatformGroup(group: PlatformGroup) {
  return publicPlatformGroups.includes(group);
}

export function platformKeyForArtifact(artifact: OssReleaseArtifact): PlatformKey | null {
  return platformKeyMap.get(`${artifact.platform}-${artifact.arch}-${artifact.variant}`) ?? null;
}

export function transformOssLatestRelease(payload: OssLatestReleaseManifest): ReleaseManifest | null {
  const version = normalizeVersion(payload.version);
  const sourceArtifacts = Array.isArray(payload.artifacts) ? payload.artifacts : [];
  const artifacts: ReleaseManifest["artifacts"] = {};

  for (const artifact of sourceArtifacts) {
    const key = platformKeyForArtifact(artifact);
    if (!key || !isPublicPlatformKey(key)) continue;
    artifacts[key] = { archive: artifact };
  }

  if (!version || Object.keys(artifacts).length === 0) {
    return null;
  }

  return {
    version,
    channel: payload.channel || "release",
    release_date: payload.release_date,
    generated_at: payload.generated_at,
    release_url: payload.release_url,
    display_version: payload.display_version,
    release_name: payload.release_name,
    artifacts,
  };
}

export async function fetchLatestReleaseManifest(url = ossLatestReleaseManifestUrl): Promise<ReleaseManifest | null> {
  try {
    const response = await fetch(url, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as OssLatestReleaseManifest;
    return transformOssLatestRelease(payload);
  } catch {
    return null;
  }
}
