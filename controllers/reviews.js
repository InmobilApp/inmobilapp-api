const reviewRouter = require('express').Router();
const Review = require('../models/review');
const Property = require('../models/property');

reviewRouter.get('/', async (req, res) => {
  const { detailsProperty } = req.query;
  if (detailsProperty === 'true') {
    res.json(await Review.find({}).populate('porpertyID'));
  } else {
    res.json(await Review.find({}));
  }
});

reviewRouter.post('/', async (req, res) => {
  const { porpertyID } = req.body;

  const property = await Property.findById(porpertyID);

  if (property) {
    const review = await new Review(req.body).save();

    property.reviews = property.reviews.concat(review._id);
    await property.save();

    return res.json(review);
  }
  return res.status(404).json({ error: 'Property no found!' });
});

reviewRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { detailsProperty } = req.query;

  const review = await Review.findById(id);

  if (review) {
    if (detailsProperty === 'true') {
      res.json(await Review.findById(id).populate('porpertyID'));
    } else {
      res.json(review);
    }
  } else {
    res.status(404).json({ error: 'Review not found!' });
  }
});

reviewRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;

  await Review.findByIdAndDelete(id);
  res.status(204).end();
});

module.exports = reviewRouter;
