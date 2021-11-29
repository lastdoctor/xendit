import * as request from 'supertest';
import * as faker from 'faker';

import buildSchemas from '../src/schemas';
import { app } from '../src/app';
import { db } from '../src/db';

describe('API tests', () => {
  before((done) => {
    // @ts-ignore
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app).get('/health').expect('Content-Type', /text/u).expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return 404 not found', (done) => {
      request(app).get('/rides').expect(404, done);
    });
  });

  describe('POST /rides', () => {
    it('should return 400 Bad Request (Invalid Start Latitude)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 1000,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid Start Longitude)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 1000,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid End Latitude)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 1000,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid End Longitude)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 1000,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid Rider Name)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: 12,
          start_lat: 0,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid Driver Name)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: 75,
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should return 400 Bad Request (Invalid Driver Vehicle)', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: 13,
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(400, done);
    });
    it('should insert rides successfully', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(201, done);
    });
  });

  describe('GET /rides/:id', () => {
    it('should return 404 not found', (done) => {
      request(app).get('/rides/9999').expect(404, done);
    });

    it('should return a ride', (done) => {
      request(app)
        .post('/rides')
        .set('Content-type', 'application/json')
        .send({
          driver_name: faker.name.firstName(),
          driver_vehicle: faker.vehicle.vehicle(),
          end_lat: 10,
          end_long: 10,
          rider_name: faker.name.firstName(),
          start_lat: 0,
          start_long: 0,
        })
        .expect(200);

      request(app).get('/rides/1').expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return rides with default pagination settings (page: -1, limit: -1)', (done) => {
      request(app).get('/rides').expect(400);

      done();
    });

    it('should return rides with custom pagination settings (page: 1, limit: 5)', (done) => {
      request(app)
        .get('/rides?page=1&limit=5')
        .expect(200)
        .then((resp) => resp.body.length === 1);
      done();
    });
  });
});
