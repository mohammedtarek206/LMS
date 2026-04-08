const Patient = require('../models/Patient');
const Log = require('../models/Log');
const Case = require('../models/Case');


const getPatients = async (req, res, next) => {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = 10;
    const count = await Patient.countDocuments({});
    
    const patients = await Patient.find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({ patients, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

const addPatient = async (req, res, next) => {
  try {
    const { name, nationalId, age, gender, referringDoctor } = req.body;

    const patientExists = await Patient.findOne({ nationalId });
    if (patientExists) {
      res.status(400);
      throw new Error('Patient with this National ID already exists');
    }

    const patient = await Patient.create({
      name,
      nationalId,
      age,
      gender,
      referringDoctor,
    });

    // Log action
    await Log.create({ user: req.user._id, action: 'CREATE', entity: 'Patient', entityId: patient._id });

    res.status(201).json(patient);
  } catch (error) {
    next(error);
  }
};

const getPatientById = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);
    if (patient) {
      res.json(patient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

const updatePatient = async (req, res, next) => {
  try {
    const { name, nationalId, age, gender, referringDoctor } = req.body;
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      patient.name = name || patient.name;
      patient.nationalId = nationalId || patient.nationalId;
      patient.age = age || patient.age;
      patient.gender = gender || patient.gender;
      patient.referringDoctor = referringDoctor || patient.referringDoctor;

      const updatedPatient = await patient.save();

      // Log action
      await Log.create({ user: req.user._id, action: 'UPDATE', entity: 'Patient', entityId: patient._id });

      res.json(updatedPatient);
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

const deletePatient = async (req, res, next) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (patient) {
      // Cascading delete: Remove all cases associated with this patient
      await Case.deleteMany({ patient: patient._id });

      // Delete the patient
      await patient.deleteOne();

      // Log action
      await Log.create({ user: req.user._id, action: 'DELETE', entity: 'Patient', entityId: patient._id });

      res.json({ message: 'Patient and all records removed' });
    } else {
      res.status(404);
      throw new Error('Patient not found');
    }
  } catch (error) {
    next(error);
  }
};

const searchPatients = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.json([]);
    }

    // Use a more robust regex for Arabic/Unicode
    const searchRegex = new RegExp(keyword.trim(), 'i');

    const patients = await Patient.find({
      $or: [
        { name: { $regex: searchRegex } },
        { nationalId: { $regex: searchRegex } },
      ],
    }).limit(20);

    res.json(patients);
  } catch (error) {
    next(error);
  }
};

module.exports = { 
  getPatients, 
  addPatient, 
  getPatientById, 
  updatePatient, 
  deletePatient, 
  searchPatients 
};

