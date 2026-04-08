const mongoose = require('mongoose');

const caseSchema = mongoose.Schema(
  {
    patient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Patient',
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },

    diagnosis: {
      type: String,
      required: true,
    },
    specimen: {
      type: String,
      required: true,
    },
    grossDescription: {
      type: String,
      required: true,
    },
    microscopicDescription: {
      type: String,
      required: true,
    },
    attachedFiles: [
      {
        filename: String,
        fileId: String, // from Google Drive
        url: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

caseSchema.index({ diagnosis: 'text', grossDescription: 'text', microscopicDescription: 'text' });

const Case = mongoose.model('Case', caseSchema);

module.exports = Case;
