const moongose = require('mongoose');
const { Schema } = require('mongoose');

const propertySchema = new moongose.Schema({
  typeProperty: {
    type: String,
    enum: {
      values: ['casa', 'apartamento', 'local', 'finca'],
      message: '{VALUE} is not supported',
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  location: {
    city: { type: String, required: true },
    neighborhood: { type: String, required: true },
    address: { type: String, required: true },
  },
  images: [String],
  state: {
    type: String,
    enum: {
      values: ['available', 'unavailable', 'reserved'],
      message: '{VALUE} is not supported',
    },
    default: 'available',
  },
  rentalPrice: {
    type: Number,
    min: 10,
    max: 5000000,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  description: {
    type: String,
    minlength: 10,
  },
  details: {
    area: {
      type: Number,
      min: 10,
      max: 1000,
    },
    rooms: {
      type: Number,
      min: 1,
      max: 20,
    },
    baths: {
      type: Number,
      min: 1,
      max: 20,
    },
    garage: Boolean,
  },
  agentID: {
    type: Schema.Types.ObjectId,
    ref: 'Agent',
  },
});

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = moongose.model('Property', propertySchema);
