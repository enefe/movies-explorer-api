const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const { UnAuthorizedErr } = require('../errors/index');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'Минимальная длина поля "name" - 2'],
    maxlength: [30, 'Максимальная длина поля "name" - 30'],
    default: 'Ваше имя',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => { validator.isEmail(email); },
      message: 'Невалидный email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnAuthorizedErr('Неправильные почта или пароль');
      } else {
        return bcrypt.compare(password, user.password)
          .then((matched) => {
            if (!matched) {
              throw new UnAuthorizedErr('Неправильные почта или пароль');
            } else {
              return user;
            }
          });
      }
    });
};

module.exports = mongoose.model('user', userSchema);
