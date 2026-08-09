import { useCallback, useEffect, useRef, useState } from 'react'
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
  const [commentFiles, setCommentFiles] = useState([])
  const commentFileRef = useRef(null)
  const [isInternal, setIsInternal] = useState(false)
  const [commentFlow, setCommentFlow] = useState({ step: 'choose', target: null, responsible_id: '' })
  const [commentFlowOpen, setCommentFlowOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [linkedTickets, setLinkedTickets] = useState([])
  const [linkOpen, setLinkOpen] = useState(false)
  const [linkQuery, setLinkQuery] = useState('')
  const [linkResults, setLinkResults] = useState([])
  const [editForm, setEditForm] = useState({ classification_id: '', title: '', description: '', responsible_user_id: '' })

  const applyTicketData = useCallback((d) => {
    setTicket(d.ticket)
    setAvailable(d.available_situations || [])
    setHistory(d.history || [])
    setLinkedTickets(d.linked_tickets || [])
    setEditForm({
      classification_id: String(d.ticket.classification_id),
      title: d.ticket.title,
      description: d.ticket.description,
      responsible_user_id: d.ticket.responsible_user_id ? String(d.ticket.responsible_user_id) : '',
    })
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    api(`/tickets/${id}`)
      .then(applyTicketData)
      .catch(() => navigate('/chamados'))
      .finally(() => setLoading(false))
  }, [id, applyTicketData])

  const refresh = useCallback(() => api(`/tickets/${id}`).then(applyTicketData), [id, applyTicketData])

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
  const isDemandedSectorMember = (user?.sectors || []).some((s) => s.id === ticket.responsible_sector_id)
  const canSendComment = isRequester || isResponsible || isAdmin
  const canEdit = isResponsible || isAdmin
  const nonCommentAttachments = (ticket.attachments || []).filter((a) => !a.ticket_comment_id)

  const maxAttachmentBytes = 15 * 1024 * 1024
  const commentTotalBytes = commentFiles.reduce((sum, f) => sum + (f.size || 0), 0)
  const overAttachmentLimit = commentTotalBytes > maxAttachmentBytes
  const overAttachmentBytes = commentTotalBytes - maxAttachmentBytes

  const sendComment = async (e) => {
    e.preventDefault()
    if (!comment.trim() && commentFiles.length === 0) return
    if (isInternal) {
      await saveComment(null, '')
      return
    }
    if (!ticket.responsible_user_id && isDemandedSectorMember) {
      setCommentFlow({ step: 'chooseResponsible', target: null, responsible_id: '' })
      setCommentFlowOpen(true)
      return
    }
    if (available.length === 0) {
      await saveComment(null, '')
      return
    }
    setCommentFlow({ step: 'choose', target: null, responsible_id: '' })
    setCommentFlowOpen(true)
  }

  const continueToSituation = async () => {
    if (!commentFlow.responsible_id || sending) return
    setSending(true)
    setError('')
    try {
      await api(`/tickets/${id}`, {
        method: 'PUT',
        body: {
          classification_id: Number(ticket.classification_id),
          title: ticket.title,
          description: ticket.description,
          responsible_user_id: Number(commentFlow.responsible_id),
          keep_existing_attachments: true,
        },
      })
      await refresh()
      setCommentFlow((p) => ({ ...p, step: 'choose' }))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const saveComment = async (target, responsibleId) => {
    setSending(true)
    setError('')
    try {
      if (responsibleId && Number(responsibleId) !== Number(ticket.responsible_user_id)) {
        await api(`/tickets/${id}`, {
          method: 'PUT',
          body: {
            classification_id: Number(ticket.classification_id),
            title: ticket.title,
            description: ticket.description,
            responsible_user_id: Number(responsibleId),
            keep_existing_attachments: true,
          },
        })
      }
      if (target) {
        await api(`/tickets/${id}/situation`, { method: 'POST', body: { situation_id: Number(target.id) } })
      }
      const body = new FormData()
      body.append('content', comment)
      body.append('is_internal', isInternal ? '1' : '0')
      commentFiles.forEach((file) => body.append('attachments[]', file))
      const data = await api(`/tickets/${id}/comments`, { method: 'POST', body })
      const savedCount = data?.comment?.attachments?.length ?? 0
      if (commentFiles.length > 0 && savedCount !== commentFiles.length) {
        throw new Error('Alguns arquivos não puderam ser gravados. Tente novamente.')
      }
      setComment('')
      setCommentFiles([])
      setIsInternal(false)
      setCommentFlowOpen(false)
      setCommentFlow({ step: 'choose', target: null, responsible_id: '' })
      load()
      toast.success('Registro realizado com sucesso!')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const onCommentFiles = (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return
    setCommentFiles((prev) => [...prev, ...files])
    e.target.value = ''
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

  const linkTicket = async (target) => {
    setSending(true)
    setError('')
    try {
      const data = await api(`/tickets/${id}/links`, { method: 'POST', body: { linked_ticket_id: target.id } })
      setLinkedTickets(data.linked_tickets || [])
      setLinkResults([])
      setLinkQuery('')
      toast.success(`Chamado #${target.number} vinculado.`)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSending(false)
    }
  }

  const unlinkTicket = async (target) => {
    const ok = await confirm({
      title: 'Remover vínculo',
      message: `Remover o vínculo com o chamado #${target.number}?`,
      confirmText: 'Remover',
      danger: true,
    })
    if (!ok) return
    setError('')
    try {
      const data = await api(`/tickets/${id}/links/${target.id}`, { method: 'DELETE' })
      setLinkedTickets(data.linked_tickets || [])
      toast.success('Vínculo removido.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  const onLinkQuery = async (q) => {
    setLinkQuery(q)
    const query = q.trim()
    if (query.length < 2) {
      setLinkResults([])
      return
    }
    try {
      const d = await api('/tickets', { query: { q: query, per_page: 8 } })
      const already = new Set([Number(id), ...linkedTickets.map((t) => t.id)])
      const items = (d.tickets?.data || []).filter((t) => !already.has(t.id))
      setLinkResults(items)
    } catch {
      setLinkResults([])
    }
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

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_330px] gap-lg items-start">
        <div className="space-y-lg min-w-0">
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
                    {nonCommentAttachments.length}
                  </span>
                </div>
                {nonCommentAttachments.length === 0 ? (
                  <div className="flex items-center gap-md px-md py-lg rounded-2xl bg-black/[0.03] text-on-surface-variant">
                    <span className="material-symbols-outlined text-outline">inbox</span>
                    <span className="font-body-md text-body-md">Nenhum anexo.</span>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-md">
                    {nonCommentAttachments.map((att) => (
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
                    <div key={c.id} className="flex justify-center animate-slide-in flex-col items-center gap-1.5">
                      <span className="inline-flex items-center gap-2 rounded-full px-lg py-sm bg-amber-100/80 text-amber-800 text-label-md font-medium max-w-full">
                        <span className="material-symbols-outlined text-[16px] shrink-0">sticky_note_2</span>
                        <span className="whitespace-pre-wrap"><strong>{c.user?.name}:</strong> {c.content}</span>
                      </span>
                      {c.attachments?.length > 0 && (
                        <div className="flex flex-wrap gap-sm justify-center">
                          {c.attachments.map((att) => (
                            <button
                              key={att.id}
                              onClick={() => downloadAttachment(att)}
                              title={`Baixar ${att.original_name}`}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-2 text-left max-w-[240px] min-w-0 hover:bg-gray-200 transition-all"
                            >
                              <span className="material-symbols-outlined text-[22px] text-primary shrink-0">description</span>
                              <span className="min-w-0">
                                <span className="block text-label-md font-semibold text-black truncate">{att.original_name}</span>
                                <span className="block text-[11px] text-gray-500">{formatSize(att.size)}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
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
{c.attachments?.length > 0 && (
                        <div className={`flex flex-wrap gap-sm mt-2 ${mine ? 'justify-end' : ''}`}>
                          {c.attachments.map((att) => (
                            <button
                              key={att.id}
                              onClick={() => downloadAttachment(att)}
                              title={`Baixar ${att.original_name}`}
                              className="flex items-center gap-2 rounded-lg bg-gray-100 px-2.5 py-2 text-left max-w-[240px] min-w-0 hover:bg-gray-200 transition-all"
                            >
                              <span className="material-symbols-outlined text-[22px] text-primary shrink-0">description</span>
                              <span className="min-w-0">
                                <span className="block text-label-md font-semibold text-black truncate">{att.original_name}</span>
                                <span className="block text-[11px] text-gray-500">{formatSize(att.size)}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
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
              <div className="rounded-2xl bg-black/[0.02] p-2 border border-primary/40 focus-within:bg-white focus-within:border-primary transition-all">
                {commentFiles.length > 0 && (
                  <div className="flex flex-wrap gap-sm px-2 pt-2">
                    {commentFiles.map((f, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 rounded-full bg-black/5 px-3 py-1 text-label-md text-on-surface-variant max-w-[220px]">
                        <span className="material-symbols-outlined text-[15px] shrink-0">attach_file</span>
                        <span className="truncate">{f.name}</span>
                        <button type="button" onClick={() => setCommentFiles((prev) => prev.filter((x) => x !== f))} className="text-on-surface-variant hover:text-error transition-colors shrink-0">
                          <span className="material-symbols-outlined text-[15px]">close</span>
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                <textarea
                  className="w-full bg-transparent border-none outline-none focus:ring-0 p-md min-h-[90px] text-body-md resize-none placeholder:text-outline"
                  rows={3}
                  placeholder={isInternal ? 'Escreva uma nota interna (visível apenas para a equipe)…' : 'Responda ao solicitante…'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                ></textarea>
                {overAttachmentLimit && (
                  <div className="mx-2 mb-2 flex items-center gap-2 rounded-lg bg-error-container/60 px-3 py-2 text-label-md font-medium text-error animate-slide-in">
                    <span className="material-symbols-outlined text-[20px] shrink-0">error</span>
                    <span>Limite de 15 MB por comentário excedido em {(overAttachmentBytes / 1024 / 1024).toFixed(1)} MB. Remova alguns arquivos para continuar.</span>
                  </div>
                )}
                <div className="flex justify-end items-center gap-md px-2 pb-2">
                  <p className="text-label-md text-on-surface-variant mr-auto">{isInternal ? 'Somente a equipe verá.' : 'O solicitante receberá por e-mail.'}</p>
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-label-md font-semibold ${overAttachmentLimit ? 'bg-error-container/50 text-error' : 'bg-black/5 text-on-surface-variant'}`} title="Limite de 15 MB por comentário">
                    <span className="material-symbols-outlined text-[15px]">monitor_weight</span>
                    <span className="whitespace-nowrap">Anexos: {(commentTotalBytes / 1024 / 1024).toFixed(1)} / 15 MB</span>
                  </div>
                  <input ref={commentFileRef} type="file" multiple className="hidden" onChange={onCommentFiles} />
                  <button
                    type="button"
                    onClick={() => commentFileRef.current?.click()}
                    disabled={overAttachmentLimit}
                    title={overAttachmentLimit ? 'Limite de 15 MB atingido' : 'Anexar arquivo'}
                    className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-primary/10 transition-all disabled:opacity-40 disabled:hover:text-on-surface-variant disabled:hover:bg-transparent"
                  >
                    <span className="material-symbols-outlined text-[20px]">attach_file</span>
                  </button>
                  <button
                    type="submit"
                    disabled={sending || overAttachmentLimit || (!comment.trim() && commentFiles.length === 0)}
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

        {/* Histórico (recolhido por padrão) */}
        <div className="rounded-[24px] bg-white/[0.9] shadow-[0_24px_50px_-30px_rgba(9,30,66,0.35)] ring-1 ring-black/5 overflow-hidden">
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className="w-full flex items-center justify-between gap-3 px-6 py-5 text-left hover:bg-black/[0.02] transition-colors cursor-pointer"
          >
            <h3 className="text-label-md font-bold uppercase tracking-[0.18em] text-on-surface-variant">Histórico</h3>
            <span className="flex items-center gap-2 shrink-0">
              <span className="text-label-md font-semibold text-on-surface-variant bg-black/5 rounded-full px-2.5 py-1 whitespace-nowrap">
                {history.length} {history.length === 1 ? 'evento' : 'eventos'}
              </span>
              <span className={`material-symbols-outlined text-on-surface-variant transition-transform ${historyOpen ? 'rotate-180' : ''}`}>expand_more</span>
            </span>
          </button>
          {historyOpen && (
            <div className="px-6 pb-6">
              {history.length === 0 ? (
                <p className="text-body-md text-on-surface-variant text-center py-md">Nenhum evento registrado ainda.</p>
              ) : (
                <ul className="space-y-4 relative">
                  <div className="absolute left-[13px] top-2 bottom-2 w-px bg-black/10"></div>
                  {history.map((h) => {
                    const meta = historyMeta(h.action)
                    const changes = historyChanges(h)
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
                          <p className="text-label-md text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                            <span className="material-symbols-outlined text-[14px]">person</span>
                            <span className="font-semibold text-on-surface">{h.user?.name || 'Sistema'}</span>
                            <span>· {formatDate(h.created_at)}</span>
                          </p>
                          {changes && changes.length > 0 ? (
                            <div className="mt-2 space-y-2">
                              {changes.map((d) => (
                                <div key={d.label} className="rounded-lg bg-black/[0.03] px-3 py-2">
                                  <p className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">{d.label}</p>
                                  <p className="text-label-md text-on-surface-variant mt-1 leading-relaxed break-words">
                                    <span className="font-semibold">Antes:</span> <span className="whitespace-pre-wrap line-through decoration-error/70">{d.old}</span>
                                  </p>
                                  <p className="text-label-md text-on-surface mt-0.5 leading-relaxed break-words">
                                    <span className="font-semibold">Agora:</span> <span className="whitespace-pre-wrap">{d.new}</span>
                                  </p>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-label-md text-on-surface mt-1 leading-relaxed whitespace-pre-wrap line-clamp-2">{h.summary}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
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
          </div>

<div className="rounded-[24px] bg-white/[0.9] p-6 shadow-[0_24px_50px_-30px_rgba(9,30,66,0.35)] ring-1 ring-black/5 space-y-4 !mb-[50px]">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-label-md font-bold uppercase tracking-[0.18em] text-on-surface-variant">Chamados vinculados</h3>
            <span className="text-label-md font-semibold text-on-surface-variant bg-black/5 rounded-full px-2.5 py-1 whitespace-nowrap">{linkedTickets.length}</span>
          </div>

          {linkedTickets.length === 0 ? (
            <p className="text-body-md text-on-surface-variant">Nenhum chamado vinculado.</p>
          ) : (
            <ul className="space-y-3">
              {linkedTickets.map((t) => (
                <li
                  key={t.id}
                  className="group flex items-center gap-3 rounded-xl bg-black/[0.03] p-3 hover:bg-primary/5 transition-colors cursor-pointer"
                  onClick={() => navigate(`/chamados/${t.id}`)}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-label-md font-bold text-primary">#{t.number}</p>
                    <p className="text-body-md font-semibold text-on-surface truncate">{t.title || 'Sem título'}</p>
                    <div className="mt-1.5"><StatusChip label={t.situation?.name || '—'} color={t.situation?.color} /></div>
                  </div>
                  <button
                    type="button"
                    title="Remover vínculo"
                    onClick={(e) => {
                      e.stopPropagation()
                      unlinkTicket(t)
                    }}
                    className="p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-error-container/30 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <span className="material-symbols-outlined text-[18px]">link_off</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <div>
            <button
              type="button"
              onClick={() => {
                setLinkOpen((v) => !v)
                if (linkOpen) {
                  setLinkQuery('')
                  setLinkResults([])
                }
              }}
              className="w-full inline-flex items-center justify-center gap-1.5 rounded-full border border-primary/30 px-3 py-2 text-label-md font-semibold text-primary hover:bg-primary/5 transition-all"
            >
              <span className="material-symbols-outlined text-[18px]">{linkOpen ? 'close' : 'add_link'}</span>
              {linkOpen ? 'Cancelar' : 'Vincular chamado'}
            </button>

            {linkOpen && (
              <div className="mt-3 space-y-2">
                <input
                  value={linkQuery}
                  onChange={(e) => onLinkQuery(e.target.value)}
                  placeholder="Buscar por nº, título ou descrição…"
                  className={`${inputClass} !rounded-xl`}
                />
                {linkResults.length > 0 ? (
                  <ul className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                    {linkResults.map((r) => (
                      <li key={r.id}>
                        <button
                          type="button"
                          onClick={() => linkTicket(r)}
                          className="w-full flex items-center gap-2 rounded-lg px-2 py-1.5 text-left hover:bg-primary/10 transition-colors"
                        >
                          <span className="text-label-md font-bold text-primary shrink-0">#{r.number}</span>
                          <span className="text-body-md truncate">{r.title}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  linkQuery.trim().length >= 2 && <p className="text-label-md text-on-surface-variant">Nenhum resultado.</p>
                )}
              </div>
            )}
          </div>
</div>
      </div>
      </div>

      {commentFlowOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in" onClick={() => !sending && setCommentFlowOpen(false)}>
          <div className="relative w-full max-w-md bg-surface-container-lowest rounded-2xl shadow-2xl overflow-hidden animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <div className="h-1.5 bg-gradient-to-r from-primary via-primary-container to-tertiary" />

            {commentFlow.step === 'chooseResponsible' ? (
              <>
                <div className="p-lg pt-xl text-center">
                  <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-md text-primary bg-primary/10">
                    <span className="material-symbols-outlined text-[28px]">support_agent</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-sm">Escolher responsável</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    O chamado <strong className="text-on-surface">#{ticket.number}</strong> ainda não possui responsável. Selecione o responsável para poder gravar o comentário.
                  </p>
                </div>
                <div className="px-lg">
                  <label className="text-label-md font-semibold text-on-surface-variant block mb-2">Responsável</label>
                  <select
                    className={`${inputClass} !rounded-xl`}
                    value={commentFlow.responsible_id}
                    onChange={(e) => setCommentFlow((p) => ({ ...p, responsible_id: e.target.value }))}
                  >
                    <option value="">Selecione…</option>
                    {users
                      .filter((u) => (u.sectors || []).some((s) => s.id === ticket.responsible_sector_id))
                      .map((u) => (
                        <option key={u.id} value={u.id}>{u.name}</option>
                      ))}
                  </select>
                </div>
                <div className="flex gap-sm p-lg bg-surface-container-low/60 mt-lg">
                  <button
                    type="button"
                    onClick={() => setCommentFlowOpen(false)}
                    className="flex-1 px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={!commentFlow.responsible_id || sending}
                    onClick={continueToSituation}
                    className="flex-1 px-md py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-md shadow-primary/20 hover:bg-surface-tint transition-all disabled:opacity-50"
                  >
                    {sending ? 'Gravando…' : 'Continuar'}
                  </button>
                </div>
              </>
            ) : commentFlow.step === 'choose' ? (
              <>
                <div className="p-lg pt-xl text-center">
                  <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-md text-primary bg-primary/10">
                    <span className="material-symbols-outlined text-[28px]">swap_horiz</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-sm">Deseja alterar a situação?</h3>
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    Escolha a nova situação para salvar junto com o comentário, ou apenas grave o comentário sem alterar a situação do chamado <strong className="text-on-surface">#{ticket.number}</strong>.
                  </p>
                </div>
                <div className="px-lg max-h-64 overflow-y-auto custom-scrollbar space-y-2">
                  {available.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCommentFlow({ step: 'confirm', target: s })}
                      className="w-full flex items-center gap-3 rounded-xl px-md py-sm font-label-md font-semibold transition-all"
                      style={{ backgroundColor: s.color ? `${s.color}14` : '#e0e0e0', color: s.color || '#3d4146' }}
                    >
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: s.color || '#868c92' }}></span>
                      {s.name}
                      <span className="material-symbols-outlined text-[16px] ml-auto">chevron_right</span>
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setCommentFlow({ step: 'confirm', target: null })}
                    className="w-full flex items-center gap-3 rounded-xl px-md py-sm font-label-md font-semibold border transition-all"
                    style={{ borderColor: 'rgba(0,0,0,0)', backgroundColor: '#f1f3f5', color: '#3d4146' }}
                  >
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#868c92' }}></span>
                    Somente comentar
                    <span className="material-symbols-outlined text-[16px] ml-auto">chevron_right</span>
                  </button>
                </div>
                <div className="flex gap-sm p-lg bg-surface-container-low/60 mt-lg">
                  <button
                    type="button"
                    onClick={() => setCommentFlowOpen(false)}
                    className="flex-1 px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="p-lg pt-xl text-center">
                  <div className="mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-md text-primary bg-primary/10">
                    <span className="material-symbols-outlined text-[28px]">fact_check</span>
                  </div>
                  <h3 className="font-title-lg text-title-lg text-on-surface mb-sm">Confirmar gravação</h3>
                  {commentFlow.responsible_id && (
                    <div className="mb-md inline-flex items-center gap-2 rounded-full px-lg py-sm bg-primary/10 text-primary font-label-md font-semibold">
                      <span className="material-symbols-outlined text-[16px] shrink-0">support_agent</span>
                      Responsável: {users.find((u) => String(u.id) === String(commentFlow.responsible_id))?.name}
                    </div>
                  )}
                  {commentFlow.target ? (
                    <>
                      <div className="flex items-center justify-center gap-sm">
                        <SituationChip label={ticket.situation?.name || '—'} color={ticket.situation?.color} />
                        <span className="material-symbols-outlined text-primary text-[28px] shrink-0">arrow_forward</span>
                        <SituationChip label={commentFlow.target.name} color={commentFlow.target.color} />
                      </div>
                      <p className="text-body-md text-on-surface-variant mt-sm leading-relaxed">
                        O comentário será gravado e a situação do chamado será alterada para <strong className="text-on-surface">{commentFlow.target.name}</strong>.
                      </p>
                    </>
                  ) : (
                    <p className="text-body-md text-on-surface-variant leading-relaxed">
                      Somente o comentário será gravado. A situação permanecerá <strong className="text-on-surface">{ticket.situation?.name || '—'}</strong>.
                    </p>
                  )}
                </div>
                <div className="flex gap-sm p-lg bg-surface-container-low/60 mt-lg">
                  <button
                    type="button"
                    onClick={() => setCommentFlow({ step: 'choose', target: null })}
                    disabled={sending}
                    className="flex-1 px-md py-sm rounded-lg border border-outline-variant text-on-surface-variant font-label-md hover:bg-surface-container-low transition-all"
                  >
                    Voltar
                  </button>
                  <button
                    type="button"
                    onClick={() => saveComment(commentFlow.target, commentFlow.responsible_id)}
                    disabled={sending}
                    className="flex-1 px-md py-sm rounded-lg bg-primary text-on-primary font-label-md shadow-md shadow-primary/20 hover:bg-surface-tint transition-all"
                  >
                    {sending ? 'Gravando…' : 'Confirmar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </PageShell>
  )
}

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`
  return `${Math.max(1, Math.round(bytes / 1024))} KB`
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
  link: { icon: 'link', label: 'Vínculo adicionado', color: '#0891b2' },
  link_remove: { icon: 'link_off', label: 'Vínculo removido', color: '#64748b' },
  delete: { icon: 'delete', label: 'Chamado excluído', color: '#dc2626' },
}

function historyMeta(action) {
  return ACTION_META[action] || { icon: 'receipt_long', label: 'Registro', color: '#64748b' }
}

function historyChanges(h) {
  if (h.action !== 'update' || !h.before || !h.after) return null

  const fields = [
    { label: 'Classificação', key: 'classification_name' },
    { label: 'Título', key: 'title' },
    { label: 'Descrição', key: 'description' },
    { label: 'Responsável', key: 'responsible_user_name' },
    { label: 'Situação', key: 'situation_name' },
  ]

  return fields
    .filter(({ key }) => String(h.before[key] ?? '') !== String(h.after[key] ?? ''))
    .map(({ label, key }) => ({
      label,
      old: h.before[key] || '—',
      new: h.after[key] || '—',
    }))
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
