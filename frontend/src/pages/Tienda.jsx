import { useCarritoStore } from '../store/carritoStore'
import { useState, useEffect } from 'react'
import axios from 'axios'

export default function Tienda() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null)
  const [cargando, setCargando] = useState(true)

  // Cargar categorías y productos
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const resCategorias = await axios.get(
          `${import.meta.env.VITE_API_URL}/productos/categorias`
        )
        setCategorias(resCategorias.data)

        const resProductos = await axios.get(
          `${import.meta.env.VITE_API_URL}/productos`
        )
        setProductos(resProductos.data)
      } catch (err) {
        console.error('Error cargando datos:', err)
      } finally {
        setCargando(false)
      }
    }
    cargarDatos()
  }, [])

  // Filtrar productos por categoría
  const productosFiltrados = categoriaSeleccionada
    ? productos.filter(p => p.categoria_id === categoriaSeleccionada)
    : productos

  if (cargando) return <div className="p-8">Cargando...</div>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Tienda</h1>

      {/* Filtros por categoría */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <button
          onClick={() => setCategoriaSeleccionada(null)}
          className={`px-4 py-2 rounded font-bold ${
            categoriaSeleccionada === null
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Todos
        </button>
        {categorias.map(cat => (
          <button
            key={cat.id}
            onClick={() => setCategoriaSeleccionada(cat.id)}
            className={`px-4 py-2 rounded font-bold ${
              categoriaSeleccionada === cat.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            {cat.nombre.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {productosFiltrados.map(producto => (
          <div key={producto.id} className="bg-white rounded-lg shadow p-4">
            <div className="bg-gray-200 h-48 rounded mb-4 flex items-center justify-center">
              <span className="text-gray-400">Sin imagen</span>
            </div>
            <h3 className="font-bold text-lg">{producto.nombre}</h3>
            <p className="text-gray-600 text-sm mb-2">{producto.marca}</p>
            <p className="text-blue-600 font-bold text-xl mb-2">
              ${producto.precio_cop.toLocaleString('es-CO')}
            </p>
            <p className="text-gray-500 text-xs mb-4">
              Stock: {producto.stock}
            </p>
            <input
  type="number"
  min="1"
  max={producto.stock}
  defaultValue="1"
  id={`cant-${producto.id}`}
  className="w-full border border-gray-300 p-2 rounded mb-2"
/>
<button
  onClick={() => {
    const cantidad = parseInt(document.getElementById(`cant-${producto.id}`).value);
    useCarritoStore.getState().agregarProducto(producto.id, cantidad);
    alert('Agregado al carrito');
  }}
  className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
>
  Agregar al carrito
</button>
          </div>
        ))}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="text-center text-gray-600 py-8">
          No hay productos en esta categoría
        </div>
      )}
    </div>
  )
}