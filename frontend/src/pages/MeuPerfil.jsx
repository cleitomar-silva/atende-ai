import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'

export default function MeuPerfil() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [name, setName] = useState(user?.name || '')
  const [email, setEmail] = useState(user?.email || '')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const roleLabel = user?.role === 'admin' ? 'Administrador' : user?.role === 'gestor' ? 'Gestor' : 'Colaborador'

  const save = async (e) => {
    e.preventDefault()
    setError('')

    if (password && password !== passwordConfirm) {
      setError('As senhas não coincidem.')
      return
    }

    setSaving(true)
    try {
      const body = { name, email }
      if (password) body.password = password

      const data = await api('/me', { method: 'PUT', body })
      updateUser(data.user)
      setPassword('')
      setPasswordConfirm('')
      toast.success('Perfil atualizado com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <PageShell>
      <PageHeader title="Meu Perfil" subtitle="Altere suas informações pessoais." />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <Card>
          <div className="p-lg flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[32px] font-bold mb-md">
              {(name || 'U').charAt(0).toUpperCase()}
            </div>
            <p className="font-title-lg font-bold">{user?.name}</p>
            <p className="text-label-md text-on-surface-variant">{user?.email}</p>
            <span className="mt-md px-3 py-1 bg-primary/10 text-primary rounded-full text-label-md font-semibold">{roleLabel}</span>
            <p className="mt-md text-label-md text-on-surface-variant">
              Empresa: <strong className="text-on-surface">{user?.company?.name}</strong>
            </p>
            <p className="text-label-md text-on-surface-variant">
              Setores: {(user?.sectors || []).map((s) => s.name).join(', ')}
            </p>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <form onSubmit={save} className="space-y-lg">
            <Card>
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-title-lg">Informações básicas</h3>
              </div>
              <div className="p-lg space-y-md">
                {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">Nome</label>
                  <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="space-y-base">
                  <label className="font-label-md text-on-surface-variant">E-mail</label>
                  <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </div>
            </Card>

            <Card>
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-title-lg">Alterar senha</h3>
              </div>
              <div className="p-lg space-y-md">
                <p className="text-label-md text-on-surface-variant">Deixe em branco para manter a senha atual.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Nova senha</label>
                    <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={6} />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Confirmar nova senha</label>
                    <input className={inputClass} type="password" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} minLength={6} />
                  </div>
                </div>
              </div>
            </Card>

            <div className="flex justify-end gap-sm">
              <button type="button" onClick={() => navigate(-1)} className="px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
                {saving ? 'Gravando…' : 'Gravar alterações'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </PageShell>
  )
}