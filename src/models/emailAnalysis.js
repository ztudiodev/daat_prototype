const { DataTypes } = require("sequelize");

module.exports = sequelize => {
	return sequelize.define(
		"EmailAnalysis",
		{
			id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			sender: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			subject: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			content: {
				type: DataTypes.TEXT,
				allowNull: false,
			},
			urls: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			riskLevel: {
				type: DataTypes.STRING,
				allowNull: false,
				defaultValue: "DESCONOCIDO",
			},
			confidence: {
				type: DataTypes.INTEGER,
				allowNull: false,
				defaultValue: 0,
			},
			resultJson: {
				type: DataTypes.JSONB,
				allowNull: false,
				defaultValue: {},
			},
			createdBy: {
				type: DataTypes.UUID,
				allowNull: false,
			},
		},
		{
			tableName: "email_analyses",
			timestamps: true,
			updatedAt: false,
		},
	);
};
