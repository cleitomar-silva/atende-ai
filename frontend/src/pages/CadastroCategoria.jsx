import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const categoriasRecentes = ['Financeiro', 'RH / Benefícios', 'TI / Hardware']

export default function CadastroCategoria() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [descricao, setDescricao] = useState('')
  const [ativo, setAtivo] = useState(true)
  const [salvando, setSalvando] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (!nome) {
      alert('Por favor, preencha o nome da categoria.')
      return
    }
    setSalvando(true)
    setTimeout(() => {
      navigate('/categoria')
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
              <a href="/categoria" className="hover:text-primary transition-colors">Categorias</a>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-on-surface font-semibold">Nova Categoria</span>
            </nav>

            <div className="mb-lg">
              <h2 className="font-headline-md text-headline-md text-on-surface">Cadastro de Categoria</h2>
              <p className="text-body-md text-body-md text-on-surface-variant mt-xs">
                Organize seus chamados definindo categorias de atuação para uma melhor triagem.
              </p>
            </div>

            <div className="grid grid-cols-12 gap-lg">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant p-xl">
              <form className="space-y-lg" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="categoryName">Nome da Categoria</label>
                  <input
                    id="categoryName"
                    name="categoryName"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome da categoria"
                    type="text"
                    className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <p className="text-label-md text-label-md text-outline">Identifique a categoria de forma clara e objetiva (ex: Suporte de Infraestrutura).</p>
                </div>

                <hr className="border-outline-variant" />

                <div className="flex flex-col gap-sm">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="categoryDesc">Descrição</label>
                  <textarea
                    id="categoryDesc"
                    name="categoryDesc"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value.slice(0, 500))}
                    placeholder="Descreva as responsabilidades e o escopo desta categoria..."
                    rows="6"
                    className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                  />
                  <div className="flex justify-between">
                    <span className="text-label-md text-label-md text-outline italic">Opcional, porém recomendado para melhor triagem dos chamados.</span>
                    <span className={`text-label-md text-label-md ${descricao.length > 450 ? 'text-error' : 'text-outline'}`}>
                      {descricao.length} / 500
                    </span>
                  </div>
                </div>

                <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant flex items-center justify-between gap-md">
                  <div className="flex items-center gap-md">
                    <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                      <span className="material-symbols-outlined">visibility</span>
                    </div>
                    <div>
                      <h4 className="font-label-md text-label-md text-on-surface font-bold">Ativar Categoria</h4>
                      <p className="text-label-md text-label-md text-on-surface-variant">Categorias inativas não aparecem para novos chamados.</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={ativo} onChange={(e) => setAtivo(e.target.checked)} className="sr-only peer" />
                    <div className="w-11 h-6 bg-surface-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-md pt-lg border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => navigate('/categoria')}
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
                        Salvar Categoria
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
              <div className="p-lg bg-primary text-on-primary rounded-xl shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern height="40" id="grid" patternUnits="userSpaceOnUse" width="40">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="2"></path>
                      </pattern>
                    </defs>
                    <rect fill="url(#grid)" height="100%" width="100%"></rect>
                  </svg>
                </div>
                <div className="relative z-10">
                  <span className="material-symbols-outlined text-[40px] mb-md">lightbulb</span>
                  <h4 className="font-title-lg text-title-lg mb-xs">Dica de Organização</h4>
                  <p className="text-body-md text-body-md opacity-90">
                    Uma boa hierarquia de categorias reduz o tempo de resposta em até 30%. Evite nomes genéricos como "Outros" ou "Geral".
                  </p>
                </div>
              </div>
              <div className="p-lg bg-surface-container-lowest rounded-xl border border-outline-variant">
                <h4 className="font-label-md text-label-md text-primary font-bold uppercase tracking-widest mb-md">Categorias Recentes</h4>
                <div className="flex flex-col gap-sm">
                  {categoriasRecentes.map((categoria) => (
                    <div key={categoria} className="flex items-center gap-md p-sm hover:bg-surface-container transition-colors rounded-lg">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <span className="text-body-md text-body-md text-on-surface">{categoria}</span>
                    </div>
                  ))}
                </div>
                <button className="w-full mt-lg text-primary font-label-md text-label-md font-bold flex items-center justify-center gap-xs hover:underline">
                  Ver todos <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
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