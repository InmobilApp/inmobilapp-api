const { app } = require("../index");
const supertest = require("supertest");
const api = supertest(app);

const initialClients = [
  {
    propertyID: "620e82d3a72c0b07f4a80ae3",
    name: "Mauricio",
    dni: "39641178",
    adress: "Direccion random en Colombia",
    phone: "3194785623",
    age: "28",
    permission: {
      crudClient: true,
    },
    payDay: "15",
    paymentIssued: [
      {
        date: "2022-01-15T02:40:10.671Z",
      },
    ],
  },
  {
    propertyID: "620e819562c266edbeaca701",
    name: "Alexander",
    dni: "1012475892",
    adress: "Direccion random en Bogota",
    phone: "3058746982",
    age: "25",
    permission: {
      crudClient: true,
    },
    payDay: "19",
    paymentIssued: [
      {
        date: "2022-01-19T02:40:10.671Z",
      },
    ],
  },
  {
    propertyID: "620e82058c77394d2ef5f502",
    name: "David",
    dni: "2218915892",
    adress: "Direccion random en Barranquilla",
    phone: "3228556982",
    age: "22",
    permission: {
      crudClient: true,
    },
    payDay: "16",
    paymentIssued: [
      {
        date: "2022-01-16T02:40:10.671Z",
      },
    ],
  },
];

const getAllClients = async () => {
  const response = await api.get("/api/clients");
  return response.body;
};

const getAllDNIFromClients = async () =>
  await getAllClients().map((client) => client.dni);

module.exports = {
  api,
  initialClients,
  getAllClients,
  getAllDNIFromClients,
};
