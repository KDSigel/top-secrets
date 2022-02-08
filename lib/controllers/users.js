const { Router } = require('express');
const UserService = require('../services/UserService');

module.exports = Router()
  .post('/', async (req, res, next) => {
    try {
      // I need to create a service to hash the user's password
      const user = await UserService.create(req.body);
      res.json(user);
    } catch (error) {
      next(error);
    }
  })
  .post('/sessions', async (req, res, next) => {
    try {
      const token = await UserService.signIn({ ...req.body });
      res.cookie(process.env.COOKIE_NAME, token, {
        httpOnly: true,
        maxAge: 86400000,
      });
      res.json({ message: 'you signed in, great job!' });
    } catch (error) {
      next(error);
    }
  });
