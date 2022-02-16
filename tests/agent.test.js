const mongoose = require("mongoose");
const { server } = require("../../index");
const Agent = require("../models/agent");
const { initialAgents, getAllAgents, getAgentByID } = require("./agentHelper");

beforeEach(async () => {
  await Agent.deleteMany({});

  for (const agent of initialAgents) {
    const agentObject = new Agent(agent);
    await agentObject.save();
  }
});

//GET
describe("Get agent", () => {
  test("Los agentes son retornados como JSON?", async () => {});
});
