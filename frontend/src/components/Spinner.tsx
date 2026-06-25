export function Spinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
    </div>
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface overflow-hidden animate-pulse">
      <div className="aspect-video w-full bg-input/60" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between">
          <div className="h-3 w-24 rounded bg-input" />
          <div className="h-3 w-8 rounded bg-input" />
        </div>
        <div className="h-4 w-3/4 rounded bg-input" />
        <div className="h-3 w-full rounded bg-input" />
        <div className="h-3 w-2/3 rounded bg-input" />
        <div className="flex gap-2 pt-2">
          <div className="h-9 flex-1 rounded-xl bg-input" />
          <div className="h-9 w-16 rounded-xl bg-input" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-4 w-32 rounded bg-input" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="aspect-video w-full rounded-2xl bg-input" />
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
            <div className="h-4 w-40 rounded bg-input" />
            <div className="h-3 w-full rounded bg-input" />
            <div className="h-3 w-3/4 rounded bg-input" />
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 space-y-4">
            <div className="h-4 w-32 rounded bg-input" />
            <div className="h-10 w-28 mx-auto rounded bg-input" />
            <div className="h-12 w-full rounded-xl bg-input" />
          </div>
        </div>
      </div>
    </div>
  );
}
