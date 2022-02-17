const clientsRouter = require("express").Router();
const Client = require("../models/client");
const Property = require("../models/property");

clientsRouter.post("/", async (req, res) => {
  const {
    propertyID,
    name,
    dni,
    adress,
    phone,
    age,
    permissions,
    payDay,
    paymentIssued,
  } = req.body;

  const property = await Property.findById(propertyID);

  const newClient = new Client({
    propertyID: property._id,
    name,
    dni,
    adress,
    phone,
    age,
    permissions,
    payDay,
    paymentIssued,
  });

  const savedClient = await newClient.save();
  res.status(201).json(savedClient).end();
});

clientsRouter.get("/", async (req, res) => {
  const clients = await Client.find({});
  res.json(clients).end();
});

clientsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const clients = await Client.findById(id).populate("propertyID");
  res.json(clients).end();
});

clientsRouter.put("/:id", async (req, res) => {
  const { id, ...update } = req.body;

  const clientUpdated = await Client.findByIdAndUpdate(id, update, {
    new: true,
  });
  res.json(clientUpdated).end();
});

clientsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Client.findByIdAndDelete(id);
  res.status(200).end();
});

module.exports = clientsRouter;
