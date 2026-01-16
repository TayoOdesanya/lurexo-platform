// frontend/app/organizer/login/page.tsx
import { redirect } from 'next/navigation';

type SearchParams = {
  redirect?: string;
};

export default async function OrganizerLoginPage(props: {
  searchParams?: SearchParams | Promise<SearchParams>;
}) {
  // Next 15+ may provide searchParams as a Promise
  const sp = await Promise.resolve(props.searchParams ?? {});
  const r = sp.redirect ?? '/organizer/dashboard';

  redirect(`/login?redirect=${encodeURIComponent(r)}`);
}
