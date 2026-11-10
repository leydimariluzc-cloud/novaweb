const router = require('express').Router();
const c = require('../controllers/productController');
const { autenticar, permitirRoles } = require('../middleware/auth');

router.get('/', autenticar, c.listar);
router.get('/:id', autenticar, c.obtener);
router.post('/', autenticar, permitirRoles('ADMIN'), c.crear);
router.put('/:id', autenticar, permitirRoles('ADMIN'), c.actualizar);
router.delete('/:id', autenticar, permitirRoles('ADMIN'), c.desactivar);

module.exports = router;
