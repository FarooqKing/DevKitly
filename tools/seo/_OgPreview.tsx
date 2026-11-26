"use client";
export default function OgPreview({ title, desc, url, image, site }: { title: string; desc: string; url: string; image: string; site?: string }) {
  let host = ""; try { host = new URL(url).hostname; } catch {}
  return (
    <div className="space-y-3">
      <div className="card p-4">
        <p className="label mb-2">Google search preview</p>
        <div className="font-sans"><p className="text-xs text-slate-600 dark:text-slate-400">{host || "example.com"}</p><p className="text-lg text-[#1a0dab] dark:text-[#8ab4f8] leading-snug">{title.slice(0, 60) || "Page title"}{title.length > 60 && "…"}</p><p className="text-sm text-slate-600 dark:text-slate-400">{desc.slice(0, 160) || "Meta description appears here."}{desc.length > 160 && "…"}</p></div>
      </div>
      <div className="card overflow-hidden">
        <p className="label px-4 pt-3">Facebook / LinkedIn / WhatsApp preview</p>
        <div className="mt-2 border-t border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {image ? <img src={image} alt="" className="aspect-[1.91/1] w-full bg-slate-100 object-cover dark:bg-slate-800" onError={(e) => ((e.target as HTMLImageElement).style.display = "none")} /> : <div className="grid aspect-[1.91/1] place-items-center bg-slate-100 text-sm text-slate-400 dark:bg-slate-800">1200 × 630 image</div>}
          <div className="bg-slate-50 p-3 dark:bg-slate-800/60"><p className="text-xs uppercase text-slate-500">{host || site || "example.com"}</p><p className="truncate font-semibold">{title || "Page title"}</p><p className="line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{desc || "Description"}</p></div>
        </div>
      </div>
    </div>
  );
}
