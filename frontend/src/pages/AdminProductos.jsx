import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminProductos() {
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [busqueda, setBusqueda] = useState('')
  const [productoEditandoId, setProductoEditandoId] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria_id: '',
    precio_cop: '',
    stock: '',
    marca: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const token = localStorage.getItem('token')
      const [resProductos, resCategorias] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/productos`, 
          { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${import.meta.env.VITE_API_URL}/productos/categorias`,
          { headers: { Authorization: `Bearer ${token}` } })
      ])
      setProductos(resProductos.data)
      setCategorias(resCategorias.data)
    } catch (err) {
      setError('Error al cargar datos')
    } finally {
      setCargando(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  try {
    const token = localStorage.getItem('token')
    
    if (productoEditandoId) {
      // EDITAR producto existente
      await axios.put(
        `${import.meta.env.VITE_API_URL}/productos/${productoEditandoId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    } else {
      // CREAR producto nuevo
      await axios.post(
        `${import.meta.env.VITE_API_URL}/productos`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
    }
    
    setFormData({ nombre: '', descripcion: '', categoria_id: '', precio_cop: '', stock: '', marca: '' })
    setProductoEditandoId(null)
    setMostrarFormulario(false)
    cargarDatos()
  } catch (err) {
    setError('Error al guardar producto')
  }
}
  const handleEditar = (producto) => {
  setProductoEditandoId(producto.id)
  setFormData({
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    categoria_id: producto.categoria_id,
    precio_cop: producto.precio_cop,
    stock: producto.stock,
    marca: producto.marca,
  })
  setMostrarFormulario(true)
  window.scrollTo(0, 0)
}

const handleEliminar = async (id) => {
  if (!window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    return
  }

  try {
    const token = localStorage.getItem('token')
    await axios.delete(
      `${import.meta.env.VITE_API_URL}/productos/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    cargarDatos()
  } catch (err) {
    setError('Error al eliminar producto')
  }
}

  if (cargando) return <div className="p-8 text-center">Cargando...</div>

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">📦 Gestionar Productos</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <button
        onClick={() => setMostrarFormulario(!mostrarFormulario)}
        className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {mostrarFormulario ? '❌ Cancelar' : '➕ Agregar Producto'}
      </button>

      {mostrarFormulario && (
        <div className="bg-gray-100 p-6 rounded mb-8">
          <h2 className="text-2xl font-bold mb-4">Nuevo Producto</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre del producto"
                value={formData.nombre}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
              <select
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              >
                <option value="">Selecciona categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>
              <input
                type="number"
                name="precio_cop"
                placeholder="Precio (COP)"
                value={formData.precio_cop}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="marca"
                placeholder="Marca"
                value={formData.marca}
                onChange={handleChange}
                className="px-3 py-2 border rounded"
              />
            </div>
            <textarea
              name="descripcion"
              placeholder="Descripción del producto"
              value={formData.descripcion}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded h-24"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Guardar Producto
            </button>
          </form>
        </div>
      )}

<div className="mb-6">
  <input
    type="text"
    placeholder="🔍 Buscar producto por nombre..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    className="w-full px-4 py-2 border rounded"
  />
</div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2 text-left">Nombre</th>
              <th className="border p-2 text-left">Categoría</th>
              <th className="border p-2 text-left">Precio</th>
              <th className="border p-2 text-left">Stock</th>
              <th className="border p-2 text-left">Marca</th>
              <th className="border p-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos
  .filter(prod => prod.nombre.toLowerCase().includes(busqueda.toLowerCase()))
  .map(prod => (
              <tr key={prod.id} className="hover:bg-gray-50">
                <td className="border p-2">{prod.nombre}</td>
                <td className="border p-2">{prod.categoria_nombre}</td>
                <td className="border p-2">${prod.precio_cop.toLocaleString('es-CO')}</td>
                <td className="border p-2">{prod.stock}</td>
                <td className="border p-2">{prod.marca}</td>
                <td className="border p-2 space-x-2">
                  <td className="border p-2 space-x-2">
  <button 
    onClick={() => handleEditar(prod)}
    className="bg-blue-600 text-white px-2 py-1 text-sm rounded hover:bg-blue-700"
  >
    ✏️ Editar
  </button>
  <button 
    onClick={() => handleEliminar(prod.id)}
    className="bg-red-600 text-white px-2 py-1 text-sm rounded hover:bg-red-700"
  >
    🗑️ Eliminar
  </button>
</td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {productos.length === 0 && (
        <p className="text-center text-gray-600 mt-4">No hay productos</p>
      )}
    </div>
  )
}