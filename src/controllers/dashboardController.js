const { EmailAnalysis } = require("../models");

exports.getDashboard = async (req, res) => {
	const latestAnalyses = await EmailAnalysis.findAll({
		order: [["createdAt", "DESC"]],
		limit: 5,
	});

	const totalCount = await EmailAnalysis.count();
	const highCount = await EmailAnalysis.count({ where: { riskLevel: "ALTO" } });
	const mediumCount = await EmailAnalysis.count({
		where: { riskLevel: "MEDIO" },
	});
	const lowCount = await EmailAnalysis.count({ where: { riskLevel: "BAJO" } });

	res.render("dashboard", {
		title: "Dashboard DAAT",
		user: req.user,
		stats: {
			total: totalCount,
			high: highCount,
			medium: mediumCount,
			low: lowCount,
		},
		latestAnalyses,
	});
};
