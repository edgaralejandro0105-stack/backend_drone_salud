const router = require('express').Router();
const mantenimientoController = require('../controllers/mantenimientoController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', mantenimientoController.getAll);
router.get('/dron/:id_dron', mantenimientoController.getByDron);
router.get('/:id', mantenimientoController.getById);
router.post('/', requiereRoles('admin', 'operador'), mantenimientoController.create);
router.put('/:id', requiereRoles('admin', 'operador'), mantenimientoController.update);
router.patch('/:id/completar', requiereRoles('admin', 'operador'), mantenimientoController.completar);
router.delete('/:id', requiereRoles('admin', 'operador'), mantenimientoController.remove);

module.exports = router;
