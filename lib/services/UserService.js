const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = class UserService {
  static async create({ email, password }) {
    const passwordHash = await bcrypt.hash(
      password,
      Number(process.env.SALT_ROUNDS)
    );
    const user = await User.insert({
      email,
      passwordHash,
    });
    return user;
  }

  static async signIn({ email, password = '' }) {
    try {
      const user = await User.getUserByEmail(email);

      if (!user) throw new Error('Invalid email');
      if (!bcrypt.compareSync(password, user.passwordHash))
        throw new Error('Invalid password');

      const token = jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: '1 day' });

      return token;
    } catch (error) {
      error.status = 401;
      throw error;
    }
  }
  // get user email and hash(ed password) that is associated with the email the client provided.
  // use getUserByEmail from model
  // if "null" return error
  // hash the password that the client provided with email - bcrypt.compareSync(password, hash)
  // compare hash in database with password provided but need to has the password provided to be able to match.
  // if false, error
  // if true set a token!!!!
  // use JWT.sign(user object from SQL, process.env.JWT_SECRET, {expiresIn: '1 day'})
  // return token
  // if true "message: 'signed in successful"
};
