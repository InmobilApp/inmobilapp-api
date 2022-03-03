const { Schema, model } = require("mongoose");

const validateEmail = (email) => {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

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
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
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
