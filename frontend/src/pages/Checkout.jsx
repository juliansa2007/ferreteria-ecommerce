import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCarritoStore } from '../store/carritoStore'
import axios from 'axios'

export default function Checkout() {
  const navigate = useNavigate()
  const { items, total, cargarCarrito } = useCarritoStore()
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [ciudad, setCiudad] = useState('')
  const [metodoPago, setMetodoPago] = useState('efectivo')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarCarrito()
  }, [])

  const handleCheckout = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)

    try {
      const token = localStorage.getItem('token')
      
      // Crear orden
      const resOrden = await axios.post(
        `${import.meta.env.VITE_API_URL}/ordenes`,
        {
          nombre_envio: nombre,
          telefono,
          direccion,
          ciudad,
          metodo_pago: metodoPago
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      // Redirigir a confirmación
      navigate(`/confirmacion/${resOrden.data.numeroOrden}`)
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear orden')
    } finally {
      setCargando(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Checkout</h1>
        <p className="text-gray-600">Tu carrito está vacío</p>
        <a href="/tienda" className="text-blue-600 hover:underline">
          Volver a tienda
        </a>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulario */}
        <div>
          <h2 className="text-xl font-bold mb-4">Datos de envío</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCheckout}>
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Nombre</label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Teléfono</label>
              <input
                type="tel"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Dirección</label>
              <input
                type="text"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Ciudad</label>
              <input
                type="text"
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-bold mb-2">Método de Pago (Contra Entrega)</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="efectivo">💵 Efectivo</option>
                <option value="nequi">📱 Nequi</option>
                <option value="bancaria">🏦 Transferencia Bancaria</option>
                <option value="daviplata">💳 Daviplata</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={cargando}
              className="w-full bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {cargando ? 'Procesando...' : 'Confirmar Orden'}
            </button>
          </form>
        </div>

        {/* Resumen */}
        <div>
          <h2 className="text-xl font-bold mb-4">Resumen de Compra</h2>

          <div className="bg-gray-100 p-4 rounded mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between mb-2">
                <span>{item.nombre} x{item.cantidad}</span>
                <span>${item.subtotal.toLocaleString('es-CO')}</span>
              </div>
            ))}

            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between mb-2">
                <span>Subtotal:</span>
                <span>${(total / 1.19).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span>IVA (19%):</span>
                <span>${(total - total / 1.19).toLocaleString('es-CO')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-green-600">
                <span>Total a pagar:</span>
                <span>${total.toLocaleString('es-CO')}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded">
            <p className="text-sm text-gray-600">
              <strong>ℹ️ Pago Contra Entrega:</strong> Pagarás cuando recibas tu orden en la dirección indicada, por el método que seleccionaste.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}