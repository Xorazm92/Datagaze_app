const express = require('express');
const router = express.Router();
const computerController = require('../controllers/computer.controller');
const { auth } = require('../../middlewares/auth.middleware');

router.get('/', auth, computerController.getComputers);
router.get('/:computer_id/applications', auth, computerController.getComputerApplications);
router.post('/:computer_id/applications/install', auth, computerController.installApplication);
router.put('/:computer_id/applications/update', auth, computerController.updateApplication);
router.delete('/:computer_id/applications/remove', auth, computerController.removeApplication);

module.exports = router;
