import {
  fetchLatestReleaseManifest,
  ossLatestReleaseManifestUrl,
} from "@/lib/release-manifest";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const successResponseHeaders = {
  "Cache-Control": "no-store",
};

const errorResponseHeaders = {
  "Cache-Control": "no-store",
};

export async function GET() {
  const releaseManifestUrl = process.env.MOTICLAW_RELEASE_MANIFEST_URL || ossLatestReleaseManifestUrl;
  const manifest = await fetchLatestReleaseManifest(releaseManifestUrl);

  if (!manifest) {
    return Response.json(
      { error: "latest_release_unavailable" },
      { headers: errorResponseHeaders, status: 502 },
    );
  }

  return Response.json(manifest, { headers: successResponseHeaders });
}
