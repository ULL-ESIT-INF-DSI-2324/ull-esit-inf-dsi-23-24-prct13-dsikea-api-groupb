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

# 4. Conclusiones

Tras la realización de la práctica, se han aprendido las nociones básicas para el manejo del Framework Express, así como la integración con MongoDB y Mongoose para la gestión de la base de datos. Se ha logrado comprender cómo implementar un servidor API REST utilizando Express y cómo interactuar con la base de datos no relacional MongoDB mediante Mongoose.

Además, se ha adquirido experiencia en el despliegue de la aplicación utilizando servicios como Atlas y Render, lo que ha permitido comprender el proceso completo desde el desarrollo hasta la puesta en producción de la aplicación web.

# 5. Referencias

- [Documentación de Express](https://expressjs.com/es/)
- [Curso de Express para NodeJS](https://www.youtube.com/watch?v=JmJ1WUoUIK4)
- [Documentación de MongoDB](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongodb.html)
- [Documentación de Mongoose](https://ull-esit-inf-dsi-2324.github.io/nodejs-theory/nodejs-mongoose.html)
- [Documentación de Render](https://docs.render.com/)
