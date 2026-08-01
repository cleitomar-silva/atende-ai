import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Erro ao fazer login')
      }

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

            <div className="space-y-sm">
              <button className="w-full flex items-center justify-center gap-md py-md border border-outline-variant rounded-lg bg-white font-body-md font-medium text-on-surface shadow-sm hover:bg-surface-container-low hover:shadow transition-all duration-200">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                </svg>
                Entrar com Google
              </button>
              {/*
              <button className="w-full flex items-center justify-center gap-md py-md border border-outline-variant rounded-lg font-body-md text-on-surface hover:bg-surface-container-low transition-all duration-200">
                <span className="material-symbols-outlined text-[20px] text-outline">corporate_fare</span>
                SSO Corporativo
              </button> */}
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
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            Segurança
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            Privacidade
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            Termos de Uso
          </a>
          <a className="font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors" href="#">
            Status
          </a>
        </nav>
      </footer>
    </div>
  )
}
