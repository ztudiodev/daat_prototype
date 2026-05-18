const sequelize = require("../config/database");
const UserModel = require("./user");
const EmailAnalysisModel = require("./emailAnalysis");

const User = UserModel(sequelize);
const EmailAnalysis = EmailAnalysisModel(sequelize);

User.hasMany(EmailAnalysis, { foreignKey: "createdBy", as: "analyses" });
EmailAnalysis.belongsTo(User, { foreignKey: "createdBy", as: "author" });

module.exports = {
	sequelize,
	User,
	EmailAnalysis,
};
