import { Router } from 'express';
import { register, list, stats } from './missing.controller.js';
import validate from '../../shared/middleware/validate.js';
import { registerMissingSchema } from './missing.validation.js';
import { upload } from './middleware/upload.js';
import { registerMissingLimiter } from '../../shared/middleware/security.middleware.js';

const router = Router();

// Rutas públicas de desaparecidos
router.get('/stats', stats);
router.get('/', list);
// Limitar a 1 registro por minuto por IP para evitar spam
router.post('/', registerMissingLimiter, upload.single('foto'), validate(registerMissingSchema), register);

export default router;
