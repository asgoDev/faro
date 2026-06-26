import axios from 'axios';

// Usamos una instancia limpia de axios ya que este endpoint es público
// y no necesita interceptores de autenticación
const publicApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

export const registerMissing = async (payload) => {
  const { data } = await publicApi.post('/missing', payload);
  return data;
};

export const getMissing = async ({ page = 1, limit = 20, search = '', estado = 'DESAPARECIDO', sexo = '' } = {}) => {
  const { data } = await publicApi.get('/missing', {
    params: { page, limit, q: search, estado, sexo },
  });
  return data;
};

export const getStats = async () => {
  const { data } = await publicApi.get('/missing/stats');
  return data.data;
};
