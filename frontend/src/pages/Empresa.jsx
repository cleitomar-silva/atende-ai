import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Drawer, useForm, Spinner, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'

function formatCnpj(value) {
  const d = String(value || '').replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\/\d{4})(\d)/, '$1-$2')
}

export default function Empresa() {
  const { user, updateUser } = useAuth()
  const toast = useToast()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const { values, setValues, handleChange } = useForm({ name: '', cnpj: '', is_active: true })

  useEffect(() => {
    api('/company')
      .then((d) => {
        setCompany(d.company)
        setValues({ name: d.company.name, cnpj: formatCnpj(d.company.cnpj), is_active: Boolean(d.company.is_active) })
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const save = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const data = await api('/company', {
        method: 'PUT',
        body: { name: values.name, cnpj: values.cnpj, is_active: Boolean(values.is_active) },
      })
      setCompany(data.company)
      updateUser({ ...user, company: { ...user.company, ...data.company } })
      setOpen(false)
      toast.success('Empresa atualizada com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <PageShell>
        <Spinner />
      </PageShell>
    )
  }

  const isAdmin = user?.role === 'admin'

  return (
    <div>
      <PageShell>
        <PageHeader
          title="Empresa"
          subtitle="Informações da empresa em que você está vinculado."
          actions={
            isAdmin && (
              <button onClick={() => setOpen(true)} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
                <span className="material-symbols-outlined text-[18px]">edit</span>
                Editar
              </button>
            )
          }
        />
        <Card>
          <div className="p-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
              <InfoBlock label="Nome da Empresa" value={company?.name} icon="corporate_fare" />
              <InfoBlock label="CNPJ" value={formatCnpj(company?.cnpj)} icon="pin" />
              <InfoBlock
                label="Status"
                value={company?.is_active ? 'Ativa' : 'Desativada'}
                icon="toggle_on"
                color={company?.is_active ? '#16a34a' : '#ba1a1a'}
              />
              <InfoBlock label="Cadastro" value={new Date(company?.created_at).toLocaleDateString('pt-BR')} icon="calendar_today" />
            </div>
            {!isAdmin && (
              <p className="mt-lg px-md py-sm bg-surface-container-low rounded-lg text-label-md text-on-surface-variant">
                Somente administradores podem editar as informações da empresa.
              </p>
            )}
          </div>
        </Card>
      </PageShell>

<Drawer
        open={open}
        title="Editar Empresa"
        onClose={() => setOpen(false)}
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="px-md py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">Cancelar</button>
            <button type="submit" form="empresa-form" disabled={saving} className="px-md py-2 rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Gravando…' : 'Gravar'}
            </button>
          </>
        }
      >
        <form id="empresa-form" onSubmit={save} className="space-y-lg">
          {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">Nome da Empresa <span className="text-error">*</span></label>
            <input className={inputClass} name="name" value={values.name} onChange={handleChange} required />
          </div>
          <div className="space-y-base">
            <label className="font-label-md text-label-md text-on-surface-variant">CNPJ <span className="text-error">*</span></label>
            <input className={inputClass} name="cnpj" value={values.cnpj} onChange={handleChange} required />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="font-label-md text-on-surface-variant block">Status</span>
              <span className="text-label-md text-on-surface-variant">Desativada, se inativa, os usuários não conseguem acessar o sistema.</span>
            </div>
            <input type="checkbox" name="is_active" checked={Boolean(values.is_active)} onChange={handleChange} className="w-5 h-5 accent-[#004ccd]" />
          </div>
        </form>
      </Drawer>
    </div>
  )
}

function InfoBlock({ label, value, icon, color }) {
  return (
    <div className="flex items-start gap-md p-md bg-surface-container-low rounded-xl">
      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="text-label-md text-on-surface-variant">{label}</p>
        <p className="font-title-lg text-title-lg font-bold" style={{ color: color || undefined }}>{value || '—'}</p>
      </div>
    </div>
  )
}