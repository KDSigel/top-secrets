const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router().post('/', async (req, res, next) => {
  try {
    // I need to create a service to hash the user's password
    const user = await UserService.create(req.body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});
