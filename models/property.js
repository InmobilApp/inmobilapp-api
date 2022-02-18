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
  rentalPrice: String,
  reviews: [
    {
      user: String,
      content: String,
      score: {
        type: Number,
        min: 0,
        max: 5,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  description: String,
  details: {
    area: String,
    rooms: String,
    baths: String,
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
