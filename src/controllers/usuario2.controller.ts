import {service} from '@loopback/core';
import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where
} from '@loopback/repository';
import {
  del, get,
  getModelSchemaRef, HttpErrors, param, patch, post, put, requestBody,
  response
} from '@loopback/rest';
import {Llaves} from '../config/Llaves';
import {Credenciales, Usuario2} from '../models';
import {Usuario2Repository} from '../repositories';
import {AutenticacionService} from '../services/autenticacion.service';
const fetch = require("node-fetch");

export class Usuario2Controller {
  constructor(
    @repository(Usuario2Repository)
    public usuario2Repository: Usuario2Repository,
    @service(AutenticacionService)
    public servicioAutenticacion: AutenticacionService,
  ) { }

  @post('/identificarUsuario2', {
    responses: {
      '200': {
        description: "identificacion de usuarios"
      }
    }
  })
  async identificarUsuario2(
    @requestBody() credenciales: Credenciales
  ) {
    let u = await this.servicioAutenticacion.IdentificarUsuario(credenciales.usuario, credenciales.clave);
    if (u) {
      let token = this.servicioAutenticacion.GenerarTokenJWT(u);
      return {
        datos: {
          nombre: u.nombre,
          correo: u.correoElectronico,
          id: u.id
        },
        tk: token
      }
    } else {
      throw new HttpErrors[401]("los datos suministrados no son validos");
    }
  }

  @post('/usuario2s')
  @response(200, {
    description: 'Usuario2 model instance',
    content: {'application/json': {schema: getModelSchemaRef(Usuario2)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario2, {
            title: 'NewUsuario2',
            exclude: ['id'],
          }),
        },
      },
    })
    usuario2: Omit<Usuario2, 'id'>,
  ): Promise<Usuario2> {

    let clave = this.servicioAutenticacion.GenerarClave();
    let claveCifrada = this.servicioAutenticacion.CifrarClave(clave);
    usuario2.clave = claveCifrada;
    console.log(usuario2);

    let u = await this.usuario2Repository.create(usuario2);
    let destino = usuario2.correoElectronico;
    let asunto = 'Registro app Equipos Tecnologicos'
    let mensaje = `Hola ${usuario2.nombre}, su nombre de usuario es: ${usuario2.correoElectronico} y su contraseña asignada es: ${clave}`;
    fetch(`${Llaves.urlServicioNotificaciones}/email?correo_destino=${destino}&asunto=${asunto}&mensaje=${mensaje}`)
      .then((data: any) => {
        console.log(data);
      })
    return u;
  }

  @get('/usuario2s/count')
  @response(200, {
    description: 'Usuario2 model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Usuario2) where?: Where<Usuario2>,
  ): Promise<Count> {
    return this.usuario2Repository.count(where);
  }

  @get('/usuario2s')
  @response(200, {
    description: 'Array of Usuario2 model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Usuario2, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Usuario2) filter?: Filter<Usuario2>,
  ): Promise<Usuario2[]> {
    return this.usuario2Repository.find(filter);
  }

  @patch('/usuario2s')
  @response(200, {
    description: 'Usuario2 PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario2, {partial: true}),
        },
      },
    })
    usuario2: Usuario2,
    @param.where(Usuario2) where?: Where<Usuario2>,
  ): Promise<Count> {
    return this.usuario2Repository.updateAll(usuario2, where);
  }

  @get('/usuario2s/{id}')
  @response(200, {
    description: 'Usuario2 model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Usuario2, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Usuario2, {exclude: 'where'}) filter?: FilterExcludingWhere<Usuario2>
  ): Promise<Usuario2> {
    return this.usuario2Repository.findById(id, filter);
  }

  @patch('/usuario2s/{id}')
  @response(204, {
    description: 'Usuario2 PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Usuario2, {partial: true}),
        },
      },
    })
    usuario2: Usuario2,
  ): Promise<void> {
    await this.usuario2Repository.updateById(id, usuario2);
  }

  @put('/usuario2s/{id}')
  @response(204, {
    description: 'Usuario2 PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() usuario2: Usuario2,
  ): Promise<void> {
    await this.usuario2Repository.replaceById(id, usuario2);
  }

  @del('/usuario2s/{id}')
  @response(204, {
    description: 'Usuario2 DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.usuario2Repository.deleteById(id);
  }
}
