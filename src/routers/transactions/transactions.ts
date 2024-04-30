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
import { getModel } from '../../auxFiles/getModels.js'
import { TransaccionDocumentInterface } from '../../models/transacciones/transaccion.js';
import { handleGet, parseData, actualizarStock } from './functionsHandle.js';

// Importación de modelos
import { muebleModel } from '../../models/muebles/mueble.js';
import { transactionsModels } from '../../auxFiles/getModels.js';

// Declaración del router
export const transaccionRouter = Express.Router();
// let modelsPost: any[] = [compraModel, ventaModel];


/**
 * Busca una transacción en la base de datos haciendo uso de la QueryString
 * @returns {Object} - Objeto JSON con la transacción encontrada o un mensaje de error
 */
transaccionRouter.get('/transactions', handleGet);

/**
 * Busca una transacción en la base de datos haciendo uso del ID de manera dinámica
 * @returns {Object} - Objeto JSON con la transacción encontrada o un mensaje de error
 */
transaccionRouter.get('/transactions/:id', handleGet);

/**
 * Guarda una transacción en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con la transacción guardada o un mensaje de error
 */
transaccionRouter.post('/transactions', async (req, res) => {
  try {
    // Parsear y validar datos
    const { idPersona, importeTotal, mueblesCambiados } = await parseData(req);
    // Crear instancia del modelo de transacción
    const TransaccionModel = getModel(req.body.tipo_);
    const model = new TransaccionModel({
      persona: idPersona,
      importe: importeTotal,
      muebles: mueblesCambiados
    });
    // Guardar el modelo de transacción
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
    for (const model of transactionsModels) {
      let result = await model.updateMany(req.query, req.query.update);
      if (!result) { continue; }
      transaccionesActualizadas.push(result);
      // DE ESTA PARTE PARA ABAJO, XD NO ESTÁ IMPLEMENTADO EN REALIDAD, MUY XD TODO: PROBAR QUE SE APLICAN LOS STOCKS SI SE AUMENTA O DISMINUYE
      // CANTIDAD DE MUEBLES
      // Iteramos por los muebles de la transacción junto a sus cantidades
      for (const mueble of result.muebles_) {
        let idMueble = await muebleModel.findOne({ _id: mueble.muebleId });
        if (!idMueble) { continue; }
        await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ + mueble.cantidad });
      }
      let importeTotal: number = 0;
      let mueblesCambiados = [];
      for (const mueble of req.body.muebles_) {
        let idMueble = await muebleModel.findOne({ id_: mueble.muebleId });
        if (!idMueble) { continue; }
        if (mueble.tipo_ === 'venta' && idMueble.cantidad_ < mueble.cantidad) {
          throw new Error('No hay suficientes muebles en stock');
        }
        await muebleModel.findOneAndUpdate({ _id: mueble.muebleId._id }, { cantidad_: idMueble.cantidad_ - mueble.cantidad });
        importeTotal += idMueble!.precio_ * mueble.cantidad;
        mueblesCambiados.push({ muebleId: idMueble?._id, cantidad: mueble.cantidad });
      }
      transaccionesActualizadas.push(result);

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
    for (const model of transactionsModels) {
      // Actualización de la transacción
      let result = await model.findOneAndUpdate({ id_: req.params.id }, req.body, { new: true, runValidators: true });
      if (!result) { continue; }
      // DE ESTA PARTE PARA ABAJO, XD NO ESTÁ IMPLEMENTADO EN REALIDAD, MUY XD TODO: PROBAR QUE SE APLICAN LOS STOCKS SI SE AUMENTA O DISMINUYE
      // CANTIDAD DE MUEBLES
      // Iteramos por los muebles de la transacción junto a sus cantidades
      for (const mueble of result.muebles_) {
        let idMueble = await muebleModel.findOne({ _id: mueble.muebleId });
        if (!idMueble) { continue; }
        await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ + mueble.cantidad });
      }
      let importeTotal: number = 0;
      let mueblesCambiados = [];
      for (const mueble of req.body.muebles_) {
        let idMueble = await muebleModel.findOne({ id_: mueble.muebleId });
        if (!idMueble) { continue; }
        if (mueble.tipo_ === 'venta' && idMueble.cantidad_ < mueble.cantidad) {
          throw new Error('No hay suficientes muebles en stock');
        }
        await muebleModel.findOneAndUpdate({ _id: mueble.muebleId._id }, { cantidad_: idMueble.cantidad_ - mueble.cantidad });
        importeTotal += idMueble!.precio_ * mueble.cantidad;
        mueblesCambiados.push({ muebleId: idMueble?._id, cantidad: mueble.cantidad });
      }
      transaccionesActualizadas.push(result);
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
    for (const model of transactionsModels) {
      let result = await model.deleteMany(req.query);
      if (!result) { continue }
      // Iteramos sobre los muebles de la transacción que eliminamos para devolverlos al stock
      await actualizarStock(result, req);
      transaccionesEliminadas.push(result);
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
    for (const model of transactionsModels) {
      let result = await model.deleteMany({ id_: req.params.id });
      if (!result) { continue }
      // Iteramos sobre los muebles de la transacción que eliminamos para devolverlos al stock
      await actualizarStock(result, req);
      transaccionesEliminadas.push(result);
      model.save();
    }
    res.status(200).send(transaccionesEliminadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
  }
});

