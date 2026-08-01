import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const empresas = [
  { id: '#001', nome: 'Tech Nova Soluções', inicial: 'T', cor: 'bg-primary-container/20 text-primary', cnpj: '45.123.456/0001-99', data: '15 Out, 2023' },
  { id: '#002', nome: 'Global Trade Ltda', inicial: 'G', cor: 'bg-secondary-container/20 text-secondary', cnpj: '12.987.654/0001-01', data: '22 Jan, 2024' },
  { id: '#003', nome: 'Alpha Logística', inicial: 'A', cor: 'bg-tertiary-container/10 text-tertiary', cnpj: '08.332.111/0001-50', data: '05 Mar, 2024' },
  { id: '#004', nome: 'MedGroup Saúde', inicial: 'M', cor: 'bg-on-primary-fixed-variant/10 text-primary', cnpj: '33.444.555/0001-88', data: '12 Abr, 2024' },
  { id: '#005', nome: 'Blue Sky Agência', inicial: 'B', cor: 'bg-on-secondary-fixed-variant/10 text-secondary', cnpj: '19.228.337/0001-12', data: '02 Mai, 2024' },
]

export default function Empresa() {
  const [termo, setTermo] = useState('')
  const navigate = useNavigate()

  const filtradas = empresas.filter((empresa) =>
    `${empresa.nome} ${empresa.cnpj} ${empresa.data}`.toLowerCase().includes(termo.toLowerCase())
  )

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg space-y-lg">
          <div className="max-w-7xl mx-auto space-y-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md">
              <div>
                <h2 className="font-headline-md text-headline-md text-on-surface">Gestão de Empresas</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Visualize e gerencie as organizações registradas no AtendeAí.
                </p>
              </div>
              <button
                onClick={() => navigate('/empresa/cadastro')}
                className="flex items-center gap-sm bg-primary text-on-primary px-lg py-sm rounded-xl font-title-lg shadow-md hover:shadow-lg transition-shadow active:scale-95"
              >
                <span className="material-symbols-outlined">add_business</span>
                Nova Empresa
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
              <div className="glass-card p-md rounded-xl shadow-sm flex items-center gap-md">
                <div className="bg-primary-container text-on-primary-container p-sm rounded-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>corporate_fare</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total de Empresas</p>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">124</h3>
                </div>
              </div>
              <div className="glass-card p-md rounded-xl shadow-sm flex items-center gap-md">
                <div className="bg-secondary-container text-on-secondary-container p-sm rounded-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fiber_new</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Novas (30 dias)</p>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">12</h3>
                </div>
              </div>
              <div className="glass-card p-md rounded-xl shadow-sm flex items-center gap-md">
                <div className="bg-tertiary-container/10 text-tertiary p-sm rounded-lg">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                </div>
                <div>
                  <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Última Atualização</p>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Hoje, 10:45</h3>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
              <div className="p-md border-b border-outline-variant flex flex-col md:flex-row md:justify-between md:items-center gap-md bg-surface-container-low/50">
                <h4 className="font-title-lg text-title-lg text-on-surface">Listagem de Empresas</h4>
                <div className="flex flex-wrap items-center gap-sm">
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-body-lg">
                      search
                    </span>
                    <input
                      type="text"
                      value={termo}
                      onChange={(e) => setTermo(e.target.value)}
                      className="w-full md:w-56 bg-surface-container-lowest border border-outline-variant rounded-full py-2 pl-10 pr-4 font-body-md text-body-md text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Pesquisar empresas..."
                    />
                  </div>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">filter_list</span>
                  </button>
                  <button className="p-2 border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">file_download</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low/30 border-b-2 border-outline-variant">
                      <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">ID</th>
                      <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Nome da Empresa</th>
                      <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">CNPJ</th>
                      <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Data de Cadastro</th>
                      <th className="p-md font-label-md text-label-md text-on-surface-variant uppercase tracking-widest text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filtradas.map((empresa) => (
                      <tr key={empresa.id} className="hover:bg-primary-fixed/10 transition-colors group">
                        <td className="p-md font-body-md text-body-md text-on-surface">{empresa.id}</td>
                        <td className="p-md">
                          <div className="flex items-center gap-sm">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${empresa.cor}`}>{empresa.inicial}</div>
                            <span className="font-body-md font-semibold text-on-surface">{empresa.nome}</span>
                          </div>
                        </td>
                        <td className="p-md font-body-md text-body-md text-on-surface-variant">{empresa.cnpj}</td>
                        <td className="p-md font-body-md text-body-md text-on-surface-variant">{empresa.data}</td>
                        <td className="p-md">
                          <div className="flex items-center justify-center gap-sm opacity-60 group-hover:opacity-100 transition-opacity">
                            <button className="p-2 hover:bg-primary-container/20 rounded-lg text-primary transition-colors" title="Editar">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button className="p-2 hover:bg-error-container/20 rounded-lg text-error transition-colors" title="Excluir">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {filtradas.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-md text-center font-body-md text-on-surface-variant">
                          Nenhuma empresa encontrada.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="p-md flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant">
                <span className="font-label-md text-label-md text-on-surface-variant">Mostrando {filtradas.length} de 124 empresas</span>
                <div className="flex gap-xs">
                  <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50" disabled>
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-md">1</button>
                  <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">2</button>
                  <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">3</button>
                  <button className="p-2 rounded-lg border border-outline-variant hover:bg-surface-container-high">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center items-center gap-sm text-on-surface-variant opacity-50 pt-lg">
              <span className="material-symbols-outlined text-[16px]">verified_user</span>
              <p className="font-label-md text-label-md">Sistema de Segurança Ativo • Logs de auditoria registrados.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
