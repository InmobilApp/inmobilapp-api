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
        currency_id: "ARS",
        unit_price: price,
      },
    ],
    back_urls: {
      success: "http://localhost:3001/api/checkout/approved",
      failure: "http://localhost:3001/api/checkout/approved",
    },
  };

  mercadopago.preferences
    .create(preference)
    .then((r) => {
      console.log(r);
      return res.send(r.body.id);
    })
    .catch((err) => {
      console.log(err);
    });
};

const approved = async (req, res) => {
  const data = req.query;

  console.log(data);
  res.status(200);
};

checkoutRouter.post("/", createorder);
checkoutRouter.post("/approved", approved);

module.exports = checkoutRouter;
