import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/Protected.jsx'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Empresa from './pages/Empresa.jsx'
import Setor from './pages/Setor.jsx'
import Usuario from './pages/Usuario.jsx'
import Grupo from './pages/Grupo.jsx'
import Categoria from './pages/Categoria.jsx'
import Classificacao from './pages/Classificacao.jsx'
import Situacao from './pages/Situacao.jsx'
import Chamados from './pages/Chamados.jsx'
import MeusChamados from './pages/MeusChamados.jsx'
import Relatorios from './pages/Relatorios.jsx'
import Indicadores from './pages/Indicadores.jsx'
import MeuPerfil from './pages/MeuPerfil.jsx'
import Operacoes from './pages/Operacoes.jsx'
import CadastroChamado from './pages/CadastroChamado.jsx'
import VisualizarChamado from './pages/VisualizarChamado.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/meu-perfil" element={<ProtectedRoute><MeuPerfil /></ProtectedRoute>} />

        <Route path="/chamados" element={<ProtectedRoute><Chamados /></ProtectedRoute>} />
        <Route path="/meus-chamados" element={<ProtectedRoute><MeusChamados /></ProtectedRoute>} />
        <Route path="/chamados/novo" element={<ProtectedRoute><CadastroChamado /></ProtectedRoute>} />
        <Route path="/chamados/:id" element={<ProtectedRoute><VisualizarChamado /></ProtectedRoute>} />

        <Route path="/relatorios" element={<ProtectedRoute><Relatorios /></ProtectedRoute>} />
        <Route path="/indicadores" element={<ProtectedRoute><Indicadores /></ProtectedRoute>} />

        <Route path="/empresa" element={<ProtectedRoute><Empresa /></ProtectedRoute>} />
        <Route path="/setor" element={<AdminRoute><Setor /></AdminRoute>} />
        <Route path="/usuario" element={<AdminRoute><Usuario /></AdminRoute>} />
        <Route path="/grupo" element={<AdminRoute><Grupo /></AdminRoute>} />
        <Route path="/categoria" element={<AdminRoute><Categoria /></AdminRoute>} />
        <Route path="/classificacao" element={<AdminRoute><Classificacao /></AdminRoute>} />
        <Route path="/situacao" element={<AdminRoute><Situacao /></AdminRoute>} />
        <Route path="/operacoes" element={<AdminRoute><Operacoes /></AdminRoute>} />
      </Routes>
    </BrowserRouter>
  )
}