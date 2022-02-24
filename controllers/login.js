const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Client = require("../models/client");
const Agent = require("../models/agent");

loginRouter.post("/", async (req, res) => {
  const { dni, password } = req.body;

  const client = await Client.findOne({ dni });

  if (client) {
    const passwordCorrect = await bcrypt.compare(password, client.password);

    if (!passwordCorrect) {
      return res.status(401).json({ text: "Invalid dni or password" }).end();
    }

    const clientForToken = {
      id: client._id,
      dni: client.dni,
    };

    const token = jwt.sign(clientForToken, process.env.SECRET);

    res.send({
      id: client._id,
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
  }

  const agent = await Agent.findOne({ dni });

  if (agent) {
    const passwordCorrect = await bcrypt.compare(password, agent.password);

    if (!passwordCorrect)
      return res.status(401).json({ text: "Invalid dni or password" }).end();

    const agentForToken = {
      id: agent._id,
      dni: agent.dni,
    };

    const token = jwt.sign(agentForToken, process.env.SECRET);

    res.send({
      id: agent.id,
      name: agent.name,
      dni: agent.dni,
      role: agent.role,
      addres: agent.addres,
      age: agent.age,
      properties: agent.properties,
      adminID: agent.adminID,
      token,
    });
  }
});

module.exports = loginRouter;
