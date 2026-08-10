import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageShell from '../components/dashboard/PageShell.jsx'
import { Card, PageHeader, EmptyState, StatusBadge, Spinner } from '../components/dashboard/ui.jsx'
import { api } from '../services/api'
import { useToast } from '../components/ToastProvider.jsx'
import { useConfirm } from '../components/ConfirmProvider.jsx'

export default function Situacao() {
  const toast = useToast()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [situations, setSituations] = useState([])
  const [loading, setLoading] = useState(true)

  const load = () => {
    setLoading(true)
    api('/situations')
      .then((d) => setSituations(d.situations || []))
      .catch(() => setSituations([]))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const remove = async (s) => {
    const ok = await confirm({
      title: 'Excluir situação',
      message: `Excluir a situação "${s.name}"?`,
      confirmText: 'Excluir',
      danger: true,
    })
    if (!ok) return
    try {
      await api(`/situations/${s.id}`, { method: 'DELETE' })
      load()
      toast.success('Situação excluída com sucesso.')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      <PageShell>
        <PageHeader title="Situações do Chamado" subtitle="Gerencie os status/situações dos chamados." />
        <Card>
          <div className="p-lg flex justify-end">
            <button onClick={() => navigate('/situacao/novo')} className="flex items-center gap-sm bg-primary text-on-primary px-md py-sm rounded-lg font-label-md hover:bg-surface-tint transition-all">
              <span className="material-symbols-outlined text-[18px]">add</span>
              Nova Situação
            </button>
          </div>
          {loading ? (
            <Spinner />
          ) : situations.length === 0 ? (
            <EmptyState message="Nenhuma situação cadastrada ainda." />
          ) : (
            <div className="overflow-x-auto pb-lg">
              <table className="w-full zebra-table">
                <thead>
                  <tr className="text-label-md text-on-surface-variant uppercase">
                    <th className="px-lg py-sm text-left">Nome da situação</th>
                    <th className="px-lg py-sm text-left">Cor</th>
                    <th className="px-lg py-sm text-left">Conta SLA</th>
                    <th className="px-lg py-sm text-left">Status</th>
                    <th className="px-lg py-sm text-right">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {situations.map((s) => (
                    <tr key={s.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-lg py-sm font-body-md font-semibold">{s.name}</td>
                      <td className="px-lg py-sm">
                        <span className="inline-flex items-center gap-sm">
                          <span className="w-4 h-4 rounded-full border border-outline-variant" style={{ backgroundColor: s.color }}></span>
                          <span className="text-label-md text-on-surface-variant uppercase">{s.color}</span>
                        </span>
                      </td>
                      <td className="px-lg py-sm text-on-surface-variant">{s.counts_sla ? 'Sim' : 'Não'}</td>
                      <td className="px-lg py-sm">
                        <StatusBadge label={s.is_active ? 'Ativo' : 'Desativado'} color={s.is_active ? '#16a34a' : '#ba1a1a'} />
                      </td>
                      <td className="px-lg py-sm text-right">
                        <button onClick={() => navigate(`/situacao/${s.id}/editar`)} className="p-2 text-on-surface-variant hover:text-primary transition-colors" title="Editar">
                          <span className="material-symbols-outlined">edit</span>
                        </button>
                        <button onClick={() => remove(s)} className="p-2 text-on-surface-variant hover:text-error transition-colors" title="Excluir">
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
    </div>
  )
}