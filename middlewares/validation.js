const { celebrate, Joi } = require('celebrate');
const validator = require('validator');

const validateUserBody = celebrate({
  body: Joi.object().keys({
    password: Joi.string().required().messages({
      'any.required': 'Не заполнено обязательное поле',
    }),
    email: Joi.string().required().messages({
      'any.required': 'Не заполнено обязательное поле',
    }).custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().custom((value, helpers) => {
      if (validator.isEmail(value)) {
        return value;
      }
      return helpers.message('Невалидный email');
    }),
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
  }),
});

const validateMovieBody = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    director: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    duration: Joi.number().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    year: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    description: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    image: Joi.string().required().messages({
      'any.required': 'Не заполнено обязательное поле',
    }).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    trailer: Joi.string().required().messages({
      'any.required': 'Не заполнено обязательное поле',
    }).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    thumbnail: Joi.string().required().messages({
      'any.required': 'Не заполнено обязательное поле',
    }).custom((value, helpers) => {
      if (validator.isURL(value)) {
        return value;
      }
      return helpers.message('Невалидный url');
    }),
    movieId: Joi.number().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    nameRU: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
    nameEN: Joi.string().required()
      .messages({
        'any.required': 'Не заполнено обязательное поле',
      }),
  }),
});

module.exports = {
  validateUserBody,
  validateUser,
  validateMovieBody,
};
