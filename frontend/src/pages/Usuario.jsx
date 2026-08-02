import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SideNav from '../components/dashboard/SideNav.jsx'
import TopBar from '../components/dashboard/TopBar.jsx'

const usuarios = [
  {
    id: 1,
    nome: 'Carlos Oliveira',
    status: 'Online',
    statusCor: 'text-green-600',
    email: 'carlos.oliveira@atendeai.com',
    setor: 'Tecnologia',
    permissao: 'Administrador',
    permissaoCor: 'bg-primary/10 text-primary',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgPkPPdmqgV5baUS0vG_Ul0aqR6eG7aU8UgjY0-W68L4D4S5tRBFVLmJ-vBXvzxieKyX9YFP-ShPE9YAbePttMjua32IiZPKpzXYapWEnUIObQwArNaCyge4eFzxy2NU5-G_qN4Esp-fzXay4ipsPxfjbmT6UvCYOqSld0Snvq19S-YMWVx53ldij5f-GUvMX7VHkwDath9jj3EiMKXwH2Is44lysRo287IDziBrCnW5GCp7LIMqMeIg',
  },
  {
    id: 2,
    nome: 'Beatriz Santos',
    status: 'Ausente',
    statusCor: 'text-on-surface-variant opacity-60',
    email: 'beatriz.santos@atendeai.com',
    setor: 'Financeiro',
    permissao: 'Operador',
    permissaoCor: 'bg-secondary/10 text-secondary',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCK6QyOxZiwb2oaXEoHfoSNfJc6I0i3gFlzk9p3it90p-YNK-HxJYPQp-3Z4z7XlrRWKoBY4ZI4mPZO2UNKVj695lOiGkyrr7bDm8hTcwNtHtkiufUFXBqUY1bw76xDBkUXEXWELl6rpYwfgINMG0gTk5qP6CAfTVpWrYe4-Pxe595O0MH8n27lOZIyJ7D_oHGVI-LyYMMKvfaSD_V0uq0L1fLjQBcSOL1DWho0JcQM485i-2yVbWjgxw',
  },
  {
    id: 3,
    nome: 'Ricardo Mello',
    status: 'Online',
    statusCor: 'text-green-600',
    email: 'ricardo.mello@atendeai.com',
    setor: 'Atendimento',
    permissao: 'Operador',
    permissaoCor: 'bg-tertiary/10 text-tertiary',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7qIM60X4fqNQVlWE6mXocaiJr5zKIUP8oZE4-gnzKbrohn0B9Wkn6Sg1xjbJuhXecLB221zkoQ5x8LCPX6Iu1u7rvIV5HGqahuNkhU12mgUXmpDvmk9PjbjvNp-VER9BPmMkqX4pBW671ivVd0RVqDwJBZF-XaOw7z6dw4JD2d0XxaSmGV_q8DGm05h3KgIZTCDSVEJTjbP4Tr5ZgINhh-8MpjVIy0sTM2igud2kg1G6EwWvQuOJS8w',
  },
  {
    id: 4,
    nome: 'Juliana Wong',
    status: 'Offline',
    statusCor: 'text-red-600',
    email: 'juliana.wong@atendeai.com',
    setor: 'Marketing',
    permissao: 'Visualizador',
    permissaoCor: 'bg-outline/10 text-outline',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYASXipPKhRRQVv5h6sk0kEk6QEZ131ugMNxild9u-Pk2tb2bUVsSC6RgG7eSwp79HOereGfxcfG-0cH3SdmzqQdbc2o24moeuH8-S15o04ukrE5mi3g6OhdHGbBm7bzfVWM5RbiMLu0_MSHBNKvPXcNq69u2SmKpfGHbStumbE2T2dQkfJqKUjYJ8xTevk_BgCw5jfzYU6VA5hplNEd_ankVFQnPTSWz9cVfQHZt6jgeu4pDF7Zl7Zg',
  },
]

export default function Usuario() {
  const [termo, setTermo] = useState('')
  const [setor, setSetor] = useState('')
  const [permissao, setPermissao] = useState('')
  const [selecionado, setSelecionado] = useState(null)
  const navigate = useNavigate()

  const filtradas = usuarios.filter((usuario) => {
    const matchesTermo = `${usuario.nome} ${usuario.email}`.toLowerCase().includes(termo.toLowerCase())
    const matchesSetor = setor === '' || usuario.setor === setor
    const matchesPermissao = permissao === '' || usuario.permissao === permissao
    return matchesTermo && matchesSetor && matchesPermissao
  })

  return (
    <div className="bg-background text-on-background">
      <SideNav />
      <div className="ml-64 flex flex-col min-h-screen">
        <TopBar />
        <main className="p-lg flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
            <div>
              <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-sm">
                <span className="material-symbols-outlined text-primary">group</span>
                Gestão de Usuários
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Visualize, adicione e gerencie as permissões de acesso da sua equipe.</p>
            </div>
            <button
              onClick={() => navigate('/usuario/cadastro')}
              className="bg-primary text-on-primary font-title-lg text-title-lg px-lg py-sm rounded-lg flex items-center gap-md shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span className="material-symbols-outlined">person_add</span>
              Novo Usuário
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xl">
            <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Total de Usuários</p>
              <div className="flex items-baseline gap-sm">
                <span className="text-headline-md font-headline-md">1.284</span>
                <span className="text-[12px] text-green-600 font-bold">+12%</span>
              </div>
            </div>
            <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Ativos Agora</p>
              <div className="flex items-baseline gap-sm">
                <span className="text-headline-md font-headline-md">452</span>
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              </div>
            </div>
            <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">Aguardando Aprovação</p>
              <div className="flex items-baseline gap-sm">
                <span className="text-headline-md font-headline-md">7</span>
                <span className="text-[12px] text-tertiary font-bold">Urgente</span>
              </div>
            </div>
            <div className="bg-white border border-outline-variant p-md rounded-xl shadow-sm">
              <p className="text-label-md font-label-md text-on-surface-variant mb-xs">SLA Médio Equipe</p>
              <div className="flex items-baseline gap-sm">
                <span className="text-headline-md font-headline-md">98.2%</span>
                <span className="material-symbols-outlined text-primary text-sm">verified</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl shadow-sm mb-lg">
            <div className="p-md flex flex-wrap items-center gap-md">
              <div className="relative flex-1 min-w-[280px]">
                <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline">search</span>
                <input
                  type="text"
                  value={termo}
                  onChange={(e) => setTermo(e.target.value)}
                  className="w-full pl-14 pr-md py-sm border border-outline-variant rounded-lg font-body-md text-body-md focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all"
                  placeholder="Buscar por nome, e-mail ou CPF..."
                />
              </div>
              <div className="flex items-center gap-sm">
                <select
                  value={setor}
                  onChange={(e) => setSetor(e.target.value)}
                  className="pl-md pr-xl py-sm border border-outline-variant rounded-lg font-body-md text-body-md bg-surface-container-lowest focus:border-primary focus:outline-none"
                >
                  <option value="">Todos os Setores</option>
                  <option>Tecnologia</option>
                  <option>Financeiro</option>
                  <option>Atendimento</option>
                  <option>Marketing</option>
                </select>
                <select
                  value={permissao}
                  onChange={(e) => setPermissao(e.target.value)}
                  className="pl-md pr-xl py-sm border border-outline-variant rounded-lg font-body-md text-body-md bg-surface-container-lowest focus:border-primary focus:outline-none"
                >
                  <option value="">Todas as Permissões</option>
                  <option>Administrador</option>
                  <option>Operador</option>
                  <option>Visualizador</option>
                </select>
                <button className="flex items-center gap-xs px-md py-sm text-secondary font-label-md text-label-md border border-outline-variant rounded-lg hover:bg-surface-container-low transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                  Mais Filtros
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-outline-variant rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead className="bg-surface-container-low border-b-2 border-outline-variant">
                  <tr>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Usuário</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">E-mail</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Setor</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Permissão</th>
                    <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase tracking-wider text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filtradas.map((usuario) => (
                    <tr
                      key={usuario.id}
                      onClick={() => setSelecionado(selecionado === usuario.id ? null : usuario.id)}
                      className={`transition-colors group cursor-pointer ${
                        selecionado === usuario.id ? 'ring-1 ring-primary bg-primary/5' : 'hover:bg-surface-container-low'
                      }`}
                    >
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <img className="w-10 h-10 rounded-full object-cover" alt={`Avatar de ${usuario.nome}`} src={usuario.avatar} />
                          <div>
                            <p className="font-body-lg text-body-lg font-bold">{usuario.nome}</p>
                            <p className={`text-[11px] font-bold uppercase ${usuario.statusCor}`}>{usuario.status}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{usuario.email}</td>
                      <td className="px-lg py-md font-body-md text-body-md text-on-surface-variant">{usuario.setor}</td>
                      <td className="px-lg py-md">
                        <span className={`px-sm py-[2px] rounded-full font-label-md text-label-md font-bold ${usuario.permissaoCor}`}>{usuario.permissao}</span>
                      </td>
                      <td className="px-lg py-md text-right">
                          <div className="flex items-center justify-end gap-sm">
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-primary hover:bg-primary/10 transition-colors" title="Editar">
                              <span className="material-symbols-outlined">edit</span>
                            </button>
                            <button className="w-8 h-8 rounded-full flex items-center justify-center text-error hover:bg-error/10 transition-colors" title="Excluir">
                              <span className="material-symbols-outlined">delete</span>
                            </button>
                          </div>
                      </td>
                    </tr>
                  ))}
                  {filtradas.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-lg py-md text-center font-body-md text-on-surface-variant">
                        Nenhum usuário encontrado.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-md flex justify-between items-center bg-surface-container-low/30 border-t border-outline-variant">
              <span className="font-label-md text-label-md text-on-surface-variant">Mostrando {filtradas.length} de 1.284 usuários</span>
              <div className="flex gap-xs">
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 rounded-lg bg-primary text-on-primary font-label-md">1</button>
                <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">2</button>
                <button className="w-10 h-10 rounded-lg border border-outline-variant hover:bg-surface-container-high font-label-md">3</button>
                <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant hover:bg-surface-container-high">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-xl">
            <h3 className="font-title-lg text-title-lg mb-md">Atividades Recentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
              <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex gap-md items-start">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">person_add</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md"><strong>Ana Silva</strong> adicionou <strong>Juliana Wong</strong> como Visualizador.</p>
                  <p className="text-[12px] text-on-surface-variant">Há 15 minutos</p>
                </div>
              </div>
              <div className="bg-white p-md rounded-xl border border-outline-variant shadow-sm flex gap-md items-start">
                <div className="w-8 h-8 rounded-full bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[18px]">lock_reset</span>
                </div>
                <div>
                  <p className="font-body-md text-body-md"><strong>Ricardo Mello</strong> solicitou redefinição de senha.</p>
                  <p className="text-[12px] text-on-surface-variant">Há 2 horas</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
