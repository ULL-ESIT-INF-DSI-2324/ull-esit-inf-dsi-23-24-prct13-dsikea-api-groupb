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
    req.body.muebles_ = mueblesCambiados;
    req.body.persona_ = idPersona;
    // Crear instancia del modelo de transacción
    const TransaccionModel = getModel(req.body.tipo_);
    const model = new TransaccionModel({
      persona_: idPersona,
      importe_: importeTotal,
      muebles_: mueblesCambiados,
      ...req.body 
    });
    console.log(model)
    // Guardar el modelo de transacción
    await model.save();
    res.send(model);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar la transacción', error: error });
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
        let diferencia =  mueble.cantidad - transaccionAModificar.muebles_.find({muebleId: muebleEncontrado._id}).cantidad;
        // Se tienen en cuenta
        if (req.body.tipo_ === 'venta') {
          // Si la diferencia es menor que 0, se añaden los muebles al stock., en caso contrario, se suman          
          diferencia > 0 ? muebleEncontrado.cantidad_ -= diferencia : muebleEncontrado.cantidad_ += diferencia;   
          diferencia > 0 ? transaccionAModificar.importe_ -= muebleEncontrado.precio_ * diferencia : transaccionAModificar.importe_ += muebleEncontrado.precio_ * Math.abs(diferencia);
          // Se comprueba que la cantidad de muebles en stock sea mayor o igual a 0, en caso contrario, se lanza un error
          if (muebleEncontrado.cantidad_ < 0) {
            throw new Error('No hay suficientes muebles en stock');
          }
        } else if (req.body.tipo_ === 'compra') {
          // Si la diferencia es mayor que 0, se añaden los muebles al stock., en caso contrario, se restan
          diferencia > 0 ? muebleEncontrado.cantidad_ += diferencia : muebleEncontrado.cantidad_ -= diferencia;
          diferencia > 0 ? transaccionAModificar.importe_ += muebleEncontrado.precio_ * diferencia : transaccionAModificar.importe_ -= muebleEncontrado.precio_ * Math.abs(diferencia);
        }
        // Se guarda el mueble
        muebleEncontrado.save();
      }
    }
    // Se borra del body los muebles, ya que no se pueden actualizar
    delete req.body.muebles_;
    // Se actualiza la transacción
    transaccionAModificar = await transactionsModels[0].findOneAndUpdate({ id_: req.params.id}, req.body, {new: true, runValidators: true});
    transaccionAModificar.save();
    res.status(200).send(transaccionAModificar);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar la transacción', error: error });
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
