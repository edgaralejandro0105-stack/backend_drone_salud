const router = require('express').Router();
const farmaciaController = require('../controllers/farmaciaController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { createFarmaciaSchema } = require('../schemas/farmacia.schema');

router.use(verificarToken);

router.get('/', farmaciaController.getAll);
router.get('/:id', farmaciaController.getById);
router.post('/', requiereRoles('admin'), validateSchema(createFarmaciaSchema), farmaciaController.create);
router.put('/own', farmaciaController.updateOwn);
router.put('/:id', requiereRoles('admin'), farmaciaController.update);
router.delete('/:id', requiereRoles('admin'), farmaciaController.remove);

module.exports = router;
