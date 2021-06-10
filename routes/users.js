const router = require('express').Router();

const { validateUser } = require('../middlewares/validation');

const {
  getMyProfile, updateUser,
} = require('../controllers/users');

router.get('/me', getMyProfile);
router.patch('/me', validateUser, updateUser);

module.exports = router;
