const bcrypt = require('bcryptjs');
const AuthService = require('./auth-service');

function requireAuth(req, res, next) {
  const authToken = req.get('authorization') || '';

  let basicToken;
  if (!authToken.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error : 'Missing basic token' });
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length);
  }

  const [
    tokenUserName, tokenPassword
  ] = AuthService.parseBasicToken(basicToken);

  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request' });
  }

  AuthService.getUserWithUserName(req.app.get('db'), tokenUserName)
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized request' });
      }
      return bcrypt.compare(tokenPassword, user.password)
        .then(passwordMatch => {
          if (!passwordMatch) {
            return res.status(401).json({ error: 'Unauthorized request' });
          }
          req.user = user;
          next();
        });
    })
    .catch(next);
}
  
module.exports = {
  requireAuth,
};