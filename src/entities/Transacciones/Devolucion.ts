/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Séptima práctica de la asignatura DSI
 * Realizada por: 
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */


import { Transaccion } from './Transaccion.js';

/**
 * Clase que representa una Devolucion
 */
export class Devolucion extends Transaccion {
  constructor(id: number, fecha: Date, importe: number, id_mueble: number, dni_persona: string) {
    super(id, fecha, importe, id_mueble, dni_persona);
  }
}