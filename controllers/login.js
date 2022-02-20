const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Client = require("../models/client");

loginRouter.post("/", async (req, res) => {
  const { dni, password } = req.body;

  const client = await Client.findOne({ dni });
  const passwordCorrect =
    client === null ? false : await bcrypt.compare(password, client.password);

  if (!(client && passwordCorrect))
    res.status(401).json({ text: "Invalid client or password" }).end();

  const clientForToken = {
    id: client._id,
    dni: client.dni,
  };

  const token = jwt.sign(clientForToken, process.env.SECRET);

  res.send({
    name: client.name,
    dni: client.dni,
    token,
  });
});

module.exports = loginRouter;
