import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { clienteModel } from '../src/models/personas/cliente.js';


//Base de Datos inicial
const primerCliente = {
  id_: "11111111A",
  nombre_: 'Juan',
  contacto_: 678901234,
  direccion_: 'Calle Falsa,9,1,7'
};

const segundoCliente = {
  id_: "11111111B",
  nombre_: 'Pedro',
  contacto_: 678901235,
  direccion_: 'Calle Falsa,10,2,8'
};

const tercerCliente = {
  id_: "11111111C",
  nombre_: 'Pablo',
  contacto_: 678901236,
  direccion_: 'Calle Falsa,11,3,9'
};


//Hooks
before(async () => {
  await new clienteModel(primerCliente).save();
  await new clienteModel(segundoCliente).save();
  await new clienteModel(tercerCliente).save();
});

after(async () => {
  await clienteModel.deleteMany({});
});


//Tests

describe('GET /customers', () => {
  it('Debería retornar todos los clientes', async () => {
    const res = await request(app).get('/customers');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.lengthOf(3);
  });

  it('Debería retornar un cliente con un id específico', async () => {
    const res = await request(app).get(`/customers/11111111A`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', primerCliente.nombre_);

  });

  it('Debería retornar un error 404 si el cliente no existe', async () => {
    const res = await request(app).get('/customers/12345678A');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró el cliente'});
  });
});


describe('POST /customers', () => {
  it('Debería guardar un cliente en la base de datos', async () => {
    const cliente = {
      id_: "11111111D",
      nombre_: 'Antonio',
      contacto_: 678901237,
      direccion_: 'Calle Falsa,12,4,10'
    };
    const res = await request(app).post('/customers').send(cliente);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', cliente.nombre_);
  });

    it('Debería retornar un error 500 si el cliente ya existe', async () => {
      const res = await request(app).post('/customers').send(primerCliente);
      expect(res.status).to.equal(500);
      expect(res.body).to.include({ msg: 'Error al guardar el cliente'});
    });
});


describe('PATCH /customers', () => {
  it('Debería actualizar un cliente de la base de datos (QueryString)', async () => {
    const res = await request(app).patch('/customers?id_=11111111A').send({ nombre_: 'Juanito' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', 'Juanito');
  });

  it('Debería retornar un error 404 si el cliente no existe (QueryString)', async () => {
    const res = await request(app).patch('/customers?id_=12345678A').send({ nombre_: 'Juanito' });
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró el cliente'});
  });

  it('Debería actualizar un cliente de la base de datos (Id dinámico)', async () => {
    const res = await request(app).patch('/customers/11111111B').send({ nombre_: 'Pedrito' });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', 'Pedrito');
  });
  it('Debería retornar un error 404 si el cliente no existe (Id dinámico)', async () => {
    const res = await request(app).patch('/customers/12345678A').send({ nombre_: 'Pedrito' });
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró el cliente'});
  });
  it('Se pueden acutalizar otros campos como el contacto (QueryString)', async () => {
    const res = await request(app).patch('/customers?id_=11111111C').send({ contacto_: 678901236 });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('contacto_', 678901236);
  });
});

describe('DELETE /customers', () => {
  it('Debería eliminar un cliente de la base de datos (QueryString)', async () => {
    const res = await request(app).delete('/customers?id_=11111111A');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', 'Juanito');
    const clienteEliminado = await clienteModel.findOne({ id_: '11111111A' });
    expect(clienteEliminado).to.be.null;
  });

  it('Debería retornar un error 404 si el cliente no existe (QueryString)', async () => {
    const res = await request(app).delete('/customers??id_=12345678A');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró el cliente'});
  });

  it('Debería eliminar un cliente de la base de datos (Id dinámico)', async () => {
    const res = await request(app).delete('/customers/11111111B');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', 'Pedrito');
    const clienteEliminado = await clienteModel.findOne({ id_: '11111111B' });
    expect(clienteEliminado).to.be.null;
  });

  it('Debería retornar un error 404 si el cliente no existe (Id dinámico)', async () => {
    const res = await request(app).delete('/customers/12345678A');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({ msg: 'No se encontró el cliente'});
  });

  it('Debería eliminar un cliente de la base de datos (Id dinámico)', async () => {
    const res = await request(app).delete('/customers/11111111C');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', 'Pablo');
    const clienteEliminado = await clienteModel.findOne({ id_: '11111111C' });
    expect(clienteEliminado).to.be.null;
  });
});