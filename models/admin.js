const moongose = require('mongoose');

const adminSchema = new moongose.Schema({
  name: String,
  dni: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: String,
  phone: String,
  age: String,
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
  role: {
    type: String,
    default: 'ADMIN',
  },
});

adminSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = moongose.model('Admin', adminSchema);
