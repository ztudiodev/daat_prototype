require("dotenv").config();
const bcrypt = require("bcrypt");
const { sequelize, User } = require("../models");

const createAdmin = async () => {
	await sequelize.sync();

	const adminEmail = "admin@daat.com";
	const existing = await User.findOne({ where: { email: adminEmail } });
	if (existing) {
		console.log("Usuario admin ya existe:", adminEmail);
		process.exit(0);
	}

	const hashedPassword = await bcrypt.hash("Password123*", 12);
	await User.create({
		name: "Administrador DAAT",
		email: adminEmail,
		password: hashedPassword,
		role: "admin",
	});

	console.log("Usuario demo creado: admin@daat.com / Password123*");
	process.exit(0);
};

createAdmin().catch(error => {
	console.error("No se pudo crear usuario demo:", error);
	process.exit(1);
});
