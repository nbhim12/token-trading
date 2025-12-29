export default function HomePage() {
  return (
    <main className="min-h-screen bg-bg-primary">
      {/* Header placeholder */}
      <header className="sticky top-0 z-50 h-14 border-b border-border-primary bg-bg-secondary/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-accent-primary" />
            <span className="text-lg font-semibold text-text-primary">
              Axiom Trade
            </span>
          </div>
          <nav className="hidden items-center gap-6 md:flex">
            <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              Discover
            </span>
            <span className="text-sm text-accent-primary font-medium cursor-pointer">
              Pulse
            </span>
            <span className="text-sm text-text-secondary hover:text-text-primary cursor-pointer transition-colors">
              Trackers
            </span>
          </nav>
        </div>
      </header>

      {/* Main content area - Token tables will go here */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {/* New Pairs Column */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <h2 className="mb-4 text-sm font-medium text-text-primary">
              🆕 New Pairs
            </h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-shimmer rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Final Stretch Column */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <h2 className="mb-4 text-sm font-medium text-text-primary">
              🏁 Final Stretch
            </h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-shimmer rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Migrated Column */}
          <div className="rounded-xl border border-border-primary bg-bg-secondary p-4">
            <h2 className="mb-4 text-sm font-medium text-text-primary">
              ✅ Migrated
            </h2>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-16 animate-shimmer rounded-lg"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
