const paymentRouter = require("express").Router();
const axios = require("axios");
const {
  PAYPAL_API,
  PAYPAL_API_CLIENT,
  PAYPAL_API_SECRET,
} = require("../utils/config");

const Client = require("../models/client");

const Capture = require("../templates/capture");

const baseUrl = "https://inmobil-app-api.herokuapp.com";
//const baseUrl = "http://localhost:3001";

paymentRouter.post("/create", async (req, res) => {
  const { description, value } = req.body;

  if (!description && !value) {
    return res.status(404).end();
  }

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: value,
        },
        description: description,
      },
    ],
    application_context: {
      brand_name: "Inmobil App",
      landing_page: "LOGIN",
      user_action: "PAY_NOW",
      return_url: `${baseUrl}/api/payment/capture`,
      cancel_url: `${baseUrl}/api/payment/cancel`,
    },
  };

  const resp = await axios.post(`${PAYPAL_API}/v2/checkout/orders`, order, {
    auth: {
      username: PAYPAL_API_CLIENT,
      password: PAYPAL_API_SECRET,
    },
  });

  return res.send(resp.data);
});

paymentRouter.get("/capture", async (req, res) => {
  const { token, PayerID } = req.query;

  const resp = await axios.post(
    `${PAYPAL_API}/v2/checkout/orders/${token}/capture`,
    {},
    {
      auth: {
        username: PAYPAL_API_CLIENT,
        password: PAYPAL_API_SECRET,
      },
    }
  );

  const paymentClient = await Client.findOne({
    email: resp.data.payer.email_address,
  });
  const clientID = paymentClient._id.toString();
  const { paymentIssued, payDay } = paymentClient;

  let newPayDay = payDay || "15/3/2022";
  let [dia, mes, anio] = newPayDay.split("/").map((d) => +d);
  if (mes === 12) {
    mes = 1;
    anio += 1;
  } else {
    mes += 1;
  }
  newPayDay = `${dia}/${mes}/${anio}`;

  const updateClient = {
    paymentIssued: [...paymentIssued, { date: new Date() }],
    payDay: newPayDay,
  };

  await Client.findByIdAndUpdate(clientID, updateClient, {
    new: true,
  });

  return res.send(Capture("Pago Realizado!"));
});

paymentRouter.get("/cancel", (req, res) => {
  res.json(Capture("No se relizo el pago!"));
});

module.exports = paymentRouter;
