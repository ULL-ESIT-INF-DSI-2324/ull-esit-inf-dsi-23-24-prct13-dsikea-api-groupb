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
import { proveedorModel } from '../models/personas/proveedor.js';
import { PersonaDocumentInterface } from '../models/personas/persona.js';

// Declaración del router
export const providersRouter = Express.Router();

/**
 * Busca un proveedor en la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
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

/**
 * Busca un proveedor en la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor encontrado o un mensaje de error
 */
providersRouter.get('/providers/:id', async (req, res) => {
  try {
    let proveedorEncontrado = await proveedorModel.findOne({ id_: req.params.id });
    let condition: boolean = proveedorEncontrado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorEncontrado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al buscar el proveedor', error: error });
  }
});

/**
 * Guarda un proveedor en la base de datos
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor guardado o un mensaje de error
 */
providersRouter.post('/providers', async (req, res) => {
  try {
    const proveedor = new proveedorModel(req.body);
    await proveedor.save();
    res.send(proveedor);
  } catch (error) {
    res.status(500).send({ msg: 'Error al guardar el proveedor', error: error });
  }
});

/**
 * Actualiza un proveedor de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
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

/**
 * Actualiza un proveedor de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor actualizado o un mensaje de error
 */
providersRouter.patch('/providers/:id', async (req, res) => {
  try {
    const proveedorActualizado = await proveedorModel.findOneAndUpdate({ id_: req.params.id }, req.body , { new: true, runValidators: true});
    let condition: boolean = proveedorActualizado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorActualizado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al actualizar el proveedor', error: error });
  }
});

/**
 * Elimina un proveedor de la base de datos haciendo uso de la QueryString
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor eliminado o un mensaje de error
 */
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

/**
 * Elimina un proveedor de la base de datos haciendo uso del ID de manera dinámica
 * @param {Object} req - Objeto de petición
 * @param {Object} res - Objeto de respuesta
 * @returns {Object} - Objeto JSON con el proveedor eliminado o un mensaje de error
 */
providersRouter.delete('/providers/:id', async (req, res) => {
  try {
    const proveedorEliminado = await proveedorModel.findOneAndDelete({ id_: req.params.id });
    let condition: boolean = proveedorEliminado === null;
    res.status(condition ? 404 : 200).send(condition ? { msg: 'No se encontró el proveedor' } : proveedorEliminado);
  } catch (error) {
    res.status(500).send({ msg: 'Error al eliminar el proveedor', error: error });
  }
});