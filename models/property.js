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
  },
  rentalPrice: Number,
  reviews: [{
    user: String, content: String, score: Number, date: Date,
  }],
  description: String,
  details: {
    area: Number,
    rooms: Number,
    baths: Number,
    garage: Boolean,
    type: String,
  },
  ouner: String,
});

module.exports = moongose.model('Property', propertySchema);
