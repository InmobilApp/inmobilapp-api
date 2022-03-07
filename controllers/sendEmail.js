const sendEmailRouter = require("express").Router();
const nodemailer = require("nodemailer");
const { PASSWORD_INMOBILAPP } = require("../utils/config");

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp-mail.outlook.com",
    secure: false,
    port: 587,
    tls: {
      ciphers: "SSLv3",
    },
    auth: {
      user: "inmobilApp@outlook.com",
      pass: PASSWORD_INMOBILAPP,
    },
  });

sendEmailRouter.post("/", (req, res) => {
  const { email, template, name } = req.body;

  if (!email && !template) {
    return res.status(404).end();
  }

  const transporter = createTransporter();

  transporter.sendMail(
    {
      from: "inmobilApp@outlook.com",
      to: email,
      subject: `Hola ${name}`,
      html: template,
    },
    (err, info) => {
      if (err) {
        return res.status(404).end();
      }
      return res.json(info.response);
    }
  );
});

module.exports = sendEmailRouter;
