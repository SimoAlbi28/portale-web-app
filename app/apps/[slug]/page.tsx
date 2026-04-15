import { notFound } from "next/navigation";
import { apps, getAppBySlug } from "@/lib/apps";
import { AppDetail } from "@/components/detail/AppDetail";
import { Footer } from "@/components/ui/Footer";
import type { Metadata } from "next";

export function generateStaticParams() {
  return apps.map((a) => ({ slug: a.slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) return { title: "App non trovata" };
  return {
    title: `${app.name} — Simone Albini`,
    description: app.tagline,
  };
}

export default async function AppPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const app = getAppBySlug(slug);
  if (!app) notFound();

  return (
    <>
      <AppDetail app={app} />
      <Footer />
    </>
  );
}
