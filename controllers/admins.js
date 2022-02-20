const adminRouter = require('express').Router();
const Admin = require('../models/admin');

adminRouter.get('/', async (req, res) => {
  const admins = await Admin.find({});

  res.json(admins);
});

adminRouter.post('/', async (req, res) => {
  const admin = new Admin(req.body);

  const savedAdmin = await admin.save();
  res.status(201).json(savedAdmin);
});

adminRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { detailsAgent } = req.query;

  const admin = await Admin.findById(id);

  if (admin) {
    if (detailsAgent === 'true') {
      res.json(await Admin.findById(id).populate('agentsID'));
    } else {
      res.json(admin);
    }
  } else {
    res.status(404).end();
  }

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
