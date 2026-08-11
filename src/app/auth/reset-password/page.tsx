import { redirect } from "next/navigation";

export default async function ResetPasswordAliasPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();
  const rawSearchParams = await searchParams;

  for (const [key, value] of Object.entries(rawSearchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value)) {
      for (const item of value) {
        if (typeof item === "string") params.append(key, item);
      }
    }
  }

  redirect(`/reset-password${params.size ? `?${params.toString()}` : ""}`);
}
