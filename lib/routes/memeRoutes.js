const { Router } = require('express');
const Meme = require('../models/Meme');

module.exports = Router()
  .post('/', (req, res, next) => {
    Meme
      .create(req.body)
      .then(meme => res.send(meme))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Meme
      .find()
      .then(meme => res.send(meme))
      .catch(next);
  });
