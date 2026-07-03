const router = require('express').Router();
const notificacionController = require('../controllers/notificacionController');
const { verificarToken } = require('../middleware/authMiddleware');

router.use(verificarToken);
router.get('/', notificacionController.getNotifications);

module.exports = router;
