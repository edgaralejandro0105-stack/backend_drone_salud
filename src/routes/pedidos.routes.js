const router = require('express').Router();
const pedidoController = require('../controllers/pedidoController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { createPedidoSchema } = require('../schemas/pedido.schema');

router.use(verificarToken);

router.post('/', requiereRoles('cliente'), validateSchema(createPedidoSchema), pedidoController.create);
router.get('/', pedidoController.getAll);
router.get('/:id', pedidoController.getById);
router.patch('/:id/estado', requiereRoles('admin', 'farmacia'), pedidoController.updateEstado);
router.post('/:id/asignar', requiereRoles('admin', 'operador'), pedidoController.asignarDronOperador);

module.exports = router;