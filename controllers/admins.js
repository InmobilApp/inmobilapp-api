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

adminRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  const admin = Admin.findById(id).populate("agents");

  if (admin) return res.json(admin);
  res.status(404).end();
});

adminRouter.put("/:id", async (req, res) => {
  const { id, ...newAdminInfo } = req.body;

  const admin = {
    ...newAdminInfo,
  };

  const updatedAdmin = await Property.findByIdAndUpdate(id, admin, {
    new: true,
  });
  res.json(updatedAdmin);
});

adminRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Property.findByIdAndRemove(id);
  res.status(204).end();
});

module.exports = adminRouter;
