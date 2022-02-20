const bcrypt = require("bcrypt");
const clientsRouter = require("express").Router();
const Client = require("../models/client");
const Property = require("../models/property");

clientsRouter.post("/", async (req, res) => {
  const { name, dni, password, address, phone, age } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);
  const newClient = new Client({
    name,
    dni,
    password: passwordHash,
    address,
    phone,
    age,
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
  clients
    ? res.json(clients).end()
    : res.status(404).json({ text: "The client does not exist" });
});

clientsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  let { ...update } = req.body;

  if (!update.propertyID)
    res.status(400).json({ text: "Please send the propertyID" }).end();

  const property = await Property.findById(update.propertyID);

  update.propertyID = property._id;

  const clientUpdated = await Client.findByIdAndUpdate(id, update, {
    new: true,
  });

  clientUpdated
    ? res.json(clientUpdated).end()
    : res.status(404).json({ text: "The client does not exist" });
});

clientsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Client.findByIdAndDelete(id);
  res.json({ msg: "Agent deleted" }).end();
});

module.exports = clientsRouter;
