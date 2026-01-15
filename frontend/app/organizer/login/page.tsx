import { redirect } from "next/navigation";

export default function OrganizerLoginPage({
  searchParams,
}: {
  searchParams?: { redirect?: string };
}) {
  const r = searchParams?.redirect ?? "/organizer/dashboard";
  redirect(`/login?redirect=${encodeURIComponent(r)}`);
}
