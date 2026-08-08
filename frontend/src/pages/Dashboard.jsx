import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api, formatDate } from '../services/api'

export default function Dashboard() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState([])
  const [indicators, setIndicators] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api('/tickets', { query: { per_page: 8 } }),
      api('/indicators'),
    ])
      .then(([ticketsData, indicatorsData]) => {
        setTickets(ticketsData.tickets?.data || ticketsData.tickets || [])
        setIndicators(indicatorsData)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const kanban = indicators?.kanban || []
  const total = kanban.reduce((acc, col) => acc + (col.tickets?.length || 0), 0)

  return (
    <PageShell>
      <PageHeader
        title="Painel de Controle"
        subtitle={`Bem-vindo de volta, ${user?.name?.split(' ')[0] || 'usuário'}. Aqui está o resumo de hoje.`}
      />

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            <Metric label="Chamados no período" value={indicators?.total ?? 0} icon="confirmation_number" color="text-primary bg-primary/10" />
            <Metric label="Aguardando validação" value={indicators?.kanban?.[2]?.tickets?.length ?? 0} icon="pending_actions" color="text-amber-600 bg-amber-500/10" />
            <Metric label="Em atendimento" value={indicators?.kanban?.[1]?.tickets?.length ?? 0} icon="support_agent" color="text-blue-600 bg-blue-500/10" />
            <Metric label="Concluídos" value={indicators?.kanban?.[3]?.tickets?.length ?? 0} icon="task_alt" color="text-green-600 bg-green-500/10" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
            <div className="lg:col-span-2">
              <Card title={<span className="material-symbols-outlined">home</span>}>
                <div className="flex items-center justify-between px-lg py-md border-b border-outline-variant">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Chamados recentes</h3>
                  <Link to="/chamados" className="text-label-md text-primary font-semibold hover:underline">
                    Ver todos
                  </Link>
                </div>
                {tickets.length === 0 ? (
                  <EmptyState message="Nenhum chamado ainda." />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full zebra-table">
                      <thead>
                        <tr className="text-left text-label-md text-on-surface-variant uppercase">
                          <th className="px-lg py-sm">Nº</th>
                          <th className="px-lg py-sm">Título</th>
                          <th className="px-lg py-sm">Solicitante</th>
                          <th className="px-lg py-sm">Situação</th>
                          <th className="px-lg py-sm">Abertura</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((t) => (
                          <tr key={t.id} className="cursor-pointer hover:bg-surface-container-low transition-colors">
                            <td className="px-lg py-sm text-primary font-semibold">
                              <Link to={`/chamados/${t.id}`} className="hover:underline">#{t.number}</Link>
                            </td>
                            <td className="px-lg py-sm">
                              <Link to={`/chamados/${t.id}`} className="text-on-surface hover:text-primary">{t.title}</Link>
                            </td>
                            <td className="px-lg py-sm text-on-surface-variant">{t.requesting_user?.name || '—'}</td>
                            <td className="px-lg py-sm">
                              <StatusBadge label={t.situation?.name} color={t.situation?.color} />
                            </td>
                            <td className="px-lg py-sm text-on-surface-variant">{formatDate(t.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card>
            </div>

            <div>
              <Card>
                <div className="px-lg py-md border-b border-outline-variant">
                  <h3 className="font-title-lg text-title-lg text-on-surface">Meus setores</h3>
                </div>
                <div className="p-lg space-y-sm">
                  {(user?.sectors || []).map((s) => (
                    <div key={s.id} className="flex items-center gap-md px-md py-sm bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-primary">apartment</span>
                      <span className="font-body-md">{s.name}</span>
                    </div>
                  ))}
                  <p className="text-label-md text-on-surface-variant pt-sm">
                    Os indicadores e relatórios consideram os chamados dos setores em que você está cadastrado.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg text-title-lg text-on-surface">Kanban por situação</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-md p-lg">
              {kanban.map((col) => (
                <div key={col.situation.id} className="bg-surface-container-low rounded-xl p-md">
                  <div className="flex items-center justify-between mb-md">
                    <span className="flex items-center gap-sm font-label-md font-semibold">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.situation.color }}></span>
                      {col.situation.name}
                    </span>
                    <span className="text-label-md text-on-surface-variant">{col.tickets.length}</span>
                  </div>
                  <div className="space-y-sm">
                    {col.tickets.length === 0 && (
                      <p className="text-label-md text-on-surface-variant text-center py-sm">—</p>
                    )}
                    {col.tickets.map((t) => (
                      <Link
                        key={t.id}
                        to={`/chamados/${t.id}`}
                        className="block bg-surface-container-lowest border border-outline-variant rounded-lg p-sm hover:shadow-sm transition-shadow"
                      >
                        <p className="font-label-md font-bold text-primary">#{t.number}</p>
                        <p className="font-body-md text-on-surface line-clamp-2">{t.title}</p>
                        <p className="text-label-md text-on-surface-variant mt-xs">{t.responsible_user || '—'}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </PageShell>
  )
}

function Metric({ label, value, icon, color }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
      <div className="flex items-center gap-md">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant">{label}</p>
          <p className="font-title-lg text-title-lg font-bold text-on-surface">{value}</p>
        </div>
      </div>
    </div>
  )
}