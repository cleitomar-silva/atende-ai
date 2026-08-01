const DAYS = [
  { label: 'Seg', entradas: 60, resolvidos: 45 },
  { label: 'Ter', entradas: 75, resolvidos: 65 },
  { label: 'Qua', entradas: 90, resolvidos: 80 },
  { label: 'Qui', entradas: 50, resolvidos: 55 },
  { label: 'Sex', entradas: 85, resolvidos: 70 },
  { label: 'Sab', entradas: 30, resolvidos: 25 },
  { label: 'Dom', entradas: 20, resolvidos: 15 },
]

const Bar = ({ value, color }) => (
  <div className="flex flex-col items-center justify-end w-full h-full group relative">
    <span className="text-[10px] text-on-surface-variant mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
      {value}
    </span>
    <div className={`${color} w-full rounded-t-sm transition-all duration-500`} style={{ height: `${value}%` }}></div>
  </div>
)

const ACTIVITIES = [
  { dot: 'border-primary', inner: 'bg-primary', title: 'Ticket #4502 Criado', detail: 'Cliente: João Tech - 10 min atrás' },
  { dot: 'border-secondary', inner: 'bg-secondary', title: 'Resposta enviada', detail: 'Ticket #4498 - 45 min atrás' },
  { dot: 'border-tertiary', inner: 'bg-tertiary', title: 'Status alterado: Em Espera', detail: 'Ticket #4492 - 2h atrás' },
  {
    dot: 'border-on-surface-variant',
    inner: 'bg-on-surface-variant',
    title: 'Nota interna adicionada',
    detail: 'Ticket #4480 - 4h atrás',
  },
]

export default function ChartActivity() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
      <div className="lg:col-span-2 glass-card p-lg rounded-xl shadow-sm overflow-hidden relative">
        <div className="flex justify-between items-center mb-lg">
          <h4 className="font-title-lg text-title-lg">Volume de Tickets Semanais</h4>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 text-label-md font-label-md">
              <span className="w-3 h-3 rounded-full bg-primary"></span> Entradas
            </span>
            <span className="flex items-center gap-1 text-label-md font-label-md ml-2">
              <span className="w-3 h-3 rounded-full bg-outline"></span> Resolvidos
            </span>
          </div>
        </div>
        <div className="h-64 relative px-2">
          <div className="absolute inset-0 px-2 flex flex-col justify-between">
            {[90, 60, 30, 0].map((v) => (
              <div key={v} className="flex items-center gap-2 w-full">
                <span className="text-[10px] text-on-surface-variant w-4 text-right">{v}</span>
                <div className="flex-1 border-t border-dashed border-outline-variant/60"></div>
              </div>
            ))}
          </div>
          <div className="relative h-full flex items-end justify-between gap-2 pt-5">
            {DAYS.map((day) => (
              <div key={day.label} className="flex flex-col items-center gap-2 w-full h-full">
                <div className="flex items-end gap-1 w-full flex-1">
                  <Bar value={day.entradas} color="bg-primary/20" />
                  <Bar value={day.resolvidos} color="bg-primary" />
                </div>
                <span className="text-label-md font-label-md text-on-surface-variant">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-lg rounded-xl shadow-sm flex flex-col">
        <h4 className="font-title-lg text-title-lg mb-lg">Atividades Recentes</h4>
        <div className="space-y-6 relative flex-1">
          <div className="absolute left-[11px] top-2 bottom-2 w-[2px] bg-outline-variant"></div>
          {ACTIVITIES.map((act) => (
            <div key={act.title} className="relative pl-8">
              <div
                className={`absolute left-0 top-1 w-6 h-6 rounded-full bg-white border-2 ${act.dot} flex items-center justify-center z-10`}
              >
                <div className={`w-2 h-2 rounded-full ${act.inner}`}></div>
              </div>
              <p className="text-body-md font-bold">{act.title}</p>
              <p className="text-label-md text-on-surface-variant">{act.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
