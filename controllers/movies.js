const Movie = require('../models/movies');

const { NotFoundErr, BadRequestErr, ForbiddenErr } = require('../errors/index');

const getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      if (movies) {
        return res.send(movies);
      }
      throw new BadRequestErr('Переданы некорректные данные');
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country, director, duration, year, description, image,
    trailer, nameRU, nameEN, thumbnail, movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestErr('Переданы некорректные данные');
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(() => new NotFoundErr('Фильм не найден'))
    .then((movie) => {
      console.log(req.user._id);
      if (String(movie.owner) !== req.user._id) {
        throw new ForbiddenErr('Это не твой фильм');
      } else {
        Movie.findByIdAndRemove(req.params.movieId)
          .then((moviee) => res.send({ data: moviee }))
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestErr('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
