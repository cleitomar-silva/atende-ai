import { useNavigate } from 'react-router-dom'

const TICKETS = [
  {
    id: '#TK-8821',
    subject: 'Erro de integração API Stripe',
    sub: 'Checkout não finaliza no mobile',
    customer: 'João D\'Almeida',
    initials: 'JD',
    status: 'Em Atendimento',
    priority: 'Urgente',
    sla: '45 min restantes',
    slaTone: 'text-error',
    date: 'Hoje, 14:20',
  },
  {
    id: '#TK-8812',
    subject: 'Falha no login',
    sub: 'SSO não reconhece credenciais',
    customer: 'Dev Team',
    initials: 'DE',
    status: 'Em Atendimento',
    priority: 'Urgente',
    sla: '1 h 10 min restantes',
    slaTone: 'text-error',
    date: '20 Ago, 10:00',
  },
  {
    id: '#TK-8818',
    subject: 'Recuperação de conta',
    sub: 'E-mail de confirmação não recebido',
    customer: 'Pedro Lima',
    initials: 'PL',
    status: 'Aguardando Cliente',
    priority: 'Alta',
    sla: 'Concluído no SLA',
    slaTone: 'text-green-600',
    date: 'Ontem, 16:12',
  },
  {
    id: '#TK-8815',
    subject: 'Problema no dashboard',
    sub: 'Gráficos não carregam no Safari',
    customer: 'Carlos R.',
    initials: 'CA',
    status: 'Resolvido',
    priority: 'Média',
    sla: 'Concluído no SLA',
    slaTone: 'text-green-600',
    date: '21 Ago, 10:00',
  },
  {
    id: '#TK-8813',
    subject: 'Bug de tradução',
    sub: 'Textos em inglês no painel PT',
    customer: 'Lucia M.',
    initials: 'LU',
    status: 'Resolvido',
    priority: 'Baixa',
    sla: 'Concluído no SLA',
    slaTone: 'text-green-600',
    date: '20 Ago, 10:00',
  },
]

const STATUS_STYLES = {
  'Novo': 'bg-primary-fixed text-on-primary-fixed-variant',
  'Em Atendimento': 'bg-tertiary-container text-on-tertiary-container',
  'Aguardando Cliente': 'bg-secondary-container text-on-secondary-container',
  'Resolvido': 'bg-surface-container-highest text-on-surface-variant',
}

const PRIORITY_STYLES = {
  'Urgente': 'bg-error-container text-on-error-container',
  'Alta': 'bg-surface-variant text-on-surface-variant',
  'Média': 'bg-surface-container text-on-surface-variant',
  'Baixa': 'bg-surface-container text-on-surface-variant',
}

const Badge = ({ label, className, pulse }) => (
  <span className={`inline-flex items-center gap-1 px-xs py-0.5 rounded text-[10px] font-bold uppercase ${className}`}>
    {pulse && <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>}
    {label}
  </span>
)

export default function MeusTicketsTable() {
  const navigate = useNavigate()

  return (
    <div className="surface-card bg-white rounded-xl flex-1 overflow-hidden flex flex-col">
      <div className="overflow-auto scrollbar-hide flex-1">
        <table className="w-full text-left zebra-table border-collapse">
          <thead className="sticky top-0 bg-white z-10 border-b-2 border-outline-variant">
            <tr className="text-label-md text-on-surface-variant uppercase tracking-wider">
              <th className="px-md py-lg font-bold">ID</th>
              <th className="px-md py-lg font-bold">Assunto</th>
              <th className="px-md py-lg font-bold">Cliente</th>
              <th className="px-md py-lg font-bold">Status</th>
              <th className="px-md py-lg font-bold">Prioridade</th>
              <th className="px-md py-lg font-bold">SLA</th>
              <th className="px-md py-lg font-bold">Data</th>
              <th className="px-md py-lg font-bold text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {TICKETS.map((ticket) => (
              <tr key={ticket.id} onClick={() => navigate(`/chamados/${ticket.id.replace('#', '')}`)} className="hover:bg-primary/5 transition-colors cursor-pointer group">
                <td className="px-md py-md font-mono text-xs text-primary">{ticket.id}</td>
                <td className="px-md py-md max-w-xs">
                  <p className="font-semibold text-on-surface truncate">{ticket.subject}</p>
                  <p className="text-xs text-on-surface-variant truncate">{ticket.sub}</p>
                </td>
                <td className="px-md py-md">
                  <div className="flex items-center gap-xs">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center text-[10px] font-bold">
                      {ticket.initials}
                    </div>
                    <span className="text-body-md">{ticket.customer}</span>
                  </div>
                </td>
                <td className="px-md py-md">
                  <Badge label={ticket.status} className={STATUS_STYLES[ticket.status]} pulse={ticket.status === 'Em Atendimento'} />
                </td>
                <td className="px-md py-md">
                  <Badge label={ticket.priority} className={PRIORITY_STYLES[ticket.priority]} />
                </td>
                <td className="px-md py-md">
                  <span className={`text-xs font-semibold ${ticket.slaTone}`}>{ticket.sla}</span>
                </td>
                <td className="px-md py-md text-on-surface-variant text-xs">{ticket.date}</td>
                <td className="px-md py-md text-center">
                  <button className="p-1 hover:bg-surface-container-low rounded text-on-surface-variant">
                    <span className="material-symbols-outlined text-md">more_vert</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-outline-variant px-lg py-sm bg-surface-container-lowest flex items-center justify-between">
        <p className="text-label-md text-on-surface-variant">Mostrando 1-5 de 8 chamados</p>
        <div className="flex items-center gap-sm">
          <button className="p-1 rounded border border-outline-variant opacity-50 cursor-not-allowed">
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <div className="flex items-center gap-xs">
            <button className="w-8 h-8 rounded bg-primary text-on-primary font-bold text-xs">1</button>
            <button className="w-8 h-8 rounded hover:bg-surface-container-low transition-colors text-xs">2</button>
          </div>
          <button className="p-1 rounded border border-outline-variant hover:bg-surface-container-low transition-colors">
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </div>
  )
}