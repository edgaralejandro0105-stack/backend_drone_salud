const router = require('express').Router();
const dronController = require('../controllers/dronController');
const { verificarToken, requiereRoles } = require('../middleware/authMiddleware');

router.use(verificarToken);

router.get('/disponibles', dronController.getDisponibles);
router.get('/', dronController.getAll);
router.get('/:id', dronController.getById);
router.post('/', requiereRoles('admin'), dronController.create);
router.put('/:id', requiereRoles('admin'), dronController.update);
router.delete('/:id', requiereRoles('admin'), dronController.remove);

module.exports = router;
