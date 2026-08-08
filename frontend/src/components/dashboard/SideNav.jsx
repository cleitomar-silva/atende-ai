import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SideNav({ collapsed = false, onToggle }) {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const rootRef = useRef(null)
  const navigate = useNavigate()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  useEffect(() => {
    if (!settingsOpen) return
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [settingsOpen])

  const baseLink = 'flex items-center gap-3 px-md py-sm rounded-lg transition-colors duration-200 ease-in-out'
  const activeLink = 'bg-secondary-container text-on-secondary-container font-semibold'
  const idleLink = 'text-on-surface-variant hover:bg-surface-container-high'

  const collapsedLink = 'justify-center px-0'
  const linkClass = (isActive) => `${baseLink} ${isActive ? activeLink : idleLink} ${collapsed ? collapsedLink : ''}`

  const ADMIN_ITEMS = [
    { to: '/setor', label: 'Setores' },
    { to: '/usuario', label: 'Usuários' },
    { to: '/grupo', label: 'Grupos' },
    { to: '/categoria', label: 'Categorias' },
    { to: '/classificacao', label: 'Classificações' },
    { to: '/situacao', label: 'Situações' },
    { to: '/operacoes', label: 'Operações (Desfazer)' },
  ]

  return (
    <aside ref={rootRef} className="fixed left-0 top-0 bottom-0 flex z-50">
      {/* Menu principal */}
      <div
        className={`${
          collapsed ? 'w-16' : 'w-64'
        } h-full bg-surface-container-lowest border-r border-outline-variant shadow-sm flex flex-col py-md px-sm transition-all duration-200 ease-in-out`}
      >
        <div className="mb-xl flex items-center justify-between gap-sm px-sm">
          {!collapsed && (
            <div className="min-w-0 overflow-hidden">
              <h1 className="text-title-lg font-title-lg font-bold text-primary whitespace-nowrap">AtendeAí</h1>
              <p className="text-label-md font-label-md text-on-surface-variant opacity-70 whitespace-nowrap">Suporte Corporativo</p>
            </div>
          )}
          <button
            type="button"
            onClick={onToggle}
            className="shrink-0 p-1.5 rounded-lg text-on-surface-variant hover:bg-surface-container-high hover:text-primary transition-colors"
            title={collapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            <span className="material-symbols-outlined">{collapsed ? 'menu' : 'menu_open'}</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          <NavLink to="/dashboard" title={collapsed ? 'Painel de controle' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">dashboard</span>
            {!collapsed && <span className="font-body-md text-body-md">Painel de controle</span>}
          </NavLink>
          <NavLink to="/chamados" title={collapsed ? 'Chamados' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">confirmation_number</span>
            {!collapsed && <span className="font-body-md text-body-md">Chamados</span>}
          </NavLink>
          <NavLink to="/meus-chamados" title={collapsed ? 'Meus Chamados' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">assignment_ind</span>
            {!collapsed && <span className="font-body-md text-body-md">Meus Chamados</span>}
          </NavLink>
          <NavLink to="/relatorios" title={collapsed ? 'Relatórios' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">assessment</span>
            {!collapsed && <span className="font-body-md text-body-md">Relatórios</span>}
          </NavLink>
          <NavLink to="/indicadores" title={collapsed ? 'Indicadores' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">query_stats</span>
            {!collapsed && <span className="font-body-md text-body-md">Indicadores</span>}
          </NavLink>
          <NavLink to="/empresa" title={collapsed ? 'Empresa' : undefined} className={({ isActive }) => linkClass(isActive)}>
            <span className="material-symbols-outlined">corporate_fare</span>
            {!collapsed && <span className="font-body-md text-body-md">Empresa</span>}
          </NavLink>
          {isAdmin && (
            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              title={collapsed ? 'Configurações' : undefined}
              className={`w-full flex items-center gap-3 px-md py-sm rounded-lg transition-colors duration-200 ease-in-out ${
                settingsOpen ? 'bg-secondary-container text-on-secondary-container font-semibold' : 'text-on-surface-variant hover:bg-surface-container-high'
              } ${collapsed ? 'justify-center px-0' : ''}`}
            >
              <span className="material-symbols-outlined">settings</span>
              {!collapsed && (
                <>
                  <span className="font-body-md text-body-md">Configurações</span>
                  <span className={`material-symbols-outlined ml-auto text-body-md transition-transform duration-200 ${settingsOpen ? 'rotate-90' : ''}`}>
                    chevron_right
                  </span>
                </>
              )}
            </button>
          )}
        </nav>

        <div className="mt-auto pt-lg border-t border-outline-variant px-sm flex flex-col items-center gap-lg">
          <button
            onClick={() => navigate('/chamados/novo')}
            className="w-full bg-primary text-on-primary py-sm rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            title={collapsed ? 'Novo Chamado' : undefined}
          >
            <span className="material-symbols-outlined">add</span>
            {!collapsed && <span>Novo Chamado</span>}
          </button>
          <div className={`flex items-center gap-3 ${collapsed ? 'flex-col' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0">
              {(user?.name || 'U').charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <p className="text-body-md font-bold truncate">{user?.name || 'Usuário'}</p>
                <p className="text-label-md text-on-surface-variant truncate capitalize">{user?.role || ''}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submenu Configurações (bloco à altura da página, ao lado do menu principal) */}
      {isAdmin && settingsOpen && (
        <div className="w-64 h-full bg-surface-container-lowest border-r border-outline-variant shadow-sm overflow-y-auto custom-scrollbar py-md px-sm animate-fade-in">
          <div className="px-sm mb-md">
            <h2 className="text-title-lg font-title-lg font-bold text-on-surface">Configurações</h2>
            <p className="text-label-md font-label-md text-on-surface-variant opacity-70">Administração da empresa</p>
          </div>
          <nav className="space-y-1">
            {ADMIN_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => `${baseLink} ${isActive ? activeLink : idleLink}`}
              >
                <span className="font-body-md text-body-md">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </aside>
  )
}