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
import { compraModel } from '../models/transacciones/compra.js'

// Declaración del router
export const transaccionRouter = Express.Router();
let models: any[] = [devolucionModel, ventaModel, transaccionModel,];
// let modelsPost: any[] = [compraModel, ventaModel];

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
    // TODO: Validar que la persona y el mueble existen con los validadores de mongoose
    // Parse de los datos
    let idPersona = await personaModel.findOne({ id_: req.body.persona_ });
    let importeTotal: number = 0;
    let mueblesCambiados = [];
    for (const mueble of req.body.muebles_) {
      let idMueble = await muebleModel.findOne({ id_: mueble.muebleId });
      if (!idMueble) { continue; }
      // Si es una venta, debe haber suficientes muebles en stock  ----> Esto debería estar en el validador de mongoose ¡Arreglar!
      if (mueble.tipo_ === 'venta' && idMueble.cantidad_ < mueble.cantidad) {
        throw new Error('No hay suficientes muebles en stock');
      }
      // Actualización de la cantidad de muebles, importe total y array de muebles cambiados
      await muebleModel.findOneAndUpdate({ _id: mueble.muebleId._id }, { cantidad_: idMueble.cantidad_ - mueble.cantidad });
      importeTotal += idMueble!.precio_ * mueble.cantidad;
      mueblesCambiados.push({ muebleId: idMueble?._id, cantidad: mueble.cantidad });
    }
    // Modificación del Body Original
    let changedObj = { ...req.body };
    changedObj.persona_ = idPersona;
    changedObj.importe_ = importeTotal;
    changedObj.muebles_ = mueblesCambiados;
    // En función del tipo de transacción se crea un modelo u otro
    let model = null;
    console.log(changedObj);
    switch (req.body.tipo_) {
      case 'compra':
        model = new compraModel(changedObj);
        break;
      case 'venta':
        model = new ventaModel(changedObj);
        break;
      default:
        throw new Error('Tipo de transacción no soportado');
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
    for (const model of models) {
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
    for (const model of models) {
      let result = await model.deleteMany(req.query);
      if (!result) { continue }
      // Iteramos sobre los muebles de la transacción que eliminamos para devolverlos al stock
      for (const mueble of result.muebles_) {
        let idMueble = await muebleModel.findOne({ _id: mueble.muebleId });
        if (!idMueble) { continue; }
        // Si la transacción era una venta, devolvemos los muebles al stock
        if (mueble.tipo_ === 'venta') {
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ + mueble.cantidad }, { new: true, runValidators: true });
        } else {
          // Si la transacción era una compra, quitamos los muebles del stock
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ - mueble.cantidad }, { new: true, runValidators: true });
        }
      }
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
    for (const model of models) {
      let result = await model.deleteMany({ id_: req.params.id });
      if (!result) { continue }
      // Iteramos sobre los muebles de la transacción que eliminamos para devolverlos al stock
      for (const mueble of result.muebles_) {
        let idMueble = await muebleModel.findOne({ _id: mueble.muebleId });
        if (!idMueble) { continue; }
        // Si la transacción era una venta, devolvemos los muebles al stock
        if (mueble.tipo_ === 'venta') {
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ + mueble.cantidad }, { new: true, runValidators: true });
        } else {
          // Si la transacción era una compra, quitamos los muebles del stock
          await muebleModel.findOneAndUpdate({ _id: mueble.muebleId }, { cantidad_: idMueble.cantidad_ - mueble.cantidad }, { new: true, runValidators: true });
        }
      }
      transaccionesEliminadas.push(result);
    }
    res.status(200).send(transaccionesEliminadas);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar la transacción', error: error });
  }
});