/*
 * The /events service is responsible receiving the data POSTed from the
 * Jenkins instances and storing it in the database
 */

import { Application, HooksObject } from '@feathersjs/feathers';
import service from 'feathers-sequelize';
import { Operators, DataTypes } from 'sequelize';

import authorize from '../hooks/authorize';
import applyGrant from '../hooks/apply-grant';
import logger from '../logger';
import db from '../models';
import Event from '../models/event';

export const eventsHooks : HooksObject = {
  before: {
    all: [
    ],
    find: [
      authorize(),
      applyGrant(),
    ],
    get: [
      authorize(),
      applyGrant(),
    ],
    create: [
      /*
       * The create route is unauthenticated so clients can POST events
       */
    ],
    update: [
      authorize(),
    ],
    patch: [
      authorize(),
    ],
    remove: [
      authorize(),
    ],
  },
  after: {},
  error: {},
};

export default (app : Application) => {
  const Model : any = Event(db.sequelize, db.sequelize.Sequelize);
  app.use('/events', service({
    Model: Model,
    paginate: {
      default: 25,
  }}));
  app.service('events').hooks(eventsHooks);
};
