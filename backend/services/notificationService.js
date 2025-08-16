const Document = require('../models/Document');
const Notification = require('../models/Notification');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');

// This service would ideally be run on a schedule (e.g., a cron job)
const generateNotifications = async () => {
  console.log('Checking for expiring documents...');
  const now = new Date();
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(now.getDate() + 30);

  const expiringDocs = await Document.find({
    expiryDate: { $gte: now, $lte: thirtyDaysFromNow },
  }).populate('vehicle');

  for (const doc of expiringDocs) {
    // Check if a notification already exists for this document to avoid duplicates
    const existingNotif = await Notification.findOne({ document: doc._id });

    if (!existingNotif && doc.vehicle) {
      const message = `The ${doc.type.toUpperCase()} for vehicle ${doc.vehicle.vehicleNumber} is expiring on ${doc.expiryDate.toLocaleDateString()}.`;

      await Notification.create({
        user: doc.user,
        document: doc._id,
        message,
      });
      console.log(`Generated notification for doc ${doc._id}`);
    }
  }
};

module.exports = { generateNotifications };
