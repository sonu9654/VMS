const Vehicle = require('../models/Vehicle');
const Document = require('../models/Document');

// A helper function to assemble the vehicle response
const assembleVehicleResponse = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) return null;

  const docs = await Document.find({ vehicle: vehicleId });
  const documents = {
    rc: docs.find(d => d.type === 'rc') || null,
    pollution: docs.find(d => d.type === 'pollution') || null,
    insurance: docs.find(d => d.type === 'insurance') || null,
  };

  return {
    id: vehicle._id,
    vehicleNumber: vehicle.vehicleNumber,
    vehicleType: vehicle.vehicleType,
    brand: vehicle.brand,
    model: vehicle.model,
    year: vehicle.year,
    createdAt: vehicle.createdAt,
    documents: {
      rc: documents.rc ? {
        id: documents.rc._id,
        type: 'rc',
        documentNumber: documents.rc.documentNumber,
        issueDate: documents.rc.issueDate.toISOString().split('T')[0],
        expiryDate: documents.rc.expiryDate.toISOString().split('T')[0],
      } : null,
      pollution: documents.pollution ? {
        id: documents.pollution._id,
        type: 'pollution',
        documentNumber: documents.pollution.documentNumber,
        issueDate: documents.pollution.issueDate.toISOString().split('T')[0],
        expiryDate: documents.pollution.expiryDate.toISOString().split('T')[0],
      } : null,
      insurance: documents.insurance ? {
        id: documents.insurance._id,
        type: 'insurance',
        documentNumber: documents.insurance.documentNumber,
        issueDate: documents.insurance.issueDate.toISOString().split('T')[0],
        expiryDate: documents.insurance.expiryDate.toISOString().split('T')[0],
      } : null,
    },
  };
};

// @desc    Create a new vehicle
// @route   POST /api/vehicles
// @access  Private
const createVehicle = async (req, res) => {
  const { vehicleNumber, vehicleType, brand, model, year, documents } = req.body;

  try {
    const vehicle = await Vehicle.create({
      user: req.user.id,
      vehicleNumber,
      vehicleType,
      brand,
      model,
      year,
    });

    if (documents) {
      for (const docType of ['rc', 'pollution', 'insurance']) {
        if (documents[docType]) {
          await Document.create({
            user: req.user.id,
            vehicle: vehicle._id,
            type: docType,
            ...documents[docType],
          });
        }
      }
    }

    const responseVehicle = await assembleVehicleResponse(vehicle._id);
    res.status(201).json(responseVehicle);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all vehicles for a user
// @route   GET /api/vehicles
// @access  Private
const getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ user: req.user.id });
    const responseVehicles = await Promise.all(
      vehicles.map(v => assembleVehicleResponse(v._id))
    );
    res.json(responseVehicles);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle belongs to user
    if (vehicle.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { vehicleNumber, vehicleType, brand, model, year, documents } = req.body;

    vehicle.vehicleNumber = vehicleNumber || vehicle.vehicleNumber;
    vehicle.vehicleType = vehicleType || vehicle.vehicleType;
    vehicle.brand = brand || vehicle.brand;
    vehicle.model = model || vehicle.model;
    vehicle.year = year || vehicle.year;

    await vehicle.save();

    if (documents) {
      for (const docType of ['rc', 'pollution', 'insurance']) {
        const docInDb = await Document.findOne({ vehicle: vehicle._id, type: docType });
        const docInReq = documents[docType];

        if (docInReq && !docInDb) {
          // Create new document
          await Document.create({ ...docInReq, user: req.user.id, vehicle: vehicle._id, type: docType });
        } else if (!docInReq && docInDb) {
          // Delete document
          await Document.findByIdAndDelete(docInDb._id);
        } else if (docInReq && docInDb) {
          // Update document
          docInDb.documentNumber = docInReq.documentNumber || docInDb.documentNumber;
          docInDb.issueDate = docInReq.issueDate || docInDb.issueDate;
          docInDb.expiryDate = docInReq.expiryDate || docInDb.expiryDate;
          await docInDb.save();
        }
      }
    }

    const responseVehicle = await assembleVehicleResponse(vehicle._id);
    res.json(responseVehicle);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Check if vehicle belongs to user
    if (vehicle.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Document.deleteMany({ vehicle: vehicle._id });
    await Vehicle.findByIdAndDelete(req.params.id);

    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
};
