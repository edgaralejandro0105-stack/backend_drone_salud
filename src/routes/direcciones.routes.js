const router = require('express').Router();
const direccionController = require('../controllers/direccionController');
const { verificarToken } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', direccionController.getAll);
router.post('/', direccionController.create);
router.delete('/:id', direccionController.remove);

module.exports = router;
