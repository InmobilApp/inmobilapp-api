const moongose = require('mongoose');

const propertySchema = new moongose.Schema({
  name: {
    type: String,
    minlength: 5,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  ubication: String,
  images: [String],
  state: {
    type: String,
    enum: {
      values: ['available', 'unavailable', 'reserved'],
      message: '{VALUE} is not supported',
    },
    default: 'available',
  },
  rentalPrice: Number,
  reviews: [{
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
  }],
  description: String,
  details: {
    area: Number,
    rooms: Number,
    baths: Number,
    garage: Boolean,
  },
  ouner: String,
});

propertySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = moongose.model('Property', propertySchema);
