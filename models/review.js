const moongose = require('mongoose');

const reviewSchema = new moongose.Schema({
  user: {
    type: String,
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
  },
  content: {
    type: String,
    required: true,
  },
  porpertyID: {
    type: moongose.Schema.Types.ObjectId,
    ref: 'Property',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

reviewSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = moongose.model('Review', reviewSchema);
