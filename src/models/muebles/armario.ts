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
 * Interfaz que representa un documento de la colección de Armario
 */
export interface ArmarioDocumentInterface extends MuebleDocumentInterface {
  cajones_: boolean,
  puertas_: number
}

/**
 * Esquema de la colección de Armario
 */
const ArmarioSchema = new Schema<ArmarioDocumentInterface>({
  cajones_: {
    type: Boolean,
    required: true
  },
  puertas_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value % 1 !== 0) {
        throw new Error('Un armario no puede tener un número decimal de puertas.');
      }
      if (value < 0) {
        throw new Error('Un armario no puede tener puertas negativas.');
      }
    },
  }
});

/**
 * Exportación del modelo de la colección de Armario
 */
export const armarioModel = muebleModel.discriminator('Armarios', ArmarioSchema);