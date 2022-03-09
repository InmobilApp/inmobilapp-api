const bcrypt = require("bcrypt");
const clientsRouter = require("express").Router();
const Client = require("../models/client");
const Property = require("../models/property");
const Agent = require("../models/agent");
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

  if (update.delFavPropertyID) {
    const { id } = decodedToken;
    const { delFavPropertyID } = update;

    const client = await Client.findById(id);
    client.favoriteProperties.length > 0
      ? (client.favoriteProperties = client.favoriteProperties.filter(
          (id) => id != delFavPropertyID
        ))
      : res
          .status(400)
          .json({ text: "The client does not has favorite properties" });

    const clientUpdated = await Client.findByIdAndUpdate(id, client, {
      new: true,
    });

    clientUpdated
      ? res.json(clientUpdated).end()
      : res.status(404).json({ text: "The client does not exist" });
  }

  if (update.deleteAllFavoriteProperties) {
    const { id } = decodedToken;
    const client = await Client.findById(id);
    client.favoriteProperties = [];

    const clientUpdated = await Client.findByIdAndUpdate(id, client, {
      new: true,
    });

    clientUpdated
      ? res.json(clientUpdated).end()
      : res.status(404).json({ text: "The client does not exist" });
  }

  if (update.delPropertyID) {
    const { clientID } = update;
    const client = await Client.findById(clientID);
    client.propertyID = null;
    client.propertyRequest = false;

    const clientUpdated = await Client.findByIdAndUpdate(clientID, client, {
      new: true,
    });

    clientUpdated
      ? res.json(clientUpdated).end()
      : res.status(404).json({ text: "The client does not exist" });
  }

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
    const { propertyID, clientID } = update;
    const { agentID } = decodedToken;

    const client = await Client.findById(clientID);
    const agent = await Agent.findById(agentID);

    if (client.propertyID)
      res.status(400).json({
        text: `The client already has a property assigned. The ID of that property is: ${client.propertyID}`,
      });

    if (!(client.propertyID && client.propertyID.toString() === propertyID)) {
      client.propertyID = propertyID;
      client.propertyRequest = true;
      agent.clientsID = agent.clientsID.concat(clientID);
      await agent.save();

      const clientUpdated = await Client.findByIdAndUpdate(clientID, client, {
        new: true,
      }).populate("propertyID");

      if (clientUpdated) return res.json(clientUpdated).end();
      else return res.status(404).json({ text: "The client does not exist" });
    } else
      return res
        .status(400)
        .json({ text: "The client already has that property assigned" });
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

clientsRouter.delete("/", async (req, res) => {
  const { clientID } = req.body;

  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    // authorization = 'Bearer 46as4dq8w5e4q5w4x4'
    // token = authorization.split(' ')[1] -> Otra forma de sacar el token
    token = authorization.substring(7);
  }

  let decodedToken = {};
  decodedToken = jwt.verify(token, process.env.SECRET);
  const { role } = decodedToken;

  if (role === "AGENT") {
    const client = await Client.findById(clientID);

    if (!client)
      return res
        .status(404)
        .json({ msg: "The client was not found in the DB" });

    if (client.favoriteProperties.length > 0 || client.propertyID)
      return res.status(400).json({
        msg: "You can not delete a client with favorite properties or with a property assigned",
      });

    await Client.findByIdAndDelete(clientID);
    res.json({ msg: "Client deleted" }).end();
  }

  return res.status(403).json({ msg: "Only an agent can delete a client!" });
});

module.exports = clientsRouter;
