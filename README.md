- Autores: **Omar Suárez Doro - alu0101483474@ull.edu.es ; Antonio Ramos Castilla - alu0101480367@ull.edu.es ; Ithaisa Morales Arbelo - alu0101482194@ull.edu.es**

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

* **customers.ts**: Define operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de clientes en una API REST utilizando Express y Mongoose.

    1. Operación GET /customers: Busca clientes en la base de datos utilizando los parámetros de la QueryString. Devuelve un objeto JSON con los clientes encontrados o un mensaje de error si no se encuentran.
    2. Operación GET /customers/:id: Busca un cliente en la base de datos utilizando su ID dinámicamente. Retorna un objeto JSON con el cliente encontrado o un mensaje de error si no se encuentra.
    3. Operación POST /customers: Guarda un nuevo cliente en la base de datos. Espera recibir los datos del cliente en el cuerpo de la solicitud y devuelve el cliente guardado como objeto JSON, o un mensaje de error si ocurre algún problema.
    4. Operación PATCH /customers: Actualiza clientes en la base de datos utilizando los parámetros de la QueryString como filtros. Devuelve el cliente actualizado como objeto JSON o un mensaje de error si no se encuentra.
    5. Operación PATCH /customers/:id: Actualiza un cliente en la base de datos utilizando su ID dinámicamente. Retorna el cliente actualizado como objeto JSON o un mensaje de error si no se encuentra.
    6. Operación DELETE /customers: Elimina clientes de la base de datos utilizando los parámetros de la QueryString como filtros. Devuelve el cliente eliminado como objeto JSON o un mensaje de error si no se encuentra.
    7. Operación DELETE /customers/:id: Elimina un cliente de la base de datos utilizando su ID dinámicamente. Retorna el cliente eliminado como objeto JSON o un mensaje de error si no se encuentra.

    ```ts
    export const customersRouter = Express.Router();
    
    customersRouter.get('/customers', async (req, res) => {
      req.query = { ...req.query };
      try {
        let clientesEncontrados: PersonaDocumentInterface[] = [await clienteModel.find(req.query)];
        clientesEncontrados = clientesEncontrados.flat().filter(x => x !== null);
        let condition: boolean = clientesEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clientesEncontrados);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
      }
    });
    
    customersRouter.get('/customers/:id', async (req, res) => {
      try {
        let clienteEncontrado = await clienteModel.findOne({ id_: req.params.id });
        let condition: boolean = clienteEncontrado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteEncontrado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
      }
    });
    
    customersRouter.post('/customers', async (req, res) => {
      try {
        const cliente = new clienteModel(req.body);
        await cliente.save();
        res.send(cliente);
      } catch (error) {
        res.status(500).send({ msg: 'Error al guardar el cliente', error: error });
      }
    });
    
    customersRouter.patch('/customers', async (req, res) => {
      req.query = { ...req.query };
      try {
        const clienteActualizado = await clienteModel.findOneAndUpdate(req.query, req.body, { new: true, runValidators: true});
        let condition: boolean = clienteActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el cliente', error: error });
      }
    });
  
    customersRouter.patch('/customers/:id', async (req, res) => {
      try {
        const clienteActualizado = await clienteModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
        let condition: boolean = clienteActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el cliente', error: error });
      }
    });
    
    customersRouter.delete('/customers', async (req, res) => {
      req.query = { ...req.query };
      try {
        const clienteEliminado = await clienteModel.findOneAndDelete(req.query);
        let condition: boolean = clienteEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el cliente', error: error });
      }
    });
    
    customersRouter.delete('/customers/:id', async (req, res) => {
      try {
        const clienteEliminado = await clienteModel.findOneAndDelete({ id_: req.params.id });
        let condition: boolean = clienteEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el cliente', error: error });
      }
    });
    ```

  * **furnitures.ts**: Define operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de muebles en una API REST utilizando Express y Mongoose.

    1. Operación GET /furnitures: Busca muebles en la base de datos utilizando los parámetros de la QueryString. Retorna un objeto JSON con los muebles encontrados o un mensaje de error si no se encuentran.
    2. Operación GET /furnitures/:id: Busca un mueble en la base de datos utilizando su ID de manera dinámica. Devuelve un objeto JSON con el mueble encontrado o un mensaje de error si no se encuentra.
    3. Operación POST /furnitures: Guarda un nuevo mueble en la base de datos. Espera recibir los datos del mueble en el cuerpo de la solicitud y devuelve el mueble guardado como objeto JSON, o un mensaje de error si ocurre algún problema.
    4. Operación PATCH /furnitures: Actualiza muebles en la base de datos utilizando los parámetros de la QueryString como filtros. Devuelve el mueble actualizado como objeto JSON o un mensaje de error si no se encuentra.
    5. Operación PATCH /furnitures/:id: Actualiza un mueble en la base de datos utilizando su ID de manera dinámica. Retorna el mueble actualizado como objeto JSON o un mensaje de error si no se encuentra.
    6. Operación DELETE /furnitures: Elimina muebles de la base de datos utilizando los parámetros de la QueryString como filtros. Retorna el mueble eliminado como objeto JSON o un mensaje de error si no se encuentra.
    7. Operación DELETE /furnitures/:id: Elimina un mueble de la base de datos utilizando su ID de manera dinámica. Retorna el mueble eliminado como objeto JSON o un mensaje de error si no se encuentra.

    ```ts
    import Express from 'express';
    import { sillaModel } from '../models/muebles/silla.js';
    import { armarioModel } from '../models/muebles/armario.js';
    import { mesaModel } from '../models/muebles/mesa.js';
    import { MuebleDocumentInterface } from '../models/muebles/mueble.js';
    
    let models: any[] = [sillaModel, armarioModel, mesaModel];
    export const furnitureRouter = Express.Router();
    
    furnitureRouter.get('/furnitures', async (req, res) => {
      req.query = { ...req.query };
      try {
        let mueblesEncontrados: MuebleDocumentInterface[] = [];
        for (const model of models) {
          let result = await model.find(req.query);
          mueblesEncontrados.push(result);
        }
        mueblesEncontrados = mueblesEncontrados.flat().filter(x => x !== null);
        let condition: boolean = mueblesEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : mueblesEncontrados);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el mueble', error: error });
      }
    });
    
    furnitureRouter.get('/furnitures/:id', async (req, res) => {
      try {
        let mueblesEncontrados: MuebleDocumentInterface[] = [];
        for (const model of models) {
          let result = req.params.id === "-1" ? await model.find() : await model.findOne({ id_: req.params.id });
          mueblesEncontrados.push(result);
        }
        mueblesEncontrados = mueblesEncontrados.flat().filter(x => x !== null);
        let condition: boolean = mueblesEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : mueblesEncontrados);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el mueble', error: error });
      }
    });
    
    furnitureRouter.post('/furnitures', async (req, res) => {
      try {
        // Búsqueda en los modelos, y en caso de encontrar el mueble,
        // se actualiza la cantidad en vez de crear un nuevo mueble
        for (const model of models) {
          let result = await model.find({ id_: req.body.id_ });
          if (result.length > 0) {
            let response = await model.findOneAndUpdate(
              { _id: result[0]._id}, 
              {cantidad_: result[0].cantidad_ + (req.body.cantidad_ ?? 1)}, 
              {new: true, runValidators: true}
            );
            res.status(200).send(response);
            return;
          }
        }
        let model = null;
        let customObj = { ...req.body };
        if (!req.body.cantidad_) { customObj.cantidad_ = 1; }
        switch (req.body.tipo_) {
          case 'silla':
            model = new sillaModel(req.body);
            break;
          case 'mesa':
            model = new mesaModel(req.body);
            break;
          case 'armario':
            model = new armarioModel(req.body);
            break;
          default:
            res.status(400).send({ msg: 'Tipo de mueble no válido' });
            break;
        }
        if (model === null) { return; }
        await model.save();
        res.send(model);
    
      } catch (error) {
        res.status(500).send({ msg: 'Error al guardar el mueble', error: error });
      }
    });
    
    furnitureRouter.patch('/furnitures', async (req, res) => {
      req.query = { ...req.query };
      try {
        let muebleActualizado = null;
        for (const model of models) {
          muebleActualizado = await model.findOneAndUpdate(req.query, req.body, { new: true, runValidators: true});
          if (muebleActualizado !== null) { break; }
        }
        let condition: boolean = muebleActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : muebleActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el mueble', error: error });
      }
    });
    
    furnitureRouter.patch('/furnitures/:id', async (req, res) => {
      try {
        let muebleActualizado = null;
        for (const model of models) {
          muebleActualizado = await model.findOneAndUpdate({ id_: req.params.id }, req.body, { new: true, runValidators: true});
          if (muebleActualizado !== null) { break; }
        }
        let condition: boolean = muebleActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : muebleActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el mueble', error: error });
      }
    });
    
    furnitureRouter.delete('/furnitures', async (req, res) => {
      req.query = { ...req.query };
      try {
        let muebleEliminado = null;
        for (let model of models) {
          // Si la cantidad es especificada en el cuerpo de la petición, se restará de la cantidad actual
          // en caso de que la cantidad sea mayor a la actual, se eliminará el mueble.
          // En caso de no especificarse, se eliminará el mueble
          let result = await model.findOne({id_: req.query.id_});
          if (!result) { continue; }
          if (req.body.cantidad_ === undefined || result.cantidad_ < req.body.cantidad_) {
            muebleEliminado = await model.findOneAndDelete(req.query);
          } else {
            muebleEliminado = await model.findOneAndUpdate(
              { _id: result._id}, 
              {cantidad_: result.cantidad_ - +req.body.cantidad_}, 
              {new: true, runValidators: true}
            );
          }
          if (muebleEliminado !== null) { break; }
        }
        let condition: boolean = muebleEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : muebleEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el mueble', error: error });
      }
    });
    
    furnitureRouter.delete('/furnitures/:id', async (req, res) => {
      try {
        let muebleEliminado = null;
        for (const model of models) {
          let result = await model.findOne({id_:req.params.id});
          if (!result) { continue; }
          if (req.body.cantidad_ === undefined || result.cantidad_ < req.body.cantidad_) {
            muebleEliminado = await model.findOneAndDelete({id_:req.params.id});
          } else {
            muebleEliminado = await model.findOneAndUpdate(
              { _id: result._id}, 
              {cantidad_: result.cantidad_ - +req.body.cantidad_}, 
              {new: true, runValidators: true}
            );
          }
          if (muebleEliminado !== null) { break; }
        }
        let condition: boolean = muebleEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el mueble' } : muebleEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el mueble', error: error });
      }
    });
    ```

  * **providers.ts**: Define operaciones CRUD (Crear, Leer, Actualizar, Eliminar) para la gestión de proveedores en una API REST utilizando Express y Mongoose.

    1. Operación GET /providers: Busca proveedores en la base de datos utilizando los parámetros de la QueryString. Retorna un objeto JSON con los proveedores encontrados o un mensaje de error si no se encuentran.
    2. Operación GET /providers/:id: Busca un proveedor en la base de datos utilizando su ID de manera dinámica. Devuelve un objeto JSON con el proveedor encontrado o un mensaje de error si no se encuentra.
    3. Operación POST /providers: Guarda un nuevo proveedor en la base de datos. Espera recibir los datos del proveedor en el cuerpo de la solicitud y devuelve el proveedor guardado como objeto JSON, o un mensaje de error si ocurre algún problema.
    4. Operación PATCH /providers: Actualiza proveedores en la base de datos utilizando los parámetros de la QueryString como filtros. Devuelve el proveedor actualizado como objeto JSON o un mensaje de error si no se encuentra.
    5. Operación PATCH /providers/:id: Actualiza un proveedor en la base de datos utilizando su ID de manera dinámica. Retorna el proveedor actualizado como objeto JSON o un mensaje de error si no se encuentra.
    6. Operación DELETE /providers: Elimina proveedores de la base de datos utilizando los parámetros de la QueryString como filtros. Retorna el proveedor eliminado como objeto JSON o un mensaje de error si no se encuentra.
    7. Operación DELETE /providers/:id: Elimina un proveedor de la base de datos utilizando su ID de manera dinámica. Retorna el proveedor eliminado como objeto JSON o un mensaje de error si no se encuentra.

    ```ts
    export const providersRouter = Express.Router();

    providersRouter.get('/providers', async (req, res) => {
      req.query = { ...req.query };
      try {
        let proveedoresEncontrados: PersonaDocumentInterface[] = [await proveedorModel.find(req.query)];
        proveedoresEncontrados = proveedoresEncontrados.flat().filter(x => x !== null);
        let condition: boolean = proveedoresEncontrados.length === 0;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedoresEncontrados);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
      }
    });
    
    providersRouter.get('/providers/:id', async (req, res) => {
      try {
        let proveedorEncontrado = await proveedorModel.findOne({ id_: req.params.id });
        let condition: boolean = proveedorEncontrado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorEncontrado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
      }
    });
    
    providersRouter.post('/providers', async (req, res) => {
      try {
        const proveedor = new proveedorModel(req.body);
        await proveedor.save();
        res.send(proveedor);
      } catch (error) {
        res.status(500).send({ msg: 'Error al guardar el proveedor', error: error });
      }
    });
    
    providersRouter.patch('/providers', async (req, res) => {
      req.query = { ...req.query };
      try {
        const proveedorActualizado = await proveedorModel.findOneAndUpdate(req.query, req.body, { new: true, runValidators: true});
        let condition: boolean = proveedorActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el proveedor', error: error });
      }
    });
    
    providersRouter.patch('/providers/:id', async (req, res) => {
      try {
        const proveedorActualizado = await proveedorModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
        let condition: boolean = proveedorActualizado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorActualizado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al actualizar el proveedor', error: error });
      }
    });
    
    providersRouter.delete('/providers', async (req, res) => {
      req.query = { ...req.query };
      try {
        const proveedorEliminado = await proveedorModel.findOneAndDelete(req.query);
        let condition: boolean = proveedorEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el proveedor', error: error });
      }
    });
    
    providersRouter.delete('/providers/:id', async (req, res) => {
      try {
        const proveedorEliminado = await proveedorModel.findOneAndDelete({ id_: req.params.id });
        let condition: boolean = proveedorEliminado === null;
        res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorEliminado);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar el proveedor', error: error });
      }
    });
    ```

  * **transaction.ts**: Permiten realizar operaciones CRUD en una API REST utilizando Express y Mongoose.

    1. Operación GET /transactions/balance: Esta ruta calcula el saldo total de todas las transacciones en la base de datos y devuelve el promedio del saldo de todas las transacciones.
    2. Operaciones GET /transactions y GET /transactions/:id: Estas rutas permiten buscar transacciones por diferentes criterios. La función handleGet parece estar definida pero no se proporciona en el código. Puedes asumir que esta función maneja la lógica para buscar transacciones según los parámetros de la QueryString o el ID dinámico.
    3. Operación POST /transactions: Esta ruta guarda una nueva transacción en la base de datos. Antes de guardar la transacción, se parsean y validan los datos recibidos en el cuerpo de la solicitud. Se espera que exista una función parseData que realice esta tarea. También se espera que exista una función getModel que obtenga el modelo correcto para la transacción en función del tipo de transacción especificado en el cuerpo de la solicitud.
    4. Operación PATCH /transactions/:id: Esta ruta actualiza una transacción existente en la base de datos. Primero, se recupera la transacción anterior. Si se especifican muebles en el cuerpo de la solicitud, se actualizan los muebles asociados a la transacción y se realiza un control de inventario. Si no se especifican muebles, se actualiza directamente la transacción. Se espera que exista una función actualizarStock que maneje la lógica para actualizar el inventario de muebles.
    5. Operación DELETE /transactions/:id: Esta ruta elimina una transacción existente de la base de datos. Se eliminan todas las instancias de transacciones asociadas al ID proporcionado. También se espera que exista una función actualizarStock que maneje la lógica para actualizar el inventario de muebles al eliminar una transacción.
   
    ```ts
    export const transaccionRouter = Express.Router();
    
    transaccionRouter.get('/transactions/balance', async (_, res) => {
      try {
        let transactions: TransaccionDocumentInterface[] = await transactionsModels[0].find({});
        if (!transactions || !transactions.length) { 
          res.status(404).send({msg: 'No hay transacciones disponibles'}) 
        }
        let sum : number = 0;
        for (const t of transactions) {
          sum += t.importe_;
        }
        res.status(200).send({balance: sum / transactions.length});
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
      }
    });
    
    transaccionRouter.get('/transactions', handleGet);
    
    transaccionRouter.get('/transactions/:id', handleGet);
    
    transaccionRouter.post('/transactions', async (req, res) => {
      try {
        // Parsear y validar datos
        const { idPersona, importeTotal, mueblesCambiados } = await parseData(req);
        // Crear instancia del modelo de transacción
        const TransaccionModel = getModel(req.body.tipo_);
        req.body.muebles_ = mueblesCambiados;
        req.body.persona_ = idPersona;
        const model = new TransaccionModel({
          importe_: importeTotal,
          ...req.body
        });
        // Guardar el modelo de transacción
        await model.save();
        res.send(model);
      } catch (error) {
        let errorCustom = error as Error;
        res.status(500).send({ msg: 'Error al guardar la transacción', error: errorCustom.message });
      }
    });
    
    transaccionRouter.patch('/transactions/:id', async (req, res) => {
      try {
        // Se recupera la transacción anterior
        let transaccionAModificar = await transactionsModels[0].findOne({ id_: req.params.id });
        // Si está definido el array muebles_ en el body de la petición, se itera sobre el array de muebles
        if (req.body.muebles_) {
          for (const mueble of req.body.muebles_) {
            let muebleEncontrado = await muebleModel.findOne({ nombre_: mueble.muebleId });
            // Si no se encuentra el mueble, se lanza un error
            if (!muebleEncontrado) {
              throw new Error('El mueble no existe');
            }
            // Se calcula la diferencia entre la cantidad de muebles de la transacción anterior, y la cantidad de muebles de la transacción actual
            let muebleEnTransaccion = transaccionAModificar.muebles_.find((m: any) => m.muebleId.equals(muebleEncontrado!._id));
            let diferencia = mueble.cantidad - muebleEnTransaccion.cantidad;
            console.log(`Básicamente ${mueble.cantidad} - ${transaccionAModificar.muebles_.find((m: any) => m.muebleId.equals(muebleEncontrado._id)).cantidad} = ${diferencia}`);
            // Se tienen en cuenta
            if (transaccionAModificar.tipo_ === 'venta') {
              diferencia > 0 ? muebleEnTransaccion.cantidad += diferencia : muebleEnTransaccion.cantidad -= Math.abs(diferencia);
              // Si la diferencia es menor que 0, se añaden los muebles al stock., en caso contrario, se suman          
              diferencia > 0 ? muebleEncontrado.cantidad_ -= diferencia : muebleEncontrado.cantidad_ += Math.abs(diferencia);
              console.log(`La nueva cantidad del mueble es ${muebleEncontrado.cantidad_}`);
              diferencia > 0 ? transaccionAModificar.importe_ += muebleEncontrado.precio_ * Math.abs(diferencia) : transaccionAModificar.importe_ -= muebleEncontrado.precio_ * Math.abs(diferencia);
              console.log(`El nuevo importe del mueble es ${transaccionAModificar.importe_}`);
              // Se comprueba que la cantidad de muebles en stock sea mayor o igual a 0, en caso contrario, se lanza un error
              if (muebleEncontrado.cantidad_ < 0) {
                throw new Error('No hay suficientes muebles en stock');
              }
            } else if (transaccionAModificar.tipo_ === 'compra') {
              // Si la diferencia es mayor que 0, se añaden los muebles al stock., en caso contrario, se restan
              diferencia > 0 ? muebleEnTransaccion.cantidad += diferencia : muebleEnTransaccion.cantidad -= Math.abs(diferencia);
              diferencia > 0 ? muebleEncontrado.cantidad_ += diferencia : muebleEncontrado.cantidad_ -= Math.abs(diferencia);
              diferencia > 0 ? transaccionAModificar.importe_ -= muebleEncontrado.precio_ * Math.abs(diferencia) : transaccionAModificar.importe_ += muebleEncontrado.precio_ * Math.abs(diferencia);
            }
            // Se guarda el mueble
            muebleEncontrado.save();
            if (transaccionAModificar.importe_ < 0 || muebleEncontrado.cantidad_ < 0 || muebleEnTransaccion.cantidad < 0) {
              throw new Error('No se pueden realizar transacciones con valores negativos');
            }
            // Se borra del body los muebles, ya que no se pueden actualizar
            // Se actualiza la transacción
            delete req.body.muebles_;
            for (let prop in req.body) {
              if (req.body[prop]) {
                transaccionAModificar[prop] = req.body[prop];
              }
            }
            transaccionAModificar.save();
          }
        } else {
          await transactionsModels[0].findOneAndUpdate({id_:req.params.id}, req.body);
        }
        res.status(transaccionAModificar ? 200: 404).send(transaccionAModificar ?? {msg: 'Transacción no encontrada'});
      } catch (error) {
        let customError = error as Error;
        res.status(500).send({ msg: 'Error al actualizar la transacción', error: customError.message });
      }
    });
    
    transaccionRouter.delete('/transactions/:id', async (req, res) => {
      try {
        let transaccionesEliminadas: TransaccionDocumentInterface[] = [];
        for (const model of transactionsModels) {
          // Iteramos sobre los muebles de la transacción que eliminamos para devolverlos al stock
          let transaccion = await model.findOne({ id_: req.params.id });
          if (!transaccion) { continue; }
          await actualizarStock(transaccion, req);
          let result = await model.deleteMany({ id_: req.params.id });
          if (result.deletedCount === 0) { continue; }
          transaccionesEliminadas.push(transaccion);
        }
        res.status(transaccionesEliminadas.length === 0 ? 404 : 200).send(transaccionesEliminadas.length === 0 ? {msg: 'Transacción no encontrada.'} : transaccionesEliminadas);
      } catch (error) {
        res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
      }
    });
    ```

  * **functionsHandle.ts**: Implementa algunas funciones como:

    1. Operación GET: La función handleGet maneja las solicitudes GET a la ruta /transactions, tanto para buscar todas las transacciones como para buscar una transacción específica por ID.
    2. Operación POST: La función parseData se encarga de analizar y validar los datos de la transacción antes de guardarla en la base de datos. Se manejan casos como la búsqueda de la persona asociada a la transacción y la actualización del stock de muebles.
    3. Operación DELETE: La función actualizarStock se utiliza para actualizar el stock de muebles después de eliminar una transacción. Esto asegura que el inventario se mantenga actualizado correctamente.

    ```ts
    type request = Express.Request<any>;
    type response = Express.Response<any>;
    
    export async function handleGet(req: request, res: response) {
      if (!req.params.id) {
        req.query = { ...req.query };
      }
      try {
        res.status(200).send(await getFoundTransactions(req));
      } catch (error) {
        error = error as Error;
        res.status(404).send({ msg: 'Error al buscar la transacción', error: error });
      }
    }
    
    export async function getFoundTransactions(req: request) {
      let transaccionesEncontradas: TransaccionDocumentInterface[] = [];
      for (const model of transactionsModels) {
        let result = null;
        if (req.params.id) {
          result = req.params.id === "-1" ? await model.find() : await model.findOne({ id_: req.params.id });
          if (!result) { continue; }
          result = [result];
        } else {
          result = await model.find(req.query);
        } 
        for (const transaccion of result) {
          let duplicado: boolean = false;
          for (const x of transaccionesEncontradas) {
            if (!transaccion || transaccion.id_ === x.id_) {
              duplicado = true;
              break;
            }
          }
          if (duplicado) { continue; }
          transaccionesEncontradas.push(transaccion);
        }
      }
      if (transaccionesEncontradas.length === 0) {
        throw new Error('No se encontró ninguna transacción.');
      }
      return transaccionesEncontradas;
    }
    
    export async function parseData(req: request) {
      const objPersona: PersonaDocumentInterface | null = await personaModel.findOne({ id_: req.body.persona_ });
      if (!objPersona) {
        throw new Error(`No se encontró la persona ${req.body.persona_}`);
      }
      let idPersona = objPersona._id.toString();
      let importeTotal = 0;
      let mueblesCambiados: { muebleId: Schema.Types.ObjectId, cantidad: number }[] = [];
      for (const mueble of req.body.muebles_) {
        const idMueble = await muebleModel.findOne({ nombre_: mueble.muebleId });
        if (!idMueble) { continue; }
        // Si la transacción es de venta y no hay suficientes unidades en stock, se lanza un error
        if (req.body.tipo_ === 'venta' && idMueble.cantidad_ < mueble.cantidad) {
          throw new Error(`No hay suficientes unidades de ${mueble.muebleId} en stock`);
        }
        // Actualizar cantidad de muebles y calcular importe total
        await muebleModel.findOneAndUpdate({ _id: idMueble._id }, { cantidad_: req.body.tipo_ === 'venta' ? idMueble.cantidad_ - mueble.cantidad : idMueble.cantidad_ + mueble.cantidad });
        importeTotal += idMueble.precio_ * mueble.cantidad;
        mueblesCambiados.push({ muebleId: idMueble?._id.toString(), cantidad: mueble.cantidad });
      }
      if (mueblesCambiados.length !== req.body.muebles_.length) {
        throw new Error('No se encontraron todos los muebles');
      }
      return { idPersona, importeTotal, mueblesCambiados };
    }
    
    export async function actualizarStock(result: TransaccionDocumentInterface, req: request) {
      for (const mueble of result.muebles_) {
        let idMueble = await muebleModel.findOne({ _id: mueble.muebleId });
        if (!idMueble) { continue; }
        // Si la transacción era una venta, devolvemos los muebles al stock
        if (req.body.tipo_ === 'venta') {
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ + mueble.cantidad }, { new: true, runValidators: true });
        } else {
          // Si la transacción era una compra, quitamos los muebles del stock
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ - mueble.cantidad }, { new: true, runValidators: true });
        }
      }
    }
    ```

  * **index.ts**: Inicializa un servidor Express que proporciona endpoints para manejar operaciones relacionadas con muebles, clientes, proveedores y transacciones.

    ```ts
    export const app = express();
    app.use(express.json());
    app.use(furnitureRouter);
    app.use(providersRouter);
    app.use(customersRouter);
    app.use(transaccionRouter);
    console.log(chalk.green('[server_initiation] Server started!'));
    app.listen(3000);
    iniciarDB();
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
