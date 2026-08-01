import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'
import MetricsGrid from '../components/dashboard/MetricsGrid.jsx'
import ChartActivity from '../components/dashboard/ChartActivity.jsx'
import RecentTickets from '../components/dashboard/RecentTickets.jsx'

export default function Dashboard() {
  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg space-y-lg">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface">Painel de Controle</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Bem-vindo de volta, Silva. Aqui está o resumo de hoje.
              </p>
            </div>
            <div className="flex gap-sm">
              <button className="flex items-center gap-1 text-label-md font-label-md px-md py-sm rounded-lg border border-outline hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                Últimos 7 dias
              </button>
              <button className="flex items-center gap-1 text-label-md font-label-md px-md py-sm rounded-lg border border-outline hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                Filtrar
              </button>
            </div>
          </div>

          <MetricsGrid />
          <ChartActivity />
          <RecentTickets />
        </main>
      </div>
    </div>
  )
}
