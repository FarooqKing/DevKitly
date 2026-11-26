export default function Loading() {
  return (
    <div className="mx-auto max-w-[88rem] px-4 sm:px-6 py-8 lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10 animate-pulse">
      <aside className="hidden lg:block space-y-3">{Array.from({ length: 10 }).map((_, i) => <div key={i} className="h-7 rounded-lg bg-slate-200 dark:bg-slate-800" />)}</aside>
      <div><div className="h-4 w-40 rounded bg-slate-200 dark:bg-slate-800" /><div className="mt-4 flex gap-4"><div className="h-12 w-12 rounded-xl bg-slate-200 dark:bg-slate-800" /><div><div className="h-8 w-72 rounded bg-slate-200 dark:bg-slate-800" /><div className="mt-2 h-4 w-96 rounded bg-slate-200 dark:bg-slate-800" /></div></div><div className="mt-8 h-80 rounded-xl bg-slate-200 dark:bg-slate-800" /></div>
    </div>
  );
}
