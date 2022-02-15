const propertyRouter = require('express').Router();
const Property = require('../models/property');

propertyRouter.get('/', async (req, res) => {
  const properties = await Property.find({});

  res.json(properties);
});

propertyRouter.post('/', async (req, res) => {
  const property = new Property(req.body);

  const savedProperty = await property.save();
  res.status(201).json(savedProperty);
});

propertyRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id);

  if (property) return res.json(property);
  return res.status(404).end();
});

propertyRouter.put('/:id', async (req, res) => {
  const { id } = req.params;

  delete req.body.id;
  const property = {
    ...req.body,
  };

  const updateProperty = await Property.findByIdAndUpdate(id, property, {
    new: true,
  });
  res.json(updateProperty);
});

propertyRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Property.findByIdAndRemove(id);
  res.status(204).end();
});

propertyRouter.get('/search', async (req, res) => {
  const { name } = req.query;
  await Property.findOne('name', new RegExp(name, 'i'), (err, docs) => {
    res.json(docs);
  });
});

module.exports = propertyRouter;
