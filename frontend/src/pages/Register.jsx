import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { apiPost } from '../services/api'

const STEPS = ['Empresa', 'Setor', 'Usuário']

function formatCnpj(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\/\d{4})(\d)/, '$1-$2')
}

const inputClass =
  'w-full bg-transparent border border-outline-variant rounded-lg px-md py-md text-body-md text-on-surface placeholder:text-outline focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [companyId, setCompanyId] = useState(null)
  const [sectorId, setSectorId] = useState(null)

  const [company, setCompany] = useState({ name: '', cnpj: '' })
  const [sector, setSector] = useState({ name: '' })
  const [user, setUser] = useState({ name: '', email: '', password: '' })

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (step === 1) {
        if (!company.name.trim() || !company.cnpj.trim()) {
          setError('Preencha o nome da empresa e o CNPJ.')
          return
        }
        const data = await apiPost('/register/company', { company_name: company.name, cnpj: company.cnpj })
        setCompanyId(data.company.id)
        setStep(2)
      } else if (step === 2) {
        if (!sector.name.trim()) {
          setError('Informe o nome do setor.')
          return
        }
        const data = await apiPost('/register/sector', { company_id: companyId, name: sector.name })
        setSectorId(data.sector.id)
        setStep(3)
      } else if (step === 3) {
        if (!user.name.trim() || !user.email.trim() || !user.password) {
          setError('Preencha todos os dados do usuário.')
          return
        }
        await apiPost('/register/user', {
          company_id: companyId,
          sector_id: sectorId,
          name: user.name,
          email: user.email,
          password: user.password,
        })
        await login({ email: user.email, password: user.password })
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Erro ao concluir o cadastro.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md">
      <main className="flex-grow flex items-center justify-center px-4 py-xl">
        <div className="w-full max-w-[460px]">
          <div className="flex flex-col items-center mb-lg">
            <div className="mb-sm flex items-center justify-center p-sm bg-primary-container rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-on-primary-container text-[40px]">support_agent</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">Abrir conta</h1>
            <p className="text-on-surface-variant font-body-md mt-xs">Cadastre-se em três etapas simples.</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-lg md:p-xl">
            <div className="flex items-center justify-between mb-lg">
              {STEPS.map((label, i) => {
                const idx = i + 1
                const done = idx < step
                const active = idx === step
                return (
                  <div key={label} className="flex items-center gap-1 flex-1">
                    <div className="flex items-center gap-sm">
                      <span
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-label-md font-bold ${
                          done
                            ? 'bg-primary text-on-primary'
                            : active
                              ? 'bg-primary-container text-on-primary-container'
                              : 'bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {done ? <span className="material-symbols-outlined text-[14px]">check</span> : idx}
                      </span>
                      <span className={`text-label-md hidden sm:inline ${active ? 'font-semibold text-primary' : 'text-on-surface-variant'}`}>
                        {label}
                      </span>
                    </div>
                    {idx < STEPS.length && <div className={`flex-1 h-0.5 mx-sm ${idx < step ? 'bg-primary' : 'bg-outline-variant'}`}></div>}
                  </div>
                )
              })}
            </div>

            {error && (
              <div className="mb-md px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-md">
              {step === 1 && (
                <>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="company_name">
                      Nome da Empresa <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="company_name"
                      placeholder="Ex.: Empresa Exemplo LTDA"
                      value={company.name}
                      onChange={(e) => setCompany((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="cnpj">
                      CNPJ <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="cnpj"
                      placeholder="00.000.000/0000-00"
                      value={formatCnpj(company.cnpj)}
                      onChange={(e) => setCompany((p) => ({ ...p, cnpj: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {step === 2 && (
                <div className="space-y-base">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="sector_name">
                    Nome do Setor <span className="text-error">*</span>
                  </label>
                  <input
                    className={inputClass}
                    id="sector_name"
                    placeholder="Ex.: TI, Financeiro, RH"
                    value={sector.name}
                    onChange={(e) => setSector((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
              )}

              {step === 3 && (
                <>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="user_name">
                      Nome completo <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="user_name"
                      placeholder="Seu nome"
                      value={user.name}
                      onChange={(e) => setUser((p) => ({ ...p, name: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="user_email">
                      E-mail <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="user_email"
                      type="email"
                      placeholder="voce@empresa.com.br"
                      value={user.email}
                      onChange={(e) => setUser((p) => ({ ...p, email: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-base">
                    <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="user_password">
                      Senha <span className="text-error">*</span>
                    </label>
                    <input
                      className={inputClass}
                      id="user_password"
                      type="password"
                      placeholder="Mínimo 6 caracteres"
                      value={user.password}
                      onChange={(e) => setUser((p) => ({ ...p, password: e.target.value }))}
                    />
                  </div>
                  <p className="text-label-md text-on-surface-variant">
                    O primeiro usuário é cadastrado como <strong>Administrador</strong> da empresa.
                  </p>
                </>
              )}

              <div className="mt-lg flex items-center justify-between gap-md">
                <button
                  type="button"
                  className="px-md py-md rounded-lg text-on-surface-variant font-label-md hover:bg-surface-container-low transition-colors disabled:opacity-50"
                  disabled={step === 1}
                  onClick={() => setStep((s) => s - 1)}
                >
                  Voltar
                </button>
                <button
                  type="submit"
                  className="px-md py-md rounded-lg bg-primary text-on-primary font-label-md hover:bg-surface-tint transition-all disabled:opacity-60 flex items-center gap-sm"
                  disabled={loading}
                >
                  {loading ? 'Processando…' : step === 3 ? 'Finalizar' : 'Continuar'}
                  {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                </button>
              </div>
            </form>
          </div>

          <p className="text-center mt-lg font-body-md text-on-surface-variant">
            Já possui conta? <Link className="text-primary font-semibold hover:underline" to="/login">Entrar</Link>
          </p>
        </div>
      </main>
    </div>
  )
}