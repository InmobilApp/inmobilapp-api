const bcrypt = require("bcrypt");
const clientsRouter = require("express").Router();
const Client = require("../models/client");
const Property = require("../models/property");
const jwt = require("jsonwebtoken");

clientsRouter.post("/", async (req, res) => {
  const { password, ...newClient } = req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const client = new Client({
    ...newClient,
    password: passwordHash,
  });

  const savedClient = await client.save();
  res.status(201).json(savedClient).end();
});

clientsRouter.get("/", async (req, res) => {
  const clients = await Client.find({});
  res.json(clients).end();
});

clientsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const clients = await Client.findById(id)
    .populate("propertyID")
    .populate("favoriteProperties");
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

  if (update.favPropertyID) {
    const property = await Property.findById(update.favPropertyID);
    if (property) {
      const { id } = decodedToken; // Obtengo el id del usuario
      const client = await Client.findById(id);

      if (client.favoriteProperties.includes(update.favPropertyID)) {
        return res.status(400).json({
          msg: `FavpropertyID: ${update.favPropertyID} is already in favoriteProperties`,
        });
      }
      client.favoriteProperties.push(property._id.toString());
      await client.save();

      if (!property.clientsID.includes(id)) {
        property.clientsID.push(client._id.toString());
        await property.save();
      }

      const clientUpdated = await Client.findByIdAndUpdate(id, client, {
        new: true,
      });

      clientUpdated
        ? res.json(clientUpdated).end()
        : res.status(404).json({ text: "The client does not exist" });
    }
  }

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

  const { id } = decodedToken;
  const clientUpdated = await Client.findByIdAndUpdate(id, update, {
    new: true,
  });

  clientUpdated
    ? res.json(clientUpdated).end()
    : res.status(404).json({ text: "The client does not exist" });
});

clientsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const { deleteFavoriteProperties } = req.query;

  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    // authorization = 'Bearer 46as4dq8w5e4q5w4x4'
    // token = authorization.split(' ')[1] -> Otra forma de sacar el token
    token = authorization.substring(7);
  }

  jwt.verify(token, process.env.SECRET);

  const client = await Client.findById(id);

  if (!client)
    return res.status(404).json({ msg: "The client was not found in the DB" });

  if (deleteFavoriteProperties) {
    client.favoriteProperties = [];
    await client.save();
  }

  res.json({ msg: "The favorites properties of client were deleted" }).end();
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

  jwt.verify(token, process.env.SECRET);

  const client = await Client.findById(id);

  if (!client)
    return res.status(404).json({ msg: "The client was not found in the DB" });

  if (client.favoriteProperties.length > 0)
    return res
      .status(400)
      .json({ msg: "You can not delete clients with favorite properties" });

  await Client.findByIdAndDelete(id);
  res.json({ msg: "Client deleted" }).end();
});

module.exports = clientsRouter;
