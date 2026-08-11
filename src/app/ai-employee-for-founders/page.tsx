import { redirect } from "next/navigation";

export default async function AiEmployeeForFoundersAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  redirect(withQuery("/ai-partner-for-founders", await searchParams));
}

function withQuery(path: string, rawSearchParams: Record<string, string | string[] | undefined>) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") params.append(key, item);
      }
    }
  }

  return `${path}${params.size ? `?${params.toString()}` : ""}`;
}
