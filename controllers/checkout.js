const checkoutRouter = require("express").Router();
const mercadopago = require("mercadopago");

const createorder = async (req, res) => {
  //TEST-3793295535523231-030506-300abfd4672588102dc3dca173408d87-1084485093
  mercadopago.configure({
    access_token:
      "TEST-3793295535523231-030506-300abfd4672588102dc3dca173408d87-1084485093",
  });

  var preference = {
    items: [
      {
        title: "Pelota",
        quantity: 1,
        currency_id: "COP",
        unit_price: 20000,
      },
    ],
    notification_url: "http://localhost:3001/api/notification",
  };

  mercadopago.preferences
    .create(preference)
    .then((r) => {
      return res.json(r);
    })
    .catch((err) => {
      console.log(err);
    });
};

const notification = async (req, res) => {
  const data = req.query;

  console.log(data);
  res.status(200);
};

checkoutRouter.post("/", createorder);
checkoutRouter.post("/notification", notification);

module.exports = checkoutRouter;
