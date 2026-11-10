const router = require('express').Router();
const c = require('../controllers/purchaseController');
const { autenticar, permitirRoles } = require('../middleware/auth');

router.get('/', autenticar, permitirRoles('ADMIN'), c.listar);
router.post('/', autenticar, permitirRoles('ADMIN'), c.crear);

module.exports = router;
