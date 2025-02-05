const express = require('express');
require('dotenv').config()
const app = express();
const configViewEngine = require('../src/configs/viewEngine');
const { connect } = require('../src/database/db');
const logRequestMiddleware = require("../src/middleware/logRequestMiddleware");
const cors = require('cors');
const port = process.env.PORT || 88;
// const hostname = process.env.HOST_NAME || 'localhost';
const security = require('../src/configs/security');

require('../src/configs/auth');
app.use(logRequestMiddleware)
app.use(cors());
connect();
configViewEngine(app);
security(app);
app.listen(port, () => {
  console.log(`App listening at ${port}`)
})
