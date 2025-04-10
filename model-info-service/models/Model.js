const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  provider: { type: String, required: true },
  description: { type: String },
  logoUrl: { type: String },
  requiresApiKey: { type: Boolean, default: false },
  pros: { type: [String] },
  cons: { type: [String] },
  parameters: {
    type: [
      {
        name: { type: String, required: true },
        description: { type: String },
        type: { type: String, enum: ['string', 'number', 'boolean', 'array'], default: 'string' }, // Added enum for type validation
        options: { type: [String] },
        min: { type: Number },
        max: { type: Number },
        step: { type: Number },
      },
    ],
  },
  examplePrompts: { type: [String] },
  runsLocally: { type: Boolean, default: false },
});

const Model = mongoose.model('Model', modelSchema);

module.exports = Model;