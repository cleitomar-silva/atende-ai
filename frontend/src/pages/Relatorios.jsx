import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api, formatDate } from '../services/api'

export default function Relatorios() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'
  const [filters, setFilters] = useState({})
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState({ sectors: [], situations: [], categories: [], groups: [] })

  const change = (name, value) => setFilters((p) => ({ ...p, [name]: value }))

  useEffect(() => {
    Promise.all([api('/sectors'), api('/situations'), api('/categories'), api('/groups')])
      .then(([s, si, c, g]) => setResources({ sectors: s.sectors, situations: si.situations, categories: c.categories, groups: g.groups }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    setLoading(true)
    api('/reports', { query: filters })
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [JSON.stringify(filters)])

  const maxBySituation = Math.max(1, ...Object.values(data?.by_situation || {}).map(Number))

  return (
    <PageShell>
      <PageHeader title="Relatórios" subtitle="Análise dos chamados dos seus setores." />

      <Card>
        <div className="p-lg grid grid-cols-2 md:grid-cols-4 gap-md">
          <input type="date" value={filters.opened_from || ''} onChange={(e) => change('opened_from', e.target.value)} className={inputClass} title="Data de abertura (de)" />
          <input type="date" value={filters.opened_to || ''} onChange={(e) => change('opened_to', e.target.value)} className={inputClass} title="Data de abertura (até)" />
          <input type="date" value={filters.commented_from || ''} onChange={(e) => change('commented_from', e.target.value)} className={inputClass} title="Data de apontamento (de)" />
          <input type="date" value={filters.commented_to || ''} onChange={(e) => change('commented_to', e.target.value)} className={inputClass} title="Data de apontamento (até)" />
          <select value={filters.sector_requester_id || ''} onChange={(e) => change('sector_requester_id', e.target.value)} className={inputClass} title="Setor solicitante">
            <option value="">Setor solicitante</option>
            {resources.sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filters.situation_id || ''} onChange={(e) => change('situation_id', e.target.value)} className={inputClass} title="Situação">
            <option value="">Situação</option>
            {resources.situations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select value={filters.category_id || ''} onChange={(e) => change('category_id', e.target.value)} className={inputClass} title="Categoria">
            <option value="">Categoria</option>
            {resources.categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select value={filters.group_id || ''} onChange={(e) => change('group_id', e.target.value)} className={inputClass} title="Grupo">
            <option value="">Grupo</option>
            {resources.groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>
          {isAdmin && (
            <select value={filters.responsible_sector_id || ''} onChange={(e) => change('responsible_sector_id', e.target.value)} className={inputClass} title="Setor responsável">
              <option value="">Setor responsável</option>
              {resources.sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          )}
        </div>
      </Card>

      {loading ? (
        <Spinner />
      ) : (
        <div className="space-y-lg">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            <Metric label="Total de chamados" value={data?.total ?? 0} color="text-primary bg-primary/10" icon="confirmation_number" />
            <Metric label="Em aberto" value={data?.open ?? 0} color="text-blue-600 bg-blue-500/10" icon="folder_open" />
            <Metric label="Concluídos" value={data?.closed ?? 0} color="text-green-600 bg-green-500/10" icon="task_alt" />
            <Metric label="SLA em atraso" value={data?.overdue ?? 0} color="text-red-600 bg-red-500/10" icon="priority_high" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
            <Card>
              <div className="px-lg py-md border-b border-outline-variant"><h3 className="font-title-lg">Chamados por situação</h3></div>
              <div className="p-lg space-y-sm">
                {Object.keys(data?.by_situation || {}).length === 0 && <p className="text-body-md text-on-surface-variant">Sem dados.</p>}
                {Object.entries(data?.by_situation || {}).map(([name, count]) => (
                  <div key={name}>
                    <div className="flex justify-between text-label-md mb-xs">
                      <span className="text-on-surface-variant">{name}</span>
                      <span className="font-semibold">{count}</span>
                    </div>
                    <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${(count / Math.max(1, maxBySituation)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="px-lg py-md border-b border-outline-variant"><h3 className="font-title-lg">Chamados por categoria</h3></div>
              <div className="p-lg space-y-sm">
                {Object.entries(data?.by_category || {}).length === 0 && <p className="text-body-md text-on-surface-variant">Sem dados.</p>}
                {Object.entries(data?.by_category || {}).map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between py-sm border-b border-outline-variant last:border-b-0">
                    <span className="text-body-md text-on-surface">{name}</span>
                    <span className="px-md py-0.5 bg-primary/10 text-primary rounded-full text-label-md font-semibold">{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg">Chamados</h3>
            </div>
            {data?.tickets?.length === 0 ? (
              <EmptyState message="Nenhum chamado para os filtros selecionados." />
            ) : (
              <div className="overflow-x-auto pb-lg">
                <table className="w-full zebra-table">
                  <thead>
                    <tr className="text-label-md text-on-surface-variant uppercase">
                      <th className="px-lg py-sm text-left">Nº</th>
                      <th className="px-lg py-sm text-left">Abertura</th>
                      <th className="px-lg py-sm text-left">Título</th>
                      <th className="px-lg py-sm text-left">Situação</th>
                      <th className="px-lg py-sm text-left">Categoria</th>
                      <th className="px-lg py-sm text-left">Setor responsável</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.tickets?.map((t) => (
                      <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-lg py-sm text-primary font-semibold">
                          <Link to={`/chamados/${t.id}`} className="hover:underline">#{t.number}</Link>
                        </td>
                        <td className="px-lg py-sm text-on-surface-variant">{formatDate(t.created_at)}</td>
                        <td className="px-lg py-sm font-body-md font-semibold">{t.title}</td>
                        <td className="px-lg py-sm"><StatusBadge label={t.status} color={t.situation_color} /></td>
                        <td className="px-lg py-sm text-on-surface-variant">{t.category || '—'}</td>
                        <td className="px-lg py-sm text-on-surface-variant">{t.responsible_sector || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}
    </PageShell>
  )
}

function Metric({ label, value, color }) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
      <div className="flex items-center gap-md">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <span className="material-symbols-outlined">assessment</span>
        </div>
        <div>
          <p className="text-label-md text-on-surface-variant">{label}</p>
          <p className="font-headline-md font-bold">{value}</p>
        </div>
      </div>
    </div>
  )
}