const express = require('express');
const router = express.Router();
const presensiController = require('../controllers/presensiController');
const { addUserData } = require('../middleware/permissionMiddleware');
router.use(addUserData);
// Return all presensi records (useful for testing GET /api/presensi)
const presensiRecords = require('../data/presensiData');
router.get('/', (req, res) => {
	res.json({
		data: presensiRecords,
		timestamp: new Date().toISOString()
	});
});
// ... kode lainnya ...

// Gunakan 'check-in' dan 'check-out' (semua huruf kecil dengan tanda hubung)
router.post('/check-in', presensiController.CheckIn);
router.post('/check-out', presensiController.CheckOut);

module.exports = router;