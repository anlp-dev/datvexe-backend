const express = require('express');
require('dotenv').config();
const cors = require('cors');
const logRequest = require('../src/middleware/logRequestMiddleware');
const passport = require('passport');
const app = express();

// Middleware xử lý dữ liệu request
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logRequest);

// Cấu hình bảo mật, CORS
app.use(cors());
require('../src/configs/auth');

// Kết nối Database
const { connect } = require('../src/database/db');
connect();

// Cấu hình Template Engine
const configViewEngine = require('../src/configs/viewEngine');
configViewEngine(app);

// Cấu hình bảo mật
const security = require('../src/configs/security');
security(app);

// Định tuyến chính
const router = require('../src/routes/MainRouter');
app.use(router);

const { startServer } = require('../src/configs/portCustom');
startServer(app);
