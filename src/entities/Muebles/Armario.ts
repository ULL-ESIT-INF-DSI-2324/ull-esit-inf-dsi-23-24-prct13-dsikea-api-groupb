/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Séptima práctica de la asignatura DSI
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */

import { Mueble, Dimension } from "./Mueble.js";

/**
 * Clase que representa un Armario
 */
export class Armario extends Mueble {
  private cajones_: boolean;
  private puertas_: number;
  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    material: string,
    dimensiones: Dimension,
    precio: number,
    cajones: boolean,
    puertas: number
  ) {
    super(id, nombre, descripcion, material, dimensiones, precio);
    this.cajones_ = cajones;
    this.puertas_ = puertas;
    this.tipo_ = "Armario";
  }

  // Getters & Setters

  /**
   * Getter del atributo cajones
   * @returns {boolean} true si el armario tiene cajones, false en caso contrario
   */
  public get cajones(): boolean {
    return this.cajones_;
  }

  /**
   * Getter del atributo puertas
   * @returns {number} número de puertas del armario
   */
  public get puertas(): number {
    return this.puertas_;
  }

  /**
   * Setter del atributo cajones
   * @param {boolean} cajones true si el armario tiene cajones, false en caso contrario
   */
  public set cajones(cajones: boolean) {
    this.cajones_ = cajones;
  }

  /**
   * Setter del atributo puertas
   * @param {number} puertas número de puertas del armario
   */
  public set puertas(puertas: number) {
    this.puertas_ = puertas;
  }
}
