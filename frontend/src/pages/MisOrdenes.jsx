import { useState, useEffect } from 'react'
import axios from 'axios'

export default function MisOrdenes() {
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
        `${import.meta.env.VITE_API_URL}/ordenes`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setOrdenes(respuesta.data)
    } catch (err) {
      setError('Error al cargar órdenes')
    } finally {
      setCargando(false)
    }
  }

  if (cargando) return <div className="p-8 text-center">Cargando...</div>
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Mis Órdenes</h1>

      {ordenes.length === 0 ? (
        <p className="text-gray-600">No tienes órdenes aún</p>
      ) : (
        <div className="space-y-4">
          {ordenes.map(orden => (
            <div key={orden.id} className="border p-4 rounded bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-lg">Orden: {orden.numero_orden}</p>
                  <p className="text-gray-600">Fecha: {new Date(orden.fecha_creacion).toLocaleDateString('es-CO')}</p>
                  <p className="text-gray-600">Estado: <span className="font-semibold text-blue-600">{orden.estado}</span></p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">${orden.total_cop.toLocaleString('es-CO')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}