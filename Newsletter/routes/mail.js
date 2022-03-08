const express = require("express");
const routes = express.Router();
const { sendMail } = require("../controller/mail-contr");

routes.post("/sendmail", sendMail);

module.exports = routes;
