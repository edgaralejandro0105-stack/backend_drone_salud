const router = require('express').Router();
const authController = require('../controllers/authController');
const { verificarToken } = require('../middleware/authMiddleware');
const validateSchema = require('../middleware/validateSchema');
const { registerSchema, loginSchema } = require('../schemas/auth.schema');

router.post('/register', validateSchema(registerSchema), authController.register);
router.post('/login', validateSchema(loginSchema), authController.login);
router.get('/profile', verificarToken, authController.getProfile);
router.patch('/password', verificarToken, authController.changePassword);

module.exports = router;