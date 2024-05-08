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

type Dimension = {
  alto: number,
  ancho: number,
  largo: number
}
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
  color_: string,
  precio_: number,
  cantidad_: number
}

/**
 * Esquema de las dimensiones de un mueble
 */
const DimensionSchema = new Schema<Dimension>({
  alto: Number,
  ancho: Number,
  largo: Number
});


/**
 * Esquema de la colección de Muebles
 */
const MuebleSchema = new Schema<MuebleDocumentInterface>({
  id_: {
    type: Number,  
    unique: true,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El id de un mueble no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El id de un mueble no puede ser un número decimal.');
      }
    }
  },
  nombre_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El nombre de un mueble no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El nombre de un mueble no puede contener números.');
      }
    }
  },
  material_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['madera', 'plástico', 'metal', 'vidrio']
  },
  descripcion_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('La descripción de un mueble no puede ser vacía.');
      }
      if (!value.endsWith('.')) {
        throw new Error('La descripción de un mueble tiene que acabar con un punto.');
      }
    }
  },
  dimensiones_: {
    type: DimensionSchema,
    required: true,
    _id: false,
    validate: (value: Dimension) => {
      if (value.alto < 0 || value.ancho < 0 || value.largo < 0) {
        throw new Error('Las dimensiones de un mueble no pueden ser negativas.');
      }
    } 
  },
  cantidad_: {
    type: Number,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('La cantidad de un mueble no puede ser negativa.');
      }
      if (value % 1 !== 0) {
        throw new Error('La cantidad de un mueble no puede ser un número decimal.');
      }
    }
  },
  color_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    validate: (value: string) => {
      if (value.length === 0) {
        throw new Error('El color de un mueble no puede ser vacío.');
      }
      if (/\d/.test(value)) {
        throw new Error('El color de un mueble no puede contener números.');
      }
    }
  }, 
  precio_: {
    type: Number,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('La cantidad de un mueble no puede ser negativa.');
      }
      if (value % 1 !== 0) {
        throw new Error('La cantidad de un mueble no puede ser un número decimal.');
      }
    }
  },
  tipo_: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    enum: ['silla', 'mesa', 'armario']
  }
});

/**
 * Exportación del modelo de la colección de Muebles
 */
export const muebleModel = model<MuebleDocumentInterface>('Mueble', MuebleSchema);