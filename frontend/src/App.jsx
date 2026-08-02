import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Empresa from './pages/Empresa.jsx'
import CadastroEmpresa from './pages/CadastroEmpresa.jsx'
import Setor from './pages/Setor.jsx'
import CadastroSetor from './pages/CadastroSetor.jsx'
import Usuario from './pages/Usuario.jsx'
import CadastroUsuario from './pages/CadastroUsuario.jsx'
import CadastroCategoria from './pages/CadastroCategoria.jsx'
import Categoria from './pages/Categoria.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
        <Route path="/setor" element={<Setor />} />
        <Route path="/setor/cadastro" element={<CadastroSetor />} />
        <Route path="/usuario" element={<Usuario />} />
        <Route path="/usuario/cadastro" element={<CadastroUsuario />} />
        <Route path="/categoria" element={<Categoria />} />
        <Route path="/categoria/cadastro" element={<CadastroCategoria />} />
      </Routes>
    </BrowserRouter>
  )
}
