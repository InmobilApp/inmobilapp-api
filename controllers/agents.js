const agentsRouter = require("express").Router();
const Agent = require("../models/agent");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

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

agentsRouter.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { ...update } = req.body;

  const agentUpdated = await Agent.findByIdAndUpdate(id, update, {
    new: true,
  });
  agentUpdated
    ? res.json(agentUpdated).end()
    : res.status(404).json({ test: "The agent does not exist" }).end();
});

agentsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Agent.findByIdAndDelete(id);
  res.status(200).end();
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
