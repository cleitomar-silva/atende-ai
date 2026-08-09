import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'

export default function CadastroChamado() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [classifications, setClassifications] = useState([])
  const [sectors, setSectors] = useState([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    classification_id: '',
    responsible_sector_id: '',
    requesting_sector_id: '',
    title: '',
    description: '',
  })
  const [attachments, setAttachments] = useState([])

  const maxAttachmentBytes = 15 * 1024 * 1024
  const attachmentsBytes = attachments.reduce((sum, f) => sum + (f.size || 0), 0)
  const overAttachmentLimit = attachmentsBytes > maxAttachmentBytes
  const overAttachmentBytes = attachmentsBytes - maxAttachmentBytes

  const showRequestingSector = (user?.sectors || []).length > 1

  useEffect(() => {
    Promise.all([api('/classifications'), api('/sectors')])
      .then(([c, s]) => {
        setClassifications(c.classifications || [])
        setSectors(s.sectors || [])
      })
      .catch(() => {})
  }, [])

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }))

  const availableClassifications = classifications.filter((c) =>
    (c.sectors || []).some((s) => String(s.id) === String(form.responsible_sector_id))
  )

  const onSectorChange = (value) => {
    set('responsible_sector_id', value)
    set('classification_id', '')
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')

    const body = new FormData()
    body.append('classification_id', form.classification_id)
    body.append('responsible_sector_id', form.responsible_sector_id)
    if (showRequestingSector) body.append('requesting_sector_id', form.requesting_sector_id)
    body.append('title', form.title)
    body.append('description', form.description)
    attachments.forEach((file) => body.append('attachments[]', file))

    try {
      const data = await api('/tickets', { method: 'POST', body })
      navigate(`/chamados/${data.ticket.id}`)
    } catch (err) {
      setError(err.message)
      setSaving(false)
    }
  }

  const onAddFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setAttachments((prev) => [...prev, ...files])
    e.target.value = ''
  }

  return (
    <div>
      <PageShell>
        <PageHeader title="Novo Chamado" subtitle="Abra um novo chamado para sua empresa." />
        <form onSubmit={submit} className="space-y-lg max-w-3xl">
          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg font-title-lg">Detalhes do chamado</h3>
            </div>
            <div className="p-lg space-y-md">
              {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}

              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Setor demandado <span className="text-error">*</span></label>
                <select className={inputClass} value={form.responsible_sector_id} onChange={(e) => onSectorChange(e.target.value)} required>
                  <option value="">Selecione</option>
                  {sectors.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Tipo de chamado (classificação) <span className="text-error">*</span></label>
                <select value={form.classification_id} onChange={(e) => set('classification_id', e.target.value)} className={inputClass} disabled={!form.responsible_sector_id} required>
                  <option value="">{form.responsible_sector_id ? 'Selecione' : 'Selecione o setor demandado primeiro'}</option>
                  {availableClassifications.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Título <span className="text-error">*</span></label>
                <input className={inputClass} value={form.title} onChange={(e) => set('title', e.target.value)} placeholder="Resumo do problema" required />
              </div>

              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Descrição <span className="text-error">*</span></label>
                <textarea className={inputClass} rows={6} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Descreva o problema com detalhes" required></textarea>
              </div>
            </div>
          </Card>

          {showRequestingSector && (
            <Card>
              <div className="px-lg py-md border-b border-outline-variant">
                <h3 className="font-title-lg font-title-lg">Setor solicitante</h3>
              </div>
              <div className="p-lg space-y-base">
                <select className={inputClass} value={form.requesting_sector_id} onChange={(e) => set('requesting_sector_id', e.target.value)} required>
                  <option value="">Você está em mais de um setor — selecione o solicitante</option>
                  {(user?.sectors || []).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>
            </Card>
          )}

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg font-title-lg">Anexos</h3>
            </div>
            <div className="p-lg">
              <input
                type="file"
                multiple
                onChange={onAddFiles}
                className="block w-full text-label-md text-on-surface-variant file:mr-md file:mb-sm file:px-md file:py-sm file:rounded-lg file:border-0 file:bg-primary file:text-on-primary file:cursor-pointer"
              />
              <div className="flex items-center gap-2 mt-sm">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-md font-semibold ${overAttachmentLimit ? 'text-error bg-error-container/50' : 'text-on-surface-variant bg-black/5'}`}>
                  <span className="material-symbols-outlined text-[15px]">monitor_weight</span>
                  <span className="whitespace-nowrap">{(attachmentsBytes / 1024 / 1024).toFixed(1)} / 15 MB</span>
                </span>
                <p className="text-label-md text-on-surface-variant">Total máximo de anexos: 15 MB.</p>
              </div>
              {overAttachmentLimit && (
                <div className="mt-sm flex items-center gap-2 rounded-lg bg-error-container/60 px-3 py-2 text-label-md font-medium text-error">
                  <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                  <span>Limite de 15 MB excedido em {(overAttachmentBytes / 1024 / 1024).toFixed(1)} MB. Remova alguns arquivos para continuar.</span>
                </div>
              )}
              {attachments.length > 0 && (
                <ul className="mt-md space-y-sm">
                  {attachments.map((f, i) => (
                    <li key={i} className="flex items-center gap-md px-md py-sm bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-on-surface-variant">attach_file</span>
                      <span className="flex-1 text-body-md truncate">{f.name}</span>
                      <span className="text-label-md text-on-surface-variant">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                      <button type="button" onClick={() => setAttachments((prev) => prev.filter((x) => x !== f))} className="text-error">
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <div className="flex justify-end gap-sm">
            <button type="button" onClick={() => navigate(-1)} className="px-md py-sm rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={saving || overAttachmentLimit} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint disabled:opacity-60 transition-all">
              {saving ? 'Abrindo…' : 'Abrir Chamado'}
            </button>
          </div>
        </form>
      </PageShell>
    </div>
  )
}