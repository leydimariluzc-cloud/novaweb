const router = require('express').Router();
const c = require('../controllers/salesController');
const { autenticar } = require('../middleware/auth');

router.get('/', autenticar, c.listar);
router.post('/', autenticar, c.crear);

module.exports = router;
