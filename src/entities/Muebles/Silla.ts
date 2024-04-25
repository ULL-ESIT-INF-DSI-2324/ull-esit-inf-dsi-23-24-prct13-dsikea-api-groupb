/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Séptima práctica de la asignatura DSI
 * Realizada por: 
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */

import { Mueble, Dimension } from './Mueble.js';

/**
 * Clase que representa una silla
 */
export class Silla extends Mueble {
  private respaldo_: boolean;
  private reposabrazos_: boolean;
  constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: Dimension, precio: number, respaldo: boolean, reposabrazos: boolean) {
    super(id, nombre, descripcion, material, dimensiones, precio);
    this.respaldo_ = respaldo;
    this.reposabrazos_ = reposabrazos;
    this.tipo_ = 'Silla';
  }

  // Getters & Setters

  /**
   * Devuelve si la silla tiene respaldo
   * @returns Si la silla tiene respaldo
   */
  public get respaldo(): boolean {
    return this.respaldo_;
  }

  /**
   * Devuelve si la silla tiene reposabrazos
   * @returns Si la silla tiene reposabrazos
   */
  public get reposabrazos(): boolean {
    return this.reposabrazos_;
  }
  
  /**
   * Establece si la silla tiene respaldo
   * @param respaldo Si la silla tiene respaldo
   */
  public set respaldo(respaldo: boolean) {
    this.respaldo_ = respaldo;
  }
  
  /**
   * Establece si la silla tiene reposabrazos
   * @param reposabrazos Si la silla tiene reposabrazos
   */
  public set reposabrazos(reposabrazos: boolean) {
    this.reposabrazos_ = reposabrazos;
  }
}