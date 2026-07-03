const router = require('express').Router();
const suspensionController = require('../controllers/suspensionController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', suspensionController.getAll);
router.get('/usuario/:id_usuario', suspensionController.getByUsuario);
router.get('/usuario/:id_usuario/activa', suspensionController.getActiva);
router.post('/usuario/:id_usuario/suspender', requiereRoles('admin'), suspensionController.suspender);
router.post('/usuario/:id_usuario/activar', requiereRoles('admin'), suspensionController.activar);

module.exports = router;
