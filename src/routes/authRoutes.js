const router = require('express').Router();
const { login, crearUsuario } = require('../controllers/authController');
const { autenticar, permitirRoles } = require('../middleware/auth');

router.post('/login', login);
router.post('/usuarios', autenticar, permitirRoles('ADMIN'), crearUsuario);

module.exports = router;
