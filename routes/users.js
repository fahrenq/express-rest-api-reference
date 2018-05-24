const router = require('express').Router();
const controller = require('../controllers/users');
const auth = require('../middlewares/auth');

// Can't use router.param here because we have to expose
// different user info based on auth middleware
// router.param('id', controller.before_id_param);

router.post('/login', controller.login);
router.get('/:id', auth.optional, controller.get);
router.post('/', controller.create);
router.patch('/:id', auth.required, controller.update);
router.post('/:id/confirm-email', controller.confirmEmail);

module.exports = router;
