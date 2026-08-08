import { useEffect, useState } from 'react'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, Spinner, EmptyState, StatusBadge, inputClass } from '../components/dashboard/ui.jsx'
import { api, formatDate } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

const ACTION_META = {
  create: { color: '#16a34a', label: 'Cadastro' },
  update: { color: '#0f62fe', label: 'Edição' },
  delete: { color: '#ba1a1a', label: 'Exclusão' },
  comment: { color: '#7c3aed', label: 'Comentário' },
  attach: { color: '#0891b2', label: 'Anexo' },
}

export default function Operacoes() {
  const toast = useToast()
  const confirm = useConfirm()
  const [audits, setAudits] = useState([])
  const [loading, setLoading] = useState(true)
  const [entity, setEntity] = useState('')
  const [action, setAction] = useState('')
  const [applying, setApplying] = useState(null)

  const load = () => {
    setLoading(true)
    api('/audits', { query: { entity, action, per_page: 50 } })
      .then((d) => setAudits(d.audits?.data || d.audits || []))
      .catch(() => setAudits([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [entity, action])

  const undo = async (a) => {
    const verb = a.action === 'create' ? 'desfazer este cadastro' : a.action === 'delete' ? 'desfazer esta exclusão' : 'restaurar os dados anteriores desta edição'
    const detail = a.action === 'create' ? 'o registro será removido' : a.action === 'delete' ? 'o registro será restaurado' : 'os dados anteriores serão restaurados'
    const ok = await confirm({
      title: 'Desfazer operação',
      message: `Deseja ${verb}? ${detail}.`,
      confirmText: 'Desfazer',
      danger: true,
    })
    if (!ok) return
    setApplying(a.id)
    try {
      await api(`/audits/${a.id}/undo`, { method: 'POST' })
      load()
      toast.success('Operação desfeita com sucesso.')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setApplying(null)
    }
  }

  const entities = ['Company', 'Sector', 'User', 'Group', 'Category', 'Situation', 'Classification', 'Ticket']
  const actions = ['create', 'update', 'delete', 'comment', 'attach']

  return (
    <PageShell>
      <PageHeader title="Operações (Desfazer / Auditoria)" subtitle="Histórico de auditoria da empresa. Somente administradores podem desfazer." />

      <Card>
        <div className="p-lg flex items-center gap-md flex-wrap">
          <select value={entity} onChange={(e) => setEntity(e.target.value)} className={inputClass}>
            <option value="">Todos os tipos</option>
            {entities.map((en) => (
              <option key={en} value={en}>{en}</option>
            ))}
          </select>
          <select value={action} onChange={(e) => setAction(e.target.value)} className={inputClass}>
            <option value="">Todas as ações</option>
            {actions.map((a) => (
              <option key={a} value={a}>{ACTION_META[a]?.label || a}</option>
            ))}
          </select>
        </div>
      </Card>

      <Card>
        {loading ? (
          <Spinner />
        ) : audits.length === 0 ? (
          <EmptyState message="Nenhuma operação no histórico." />
        ) : (
          <div className="overflow-x-auto pb-lg">
            <table className="w-full zebra-table">
              <thead>
                <tr className="text-label-md text-on-surface-variant uppercase">
                  <th className="px-lg py-sm text-left">Data</th>
                  <th className="px-lg py-sm text-left">Usuário</th>
                  <th className="px-lg py-sm text-left">Tipo</th>
                  <th className="px-lg py-sm text-left">Ação</th>
                  <th className="px-lg py-sm text-left">Resumo</th>
                  <th className="px-lg py-sm text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-lg py-sm text-on-surface-variant">{formatDate(a.created_at)}</td>
                    <td className="px-lg py-sm">{a.user?.name || 'Sistema'}</td>
                    <td className="px-lg py-sm text-on-surface-variant">{a.entity} #{a.entity_id}</td>
                    <td className="px-lg py-sm">
                      <StatusBadge label={ACTION_META[a.action]?.label || a.action} color={ACTION_META[a.action]?.color} />
                    </td>
                    <td className="px-lg py-sm text-on-surface-variant max-w-md truncate">{a.summary}</td>
                    <td className="px-lg py-sm text-right whitespace-nowrap">
                      {!a.is_reverted ? (
                        <button
                          onClick={() => undo(a)}
                          disabled={applying === a.id}
                          className="inline-flex items-center gap-sm px-md py-sm rounded-lg bg-primary/10 text-primary font-label-md hover:bg-primary/20 disabled:opacity-60 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">undo</span>
                          Desfazer
                        </button>
                      ) : (
                        <span className="text-label-md text-on-surface-variant">Desfeito</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </PageShell>
  )
}