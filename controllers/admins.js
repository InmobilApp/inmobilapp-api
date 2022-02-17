const adminRouter = require("express").Router();
const Admin = require("../models/admin");

<<<<<<< HEAD
adminRouter.get('/', async (req, res) => {
=======
adminRouter.get("/", async (req, res) => {
>>>>>>> babaquero
  const admins = await Admin.find({});

  res.json(admins);
});

adminRouter.post("/", async (req, res) => {
  const admin = new Admin(req.body);

  const savedAdmin = await admin.save();
  res.status(201).json(savedAdmin);
});

adminRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const admin = await Admin.findById(id).populate('agents');

  if (admin) return res.json(admin);
  return res.status(404).end();
});

adminRouter.put('/:id', async (req, res) => {
  const { id, ...newAdminInfo } = req.body;

  const admin = {
    ...newAdminInfo,
  };

  const updatedAdmin = await Admin.findByIdAndUpdate(id, admin, {
    new: true,
  });
  res.json(updatedAdmin);
});

adminRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Admin.findByIdAndRemove(id);
  res.status(204).end();
});

module.exports = adminRouter;
