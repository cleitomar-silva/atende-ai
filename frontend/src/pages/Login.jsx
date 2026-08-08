import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login({ email, password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-md overflow-x-hidden">
      <main className="relative z-10 flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        <div className="w-full max-w-[440px]">
          <div className="flex flex-col items-center mb-xl">
            <div className="mb-md flex items-center justify-center p-sm bg-primary-container rounded-xl shadow-lg">
              <span className="material-symbols-outlined text-on-primary-container text-[40px]">support_agent</span>
            </div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary tracking-tight">AtendeAí</h1>
            <p className="text-on-surface-variant font-body-md mt-xs">Gerenciamento de Serviços Corporativos</p>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant shadow-sm rounded-xl p-lg md:p-xl">
            <div className="mb-lg">
              <h2 className="font-title-lg text-title-lg text-on-surface mb-xs">Acesse sua conta</h2>
              <p className="text-on-surface-variant font-body-md">Use suas credenciais corporativas para entrar.</p>
            </div>

            <form className="space-y-md" onSubmit={handleSubmit}>
              <div className="space-y-base">
                <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="email">
                  E-mail corporativo
                </label>
                <div className="relative flex items-center focus-ring rounded-lg overflow-hidden border border-outline-variant hover:border-outline transition-colors">
                  <span className="material-symbols-outlined absolute left-md text-outline">mail</span>
                  <input
                    className="w-full pl-12 pr-md py-md bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline font-body-md"
                    id="email"
                    name="email"
                    placeholder="nome@empresa.com.br"
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-base">
                <div className="flex justify-between items-center">
                  <label className="font-label-md text-label-md text-on-surface-variant" htmlFor="password">
                    Senha
                  </label>
                  <a className="font-label-md text-label-md text-primary hover:underline transition-all" href="#">
                    Esqueci minha senha
                  </a>
                </div>
                <div className="relative flex items-center focus-ring rounded-lg overflow-hidden border border-outline-variant hover:border-outline transition-colors">
                  <span className="material-symbols-outlined absolute left-md text-outline">lock</span>
                  <input
                    className="w-full pl-12 pr-md py-md bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-outline font-body-md"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    className="absolute right-md text-outline hover:text-on-surface transition-colors cursor-pointer"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                  >
                    <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-md py-sm bg-error-container text-on-error-container rounded-lg font-body-md">
                  {error}
                </div>
              )}

              <button
                className="w-full bg-primary text-on-primary font-title-lg text-title-lg py-md rounded-lg shadow-sm hover:bg-surface-tint active:opacity-80 transition-all duration-200 flex items-center justify-center gap-sm disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Entrando…' : 'Entrar'}
                {!loading && <span className="material-symbols-outlined text-[20px]">arrow_forward</span>}
              </button>
            </form>

            <div className="relative my-xl">
              <div aria-hidden="true" className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-outline-variant"></div>
              </div>
              <div className="relative flex justify-center text-label-md">
                <span className="px-md bg-surface-container-lowest text-on-surface-variant font-label-md">OU</span>
              </div>
            </div>

            <div className="mt-sm">
              <Link
                to="/register"
                className="block w-full text-center py-md rounded-lg border border-primary text-primary font-body-md font-semibold hover:bg-primary/5 transition-all duration-200"
              >
                Criar uma conta
              </Link>
            </div>
          </div>

          <p className="text-center mt-lg font-body-md text-on-surface-variant">
            Não tem acesso? <a className="text-primary font-semibold hover:underline" href="#">Solicite suporte</a>
          </p>
        </div>
      </main>

      <footer className="bg-surface dark:bg-surface-container-lowest border-t border-outline-variant flex flex-col md:flex-row justify-between items-center w-full px-margin-desktop py-lg gap-md relative z-10">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-headline-sm text-headline-sm text-on-surface">AtendeAí</span>
          <p className="font-body-md text-body-md text-secondary dark:text-secondary-fixed-dim mt-xs">
            © 2026 AtendeAí Gerenciamento de Serviços Corporativos. Todos os direitos reservados.
          </p>
        </div>
        <nav className="flex gap-lg">
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Segurança</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Privacidade</a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">Termos de Uso</a>
        </nav>
      </footer>
    </div>
  )
}