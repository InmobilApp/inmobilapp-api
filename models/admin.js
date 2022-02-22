const moongose = require('mongoose');

const adminSchema = new moongose.Schema({
  name: String,
  DNI: {
    type: String,
    unique: true,
  },
  address: String,
  phone: String,
  age: {
    type: Number,
    min: 0,
    max: 120,
  },
  permissions: {
    crudAgent: {
      type: Boolean,
      default: true,
    },
    crudAdmin: {
      type: Boolean,
      default: true,
    },
  },
  agentsID: [
    {
      type: moongose.Schema.Types.ObjectId,
      ref: 'Agent',
    },
  ],
});

adminSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = moongose.model('Admin', adminSchema);
