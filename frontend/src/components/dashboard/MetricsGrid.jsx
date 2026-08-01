export default function MetricsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
      <div className="glass-card p-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
            <span className="material-symbols-outlined">drafts</span>
          </div>
          <span className="text-label-md font-label-md text-primary font-bold">+12%</span>
        </div>
        <div className="mt-lg">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
            Tickets Abertos
          </p>
          <h3 className="text-display-lg font-display-lg mt-xs">42</h3>
        </div>
      </div>

      <div className="glass-card p-md rounded-xl shadow-sm flex flex-col justify-between border-l-4 border-l-error">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-error-container flex items-center justify-center text-on-error-container">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              priority_high
            </span>
          </div>
          <span className="text-label-md font-label-md text-error font-bold">-5%</span>
        </div>
        <div className="mt-lg">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Urgentes</p>
          <h3 className="text-display-lg font-display-lg mt-xs">08</h3>
        </div>
      </div>

      <div className="glass-card p-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-secondary-container flex items-center justify-center text-on-secondary-container">
            <span className="material-symbols-outlined">schedule</span>
          </div>
          <span className="text-label-md font-label-md text-secondary font-bold">Ótimo</span>
        </div>
        <div className="mt-lg">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Tempo Médio</p>
          <h3 className="text-display-lg font-display-lg mt-xs">1h 24m</h3>
        </div>
      </div>

      <div className="glass-card p-md rounded-xl shadow-sm flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
          <span className="text-label-md font-label-md text-tertiary font-bold">94%</span>
        </div>
        <div className="mt-lg">
          <p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">
            Taxa de Resolução
          </p>
          <h3 className="text-display-lg font-display-lg mt-xs">24</h3>
        </div>
      </div>
    </div>
  )
}
