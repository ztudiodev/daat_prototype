const { validationResult } = require("express-validator");

exports.handleValidation = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		if (req.path === "/login") {
			return res
				.status(422)
				.render("login", {
					error: errors.array()[0].msg,
					title: "Ingreso DAAT",
				});
		}
		return res
			.status(422)
			.json({ success: false, message: errors.array()[0].msg });
	}

	next();
};
