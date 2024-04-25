/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Decimo tercera práctica de la asignatura DSI
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */
import { Document, model, Schema } from 'mongoose';
import { Dimension } from '../entities/Muebles/Mueble.js';

/**
 * Interfaz que representa un documento de la colección de Muebles
 */
export interface MuebleDocumentInterface extends Document {
  id_: number,
  tipo_: string,
  nombre_: string,
  material_: string,
  descripcion_: string,
  dimensiones_: Dimension,
  cantidad_: number
}

/**
 * Esquema de la colección de Muebles
 */
const MueleSchema = new Schema<MuebleDocumentInterface>({
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
  }
});

/**
 * Exportación del modelo de la colección de Muebles
 */
export const muebleModel = model<MuebleDocumentInterface>('Mueble', MueleSchema);