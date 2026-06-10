require("pg"); // Force Vercel to bundle the pg package for Sequelize
const app = require("../src/app");

module.exports = app;
