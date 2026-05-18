const express = require("express");
const { body } = require("express-validator");
const analysisController = require("../controllers/analysisController");
const { protectRoute } = require("../middlewares/authMiddleware");
const { handleValidation } = require("../middlewares/validators");

const router = express.Router();

router.get("/", protectRoute, analysisController.getAnalysis);
router.post(
	"/analyze",
	protectRoute,
	[
		body("sender").trim().notEmpty().withMessage("Remitente es obligatorio."),
		body("subject").trim().notEmpty().withMessage("Asunto es obligatorio."),
		body("content")
			.trim()
			.notEmpty()
			.withMessage("Contenido del correo es obligatorio."),
		body("urls").optional({ checkFalsy: true }).trim().isString(),
	],
	handleValidation,
	analysisController.postAnalyze,
);
router.get("/history", protectRoute, analysisController.getHistory);

module.exports = router;
