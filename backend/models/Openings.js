
const mongoose = require('mongoose');

const openingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: [true, 'You must supply title!'],
    },
    location: {
      type: String,
      trim: true,
      required: [true, 'You must supply location!'],
    },
    description: {
      type: String,
      required: [false, 'You must supply description!'],
    },
    openings: {
      type: Number,
      required: [true, 'You must supply opening number!'],
    },
    skills: {
      type: String,
      required: [true, 'You must supply skills!'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organization',
      required: [true, 'You must supply an organization for employee!'],
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);


const Openings = mongoose.model('Openings', openingSchema);

module.exports = Openings;
