const Case = require('../models/Case');
const Log = require('../models/Log');

const addCase = async (req, res, next) => {
  try {
    const { patient, diagnosis, specimen, grossDescription, microscopicDescription } = req.body;

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    const newCase = await Case.create({
      patient,
      doctor: req.user._id,
      diagnosis,
      specimen,
      grossDescription,
      microscopicDescription,
    });

    await Log.create({ user: req.user._id, action: 'CREATE', entity: 'Case', entityId: newCase._id });

    res.status(201).json(newCase);
  } catch (error) {
    next(error);
  }
};

const getCasesByPatient = async (req, res, next) => {
  try {
    const cases = await Case.find({ patient: req.params.patientId }).sort({ createdAt: -1 }).populate('doctor', 'name');
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

const getCaseById = async (req, res, next) => {
  try {
    const caseItem = await Case.findById(req.params.id).populate('patient').populate('doctor', 'name role');
    if (caseItem) {
      res.json(caseItem);
    } else {
      res.status(404);
      throw new Error('Case not found');
    }
  } catch (error) {
    next(error);
  }
};

const searchCases = async (req, res, next) => {
  try {
    const { keyword } = req.query;
    if (!keyword) return res.json([]);

    const searchRegex = new RegExp(keyword.trim(), 'i');

    const cases = await Case.find({
      $or: [
        { diagnosis: { $regex: searchRegex } },
        { grossDescription: { $regex: searchRegex } },
        { microscopicDescription: { $regex: searchRegex } }
      ]
    }).populate('patient', 'name nationalId').limit(15);
    res.json(cases);
  } catch (error) {
    next(error);
  }
};

const getCases = async (req, res, next) => {
  try {
    const page = Number(req.query.pageNumber) || 1;
    const pageSize = 10;
    const count = await Case.countDocuments({});

    const cases = await Case.find({})
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .populate('patient', 'name nationalId')
      .populate('doctor', 'name');

    res.json({ cases, page, pages: Math.ceil(count / pageSize) });
  } catch (error) {
    next(error);
  }
};

module.exports = { addCase, getCasesByPatient, getCaseById, searchCases, getCases };
