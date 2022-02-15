const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./utils/config');
const logger = require('./utils/logger');
const adminRouter = require('./controllers/admins');
const propertyRouter = require('./controllers/Properties');
const middleware = require('./utils/middleware');

const app = express();

mongoose.connect(config.MONGODB_URI).then(() => {
  logger.info('connected to MongoDB');
}).catch((error) => {
  logger.error('error connecting to MongoDB:', error.message);
});

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('dev'));
app.set('port', config.PORT);

app.use('/api/admins', adminRouter);
app.use('/api/properties', propertyRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
