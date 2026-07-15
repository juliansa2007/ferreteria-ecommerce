import { useState, useEffect } from 'react'
import axios from 'axios'

export default function DashboardAdmin() {
  const [ordenes, setOrdenes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    cargarOrdenes()
  }, [])

  const cargarOrdenes = async () => {
    try {
      const token = localStorage.getItem('token')
      const respuesta = await axios.get(
        `${import.meta.env.VITE_API_URL}/ordenes/todas`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrdenes(respuesta.data)
    } catch (err) {
      setError('Error al cargar órdenes')
    } finally {
      setCargando(false)
    }
  }

  const cambiarEstado = async (ordenId, nuevoEstado) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(
        `${import.meta.env.VITE_API_URL}/ordenes/${ordenId}/estado`,
        { estado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      cargarOrdenes()
    } catch (err) {
      alert('Error al cambiar estado')
    }
  }

  if (cargando) return <div className="p-8 text-center">Cargando...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🔧 Dashboard Admin</h1>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Orden</th>
              <th className="border p-2 text-left">Usuario</th>
              <th className="border p-2 text-left">Total</th>
              <th className="border p-2 text-left">Estado</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map(orden => (
              <tr key={orden.id} className="hover:bg-gray-50">
                <td className="border p-2 font-bold">{orden.numero_orden}</td>
                <td className="border p-2">{orden.correo_usuario}</td>
                <td className="border p-2">${orden.total_cop.toLocaleString('es-CO')}</td>
                <td className="border p-2">
                  <select
                    value={orden.estado}
                    onChange={(e) => cambiarEstado(orden.id, e.target.value)}
                    className="px-2 py-1 border rounded"
                  >
                    <option value="pendiente_pago">⏳ Pendiente Pago</option>
                    <option value="pagada">✅ Pagada</option>
                    <option value="enviada">📦 Enviada</option>
                    <option value="entregada">🎉 Entregada</option>
                  </select>
                </td>
                <td className="border p-2">
                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                    Ver detalles
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {ordenes.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No hay órdenes</p>
      )}
    </div>
  )
}