const checkoutRouter = require("express").Router();
const mercadopago = require("mercadopago");

const createorder = async (req, res) => {
  //TEST-3793295535523231-030506-300abfd4672588102dc3dca173408d87-1084485093
  const { title, price } = req.body;
  mercadopago.configure({
    public_key: "TEST-0c8b4a8a-9e63-436c-960b-b2e75a65eee4",
    access_token:
      "TEST-3793295535523231-030506-300abfd4672588102dc3dca173408d87-1084485093",
  });

  var preference = {
    items: [
      {
        title: title,
        quantity: 1,
        currency_id: "USD",
        unit_price: price,
      },
    ],
    back_urls: {
      success: "http://localhost:3000/",
      failure: "http://localhost:3001/api/checkout/approved",
      pending: "",
    },
    auto_return: "approved",
  };

  mercadopago.preferences
    .create(preference)
    .then((r) => {
      return res.send(r.body.id);
    })
    .catch((err) => {
      console.log(err);
    });
};

const approved = async (req, res) => {
  console.log("entré a approved");
  console.log("--------req.query--------------", req.query);
  res.status(200);
};

const failure = (req, res) => {
  console.log("entré");
  console.log("------------------failure-------", req.body);
  console.log("----------------------------", req.query);
  console.log("------------------------------", req.params);
  res.status(200);
};

checkoutRouter.post("/", createorder);
checkoutRouter.get("/approved", approved);
checkoutRouter.post("/failure", failure);

module.exports = checkoutRouter;
