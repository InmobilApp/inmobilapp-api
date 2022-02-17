const agentsRouter = require("express").Router();
const Agent = require("../models/agent");
const Admin = require("../models/admin");

agentsRouter.get("/", async (req, res) => {
  const agents = await Agent.find({});
  res.json(agents).end();
});

agentsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const agent = await Agent.findById(id).populate("properties");
  agent
    ? res.json(agent).end()
    : res.status(404).json({ test: "The agent does not exist" }).end();
});

agentsRouter.put("/:id", async (req, res) => {
  const { id, ...update } = req.body;

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
  const { adminID, name, dni, adress, phone, age, permissions } = req.body;

  const admin = await Admin.findById(adminID);

  const newAgent = new Agent({
    name,
    dni,
    adress,
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
