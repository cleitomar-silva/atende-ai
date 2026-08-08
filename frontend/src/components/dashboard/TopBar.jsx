import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiGet, apiPost, formatDate } from '../../services/api'

export default function TopBar() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [aberto, setAberto] = useState(false)
  const [perfilAberto, setPerfilAberto] = useState(false)
  const [notificacoes, setNotificacoes] = useState([])
  const [unread, setUnread] = useState(0)
  const [busca, setBusca] = useState('')
  const [resultados, setResultados] = useState([])
  const [buscando, setBuscando] = useState(false)
  const rootRef = useRef(null)
  const perfilRef = useRef(null)
  const buscaRef = useRef(null)
  const searchTimer = useRef(null)

  const carregarNotificacoes = () => {
    apiGet('/notifications')
      .then((data) => {
        const list = (data.notifications || []).map((n) => ({
          id: n.id,
          message: n.data?.message || 'Notificação',
          ticket_id: n.data?.ticket_id,
          read_at: n.read_at,
          created_at: n.created_at,
        }))
        setNotificacoes(list)
        setUnread(data.unread || 0)
      })
      .catch(() => {})
  }

  useEffect(() => {
    carregarNotificacoes()
    const interval = setInterval(carregarNotificacoes, 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!aberto) return
    function handleClickFora(e) {
      if (rootRef.current && !rootRef.current.contains(e.target)) setAberto(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [aberto])

  useEffect(() => {
    if (!perfilAberto) return
    function handleClickFora(e) {
      if (perfilRef.current && !perfilRef.current.contains(e.target)) setPerfilAberto(false)
    }
    document.addEventListener('mousedown', handleClickFora)
    return () => document.removeEventListener('mousedown', handleClickFora)
  }, [perfilAberto])

  useEffect(() => {
    if (busca.trim().length < 2) {
      setResultados([])
      return
    }

    clearTimeout(searchTimer.current)
    searchTimer.current = setTimeout(() => {
      setBuscando(true)
      apiGet('/search', { q: busca })
        .then((data) => setResultados(data.results || []))
        .catch(() => setResultados([]))
        .finally(() => setBuscando(false))
    }, 350)

    return () => clearTimeout(searchTimer.current)
  }, [busca])

  function marcarTodasLidas() {
    apiPost('/notifications/read-all').then(() => {
      setNotificacoes((prev) => prev.map((n) => ({ ...n, read_at: n.read_at || new Date().toISOString() })))
      setUnread(0)
    })
  }

  const hora = (value) => {
    if (!value) return ''
    const d = new Date(value)
    const diff = Date.now() - d.getTime()
    const min = Math.floor(diff / 60000)
    if (min < 1) return 'agora'
    if (min < 60) return `há ${min} min`
    const h = Math.floor(min / 60)
    if (h < 24) return `há ${h} h`
    return formatDate(value)
  }

  const handleLogout = async () => {
    setPerfilAberto(false)
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 w-full z-40 bg-surface border-b border-outline-variant flex justify-between items-center h-16 px-lg">
      <div className="flex items-center gap-xl w-1/2">
        <div className="relative w-full max-w-md" ref={buscaRef}>
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-full py-2 pl-10 pr-4 text-body-md focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Pesquisar chamados (nº, título, descrição, comentários)"
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onFocus={() => setResultados((prev) => prev)}
          />
          {busca.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-12 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
              {buscando && <p className="px-md py-sm text-label-md text-on-surface-variant">Buscando…</p>}
              {!buscando && resultados.length === 0 && (
                <p className="px-md py-sm text-label-md text-on-surface-variant">Nenhum chamado encontrado.</p>
              )}
              {resultados.map((r) => (
                <button
                  key={r.id}
                  onClick={() => {
                    setBusca('')
                    setResultados([])
                    navigate(`/chamados/${r.id}`)
                  }}
                  className="w-full flex items-center gap-md px-md py-sm text-left hover:bg-surface-container-low transition-colors border-b border-outline-variant last:border-b-0"
                >
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: r.situation_color || '#64748b' }}
                  ></span>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md font-bold text-on-surface truncate">
                      #{r.number} — {r.title}
                    </p>
                    <p className="text-label-md text-on-surface-variant truncate">
                      {r.status} · {r.requesting_sector || '—'} → {r.responsible_sector || '—'}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-md">
        <div className="relative" ref={rootRef}>
          <button
            onClick={() => setAberto((prev) => !prev)}
            className="p-2 text-on-surface-variant hover:text-primary transition-all duration-150 relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-error text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>

          {aberto && (
            <div className="absolute right-0 top-12 w-96 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50 animate-fade-in">
              <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
                <h4 className="font-title-lg text-title-lg text-on-surface">Notificações</h4>
                {unread > 0 && (
                  <button onClick={marcarTodasLidas} className="text-label-md text-primary hover:underline font-semibold">
                    Marcar todas como lidas
                  </button>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notificacoes.length === 0 && (
                  <p className="text-center text-body-md text-on-surface-variant py-lg">Nenhuma notificação.</p>
                )}
                {notificacoes.map((n) => {
                  const ehNova = !n.read_at
                  return (
                    <button
                      key={n.id}
                      onClick={() => {
                        setAberto(false)
                        if (n.ticket_id) navigate(`/chamados/${n.ticket_id}`)
                      }}
                      className={`w-full flex items-start gap-md px-md py-sm text-left hover:bg-surface-container-low transition-colors border-b border-outline-variant last:border-b-0 ${
                        ehNova ? 'bg-primary/5' : ''
                      }`}
                    >
                      <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[18px]">notifications_active</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-md">
                          <p className="font-body-md font-bold text-on-surface truncate">{n.message}</p>
                          {ehNova && <span className="w-2 h-2 rounded-full bg-primary shrink-0"></span>}
                        </div>
                        <p className="text-label-md text-on-surface-variant mt-0.5">{hora(n.created_at)}</p>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => {
                  setAberto(false)
                  navigate('/chamados')
                }}
                className="w-full py-md bg-surface-container-high hover:bg-surface-variant transition-colors text-center text-label-md text-primary font-bold"
              >
                Ver todos os chamados
              </button>
            </div>
          )}
        </div>
        <div className="h-8 w-[1px] bg-outline-variant mx-sm"></div>
        <div className="relative" ref={perfilRef}>
          <button
            onClick={() => setPerfilAberto((prev) => !prev)}
            className="flex items-center gap-2 p-1 pr-sm rounded-full hover:bg-surface-container-low transition-colors"
            title="Menu do perfil"
          >
            <div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            <span className="material-symbols-outlined text-on-surface-variant text-body-md">expand_more</span>
          </button>

          {perfilAberto && (
            <div className="absolute right-0 top-11 w-64 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-lg overflow-hidden z-50">
              <div className="p-md border-b border-outline-variant flex items-center gap-md">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold">
                  {(user?.name || 'U').charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-body-md font-bold text-on-surface truncate">{user?.name}</p>
                  <p className="text-label-md text-on-surface-variant truncate">{user?.email}</p>
                </div>
              </div>
              <div className="py-sm">
                <button
                  onClick={() => {
                    setPerfilAberto(false)
                    navigate('/meu-perfil')
                  }}
                  className="w-full flex items-center gap-md px-md py-sm text-left text-body-md text-on-surface hover:bg-surface-container-low transition-colors"
                >
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">person</span>
                  Meu Perfil
                </button>
              </div>
              <div className="py-sm border-t border-outline-variant">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-md px-md py-sm text-left text-body-md text-error hover:bg-error-container/20 transition-colors"
                >
                  <span className="material-symbols-outlined text-error text-[20px]">logout</span>
                  Sair
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}