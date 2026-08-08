import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api, formatDate } from '../services/api'

export default function Indicadores() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ sector_id: '', month: '', year: new Date().getFullYear(), group_id: '', category_id: '' })

  const change = (name, value) => setFilters((p) => ({ ...p, [name]: value }))

  useEffect(() => {
    setLoading(true)
    api('/indicators', { query: filters })
      .then((d) => setData(d))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [JSON.stringify(filters)])

  if (loading && !data) {
    return (
      <PageShell>
        <Spinner />
      </PageShell>
    )
  }

  const relevance = data?.filters?.relevant_sectors || []
  const months = data?.filters?.months || []

  return (
    <PageShell>
      <PageHeader title="Indicadores" subtitle="Métricas dos chamados do seu setor." />

      <Card>
        <div className="p-lg grid grid-cols-2 md:grid-cols-5 gap-md">
          <div>
            <label className="font-label-md text-on-surface-variant block mb-sm">Setor</label>
            <select value={filters.sector_id} onChange={(e) => change('sector_id', e.target.value)} className={inputClass}>
              <option value="">Todos os meus setores</option>
              {(relevance || []).map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-label-md text-on-surface-variant block mb-sm">Mês</label>
            <select value={filters.month} onChange={(e) => change('month', e.target.value)} className={inputClass}>
              <option value="">Todos os meses</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="font-label-md text-on-surface-variant block mb-sm">Ano</label>
            <input type="number" min="2020" max="2100" value={filters.year} onChange={(e) => change('year', e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-md">
            <div>
              <label className="font-label-md text-on-surface-variant block mb-sm">Grupo</label>
              <select value={filters.group_id} onChange={(e) => change('group_id', e.target.value)} className={inputClass}>
                <option value="">Todos</option>
                {(data?.filters?.groups || []).map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="font-label-md text-on-surface-variant block mb-sm">Categoria</label>
              <select value={filters.category_id} onChange={(e) => change('category_id', e.target.value)} className={inputClass}>
                <option value="">Todas</option>
                {(data?.filters?.categories || []).map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
        <CrossTable title="Chamados por Grupo e Categoria" tabela={data?.tabela1} />
        <CrossTable title="Chamados por Responsável e Categoria" tabela={data?.tabela2} />
      </div>

      <Card>
        <div className="px-lg py-md border-b border-outline-variant">
          <h3 className="font-title-lg">Kanban das situações</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-md p-lg">
          {(data?.kanban || []).map((col) => (
            <div key={col.situation?.id} className="bg-surface-container-low rounded-xl p-md min-h-[120px]">
              <div className="flex items-center justify-between mb-md">
                <span className="flex items-center gap-sm font-label-md font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.situation?.color }}></span>
                  {col.situation?.name}
                </span>
                <span className="text-label-md text-on-surface-variant">{col.tickets?.length}</span>
              </div>
              <div className="space-y-sm">
                {(col.tickets || []).length === 0 && <p className="text-label-md text-on-surface-variant text-center py-sm">—</p>}
                {(col.tickets || []).map((t) => (
                  <Link key={t.id} to={`/chamados/${t.id}`} className="block bg-surface-container-lowest border border-outline-variant rounded-lg p-sm hover:shadow-sm transition-shadow">
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
    </PageShell>
  )
}

const months = [
  { value: 1, label: 'Janeiro' },
  { value: 2, label: 'Fevereiro' },
  { value: 3, label: 'Março' },
  { value: 4, label: 'Abril' },
  { value: 5, label: 'Maio' },
  { value: 6, label: 'Junho' },
  { value: 7, label: 'Julho' },
  { value: 8, label: 'Agosto' },
  { value: 9, label: 'Setembro' },
  { value: 10, label: 'Outubro' },
  { value: 11, label: 'Novembro' },
  { value: 12, label: 'Dezembro' },
]

function CrossTable({ title, tabela }) {
  if (!tabela || !tabela.columns?.length) return null
  return (
    <Card>
      <div className="px-lg py-md border-b border-outline-variant">
        <h3 className="font-title-lg">{title}</h3>
      </div>
      <div className="overflow-x-auto p-lg">
        <table className="w-full text-center">
          <thead>
            <tr className="text-label-md text-on-surface-variant">
              <th className="py-sm pr-sm text-left" rowSpan={2}>Grupo / Responsável</th>
              {tabela.columns.map((col) => (
                <th key={col} className="py-sm px-sm whitespace-nowrap">{col}</th>
              ))}
              <th className="py-sm px-sm font-bold text-primary whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody>
            {tabela.rows.map((row) => (
              <tr key={row.name} className="border-t border-outline-variant">
                <td className="py-sm pr-sm text-left font-semibold">{row.name}</td>
                {row.counts.map((c, i) => (
                  <td key={i} className="py-sm px-sm">{c}</td>
                ))}
                <td className="py-sm px-sm font-bold text-primary">{row.total}</td>
              </tr>
            ))}
            <tr className="border-t border-outline-variant bg-surface-container-low">
              <td className="py-sm pr-sm text-left font-bold">Total</td>
              {tabela.col_totals.map((c, i) => (
                <td key={i} className="py-sm px-sm font-bold text-primary">{c}</td>
              ))}
              <td className="py-sm px-sm font-bold text-primary">
                {tabela.rows.reduce((acc, r) => acc + r.total, 0)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  )
}