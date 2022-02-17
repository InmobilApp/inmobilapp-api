const mongoose = require("mongoose");
const { server } = require("../index");
const Agent = require("../models/agent");
const {
  initialAgents,
  getAllAgents,
  getAllNamesFromAgents,
  getAgentByID,
  api,
} = require("./agentHelper");

beforeEach(async () => {
  await Agent.deleteMany({});

  for (const agent of initialAgents) {
    const agentObject = new Agent(agent);
    await agentObject.save();
  }
});

//GET
describe("GET agent:", () => {
  test("Los agentes son retornados como JSON", async () => {
    await api
      .get("/api/agents")
      .expect(200)
      .expect("Content-type", /application\/json/);
  });

  test("El nombre del primer agente es: Dairo", async () => {
    const agentNames = await getAllNamesFromAgents();
    expect(agentNames).toContain("Dairo");
  });
});

//POST
describe("POST agent:", () => {
  test("Un agente puede ser agregado", async () => {
    const newAgent = {
      adminID: "620d6c14128855e7e1a878e3",
      dni: "2014823478",
      name: "Bart",
      adress: "SpringFiled",
      phone: "559656231",
      age: "16",
      permissions: {
        crudProperty: true,
      },
    };

    await api
      .post("/api/agents")
      .send(newAgent)
      .expect(201)
      .expect("Content-tpye", /application\/json/);

    const response = await getAllAgents();
    expect(response).toHaveLength(initialAgents.toHaveLength + 1);
    const agentNames = await getAllNamesFromAgents();
    expect(agentNames).toContain(newAgent.name);
  });
});

describe("PUT agent:", () => {
  test("Un agente puede ser actualizado", async () => {
    const allAgents = await getAllAgents();
    const id = allAgents[0].id;
    const agent = await getAgentByID(allAgents, id);

    await api
      .put(`/api/agents/${id}`)
      .send(agent)
      .expect(200)
      .expect("Content-type", /application\/json/);
  });
});

describe("DELETE agent: ", () => {
  test("Un agente puede ser borrado", async () => {
    const allAgents = await getAllAgents();
    const id = allAgents[1].id;
    const agentToDelete = await getAgentByID(allAgents, id);

    await api.delete(`/api/agents/${id}`).send(agentToDelete).expect(200);

    const newAgents = await getAllAgents();
    expect(newAgents).toHaveLength(allAgents.length - 1);
    expect(newAgents).not.toContain(agentToDelete.name);
  });

  test("Un agente que no existe no puede ser borrado", async () => {
    await api.delete("/api/agents/1234").expect(400);

    const allAgents = await getAllAgents();
    expect(allAgents).toHaveLength(allAgents.length);
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
});
