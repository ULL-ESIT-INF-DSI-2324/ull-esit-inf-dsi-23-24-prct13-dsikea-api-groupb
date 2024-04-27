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
import { clienteModel } from '../models/personas/cliente.js';
import { PersonaDocumentInterface } from '../models/personas/persona.js';

// Declaración del router
export const customersRouter = Express.Router();

/**
 * Busca un cliente en la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente encontrado o un mensaje de error
 */
customersRouter.get('/customers', async (req, res) => {
  req.query = { ...req.query };
  // console.log(req.query);
  try {
    let clientesEncontrados: PersonaDocumentInterface[] = [await clienteModel.find(req.query)];
    clientesEncontrados = clientesEncontrados.flat().filter(x => x !== null);
    let condition: boolean = clientesEncontrados.length === 0;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clientesEncontrados);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
  }
});

/**
 * Busca un cliente en la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente encontrado o un mensaje de error
 */
customersRouter.get('/customers/:id', async (req, res) => {
  try {
    let clienteEncontrado = await clienteModel.findOne({ id_: req.params.id });
    let condition: boolean = clienteEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar el cliente', error: error });
  }
});


/**
 * Guarda un cliente en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente guardado o un mensaje de error
 */
customersRouter.post('/customers', async (req, res) => {
  try {
    const cliente = new clienteModel(req.body);
    await cliente.save();
    res.send(cliente);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar el cliente', error: error });
  }
});

/**
 * Actualiza un cliente de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
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

/**
 * Actualiza un cliente de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente actualizado o un mensaje de error
 */
customersRouter.patch('/customers/:id', async (req, res) => {
  try {
    const clienteActualizado = await clienteModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
    let condition: boolean = clienteActualizado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteActualizado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar el cliente', error: error });
  }
});

/**
 * Elimina un cliente de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
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

/**
 * Elimina un cliente de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el cliente eliminado o un mensaje de error
 */
customersRouter.delete('/customers/:id', async (req, res) => {
  try {
    const clienteEliminado = await clienteModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = clienteEliminado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el cliente' } : clienteEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar el cliente', error: error });
  }
});