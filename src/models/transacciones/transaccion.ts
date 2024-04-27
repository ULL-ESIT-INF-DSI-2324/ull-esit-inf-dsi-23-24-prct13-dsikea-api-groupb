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

/**
 * Interfaz que representa un documento de la colección de transacciones
 */
export interface TransaccionDocumentInterface extends Document {
  id_: number,
  fecha_: Date,
  importe_: number,
  mueble_: Schema.Types.ObjectId,
  persona_: Schema.Types.ObjectId,
}

/**
 * Esquema de la colección de transacciones
 */
const TransaccionSchema = new Schema<TransaccionDocumentInterface>({
  id_: {
    type: Number,
    unique: true,
    required: true,
  },
  fecha_: {
    type: Date,
    required: true,
  },
  importe_: {
    type: Number,
    required: true,
  },
  mueble_: {
    type: Schema.Types.ObjectId,
    ref: 'Muebles',
    required: true,
  },
  persona_: {
    type: Schema.Types.ObjectId,
    ref: 'Personas',
    required: true,
  }
});

/**
 * Exportación del modelo de la colección de Personas
 */
export const transaccionModel = model<TransaccionDocumentInterface>('Transacciones', TransaccionSchema);