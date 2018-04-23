const router = require('express').Router();
const controller = require('../controllers/posts');

router.param('id', controller.before_id_param);

router.get('/', controller.index);
router.get('/:id', controller.get);
router.post('/', controller.create);
router.patch('/:id', controller.update);
router.delete('/:id', controller.delete);

module.exports = router;
