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
 * Interfaz que representa un documento de la colección de Mesa
 */
export interface MesaDocumentInterface extends MuebleDocumentInterface {
  extensible_: boolean,
  sillas_: number
}

/**
 * Esquema de la colección de Mesa
 */
const MesasSchema = new Schema<MesaDocumentInterface>({
  extensible_: {
    type: Boolean,
    required: true
  },
  sillas_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value % 1 !== 0) {
        throw new Error('Una mesa no puede tener un número decimal de sillas.');
      }
      if (value < 0) {
        throw new Error('Una mesa no puede tener un número negativo de sillas.');
      }
    },

  }
});

/**
 * Exportación del modelo de la colección de Mesa
 */
export const mesaModel = muebleModel.discriminator('Mesas', MesasSchema);