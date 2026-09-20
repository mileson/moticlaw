const SEGMENT = /^[a-z0-9][a-z0-9-]{0,119}$/;
const REVISION = /^[0-9a-f]{64}$/;

function apiBase() {
  return (
    process.env.MOTICLAW_SITE_CONTENT_API_BASE_URL ||
    process.env.MOTICLAW_SITE_AUTH_API_BASE_URL ||
    process.env.MOTICLAW_CLOUD_BACKEND_URL ||
    "https://api.moticlaw.com"
  ).replace(/\/$/, "");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string; revision: string; assetId: string }> },
) {
  const { slug, revision, assetId } = await params;
  if (!SEGMENT.test(slug) || !SEGMENT.test(assetId) || !REVISION.test(revision)) return new Response(null, { status: 404 });
  try {
    const response = await fetch(
      `${apiBase()}/v1/site-content/docs/${slug}/revisions/${revision}/assets/${assetId}`,
      { cache: "force-cache", redirect: "error", signal: AbortSignal.timeout(8_000) },
    );
    if (!response.ok || !response.body) return new Response(null, { status: response.status === 404 ? 404 : 502 });
    return new Response(response.body, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Type": response.headers.get("content-type") || "application/octet-stream",
        ETag: response.headers.get("etag") || `"${revision}"`,
        "X-Content-SHA256": response.headers.get("x-content-sha256") || "",
      },
    });
  } catch {
    return new Response(null, { status: 502 });
  }
}
