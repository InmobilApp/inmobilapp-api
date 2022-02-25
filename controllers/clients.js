const bcrypt = require("bcrypt");
const clientsRouter = require("express").Router();
const Client = require("../models/client");
const Property = require("../models/property");
const jwt = require("jsonwebtoken");

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

clientsRouter.put("/", async (req, res) => {
  let { ...update } = req.body;

  // Validación para actualizar datos del cliente_____________________________________
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    // authorization = 'Bearer 46as4dq8w5e4q5w4x4'
    // token = authorization.split(' ')[1] -> Otra forma de sacar el token
    token = authorization.substring(7);
  }

  let decodedToken = {};
  decodedToken = jwt.verify(token, process.env.SECRET);

  if (update.dni)
    return res.status(403).json({ text: "You can not change your dni number" });

  if (update.propertyID) {
    const property = await Property.findById(update.propertyID);
    update.propertyID = property._id;
  }

  if (update.password && update.newPassword) {
    const { id } = decodedToken; // Obtengo el id del usuario
    const client = await Client.findById(id);
    const passwordCorrect = await bcrypt.compare(
      update.password,
      client.password
    );

    if (!(client && passwordCorrect)) {
      return res.status(401).json({ text: "Invalid client or password" }).end();
    }

    const newPasswordHash = await bcrypt.hash(update.newPassword, 10);
    update.password = newPasswordHash;
  }

  const clientUpdated = await Client.findByIdAndUpdate(id, update, {
    new: true,
  });

  clientUpdated
    ? res.json(clientUpdated).end()
    : res.status(404).json({ text: "The client does not exist" });
});

clientsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    // authorization = 'Bearer 46as4dq8w5e4q5w4x4'
    // token = authorization.split(' ')[1] -> Otra forma de sacar el token
    token = authorization.substring(7);
  }

  let decodedToken = {};

  decodedToken = jwt.verify(token, process.env.SECRET);
  await Client.findByIdAndDelete(id);
  res.json({ msg: "Client deleted" }).end();
});

module.exports = clientsRouter;
