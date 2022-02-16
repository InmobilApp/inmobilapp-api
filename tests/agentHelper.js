const { app } = require("../../index");
const supertest = require("supertest");
const Agent = require("../models/Agent");
const api = supertest(app);

const initialAgents = [
  {
    dni: "1012437698",
    name: "Alexander",
    adress: "Avenida Siempreviva 742",
    phone: "7777777",
    age: "25",
  },
  {
    dni: "104587955",
    name: "David",
    adress: "Direccion random 231",
    phone: "745445",
    age: "23",
  },
  {
    dni: "3396737163",
    name: "Andres",
    adress: "Direccion random 873",
    phone: "5298562",
    age: "30",
  },
];

const getAllAgents = async () => {
  const response = await api.get("/api/agents");
  return response.body;
};

const getAgentByID = async (allAgents, id) => {
  return allAgents.find((agent) => agent.id === id);
};

module.exports = { initialAgents, getAllAgents, getAgentByID };
