const router = require('express').Router();
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.use(requiereRoles('admin'));

router.get('/', usuarioController.getAll);
router.get('/:id', usuarioController.getById);
router.put('/:id', usuarioController.update);
router.patch('/:id/estado', usuarioController.updateEstado);
router.delete('/:id', usuarioController.remove);

module.exports = router;
