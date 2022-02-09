const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Secret = require('../models/Secret');

module.exports = Router()
  .post('/', authenticate, async (req, res, next) => {
    try {
      const response = await Secret.insert(req.body);
      res.json(response);
    } catch (error) {
      next(error);
    }
  })
  .get('/', authenticate, async (req, res, next) => {
    try {
      const response = await Secret.getAll();
      res.json(response);
    } catch (error) {
      next(error);
    }
  });
