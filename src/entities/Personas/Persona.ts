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
 * Clase que representa un Persona
 */
export abstract class Persona {
  protected contacto_: number;
  // Signature para indexar propiedades
  [key: string]: unknown;
  constructor(protected id_ : number, protected nombre_ : string, contacto : string, protected direccion_ : string) {
    if (!/^\d{9}$/.test(contacto)) {
      throw new Error('El contacto debe tener 9 dígitos');
    }
    this.contacto_ = parseInt(contacto);
  }

  // Getters & Setters

  /**
   * Devuelve el identificador de la persona
   * @returns Identificador de la persona
   */
  public get id(): number {
    return this.id_;
  }

  /**
   * Devuelve el nombre de la persona
   * @returns Nombre de la persona
   */
  public get nombre(): string {
    return this.nombre_;
  }

  /**
   * Devuelve el contacto de la persona
   * @returns Contacto de la persona
   */
  public get contacto(): number {
    return this.contacto_;
  }

  /**
   * Devuelve la dirección de la persona
   * @returns Dirección de la persona
   */
  public get direccion(): string {
    return this.direccion_;
  }
  
  /**
   * Establece el identificador de la persona
   * @param id Identificador de la persona
   */

  public set id(id: number) {
    this.id_ = id;
  }

  /**
   * Establece el nombre de la persona
   * @param nombre Nombre de la persona
   */
  public set nombre(nombre: string) {
    this.nombre_ = nombre;
  }

  /**
   * Establece el contacto de la persona
   * @param contacto Contacto de la persona
   */
  public set contacto(contacto: number) {
    this.contacto_ = contacto;
  }

  /**
   * Establece la dirección de la persona
   * @param direccion Dirección de la persona
   */
  public set direccion(direccion: string) {
    this.direccion_ = direccion;
  }
}