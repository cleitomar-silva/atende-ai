import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, Modal, toggleButton } from '../components/dashboard/ui.jsx'
import { api, formatDate } from '../services/api'

const FILTER_STORAGE_KEY = 'atendeai_selected_filter_types'
const DEFAULT_FILTER_TYPES = ['number', 'opening']

const MULTI_FILTERS = {
  situation: { key: 'situation_id', list: 'situations' },
  classification: { key: 'classification_id', list: 'classifications' },
  category: { key: 'category_id', list: 'categories' },
  requesting_sector: { key: 'requesting_sector_id', list: 'sectors' },
  requesting_user: { key: 'requesting_user_id', list: 'users' },
}

const loadSelectedTypes = () => {
  try {
    const raw = localStorage.getItem(FILTER_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      const valid = Array.isArray(parsed) ? parsed.filter((id) => [
        'number', 'situation', 'classification', 'category', 'requesting_sector', 'requesting_user', 'opening', 'search',
      ].includes(id)) : []
      if (valid.length) return valid
    }
  } catch {
    // ignora valores corrompidos e usa o padrão
  }
  return DEFAULT_FILTER_TYPES
}

export default function Chamados() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [resources, setResources] = useState({ sectors: [], users: [], classifications: [], situations: [], categories: [] })
  const [filters, setFilters] = useState({})
  const [hasFetched, setHasFetched] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selectedTypes, setSelectedTypes] = useState(loadSelectedTypes)
  const [openDropdown, setOpenDropdown] = useState(null)
  const barRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(selectedTypes))
  }, [selectedTypes])

  useEffect(() => {
    if (!openDropdown) return
    const handle = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setOpenDropdown(null)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [openDropdown])

  const filterDefs = [
    { id: 'number', label: 'Nº Chamado', keys: ['number'] },
    { id: 'situation', label: 'Situação', keys: ['situation_id'] },
    { id: 'classification', label: 'Classificação', keys: ['classification_id'] },
    { id: 'category', label: 'Categoria', keys: ['category_id'] },
    { id: 'requesting_sector', label: 'Setor Solicitante', keys: ['requesting_sector_id'] },
    { id: 'requesting_user', label: 'Usuário Solicitante', keys: ['requesting_user_id'] },
    { id: 'opening', label: 'Data de Abertura', keys: ['opened_from', 'opened_to'] },
    { id: 'search', label: 'Busca', keys: ['q'] },
  ]

  const change = (name, value) => setFilters((p) => ({ ...p, [name]: value }))
  const resetFilters = () => {
    setFilters({})
    setSelectedTypes([])
  }

  const toggleListValue = (key, value) =>
    setFilters((p) => {
      const cur = Array.isArray(p[key]) ? p[key] : []
      const next = cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]
      return { ...p, [key]: next }
    })

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
    const chipClass =
      'flex flex-col gap-0.5 bg-surface-container-lowest border border-outline-variant rounded-xl px-3 py-1.5 shadow-sm transition-all hover:border-primary/60 cursor-pointer min-w-[130px]'
    const labelClass = 'text-[10px] font-bold uppercase tracking-wider text-on-surface-variant whitespace-nowrap'
    const inputClass =
      'outline-none bg-transparent border-none text-body-md font-medium text-primary placeholder:text-outline focus:ring-0 rounded focus:bg-primary/5 px-1 w-24 min-w-0'
    const closeBtnClass =
      'p-0.5 -mr-1 rounded-full text-on-surface-variant hover:bg-error-container/60 hover:text-error transition-colors'
    const labelRowClass = 'flex items-center justify-between gap-2 w-full'

    if (MULTI_FILTERS[def.id]) {
      const cfg = MULTI_FILTERS[def.id]
      const list = resources[cfg.list] || []
      const selected = Array.isArray(filters[cfg.key]) ? filters[cfg.key] : []
      const isOpen = openDropdown === def.id
      const summary =
        selected.length === 0
          ? 'Todos'
          : selected.length === 1
            ? (list.find((x) => String(x.id) === String(selected[0]))?.name ?? selected[0])
            : `${selected.length} selecionados`

      return (
        <div className="relative" key={def.id}>
          <div
            className={`${chipClass} ${isOpen ? 'border-primary/70' : ''}`}
            onClick={() => setOpenDropdown(isOpen ? null : def.id)}
          >
            <div className={labelRowClass}>
              <span className={labelClass}>{def.label}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFilter(def.id)
                  setOpenDropdown(null)
                }}
                className={closeBtnClass}
                title="Remover filtro"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-1 w-full">
              <span className={`text-body-md font-medium truncate ${selected.length ? 'text-primary' : 'text-on-surface-variant'}`}>{summary}</span>
              <span className={`material-symbols-outlined text-[16px] text-on-surface-variant shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </div>
          </div>

          {isOpen && (
            <div className="absolute top-full mt-1 left-0 z-50 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg p-sm max-h-64 overflow-y-auto custom-scrollbar">
              {selected.length > 0 && (
                <button
                  onClick={() => setFilters((p) => ({ ...p, [cfg.key]: [] }))}
                  className="w-full text-left px-md py-sm text-label-md font-semibold text-primary hover:bg-primary/5 rounded mb-xs"
                >
                  Limpar seleção
                </button>
              )}
              {list.map((item) => {
                const checked = selected.includes(String(item.id))
                return (
                  <label key={item.id} className="flex items-center gap-2 px-md py-sm rounded hover:bg-surface-container-low cursor-pointer">
                    <input type="checkbox" className="accent-primary shrink-0" checked={checked} onChange={() => toggleListValue(cfg.key, String(item.id))} />
                    <span className="text-body-md truncate">{item.name}</span>
                  </label>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    let control
    if (def.id === 'number') {
      control = (
        <input type="number" min="0" value={filters.number || ''} onChange={(e) => change('number', e.target.value)} className={inputClass} placeholder="Ex.: 123" title="Nº do chamado" />
      )
    } else if (def.id === 'opening') {
      control = (
        <div className="flex items-center gap-1 pr-1">
          <input type="date" value={filters.opened_from || ''} onChange={(e) => change('opened_from', e.target.value)} className="outline-none bg-transparent border-none text-body-md font-medium text-primary focus:ring-0 cursor-pointer" title="Data de abertura (de)" />
          <span className="text-on-surface-variant text-label-md">–</span>
          <input type="date" value={filters.opened_to || ''} onChange={(e) => change('opened_to', e.target.value)} className="outline-none bg-transparent border-none text-body-md font-medium text-primary focus:ring-0 cursor-pointer" title="Data de abertura (até)" />
        </div>
      )
    } else {
      control = (
        <input value={filters.q || ''} onChange={(e) => change('q', e.target.value)} className={inputClass} placeholder="Buscar…" />
      )
    }

    return (
      <div className={chipClass} key={def.id}>
        <div className={labelRowClass}>
          <span className={labelClass}>{def.label}</span>
          <button onClick={() => toggleFilter(def.id)} className={closeBtnClass} title="Remover filtro">
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>
        <div className="flex items-center w-full">{control}</div>
      </div>
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
    Promise.all([api('/sectors'), api('/users'), api('/classifications'), api('/situations'), api('/categories')])
      .then(([s, u, c, si, cat]) => setResources({ sectors: s.sectors, users: u.users, classifications: c.classifications, situations: si.situations, categories: cat.categories }))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const timer = setTimeout(load, 250)
    return () => clearTimeout(timer)
  }, [JSON.stringify(filters)])

  const hasActiveFilters = Object.values(filters).some((v) => {
    if (Array.isArray(v)) return v.length > 0
    return v !== '' && v !== null && v !== undefined
  })

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
          <div className="flex gap-sm flex-1 flex-wrap items-center min-w-0" ref={barRef}>
            {selectedTypes.length === 0 ? (
              <p className="text-label-md text-on-surface-variant ml-md flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">filter_alt_off</span>
                Nenhum filtro aplicado
              </p>
            ) : (
              selectedTypes.map((id) => {
                const def = filterDefs.find((d) => d.id === id)
                return <div key={id}>{renderBarControl(def)}</div>
              })
            )}
          </div>
          <button onClick={resetFilters} disabled={!hasActiveFilters && selectedTypes.length === 0} className="flex items-center gap-1 text-label-md font-semibold text-on-surface-variant hover:text-error px-md whitespace-nowrap transition-colors disabled:opacity-50">
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
              <table className="w-full text-left zebra-table border-collapse">
                <thead className="sticky top-0 bg-white z-10 border-b-2 border-outline-variant">
                  <tr className="text-label-md text-on-surface-variant uppercase tracking-wider bg-primary-fixed/30">
                    <th className="px-md py-lg font-bold">Nº</th>
                    <th className="px-md py-lg font-bold">Abertura</th>
                    <th className="px-md py-lg font-bold">Título</th>
                    <th className="px-md py-lg font-bold">Situação</th>
                    <th className="px-md py-lg font-bold">Solicitante</th>
                    <th className="px-md py-lg font-bold">Demandado</th>
                    <th className="px-md py-lg font-bold text-center">Ações</th>
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