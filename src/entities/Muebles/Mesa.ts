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
 * Clase que representa una silla
 */
export class Mesa extends Mueble {
  private extensible_: boolean;
  private sillas_: number;
  constructor(
    id: number,
    nombre: string,
    descripcion: string,
    material: string,
    dimensiones: Dimension,
    precio: number,
    extensible: boolean,
    sillas: number
  ) {
    super(id, nombre, descripcion, material, dimensiones, precio);
    this.extensible_ = extensible;
    this.sillas_ = sillas;
    this.tipo_ = "Mesa";
  }

  // Getters & Setters

  /**
   * Getter del atributo extensible
   * @returns boolean
   */
  get extensible(): boolean {
    return this.extensible_;
  }

  /**
   * Setter del atributo extensible
   * @param extensible boolean
   */
  set extensible(extensible: boolean) {
    this.extensible_ = extensible;
  }

  /**
   * Getter del atributo sillas
   * @returns number
   */
  get sillas(): number {
    return this.sillas_;
  }

  /**
   * Setter del atributo sillas
   * @param sillas number
   */
  set sillas(sillas: number) {
    this.sillas_ = sillas;
  }
}
