/**
 * Universidad de La Laguna
 * Asignatura: Desarrollo de Sistemas Informáticos
 * Decimo tercera práctica de la asignatura DSI
 * Realizada por:
 *  > Antonio Ramos Castilla (alu0101480367@ull.edu.es)
 *  > Ithaisa Morales Arbelo (alu0101482194@ull.edu.es)
 *  > Omar Suárez Doro (alu0101483474@ull.edu.es)
 */
import Express from 'express';
import { sillaModel } from '../models/muebles/silla.js';
import { armarioModel } from '../models/muebles/armario.js';
import { mesaModel } from '../models/muebles/mesa.js';
import { MuebleDocumentInterface } from '../models/muebles/mueble.js';

// Declaración del router y agrupación de los modelos
let models: any[] = [sillaModel, armarioModel, mesaModel];
export const furnitureRouter = Express.Router();

/**
 * Busca un mueble en la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble encontrado o un mensaje de error
 */
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

/**
 * Busca un mueble en la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble encontrado o un mensaje de error
 */
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

/**
 * Guarda un mueble en la base de datos, el tipo de mueble se especifica en el body
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble guardado o un mensaje de error
 */
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

/**
 * Actualiza un mueble de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble actualizado o un mensaje de error
 */
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

/**
 * Actualiza un mueble de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble actualizado o un mensaje de error
 */
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

/**
 * Elimina un mueble de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble eliminado o un mensaje de error
 */
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
          {cantidad_: result.cantidad_ -= +req.body.cantidad_}, 
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

/**
 * Elimina un mueble de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el mueble eliminado o un mensaje de error
 */
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
          {cantidad_: result.cantidad_ -= +req.body.cantidad_}, 
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
