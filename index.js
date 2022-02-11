const http = require('http');
const app = require('./app');
const logger = require('./utils/logger');

const server = http.createServer(app);

server.listen(app.get('port'), () => {
  logger.info(`Server running in port ${app.get('port')}`);
});
