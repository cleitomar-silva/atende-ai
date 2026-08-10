import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, useForm, Spinner } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'

const PALETA = ['#166534', '#dc2626', '#f59e0b', '#0f62fe', '#7c3aed', '#0891b2', '#be185d', '#64748b', '#16a34a', '#9a3412']

const ROLES = ['requester', 'responsible', 'sector']
const ROLE_LABELS = {
  requester: 'Solicitante',
  responsible: 'Demandado',
  sector: 'Setor demandado',
}

export default function SituacaoForm() {
  const toast = useToast()
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = Boolean(id)

  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const { values, setValues, handleChange } = useForm({ name: '', color: PALETA[0], counts_sla: true, is_active: true, transitions: {} })

  useEffect(() => {
    let active = true

    const loadData = async () => {
      setLoading(true)
      try {
        const [list, single] = await Promise.all([
          api('/situations'),
          editing ? api(`/situations/${id}`) : Promise.resolve(null),
        ])
        if (!active) return
        setSituations(list.situations || [])

        if (editing) {
          const s = single?.situation
          if (!s) {
            setNotFound(true)
            return
          }
          const transitions = {}
          ;(s.transitions || []).forEach((t) => {
            transitions[t.to_situation_id] = t.roles || []
          })
          setValues({
            name: s.name,
            color: s.color || PALETA[0],
            counts_sla: Boolean(s.counts_sla),
            is_active: Boolean(s.is_active),
            transitions,
          })
        }
      } catch (err) {
        if (active) setNotFound(true)
      } finally {
        if (active) setLoading(false)
      }
    }

    loadData()
    return () => {
      active = false
    }
  }, [id, editing])

  const destinations = situations.filter((s) => s.id !== (editing ? Number(id) : null))

  const toggleTransitionRole = (toId, role) => {
    setValues((p) => {
      const current = p.transitions[toId] || []
      const next = current.includes(role) ? current.filter((r) => r !== role) : [...current, role]
      return { ...p, transitions: { ...p.transitions, [toId]: next } }
    })
  }

  const toggleAllTransitions = (toId, on) => {
    setValues((p) => ({ ...p, transitions: { ...p.transitions, [toId]: on ? ROLES.slice() : [] } }))
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = { name: values.name, color: values.color, counts_sla: Boolean(values.counts_sla) }
      payload.transitions = Object.entries(values.transitions || {})
        .map(([toId, roles]) => ({ to_situation_id: Number(toId), roles }))
        .filter((t) => t.roles.length > 0)
      if (editing) payload.is_active = Boolean(values.is_active)
      if (editing) {
        await api(`/situations/${id}`, { method: 'PUT', body: payload })
      } else {
        await api('/situations', { method: 'POST', body: payload })
      }
      toast.success(editing ? 'Situação atualizada com sucesso.' : 'Situação cadastrada com sucesso.')
      navigate('/situacao')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-outline-variant rounded-lg px-md py-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div>
      <PageShell>
        <PageHeader
          title={editing ? 'Editar Situação' : 'Nova Situação'}
          subtitle={editing ? 'Altere os dados desta situação do chamado.' : 'Cadastre uma nova situação para os chamados.'}
          actions={
            <button type="button" onClick={() => navigate('/situacao')} className="flex items-center gap-sm px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">arrow_back</span>
              Voltar
            </button>
          }
        />

        {loading ? (
          <div className="py-xl"><Spinner /></div>
        ) : notFound ? (
          <Card>
            <div className="p-lg text-center space-y-md">
              <p className="font-body-md text-body-md text-on-surface-variant">Situação não encontrada ou sem permissão para acessá-la.</p>
              <button onClick={() => navigate('/situacao')} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint transition-all">
                Voltar para Situações
              </button>
            </div>
          </Card>
        ) : (
          <form onSubmit={save} className="space-y-lg max-w-3xl">
            <Card>
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-title-lg font-title-lg">Dados da situação</h3>
              </div>
              <div className="p-lg space-y-md">
                {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}
                <div className="space-y-base">
                  <label className="font-label-md text-label-md text-on-surface-variant">Nome da situação <span className="text-error">*</span></label>
                  <input className={inputClass} name="name" value={values.name} onChange={handleChange} required placeholder="Ex.: Em atendimento" />
                </div>
                <div className="space-y-base">
                  <label className="font-label-md text-label-md text-on-surface-variant">Cor</label>
                  <div className="flex items-center gap-sm flex-wrap">
                    {PALETA.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setValues((p) => ({ ...p, color }))}
                        className={`w-7 h-7 rounded-full border-2 transition-all ${values.color === color ? 'border-on-surface scale-110' : 'border-outline-variant'}`}
                        style={{ backgroundColor: color }}
                        aria-label={`Cor ${color}`}
                      ></button>
                    ))}
                    <input type="color" className="w-8 h-8 border-none" value={values.color} onChange={(e) => setValues((p) => ({ ...p, color: e.target.value }))} />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-label-md text-on-surface-variant">Conta SLA de atendimento</span>
                  <input type="checkbox" name="counts_sla" checked={Boolean(values.counts_sla)} onChange={handleChange} className="w-5 h-5 accent-[#004ccd]" />
                </div>
                {editing && (
                  <div className="flex items-center justify-between">
                    <span className="font-label-md text-on-surface-variant">Ativo</span>
                    <input type="checkbox" name="is_active" checked={Boolean(values.is_active)} onChange={handleChange} className="w-5 h-5 accent-[#004ccd]" />
                  </div>
                )}
              </div>
            </Card>

            <Card>
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-title-lg font-title-lg">Transições permitidas</h3>
              </div>
              <div className="p-lg">
                <p className="text-label-md text-on-surface-variant mb-md">Defina para quais situações este chamado pode mudar e quais perfis executam cada transição.</p>
                <div className="space-y-sm">
                  {destinations.map((dest) => {
                    const activeRoles = values.transitions[dest.id] || []
                    return (
                      <div key={dest.id} className="border border-outline-variant rounded-lg p-md">
                        <div className="flex items-center justify-between mb-sm">
                          <span className="inline-flex items-center gap-sm font-body-md font-semibold">
                            <span className="w-3 h-3 rounded-full border border-outline-variant" style={{ backgroundColor: dest.color }}></span>
                            {dest.name}
                          </span>
                          <button type="button" onClick={() => toggleAllTransitions(dest.id, activeRoles.length === 0)} className="text-label-md text-primary hover:underline">
                            {activeRoles.length === 0 ? 'Habilitar todos' : 'Limpar'}
                          </button>
                        </div>
                        <div className="flex flex-wrap gap-sm">
                          {ROLES.map((role) => {
                            const active = activeRoles.includes(role)
                            return (
                              <button
                                key={role}
                                type="button"
                                onClick={() => toggleTransitionRole(dest.id, role)}
                                className={`px-md py-sm rounded-lg border text-label-md transition-all ${
                                  active
                                    ? 'border-primary bg-primary/10 text-primary'
                                    : 'border-outline-variant text-on-surface-variant hover:border-outline'
                                }`}
                              >
                                {ROLE_LABELS[role]}
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                  {destinations.length === 0 && <p className="text-label-md text-on-surface-variant">Cadastre outras situações para configurar transições.</p>}
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-sm">
              <button type="button" onClick={() => navigate('/situacao')} className="px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
                {saving ? 'Gravando…' : 'Gravar'}
              </button>
            </div>
          </form>
        )}
      </PageShell>
    </div>
  )
}