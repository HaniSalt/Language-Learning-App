const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: "./config.env" });

const routesModule = require('./routes');
console.log('Routes module:', routesModule);
console.log('setupRoutes function:', routesModule.setupRoutes);

const {setupRoutes} = require('./routes');

const app = express();
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

console.log('About to setup routes...');
setupRoutes(app);
console.log('Routes setup complete!');

const PORT = 8080
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});