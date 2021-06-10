/* eslint-disable no-shadow */
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  NotFoundErr, BadRequestErr, UnAuthorizedErr, ConflictErr,
} = require('../errors/index');

const SALT = 10;

const getMyProfile = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then(({ name, email }) => {
      if ({ name, email }) {
        return res.send({ data: { name, email } });
      }
      throw new NotFoundErr('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, SALT)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(({
      name, email, _id,
    }) => {
      res.send({
        data: {
          name, email, _id,
        },
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      }
      if (err.code === 11000) {
        next(new ConflictErr('Такой пользователь уже существует'));
      } else {
        next(err);
      }
    });
};

const updateUser = (req, res, next) => {
  const { _id } = req.user;
  const { name, email } = req.body;

  if (!name || !email) {
    next(new BadRequestErr('Переданы некорректные данные'));
  }

  User.findByIdAndUpdate({ _id }, { name, email }, { new: true, runValidators: true })
    .then(({ name, email }) => {
      if ({ name, email }) {
        return res.send({ data: { name, email } });
      }
      throw new NotFoundErr('Пользователь не найден');
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Переданы некорректные данные');
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id, email }, 'some-secret-key', { expiresIn: '7d' });

      if (!token) {
        throw new UnAuthorizedErr('С токеном что-то не так');
      } else {
        res.send({ token });
      }
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getMyProfile,
  createUser,
  updateUser,
  login,
};
