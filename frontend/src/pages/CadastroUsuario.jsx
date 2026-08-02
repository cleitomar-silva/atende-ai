import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const setores = ['Suporte Técnico', 'Vendas', 'Financeiro', 'Recursos Humanos',]
const permissoes = ['Admin', 'Agente', 'Cliente']

export default function CadastroUsuario() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    setores: [],
    permissao: '',
    boasVindas: true,
  })
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [foto, setFoto] = useState(null)
  const [abrirSetores, setAbrirSetores] = useState(false)
  const setoresRef = useRef(null)
  const fotoInputRef = useRef(null)

  function abrirSeletorFoto() {
    fotoInputRef.current?.click()
  }

  function onFotoSelecionada(e) {
    const arquivo = e.target.files?.[0]
    if (arquivo) {
      setFoto(URL.createObjectURL(arquivo))
    }
  }

  useEffect(() => {
    function handleClickFora(e) {
      if (setoresRef.current && !setoresRef.current.contains(e.target)) {
        setAbrirSetores(false)
      }
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [])

  function toggleSetor(setor) {
    const selecionado = form.setores.includes(setor)
    updateField(
      'setores',
      selecionado ? form.setores.filter((s) => s !== setor) : [...form.setores, setor]
    )
  }

  function updateField(campo, valor) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-xl max-w-6xl mx-auto w-full">
          <div className="flex items-center gap-xs text-on-surface-variant mb-md">
            <span className="font-label-md text-label-md">Configurações</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a href="/usuario" className="font-label-md text-label-md hover:text-primary transition-colors">Usuários</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">Novo Usuário</span>
          </div>

          <div className="flex flex-col gap-md mb-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface mb-xs">Cadastro de Usuário</h2>
              <p className="text-body-lg font-body-lg text-on-surface-variant">Preencha os dados abaixo para adicionar um novo membro à plataforma.</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-xl">
            <div className="col-span-12 lg:col-span-8">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
                <h3 className="font-title-lg text-title-lg text-on-surface mb-lg pb-md border-b border-outline-variant">Informações Pessoais</h3>
                <form className="grid grid-cols-2 gap-lg" onSubmit={(e) => e.preventDefault()}>
                  <div className="col-span-2">
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-xs" htmlFor="nome">Nome Completo</label>
                    <input
                      className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      id="nome"
                      value={form.nome}
                      onChange={(e) => updateField('nome', e.target.value)}
                      placeholder="Ex: João da Silva"
                      type="text"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-xs" htmlFor="email">E-mail Corporativo</label>
                    <input
                      className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      id="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="joao@empresa.com"
                      type="email"
                    />
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-xs" htmlFor="senha">Senha Temporária</label>
                    <div className="relative">
                      <input
                        className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                        id="senha"
                        value={form.senha}
                        onChange={(e) => updateField('senha', e.target.value)}
                        placeholder="••••••••"
                        type={mostrarSenha ? 'text' : 'password'}
                      />
                      <button
                        type="button"
                        onClick={() => setMostrarSenha(!mostrarSenha)}
                        className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant cursor-pointer"
                      >
                        {mostrarSenha ? 'visibility_off' : 'visibility'}
                      </button>
                    </div>
                  </div>
                  <div ref={setoresRef} className="col-span-2 md:col-span-1 relative">
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-xs">Setores</label>
                    <div
                      onClick={() => setAbrirSetores(!abrirSetores)}
                      className="w-full min-h-[52px] flex flex-wrap items-center gap-sm p-md border border-outline-variant rounded-xl bg-surface-container-lowest cursor-pointer focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all"
                    >
                      {form.setores.length === 0 ? (
                        <span className="text-body-md font-body-md text-on-surface-variant">Selecione um ou mais setores</span>
                      ) : (
                        form.setores.map((setor) => (
                          <span key={setor} className="flex items-center gap-xs px-md py-xs rounded-full bg-primary text-on-primary text-label-md font-label-md">
                            {setor}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleSetor(setor)
                              }}
                              className="material-symbols-outlined text-sm cursor-pointer hover:opacity-80"
                            >
                              close
                            </button>
                          </span>
                        ))
                      )}
                      <span className={`material-symbols-outlined ml-auto text-on-surface-variant transition-transform ${abrirSetores ? 'rotate-180' : ''}`}>expand_more</span>
                    </div>
                    {abrirSetores && (
                      <div className="absolute z-10 w-full mt-xs bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden">
                        {setores.map((setor) => {
                          const selecionado = form.setores.includes(setor)
                          return (
                            <button
                              type="button"
                              key={setor}
                              onClick={() => {
                                toggleSetor(setor)
                              }}
                              className={`w-full flex items-center gap-sm px-md py-sm text-left text-body-md font-body-md hover:bg-surface-container-high transition-colors cursor-pointer ${
                                selecionado ? 'text-primary' : 'text-on-surface'
                              }`}
                            >
                              <span className="material-symbols-outlined text-sm">
                                {selecionado ? 'check_box' : 'check_box_outline_blank'}
                              </span>
                              {setor}
                            </button>
                          )
                        })}
                      </div>
                    )}
                  </div>
                  <div className="col-span-2 md:col-span-1">
                    <label className="block text-label-md font-label-md text-on-surface-variant mb-xs" htmlFor="permissao">Nível de Permissão</label>
                    <select
                      className="w-full p-md border border-outline-variant rounded-xl text-body-md font-body-md appearance-none bg-surface-container-lowest focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                      id="permissao"
                      value={form.permissao}
                      onChange={(e) => updateField('permissao', e.target.value)}
                    >
                      <option disabled value="">Selecione a permissão</option>
                      {permissoes.map((permissao) => (
                        <option key={permissao} value={permissao}>{permissao}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2 mt-md">
                    <label className="flex items-center gap-sm cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.boasVindas}
                        onChange={(e) => updateField('boasVindas', e.target.checked)}
                        className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20"
                      />
                      <span className="text-body-md font-body-md text-on-surface-variant group-hover:text-on-surface transition-colors">
                        Enviar e-mail de boas-vindas com instruções de acesso
                      </span>
                    </label>
                  </div>
                </form>
                <div className="flex justify-end gap-md mt-lg pt-lg border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => navigate('/usuario')}
                    className="px-lg py-sm rounded-xl font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-high transition-colors active:scale-95 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/usuario')}
                    className="px-xl py-sm rounded-xl font-label-md text-label-md bg-primary text-on-primary shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Salvar Usuário
                  </button>
                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm flex flex-col items-center text-center">
                <div className="relative mb-md">
                  <button
                    type="button"
                    onClick={abrirSeletorFoto}
                    className="w-24 h-24 rounded-full bg-surface-container-high flex items-center justify-center overflow-hidden border-2 border-primary-fixed hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    {foto ? (
                      <img src={foto} alt="Foto do usuário" className="w-full h-full object-cover" />
                    ) : (
                      <span className="material-symbols-outlined text-outline text-4xl">person</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={abrirSeletorFoto}
                    className="absolute bottom-0 right-0 p-xs bg-primary text-on-primary rounded-full shadow-md border-2 border-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">photo_camera</span>
                  </button>
                  <input
                    ref={fotoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,image/bmp"
                    onChange={onFotoSelecionada}
                    className="hidden"
                  />
                </div>
                <h4 className="font-title-lg text-title-lg text-on-surface">{form.nome || 'Novo Usuário'}</h4>
                <p className="text-label-md font-label-md text-primary bg-primary-container/20 px-md py-xs rounded-full mt-xs">{form.permissao || 'Aguardando definição'}</p>
                <div className="w-full mt-lg pt-lg border-t border-outline-variant flex flex-col gap-sm">
                  <div className="flex items-center gap-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">mail</span>
                    <span className="text-label-md font-label-md">{form.email || 'E-mail não definido'}</span>
                  </div>
                  <div className="flex items-center gap-sm text-on-surface-variant">
                    <span className="material-symbols-outlined text-sm">corporate_fare</span>
                    <span className="text-label-md font-label-md">{form.setores.length > 0 ? form.setores.join(', ') : 'Setor não definido'}</span>
                  </div>
                </div>
              </div>

              <div className="bg-primary-container text-on-primary-container rounded-xl p-lg border border-primary/20">
                <div className="flex items-center gap-sm mb-sm">
                  <span className="material-symbols-outlined text-on-primary-container">info</span>
                  <h4 className="font-title-lg text-title-lg text-on-primary-container font-bold">Diretrizes de Acesso</h4>
                </div>
                <ul className="text-body-md font-body-md space-y-md opacity-90">
                  <li className="flex gap-sm">
                    <span className="material-symbols-outlined text-sm mt-1">check_circle</span>
                    <span>Administradores têm acesso total ao sistema e configurações globais.</span>
                  </li>
                  <li className="flex gap-sm">
                    <span className="material-symbols-outlined text-sm mt-1">check_circle</span>
                    <span>Agentes podem gerenciar chamados em seus respectivos setores.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
