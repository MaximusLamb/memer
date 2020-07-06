require('dotenv').config();

const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');
const Meme = require('../lib/models/Meme');

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

  it('gets all memes', async() => {

    await Meme.create([{
      top: 'THIS IS A CAT',
      image: 'placekitten.com'
    }, {
      top: 'THIS',
      image: 'placekitten.com',
      bottom: 'IS ALSO A CAT'
    }]);

    return request(app)
      .get('/api/v1/memes')
      .then(res => {
        expect(res.body).toEqual([{
          __v: 0,
          _id: expect.anything(),
          top: 'THIS IS A CAT',
          image: 'placekitten.com'
        },
        { __v: 0,
          _id: expect.anything(),
          top: 'THIS',
          image: 'placekitten.com',
          bottom: 'IS ALSO A CAT',
        }]);
      });  
  });

  it('gets a meme by id', async() => {

    const newMeme = await Meme.create({
      top: 'THIS IS A CAT',
      image: 'placekitten.com'
    });

    return request(app)
      .get(`/api/v1/memes/${newMeme._id}`)
      .then(res => {
        expect(res.body).toEqual({
          __v: 0,
          _id: newMeme.id,
          top: 'THIS IS A CAT',
          image: 'placekitten.com'
        });
      });  
  });

  it('gets a meme by id and updates it', () => {

    Meme.create({
      top: 'THIS IS A CAT',
      image: 'placekitten.com'
    })
      .then(meme => {
        return request(app)
          .put(`/api/v1/memes/${meme._id}`)
          .send({ 
            top: 'THIS IS A NEW CAT',
            bottom: 'AND IT IS ADORABLE'
          })
          .then(res => {
            expect(res.body).toEqual({
              __v: 0,
              _id: expect.anything(),
              top: 'THIS IS A NEW CAT',
              image: 'placekitten.com',
              bottom: 'AND IT IS ADORABLE'
            });
          });
      });
  });

  it('deletes a meme', async() => {

    const newMeme = await Meme.create({
      top: 'THIS IS A CAT',
      image: 'placekitten.com'
    });
    return request(app)
      .delete(`/api/v1/memes/${newMeme._id}`)
      .then(res => {
        expect(res.body).toEqual({
          top: 'THIS IS A CAT',
          image: 'placekitten.com',
          _id: expect.anything(),
          __v: 0
        });
      });
  });
});  
