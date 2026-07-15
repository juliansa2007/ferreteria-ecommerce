import Tienda from './pages/Tienda'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Carrito from './pages/Carrito'
import Checkout from './pages/Checkout'
import Confirmacion from './pages/Confirmacion'
import MisOrdenes from './pages/MisOrdenes'
import DashboardAdmin from './pages/DashboardAdmin'
import AdminProductos from './pages/AdminProductos'

function Home() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('usuario')
    window.location.href = '/'
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">🏗️ Ferretería E-Commerce</h1>
      {usuario ? (
        <div className="mt-4">
          <p className="text-lg">¡Bienvenido, {usuario.correo}!</p>
          <a href="/tienda" className="text-blue-600 hover:underline mr-4">
            Ir a Tienda
          </a>
          <button
            onClick={handleLogout}
            className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <div className="mt-4">
          <p className="text-lg">Inicia sesión para continuar</p>
          <a href="/login" className="text-blue-600 hover:underline">
            Ir a Login
          </a>
        </div>
      )}
    </div>
  )
}

function App() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null')
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <nav className="max-w-7xl mx-auto px-4 py-4">
            <a href="/" className="text-2xl font-bold text-blue-600">
              🏗️ Kratos
            </a>
            <div className="flex gap-4">
  <a href="/tienda" className="text-blue-600 hover:underline">Tienda</a>
  <a href="/carrito" className="text-blue-600 hover:underline">🛒 Carrito</a>
  <a href="/mis-ordenes" className="text-blue-600 hover:underline">Mis Órdenes</a>
  {usuario?.rol === 'admin' && (
  <div className="flex gap-2">
    <a href="/dashboard-admin" className="text-red-600 hover:underline font-bold">
      🔧 Órdenes
    </a>
    <a href="/admin-productos" className="text-red-600 hover:underline font-bold">
      📦 Productos
    </a>
  </div>
)}
</div>
          </nav>
        </header>

        <main className="max-w-7xl mx-auto">

          <Routes>
  <Route path="/" element={<Home />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/tienda" element={<Tienda />} />
  <Route path="/carrito" element={<Carrito />} />
  <Route path="/checkout" element={<Checkout />} />
  <Route path="/confirmacion/:numeroOrden" element={<Confirmacion />} />
  <Route path="/mis-ordenes" element={<MisOrdenes />} />
  <Route path="/dashboard-admin" element={<DashboardAdmin />} />s
  <Route path="/admin-productos" element={<AdminProductos />} />
</Routes>
        </main>

        <footer className="bg-gray-800 text-white mt-12 py-8 text-center">
          <p>&copy; 2026 Ferretería Kratos</p>
        </footer>
      </div>
    </Router>
  )
}

export default App