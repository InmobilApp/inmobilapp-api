const adminRouter = require("express").Router();
const Admin = require("../models/admin");

adminRouter.get("/", async (req, res) => {
  const admins = await Admin.find({});

  res.json(admins);
});

adminRouter.post("/", async (req, res) => {
  const admin = new Admin(req.body);

  const savedAdmin = await admin.save();
  res.status(201).json(savedAdmin);
});

module.exports = adminRouter;
