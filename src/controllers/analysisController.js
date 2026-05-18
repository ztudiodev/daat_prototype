const { validationResult } = require("express-validator");
const { EmailAnalysis } = require("../models");
const geminiService = require("../services/geminiService");

exports.getAnalysis = async (req, res) => {
	const recent = await EmailAnalysis.findAll({
		where: { createdBy: req.user.id },
		order: [["createdAt", "DESC"]],
		limit: 10,
	});

	res.render("analysis", {
		title: "Análisis de Correos",
		user: req.user,
		recent,
		analysisResult: null,
		error: null,
	});
};

exports.postAnalyze = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res
			.status(422)
			.json({ success: false, message: errors.array()[0].msg });
	}

	const { sender, subject, content, urls } = req.body;

	const analysisPayload = {
		sender,
		subject,
		content,
		urls,
	};

	try {
		const result = await geminiService.analyzeEmail(analysisPayload);

		const saved = await EmailAnalysis.create({
			sender,
			subject,
			content,
			urls: urls || null,
			riskLevel: result.risk_level || "DESCONOCIDO",
			confidence: result.confidence || 0,
			resultJson: result,
			createdBy: req.user.id,
		});

		return res.json({
			success: true,
			analysis: { ...result, id: saved.id, createdAt: saved.createdAt },
		});
	} catch (error) {
		console.error("Error en Gemini:", error.message || error);
		return res
			.status(500)
			.json({
				success: false,
				message: "Error interno procesando el análisis. Intenta nuevamente.",
			});
	}
};

exports.getHistory = async (req, res) => {
	const history = await EmailAnalysis.findAll({
		where: { createdBy: req.user.id },
		order: [["createdAt", "DESC"]],
		limit: 30,
	});

	res.render("history", {
		title: "Historial de Análisis",
		user: req.user,
		history,
	});
};
