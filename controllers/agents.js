const agentsRouter = require("express").Router();
const Agent = require("../models/agent");
const Admin = require("../models/admin");

agentsRouter.get("/", async (req, res) => {
  const agents = await Agent.find({}).populate("properties");
  res.json(agents).end();
});

agentsRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  const agent = await Agent.findById(id);
  agent ? res.json(agent).end() : res.status(404).end();
});

agentsRouter.put("/:id", async (req, res) => {
  const { id, ...newAgentInfo } = req.body;

  const agent = {
    ...newAgentInfo,
  };

  const agentUpdated = await Agent.findByIdAndUpdate(id, agent, {
    new: true,
  });
  res.json(agentUpdated).end();
});

agentsRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  await Agent.findByIdAndDelete(id);
  res.status(200).end();
});

agentsRouter.post("/", async (req, res) => {
  const { adminID, name, dni, adress, phone, age, permissions } = req.body;

  const user = await Agent.findById(adminID);

  const newAgent = new Agent({
    name,
    dni,
    adress,
    phone,
    age,
    adminID: user._id,
    permissions,
  });

  const savedAgent = await newAgent.save();

  res.status(201).json(savedAgent).end();
});
module.exports = agentsRouter;
