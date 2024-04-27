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
import { transaccionModel, TransaccionDocumentInterface } from '../models/transacciones/transaccion.js';
import { devolucionModel } from '../models/transacciones/devolucion.js';
import { ventaModel } from '../models/transacciones/venta.js';
import { muebleModel } from '../models/muebles/mueble.js';
import { personaModel } from '../models/personas/persona.js';

// Declaración del router
export const transaccionRouter = Express.Router();
let models: any[] = [devolucionModel, ventaModel, transaccionModel];

/**
 * Busca una transacción en la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción encontrada o un mensaje de error
 */
transaccionRouter.get('/transactions', async (req, res) => {
  req.query = { ...req.query };
  try {
    let transaccionesEncontradas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = await model.find(req.query);
      transaccionesEncontradas.push(result);
    }
    transaccionesEncontradas = transaccionesEncontradas.flat().filter(x => x !== null);
    let condition: boolean = transaccionesEncontradas.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la transacción' } : transaccionesEncontradas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar la transacción', error: error });
  }
});

/**
 * Busca una transacción en la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción encontrada o un mensaje de error
 */
transaccionRouter.get('/transactions/:id', async (req, res) => {
  try {
    let transaccionesEncontradas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = req.params.id === "-1" ? await model.find() : await model.findOne({ id_: req.params.id });
      transaccionesEncontradas.push(result);
    }
    transaccionesEncontradas = transaccionesEncontradas.flat().filter(x => x !== null);
    let condition: boolean = transaccionesEncontradas.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró la transacción' } : transaccionesEncontradas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar la transacción', error: error });
  }
});

/**
 * Guarda una transacción en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción guardada o un mensaje de error
 */
transaccionRouter.post('/transactions', async (req, res) => {
  try {
    let idPersona = await personaModel.findOne({ id_: req.body.persona_ });
    let idMueble = await muebleModel.findOne({ id_: req.body.mueble_ });
    let model = null;
    let changedObj = {...req.body, idPersona: idPersona?._id, idMueble: idMueble?._id};
    switch (req.body.tipo_) {
      case 'devolucion':
        model = new devolucionModel(changedObj);
        break;
      case 'venta':
        model = new ventaModel(changedObj);
        break;
      default:
        model = new transaccionModel(changedObj);
        break;
    }
    await model.save();
    res.send(model);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar la transacción', error: error });
  }
});

/**
 * Actualiza una transacción de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción actualizada o un mensaje de error
 */
transaccionRouter.patch('/transactions', async (req, res) => {
  req.query = { ...req.query };
  try {
    let transaccionesActualizadas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = await model.updateMany(req.query, req.query.update);
      if (result) { transaccionesActualizadas.push(result); }
    }
    res.status(200).send(transaccionesActualizadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar la transacción', error: error });
  }
});

/**
 * Actualiza una transacción de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción actualizada o un mensaje de error
 */
transaccionRouter.patch('/transactions/:id', async (req, res) => {
  try {
    let transaccionesActualizadas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = await model.findOneAndUpdate({ id_: req.params.id }, req.body, { new: true, runValidators: true });
      if (result) { transaccionesActualizadas.push(result); }
    }
    res.status(200).send(transaccionesActualizadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar la transacción', error: error });
  }
});


/**
 * Elimina una transacción de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción eliminada o un mensaje de error
 */
transaccionRouter.delete('/transactions', async (req, res) => {
  req.query = { ...req.query };
  try {
    let transaccionesEliminadas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = await model.deleteMany(req.query);
      if (result) { transaccionesEliminadas.push(result); }
    }
    res.status(200).send(transaccionesEliminadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
  }
});

/**
 * Elimina una transacción de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción eliminada o un mensaje de error
 */
transaccionRouter.delete('/transactions/:id', async (req, res) => {
  try {
    let transaccionesEliminadas: TransaccionDocumentInterface[] = [];
    for (const model of models) {
      let result = await model.findOneAndDelete({ id_: req.params.id });
      if (result) { transaccionesEliminadas.push(result); }
    }
    res.status(200).send(transaccionesEliminadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
  }
});