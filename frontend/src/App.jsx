import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Empresa from './pages/Empresa.jsx'
import CadastroEmpresa from './pages/CadastroEmpresa.jsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/empresa" element={<Empresa />} />
        <Route path="/empresa/cadastro" element={<CadastroEmpresa />} />
      </Routes>
    </BrowserRouter>
  )
}
