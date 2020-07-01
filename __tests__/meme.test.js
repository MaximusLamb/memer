const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
// const Meme = require('../lib/models/Meme');

describe('Meme Routes', () => {

  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });
  
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });
  
  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });
  
  it('creates a meme', () => {
    return request(app)
      .post('/api/v1/memes')
      .send({
        top: 'THIS',
        image: 'placekitten.com',
        bottom: 'IS A CAT'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          top: 'THIS',
          image: 'placekitten.com',
          bottom: 'IS A CAT',
          __v: 0
        });
      });
  });
});
