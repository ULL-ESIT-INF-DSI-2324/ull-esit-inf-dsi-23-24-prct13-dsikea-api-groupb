import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { sillaModel } from '../src/models/muebles/silla.js';
import { clienteModel } from '../src/models/personas/cliente.js';
import { transaccionModel } from '../src/models/transacciones/transaccion.js';

//Base de Datos inicial
const primeraSilla = {
  id_: 1,
  nombre_: "silla inicial de prueba",
  descripcion_: "silla de prueba.",
  material_: "madera",
  dimensiones_: {
    alto: 80,
    ancho: 40,
    largo: 40
  },
  precio_: 1000,
  tipo_: "silla",
  color_: "blanco",
  respaldo_: true,
  reposabrazos_: false,
  cantidad_: 3
};

const segundaSilla = {
  id_: 2,
  nombre_: "segunda silla inicial",
  descripcion_: "silla para exteriores.",
  material_: "madera",
  dimensiones_: {
    alto: 80,
    ancho: 40,
    largo: 40
  },
  precio_: 1000,
  tipo_: "silla",
  color_: "blanco",
  respaldo_: true,
  reposabrazos_: false,
  cantidad_: 3
};


const primerCliente = {
  id_: "79097084A",
  nombre_: 'Juan',
  contacto_: 678901234,
  direccion_: 'Calle Falsa,9,1,7'
};


describe('POST /transactions', () => {
  before(async () => {
    await new clienteModel(primerCliente).save();
    await new sillaModel(primeraSilla).save();
    await new sillaModel(segundaSilla).save();
  });
  it('Debería crear una transacción nueva', async () => {
    const response = await request(app).post('/transactions').send({
      id_: 1,
      fechainicio_: "02/02/2023",
      fechafin_: "03/03/2024",
      importe_: 10,
      muebles_: [{ "muebleId": "silla inicial de prueba", "cantidad": 2 }],
      persona_: "79097084A",
      tipo_: "venta"
    });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id_');
    expect(response.body).to.have.property('fechainicio_');
    expect(response.body).to.have.property('fechafin_');
    expect(response.body).to.have.property('importe_');
    expect(response.body).to.have.property('muebles_');
    expect(response.body).to.have.property('persona_');
    expect(response.body).to.have.property('tipo_');
  });

  it('Debería crear una transacción nueva', async () => {
    const response = await request(app).post('/transactions').send({
      id_: 2,
      fechainicio_: "02/02/2023",
      fechafin_: "03/03/2024",
      importe_: 10,
      muebles_: [{ "muebleId": "segunda silla inicial", "cantidad": 1 }],
      persona_: "79097084A",
      tipo_: "compra"
    });
    expect(response.body).to.have.property('id_');
    expect(response.body).to.have.property('fechainicio_');
    expect(response.body).to.have.property('fechafin_');
    expect(response.body).to.have.property('importe_');
    expect(response.body).to.have.property('muebles_');
    expect(response.body).to.have.property('persona_');
    expect(response.body).to.have.property('tipo_');
  });

  it('Debería retornar 500 si la petición no es válida', async () => {
    const response = await request(app).post('/transactions').send({
      fechainicio_: "02/02/2023",
      fechafin_: "03/03/2024",
      importe_: 10,
      persona_: "99097084A",
      tipo_: "venta"
    });
    expect(response.status).to.equal(500);
    expect(response.body).to.include({ msg: 'Error al guardar la transacción' });
  });
});

describe('GET /transactions', () => {
  it('Debería devolver todas las transacciones', async () => {
    const response = await request(app).get('/transactions');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.lengthOf(2);
  });
  it('Debería devolver una transacción a partir de un id específico', async () => {
    const response = await request(app).get('/transactions/1');
    expect(response.body[0]).to.have.property('id_');
    expect(response.status).to.equal(200);
  });

  it('Debería devolver un error 404 si no se encuentra la transacción', async () => {
    const response = await request(app).get('/transactions/99');
    expect(response.status).to.equal(404);
    expect(response.body).to.include({ msg: 'Error al buscar la transacción' });
  });
  it('Debería devolver un error 404 si no se encuentra la transacción', async () => {
    const response = await request(app).get('/transactions/999');
    expect(response.status).to.equal(404);
    expect(response.body).to.include({ msg: 'Error al buscar la transacción' });
  });

});

describe('PATCH /transactions', () => {
  it('Debería actualizar una transacción a partir del id', async () => {
    const response = await request(app).patch('/transactions/2').send({
      importe_: 10,
    });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('importe_');
  });
  it('Debería devolver un error 404 si no se encuentra la transacción', async () => {
    const response = await request(app).patch('/transactions/999');
    expect(response.status).to.equal(404);
    expect(response.body).to.include({ msg: 'Transacción no encontrada' });
  });
  it('Debería actualizar una transacción a partir del id', async () => {
    const response = await request(app).patch('/transactions/2').send({
      muebles_: [{ muebleId: 'segunda silla inicial', cantidad: 1}]
    });
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('muebles_');
  });
});

describe('Average /transactions', () => {
  it('debería devolver todas las transacciones', async () => {
    const response = await request(app).get('/transactions/balance');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('balance');
  });
});

describe('DELETE /transactions', () => {
  after(async () => {
    await clienteModel.deleteMany();
    await sillaModel.deleteMany();
    await transaccionModel.deleteMany();
  });
  it('Debería eliminar una transacción por id', async () => {
    const response = await request(app).delete('/transactions/2');
    expect(response.status).to.equal(200);
  });
  it('Debería devolver un error 404 si no se encuentra la transacción', async () => {
    const response = await request(app).delete('/transactions/999');
    expect(response.status).to.equal(404);
  });
});

