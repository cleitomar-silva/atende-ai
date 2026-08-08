import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, EmptyState, Drawer, StatusBadge, useForm, Spinner, inputClass } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

const ROLES = [
  { value: 'admin', label: 'Administrador' },
  { value: 'gestor', label: 'Gestor' },
  { value: 'colaborador', label: 'Colaborador' },
]

const roleMeta = {
  admin: { color: '#004ccd', label: 'Administrador' },
  gestor: { color: '#7c3aed', label: 'Gestor' },
  colaborador: { color: '#0891b2', label: 'Colaborador' },
}

export default function Usuario() {
  const toast = useToast()
  const confirm = useConfirm()
  const [users, setUsers] = useState([])
  const [sectors, setSectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const { values, setValues, handleChange } = useForm({
    name: '', email: '', password: '', role: 'colaborador', sector_ids: [], is_active: true,
  })

  const load = () => {
    setLoading(true)
    Promise.all([api('/users'), api('/sectors')])
      .then(([u, s]) => {
        setUsers(u.users || [])
        setSectors(s.sectors || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const openCreate = () => {
    setEditing(null)
    setValues({ name: '', email: '', password: '', role: 'colaborador', sector_ids: [], is_active: true })
    setError('')
    setOpen(true)
  }

  const openEdit = (u) => {
    setEditing(u)
    setValues({
      name: u.name,
      email: u.email,
      password: '',
      role: u.role,
      sector_ids: (u.sectors || []).map((s) => s.id),
      is_active: Boolean(u.is_active),
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
    try {
      const payload = {
        name: values.name,
        email: values.email,
        role: values.role,
        sector_ids: values.sector_ids.map(Number),
      }
      if (values.password) payload.password = values.password
      if (editing) payload.is_active = Boolean(values.is_active)

      if (editing) {
        await api(`/users/${editing.id}`, { method: 'PUT', body: payload })
      } else {
        await api('/users', { method: 'POST', body: payload })
      }
      setOpen(false)
      load()
      toast.success(editing ? 'Usuário atualizado com sucesso.' : 'Usuário cadastrado com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const remove = async (u) => {
    const ok = await confirm({
      title: 'Excluir usuário',
      message: `Excluir o usuário "${u.name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    try {
      await api(`/users/${u.id}`, { method: 'DELETE' })
      load()
      toast.success('Usuário excluído com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const filtered = users.filter((u) => !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <PageShell>
        <PageHeader title="Usuários" subtitle="Gerencie os usuários da sua empresa." />
        <Card>
          <div className="p-lg flex justify-between items-center gap-md">
            <input
              className={inputClass}
              placeholder="Buscar por nome ou e-mail…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button onClick={openCreate} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all shrink-0">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Novo Usuário
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : filtered.length === 0 ? (
            <EmptyState message="Nenhum usuário encontrado." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Permissão</th>
                    <th className="px-lg py-sm text-left">Setores</th>
                    <th className="px-lg py-sm text-left">Nome</th>
                    <th className="px-lg py-sm text-left">E-mail</th>
                    <th className="px-lg py-sm text-left">Status</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-md font-semibold" style={{ backgroundColor: `${roleMeta[u.role]?.color}1a`, color: roleMeta[u.role]?.color }}>
                          {roleMeta[u.role]?.label || u.role}
                        </span>
                      </td>
                      <td className="px-lg py-sm">
                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                          {(u.sectors || []).map((s) => (
                            <span key={s.id} className="px-2 py-0.5 bg-surface-container-high rounded-full text-label-md">{s.name}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-lg py-sm font-body-md font-semibold">{u.name}</td>
                      <td className="px-lg py-sm text-on-surface-variant">{u.email}</td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={u.is_active ? 'Ativo' : 'Desativado'} color={u.is_active ? '#16a34a' : '#ba1a1a'} />
                      </td>
                      <td className="px-lg py-sm text-right whitespace-nowrap">
                        <button onClick={() => openEdit(u)} className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => remove(u)} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Excluir">
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
        title={editing ? 'Editar Usuário' : 'Novo Usuário'}
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
            <button type="submit" form="usuario-form" disabled={saving} className="px-md py-2 rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Gravando…' : 'Gravar'}
            </button>
          </>
        }
      >
        <form id="usuario-form" onSubmit={save} className="space-y-lg">
          {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}
          <div className="grid grid-cols-2 gap-md">
            <div className="space-y-base col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant">Nome <span className="text-error">*</span></label>
              <input className={inputClass} name="name" value={values.name} onChange={handleChange} required />
            </div>
            <div className="space-y-base col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant">E-mail <span className="text-error">*</span></label>
              <input className={inputClass} name="email" type="email" value={values.email} onChange={handleChange} required />
            </div>
            <div className="space-y-base col-span-2">
              <label className="font-label-md text-label-md text-on-surface-variant">
                Senha {editing ? '(deixe em branco para manter)' : ''} <span className="text-error">*</span>
              </label>
              <input className={inputClass} name="password" type="password" value={values.password} onChange={handleChange} required={!editing} minLength={6} />
            </div>
            <div className="space-y-base">
              <label className="font-label-md text-label-md text-on-surface-variant">Nível de permissão <span className="text-error">*</span></label>
              <select name="role" value={values.role} onChange={handleChange} className={inputClass}>
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            {editing && (
              <div className="flex items-end justify-between pb-sm">
                <span className="font-label-md text-on-surface-variant">Ativo</span>
                <input type="checkbox" name="is_active" checked={Boolean(values.is_active)} onChange={handleChange} className="w-5 h-5 accent-[#004ccd]" />
              </div>
            )}
          </div>

          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Setores (pode escolher vários) <span className="text-error">*</span></label>
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
            </div>
          </div>
        </form>
      </Drawer>
    </div>
  )
}