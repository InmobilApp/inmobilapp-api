const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Client = require("../models/client");

loginRouter.post("/", async (req, res) => {
  const { dni, password } = req.body;

  const client = await Client.findOne({ dni });
  const passwordCorrect =
    client === null ? false : await bcrypt.compare(password, client.password);

  if (!(client && passwordCorrect)) {
    return res.status(401).json({ text: "Invalid client or password" }).end();
  }

  const clientForToken = {
    id: client._id,
    dni: client.dni,
  };

  const token = jwt.sign(clientForToken, process.env.SECRET);
  res.send({
    name: client.name,
    dni: client.dni,
    role: client.role,
    address: client.address,
    phone: client.phone,
    age: client.age,
    payDay: client.payDay,
    paymentIssued: client.paymentIssued,
    propertyID: client.propertyID,
    token,
  });
});

module.exports = loginRouter;
