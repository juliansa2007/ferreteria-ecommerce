import { useEffect } from 'react'
import { useCarritoStore } from '../store/carritoStore'

export default function Carrito() {
  const { items, total, cargarCarrito, eliminarProducto } = useCarritoStore()

  useEffect(() => {
    cargarCarrito()
  }, [])

  if (items.length === 0) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Carrito</h1>
        <p className="text-gray-600">Tu carrito está vacío</p>
        <a href="/tienda" className="text-blue-600 hover:underline">
          Volver a tienda
        </a>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Carrito</h1>

      <table className="w-full border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left">Producto</th>
            <th className="border border-gray-300 p-2">Precio</th>
            <th className="border border-gray-300 p-2">Cantidad</th>
            <th className="border border-gray-300 p-2">Subtotal</th>
            <th className="border border-gray-300 p-2">Acción</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id}>
              <td className="border border-gray-300 p-2">{item.nombre}</td>
              <td className="border border-gray-300 p-2 text-right">
                ${item.precio_cop.toLocaleString('es-CO')}
              </td>
              <td className="border border-gray-300 p-2 text-center">{item.cantidad}</td>
              <td className="border border-gray-300 p-2 text-right">
                ${item.subtotal.toLocaleString('es-CO')}
              </td>
              <td className="border border-gray-300 p-2 text-center">
                <button
                  onClick={() => eliminarProducto(item.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-right mb-4">
        <p className="text-2xl font-bold">
          Total: ${total.toLocaleString('es-CO')}
        </p>
      </div>

      <div className="flex gap-4">
        <a href="/tienda" className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
          Seguir comprando
        </a>
        <a href="/checkout" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block">
         Ir a Checkout
        </a>
      </div>
    </div>
  )
}