const adminRouter = require("express").Router();
const bcrypt = require("bcrypt");
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");

adminRouter.get("/", async (req, res) => {
  const admins = await Admin.find({});

  res.json(admins);
});

adminRouter.post("/", async (req, res) => {
  const { password, ...newAdmin } = req.body;

  const hashPassword = await bcrypt.hash(password, 10);
  const admin = new Admin({
    ...newAdmin,
    password: hashPassword,
  });

  const savedAdmin = await admin.save();
  res.status(201).json(savedAdmin);
});

adminRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { detailsAgent } = req.query;

  const admin = await Admin.findById(id);

  if (admin) {
    if (detailsAgent === "true") {
      res.json(await Admin.findById(id).populate("agentsID"));
    } else {
      res.json(admin);
    }
  } else {
    res.status(404).end();
  }
});

adminRouter.put("/:id", async (req, res) => {
  const { id, ...newAdminInfo } = req.body;

  const admin = {
    ...newAdminInfo,
  };

  //Validación__________________________________________________________________________
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  let decodedToken = {};

  decodedToken = jwt.verify(token, process.env.SECRET);
  //_____________________________________________________________________________________

  const updatedAdmin = await Admin.findByIdAndUpdate(id, admin, {
    new: true,
  });
  res.json(updatedAdmin);
});

adminRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  //Validación__________________________________________________________________________
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  let decodedToken = {};

  decodedToken = jwt.verify(token, process.env.SECRET);
  //_____________________________________________________________________________________

  await Admin.findByIdAndRemove(id);
  res.status(204).end();
});

module.exports = adminRouter;
