const router = require('express').Router();
const c = require('../controllers/inventoryController');
const { autenticar, permitirRoles } = require('../middleware/auth');

router.get('/', autenticar, c.listar);
router.get('/alertas', autenticar, c.alertas);
router.get('/movimientos', autenticar, c.movimientos);
router.patch('/:id/ajuste', autenticar, permitirRoles('ADMIN'), c.ajustar);

module.exports = router;
