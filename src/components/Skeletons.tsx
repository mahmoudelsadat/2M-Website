function Pulse({ className = '' }: { className?: string }) {
  return <div className={`animate-pulse bg-[var(--color-surface-2)] rounded-xl ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden bg-white">
      <Pulse className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Pulse className="h-2.5 w-16" />
        <Pulse className="h-4 w-full" />
        <Pulse className="h-3.5 w-3/4" />
        <Pulse className="h-3 w-24" />
        <Pulse className="h-5 w-28" />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] p-5 bg-white">
      <Pulse className="w-12 h-12 rounded-xl mb-4" />
      <Pulse className="h-4 w-2/3 mb-2" />
      <Pulse className="h-3 w-full mb-1" />
      <Pulse className="h-3 w-4/5 mb-4" />
      <div className="flex items-center justify-between">
        <Pulse className="h-3 w-20" />
        <Pulse className="w-7 h-7 rounded-full" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <CategoryCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NavbarSkeleton() {
  return (
    <div className="h-16 bg-white border-b border-[var(--color-border)] flex items-center px-6 gap-4">
      <Pulse className="w-11 h-11 rounded-xl" />
      <Pulse className="h-4 w-28 hidden sm:block" />
      <div className="flex-1" />
      <Pulse className="h-8 w-8 rounded-lg" />
      <Pulse className="h-8 w-20 rounded-lg" />
    </div>
  );
}
