import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setcontrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const respuesta = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { nombre, apellido, correo, contrasena }
      )

      // Guardar token en localStorage
      localStorage.setItem('token', respuesta.data.token)
      localStorage.setItem('usuario', JSON.stringify(respuesta.data.usuario))

      // Redirigir a home
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Registro</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Tu nombre"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Tu apellido"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">Correo</label>
            <input
              type="email"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2">contrasena</label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => setcontrasena(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder="Mínimo 7 caracteres"
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <a href="/login" className="text-blue-600 hover:underline">
            Entra aquí
          </a>
        </p>
      </div>
    </div>
  )
}