import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const categorias = [
  { id: '#CT-001', nome: 'Infraestrutura', descricao: 'Problemas relacionados a hardware, rede e conectividade física.', cor: 'bg-primary' },
  { id: '#CT-002', nome: 'Sistemas ERP', descricao: 'Suporte para módulos financeiros, faturamento e logística.', cor: 'bg-tertiary' },
  { id: '#CT-003', nome: 'Acessos e Permissões', descricao: 'Reset de senhas, criação de novos usuários e alteração de perfis.', cor: 'bg-on-secondary-fixed' },
  { id: '#CT-004', nome: 'Software Desktop', descricao: 'Instalação e reparo de aplicativos de escritório (Office, navegadores).', cor: 'bg-secondary' },
  { id: '#CT-005', nome: 'Segurança Digital', descricao: 'Incidentes de segurança, suspeita de phishing e análise de vírus.', cor: 'bg-error' },
  { id: '#CT-006', nome: 'Telefonia', descricao: 'Configuração de ramais VoIP e aparelhos telefônicos físicos.', cor: 'bg-outline' },
]

export default function Categoria() {
  const navigate = useNavigate()
  const [termo, setTermo] = useState('')

  const filtradas = categorias.filter((categoria) =>
    `${categoria.id} ${categoria.nome} ${categoria.descricao}`.toLowerCase().includes(termo.toLowerCase())
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
                  <span className="material-symbols-outlined text-primary">category</span>
                  Gestão de Categorias
                </h2>
                <p className="font-body-md text-body-md text-on-surface-variant mt-xs">
                  Visualize e organize as classificações de chamados do sistema.
                </p>
              </div>
              <button
                onClick={() => navigate('/categoria/cadastro')}
                className="bg-primary text-on-primary font-title-lg text-title-lg px-lg py-sm rounded-lg flex items-center gap-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined">add_circle</span>
                Nova Categoria
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter mb-xl">
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">category</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Total de Categorias</p>
                  <p className="font-headline-sm text-headline-sm font-bold">24</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-tertiary/10 text-tertiary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">priority_high</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Críticas</p>
                  <p className="font-headline-sm text-headline-sm font-bold">06</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Mais Ativa</p>
                  <p className="font-headline-sm text-headline-sm font-bold truncate">Infraestrutura</p>
                </div>
              </div>
              <div className="bg-surface-container-lowest p-md rounded-xl shadow-sm border border-outline-variant flex items-center gap-md border-l-4 border-l-primary">
                <div className="w-12 h-12 bg-surface-container-high text-primary rounded-full flex items-center justify-center">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant">Atualizado</p>
                  <p className="font-headline-sm text-headline-sm font-bold">Hoje</p>
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
                    placeholder="Pesquisar categorias..."
                  />
                </div>
                <div className="flex items-center gap-sm">
                  <button className="p-sm text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg" title="Filtrar">
                    <span className="material-symbols-outlined">filter_list</span>
                  </button>
                  <button className="p-sm text-on-surface-variant hover:bg-surface-container-low transition-colors rounded-lg" title="Exportar">
                    <span className="material-symbols-outlined">download</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-surface-container-low border-b-2 border-outline-variant">
                    <tr>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">ID</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Nome da Categoria</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Descrição</th>
                      <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtradas.map((categoria) => (
                      <tr key={categoria.id} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-lg py-md font-label-md text-label-md text-on-surface-variant">{categoria.id}</td>
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-2 h-2 rounded-full ${categoria.cor}`}></div>
                            <span className="font-body-lg text-body-lg font-semibold text-on-surface">{categoria.nome}</span>
                          </div>
                        </td>
                        <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{categoria.descricao}</td>
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
                  </tbody>
                </table>
              </div>

              <div className="p-md flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant">
                <span className="font-label-md text-label-md text-on-surface-variant">Mostrando {filtradas.length} de 24 categorias</span>
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
