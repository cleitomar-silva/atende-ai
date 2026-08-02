import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

export default function CadastroSetor() {
  const navigate = useNavigate()
  const [empresa, setEmpresa] = useState('')
  const [nome, setNome] = useState('')
  const [salvando, setSalvando] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!empresa || !nome) {
      alert('Por favor, preencha todos os campos obrigatórios.')
      return
    }
    setSalvando(true)
    setTimeout(() => {
      navigate('/setor')
    }, 1000)
  }

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg flex-grow">
          <div className="max-w-4xl mx-auto">
            <nav className="flex items-center gap-xs text-on-surface-variant mb-md font-label-md text-label-md">
              <span className="font-label-md text-label-md">Configurações</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <a href="/setor" className="hover:text-primary transition-colors">Setores</a>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Novo Setor</span>
            </nav>

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface">Cadastro de Setor</h2>
              <p className="text-body-md text-body-md text-on-surface-variant mt-xs">
                Adicione um novo setor à sua estrutura organizacional para segmentar os chamados.
              </p>
            </div>

            <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-xl">
              <form className="space-y-lg" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
                  <div className="md:col-span-4">
                    <label className="block font-title-lg text-title-lg text-on-surface mb-xs" htmlFor="company">Empresa</label>
                    <p className="text-label-md text-label-md text-on-surface-variant">Selecione a empresa à qual este setor pertence.</p>
                  </div>
                  <div className="md:col-span-8">
                    <div className="relative">
                      <select
                        id="company"
                        name="company"
                        value={empresa}
                        onChange={(e) => setEmpresa(e.target.value)}
                        className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md appearance-none bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      >
                        <option disabled value="">Selecione uma empresa</option>
                        <option value="1">SupportHub Soluções LTDA</option>
                        <option value="2">TecnoLogistics S.A.</option>
                        <option value="3">Varejo Connect Brasil</option>
                        <option value="4">HealthCore Systems</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                    </div>
                  </div>
                </div>

                <hr className="border-outline-variant" />

                <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
                  <div className="md:col-span-4">
                    <label className="block font-title-lg text-title-lg text-on-surface mb-xs" htmlFor="sectorName">Nome do Setor</label>
                    <p className="text-label-md text-label-md text-on-surface-variant">Defina um nome claro para identificação rápida (ex: Financeiro, TI, RH).</p>
                  </div>
                  <div className="md:col-span-8">
                    <input
                      id="sectorName"
                      name="sectorName"
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      placeholder="Digite o nome do setor"
                      type="text"
                      className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                  </div>
                </div>

                <div className="mt-xl p-md bg-surface-container-low rounded-lg border border-outline-variant border-dashed flex items-start gap-md">
                  <span className="material-symbols-outlined text-primary">info</span>
                  <div>
                    <p className="text-label-md text-label-md text-on-surface font-semibold">Dica de Organização</p>
                    <p className="text-label-md text-label-md text-on-surface-variant">
                      Setores bem definidos ajudam na automação do roteamento de tickets e na geração de relatórios de produtividade por área.
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-md pt-lg border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => navigate('/setor')}
                    className="px-lg py-sm rounded-xl font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-high transition-colors active:scale-95 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={salvando}
                    className="px-xl py-sm rounded-xl font-label-md text-label-md bg-primary text-on-primary shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-sm disabled:opacity-60"
                  >
                    {salvando ? (
                      <>
                        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[20px]">check</span>
                        Salvar Setor
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-xl grid grid-cols-1 md:grid-cols-2 gap-lg">
              <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-md">
                  <span className="material-symbols-outlined text-[32px]">history</span>
                </div>
                <h4 className="font-title-lg text-title-lg text-on-surface mb-xs">Histórico Recente</h4>
                <p className="text-body-md text-body-md text-on-surface-variant">Veja os últimos setores criados nesta conta.</p>
                <button className="mt-md text-primary font-label-md text-label-md flex items-center gap-xs hover:underline">
                  Ver todos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
              <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center text-secondary mb-md">
                  <span className="material-symbols-outlined text-[32px]">assignment_ind</span>
                </div>
                <h4 className="font-title-lg text-title-lg text-on-surface mb-xs">Atribuição Automática</h4>
                <p className="text-body-md text-body-md text-on-surface-variant">Configure quem será o responsável por este setor após salvar.</p>
                <button className="mt-md text-primary font-label-md text-label-md flex items-center gap-xs hover:underline">
                  Configurar Regras <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
