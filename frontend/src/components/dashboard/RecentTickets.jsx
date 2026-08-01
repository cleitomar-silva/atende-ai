const TICKETS = [
  {
    id: '#4502',
    subject: 'Falha na integração API v2',
    customer: 'Global Services',
    status: { label: 'Aberto', className: 'bg-primary-fixed text-on-primary-fixed-variant' },
    priority: { label: 'Alta', className: 'bg-error-container text-on-error-container' },
    updated: '10m atrás',
  },
  {
    id: '#4498',
    subject: 'Dúvida sobre cobrança mensal',
    customer: 'Ana Martins',
    status: { label: 'Em Resposta', className: 'bg-secondary-container text-on-secondary-container' },
    priority: { label: 'Média', className: 'bg-surface-variant text-on-surface-variant' },
    updated: '45m atrás',
  },
  {
    id: '#4492',
    subject: 'Redefinição de senha administrador',
    customer: 'Pulsar Corp',
    status: { label: 'Em Espera', className: 'bg-tertiary-fixed text-on-tertiary-fixed-variant' },
    priority: { label: 'Baixa', className: 'bg-surface-container-high text-on-surface-variant' },
    updated: '2h atrás',
  },
  {
    id: '#4480',
    subject: 'Erro de carregamento no Dashboard',
    customer: 'Ricardo Lima',
    status: { label: 'Aberto', className: 'bg-primary-fixed text-on-primary-fixed-variant' },
    priority: { label: 'Alta', className: 'bg-error-container text-on-error-container' },
    updated: '4h atrás',
  },
]

const Badge = ({ label, className }) => (
  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>{label}</span>
)

export default function RecentTickets() {
  return (
    <div className="glass-card rounded-xl shadow-sm overflow-hidden">
      <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
        <h4 className="font-title-lg text-title-lg">Meus Tickets Recentes</h4>
        <button className="text-primary font-label-md text-label-md hover:underline">Ver Todos</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left zebra-table">
          <thead className="bg-surface-container-low sticky top-0 border-b-2 border-outline-variant">
            <tr>
              {['ID', 'Assunto', 'Cliente', 'Status', 'Prioridade', 'Última Att.'].map((h) => (
                <th
                  key={h}
                  className="px-lg py-md text-label-md font-label-md text-on-surface-variant uppercase tracking-wider"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-body-md divide-y divide-outline-variant/30">
            {TICKETS.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-primary/5 transition-colors cursor-pointer">
                <td className="px-lg py-md font-bold">{ticket.id}</td>
                <td className="px-lg py-md">{ticket.subject}</td>
                <td className="px-lg py-md">{ticket.customer}</td>
                <td className="px-lg py-md">
                  <Badge label={ticket.status.label} className={ticket.status.className} />
                </td>
                <td className="px-lg py-md">
                  <Badge label={ticket.priority.label} className={ticket.priority.className} />
                </td>
                <td className="px-lg py-md text-on-surface-variant">{ticket.updated}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
