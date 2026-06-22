const router = require('express').Router();
const pagoController = require('../controllers/pagoController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/', pagoController.getAll);
router.post('/', requiereRoles('cliente'), pagoController.create);
router.patch('/:id/confirmar', requiereRoles('admin', 'farmacia'), pagoController.confirmarPago);

module.exports = router;
