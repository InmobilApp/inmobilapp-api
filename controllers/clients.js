const clientsRouter = require("express").Router();
const Client = require("../models/client");

clientsRouter.get("/", async (req, res) => {
  const clients = await Client.find({});
  res.json(clients).end();
});

clientsRouter.post("/", async (req, res) => {
  const client = new Client(req.body);

  const savedClient = await client.save();
  res.status(201).json(savedClient).end();
});

module.exports = clientsRouter;
