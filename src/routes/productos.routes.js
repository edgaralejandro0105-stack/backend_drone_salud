const router = require('express').Router();
const productoController = require('../controllers/productoController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { createProductoSchema } = require('../schemas/producto.schema');

router.use(verificarToken);

router.get('/', productoController.getAll);
router.get('/:id', productoController.getById);
router.post('/', requiereRoles('admin', 'farmacia'), validateSchema(createProductoSchema), productoController.create);
router.put('/:id', requiereRoles('admin', 'farmacia'), productoController.update);
router.delete('/:id', requiereRoles('admin', 'farmacia'), productoController.remove);

module.exports = router;
