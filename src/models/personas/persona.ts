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
 * Interfaz que representa un documento de la colección de Personas
 */
export interface PersonaDocumentInterface extends Document {
  id_: number,
  nombre_: string,
  contacto_: number,
  direccion_: string
}

/**
 * Esquema de la colección de Personas
 */
const PersonaSchema = new Schema<PersonaDocumentInterface>({
  id_: {
    type: Number,
    unique: true,
    required: true,
  },
  nombre_: {
    type: String,
    required: true,
  },
  contacto_: {
    type: Number,
    required: true,
  },
  direccion_: {
    type: String,
    required: true,
  }
});

/**
 * Exportación del modelo de la colección de Personas
 */
export const personaModel = model<PersonaDocumentInterface>('Personas', PersonaSchema);