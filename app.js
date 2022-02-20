const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('express-async-errors');
const cors = require('cors');
const { PORT, MONGODB_URI } = require('./utils/config');
const logger = require('./utils/logger');
const adminRouter = require('./controllers/admins');
const propertyRouter = require('./controllers/Properties');
const agentsRouter = require('./controllers/agents');
const clientsRouter = require('./controllers/clients');
const middleware = require('./utils/middleware');
const reviewRouter = require('./controllers/reviews');

const app = express();

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB');
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message);
  });

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('dev'));
app.set('port', PORT);

app.use('/api/admins', adminRouter);
app.use('/api/properties', propertyRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/reviews', reviewRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
