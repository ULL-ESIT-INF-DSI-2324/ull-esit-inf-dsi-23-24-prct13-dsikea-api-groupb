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
import { personaModel } from '../personas/persona.js';
// import { muebleModel } from '../muebles/mueble.js';

/**
 * Interfaz que representa un documento de la colección de transacciones
 */
export interface TransaccionDocumentInterface extends Document {
  id_: number,
  fechainicio_: Date,
  fechafin_: Date,
  importe_: number,
  muebles_: {
    muebleId: Schema.Types.ObjectId,
    cantidad: number,
    _id?: Schema.Types.ObjectId
  }[],
  persona_: Schema.Types.ObjectId,
  tipo_ : string
}

/**
 * Esquema de la colección de transacciones
 */
const TransaccionSchema = new Schema<TransaccionDocumentInterface>({
  id_: {
    type: Number,
    unique: true,
    required: true,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El id de una transacción no puede ser negativo.');
      }
      if (value % 1 !== 0) {
        throw new Error('El id de una transacción no puede ser un número decimal.');
      }
    }
  },
  fechainicio_: {
    type: Date,
    required: true,
    validate: (value: Date) => {
      if (value > new Date()) {
        throw new Error('La fecha de una transacción no puede ser futura.');
      }
      if (value < new Date('2020-01-01')) {
        throw new Error('La fecha de una transacción no puede ser anterior a 2020.');
      }
      if (value === new Date('Invalid Date')) {
        throw new Error('La fecha de una transacción no puede ser inválida.');
      }    
    }
  },
  fechafin_: {
    type: Date,
    required: true,
    validate: (value: Date) => {
      if (value > new Date()) {
        throw new Error('La fecha de una transacción no puede ser futura.');
      }
      if (value < new Date('2020-01-01')) {
        throw new Error('La fecha de una transacción no puede ser anterior a 2020.');
      }
      if (value === new Date('Invalid Date')) {
        throw new Error('La fecha de una transacción no puede ser inválida.');
      }
    }
  },
  importe_: {
    type: Number,
    validate: (value: number) => {
      if (value < 0) {
        throw new Error('El importe de una transacción no puede ser negativo.');
      }
    }
  },
  muebles_: {
    type: [{
      muebleId: Schema.Types.ObjectId,
      cantidad: Number
    }],
    required: true
  },
  persona_: {
    type: Schema.Types.ObjectId,
    ref: 'Personas',
    required: true,
    validate: {
      validator: async function(value: Schema.Types.ObjectId) {
        // Busca la persona en la base de datos
        const persona = await personaModel.findById(value);
        // Devuelve true si la persona existe, false si no
        return !!persona;
      },
      message: props => `La persona asociada con ID ${props.value} no existe en la base de datos.`
    }
  },
  tipo_: {
    type: String,
    // enum: ['Compra', 'Venta', 'Devolución'],
    required: true
  }
});

   
/**
 * Exportación del modelo de la colección de Personas
 */
export const transaccionModel = model<TransaccionDocumentInterface>('Transacciones', TransaccionSchema);