import request from 'supertest';
import { app } from '../src/index.js';
import { sillaModel } from '../src/models/muebles/silla.js';
import { mesaModel } from '../src/models/muebles/mesa.js';
import { armarioModel } from '../src/models/muebles/armario.js';
import { expect } from 'chai';
import { muebleModel } from '../src/models/muebles/mueble.js';

// Base de Datos inicial
const primeraSilla = {
  id_: 99,
  nombre_: "silla inicial",
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
  reposabrazos_: false
};

const segundaSilla = {
    id_: 98,
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
    reposabrazos_: false
    };

const primeraMesa = {
    id_: 100,
    nombre_: "mesa inicial",
    descripcion_: "mesa de prueba.",
    material_: "madera",
    dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
    },
    precio_: 1000,
    tipo_: "mesa",
    color_: "blanco",
    extensible_: false,
    sillas_: 4
};    


// Hooks
before(async () => {
  await new sillaModel(primeraSilla).save();
  await new sillaModel(segundaSilla).save();
  await new mesaModel(primeraMesa).save();
});

after(async () => {
  await sillaModel.deleteOne({ nombre_: 'silla de verano' }); 
  await mesaModel.deleteOne({ nombre_: 'mesa de terraza' });
  await armarioModel.deleteOne({ nombre_: 'armario de verano' });
  await sillaModel.deleteOne({ nombre_: 'silla inicial' });
  await mesaModel.deleteOne({ nombre_: 'mesa inicial' });
  await sillaModel.deleteOne({ nombre_: 'segunda silla inicial' });
  await sillaModel.deleteOne({ id_: 99 });
  await mesaModel.deleteOne({ id_: 100 });
});


describe('GET /furnitures', () => {
    it('Debería obtener todas las sillas', async () => {
        const response = await request(app).get('/furnitures').query({ tipo_: 'silla' }).expect(200);
        expect(response.body).to.have.lengthOf(2);
    });
    
    it('Debería obtener todas las mesas', async () => {
        const response = await request(app).get('/furnitures').query({ tipo_: 'mesa' }).expect(200);
        expect(response.body).to.have.lengthOf(1);
    });
    
    it('Debería obtener todos los armarios', async () => {
        const response = await request(app).get('/furnitures').query({ tipo_: 'armario' }).expect(404);
        expect(response.body).to.include({
            msg : 'No se encontró el mueble'
            });
    });
    
    it('No debería obtener ningún mueble con un tipo no válido', async () => {
        const response = await request(app).get('/furnitures').query({ tipo_: 'sillon' }).expect(404);
        expect(response.body).to.include({
        msg : 'No se encontró el mueble'
        });
    });

    it('Si no se especifica el tipo devuelve toda la Base de Datos', async () => {
        const response = await request(app).get('/furnitures').expect(200);
        expect(response.body).to.have.lengthOf(3);
    });

    it('Debería obtener una silla con un id específico', async () => {
        const response = await request(app).get('/furnitures/99').expect(200);
        expect(response.body).to.have.lengthOf(1);
    });

    it('Debería obtener un mensaje de error si el id no existe', async () => {
        const response = await request(app).get('/furnitures/9999999').expect(404);
        expect(response.body).to.include({
            msg : 'No se encontró el mueble'
        });
    });

    it(' Debería devolver toda la Base de Datos si el id es -1', async () => {
        const response = await request(app).get('/furnitures/-1').expect(200);
        expect(response.body).to.have.lengthOf(3);
    });
});



describe('POST /furnitures', () => {
  it("Debería crearse una silla correctamente", async () => {  
    const response = await request(app).post('/furnitures').send({
      id_: 10,
      nombre_: "silla de verano",
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
      reposabrazos_: false
    }).expect(200);

    const sillaCreada = await sillaModel.findById(response.body._id);
    expect(sillaCreada).not.to.be.null;
    expect(sillaCreada!.nombre_).to.equal('silla de verano');
    expect(sillaCreada!.descripcion_).to.equal('silla para exteriores.');
    expect(sillaCreada!.material_).to.equal('madera');
    expect(sillaCreada!.dimensiones_.alto).to.equal(80);
    expect(sillaCreada!.dimensiones_.ancho).to.equal(40);
    expect(sillaCreada!.dimensiones_.largo).to.equal(40);
    expect(sillaCreada!.precio_).to.equal(1000);
    expect(sillaCreada!.tipo_).to.equal('silla');
    expect(sillaCreada!.color_).to.equal('blanco');
    expect(sillaCreada!.respaldo_).to.be.true;
    expect(sillaCreada!.reposabrazos_).to.be.false;
  });

  it('No se crea correctamente un silla sin especificar el respaldo', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 11,
      nombre_: "silla de verano",
      descripcion_: "Silla para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "silla",
      color_: "blanco",
      reposabrazos_: false
    }).expect(500);

    expect(response.body).to.include({
      msg : 'Error al guardar el mueble'
    });
  });

  it('No se crea correctamente un silla sin especificar el reposabrazos', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 12,
      nombre_: "silla de verano",
      descripcion_: "Silla para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "silla",
      color_: "blanco",
      respaldo_: true
    }).expect(500);
    
    expect(response.body).to.include({
      msg : 'Error al guardar el mueble'
    });
  });

  it('No se crea correctamente un silla sin especificar el color', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 13,
      nombre_: "silla de verano",
      descripcion_: "Silla para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "silla",
      respaldo_: true,
      reposabrazos_: false
    }).expect(500);
    
    expect(response.body).to.include({
      msg : 'Error al guardar el mueble'
    });
  });

  it('No se crea correctamente un mueble sin especificar el tipo', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 14,
      nombre_: "silla de verano",
      descripcion_: "Silla para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      color_: "blanco",
      respaldo_: true,
      reposabrazos_: false
    }).expect(400);

    expect(response.body).to.include({
      msg : 'Tipo de mueble no válido' 
    });
  });

  it('No se crea correctamente un mueble sin especificar un tipo válido', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 15,
      nombre_: "silla de verano",
      descripcion_: "Silla para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "sillon",
      color_: "blanco",
      respaldo_: true,
      reposabrazos_: false
    }).expect(400);

    expect(response.body).to.include({
      msg : 'Tipo de mueble no válido' 
    });
  });

  it ('Se crea correctamente una mesa', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 16,
      nombre_: "mesa de terraza",
      descripcion_: "Mesa para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "mesa",
      color_: "blanco",
      extensible_: false,
      sillas_: 4
    }).expect(200);

    const mesaCreada = await mesaModel.findById(response.body._id);
    expect(mesaCreada).not.to.be.null;
    expect(mesaCreada!.nombre_).to.equal('mesa de terraza');
    expect(mesaCreada!.descripcion_).to.equal('mesa para exteriores.');
    expect(mesaCreada!.material_).to.equal('madera');
    expect(mesaCreada!.dimensiones_.alto).to.equal(80);
    expect(mesaCreada!.dimensiones_.ancho).to.equal(40);
    expect(mesaCreada!.dimensiones_.largo).to.equal(40);
    expect(mesaCreada!.precio_).to.equal(1000);
    expect(mesaCreada!.tipo_).to.equal('mesa');
    expect(mesaCreada!.color_).to.equal('blanco');
    expect(mesaCreada!.extensible_).to.be.false;
    expect(mesaCreada!.sillas_).to.equal(4);
  });

  it('No se crea correctamente una mesa sin especificar si es extensible', async () => {
    const response = await request(app).post('/furnitures').send({
        id_: 17,
        nombre_: "mesa de terraza",
        descripcion_: "Mesa para exteriores.",
        material_: "madera",
        dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
        },
        precio_: 1000,
        tipo_: "mesa",
        color_: "blanco",
        sillas_: 4
    }).expect(500);
    
    expect(response.body).to.include({
        msg : 'Error al guardar el mueble'
    });
  });

  it('No se crea correctamente una mesa sin especificar el número de sillas', async () => {
    const response = await request(app).post('/furnitures').send({
    id_: 18,
    nombre_: "mesa de terraza",
    descripcion_: "Mesa para exteriores.",
    material_: "madera",
    dimensiones_: {
      alto: 80,
      ancho: 40,
      largo: 40
    },
    precio_: 1000,
    tipo_: "mesa",
    color_: "blanco",
    extensible_: false
    }).expect(500);

    expect(response.body).to.include({
      msg : 'Error al guardar el mueble'
    });
  });

  it('No se crea correctamente un mueble sin especificar el color', async () => {
    const response = await request(app).post('/furnitures').send({
      id_: 19,
      nombre_: "mesa de terraza",
      descripcion_: "Mesa para exteriores.",
      material_: "madera",
      dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
      },
      precio_: 1000,
      tipo_: "mesa",
      extensible_: false,
      sillas_: 4
    }).expect(500);
    
    expect(response.body).to.include({
        msg : 'Error al guardar el mueble'
    });
  });

it('Se crea correctamente un armario', async () => {
    const response = await request(app).post('/furnitures').send({
        id_: 20,
        nombre_: "armario de verano",
        descripcion_: "Armario para exteriores.",
        material_: "madera",
        dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
        },
        precio_: 1000,
        tipo_: "armario",
        color_: "blanco",
        puertas_: 2,
        cajones_: true
    }).expect(200);
    
    const armarioCreado = await armarioModel.findById(response.body._id);
    expect(armarioCreado).not.to.be.null;
    expect(armarioCreado!.nombre_).to.equal('armario de verano');
    expect(armarioCreado!.descripcion_).to.equal('armario para exteriores.');
    expect(armarioCreado!.material_).to.equal('madera');
    expect(armarioCreado!.dimensiones_.alto).to.equal(80);
    expect(armarioCreado!.dimensiones_.ancho).to.equal(40);
    expect(armarioCreado!.dimensiones_.largo).to.equal(40);
    expect(armarioCreado!.precio_).to.equal(1000);
    expect(armarioCreado!.tipo_).to.equal('armario');
    expect(armarioCreado!.color_).to.equal('blanco');
    expect(armarioCreado!.puertas_).to.equal(2);
    expect(armarioCreado!.cajones_).to.equal(true);
});

it('No se crea correctamente un armario sin especificar el número de puertas', async () => {
    const response = await request(app).post('/furnitures').send({
        id_: 21,
        nombre_: "armario de verano",
        descripcion_: "Armario para exteriores.",
        material_: "madera",
        dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
        },
        precio_: 1000,
        tipo_: "armario",
        color_: "blanco",
        cajones_: true
    }).expect(500);
    
    expect(response.body).to.include({
        msg : 'Error al guardar el mueble'
    });
});

it('No se crea correctamente un armario sin especificar si tiene cajones', async () => {
    const response = await request(app).post('/furnitures').send({
        id_: 22,
        nombre_: "armario de verano",
        descripcion_: "Armario para exteriores.",
        material_: "madera",
        dimensiones_: {
        alto: 80,
        ancho: 40,
        largo: 40
        },
        precio_: 1000,
        tipo_: "armario",
        color_: "blanco",
        puertas_: 2
    }).expect(500);
    
    expect(response.body).to.include({
        msg : 'Error al guardar el mueble'
    });
  });  
});



describe('PATCH /furnitures', () => {
    it('Debería actualizar una silla correctamente (query string)', async () => {
        const response = await request(app).patch('/furnitures').query({ id_: 99 }).send({
            nombre_: 'silla de verano',
            descripcion_: 'silla para exteriores.',
            material_: 'vidrio',
            dimensiones_: {
                alto: 80,
                ancho: 40,
                largo: 40
            },
            precio_: 1000,
            tipo_: 'silla',
            color_: 'blanco',
            respaldo_: true,
            reposabrazos_: false
        }).expect(200);
  
        const sillaActualizada = await sillaModel.findById(response.body._id);
        expect(sillaActualizada).not.to.be.null;
        expect(sillaActualizada!.nombre_).to.equal('silla de verano');
        expect(sillaActualizada!.descripcion_).to.equal('silla para exteriores.');
        expect(sillaActualizada!.material_).to.equal('vidrio');
        expect(sillaActualizada!.dimensiones_.alto).to.equal(80);
        expect(sillaActualizada!.dimensiones_.ancho).to.equal(40);
        expect(sillaActualizada!.dimensiones_.largo).to.equal(40);
        expect(sillaActualizada!.precio_).to.equal(1000);
        expect(sillaActualizada!.tipo_).to.equal('silla');
        expect(sillaActualizada!.color_).to.equal('blanco');
        expect(sillaActualizada!.respaldo_).to.be.true;
        expect(sillaActualizada!.reposabrazos_).to.be.false;
    });

it('Debería actualizar una mesa correctamente (query string)', async () => {
    const response = await request(app).patch('/furnitures').query({ id_: 100 }).send({
        nombre_: 'mesa de terraza',
        descripcion_: 'mesa para exteriores.',
        material_: 'vidrio',
        dimensiones_: {
            alto: 80,
            ancho: 40,
            largo: 40
        },
        precio_: 1000,
        tipo_: 'mesa',
        color_: 'blanco',
        extensible_: false,
        sillas_: 4
    }).expect(200);
    const mesaActualizada = await mesaModel.findById(response.body._id);
    expect(mesaActualizada).not.to.be.null;
    expect(mesaActualizada!.nombre_).to.equal('mesa de terraza');
    expect(mesaActualizada!.descripcion_).to.equal('mesa para exteriores.');
    expect(mesaActualizada!.material_).to.equal('vidrio');
    expect(mesaActualizada!.dimensiones_.alto).to.equal(80);
    expect(mesaActualizada!.dimensiones_.ancho).to.equal(40);
    expect(mesaActualizada!.dimensiones_.largo).to.equal(40);
    expect(mesaActualizada!.precio_).to.equal(1000);
    expect(mesaActualizada!.tipo_).to.equal('mesa');
    expect(mesaActualizada!.color_).to.equal('blanco');
    expect(mesaActualizada!.extensible_).to.be.false;
    expect(mesaActualizada!.sillas_).to.equal(4);
  });

it('Se intenta actualizar un mueble que no existe (query string)', async () => {
    const response = await request(app).patch('/furnitures').query({ id_: 999999 }).send({
        nombre_: 'mesa de terraza',
        descripcion_: 'mesa para exteriores.',
        material_: 'vidrio',
        dimensiones_: {
            alto: 80,
            ancho: 40,
            largo: 40
        },
        precio_: 1000,
        tipo_: 'mesa',
        color_: 'blanco',
        extensible_: false,
        sillas_: 4
    }).expect(404);
    expect(response.body).to.include({
        msg : 'No se encontró el mueble'
    });
  });

  it('Debería actualizar una silla correctamente (id dinámico)', async () => {
    const response = await request(app).patch('/furnitures/99').send({
        nombre_: 'sillita',
        descripcion_: 'silla para exteriores.',
        material_: 'plástico',
        dimensiones_: {
            alto: 80,
            ancho: 40,
            largo: 40
        },
        precio_: 1000,
        tipo_: 'silla',
        color_: 'blanco',
        respaldo_: true,
        reposabrazos_: false
    }).expect(200);
    const sillaActualizada = await sillaModel.findById(response.body._id);
    expect(sillaActualizada).not.to.be.null;
    expect(sillaActualizada!.nombre_).to.equal('sillita');
    expect(sillaActualizada!.descripcion_).to.equal('silla para exteriores.');
    expect(sillaActualizada!.material_).to.equal('plástico');
    expect(sillaActualizada!.dimensiones_.alto).to.equal(80);
    expect(sillaActualizada!.dimensiones_.ancho).to.equal(40);
    expect(sillaActualizada!.dimensiones_.largo).to.equal(40);
    expect(sillaActualizada!.precio_).to.equal(1000);
    expect(sillaActualizada!.tipo_).to.equal('silla');
    expect(sillaActualizada!.color_).to.equal('blanco');
    expect(sillaActualizada!.respaldo_).to.be.true;
    expect(sillaActualizada!.reposabrazos_).to.be.false;
  });

  it('Debería actualizar una mesa correctamente (id dinámico)', async () => {
    const response = await request(app).patch('/furnitures/100').send({
        nombre_: 'mesita',
        descripcion_: 'mesa para exteriores.',
        material_: 'plástico',
        dimensiones_: {
            alto: 80,
            ancho: 40,
            largo: 40
        },
        precio_: 1000,
        tipo_: 'mesa',
        color_: 'blanco',
        extensible_: false,
        sillas_: 4
    }).expect(200);
    const mesaActualizada = await mesaModel.findById(response.body._id);
    expect(mesaActualizada).not.to.be.null;
    expect(mesaActualizada!.nombre_).to.equal('mesita');
    expect(mesaActualizada!.descripcion_).to.equal('mesa para exteriores.');
    expect(mesaActualizada!.material_).to.equal('plástico');
    expect(mesaActualizada!.dimensiones_.alto).to.equal(80);
    expect(mesaActualizada!.dimensiones_.ancho).to.equal(40);
    expect(mesaActualizada!.dimensiones_.largo).to.equal(40);
    expect(mesaActualizada!.precio_).to.equal(1000);
    expect(mesaActualizada!.tipo_).to.equal('mesa');
    expect(mesaActualizada!.color_).to.equal('blanco');
    expect(mesaActualizada!.extensible_).to.be.false;
    expect(mesaActualizada!.sillas_).to.equal(4);
  });

  it('Se intenta actualizar un mueble que no existe (id dinámico)', async () => {
    const response = await request(app).patch('/furnitures/999999').send({
        nombre_: 'mesita',
        descripcion_: 'mesa para exteriores.',
        material_: 'plástico',
        dimensiones_: {
            alto: 80,
            ancho: 40,
            largo: 40
        },
        precio_: 1000,
        tipo_: 'mesa',
        color_: 'blanco',
        extensible_: false,
        sillas_: 4
    }).expect(404);
    expect(response.body).to.include({
        msg : 'No se encontró el mueble'
    });
  });
});


describe('DELETE /furnitures', () => {
    it('Debería eliminar una silla correctamente (query string)', async () => {
        const response = await request(app).delete('/furnitures').query({ id_: 99 }).expect(200);
        const sillaEliminada = await sillaModel.findById(response.body._id);
        expect(sillaEliminada).to.be.null;
    });

    it('Debería eliminar una mesa correctamente (query string)', async () => {
        const response = await request(app).delete('/furnitures').query({ id_: 100 }).expect(200);
        const mesaEliminada = await mesaModel.findById(response.body._id);
       expect(mesaEliminada).to.be.null;
    });

    it('Se intenta eliminar un mueble que no existe (query string)', async () => {
        const response = await request(app).delete('/furnitures').query({ id_: 999999 }).expect(404);
        expect(response.body).to.include({
            msg : 'No se encontró el mueble'
        });
    });

    it('Debería eliminar una silla correctamente (id dinámico)', async () => {
        const response = await request(app).delete('/furnitures/98').expect(200);
        const sillaEliminada = await sillaModel.findById(response.body._id);
        expect(sillaEliminada).to.be.null;
    });

    it('Debería eliminar una mesa correctamente (id dinámico)', async () => {
        const response = await request(app).delete('/furnitures/10').expect(200);
        const mesaEliminada = await mesaModel.findById(response.body._id);
        expect(mesaEliminada).to.be.null;
    });

    it('Se intenta eliminar un mueble que no existe (id dinámico)', async () => {
        const response = await request(app).delete('/furnitures/999999').expect(404);
        expect(response.body).to.include({
            msg : 'No se encontró el mueble'
        });
    });
});

describe('Armario Schema', () => {
  it('Debería retornar un error si intenta crear un armario con puertas decimales', async () => {
    const error = new Error('Un armario no puede tener un número decimal de puertas.');
    try {
      await armarioModel.create({ cajones_: true, puertas_: 3.5 });
    } catch (err: any) {
      expect(err.message).to.include(error.message);
    }
  });
 

  it('Debería retornar un error si el número de puertas es negativo', async () => {
    const error = new Error('Un armario no puede tener puertas negativas.');
    try {
      await armarioModel.create({ cajones_: true, puertas_: -2 });;
    } catch (err: any) {
      expect(err.message).to.include(error.message);
    }
  });
});

describe('Mesa Schema', () => {
  it('Debería retornar un error si intenta crear una mesa con sillas decimales', async () => {
    const error = new Error('Una mesa no puede tener un número decimal de sillas.');
    try {
      await mesaModel.create({ extensible_: false, sillas_: 3.5 });
    } catch (err: any) {
      expect(err.message).to.include(error.message);
    }
  });

  it('Debería retornar un error si el número de sillas es negativo', async () => {
    const error = new Error('Una mesa no puede tener un número negativo de sillas.');
    try {
      await mesaModel.create({ extensible_: false, sillas_: -2 });
    } catch (err: any) {
      expect(err.message).to.include(error.message);
    }
  });
});

describe('Mueble Schema', () => {
  it('La descripción de mueble no puedo estar vacía', async () => {
    try {
      await muebleModel.create({ descripcion_: '' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El precio de un mueble no puede ser negativo', async () => {
    try {
      await muebleModel.create({ precio_: -100 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El precio de un mueble no puede ser un número decimal', async () => {
    try {
      await muebleModel.create({ precio_: 100.5 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it ('La descripción de un mueble tiene que acabar con un punto', async () => {
    try {
      await muebleModel.create({ descripcion_: 'Mesa de prueba' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El id de un mueble no puede ser negativo', async () => {
    try {
      await muebleModel.create({ id_: -100 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El id de un mueble no puede ser un número decimal', async () => {
    try {
      await muebleModel.create({ id_: 100.5 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El nombre de un mueble no puede estar vacío', async () => {
    try {
      await muebleModel.create({ nombre_: '' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El nombre de un mueble no puede contener números', async () => {
    try {
      await muebleModel.create({ nombre_: 'Mesa 1' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El color de un mueble no puede estar vacío', async () => {
    try {
      await muebleModel.create({ color_: '' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El color de un mueble no puede contener números', async () => {
    try {
      await muebleModel.create({ color_: 'blanco1' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('La cantidad de un mueble no puede ser negativa', async () => {
    try {
      await muebleModel.create({ cantidad_: -100 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('La cantidad de un mueble no puede ser un número decimal', async () => {
    try {
      await muebleModel.create({ cantidad_: 100.5 });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El tipo de un mueble tiene que ser silla, mesa o armario', async () => {
    try {
      await muebleModel.create({ tipo_: 'sillon' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });

  it('El tipo de un mueble no puede estar vacío', async () => {
    try {
      await muebleModel.create({ tipo_: '' });
    } catch (err: any) {
      expect(err.name).to.equal('ValidationError');
    }
  });
});


