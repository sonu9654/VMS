const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalVehicles = await Vehicle.countDocuments({ user: userId });
    const totalDocuments = await Document.countDocuments({ user: userId });

    const now = new Date();
    const expiringSoonDate = new Date();
    expiringSoonDate.setDate(now.getDate() + 30);

    const expired = await Document.countDocuments({
      user: userId,
      expiryDate: { $lt: now },
    });

    const expiringSoon = await Document.countDocuments({
      user: userId,
      expiryDate: { $gte: now, $lte: expiringSoonDate },
    });

    res.json({
      totalVehicles,
      totalDocuments,
      expired,
      expiringSoon,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getStats,
};
