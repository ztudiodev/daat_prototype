const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { protectRoute } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/dashboard", protectRoute, dashboardController.getDashboard);

module.exports = router;
