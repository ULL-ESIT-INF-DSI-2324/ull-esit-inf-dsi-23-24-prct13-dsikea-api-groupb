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
import { Schema } from 'mongoose';
import { TransaccionDocumentInterface } from '../../models/transacciones/transaccion.js';
import { PersonaDocumentInterface } from '../../models/personas/persona.js';

// Importación de modelos
import { transactionsModels } from '../../auxFiles/getModels.js';
import { personaModel } from '../../models/personas/persona.js';
import { muebleModel } from '../../models/muebles/mueble.js';

type request = Express.Request<any>;
type response = Express.Response<any>;

// ------------------- GET -------------------

/**
 * Manejador de la petición GET a la ruta /transactions
 * @param req Request de la petición
 * @param res Response de la petición
 */
export async function handleGet(req : request, res: response) {
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

/**
 * Esta función busca las transacciones en la base de datos
 * @param req La petición
 * @returns Transacciones encontradas
 */
export async function getFoundTransactions(req : request) {
  let transaccionesEncontradas: TransaccionDocumentInterface[] = [];
  for (const model of transactionsModels) {
    let result = null;
    if (req.params.id) {
      result = req.params.id === "-1" ? await model.find() : await model.findOne({ id_: req.params.id });
    } else {
      result = await model.find(req.query);
    }
    transaccionesEncontradas.push(result!);
  }
  transaccionesEncontradas = transaccionesEncontradas.flat().filter(x => x !== null);
  if (transaccionesEncontradas.length === 0) {
    throw new Error('No se encontró ninguna transacción.');
  }
  return transaccionesEncontradas;
}

// ------------------- POST -------------------

/**
 * Este método se encarga de parsear los datos de la transacción
 * @param body Transacción a parsear
 * @returns Datos de la transacción
 */
export async function parseData(req: request) {
  const objPersona : PersonaDocumentInterface | null = await personaModel.findOne({ id_: req.body.persona_ });
  console.log("MIAU");
  if (!objPersona) {
    console.log("no ha encontrado la persona")
    throw new Error(`No se encontró la persona ${req.body.persona_}`);
  }
  let idPersona = objPersona._id;  
  let importeTotal = 0;
  let mueblesCambiados: {muebleId: Schema.Types.ObjectId,  cantidad: number}[] = [];
  for (const mueble of req.body.muebles_) {
    console.log("MIAU MIAU");
    const idMueble = await muebleModel.findOne({ nombre_: mueble.muebleId });
    console.log(idMueble!._id)
    if (!idMueble) { continue; }
    // Si la transacción es de venta y no hay suficientes unidades en stock, se lanza un error
    if (idMueble.cantidad_ < mueble.cantidad) {
      throw new Error(`No hay suficientes unidades de ${mueble.muebleId} en stock`);
    }
    // Actualizar cantidad de muebles y calcular importe total
    await muebleModel.findOneAndUpdate({ _id: idMueble._id }, { cantidad_: idMueble.cantidad_ - mueble.cantidad });
    importeTotal += idMueble!.precio_ * mueble.cantidad;
    mueblesCambiados.push({ muebleId: idMueble?._id, cantidad: mueble.cantidad });
  }
  console.log({ idPersona, importeTotal, mueblesCambiados });
  return { idPersona, importeTotal, mueblesCambiados };
}

// ------------------- DELETE -------------------
/**
 * Esta función se encarga de actualizar el stock de los muebles tras eliminar una transacción
 * @param result The result of the deleteMany query
 * @param req The request object
 */
export async function actualizarStock(result : TransaccionDocumentInterface, req : request) {
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