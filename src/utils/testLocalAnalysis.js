require("dotenv").config();

// Force no GEMINI API key in this test so service uses local analyzer
process.env.GEMINI_API_KEY = "";

const geminiService = require("../services/geminiService");

const payload = {
	sender: "no-reply@bank.example",
	subject: "Urgent: Verify your account password",
	content:
		"Please click the link to verify your password and update your credentials.",
	urls: "http://192.168.1.100/login",
};

(async () => {
	try {
		const result = await geminiService.analyzeEmail(payload);
		console.log("Análisis (fallback/local):", JSON.stringify(result, null, 2));
	} catch (err) {
		console.error("Error en prueba de análisis:", err);
	}
})();
