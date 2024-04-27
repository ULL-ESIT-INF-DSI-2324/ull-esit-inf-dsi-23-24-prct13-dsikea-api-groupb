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
import { TransaccionDocumentInterface, transaccionModel } from './transaccion.js';
/**
 * Interfaz que representa un documento de la colección de Devoluciones
 */
export interface DevolucionDocumentInterface extends TransaccionDocumentInterface {
}

/**
 * Esquema de la colección de Personas
 */
const DevolucionSchema = new Schema<DevolucionDocumentInterface>({});

/**
 * Exportación del modelo de la colección de Personas
 */
export const devolucionModel = transaccionModel.discriminator('Devoluciones', DevolucionSchema);