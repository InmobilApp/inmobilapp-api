const agentsRouter = require("express").Router();
const Agent = require("../models/agent");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

agentsRouter.get("/", async (req, res) => {
  const agents = await Agent.find({});
  res.json(agents).end();
});

agentsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { detailsProperties } = req.query;

  if (detailsProperties === "true") {
    const completAgentInfo = await Agent.findById(id).populate("properties");
    completAgentInfo
      ? res.json(completAgentInfo).end()
      : res.status(404).json({ test: "The agent does not exist" }).end();
  }

  const agent = await Agent.findById(id);
  agent
    ? res.json(agent).end()
    : res.status(404).json({ test: "The agent does not exist" }).end();
});

agentsRouter.put("/", async (req, res) => {
  // const { id } = req.params;
  const { agentID, ...update } = req.body;
  console.log(update.permissions);

  // Validación para actualizar datos del Agente_____________________________________
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    // authorization = 'Bearer 46as4dq8w5e4q5w4x4'
    // token = authorization.split(' ')[1] -> Otra forma de sacar el token
    token = authorization.substring(7);
  }

  let decodedToken = {};
  decodedToken = jwt.verify(token, process.env.SECRET);
  const { userID, role } = decodedToken;

  if (update.dni)
    return res.status(403).json({ text: "You can not change the dni number" });

  if (update.role) {
    if (role === "AGENT")
      return res.status(403).json({ text: "You can not change your role!" });
    if (role === "ADMIN") {
      const agentUpdated = await Agent.findByIdAndUpdate(agentID, update, {
        new: true,
      });
      agentUpdated
        ? res.json(agentUpdated).end()
        : res.status(404).json({ test: "The agent does not exist" }).end();
    }
    return res.status(403).json({ text: "You do not have permissions!" });
  }

  if (update.permissions) {
    if (role === "AGENT")
      return res
        .status(403)
        .json({ text: "You can not change your permissions" });
    if (role === "ADMIN") {
      const agentUpdated = await Agent.findByIdAndUpdate(agentID, update, {
        new: true,
      });
      agentUpdated
        ? res.json(agentUpdated).end()
        : res.status(404).json({ test: "The agent does not exist" }).end();
    }
  }

  if (update.password && update.newPassword) {
    if (role === "AGENT") {
      const agent = await Agent.findById(userID);
      const passwordCorrect = await bcrypt.compare(
        update.password,
        agent.password
      );

      if (!(agent && passwordCorrect)) {
        return res
          .status(401)
          .json({ text: "Invalid agent or password" })
          .end();
      }

      const newPasswordHash = await bcrypt.hash(update.newPassword, 10);
      update.password = newPasswordHash;
    }

    return res
      .status(403)
      .json({ msg: "Only an agent, can change his password!" });
  }

  const agentUpdated = await Agent.findByIdAndUpdate(userID, update, {
    new: true,
  });
  agentUpdated
    ? res.json(agentUpdated).end()
    : res.status(404).json({ test: "The agent does not exist" }).end();
});

agentsRouter.delete("/:id", async (req, res) => {
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
  const { role } = decodedToken;

  if (role === "ADMIN") {
    const agent = await Agent.findById(id);
    agent.properties.length > 0
      ? res.status(403).json({ msg: "Forbidden! The agent has properties" })
      : (await Agent.findByIdAndDelete(id), res.status(200).end());
  }

  res.status(403).json({ msg: "You do not have permissions!" });
});

agentsRouter.post("/", async (req, res) => {
  const { adminID, name, dni, password, address, phone, age, permissions } =
    req.body;

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await Admin.findById(adminID);

  if (!admin)
    return res.status(400).json({
      text: `Please verify the adminID. The adminID(${adminID}), not belongs to an admin.`,
    });

  const newAgent = new Agent({
    name,
    dni,
    password: passwordHash,
    address,
    phone,
    age,
    adminID: admin._id,
    permissions,
  });

  const savedAgent = await newAgent.save();
  admin.agentsID = admin.agentsID.concat(savedAgent._id);
  await admin.save();
  res.status(201).json(savedAgent).end();
});
module.exports = agentsRouter;
