import { z } from 'zod';

const TELEFONO_INTERNACIONAL_REGEX = /^\+?[0-9\s\-]+$/;

export const registerMissingSchema = z.object({
  nombreCompleto: z.string().min(3, 'Mínimo 3 caracteres'),
  sexo: z.enum(['M', 'F', 'Otro']).optional(),
  edad: z.coerce.number().int().min(0).max(120).optional().default(0),
  ultimaUbicacion: z.string().min(3, 'Indica una ubicación'),
  telefonoContacto: z
    .string()
    .min(7, 'Teléfono muy corto')
    .regex(TELEFONO_INTERNACIONAL_REGEX, 'Teléfono inválido')
    .optional(),
  rasgosParticulares: z.string().optional(),
  fotoUrl: z.string().optional().nullable(),
});