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
 * Interfaz que representa las dimensiones de un mueble
 */
export type Dimension = {
  alto: number;
  ancho: number;
  largo: number;
}

/**
 * Clase abstracta que representa un mueble
 */
export abstract class Mueble {
  protected id_: number;
  protected nombre_: string;
  protected descripcion_: string;
  protected material_: string;
  protected dimensiones_: Dimension;
  protected precio_: number;
  protected tipo_ : string = 'No definido';
  // Signature para indexar propiedades
  [key: string]: unknown;
  
  constructor(id: number, nombre: string, descripcion: string, material: string, dimensiones: Dimension, precio: number) {
    this.id_ = id;
    this.nombre_ = nombre;
    this.descripcion_ = descripcion;
    this.material_ = material;
    this.dimensiones_ = dimensiones;
    this.precio_ = precio;
  }

  // Getters & Setters

  /**
   * Devuelve el identificador del mueble
   * @returns Identificador del mueble
   */
  public get id(): number {
    return this.id_;
  }

  /**
   * Devuelve el nombre del mueble
   * @returns Nombre del mueble
   */
  public get nombre(): string {
    return this.nombre_;
  }
 
  /**
   * Devuelve la descripción del mueble
   * @returns Descripción del mueble
   */
  public get descripcion(): string {
    return this.descripcion_;
  }

  /**
   * Devuelve el material del mueble
   * @returns Material del mueble
   */
  public get material(): string {
    return this.material_;
  }

  /**
   * Devuelve las dimensiones del mueble
   * @returns Dimensiones del mueble
   */
  public get dimensiones(): Dimension {
    return this.dimensiones_;
  }

  /**
   * Devuelve el precio del mueble
   * @returns Precio del mueble
  */
 public get precio(): number {
   return this.precio_;
  }
  
  /**
   * Devuelve el tipo de mueble
   * @returns Tipo de mueble
   */
  public get tipo(): string {
    return this.tipo_;
  }
  
  /**
   * Establece el identificador del mueble
   * @param id Identificador del mueble
  */
  public set id(id: number) {
    this.id_ = id;
  }

  /**
   * Establece el nombre del mueble
   * @param nombre Nombre del mueble
   */
  public set nombre(nombre: string) {
    this.nombre_ = nombre;
  }

  /**
   * Establece la descripción del mueble
   * @param descripcion Descripción del mueble
   */
  public set descripcion(descripcion: string) {
    this.descripcion_ = descripcion;
  }

  /**
   * Establece el material del mueble
   * @param material Material del mueble
   */
  public set material(material: string) {
    this.material_ = material;
  }

  /**
   * Establece las dimensiones del mueble
   * @param dimensiones Dimensiones del mueble
   */
  public set dimensiones(dimensiones: Dimension) {
    this.dimensiones_ = dimensiones;
  }

  /**
   * Establece el precio del mueble
   * @param precio Precio del mueble
   */
  public set precio(precio: number) {
    this.precio_ = precio;
  }


  /**
   * Establece el tipo de mueble
   * @param tipo Tipo de mueble
   */
  public set tipo(tipo: string) {
    this.tipo_ = tipo;
  }
}