import { useParams } from 'react-router-dom'

export default function Confirmacion() {
  const { numeroOrden } = useParams()

  return (
    <div className="p-8 text-center">
      <div className="max-w-md mx-auto">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold mb-4">¡Orden confirmada!</h1>
        <p className="text-gray-600 mb-4">
          Tu orden <strong>{numeroOrden}</strong> ha sido creada exitosamente.
        </p>
        <p className="text-gray-600 mb-8">
          En breve recibirás un email con los detalles.
        </p>

        <a href="/" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}