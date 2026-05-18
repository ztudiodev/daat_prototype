const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	return sequelize.define(
		"User",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "Administrador DAAT",
			},
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: {
					isEmail: true,
				},
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			role: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "admin",
			},
		},
		{
			tableName: "users",
			timestamps: true,
			updatedAt: false,
		},
	);
};
