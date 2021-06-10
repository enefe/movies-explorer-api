const router = require('express').Router();
const userRouter = require('./users');
const cardRouter = require('./movies');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { validateUserBody } = require('../middlewares/validation');

const { NotFoundErr } = require('../errors/index');

router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.post('/signin', validateUserBody, login);
router.post('/signup', validateUserBody, createUser);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', cardRouter);

router.use((req, res, next) => {
  next(new NotFoundErr('Ресурс не найден'));
});

module.exports = router;
