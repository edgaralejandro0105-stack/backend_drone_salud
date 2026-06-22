const router = require('express').Router();
const operadorController = require('../controllers/operadorController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', operadorController.getAll);
router.get('/:id', operadorController.getById);
router.post('/', requiereRoles('admin'), operadorController.create);
router.put('/:id', requiereRoles('admin'), operadorController.update);
router.delete('/:id', requiereRoles('admin'), operadorController.remove);

module.exports = router;
