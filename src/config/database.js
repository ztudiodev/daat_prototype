const { Sequelize } = require("sequelize");

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
	throw new Error("DATABASE_URL is required in .env");
}

const sequelize = new Sequelize(databaseUrl, {
	dialect: "postgres",
	logging: false,
	dialectOptions:
		process.env.DB_SSL === "true" ? { ssl: { rejectUnauthorized: false } } : {},
});

module.exports = sequelize;
