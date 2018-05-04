const router = require('express').Router();
const controller = require('../controllers/posts');
const auth = require('../middlewares/auth');

router.param('id', controller.before_id_param);

router.get('/', controller.index);
router.get('/:id', controller.get);
router.post('/', auth.required, controller.create);
router.patch('/:id', auth.required, controller.update);
router.delete('/:id', auth.required, controller.delete);

module.exports = router;
