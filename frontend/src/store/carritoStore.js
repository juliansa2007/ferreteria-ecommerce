import { create } from 'zustand';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL;

const getToken = () => localStorage.getItem('token');

export const useCarritoStore = create((set) => ({
  items: [],
  total: 0,

  cargarCarrito: async () => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No hay token');
        return;
      }

      const res = await axios.get(`${API}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ items: res.data.items, total: res.data.total });
    } catch (err) {
      console.error('Error cargando carrito:', err.response?.data || err);
    }
  },

  agregarProducto: async (productoId, cantidad) => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No hay token');
        return;
      }

      await axios.post(
        `${API}/carrito/agregar`,
        { productoId, cantidad },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Recargar carrito
      const res = await axios.get(`${API}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ items: res.data.items, total: res.data.total });
    } catch (err) {
      console.error('Error agregando:', err.response?.data || err);
    }
  },

  eliminarProducto: async (itemId) => {
    try {
      const token = getToken();
      if (!token) {
        console.error('No hay token');
        return;
      }

      await axios.delete(`${API}/carrito/item/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Recargar carrito
      const res = await axios.get(`${API}/carrito`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      set({ items: res.data.items, total: res.data.total });
    } catch (err) {
      console.error('Error eliminando:', err.response?.data || err);
    }
  },
}));