import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
import { api, formatDate } from '../services/api'

export default function Chamados() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState({ sectors: [], users: [], classifications: [], situations: [] })
  const [filters, setFilters] = useState({})
  const [hasFetched, setHasFetched] = useState(false)

  const change = (name, value) => setFilters((p) => ({ ...p, [name]: value }))
  const resetFilters = () => setFilters({})

  const load = () => {
    setLoading(true)
    api('/tickets', { query: { ...filters, per_page: 50 } })
      .then((d) => setTickets(d.tickets?.data || d.tickets || []))
      .catch(() => setTickets([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    Promise.all([api('/sectors'), api('/users'), api('/classifications'), api('/situations')])
      .then(([s, u, c, si]) => setResources({ sectors: s.sectors, users: u.users, classifications: c.classifications, situations: si.situations }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [JSON.stringify(filters)])

  const hasActiveFilters = Object.values(filters).some((v) => v !== '' && v !== null && v !== undefined)

  return (
    <div>
      <PageShell>
        <PageHeader
          title="Chamados"
          subtitle="Acompanhe todos os chamados da sua empresa."
          actions={
            <Link to="/chamados/novo" className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Novo Chamado
            </Link>
          }
        />

        <Card>
          <div className="p-lg grid grid-cols-2 md:grid-cols-4 gap-md">
            <input type="date" value={filters.opened_from || ''} onChange={(e) => change('opened_from', e.target.value)} className={inputClass} title="Data de abertura (de)" />
            <input type="date" value={filters.opened_to || ''} onChange={(e) => change('opened_to', e.target.value)} className={inputClass} title="Data de abertura (até)" />
            <select value={filters.requesting_sector_id || ''} onChange={(e) => change('requesting_sector_id', e.target.value)} className={inputClass} title="Setor solicitante">
              <option value="">Setor solicitante</option>
              {resources.sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filters.responsible_sector_id || ''} onChange={(e) => change('responsible_sector_id', e.target.value)} className={inputClass} title="Setor demandado">
              <option value="">Setor demandado</option>
              {resources.sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={filters.classification_id || ''} onChange={(e) => change('classification_id', e.target.value)} className={inputClass} title="Classificação">
              <option value="">Classificação</option>
              {resources.classifications.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <select value={filters.situation_id || ''} onChange={(e) => change('situation_id', e.target.value)} className={inputClass} title="Situação">
              <option value="">Situação</option>
              {resources.situations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <input value={filters.q || ''} onChange={(e) => change('q', e.target.value)} className={inputClass} placeholder="Título, descrição…" />
            <button onClick={resetFilters} disabled={!hasActiveFilters} className="flex items-center justify-center gap-sm border border-outline-variant rounded-lg px-md py-md text-label-md text-on-surface-variant hover:bg-surface-container-low transition-colors disabled:opacity-50">
              <span className="material-symbols-outlined text-[18px]">restart_alt</span>
              Limpar
            </button>
          </div>
        </Card>

        <Card>
          {loading ? (
            <Spinner />
          ) : tickets.length === 0 ? (
            <EmptyState message="Nenhum chamado encontrado." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Nº</th>
                    <th className="px-lg py-sm text-left">Abertura</th>
                    <th className="px-lg py-sm text-left">Título</th>
                    <th className="px-lg py-sm text-left">Situação</th>
                    <th className="px-lg py-sm text-left">Solicitante</th>
                    <th className="px-lg py-sm text-left">Demandado</th>
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
                      <td className="px-lg py-sm">
                        <span className="block text-body-md">{t.requesting_user?.name || '—'}</span>
                        <span className="text-label-md text-on-surface-variant">{t.requesting_sector?.name || '—'}</span>
                      </td>
                      <td className="px-lg py-sm">
                        <span className="block text-body-md">{t.responsible_user?.name || '—'}</span>
                        <span className="text-label-md text-on-surface-variant">{t.responsible_sector?.name || '—'}</span>
                      </td>
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