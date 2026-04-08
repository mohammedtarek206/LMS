const mongoose = require('mongoose');

const templateSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model('Template', templateSchema);

module.exports = Template;
