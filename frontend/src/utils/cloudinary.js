/**
 * Transforma una URL original de Cloudinary para retornar una miniatura optimizada.
 * Utiliza un formato de retrato (aspect-ratio ~ 4:5, por ejemplo 150x188px)
 * que es ideal para visualizar rostros de personas desaparecidas en la tarjeta.
 * 
 * @param {string} url - URL original de la foto
 * @param {string} options - Parámetros de transformación de Cloudinary
 * @returns {string} - URL transformada o la original si no es de Cloudinary o es nula
 */
export function getThumbnailUrl(url, options = 'w_150,h_188,c_fill,q_auto,f_auto') {
  if (!url) return null;
  
  // Solo aplicar transformaciones si es una URL de Cloudinary
  if (!url.includes('res.cloudinary.com')) return url;
  
  const uploadIndex = url.indexOf('/upload/');
  if (uploadIndex === -1) return url;
  
  const prefix = url.substring(0, uploadIndex + 8); // Incluye '/upload/'
  const suffix = url.substring(uploadIndex + 8);
  
  return `${prefix}${options}/${suffix}`;
}
