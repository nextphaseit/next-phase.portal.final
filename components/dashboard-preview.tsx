export function DashboardPreview() {
  return (
    <div className="relative h-[350px] w-full overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl">
      {/* Mock dashboard interface */}
      <div className="absolute inset-0 p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="h-3 w-32 bg-white/20 rounded"></div>
          <div className="flex gap-2">
            <div className="h-3 w-3 bg-brand-green rounded-full"></div>
            <div className="h-3 w-3 bg-brand-blue rounded-full"></div>
          </div>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="h-2 w-16 bg-brand-blue/60 rounded mb-2"></div>
            <div className="h-4 w-8 bg-white/40 rounded"></div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="h-2 w-16 bg-brand-green/60 rounded mb-2"></div>
            <div className="h-4 w-8 bg-white/40 rounded"></div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
            <div className="h-2 w-16 bg-amber-500/60 rounded mb-2"></div>
            <div className="h-4 w-8 bg-white/40 rounded"></div>
          </div>
        </div>

        {/* Main content area */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 h-40">
          <div className="h-3 w-24 bg-white/40 rounded mb-3"></div>
          <div className="space-y-2">
            <div className="h-2 w-full bg-white/20 rounded"></div>
            <div className="h-2 w-3/4 bg-white/20 rounded"></div>
            <div className="h-2 w-1/2 bg-white/20 rounded"></div>
          </div>
          <div className="mt-4 flex gap-2">
            <div className="h-6 w-20 bg-brand-blue/60 rounded"></div>
            <div className="h-6 w-16 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>

      {/* Overlay text */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/20 to-brand-green/20 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm8 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1v-2z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2">Modern Dashboard</h3>
          <p className="text-sm opacity-90">Streamlined ticket management</p>
        </div>
      </div>
    </div>
  )
}
