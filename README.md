- Autores: **Omar Suárez Doro - alu0101483474@ull.edu.es
           Antonio Ramos Castilla - alu0101480367@ull.edu.es
           Ithaisa Morales Arbelo - alu0101482194@ull.edu.es**

- Asignatura: **Desarrollo de Sistemas Informáticos**
  
# Índice

- [1. 📚 Introducción 📚](#1--introducción-)
- [2. 🧠 Trabajo previo 🧠](#2--trabajo-previo-)
- [3. 🖥️ Desarrollo de la práctica 🖥️](#3-️-desarrollo-de-la-práctica-️)
- [4. Conclusiones](#4-conclusiones)
- [5. Referencias](#5-referencias)

# 1. 📚 Introducción 📚

El propósito de este informe es detallar los procedimientos llevados a cabo en el transcurso de la práctica número 13 del curso de **Desarrollo de Sistemas Informáticos**.
 
# 2. 🧠 Trabajo previo 🧠

Para la realización de esta práctica, se han realizado las siguientes tareas como trabajo previo:

  * Lectura y compresión de los apuntes de la asignatura, junto a la búsqueda de información en la documentación del framework [Express](https://expressjs.com/es/guide/routing.html).
  * Entender el funcionamiento de MongoDB y Mongoose.
  * Saber cómo utilizar Atlas y Render para su desplegue web.

# 3. 🖥️ Desarrollo de la práctica 🖥️

En esta fase, se ha implementado el servidor utilizando Express para replicar la funcionalidad previa. Se ha integrado MongoDB y Mongoose para gestionar la base de datos de manera eficiente. Además, se ha desplegado la aplicación web utilizando MongoDB Atlas y Render, asegurando una configuración óptima y una fácil gestión del entorno de producción.

  * **getModels.ts**: Permite obtener el modelo de transacción correspondiente según un tipo dado, como compra, venta o devolución. El vector transactionsModels exportada contiene todos los modelos de transacciones disponibles en el sistema, facilitando el acceso a ellos desde otros módulos.

  ```ts
  export function getModel(tipo: string) {
    switch (tipo.toLowerCase()) {
      case 'compra':
        return compraModel;
      case 'venta':
        return ventaModel;
      case 'devolucion':
        return devolucionModel;
      default:
        throw new Error('Tipo de transacción no soportado');
    }
  }
  
  export let transactionsModels: any[] = [transaccionModel, devolucionModel, ventaModel];
  ```

  * **db.ts**: Establece una conexión a una base de datos MongoDB y proporciona manejo de errores básico.

    ```ts
    // Connect to Database
    export let iniciarDB = () => {
      connect(process.env.MONGODB_URL!).then(() => {
        console.log('Connected to the database');
      }).catch(() => {
        console.log('Something went wrong when conecting to the database');
        process.exit(-1);
      });
    }
    ```

  * **mueble.ts**: Se proporciona una definición de esquema y un modelo para interactuar con una colección de muebles en una base de datos MongoDB utilizando Mongoose.

      1. Tipo Dimension: Define una estructura para representar las dimensiones de un mueble, incluyendo alto, ancho y largo.
      2. Interfaz MuebleDocumentInterface: Define la estructura de un documento de la colección de Muebles, especificando las propiedades esperadas como id, tipo, nombre, etc.
      3. Esquema DimensionSchema: Define la estructura del subdocumento para las dimensiones de un mueble, utilizando el tipo definido previamente y los tipos de datos proporcionados por Mongoose.
      4. Esquema MuebleSchema: Define la estructura completa de un documento de la colección de Muebles, con campos como id, nombre, material, etc. Se aplican validaciones y restricciones a cada campo.
   
      ```ts
      type Dimension = {
        alto: number,
        ancho: number,
        largo: number
      }

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
      
      const DimensionSchema = new Schema<Dimension>({
        alto: Number,
        ancho: Number,
        largo: Number
      });
      
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
      
      export const muebleModel = model<MuebleDocumentInterface>('Mueble', MuebleSchema);
      ```

  * **silla.ts, mesa.ts, armario.ts**: Proporcionan código que heredan del mismo origen, la interfaz MuebleDocumentInterface, lo que les proporciona propiedades comunes como id, tipo, nombre, etc. Cada esquema de mueble (SillaSchema, MesasSchema y ArmarioSchema) define la estructura específica de cada tipo de mueble, con validaciones y tipos de datos específicos. Aunque comparten la misma base, cada tipo de mueble introduce atributos únicos: las sillas tienen respaldo_ y reposabrazos_, las mesas tienen extensible_ y sillas_, mientras que los armarios tienen cajones_ y puertas_. Estos modelos se crean utilizando muebleModel.discriminator basado en el modelo principal de muebles y el esquema específico de cada tipo, permitiendo una estructura modular y extensible para gestionar diferentes tipos de muebles en la base de datos.

    > Código de Ejemplo: silla.ts

    ```ts
    export interface SillaDocumentInterface extends MuebleDocumentInterface {
      respaldo_: boolean,
      reposabrazos_: boolean
    }
    
    const SillaSchema = new Schema<SillaDocumentInterface>({
      respaldo_: {
        type: Boolean,
        required: true
      },
      reposabrazos_: {
        type: Boolean,
        required: true
      }
    });
    
    export const sillaModel = muebleModel.discriminator('Sillas', SillaSchema);
    ```

  * **persona.ts**: Define un modelo y un esquema para una colección de personas en una base de datos MongoDB utilizando Mongoose.

    1. Interfaz PersonaDocumentInterface: Define la estructura de un documento de la colección de Personas, especificando propiedades como id, nombre, contacto y dirección.
    2. Esquema PersonaSchema: Define la estructura completa de un documento de la colección de Personas. Cada campo del esquema especifica el tipo de datos, si es único y requerido, y contiene funciones de validación para asegurar la integridad de los datos ingresados.
    3. Modelo personaModel: Exporta el modelo de Mongoose para la colección de Personas, utilizando el esquema definido previamente. Este modelo se registra en la base de datos con el nombre "Personas".

    ```ts
    export interface PersonaDocumentInterface extends Document {
      id_: string,
      nombre_: string,
      contacto_: number,
      direccion_: string
    }
    
    const PersonaSchema = new Schema<PersonaDocumentInterface>({
      id_: {
        type: String,
        unique: true,
        required: true,
        validate: (value: string) => {
          if (value.length === 0) {
            throw new Error('El ID de una persona no puede ser vacío.');
          }
          if (value.length !== 9) {
            throw new Error('El ID de una persona debe tener 9 caracteres.');
          }
          if (!/^\d{8}\w{1}$/.test(value)) {
            throw new Error('El ID de una persona debe tener un formato válido: [8 dígitos][1 letras mayúsculas].');
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
          if (!/^[a-zA-Z0-9\s]+,[0-9]+(,[0-9]*){0,2}$/.test(value)) {
            throw new Error('La dirección de una persona debe tener un formato válido: [nombre de la calle],[número de la casa], [piso], [puerta].');
          }
        }
      }
    });
    
    export const personaModel = model<PersonaDocumentInterface>('Personas', PersonaSchema);
    ```

  * **proveedor.ts, cliente.ts**: Los modelos de Proveedores y Clientes se basan en una estructura común representada por la interfaz PersonaDocumentInterface, heredando propiedades como id, nombre, contacto y dirección. Cada uno utiliza un esquema (ProveedorSchema y ClienteSchema) que, aunque vacío en este caso, aprovecha las validaciones y tipos de datos definidos en el esquema de personas. Además, se utilizan discriminadores en Mongoose para crear los modelos (proveedorModel y clienteModel) basados en el modelo principal de personas, permitiendo una gestión modular y coherente de diferentes tipos de entidades en la base de datos.

    > Código de Ejemplo: cliente.ts

    ```ts
    export interface ClienteDocumentInterface extends PersonaDocumentInterface {
    }

    const ClienteSchema = new Schema<ClienteDocumentInterface>({});
    
    export const clienteModel = personaModel.discriminator('Clientes', ClienteSchema);
    ```

  * **transaccion.ts**: Define un modelo y un esquema para una colección de transacciones en una base de datos MongoDB utilizando Mongoose.

    1. Interfaz TransaccionDocumentInterface: Define la estructura de un documento de la colección de Transacciones, especificando propiedades como id, fechas de inicio y fin, importe, muebles involucrados, persona asociada y tipo de transacción.
    2. Esquema MuebleSchema: Define la estructura para representar un mueble en una transacción, con propiedades para el id del mueble y la cantidad involucrada.
    3. Esquema TransaccionSchema: Define la estructura completa de un documento de la colección de Transacciones. Cada campo del esquema especifica el tipo de datos, si es único y requerido, y contiene funciones de validación para asegurar la integridad de los datos ingresados. El campo muebles_ utiliza el esquema MuebleSchema para representar una lista de muebles involucrados en la transacción. El campo persona_ se refiere a una persona asociada con la transacción, validando que el id de la persona exista en la base de datos.

    ```ts
    export interface TransaccionDocumentInterface extends Document {
      id_: number,
      fechainicio_: Date,
      fechafin_: Date,
      importe_: number,
      muebles_: {
        muebleId: Schema.Types.ObjectId,
        cantidad: number,
      }[],
      persona_: Schema.Types.ObjectId,
      tipo_ : string
    }
    
    const MuebleSchema = new Schema({
      muebleId: Schema.Types.ObjectId,
      cantidad: Number,
    });
    
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
        type: [MuebleSchema],
        required: true,
        _id: false
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
    
    export const transaccionModel = model<TransaccionDocumentInterface>('Transacciones', TransaccionSchema);
    ```

  * **venta.ts, devolucion.ts, compra.ts**: Los modelos de Ventas, Devoluciones y Compras se fundamentan en una estructura común definida por la interfaz TransaccionDocumentInterface, compartiendo propiedades como id, fechas de inicio y fin, importe, muebles involucrados, persona asociada y tipo de transacción. Cada uno emplea un esquema (VentaSchema, DevolucionSchema y CompraSchema) que, aunque inicialmente vacío, se apoya en las validaciones y tipos de datos establecidos en el esquema de transacciones. Además, se aplican discriminadores en Mongoose para instanciar los modelos (ventaModel, devolucionModel y compraModel) derivados del modelo principal de transacciones, lo que facilita una gestión modular y uniforme de distintos tipos de transacciones en la base de datos.

    > Código de Ejemplo: compra.ts

    ```ts
    export interface CompraInterfaceDocument extends TransaccionDocumentInterface {
    }
    
    const CompraSchema = new Schema<CompraInterfaceDocument>({});
    
    export const compraModel = transaccionModel.discriminator('Compras', CompraSchema);
    ```


# 4. Conclusiones

Tras la realización de la práctica, se han aprendido las nociones básicas para el manejo del Framework Express, así como la integración con MongoDB y Mongoose para la gestión de la base de datos. Se ha logrado comprender cómo implementar un servidor API REST utilizando Express y cómo interactuar con la base de datos no relacional MongoDB mediante Mongoose.

Además, se ha adquirido experiencia en el despliegue de la aplicación utilizando servicios como Atlas y Render, lo que ha permitido comprender el proceso completo desde el desarrollo hasta la puesta en producción de la aplicación web.

# 5. Referencias

- [Documentación de Express](https://expressjs.com/es/)
- [Curso de Express para NodeJS](https://www.youtube.com/watch?v=JmJ1WUoUIK4)
- [Documentación de MongoDB](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongodb.html)
- [Documentación de Mongoose](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongoose.html)
- [Documentación de Render](https://docs.render.com/)
