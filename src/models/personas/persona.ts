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
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El id de una persona no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El id de una persona no puede ser un número decimal.');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de una persona no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de una persona no puede contener números.');
      }
      if (!/^[A-Z]/.test(value)) {
        throw new Error('El nombre de una persona debe empezar por mayúscula.');
      }
    } 
  },
  contacto_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El contacto de una persona no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El contacto de una persona no puede ser un número decimal.');
      }
      if (value.toString().length !== 9) {
        throw new Error('El contacto de una persona debe tener 9 dígitos.');
      }
      if (!/^[6-9]/.test(value.toString())) {
        throw new Error('El contacto de una persona debe empezar por 6,7,8 9.');
      }
    }
  },
  direccion_: {
    type: String,
    required: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('La dirección de una persona no puede ser vacía.');
      }
      if (!/^[a-zA-Z0-9\s]+,[0-9]+(,[0-9]+*){0,2}$/.test(value)) {
        throw new Error('La dirección de una persona debe tener un formato válido: [nombre de la calle],[número de la casa], [piso], [puerta].');
      }
    }
  }
});

/**
 * Exportación del modelo de la colección de Personas
 */
export const personaModel = model<PersonaDocumentInterface>('Personas', PersonaSchema);