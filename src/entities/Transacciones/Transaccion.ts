/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Séptima práctica de la asignatura DSI
 * Realizada por: 
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */


/**
 * Clase abstracta que representa una Transaccion
 */
export abstract class Transaccion {
  protected id_: number;
  protected fecha_: Date;
  protected importe_: number;
  protected mueble_ : number;
  protected persona_ : string;
  // Signature para indexar propiedades
  [key: string]: unknown;
  constructor(id : number, fecha: Date, importe: number, id_mueble: number, dni_persona: string) {
    this.id_ = id;
    this.fecha_ = fecha;
    this.importe_ = importe;
    this.mueble_ = id_mueble;
    this.persona_ = dni_persona;
  }

  /**
   * Devuelve el id de la transacción
   * @returns Id de la transacción
   */
  public get id(): number {
    return this.id_;
  }

  /**
   * Devuelve la fecha de la transacción
   * @returns Fecha de la transacción
   */
  public get fecha(): Date {
    return this.fecha_;
  }

  /**
   * Devuelve el importe de la transacción
   * @returns Importe de la transacción
   */
  public get importe(): number {
    return this.importe_;
  }
  
  /**
   * Devuelve el  nombre del mueble de la transacción
   * @returns Mueble de la transacción
   */
  public get mueble(): number {
    return this.mueble_;
  }
  
  /**
   * Devuelve el dni de la persona de la transacción
   * @returns Persona de la transacción
   */
  public get persona(): string {
    return this.persona_;
  }

  /**
   * Establece la fecha de la transacción
   * @param fecha Fecha de la transacción
   */
  public set fecha(fecha: Date) {
    this.fecha_ = fecha;
  }
  
  /**
   * Establece el importe de la transacción
   * @param importe Importe de la transacción
   */
  public set importe(importe: number) {
    this.importe_ = importe;
  }

  /**
   * Establece el id del mueble de la transacción
   * @param mueble Mueble de la transacción
   */
  public set mueble(mueble: number) {
    this.mueble_ = mueble;
  }

  /**
   * Establece el dni de la persona de la transacción
   * @param persona Persona de la transacción
   */
  public set persona(persona: string) {
    this.persona_ = persona;
  }

  /**
   * Setter del id de la transacción
   */
  public set id(id: number) {
    this.id_ = id;
  }
}