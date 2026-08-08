import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Spinner, inputClass } from '../components/dashboard/ui.jsx'
import { useAuth } from '../context/AuthContext'
import { api, formatDate } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

export default function VisualizarChamado() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const toast = useToast()
  const confirm = useConfirm()
  const [ticket, setTicket] = useState(null)
  const [available, setAvailable] = useState([])
  const [classifications, setClassifications] = useState([])
  const [users, setUsers] = useState([])
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({ classification_id: '', title: '', description: '', responsible_user_id: '' })

  const load = useCallback(() => {
    setLoading(true)
    api(`/tickets/${id}`)
      .then((d) => {
        setTicket(d.ticket)
        setAvailable(d.available_situations || [])
        setHistory(d.history || [])
        setEditForm({
          classification_id: String(d.ticket.classification_id),
          title: d.ticket.title,
          description: d.ticket.description,
          responsible_user_id: d.ticket.responsible_user_id ? String(d.ticket.responsible_user_id) : '',
        })
      })
      .catch(() => navigate('/chamados'))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    api('/classifications')
      .then((d) => setClassifications(d.classifications || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    api('/users')
      .then((d) => setUsers(d.users || []))
      .catch(() => {})
  }, [])

  useEffect(load, [load])

  if (loading) {
    return (
      <PageShell>
        <Spinner />
      </PageShell>
    )
  }

  if (!ticket) return null

  const isRequester = ticket.requesting_user_id === user?.id
  const isResponsible = ticket.responsible_user_id === user?.id
  const isAdmin = user?.role === 'admin'
  const canSendComment = isRequester || isResponsible || isAdmin
  const canEdit = isResponsible || isAdmin

  const sendComment = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    setSending(true)
    setError('')
    try {
      await api(`/tickets/${id}/comments`, {
        method: 'POST',
        body: { content: comment, is_internal: isInternal },
      })
      setComment('')
      setIsInternal(false)
      load()
      toast.success(isInternal ? 'Nota interna registrada.' : 'Resposta enviada com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const changeSituation = async (situationId) => {
    if (!situationId) return
    const target = available.find((s) => String(s.id) === String(situationId))
    if (!target) return
    const current = ticket.situation

    const ok = await confirm({
      title: 'Alterar situação do chamado',
      icon: 'autorenew',
      confirmText: 'Confirmar alteração',
      render: (
        <div className="space-y-md">
          <p className="text-body-md text-on-surface-variant">
            Confirme a mudança de situação do chamado <strong className="text-on-surface">#{ticket.number}</strong>.
          </p>
          <div className="flex items-center justify-center gap-sm">
            <SituationChip label={current?.name || '—'} color={current?.color} />
            <span className="material-symbols-outlined text-primary text-[28px] shrink-0">arrow_forward</span>
            <SituationChip label={target.name} color={target.color} />
          </div>
        </div>
      ),
    })
    if (!ok) return
    setError('')
    try {
      await api(`/tickets/${id}/situation`, { method: 'POST', body: { situation_id: Number(situationId) } })
      load()
      toast.success(`Situação alterada para "${target?.name}".`)
    } catch (err) {
      toast.error(err.message)
    }
  }

  const saveEdit = async (e) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      await api(`/tickets/${id}`, { method: 'PUT', body: { ...editForm, keep_existing_attachments: true } })
      setEditing(false)
      load()
      toast.success('Chamado atualizado com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const deleteAttachment = async (att) => {
    const ok = await confirm({
      title: 'Excluir anexo',
      message: `Excluir o anexo "${att.original_name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    setError('')
    try {
      await api(`/tickets/${id}/attachments/${att.id}`, { method: 'DELETE' })
      load()
      toast.success('Anexo excluído com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const downloadAttachment = (att) => {
    const url = `/api/tickets/${id}/attachments/${att.id}/download`
    const token = localStorage.getItem('atendeai_token')
    fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.blob()
      })
      .then((blob) => {
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = att.original_name
        link.click()
        URL.revokeObjectURL(link.href)
      })
      .catch(() => setError('Não foi possível baixar o anexo.'))
  }

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => navigate('/chamados')}
        className="group inline-flex items-center gap-2 text-label-md font-semibold text-on-surface-variant hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[18px] transition-transform group-hover:-translate-x-0.5">arrow_back</span>
        Voltar para chamados
      </button>

      {/* Cabeçalho editorial */}
      <header className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-lg">
        <div className="min-w-0 space-y-3">
          <div className="flex items-center gap-md flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-label-md font-bold uppercase tracking-[0.18em] text-primary">
              <span className="material-symbols-outlined text-[16px]">confirmation_number</span>
              Chamado · #{ticket.number}
            </span>
          </div>
          <h1 className="font-display-lg text-display-lg text-on-surface leading-[1.15] tracking-tight">{ticket.title}</h1>
          <div className="flex items-center gap-x-lg gap-y-sm flex-wrap font-body-md text-on-surface-variant">
            <span className="inline-flex items-center gap-2">
              <Avatar name={ticket.requesting_user?.name || 'U'} size="w-7 h-7 rounded-lg text-xs" />
              {ticket.requesting_user?.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              Aberto em {formatDate(ticket.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">schedule</span>
              SLA {ticket.classification?.sla_minutes ? `${ticket.classification.sla_minutes} min` : '—'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-sm shrink-0">
          <StatusChip label={ticket.situation?.name} color={ticket.situation?.color} />
          {canEdit && (
            <button
              type="button"
              onClick={() => setEditing((v) => !v)}
              className="inline-flex items-center gap-2 rounded-full px-lg py-sm text-label-md font-semibold text-on-surface-variant bg-white ring-1 ring-black/5 shadow-sm hover:text-primary hover:shadow-md transition-all"
            >
              <span className="material-symbols-outlined text-lg">{editing ? 'close' : 'edit'}</span>
              {editing ? 'Cancelar' : 'Editar'}
            </button>
          )}
        </div>
      </header>

      {error && (
        <div className="px-md py-sm rounded-2xl font-body-md flex items-center gap-md animate-slide-in bg-error-container/70 text-on-error-container">
          <span className="material-symbols-outlined text-[20px]">error</span>
          {error}
        </div>
      )}

      {/* Painel principal */}
      <div className="relative overflow-hidden rounded-[28px] bg-[rgba(255,255,255,0.9)] shadow-[0_40px_80px_-40px_rgba(15,40,120,0.35)] ring-1 ring-black/5">
        <div className="pointer-events-none absolute -top-28 -right-24 h-80 w-80 rounded-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-2xl"></div>
        <div className="pointer-events-none absolute -bottom-32 left-1/4 h-72 w-72 rounded-full bg-gradient-to-tr from-secondary-container/50 to-transparent blur-3xl"></div>
        <div className="relative p-lg sm:p-xl space-y-xl">
          {editing ? (
            <form onSubmit={saveEdit} className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Classificação</label>
                <select className={inputClass} value={editForm.classification_id} onChange={(e) => setEditForm((p) => ({ ...p, classification_id: e.target.value }))}>
                  {classifications.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-base">
                <label className="font-label-md text-on-surface-variant">Responsável</label>
                <select
                  className={inputClass}
                  value={editForm.responsible_user_id}
                  onChange={(e) => setEditForm((p) => ({ ...p, responsible_user_id: e.target.value }))}
                >
                  <option value="">Não atribuído</option>
                  {users
                    .filter((u) => (u.sectors || []).some((s) => s.id === ticket.responsible_sector_id) || String(u.id) === editForm.responsible_user_id)
                    .map((u) => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                </select>
              </div>
              <div className="space-y-base md:col-span-2">
                <label className="font-label-md text-on-surface-variant">Título</label>
                <input className={inputClass} value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
              </div>
              <div className="space-y-base md:col-span-2">
                <label className="font-label-md text-on-surface-variant">Descrição</label>
                <textarea className={inputClass} rows={5} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}></textarea>
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button type="submit" disabled={sending} className="px-lg py-sm rounded-full bg-primary text-on-primary font-label-md font-semibold shadow-lg shadow-primary/25 hover:opacity-90 disabled:opacity-60 transition-all">
                  {sending ? 'Gravando…' : 'Gravar alterações'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {/* Métricas */}
              <div>
                  <p className="text-label-md font-bold uppercase tracking-[0.18em] text-primary">Visão geral</p>
                  <p className="text-body-md text-on-surface-variant mt-0.5">Principais informações do chamado</p>
                </div>

              <div className="grid grid-cols-2 gap-md lg:grid-cols-4">
                <Stat icon="category" tint="bg-primary/10 text-primary" label="Classificação" value={ticket.classification?.name} />
                <Stat icon="apartment" tint="bg-cyan-500/10 text-cyan-600" label="Setor solicitante" value={ticket.requesting_sector?.name} />
                <Stat icon="support_agent" tint="bg-indigo-500/10 text-indigo-600" label="Setor demandado" value={ticket.responsible_sector?.name} />
                <Stat icon="timer" tint="bg-amber-500/10 text-amber-700" label="SLA" value={ticket.classification?.sla_minutes ? `${ticket.classification.sla_minutes} min` : null} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-lg gap-y-md">
                <Info label="Categoria" value={ticket.classification?.category?.name} />
                <Info label="Grupo" value={ticket.classification?.group?.name} />
                <Info label="Usuário solicitante" value={ticket.requesting_user?.name} />
                <Info label="Responsável" value={ticket.responsible_user?.name || 'Não atribuído'} />
              </div>

              <div className="space-y-md">
                <p className="text-label-md font-bold uppercase tracking-[0.18em] text-on-surface-variant">Descrição</p>
                <p className="font-body-lg text-body-lg leading-relaxed text-on-surface whitespace-pre-wrap">{ticket.description}</p>
              </div>

              <div className="space-y-md">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-on-surface-variant">attach_file</span>
                  <p className="font-title-lg text-title-lg text-on-surface">Anexos</p>
                  <span className="text-label-md font-semibold text-on-surface-variant bg-black/5 rounded-full px-2 py-0.5">
                    {ticket.attachments?.length || 0}
                  </span>
                </div>
                {ticket.attachments?.length === 0 ? (
                  <div className="flex items-center gap-md px-md py-lg rounded-2xl bg-black/[0.03] text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline">inbox</span>
                    <span className="font-body-md text-body-md">Nenhum anexo.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-md">
                    {ticket.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="group flex items-center gap-md rounded-2xl bg-white p-2 shadow-sm ring-1 ring-black/5 hover:shadow-md hover:ring-primary/30 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-primary bg-primary/10 shrink-0">
                          <span className="material-symbols-outlined text-[22px]">description</span>
                        </div>
                        <button onClick={() => downloadAttachment(att)} className="min-w-0 text-left">
                          <span className="block font-body-md font-semibold text-on-surface group-hover:text-primary transition-colors truncate max-w-[220px]">
                            {att.original_name}
                          </span>
                          <span className="text-label-md text-on-surface-variant">{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                        </button>
                        {canEdit && (
                          <button
                            onClick={() => deleteAttachment(att)}
                            title="Excluir anexo"
                            className="p-1.5 rounded-full text-error opacity-0 group-hover:opacity-100 hover:bg-error-container/40 transition-all"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_330px] gap-lg items-start">
        {/* Conversa */}
        <div className="rounded-[28px] overflow-hidden bg-white shadow-[0_40px_80px_-50px_rgba(9,30,66,0.4)] ring-1 ring-black/5">
          <div className="px-lg pt-lg pb-md flex items-center gap-md">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[20px]">forum</span>
            </div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Conversa</h2>
            <span className="ml-auto text-label-md font-semibold text-on-surface-variant bg-black/5 rounded-full px-2.5 py-1">
              {ticket.comments?.length || 0} apontamentos
            </span>
          </div>

          <div className="px-md sm:px-lg space-y-lg bg-gradient-to-b from-black/[0.02] to-transparent max-h-[600px] overflow-y-auto custom-scrollbar py-md">
            <div className="flex justify-center">
              <span className="text-label-md bg-black/[0.04] px-3 py-1 rounded-full text-on-surface-variant">
                Ticket aberto por {ticket.requesting_user?.name} · {formatDate(ticket.created_at)}
              </span>
            </div>

            {ticket.comments?.length === 0 ? (
              <div className="text-center py-xl text-on-surface-variant">
                <span className="material-symbols-outlined text-[40px] text-outline inline-block">question_answer</span>
                <p className="font-body-md text-body-md mt-sm">Nenhuma mensagem ainda. Inicie a conversa.</p>
              </div>
            ) : (
              ticket.comments.map((c) => {
                if (c.is_internal) {
                  return (
                    <div key={c.id} className="flex justify-center animate-slide-in">
                      <span className="inline-flex items-center gap-2 rounded-full px-lg py-sm bg-amber-100/80 text-amber-800 text-label-md font-medium">
                        <span className="material-symbols-outlined text-[16px] shrink-0">sticky_note_2</span>
                        <span className="whitespace-pre-wrap"><strong>{c.user?.name}:</strong> {c.content}</span>
                      </span>
                    </div>
                  )
                }
                const mine = c.user?.id === user?.id
                const who = mine ? c.user?.name : c.user?.name || 'Solicitante'
                return (
                  <div key={c.id} className={`flex gap-md items-end ${mine ? 'flex-row-reverse' : ''}`}>
                    <Avatar name={who} size="w-9 h-9 rounded-full text-xs" />
                    <div className={`max-w-[78%] min-w-0 ${mine ? 'text-right' : ''}`}>
                      <div className={`flex items-center gap-2 mb-1 ${mine ? 'justify-end' : ''}`}>
                        <span className="font-semibold text-sm text-on-surface">{mine ? `${who} (Você)` : who}</span>
                        <span className="text-[11px] text-on-surface-variant">{formatDate(c.created_at)}</span>
                      </div>
                      <div
                        className={`px-md py-3 ${
                          mine
                            ? 'bg-primary text-white message-bubble-agent shadow-lg shadow-primary/20'
                            : 'bg-white message-bubble-customer shadow-[0_6px_20px_-8px_rgba(9,30,66,0.15)]'
                        }`}
                      >
                        <p className="font-body-md text-body-md whitespace-pre-wrap">{c.content}</p>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {canSendComment && (
            <form onSubmit={sendComment} className="p-md sm:p-lg bg-white">
              <div className="flex gap-sm mb-3 flex-wrap">
                <Toggler active={!isInternal} onClick={() => setIsInternal(false)} type="customer">
                  Responder Cliente
                </Toggler>
                <Toggler active={isInternal} onClick={() => setIsInternal(true)} type="internal">
                  Nota Interna
                </Toggler>
              </div>
              <div className="rounded-2xl bg-black/[0.02] p-2 focus-within:bg-white transition-all">
                <textarea
                  className="w-full bg-transparent border-none outline-none focus:ring-0 p-md min-h-[90px] text-body-md resize-none placeholder:text-outline"
                  rows={3}
                  placeholder={isInternal ? 'Escreva uma nota interna (visível apenas para a equipe)…' : 'Responda ao solicitante…'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                <div className="flex justify-end items-center gap-md px-2 pb-2">
                  <p className="text-label-md text-on-surface-variant mr-auto">{isInternal ? 'Somente a equipe verá.' : 'O solicitante receberá por e-mail.'}</p>
                  <button
                    type="submit"
                    disabled={sending || !comment.trim()}
                    className="inline-flex items-center gap-2 rounded-full bg-primary text-white px-lg py-2 font-headline-sm font-semibold text-label-md shadow-lg shadow-primary/25 hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    {sending ? 'Gravando…' : 'Gravar'}
                    <span className="material-symbols-outlined text-lg -mb-[3px]">send</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Barra lateral */}
        <div className="space-y-lg lg:sticky lg:top-24">
          <div className="rounded-[24px] bg-white/[0.9] p-6 shadow-[0_24px_50px_-30px_rgba(9,30,66,0.35)] ring-1 ring-black/5 space-y-10">
            <Section title="Situação">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <StatusChip label={ticket.situation?.name || '—'} color={ticket.situation?.color} />
                <span className="text-label-md text-on-surface-variant whitespace-nowrap">{formatDate(ticket.updated_at || ticket.created_at)}</span>
              </div>
              <div className="mt-5">
                <label className="text-label-md font-semibold text-on-surface-variant block mb-2">Alterar situação</label>
                <select
                  className={`${inputClass} !rounded-full`}
                  value={ticket.situation_id}
                  onChange={(e) => changeSituation(e.target.value)}
                >
                  <option value="">Selecione…</option>
                  {available.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p className="text-label-md text-on-surface-variant mt-2 leading-relaxed">As transições seguem as regras definidas nas Situações.</p>
              </div>
            </Section>

            <Section title="Responsáveis">
              <div className="space-y-4">
                <PersonLine name={ticket.requesting_user?.name} role="Solicitante" />
                <PersonLine name={ticket.responsible_user?.name || 'Não atribuído'} role="Responsável" />
              </div>
            </Section>

            <Section title="Histórico">
              <p className="text-body-md text-on-surface-variant">{history.length} {history.length === 1 ? 'evento' : 'eventos'} registrados</p>
            </Section>
          </div>

          <div className="rounded-[24px] bg-white/[0.9] p-6 shadow-[0_24px_50px_-30px_rgba(9,30,66,0.35)] ring-1 ring-black/5">
            <h3 className="text-label-md font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-5">Atividade</h3>
            {history.length === 0 ? (
              <p className="text-body-md text-on-surface-variant text-center py-md">Nenhum evento registrado ainda.</p>
            ) : (
              <ul className="space-y-4 relative">
                <div className="absolute left-[13px] top-2 bottom-2 w-px bg-black/10"></div>
                {history.map((h) => {
                  const meta = historyMeta(h.action)
                  return (
                    <li key={h.id} className="relative flex gap-3 animate-fade-in">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10"
                        style={{ backgroundColor: `${meta.color}18`, color: meta.color, boxShadow: `0 0 0 3px #fff` }}
                      >
                        <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                      </div>
                      <div className="min-w-0">
                        <p className="font-body-md font-semibold text-on-surface leading-snug">{meta.label}</p>
                        <p className="text-label-md text-on-surface-variant">{formatDate(h.created_at)}</p>
                        <p className="text-label-md text-on-surface mt-1 leading-relaxed whitespace-pre-wrap line-clamp-2">{h.summary}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  )
}

function Avatar({ name, size = 'w-9 h-9 rounded-full' }) {
  return (
    <div className={`${size} bg-gradient-to-br from-primary-container to-primary flex items-center justify-center font-bold text-sm text-white shadow-sm shrink-0`}>
      {(name || 'U').charAt(0).toUpperCase()}
    </div>
  )
}

function StatusChip({ label, color }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-label-md font-semibold"
      style={{ backgroundColor: color ? `${color}14` : 'rgba(0,0,0,0.04)', color: color || 'inherit' }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color || 'currentColor' }}></span>
      {label}
    </span>
  )
}

function Stat({ icon, tint, label, value }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-black/[0.03] p-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant truncate">{label}</p>
        <p className="text-body-md font-bold text-on-surface truncate">{value || '—'}</p>
      </div>
    </div>
  )
}

function Info({ label, value }) {
  return (
    <div className="min-w-0">
      <p className="text-[11px] font-bold uppercase tracking-wide text-on-surface-variant">{label}</p>
      <p className="font-body-md font-semibold text-on-surface mt-1 break-words">{value || '—'}</p>
    </div>
  )
}

function PersonLine({ name, role }) {
  return (
    <div className="flex items-center gap-3">
      <Avatar name={name || '—'} size="w-9 h-9 rounded-full text-xs" />
      <div className="min-w-0">
        <p className="font-body-md font-semibold text-on-surface truncate">{name || '—'}</p>
        <p className="text-label-md text-on-surface-variant">{role}</p>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <section>
      <h3 className="text-label-md font-bold uppercase tracking-[0.18em] text-on-surface-variant mb-4">{title}</h3>
      {children}
    </section>
  )
}

function Toggler({ active, onClick, type, children }) {
  const base = 'inline-flex items-center gap-1.5 text-label-md font-semibold px-3.5 py-1.5 rounded-full transition-all'
  if (type === 'internal') {
    return (
      <button type="button" onClick={onClick} className={`${base} ${active ? 'bg-amber-500/15 text-amber-800' : 'text-on-surface-variant hover:bg-black/5'}`}>
        <span className="material-symbols-outlined text-[15px] align-[-3px]">sticky_note_2</span>
        {children}
      </button>
    )
  }
  return (
    <button type="button" onClick={onClick} className={`${base} ${active ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-on-surface-variant hover:bg-black/5'}`}>
      {children}
    </button>
  )
}

const ACTION_META = {
  create: { icon: 'add_circle', label: 'Chamado criado', color: '#0f62fe' },
  update: { icon: 'edit_square', label: 'Chamado atualizado', color: '#7c3aed' },
  situation: { icon: 'swap_horiz', label: 'Situação alterada', color: '#16a34a' },
  comment: { icon: 'chat_bubble', label: 'Novo apontamento', color: '#0891b2' },
  attach: { icon: 'attach_file', label: 'Anexo adicionado', color: '#f59e0b' },
  unlink: { icon: 'link_off', label: 'Anexo removido', color: '#dc2626' },
  delete: { icon: 'delete', label: 'Chamado excluído', color: '#dc2626' },
}

function historyMeta(action) {
  return ACTION_META[action] || { icon: 'receipt_long', label: 'Registro', color: '#64748b' }
}

function SituationChip({ label, color }) {
  return (
    <div
      className="inline-flex flex-col items-center gap-xs px-md py-sm rounded-xl min-w-[120px]"
      style={{ backgroundColor: color ? `${color}14` : '#e0e0e0', border: `1px solid ${color ? `${color}55` : '#c0c4c9'}` }}
    >
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color || '#868c92' }}></span>
      <span className="text-label-md font-semibold" style={{ color: color || '#3d4146' }}>{label}</span>
    </div>
  )
}
