const { Schema, model } = require("mongoose");

const agentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dni: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: String,
  age: String,
  properties: [
    {
      type: Schema.Types.ObjectID,
      ref: "Property",
    },
  ],
  permissions: {
    crudProperty: Boolean,
  },
  admindID: {
    type: Schema.Types.ObjectID,
    ref: "Admin",
  },
});

agentSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = model("Agent", agentSchema);
