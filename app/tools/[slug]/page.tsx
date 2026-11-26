import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { tools, getTool } from "@/lib/tools";
import { siteConfig } from "@/site.config";
import ToolPage from "@/components/ToolPage";
import { toolComponents } from "@/tools";

type Props = { params: { slug: string } };

export function generateStaticParams() { return tools.map((t) => ({ slug: t.slug })); }

export function generateMetadata({ params }: Props): Metadata {
  const tool = getTool(params.slug);
  if (!tool) return {};
  const url = `${siteConfig.url}/tools/${tool.slug}`;
  return {
    title: `${tool.name} Online — Free, No Sign-up`,
    description: tool.description,
    keywords: tool.keywords,
    alternates: { canonical: url },
    openGraph: { title: `${tool.name} — ${siteConfig.name}`, description: tool.description, url },
  };
}

export default function Page({ params }: Props) {
  const tool = getTool(params.slug);
  const Component = toolComponents[params.slug];
  if (!tool || !Component) notFound();
  const jsonLd = {
    "@context": "https://schema.org", "@type": "SoftwareApplication",
    name: tool.name, description: tool.description, applicationCategory: "DeveloperApplication", operatingSystem: "Any",
    url: `${siteConfig.url}/tools/${tool.slug}`, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ToolPage tool={tool}><Component /></ToolPage>
    </>
  );
}
