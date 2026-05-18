const express = require("express");
const { body } = require("express-validator");
const authController = require("../controllers/authController");
const { handleValidation } = require("../middlewares/validators");

const router = express.Router();

router.get("/login", authController.getLogin);
router.post(
	"/login",
	[
		body("email").trim().isEmail().withMessage("Email válido es obligatorio."),
		body("password")
			.trim()
			.isLength({ min: 6 })
			.withMessage("La contraseña debe tener al menos 6 caracteres."),
	],
	handleValidation,
	authController.postLogin,
);

router.post("/logout", authController.logout);
router.get("/", (req, res) => res.redirect("/dashboard"));

module.exports = router;
