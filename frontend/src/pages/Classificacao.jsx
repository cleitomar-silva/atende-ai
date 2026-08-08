import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, EmptyState, Drawer, StatusBadge, useForm, Spinner, inputClass } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

export default function Classificacao() {
  const toast = useToast()
  const confirm = useConfirm()
  const [items, setItems] = useState([])
  const [groups, setGroups] = useState([])
  const [categories, setCategories] = useState([])
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { values, setValues, handleChange } = useForm({
    name: '', group_id: '', category_id: '', sector_ids: [], sla_minutes: 60, default_description: '', is_active: true,
  })

  const loadLists = async () => {
    const [cl, g, c, s] = await Promise.all([
      api('/classifications'),
      api('/groups'),
      api('/categories'),
      api('/sectors'),
    ])
    return { classifications: cl.classifications || [], groups: g.groups || [], categories: c.categories || [], sectors: s.sectors || [] }
  }

  const load = () => {
    setLoading(true)
    loadLists()
      .then((d) => {
        setItems(d.classifications)
        setGroups(d.groups)
        setCategories(d.categories)
        setSectors(d.sectors)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditing(null)
    setValues({ name: '', group_id: groups[0]?.id || '', category_id: categories[0]?.id || '', sector_ids: [], sla_minutes: 60, default_description: '', is_active: true })
    setError('')
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditing(item)
    setValues({
      name: item.name,
      group_id: item.group_id,
      category_id: item.category_id,
      sector_ids: (item.sectors || []).map((s) => s.id),
      sla_minutes: item.sla_minutes,
      default_description: item.default_description || '',
      is_active: Boolean(item.is_active),
    })
    setError('')
    setOpen(true)
  }

  const toggleSector = (id) => {
    setValues((p) => ({
      ...p,
      sector_ids: p.sector_ids.includes(id) ? p.sector_ids.filter((s) => s !== id) : [...p.sector_ids, id],
    }))
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    const payload = {
      name: values.name,
      group_id: Number(values.group_id),
      category_id: Number(values.category_id),
      sector_ids: values.sector_ids.map(Number),
      sla_minutes: Number(values.sla_minutes),
      default_description: values.default_description,
    }
    if (editing) payload.is_active = Boolean(values.is_active)
    try {
      if (editing) {
        await api(`/classifications/${editing.id}`, { method: 'PUT', body: payload })
      } else {
        await api('/classifications', { method: 'POST', body: payload })
      }
      setOpen(false)
      load()
      toast.success(editing ? 'Classificação atualizada com sucesso.' : 'Classificação cadastrada com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (item) => {
    const ok = await confirm({
      title: 'Excluir classificação',
      message: `Excluir a classificação "${item.name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    try {
      await api(`/classifications/${item.id}`, { method: 'DELETE' })
      load()
      toast.success('Classificação excluída com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageShell>
        <PageHeader title="Classificações de Chamado" subtitle="Gerencie os tipos de chamado." />
        <Card>
          <div className="p-lg flex justify-end">
            <button onClick={openCreate} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Classificação
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : items.length === 0 ? (
            <EmptyState message="Nenhuma classificação cadastrada ainda." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Grupo</th>
                    <th className="px-lg py-sm text-left">Nome</th>
                    <th className="px-lg py-sm text-left">Setores habilitados</th>
                    <th className="px-lg py-sm text-left">Status</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm text-on-surface-variant">{item.group?.name || '—'}</td>
                      <td className="px-lg py-sm font-body-md font-semibold">
                        {item.name}
                        <span className="block text-label-md text-on-surface-variant font-normal">{item.category?.name}</span>
                      </td>
                      <td className="px-lg py-sm">
                        <div className="flex flex-wrap gap-1 max-w-[260px]">
                          {(item.sectors || []).map((s) => (
                            <span key={s.id} className="px-2 py-0.5 bg-surface-container-high rounded-full text-label-md">{s.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={item.is_active ? 'Ativo' : 'Desativado'} color={item.is_active ? '#16a34a' : '#ba1a1a'} />
                      </td>
                      <td className="px-lg py-sm text-right whitespace-nowrap">
                        <button onClick={() => openEdit(item)} className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => remove(item)} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Excluir">
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
        title={editing ? 'Editar Classificação' : 'Nova Classificação'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
            <button type="submit" form="classificacao-form" disabled={saving} className="px-md py-2 rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Gravando…' : 'Gravar'}
            </button>
          </>
        }
      >
        <form id="classificacao-form" onSubmit={save} className="space-y-lg">
          {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant">Grupo <span className="text-error">*</span></label>
              <select name="group_id" value={values.group_id} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Selecione</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant">Categoria <span className="text-error">*</span></label>
              <select name="category_id" value={values.category_id} onChange={handleChange} className={inputClass}>
                <option value="" disabled>Selecione</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Nome da classificação <span className="text-error">*</span></label>
            <input className={inputClass} name="name" value={values.name} onChange={handleChange} required placeholder="Ex.: Acesso" />
          </div>

          <div className="space-y-base">
            <div className="flex justify-between items-center">
              <label className="font-label-md text-label-md text-on-surface-variant">Setores habilitados <span className="text-error">*</span></label>
            </div>
            <div className="flex flex-wrap gap-sm">
              {sectors.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggleSector(s.id)}
                  className={`px-md py-2 rounded-lg border text-label-md transition-all ${
                    values.sector_ids.includes(s.id)
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-outline-variant text-on-surface-variant hover:border-outline'
                  }`}
                >
                  {s.name}
                </button>
              ))}
              {sectors.length === 0 && <p className="text-label-md text-on-surface-variant">Cadastre setores antes.</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-base">
              <label className="font-label-md text-on-surface-variant">SLA (minutos)</label>
              <input type="number" min="0" name="sla_minutes" value={values.sla_minutes} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Descrição padrão</label>
            <textarea name="default_description" value={values.default_description} onChange={handleChange} rows={3} className={inputClass} placeholder="Texto padrão ao abrir um chamado deste tipo"></textarea>
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