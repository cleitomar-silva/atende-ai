import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const setores = [
  { id: '#ST-001', nome: 'Desenvolvimento Backend', icone: 'developer_mode_tv', cor: 'bg-primary-container/20 text-primary', empresa: 'Tech Nexus Solutions', destaque: true },
  { id: '#ST-002', nome: 'Financeiro & Fiscal', icone: 'account_balance_wallet', cor: 'bg-tertiary/10 text-tertiary', empresa: 'Global Logistics S.A.', destaque: false },
  { id: '#ST-003', nome: 'Enfermagem Oncológica', icone: 'medical_services', cor: 'bg-green-100 text-green-700', empresa: 'Nova Health Systems', destaque: false },
  { id: '#ST-004', nome: 'Marketing Digital', icone: 'campaign', cor: 'bg-orange-100 text-orange-700', empresa: 'Tech Nexus Solutions', destaque: false },
  { id: '#ST-005', nome: 'Suporte Nível 2', icone: 'support_agent', cor: 'bg-purple-100 text-purple-700', empresa: 'Tech Nexus Solutions', destaque: false },
]

export default function Setor() {
  const [termo, setTermo] = useState('')
  const navigate = useNavigate()

  const filtradas = setores.filter((setor) =>
    `${setor.id} ${setor.nome} ${setor.empresa}`.toLowerCase().includes(termo.toLowerCase())
  )

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg space-y-lg">
          <div className="max-w-7xl mx-auto space-y-lg">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-lg mb-xl">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  Gestão de Setores
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  Visualize e gerencie os departamentos vinculados às suas empresas parceiras.
                </p>
              </div>
              <button
                onClick={() => navigate('/setor/cadastro')}
                className="bg-primary text-on-primary font-title-lg text-title-lg px-lg py-sm rounded-lg flex items-center gap-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Novo Setor
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">apps</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Total de Setores</p>
                  <p className="font-headline-sm text-headline-sm font-bold">42</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">corporate_fare</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Empresas Ativas</p>
                  <p className="font-headline-sm text-headline-sm font-bold">12</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">person_pin</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Líderes Alocados</p>
                  <p className="font-headline-sm text-headline-sm font-bold">38</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md border-l-4 border-l-primary">
                <div className="w-12 h-12 bg-surface-container-high text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Crescimento Mês</p>
                  <p className="font-headline-sm text-headline-sm font-bold">+5</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
              <div className="p-md border-b border-outline-variant flex flex-col md:flex-row md:justify-between md:items-center gap-md bg-surface-container-low/50">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">search</span>
                  <input
                    type="text"
                    value={termo}
                    onChange={(e) => setTermo(e.target.value)}
                    className="w-full md:w-56 bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Pesquisar setores..."
                  />
                </div>
                <div className="flex items-center border border-outline-variant rounded-lg overflow-hidden">
                  <button className="p-sm bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-sm bg-primary text-on-primary">
                    <span className="material-symbols-outlined">grid_view</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b-2 border-outline-variant">
                    <tr>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Nome do Setor</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Empresa Vinculada</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtradas.map((setor) => (
                      <tr key={setor.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-lg py-md font-label-md text-label-md text-on-surface-variant">{setor.id}</td>
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${setor.cor}`}>
                              <span className="material-symbols-outlined text-[18px]">{setor.icone}</span>
                            </div>
                            <span className="font-body-lg text-body-lg font-semibold text-on-surface">{setor.nome}</span>
                          </div>
                        </td>
                        <td className="px-lg py-md">
                          <span
                            className={`inline-flex items-center px-sm py-xs rounded-lg font-label-md text-label-md ${
                              setor.destaque
                                ? 'bg-secondary-container text-on-secondary-container'
                                : 'bg-surface-container-high text-on-surface-variant'
                            }`}
                          >
                            {setor.empresa}
                          </span>
                        </td>
                        <td className="px-lg py-md text-right">
                          <div className="flex items-center justify-end gap-sm">
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Editar">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors" title="Excluir">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtradas.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-lg py-md text-center font-body-md text-on-surface-variant">
                          Nenhum setor encontrado para a empresa selecionada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-md flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant">
                <span className="font-label-md text-label-md text-on-surface-variant">Mostrando {filtradas.length} de 42 setores</span>
                <div className="flex gap-xs">
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-md">1</button>
                  <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">2</button>
                  <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">3</button>
                  <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
