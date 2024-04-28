import request from 'supertest';
import { app } from '../src/index.js';
import { expect } from 'chai';
import { describe, it } from 'mocha';
import { proveedorModel } from '../src/models/personas/proveedor.js';


//Base de Datos inicial
const primerProveedor = {
  id_: "79097081A",
  nombre_: 'Juan',
  contacto_: 678901234,
  direccion_: 'Calle Falsa,9,1,7'
};

const segundoProveedor = {
  id_: "79097082A",
  nombre_: 'Pedro',
  contacto_: 678901235,
  direccion_: 'Calle Falsa,10,2,8'
};

const tercerProveedor = {
  id_: "79097083A",
  nombre_: 'Pablo',
  contacto_: 678901236,
  direccion_: 'Calle Falsa,11,3,9'
};


//Hooks
before(async () => {
  await new proveedorModel(primerProveedor).save();
  await new proveedorModel(segundoProveedor).save();
  await new proveedorModel(tercerProveedor).save();
});

after(async () => {
  await proveedorModel.deleteMany({});
});

//Tests

describe('GET /providers', () => {
  it('Debería retornar todos los providers', async () => {
    const res = await request(app).get('/providers');
    expect(res.status).to.equal(200);
    expect(res.body).to.have.lengthOf(3);
  });

  it('Debería retornar un proveedor con un id específico', async () => {
    const res = await request(app).get(`/providers/79097081A`);
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('nombre_', primerProveedor.nombre_);

  });

  it('Debería retornar un error 404 si el proveedor no existe', async () => {
    const res = await request(app).get('/providers/12345678A');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      msg: 'No se encontró el proveedor'
    });
  });

  it('Debería retornar un error 500 si el id no es un número', async () => {
    const res = await request(app).get('/providers/abc');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      msg: 'No se encontró el proveedor'
    });
  });

  it('Debería retornar un error 500 si el id es negativo', async () => {
    const res = await request(app).get('/providers/-123');
    expect(res.status).to.equal(404);
    expect(res.body).to.include({
      msg : 'No se encontró el proveedor'
    });
  });
});


describe('POST /providers', () => {
  it('Debería guardar un proveedor en la base de datos', async () => {
    const res = await request(app)
      .post('/providers')
      .send({
        id_: "79097084A",
        nombre_: 'Jose',
        contacto_: 678901237,
        direccion_: 'Calle Falsa,12,4,10'
      });
    expect(res.status).to.equal(200);
    expect(res.body).to.have.property('_id');
    expect(res.body).to.have.property('nombre_', 'Jose');
    expect(res.body).to.have.property('contacto_', 678901237);
    expect(res.body).to.have.property('direccion_', 'Calle Falsa,12,4,10');

    const proveedorCreado = await proveedorModel.findById(res.body._id);
    expect(proveedorCreado).to.not.be.null;
    expect(proveedorCreado!.nombre_).to.equal('Jose');
    expect(proveedorCreado!.contacto_).to.equal(678901237);
    expect(proveedorCreado!.direccion_).to.equal('Calle Falsa,12,4,10');
  });
});