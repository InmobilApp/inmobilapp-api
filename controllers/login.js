const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const loginRouter = require("express").Router();
const Client = require("../models/client");
const Agent = require("../models/agent");
const Admin = require("../models/admin");

loginRouter.post("/", async (req, res) => {
  const { dni, password, email } = req.body;
  if (dni && password) {
    const client = await Client.findOne({ dni });

    if (client) {
      const passwordCorrect = await bcrypt.compare(password, client.password);

      if (!passwordCorrect) {
        return res.status(401).json({ text: "Invalid dni or password" }).end();
      }

      const clientForToken = {
        id: client._id,
        dni: client.dni,
        email: client.email,
      };

      const token = jwt.sign(clientForToken, process.env.SECRET);

      res.send({
        id: client.id,
        name: client.name,
        dni: client.dni,
        email: client.email,
        role: client.role,
        address: client.address,
        phone: client.phone,
        age: client.age,
        favoriteProperties: client.favoriteProperties,
        payDay: client.payDay,
        paymentIssued: client.paymentIssued,
        propertyID: client.propertyID,
        agentID: client.agentID,
        token,
      });
    }
  }
  if (email) {
    const client = await Client.findOne({ email });

    if (!client) {
      return res.status(401).json({ text: "Invalid email" }).end();
    }

    const clientForToken = {
      id: client._id,
      dni: client.dni,
      email: client.email,
    };

    const token = jwt.sign(clientForToken, process.env.SECRET);

    res.send({
      id: client.id,
      name: client.name,
      dni: client.dni,
      email: client.email,
      role: client.role,
      address: client.address,
      phone: client.phone,
      age: client.age,
      favoriteProperties: client.favoriteProperties,
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
      agentID: agent._id,
      dni: agent.dni,
      role: agent.role,
    };

    const token = jwt.sign(agentForToken, process.env.SECRET);

    res.send({
      id: agent.id,
      name: agent.name,
      dni: agent.dni,
      role: agent.role,
      address: agent.address,
      permissions: agent.permissions,
      age: agent.age,
      properties: agent.properties,
      adminID: agent.adminID,
      token,
    });
  }

  const admin = await Admin.findOne({ dni });

  if (admin) {
    const passwordCorrect = await bcrypt.compare(password, admin.password);

    if (!passwordCorrect)
      return res.status(401).json({ text: "Invalid dni or password" }).end();

    const adminForToken = {
      userID: admin._id,
      dni: admin.dni,
      role: admin.role,
    };

    const token = jwt.sign(adminForToken, process.env.SECRET);

    res.send({
      id: admin.id,
      role: admin.role,
      name: admin.name,
      dni: admin.dni,
      address: admin.address,
      phone: admin.phone,
      age: admin.age,
      permissions: admin.permissions,
      crudAdmin: admin.crudAdmin,
      agentsID: admin.agentsID,
      token,
    });
  }
});

module.exports = loginRouter;
