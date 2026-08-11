import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, Modal, toggleButton } from '../components/dashboard/ui.jsx'
import { api, formatDate } from '../services/api'

export default function Chamados() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState({ sectors: [], users: [], classifications: [], situations: [] })
  const [filters, setFilters] = useState({})
  const [hasFetched, setHasFetched] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState([])

  const filterDefs = [
    { id: 'situation', label: 'Situação', keys: ['situation_id'] },
    { id: 'classification', label: 'Classificação', keys: ['classification_id'] },
    { id: 'responsible_sector', label: 'Setor Demandado', keys: ['responsible_sector_id'] },
    { id: 'opening', label: 'Data de Abertura', keys: ['opened_from', 'opened_to'] },
    { id: 'search', label: 'Busca', keys: ['q'] },
  ]

  const change = (name, value) => setFilters((p) => ({ ...p, [name]: value }))
  const resetFilters = () => {
    setFilters({})
    setSelectedTypes([])
  }

  const removeKeys = (keys) =>
    setFilters((p) => {
      const next = { ...p }
      keys.forEach((k) => delete next[k])
      return next
    })

  const toggleFilter = (id) => {
    if (selectedTypes.includes(id)) {
      removeKeys(filterDefs.find((d) => d.id === id).keys)
      setSelectedTypes((prev) => prev.filter((t) => t !== id))
    } else {
      setSelectedTypes((prev) => [...prev, id])
    }
  }

  const renderBarControl = (def) => {
    const selectClass = (hasValue) =>
      `appearance-none outline-none w-full bg-transparent border-none py-0 pl-1 pr-6 text-body-md focus:ring-0 focus-visible:outline-none cursor-pointer font-medium ${hasValue ? 'text-primary' : 'text-on-surface-variant'}`
    const chevron = (
      <span className="material-symbols-outlined pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[16px] text-on-surface-variant">
        expand_more
      </span>
    )
    if (def.id === 'situation') {
      return (
        <div className="relative w-40 items-center">
          <select value={filters.situation_id || ''} onChange={(e) => change('situation_id', e.target.value)} className={selectClass(!!filters.situation_id)}>
            <option value="">Todos</option>
            {resources.situations.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {chevron}
        </div>
      )
    }
    if (def.id === 'classification') {
      return (
        <div className="relative w-40 items-center">
          <select value={filters.classification_id || ''} onChange={(e) => change('classification_id', e.target.value)} className={selectClass(!!filters.classification_id)}>
            <option value="">Todos</option>
            {resources.classifications.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {chevron}
        </div>
      )
    }
    if (def.id === 'responsible_sector') {
      return (
        <div className="relative w-40 items-center">
          <select value={filters.responsible_sector_id || ''} onChange={(e) => change('responsible_sector_id', e.target.value)} className={selectClass(!!filters.responsible_sector_id)}>
            <option value="">Todos</option>
            {resources.sectors.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          {chevron}
        </div>
      )
    }
    if (def.id === 'opening') {
      return (
        <div className="flex items-center gap-1">
          <input type="date" value={filters.opened_from || ''} onChange={(e) => change('opened_from', e.target.value)} className="appearance-none outline-none bg-transparent border-none py-0 pl-1 pr-1 text-body-md focus:ring-0 focus-visible:outline-none cursor-pointer text-primary" title="Data de abertura (de)" />
          <span className="text-on-surface-variant px-0.5">–</span>
          <input type="date" value={filters.opened_to || ''} onChange={(e) => change('opened_to', e.target.value)} className="appearance-none outline-none bg-transparent border-none py-0 pl-1 pr-1 text-body-md focus:ring-0 focus-visible:outline-none cursor-pointer text-primary" title="Data de abertura (até)" />
        </div>
      )
    }
    return (
      <input value={filters.q || ''} onChange={(e) => change('q', e.target.value)} className="outline-none bg-transparent border-none py-0 pl-1 pr-2 text-body-md focus:ring-0 focus-visible:outline-none text-primary placeholder:text-outline" placeholder="Buscar…" />
    )
  }

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

        <div className="bg-surface-container-low border border-outline-variant p-sm rounded-lg flex items-center gap-md flex-wrap">
          <button onClick={() => setFilterOpen(true)} className="group flex items-center gap-xs px-md py-1.5 border-r border-outline-variant cursor-pointer hover:text-primary transition-colors" title="Abrir filtros">
            <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">filter_list</span>
            <span className="font-semibold text-label-md uppercase">Filtros</span>
          </button>
          <div className="flex gap-sm flex-1 flex-wrap items-center min-w-0">
            {selectedTypes.length === 0 ? (
              <p className="text-label-md text-on-surface-variant ml-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                Nenhum filtro aplicado
              </p>
            ) : (
              selectedTypes.map((id) => {
                const def = filterDefs.find((d) => d.id === id)
                return (
                  <div
                    key={id}
                    className="bg-white border border-outline-variant rounded-lg shadow-sm px-3 pt-1.5 pb-1 transition-all hover:border-primary/60"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant leading-none whitespace-nowrap">{def.label}</span>
                      <button onClick={() => toggleFilter(id)} className="p-0.5 -mr-1 rounded-full text-on-surface-variant hover:bg-error-container hover:text-error transition-colors" title="Remover filtro">
                        <span className="material-symbols-outlined text-[16px]">close</span>
                      </button>
                    </div>
                    <div className="mt-1">{renderBarControl(def)}</div>
                  </div>
                )
              })
            )}
          </div>
          <button onClick={resetFilters} disabled={!hasActiveFilters} className="flex items-center gap-1 text-label-md font-semibold text-on-surface-variant hover:text-error px-md whitespace-nowrap transition-colors disabled:opacity-50">
            <span className="material-symbols-outlined text-[16px]">restart_alt</span>
            Limpar Filtros
          </button>
        </div>

        <Modal open={filterOpen} title="Filtros" onClose={() => setFilterOpen(false)}>
          <p className="text-body-md text-on-surface-variant mb-lg">Marque abaixo quais filtros deseja que apareçam na barra de filtros. A escolha do valor é feita diretamente na barra.</p>
          <div className="space-y-md">
            {filterDefs.map((def) => {
              const on = selectedTypes.includes(def.id)
              return (
                <div key={def.id} onClick={() => toggleFilter(def.id)} className={`flex items-center justify-between gap-md p-lg rounded-lg border transition-colors cursor-pointer ${on ? 'border-primary bg-primary-fixed/40' : 'border-outline-variant hover:bg-surface-container-low'}`}>
                  <span className="font-label-md text-label-md text-on-surface uppercase font-bold">{def.label}</span>
                  <div onClick={(e) => e.stopPropagation()}>
                    {toggleButton(on, () => toggleFilter(def.id))}
                  </div>
                </div>
              )
            })}
          </div>
        </Modal>

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