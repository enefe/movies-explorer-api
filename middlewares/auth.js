const jwt = require('jsonwebtoken');

const { ForbiddenErr, UnAuthorizedErr } = require('../errors/index');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    next(new UnAuthorizedErr('Необходима авторизация'));
  }

  const token = authorization.replace('Bearer ', '');

  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new ForbiddenErr('Недостаточно прав'));
  }

  req.user = payload;

  next();
};
