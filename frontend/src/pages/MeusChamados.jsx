import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
import { api, formatDate } from '../services/api'

export default function MeusChamados() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [situationId, setSituationId] = useState('')
  const [resources, setResources] = useState({ situations: [] })

  useEffect(() => {
    api('/situations')
      .then((d) => setResources({ situations: d.situations || [] }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    api('/tickets', { query: { mine: 1, situation_id: situationId, per_page: 100 } })
      .then((d) => setTickets(d.tickets?.data || d.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }, [situationId])

  return (
    <div>
      <PageShell>
        <PageHeader
          title="Meus Chamados"
          subtitle="Chamados em que você é responsável ou solicitante."
          actions={
            <Link to="/chamados/novo" className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Novo Chamado
            </Link>
          }
        />

        <Card>
          <div className="p-lg flex items-center gap-md">
            <span className="text-label-md text-on-surface-variant">Filtrar por situação:</span>
            <select value={situationId} onChange={(e) => setSituationId(e.target.value)} className={inputClass}>
              <option value="">Todas</option>
              {resources.situations.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </Card>

        <Card>
          {loading ? (
            <Spinner />
          ) : tickets.length === 0 ? (
            <EmptyState message="Nenhum chamado vinculado a você." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Nº</th>
                    <th className="px-lg py-sm text-left">Abertura</th>
                    <th className="px-lg py-sm text-left">Título</th>
                    <th className="px-lg py-sm text-left">Situação</th>
                    <th className="px-lg py-sm text-left">Papel</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm text-primary font-semibold">#{t.number}</td>
                      <td className="px-lg py-sm text-on-surface-variant">{formatDate(t.created_at)}</td>
                      <td className="px-lg py-sm font-body-md font-semibold">
                        <Link to={`/chamados/${t.id}`} className="hover:text-primary">{t.title}</Link>
                      </td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={t.situation?.name} color={t.situation?.color} />
                      </td>
                      <td className="px-lg py-sm text-on-surface-variant capitalize">{t.my_role || 'solicitante'}</td>
                      <td className="px-lg py-sm text-right whitespace-nowrap">
                        <Link to={`/chamados/${t.id}`} className="inline-flex p-2 text-on-surface-variant hover:text-primary transition-colors" title="Visualizar">
                          <span className="material-symbols-outlined">visibility</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageShell>
    </div>
  )
}