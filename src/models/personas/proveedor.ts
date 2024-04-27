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
import { PersonaDocumentInterface, personaModel } from './persona.js';

/**
 * Interfaz que representa un documento de la colección de Proveedores
 */
export interface ProveedorDocumentInterface extends PersonaDocumentInterface {
}

/**
 * Esquema de la colección de Proveedores
 */
const ProveedorSchema = new Schema<ProveedorDocumentInterface>({});

/**
 * Exportación del modelo de la colección de Proveedores
 */
export const proveedorModel = personaModel.discriminator('Proveedores', ProveedorSchema);