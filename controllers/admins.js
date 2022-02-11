const adminRouter = require('express').Router();
const Admin = require('../models/admin');

adminRouter.get('/', (req, res) => {
  Admin.find({}).then((result) => {
    res.json(result);
  });
});

adminRouter.post('/', (req, res) => {
  const { name, password, email } = req.body;

  const admin = new Admin({
    name, password, email,
  });

  admin.save().then((savedAdmin) => {
    res.status(201).json(savedAdmin);
  });
});

module.exports = adminRouter;
