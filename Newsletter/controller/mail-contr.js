const nodeMailer = require("nodemailer");
const { Hello } = require("./hello_template");

exports.sendMail = (req, res) => {
  let userMail = req.body.userEmail;
  let userName = req.body.userName;

  let transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let message = {
    from: process.env.EMAIL,
    to: userMail,
    subject: ` Hola ${userName}!`,
    html: Hello(),
    //aca va el html tambien con el cuerpo del msj
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("error en el envio del mensaje", err);
      return res.status(400).json({
        message: `error en el envio del mail ${err}`,
      });
    } else {
      console.log("mensaje enviado con exito", info);
      return res.json({
        message: info,
      });
    }
  });
};
