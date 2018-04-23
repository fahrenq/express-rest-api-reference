const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config');

const fetchToken = ({ headers }) => headers.authorization.split(' ')[1];

exports.required = (req, res, next) => {
  const token = fetchToken(req);

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (err) {
      // eslint-disable-next-line no-param-reassign
      err.status = 401;
      next(err);
    }

    req.userId = payload.sub;
    next();
  });
};

exports.optional = (req, res, next) => {
  const token = fetchToken(req);

  jwt.verify(token, jwtSecret, (err, payload) => {
    if (payload) req.userId = payload.sub;
    next();
  });
};
