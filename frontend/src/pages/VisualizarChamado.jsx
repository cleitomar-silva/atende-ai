import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, Spinner, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
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
  const [historyOpen, setHistoryOpen] = useState(false)
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
      toast.success('Comentário enviado com sucesso.')
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
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-md text-headline-md text-on-surface">
            Chamado #{ticket.number}
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Aberto em {formatDate(ticket.created_at)} · por {ticket.requesting_user?.name}
          </p>
        </div>
        <StatusBadge label={ticket.situation?.name} color={ticket.situation?.color} />
      </div>

      {error && <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">{error}</div>}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        <div className="lg:col-span-2 space-y-lg">
          <Card>
            <div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
              <h3 className="font-title-lg">Detalhes</h3>
              {(isResponsible || isAdmin) && (
                <button onClick={() => setEditing((v) => !v)} className="text-label-md text-primary font-semibold hover:underline">
                  {editing ? 'Cancelar edição' : 'Editar'}
                </button>
              )}
            </div>
            <div className="p-lg space-y-md">
              {editing ? (
                <form onSubmit={saveEdit} className="space-y-md">
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Classificação</label>
                    <select className={inputClass} value={editForm.classification_id} onChange={(e) => setEditForm((p) => ({ ...p, classification_id: e.target.value }))}>
                      {classifications.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Título</label>
                    <input className={inputClass} value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-on-surface-variant">Descrição</label>
                    <textarea className={inputClass} rows={5} value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))}></textarea>
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
                    <p className="text-label-md text-on-surface-variant">Somente usuários do setor demandado são exibidos.</p>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" disabled={sending} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md disabled:opacity-60">
                      {sending ? 'Gravando…' : 'Gravar'}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-md">
                    <FieldValue label="Classificação" value={ticket.classification?.name} />
                    <FieldValue label="Categoria" value={ticket.classification?.category?.name} />
                    <FieldValue label="Grupo" value={ticket.classification?.group?.name} />
                    <FieldValue label="SLA" value={ticket.classification?.sla_minutes ? `${ticket.classification.sla_minutes} min` : '—'} />
                    <FieldValue label="Setor solicitante" value={ticket.requesting_sector?.name} />
                    <FieldValue label="Setor demandado" value={ticket.responsible_sector?.name} />
                    <FieldValue label="Usuário solicitante" value={ticket.requesting_user?.name} />
                    <FieldValue label="Responsável" value={ticket.responsible_user?.name || 'Não atribuído'} />
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant mb-xs">Título</p>
                    <p className="font-title-lg font-bold text-on-surface">{ticket.title}</p>
                  </div>
                  <div>
                    <p className="font-label-md text-on-surface-variant mb-xs">Descrição</p>
                    <p className="text-body-md text-on-surface whitespace-pre-wrap">{ticket.description}</p>
                  </div>
                </>
              )}
            </div>
          </Card>

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg">Anexos</h3>
            </div>
            <div className="p-lg">
              {ticket.attachments?.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">Nenhum anexo.</p>
              ) : (
                <ul className="space-y-sm">
                  {ticket.attachments.map((att) => (
                    <li key={att.id} className="flex items-center gap-md px-md py-sm bg-surface-container-low rounded-lg">
                      <span className="material-symbols-outlined text-on-surface-variant">attach_file</span>
                      <button onClick={() => downloadAttachment(att)} className="flex-1 text-body-md text-primary hover:underline text-left truncate">
                        {att.original_name}
                      </button>
                      <span className="text-label-md text-on-surface-variant">{(att.size / 1024 / 1024).toFixed(2)} MB</span>
                      {editing && (isResponsible || isAdmin) && (
                        <button
                          onClick={() => deleteAttachment(att)}
                          title="Excluir anexo"
                          className="p-1 rounded-full text-error hover:bg-error-container hover:text-on-error-container transition-colors"
                        >
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg">Apontamentos / Comentários</h3>
            </div>
            <div className="p-lg space-y-md">
              {ticket.comments?.length === 0 ? (
                <p className="text-body-md text-on-surface-variant">Nenhum comentário ainda.</p>
              ) : (
                <div className="space-y-md">
                  {ticket.comments.map((c) => (
                    <div key={c.id} className={`flex gap-md ${c.is_internal ? 'bg-amber-50 dark:bg-amber-500/10' : ''} p-md rounded-lg ${c.is_internal ? 'border border-amber-200' : 'bg-surface-container-low'}`}>
                      <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0">
                        {(c.user?.name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-sm">
                          <p className="font-body-md font-bold text-on-surface">{c.user?.name}</p>
                          {c.is_internal && (
                            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-700 dark:text-amber-300 rounded-full text-label-md font-semibold">Interno</span>
                          )}
                          <span className="text-label-md text-on-surface-variant">{formatDate(c.created_at)}</span>
                        </div>
                        <p className="text-body-md text-on-surface whitespace-pre-wrap mt-xs">{c.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {canSendComment && (
                <form onSubmit={sendComment} className="mt-lg space-y-md">
                  <textarea
                    className={inputClass}
                    rows={4}
                    placeholder="Escreva um apontamento…"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  ></textarea>
                  <div className="flex items-center justify-between gap-md">
                    <label className="flex items-center gap-sm text-label-md text-on-surface-variant cursor-pointer">
                      <input type="checkbox" checked={isInternal} onChange={(e) => setIsInternal(e.target.checked)} className="w-4 h-4 accent-[#004ccd]" />
                      Comentário interno
                    </label>
                    <button type="submit" disabled={sending || !comment.trim()} className="px-md py-sm rounded-lg bg-primary text-on-primary font-label-md disabled:opacity-60 transition-all">
                      {sending ? 'Enviando…' : 'Enviar comentário'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </div>

        <div className="space-y-lg">
          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg">Situação</h3>
            </div>
            <div className="p-lg">
              <StatusBadge label={ticket.situation?.name} color={ticket.situation?.color} />
              <div className="mt-md">
                <label className="font-label-md text-on-surface-variant block mb-sm">Alterar situação</label>
                <select
                  className={inputClass}
                  value={ticket.situation_id}
                  onChange={(e) => changeSituation(e.target.value)}
                >
                  <option value="">Selecione a situação…</option>
                  {available.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <p className="text-label-md text-on-surface-variant mt-sm">
                  As transições seguem as regras definidas nas Situações (ex.: "Aguardando validação" pode ser concluída ou recusada pelo solicitante).
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <div className="px-lg py-md border-b border-outline-variant">
              <h3 className="font-title-lg">Resumo</h3>
            </div>
            <div className="p-lg space-y-sm">
              <Row label="Abertura" value={formatDate(ticket.created_at)} />
              <Row label="Solicitante" value={ticket.requesting_user?.name} />
              <Row label="Setor" value={ticket.requesting_sector?.name} />
              <Row label="Responsável" value={ticket.responsible_user?.name || '—'} />
              <Row label="Fechado em" value={ticket.closed_at ? formatDate(ticket.closed_at) : '—'} />
            </div>
          </Card>
        </div>
      </div>

      <Card className="mt-lg">
        <button onClick={() => setHistoryOpen((v) => !v)} className="w-full px-lg py-md border-b border-outline-variant flex items-center justify-between hover:bg-surface-container-low transition-colors">
          <span className="font-title-lg flex items-center gap-sm">
            <span className={`material-symbols-outlined ${historyOpen ? 'text-primary' : 'text-on-surface-variant'}`}>history</span>
            Histórico do chamado
          </span>
          <span className="flex items-center gap-sm text-label-md text-on-surface-variant">
            {history.length} {history.length === 1 ? 'evento' : 'eventos'}
            <span className={`material-symbols-outlined transition-transform ${historyOpen ? 'rotate-180' : ''}`}>expand_more</span>
          </span>
        </button>
        {historyOpen && (
          <div className="p-lg">
            {history.length === 0 ? (
              <p className="text-body-md text-on-surface-variant">Nenhum evento registrado ainda.</p>
            ) : (
              <div className="relative pl-md">
                <div className="absolute left-[9px] top-2 bottom-2 w-px bg-outline-variant"></div>
                <ul className="space-y-md">
                  {history.map((h) => {
                    const meta = historyMeta(h.action)
                    return (
                      <li key={h.id} className="relative flex gap-md">
                        <span
                          className="absolute left-[5px] top-1 h-[9px] w-[9px] rounded-full ring-4 shrink-0"
                          style={{ backgroundColor: meta.color, boxShadow: `0 0 0 4px ${meta.color}22` }}
                        ></span>
                        <div className="flex-none w-9 h-9 rounded-full flex items-center justify-center shrink-0"
                          style={{ backgroundColor: `${meta.color}18`, color: meta.color }}
                        >
                          <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0 pt-0.5">
                          <div className="flex items-center gap-sm flex-wrap">
                            <p className="font-body-md font-bold text-on-surface">{meta.label}</p>
                            <span className="text-label-md text-on-surface-variant">{formatDate(h.created_at)}</span>
                          </div>
                          <p className="text-body-md text-on-surface whitespace-pre-wrap">{h.summary}</p>
                          {h.user && (
                            <p className="text-label-md text-on-surface-variant mt-xs">por {h.user.name}</p>
                          )}
                        </div>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </div>
        )}
      </Card>
    </PageShell>
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

function FieldValue({ label, value }) {
  return (
    <div>
      <p className="font-label-md text-on-surface-variant">{label}</p>
      <p className="font-body-md font-semibold text-on-surface">{value || '—'}</p>
    </div>
  )
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

function Row({ label, value }) {
  return (
    <div className="flex justify-between gap-md">
      <span className="text-label-md text-on-surface-variant">{label}</span>
      <span className="text-label-md font-semibold text-on-surface text-right">{value}</span>
    </div>
  )
}