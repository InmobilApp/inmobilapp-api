const propertyRouter = require('express').Router();
const Property = require('../models/property');
const Agent = require('../models/admin');

propertyRouter.get('/', async (req, res) => {
  const properties = await Property.find({});

  res.json(properties);
});

propertyRouter.post('/', async (req, res) => {
  const { agentID } = req.body;

  const agent = await Agent.findById(agentID);
  const property = new Property(req.body);
  const savedProperty = await property.save();

  agent.properties = agent.properties.concat(savedProperty._id);
  await agent.save();

  res.status(201).json(savedProperty);
});

propertyRouter.get('/:id', async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id).populate('Agents');

  if (property) return res.json(property);
  return res.status(404).end();
});

propertyRouter.put('/:id', async (req, res) => {
  const { id, ...newPropertyInfo } = req.body;

  const property = {
    ...newPropertyInfo,
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

module.exports = propertyRouter;
