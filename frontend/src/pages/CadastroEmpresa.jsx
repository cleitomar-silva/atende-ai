import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

export default function CadastroEmpresa() {
  const navigate = useNavigate()
  const [cnpj, setCnpj] = useState('')
  const [salvo, setSalvo] = useState(false)

  function formatarCnpj(value) {
    let digits = value.replace(/\D/g, '')
    if (digits.length > 14) digits = digits.slice(0, 14)

    if (digits.length > 12) {
      return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
    }
    if (digits.length > 8) {
      return digits.replace(/^(\d{2})(\d{3})(\d{3})(\d{1,4})$/, '$1.$2.$3/$4')
    }
    if (digits.length > 5) {
      return digits.replace(/^(\d{2})(\d{3})(\d{1,3})$/, '$1.$2.$3')
    }
    if (digits.length > 2) {
      return digits.replace(/^(\d{2})(\d{1,3})$/, '$1.$2')
    }
    return digits
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSalvo(true)
  }

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg space-y-lg">
          <div className="flex items-center gap-xs text-on-surface-variant mb-md">
            <span className="font-label-md text-label-md">Configurações</span>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <a href="/empresa" className="font-label-md text-label-md hover:text-primary transition-colors">Empresas</a>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="font-label-md text-label-md text-on-surface font-semibold">Nova Empresa</span>
          </div>

          <div className="mb-xl flex justify-between items-end">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface">Cadastro de Empresa</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Registre novas organizações parceiras no ecossistema do AtendeAí.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-lg flex-1 items-start">
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-xl">
              <div className="flex items-center gap-sm mb-lg border-b border-outline-variant pb-md">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>domain_add</span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface">Dados Corporativos</h2>
              </div>
              <form className="space-y-lg" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs" htmlFor="company_name">Nome da Empresa</label>
                    <input
                      className="w-full px-md py-md border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-body-md transition-colors placeholder:text-outline-variant focus:outline-none"
                      id="company_name"
                      name="company_name"
                      placeholder="Ex: TechSolutions Brasil S.A."
                      required
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs" htmlFor="cnpj">CNPJ</label>
                    <input
                      className="w-full px-md py-md border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-body-md transition-colors placeholder:text-outline-variant focus:outline-none"
                      id="cnpj"
                      name="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={cnpj}
                      onChange={(e) => setCnpj(formatarCnpj(e.target.value))}
                      required
                      type="text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mt-md">
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs">Segmento de Atuação</label>
                    <select className="w-full px-md py-md border border-outline-variant rounded-xl focus:border-primary focus:ring-0 text-body-md bg-white focus:outline-none">
                      <option>Tecnologia da Informação</option>
                      <option>Logística &amp; Transportes</option>
                      <option>Saúde &amp; Bem-estar</option>
                      <option>Educação</option>
                      <option>Outros</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-xs">
                    <label className="font-label-md text-label-md text-on-surface-variant px-xs">SLA Padrão</label>
                    <div className="flex gap-sm">
                      <label className="flex-1 cursor-pointer">
                        <input defaultChecked className="hidden peer" name="sla" type="radio" />
                        <div className="border border-outline p-sm rounded-xl text-center font-label-md text-label-md peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-container transition-all">Padrão</div>
                      </label>
                      <label className="flex-1 cursor-pointer">
                        <input className="hidden peer" name="sla" type="radio" />
                        <div className="border border-outline p-sm rounded-xl text-center font-label-md text-label-md peer-checked:bg-primary-container peer-checked:text-on-primary-container peer-checked:border-primary-container transition-all">Premium</div>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end items-center gap-md pt-xl mt-xl border-t border-outline-variant">
                  <button
                    type="button"
                    onClick={() => navigate('/empresa')}
                    className="px-lg py-sm rounded-xl font-label-md text-label-md text-secondary border border-outline-variant hover:bg-surface-container-high transition-colors active:scale-95 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-xl py-sm rounded-xl font-label-md text-label-md bg-primary text-on-primary shadow-sm hover:opacity-90 transition-all active:scale-95 flex items-center gap-sm"
                  >
                    <span className="material-symbols-outlined text-[20px]">check</span>
                    Salvar Empresa
                  </button>
                </div>
              </form>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
              <div className="bg-primary-container/10 border border-primary/20 rounded-xl p-lg relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-title-lg text-title-lg text-primary mb-sm">Dicas de Cadastro</h3>
                  <ul className="space-y-md">
                    <li className="flex gap-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      <p className="font-body-md text-body-md text-on-secondary-container">Verifique o CNPJ no portal da Receita Federal antes de confirmar.</p>
                    </li>
                    <li className="flex gap-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      <p className="font-body-md text-body-md text-on-secondary-container">O nome fantasia facilita a busca pelos operadores de suporte.</p>
                    </li>
                    <li className="flex gap-sm">
                      <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                      <p className="font-body-md text-body-md text-on-secondary-container">Defina o SLA correto para garantir o cumprimento dos prazos.</p>
                    </li>
                  </ul>
                </div>
                <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 text-primary rotate-12 select-none">info</span>
              </div>

              <div className="bg-surface-container border border-outline-variant rounded-xl p-lg">
                <div className="flex items-center justify-between mb-md">
                  <span className="font-label-md text-label-md text-on-surface-variant">Empresas Ativas</span>
                  <span className="material-symbols-outlined text-primary">trending_up</span>
                </div>
                <div className="flex items-end gap-sm">
                  <span className="font-display-lg text-display-lg text-on-surface leading-none">124</span>
                  <span className="text-tertiary font-label-md text-label-md mb-xs">+4 este mês</span>
                </div>
              </div>

              <div className="h-48 rounded-xl overflow-hidden relative border border-outline-variant group">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAdoGG9E0BHyRH437T_DAikvScUl1LA2cXAUhzHNmvlUkt2V2cPfWm5UDid_0pf6DA_lKq4Pn1tBgt0_B3yZIn09HOX-0_Dku5Fl4sh8OkSXStRk1oaU6YsjjajT_c1b4u8_hKwtYf3ekR-NtOZU_zeC5BSAAnRaGQxxTiEdf6Mtlq0OHJQPt65qF7i_mtcEsNdIDhsJPPWAt5OfIZIqkOUBJnPAQ9gHYGirhNQb1BS-lqCpknf1mz-2w')",
                  }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-lg">
                  <span className="font-title-lg text-title-lg text-on-primary">Suporte Premium</span>
                  <span className="font-body-md text-body-md text-primary-fixed">Gestão total de parcerias corporativas.</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {salvo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-inverse-surface/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-xl shadow-2xl flex flex-col items-center max-w-xs text-center border border-outline-variant">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-md">
              <span className="material-symbols-outlined text-primary text-[40px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-xs">Empresa Salva!</h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-lg">O cadastro foi realizado com sucesso em nosso banco de dados.</p>
            <button
              className="w-full bg-primary text-on-primary py-sm rounded-xl font-title-lg"
              onClick={() => navigate('/empresa')}
            >
              Concluído
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
