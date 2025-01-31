const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const AuthService = {
  createUser(db, newUser) {
    newUser.password = bcrypt.hashSync(newUser.password, 1);
    return db('nspired_users')
      .insert(newUser)
      .returning('*')
      .then(([user]) => user);
  },
  getUserWithUserName(db, user_name) {
    return db('nspired_users')
      .where({ user_name })
      .first();
  },
  deleteUser(db, id) {
    return db('nspired_users')
      .delete()
      .where({ id });
  },
  parseBasicToken(token) {
    return Buffer
      .from(token, 'base64')
      .toString()
      .split(':');
  },
  comparePasswords(password, hash) {
    return bcrypt.compare(password, hash);
  },
  createJwt(subject, payload) {
    return jwt.sign(payload, JWT_SECRET, {
      subject,
      algorithm: 'HS256'
    });
  },
  verifyJwt(token) {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: ['HS256']
    });
  }
};
  
module.exports = AuthService;