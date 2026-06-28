import mongoose from 'mongoose';

const missingPersonSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
    trim: true,
  },
  sexo: {
    type: String,
    enum: ['M', 'F', 'Otro'],
  },
  edad: {
    type: Number,
    min: 0,
    max: 120,
  },
  ultimaUbicacion: {
    type: String,
  },
  telefonoContacto: {
    type: String,
  },
  rasgosParticulares: {
    type: String,
    default: null,
  },
  fotoUrl: {
    type: String,
    default: null,
  },
  estado: {
    type: String,
    enum: ['DESAPARECIDO', 'ENCONTRADO'],
    default: 'DESAPARECIDO',
  },
  fechaRegistro: {
    type: Date,
    default: Date.now,
  },
  reportadoEncontradoPor: {
    nombre: { type: String, default: null },
    email: { type: String, default: null },
    fechaReporte: { type: Date, default: null },
  },
});

missingPersonSchema.index({ estado: 1, fechaRegistro: -1 });
missingPersonSchema.index({ nombreCompleto: 'text' });

const MissingPerson = mongoose.model('MissingPerson', missingPersonSchema);
export default MissingPerson;
