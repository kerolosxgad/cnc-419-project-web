export function SkeletonCard() {
  return (
    <div className="card">
      <div className="skeleton h-12 w-12 rounded-lg mb-4" />
      <div className="skeleton h-4 w-24 mb-2" />
      <div className="skeleton h-8 w-32" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton h-12 w-full rounded-lg" />
      ))}
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="card h-80">
      <div className="skeleton h-full w-full rounded-lg" />
    </div>
  );
}
