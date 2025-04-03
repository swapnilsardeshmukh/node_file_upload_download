const express = require('express');
const app = express();

const sqlRoutes = require('../controllers/sqltest/routes');

app.use('/sql', sqlRoutes);

module.exports = app;