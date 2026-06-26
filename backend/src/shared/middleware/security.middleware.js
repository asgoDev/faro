import rateLimit from 'express-rate-limit';

/**
 * Limitador general para todas las peticiones de la API.
 * Evita abuso general y escaneo de vulnerabilidades.
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 200, // Límite de 200 peticiones por IP
    message: {
        message: 'Demasiadas peticiones desde esta IP. Por favor intente de nuevo más tarde.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Limitador estricto para rutas de autenticación (Login).
 * Protege contra ataques de fuerza bruta.
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 10, // Límite de 10 intentos de inicio de sesión por IP
    message: {
        message: 'Demasiados intentos de inicio de sesión. Por favor intente de nuevo en 15 minutos.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Limitador para el registro de desaparecidos (POST público).
 * Permite 1 registro por minuto por IP para prevenir spam
 * sin bloquear usuarios legítimos.
 */
export const registerMissingLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 1,
    message: {
        message: 'Solo se permite un registro por minuto. Por favor espere antes de intentar de nuevo.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: false, // Contar también los exitosos
});

/**
 * Limitador para consultas públicas (GET).
 * Permite hasta 30 peticiones por minuto por IP para navegación fluida
 * y búsquedas puntuales, evitando saturaciones o raspado masivo.
 */
export const publicReadLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    max: 7,
    message: {
        message: 'Has realizado demasiadas consultas. Por favor, espera un momento antes de continuar.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

