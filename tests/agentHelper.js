const { app } = require("../index");
const supertest = require("supertest");
const Agent = require("../models/Agent");
const api = supertest(app);

const initialAgents = [
  {
    adminID: "620d6c14128855e7e1a878e3",
    dni: "1014826698",
    name: "Dairo",
    adress: "Direccion random",
    phone: "56952632614",
    age: "27",
    permissions: {
      crudProperty: true,
    },
  },
  {
    adminID: "620d6c14128855e7e1a878e3",
    dni: "1014896698",
    name: "Alexander",
    adress: "742 Avenida siempre viva",
    phone: "7777777777",
    age: "25",
    permissions: {
      crudProperty: true,
    },
  },
  {
    adminID: "620d6c14128855e7e1a878e3",
    dni: "7324956698",
    name: "David",
    adress: "Direccion random barranca",
    phone: "3058945637",
    age: "22",
    permissions: {
      crudProperty: true,
    },
  },
];

const getAllAgents = async () => {
  const response = await api.get("/api/agents");
  return response.body;
};

const getAgentByID = (allAgents, id) => {
  return allAgents.find((agent) => agent.id === id);
};

const getAllNamesFromAgents = async () => {
  const response = await api.get("/api/agents");
  return response.body.map((agent) => agent.name);
};

module.exports = {
  initialAgents,
  getAllAgents,
  getAllNamesFromAgents,
  getAgentByID,
  api,
};
