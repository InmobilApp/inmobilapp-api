const moongose = require('mongoose');

const adminSchema = new moongose.Schema({
  name: String,
  password: String,
  email: {
    type: String,
    minlength: 10,
  },
});

module.exports = moongose.model('Admin', adminSchema);
