import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongodbDataSource} from '../datasources';
import {Usuario2, Usuario2Relations} from '../models';

export class Usuario2Repository extends DefaultCrudRepository<
  Usuario2,
  typeof Usuario2.prototype.id,
  Usuario2Relations
> {
  constructor(
    @inject('datasources.mongodb') dataSource: MongodbDataSource,
  ) {
    super(Usuario2, dataSource);
  }
}
