import {Entity, model, property} from '@loopback/repository';

@model()
export class Usuario2 extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  nombre: string;

  @property({
    type: 'string',
    required: true,
  })
  apellidos: string;

  @property({
    type: 'string',
    required: true,
  })
  telefono: string;

  @property({
    type: 'string',
    required: true,
  })
  correoElectronico: string;

  @property({
    type: 'string',
    required: true,
  })
  direccion: string;

  @property({
    type: 'string',
  })
  clave?: string;


  constructor(data?: Partial<Usuario2>) {
    super(data);
  }
}

export interface Usuario2Relations {
  // describe navigational properties here
}

export type Usuario2WithRelations = Usuario2 & Usuario2Relations;
