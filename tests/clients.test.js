const mongoose = require("mongoose");
const { server } = require("../index");
const Client = require("../models/client");
const {
  initialClients,
  getAllClients,
  getAllDNIFromClients,
  api,
} = require("./clientHelper");

beforeEach(async () => {
  await Client.deleteMany({});

  for (const client of initialClients) {
    const clientObject = new Client(client);
    await clientObject.save();
  }
});

//POST
xdescribe("Post Client: ", () => {
  test("Un cliente puede ser creado", async () => {
    const newClient = {
      propertyID: "620e811562c266edbeaca6fd",
      name: "Omar",
      dni: "1215015892",
      adress: "Direccion random en Medellin",
      phone: "3227926982",
      age: "22",
      permission: {
        crudClient: true,
      },
      payDay: "30",
      paymentIssued: [
        {
          date: "2022-01-30T02:40:10.671Z",
        },
      ],
    };

    await api
      .post("/api/clients")
      .send(newClient)
      .expect(201)
      .expect("Content-tpye", /application\/json/);

    const allClients = await allClients();
    expect(allClients).toHaveLength(allClients.length + 1);
    const allDNI = await getAllDNIFromClients();
    expect(allDNI).toContain(newClient.dni);
  });

  test("Retorna un error si el dni ya existe en la coleccion", async () => {
    const clientsAtStart = await getAllClients();

    const newClient = {
      propertyID: "620e82d3a72c0b07f4a80ae3",
      name: "Alexander",
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
    };

    const result = await api
      .post("/api/clients")
      .send(newClient)
      .expect(409)
      .expect("Content-type", /application\/json/);

    expect(result.text).toContain("The DNI already exists in the DB");

    const clientsAtEnd = await getAllClients();
    expect(clientsAtEnd).toHaveLength(clientsAtStart.length);
  });
});

//GET
describe("GET Client:", () => {
  test("Los clientes son retornados como JSON", async () => {
    await api
      .get("/api/clients")
      .expect(200)
      .expect("Content-type", /application\/json/);
  });

  test("Responde `unknown endpoint` si el path es incorrecto", async () => {
    const response = await api
      .get("/api/clientes")
      .expect(404)
      .expect("Content-type", /application\/json/);

    expect(response.text).toContain("unknown endpoint");
  });

  test("Responde con un mensaje adecuado si el cliente no existe", async () => {
    const response = await api
      .get("/api/clients/620ea3ef1e94bd784df9d999")
      .expect(404)
      .expect("Content-type", /application\/json/);

    expect(response.text).toContain("does not exist");
  });
});

//UPDATE
describe("PUT Client", () => {
  test("Un cliente puede ser actulizado", async () => {
    const allClients = await getAllClients();
    const id = allClients[0].id;

    const update = {
      id,
      addres: "Direccion random en Medellin",
      phone: "776140265",
      age: 30,
    };

    await api
      .put(`/api/clients/${id}`)
      .send(update)
      .expect(200)
      .expect("Content-type", /application\/json/);
  });

  test("Responde con un mensaje adecuado si el cliente no existe", async () => {
    const response = await api
      .get("/api/clients/620ea3ef1e94bd784df9d999")
      .expect(404)
      .expect("Content-type", /application\/json/);

    expect(response.text).toContain("does not exist");
  });
});

//DELETE
describe("DELETE Client:", () => {
  test("Un cliente puede ser eliminado", async () => {
    const allClients = await getAllClients();
    const id = allClients[1].id;

    await api.delete(`/api/clients/${id}`).expect(200);

    const newClients = await getAllClients();
    expect(newClients).toHaveLength(allClients.length - 1);
    expect(newClients).not.toContain(allClients[1].name);
  });

  test("Un cliente que no existe no puede ser borrado", async () => {
    const allClients = await getAllClients();

    await api.delete("/api/clients/1234").expect(400);

    expect(allClients).toHaveLength(allClients.length);
  });

  afterAll(() => {
    mongoose.connection.close();
    server.close();
  });
});
