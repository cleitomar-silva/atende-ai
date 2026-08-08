import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, EmptyState, Drawer, StatusBadge, useForm, Spinner } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

const PALETA = ['#166534', '#dc2626', '#f59e0b', '#0f62fe', '#7c3aed', '#0891b2', '#be185d', '#64748b', '#16a34a', '#9a3412']

const ROLES = ['requester', 'responsible', 'sector']
const ROLE_LABELS = {
  requester: 'Solicitante',
  responsible: 'Demandado',
  sector: 'Setor demandado',
}

export default function Situacao() {
  const toast = useToast()
  const confirm = useConfirm()
  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { values, setValues, handleChange } = useForm({ name: '', color: PALETA[0], counts_sla: true, is_active: true, transitions: {} })

  const load = () => {
    setLoading(true)
    api('/situations')
      .then((d) => setSituations(d.situations || []))
      .catch(() => setSituations([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditing(null)
    setValues({ name: '', color: PALETA[0], counts_sla: true, is_active: true, transitions: {} })
    setError('')
    setOpen(true)
  }

  const openEdit = (s) => {
    const transitions = {}
    ;(s.transitions || []).forEach((t) => {
      transitions[t.to_situation_id] = t.roles || []
    })
    setEditing(s)
    setValues({
      name: s.name,
      color: s.color || PALETA[0],
      counts_sla: Boolean(s.counts_sla),
      is_active: Boolean(s.is_active),
      transitions,
    })
    setError('')
    setOpen(true)
  }

  const destinations = situations.filter((s) => s.id !== (editing && editing.id))

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
        await api(`/situations/${editing.id}`, { method: 'PUT', body: payload })
      } else {
        await api('/situations', { method: 'POST', body: payload })
      }
      setOpen(false)
      load()
      toast.success(editing ? 'Situação atualizada com sucesso.' : 'Situação cadastrada com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (s) => {
    const ok = await confirm({
      title: 'Excluir situação',
      message: `Excluir a situação "${s.name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    try {
      await api(`/situations/${s.id}`, { method: 'DELETE' })
      load()
      toast.success('Situação excluída com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-outline-variant rounded-lg px-md py-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div>
      <PageShell>
        <PageHeader title="Situações do Chamado" subtitle="Gerencie os status/situações dos chamados." />
        <Card>
          <div className="p-lg flex justify-end">
            <button onClick={openCreate} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Situação
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : situations.length === 0 ? (
            <EmptyState message="Nenhuma situação cadastrada ainda." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Nome da situação</th>
                    <th className="px-lg py-sm text-left">Cor</th>
                    <th className="px-lg py-sm text-left">Conta SLA</th>
                    <th className="px-lg py-sm text-left">Status</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {situations.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm font-body-md font-semibold">{s.name}</td>
                      <td className="px-lg py-sm">
                        <span className="inline-flex items-center gap-sm">
                          <span className="w-4 h-4 rounded-full border border-outline-variant" style={{ backgroundColor: s.color }}></span>
                          <span className="text-label-md text-on-surface-variant uppercase">{s.color}</span>
                        </span>
                      </td>
                      <td className="px-lg py-sm text-on-surface-variant">{s.counts_sla ? 'Sim' : 'Não'}</td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={s.is_active ? 'Ativo' : 'Desativado'} color={s.is_active ? '#16a34a' : '#ba1a1a'} />
                      </td>
                      <td className="px-lg py-sm text-right">
                        <button onClick={() => openEdit(s)} className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => remove(s)} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Excluir">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </PageShell>

      <Drawer
        open={open}
        title={editing ? 'Editar Situação' : 'Nova Situação'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
            <button type="submit" form="situacao-form" disabled={saving} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Gravando…' : 'Gravar'}
            </button>
          </>
        }
      >
        <form id="situacao-form" onSubmit={save} className="space-y-lg">
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
          <div className="space-y-base">
            <div>
              <span className="font-label-md text-label-md text-on-surface-variant">Transições permitidas</span>
              <p className="text-label-md text-on-surface-variant mt-1">Defina para quais situações este chamado pode mudar e quais perfis executam cada transição.</p>
            </div>
            <div className="space-y-sm max-h-56 overflow-y-auto custom-scrollbar pr-sm">
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
          {editing && (
            <div className="flex items-center justify-between">
              <span className="font-label-md text-on-surface-variant">Ativo</span>
              <input type="checkbox" name="is_active" checked={Boolean(values.is_active)} onChange={handleChange} className="w-5 h-5 accent-[#004ccd]" />
            </div>
          )}
        </form>
      </Drawer>
    </div>
  )
}