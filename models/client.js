const { Schema, model } = require("mongoose");

const clientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: "CLIENT",
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: String,
  age: String,
  favoriteProperties: [
    {
      type: Schema.Types.ObjectId,
      ref: "Property",
    },
  ],
  permissions: {
    crudClient: Boolean,
  },
  payDay: String,
  paymentIssued: [
    {
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  propertyID: {
    type: Schema.Types.ObjectId,
    ref: "Property",
  },
});

clientSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

module.exports = model("Client", clientSchema);
