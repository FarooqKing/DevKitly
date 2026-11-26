"use client";
import { useMemo, useState } from "react";
import CopyButton from "@/components/CopyButton";

type T = "Article" | "FAQPage" | "Product" | "Organization" | "LocalBusiness" | "BreadcrumbList" | "Person";
const types: T[] = ["Article", "FAQPage", "Product", "Organization", "LocalBusiness", "BreadcrumbList", "Person"];
export default function SchemaGenerator() {
  const [t, setT] = useState<T>("Article");
  const [f, setF] = useState<Record<string, string>>({ headline: "How to Merge PDF Files", author: "DevKitly", datePublished: new Date().toISOString().slice(0, 10), image: "https://example.com/image.jpg", url: "https://example.com/page", description: "Short description of the page.", name: "DevKitly", logo: "https://example.com/logo.png", telephone: "+92 300 1234567", street: "123 Main Street", city: "Karachi", country: "PK", price: "999", currency: "PKR", brand: "DevKitly", rating: "4.8", reviews: "120", jobTitle: "Developer", sameAs: "https://twitter.com/devkitly\nhttps://github.com/devkitly" });
  const [faq, setFaq] = useState("Is it free?|Yes, completely free.\nDo I need an account?|No account is needed.");
  const [crumbs, setCrumbs] = useState("Home|https://example.com\nTools|https://example.com/tools\nMerge PDF|https://example.com/tools/merge-pdf");
  const s = (k: string) => f[k] ?? "";
  const json = useMemo(() => {
    const base: Record<string, unknown> = { "@context": "https://schema.org", "@type": t };
    const same = s("sameAs").split("\n").map((x) => x.trim()).filter(Boolean);
    const o: Record<string, unknown> = t === "Article" ? { headline: s("headline"), description: s("description"), image: s("image"), author: { "@type": "Person", name: s("author") }, publisher: { "@type": "Organization", name: s("name"), logo: { "@type": "ImageObject", url: s("logo") } }, datePublished: s("datePublished"), mainEntityOfPage: s("url") }
      : t === "FAQPage" ? { mainEntity: faq.split("\n").filter((l) => l.includes("|")).map((l) => { const [q, a] = l.split("|"); return { "@type": "Question", name: q.trim(), acceptedAnswer: { "@type": "Answer", text: a.trim() } }; }) }
      : t === "Product" ? { name: s("headline"), image: s("image"), description: s("description"), brand: { "@type": "Brand", name: s("brand") }, offers: { "@type": "Offer", url: s("url"), priceCurrency: s("currency"), price: s("price"), availability: "https://schema.org/InStock" }, aggregateRating: { "@type": "AggregateRating", ratingValue: s("rating"), reviewCount: s("reviews") } }
      : t === "Organization" ? { name: s("name"), url: s("url"), logo: s("logo"), sameAs: same }
      : t === "LocalBusiness" ? { name: s("name"), image: s("image"), telephone: s("telephone"), url: s("url"), address: { "@type": "PostalAddress", streetAddress: s("street"), addressLocality: s("city"), addressCountry: s("country") } }
      : t === "BreadcrumbList" ? { itemListElement: crumbs.split("\n").filter((l) => l.includes("|")).map((l, i) => { const [n, u] = l.split("|"); return { "@type": "ListItem", position: i + 1, name: n.trim(), item: u.trim() }; }) }
      : { name: s("author"), jobTitle: s("jobTitle"), url: s("url"), image: s("image"), sameAs: same };
    return `<script type="application/ld+json">\n${JSON.stringify({ ...base, ...o }, null, 2)}\n</script>`;
  }, [t, f, faq, crumbs]);
  const F = ({ k, label, area }: { k: string; label: string; area?: boolean }) => <div><label className="label">{label}</label>{area ? <textarea className="field mt-1 h-20" value={s(k)} onChange={(e) => setF((o) => ({ ...o, [k]: e.target.value }))} /> : <input className="field mt-1" value={s(k)} onChange={(e) => setF((o) => ({ ...o, [k]: e.target.value }))} />}</div>;
  const fields: Record<T, React.ReactNode> = {
    Article: <>{F({ k: "headline", label: "Headline" })}{F({ k: "description", label: "Description", area: true })}{F({ k: "author", label: "Author name" })}{F({ k: "name", label: "Publisher name" })}{F({ k: "logo", label: "Publisher logo URL" })}{F({ k: "image", label: "Image URL" })}{F({ k: "url", label: "Page URL" })}{F({ k: "datePublished", label: "Date published" })}</>,
    FAQPage: <div><label className="label">Questions (one per line: question|answer)</label><textarea className="field mt-1 h-40 font-mono text-xs" value={faq} onChange={(e) => setFaq(e.target.value)} /></div>,
    Product: <>{F({ k: "headline", label: "Product name" })}{F({ k: "description", label: "Description", area: true })}{F({ k: "brand", label: "Brand" })}{F({ k: "image", label: "Image URL" })}{F({ k: "url", label: "Product URL" })}<div className="grid grid-cols-2 gap-3">{F({ k: "price", label: "Price" })}{F({ k: "currency", label: "Currency" })}{F({ k: "rating", label: "Rating (0–5)" })}{F({ k: "reviews", label: "Review count" })}</div></>,
    Organization: <>{F({ k: "name", label: "Organization name" })}{F({ k: "url", label: "Website" })}{F({ k: "logo", label: "Logo URL" })}{F({ k: "sameAs", label: "Social profiles (one per line)", area: true })}</>,
    LocalBusiness: <>{F({ k: "name", label: "Business name" })}{F({ k: "telephone", label: "Phone" })}{F({ k: "url", label: "Website" })}{F({ k: "image", label: "Image URL" })}{F({ k: "street", label: "Street" })}<div className="grid grid-cols-2 gap-3">{F({ k: "city", label: "City" })}{F({ k: "country", label: "Country code" })}</div></>,
    BreadcrumbList: <div><label className="label">Items (one per line: name|url)</label><textarea className="field mt-1 h-32 font-mono text-xs" value={crumbs} onChange={(e) => setCrumbs(e.target.value)} /></div>,
    Person: <>{F({ k: "author", label: "Name" })}{F({ k: "jobTitle", label: "Job title" })}{F({ k: "url", label: "Website" })}{F({ k: "image", label: "Photo URL" })}{F({ k: "sameAs", label: "Social profiles (one per line)", area: true })}</>,
  };
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card space-y-4 p-5"><div className="flex flex-wrap gap-1.5">{types.map((x) => <button key={x} className={`btn h-8 px-2.5 text-xs ${t === x ? "btn-primary" : ""}`} onClick={() => setT(x)}>{x}</button>)}</div>{fields[t]}</div>
      <div className="card h-fit"><header className="flex items-center justify-between border-b border-slate-200 px-3 py-2 dark:border-slate-800"><h2 className="text-sm font-medium">JSON-LD</h2><CopyButton text={json} className="btn-ghost h-8 px-2" /></header><pre className="max-h-[36rem] overflow-auto p-3 font-mono text-xs leading-relaxed">{json}</pre><p className="border-t border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-800">Paste inside &lt;head&gt; and test with Google&apos;s Rich Results Test.</p></div>
    </div>
  );
}
