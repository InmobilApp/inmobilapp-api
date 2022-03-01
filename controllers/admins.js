const adminRouter = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

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
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  jwt.verify(token, process.env.SECRET);

  const { id, password, dni, newPassword, ...newAdminInfo } = req.body;

  if (dni) {
    return res
      .status(403)
      .json({ error: "You can not change your dni number" });
  }

  let admin = {
    ...newAdminInfo,
  };

  const admin = await Admin.findById(id);
  if (!admin) return res.status(404).end();

  if (password && newPassword) {
    const passwordCorrect = await bcrypt.compare(password, admin.password);

    if (!(admin && passwordCorrect)) return res.status(401).end();

    const hashPassword = await bcrypt.hash(newPassword, 10);

    admin = {
      ...newAdminInfo,
      password: hashPassword,
    };
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(id, admin, {
    new: true,
  });

  return res.json(updatedAdmin);
});

adminRouter.delete("/:id", async (req, res) => {
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.toLocaleLowerCase().startsWith("bearer")) {
    token = authorization.substring(7);
  }

  jwt.verify(token, process.env.SECRET);

  const { id } = req.params;

  const admin = await Admin.findById(id);

  if (!admin) return res.status(404).end();

  if (admin.agentsID.length !== 0) {
    return res.status(404).json({ error: "he have agents" });
  }

  await Admin.findByIdAndRemove(id);
  return res.status(204).end();
});

module.exports = adminRouter;
