import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, EmptyState, Drawer, StatusBadge, useForm, Spinner } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

export default function Categoria() {
  const toast = useToast()
  const confirm = useConfirm()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { values, setValues, handleChange } = useForm({ name: '', is_active: true })

  const load = () => {
    setLoading(true)
    api('/categories')
      .then((d) => setCategories(d.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditing(null)
    setValues({ name: '', is_active: true })
    setError('')
    setOpen(true)
  }

  const openEdit = (c) => {
    setEditing(c)
    setValues({ name: c.name, is_active: Boolean(c.is_active) })
    setError('')
    setOpen(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api(`/categories/${editing.id}`, { method: 'PUT', body: values })
      } else {
        await api('/categories', { method: 'POST', body: { name: values.name } })
      }
      setOpen(false)
      load()
      toast.success(editing ? 'Categoria atualizada com sucesso.' : 'Categoria cadastrada com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (c) => {
    const ok = await confirm({
      title: 'Excluir categoria',
      message: `Excluir a categoria "${c.name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    try {
      await api(`/categories/${c.id}`, { method: 'DELETE' })
      load()
      toast.success('Categoria excluída com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const inputClass =
    'w-full bg-transparent border border-outline-variant rounded-lg px-md py-md text-sm text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'

  return (
    <div>
      <PageShell>
        <PageHeader title="Categorias" subtitle="Gerencie as categorias de chamados." />
        <Card>
          <div className="p-lg flex justify-end">
            <button onClick={openCreate} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Categoria
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : categories.length === 0 ? (
            <EmptyState message="Nenhuma categoria cadastrada ainda." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Nome da categoria</th>
                    <th className="px-lg py-sm text-left">Status</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((c) => (
                    <tr key={c.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm font-body-md font-semibold">{c.name}</td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={c.is_active ? 'Ativo' : 'Desativado'} color={c.is_active ? '#16a34a' : '#ba1a1a'} />
                      </td>
                      <td className="px-lg py-sm text-right">
                        <button onClick={() => openEdit(c)} className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => remove(c)} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Excluir">
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
        title={editing ? 'Editar Categoria' : 'Nova Categoria'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
            <button type="submit" form="categoria-form" disabled={saving} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Gravando…' : 'Gravar'}
            </button>
          </>
        }
      >
        <form id="categoria-form" onSubmit={save} className="space-y-lg">
          {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Nome da categoria <span className="text-error">*</span></label>
            <input className={inputClass} name="name" value={values.name} onChange={handleChange} required placeholder="Ex.: Incidente" />
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