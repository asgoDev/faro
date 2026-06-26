/**
 * Caché en memoria simple para el servidor.
 * 
 * Sin dependencias externas (no requiere Redis ni Memcached).
 * Almacena respuestas en la memoria del proceso Node.js con un TTL configurable.
 * 
 * Uso ideal para:
 * - Datos que se leen frecuentemente y cambian poco (listados públicos, stats).
 * - Entornos de instancia única (Render Free/Starter tier).
 * 
 * Limitación: la caché es local al proceso. Si el servidor se reinicia o
 * hay múltiples instancias (horizontal scaling), cada instancia tendrá
 * su propia caché. Para esos casos se recomienda Redis.
 */

const cache = new Map();

/**
 * Obtiene un valor de la caché.
 * Retorna null si no existe o si expiró.
 * @param {string} key 
 * @returns {any|null}
 */
export function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

/**
 * Guarda un valor en la caché con un TTL en milisegundos.
 * @param {string} key 
 * @param {any} value 
 * @param {number} ttlMs - Tiempo de vida en milisegundos (default: 5 minutos)
 */
export function cacheSet(key, value, ttlMs = 5 * 60 * 1000) {
  cache.set(key, {
    value,
    expiresAt: Date.now() + ttlMs,
  });
}

/**
 * Invalida todas las entradas cuya clave empiece con el prefijo dado.
 * Útil para invalidar un grupo de claves (ej: todas las páginas de un listado).
 * @param {string} prefix 
 */
export function cacheInvalidateByPrefix(prefix) {
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

/**
 * Elimina una clave específica de la caché.
 * @param {string} key 
 */
export function cacheDelete(key) {
  cache.delete(key);
}

/**
 * Limpia toda la caché. Útil para testing o reinicio manual.
 */
export function cacheClear() {
  cache.clear();
}
