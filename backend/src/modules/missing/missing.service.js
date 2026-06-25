import MissingPerson from './missing.model.js';

export const registerMissing = async (data, file) => {
  const newPerson = new MissingPerson({
    ...data,
    fotoUrl: file?.path || data.fotoUrl || null, // Cloudinary secure_url from Multer or directly from frontend
  });
  await newPerson.save();
  return newPerson;
};

export const listMissing = async ({ page = 1, limit = 10, search = '', estado = 'DESAPARECIDO' }) => {
  const query = {};
  
  if (estado) {
    query.estado = estado;
  }
  
  if (search) {
    // Búsqueda insensible a mayúsculas/minúsculas en el nombre
    query.nombreCompleto = { $regex: search, $options: 'i' };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const total = await MissingPerson.countDocuments(query);
  
  const items = await MissingPerson.find(query)
    .sort({ fechaRegistro: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    items,
    total,
    page: Number(page),
    pages: Math.ceil(total / Number(limit)),
  };
};

export const getStats = async () => {
  const total = await MissingPerson.countDocuments();
  const encontrados = await MissingPerson.countDocuments({ estado: 'ENCONTRADO' });
  const desaparecidos = await MissingPerson.countDocuments({ estado: 'DESAPARECIDO' });

  return {
    total,
    encontrados,
    desaparecidos,
  };
};
