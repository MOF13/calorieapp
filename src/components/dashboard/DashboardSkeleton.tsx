export function DashboardSkeleton() {
  return (
    <div className="min-h-screen pb-24 animate-pulse">
      <header className="sticky top-0 z-50 bg-white/40 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
              <div className="h-6 w-32 bg-slate-200 rounded-lg hidden sm:block"></div>
            </div>
            <div className="h-10 w-28 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="h-10 w-64 bg-slate-200 rounded-2xl"></div>
            <div className="h-4 w-48 bg-slate-200 rounded-lg"></div>
          </div>
          <div className="h-14 w-48 bg-slate-200 rounded-2xl"></div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-100 rounded-3xl border border-white/20"></div>
          ))}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div className="h-[400px] bg-slate-100 rounded-[2.5rem] border border-white/20"></div>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-slate-100 rounded-3xl border border-white/20"></div>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5 space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-[2rem] border border-white/20"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
