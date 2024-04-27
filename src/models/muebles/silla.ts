/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Decimo tercera práctica de la asignatura DSI
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */
import { Schema } from 'mongoose';
import { MuebleDocumentInterface, muebleModel } from './mueble.js'

/**
 * Interfaz que representa un documento de la colección de Muebles
 */
export interface SillaDocumentInterface extends MuebleDocumentInterface {
  respaldo_: boolean,
  reposabrazos_: boolean
}

/**
 * Esquema de la colección de Muebles
 */
const SillaSchema = new Schema<SillaDocumentInterface>({
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
export const sillaModel = muebleModel.discriminator('Sillas', SillaSchema);