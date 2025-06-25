const jwt = require('jsonwebtoken');
const config = require('config');

const generateToken = (userId) => {
  const payload = {
    user: {
      id: userId
    }
  };

  return jwt.sign(
    payload,
    config.get('jwtSecret'),
    { expiresIn: config.get('jwtExpiration') }
  );
};

module.exports = generateToken;