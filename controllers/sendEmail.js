const sendEmailRouter = require("express").Router();
const nodemailer = require("nodemailer");
const { EMAIL, PASSWORD } = require("../utils/config");

const createTransporter = () =>
  nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: EMAIL,
      pass: PASSWORD,
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
      from: EMAIL,
      to: email,
      subject: `Hola ${name}`,
      html: template,
    },
    (err, info) => {
      if (err) {
        return res.status(404).json(err);
      }
      return res.json(info.response);
    }
  );
});

module.exports = sendEmailRouter;
