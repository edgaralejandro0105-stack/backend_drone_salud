const router = require('express').Router();
const configuracionController = require('../controllers/configuracionController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', configuracionController.getAll);
router.get('/:clave', configuracionController.getByClave);
router.put('/', requiereRoles('admin'), configuracionController.update);

module.exports = router;
