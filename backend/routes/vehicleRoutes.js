const express = require('express');
const router = express.Router();
const { createVehicle, getVehicles, updateVehicle, deleteVehicle } = require('../controllers/vehicleController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, createVehicle).get(protect, getVehicles);
router.route('/:id').put(protect, updateVehicle).delete(protect, deleteVehicle);

module.exports = router;
