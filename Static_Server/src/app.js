const http = require('http');
const path = require('path');
const config = require('./config/defaultConfig');
const route = require('./utils/route');

const server = http.createServer((req, res) => {
  const filePath = path.join(config.root, req.url);
  route(filePath, req, res);
});

server.listen(config.port, config.hostname, () => {
  const addr = `http://${config.hostname}:${config.port}`;
  console.info(`Server started at ${addr}`);
});
