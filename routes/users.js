const router = require('express').Router();
const controller = require('../controllers/users');

// router.param('id', controller.before_id_param);

router.post('/', controller.create);
router.post('/login', controller.login);
// router.get('/:id', controller.get);
// router.post('/', controller.create);
// router.patch('/:id', controller.update);
// router.delete('/:id', controller.delete);

module.exports = router;
