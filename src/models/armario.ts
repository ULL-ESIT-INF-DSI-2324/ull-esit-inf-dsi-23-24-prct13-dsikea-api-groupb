/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Decimo tercera práctica de la asignatura DSI
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */
import { model, Schema } from 'mongoose';
import { MuebleDocumentInterface } from './mueble.js'

/**
 * Interfaz que representa un documento de la colección de Muebles
 */
export interface ArmarioDocumentInterface extends MuebleDocumentInterface {
  cajones_:
}

/**
 * Esquema de la colección de Muebles
 */
const SillaSchema = new Schema<ArmarioDocumentInterface>({
  id_: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  material_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  descripcion_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  dimensiones_: {
    type: {
      alto: Number,
      ancho: Number,
      largo: Number
    },
    required: true
  },
  cantidad_: {
    type: Number,
    required: true
  },
  tipo_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  respaldo_: {
    type: Boolean,
    required: true
  },
  reposabrazos_: {
    type: Boolean,
    required: true
  }
});

/**
 * Exportación del modelo de la colección de Muebles
 */
export const sillaModel = model<SillaDocumentInterface>('Sillas', SillaSchema);