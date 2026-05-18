const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { User } = require("../models");

const createToken = user => {
	return jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{
			expiresIn: "8h",
		},
	);
};

exports.getLogin = (req, res) => {
	if (req.cookies.token) {
		return res.redirect("/dashboard");
	}
	res.render("login", { error: null, title: "Ingreso DAAT" });
};

exports.postLogin = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(422)
			.render("login", { error: errors.array()[0].msg, title: "Ingreso DAAT" });
	}

	const { email, password } = req.body;
	const user = await User.findOne({ where: { email } });
	if (!user) {
		return res
			.status(401)
			.render("login", {
				error: "Credenciales inválidas.",
				title: "Ingreso DAAT",
			});
	}

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) {
		return res
			.status(401)
			.render("login", {
				error: "Credenciales inválidas.",
				title: "Ingreso DAAT",
			});
	}

	const token = createToken(user);
	res.cookie("token", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 8 * 60 * 60 * 1000,
	});

	res.redirect("/dashboard");
};

exports.logout = (req, res) => {
	res.clearCookie("token");
	res.redirect("/login");
};
