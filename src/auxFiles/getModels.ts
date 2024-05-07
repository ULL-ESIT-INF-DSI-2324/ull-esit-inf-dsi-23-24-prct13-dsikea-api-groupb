
import { ventaModel } from '../models/transacciones/venta.js';
import { compraModel } from '../models/transacciones/compra.js'
import { devolucionModel } from '../models/transacciones/devolucion.js';
import { transaccionModel } from '../models/transacciones/transaccion.js';

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
