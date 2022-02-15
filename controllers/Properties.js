const propertyRouter = require('express').Router();
const Property = require('../models/property');

propertyRouter.get('/', (req, res) => {
  Property.find({}).then((result) => {
    res.json(result);
  });
});

propertyRouter.post('/', (req, res, next) => {
  const property = new Property(req.body);

  property
    .save()
    .then((savedProperty) => {
      res.status(201).json(savedProperty);
    })
    .catch((err) => next(err));
});

propertyRouter.get('/:id', (req, res, next) => {
  const { id } = req.params;

  Property.findById(id)
    .then((property) => (property ? res.json(property) : res.status(404).end()))
    .catch((err) => next(err));
});

propertyRouter.put('/:id', (req, res, next) => {
  const { id } = req.body;

  delete req.body.id;
  const property = {
    ...req.body,
  };

  Property.findByIdAndUpdate(id, property, { new: true })
    .then((updateProperty) => {
      res.json(updateProperty);
    })
    .catch((err) => next(err));
});

propertyRouter.delete('/:id', (req, res, next) => {
  const { id } = req.params;

  Property.findByIdAndRemove(id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => next(err));
});

module.exports = propertyRouter;
