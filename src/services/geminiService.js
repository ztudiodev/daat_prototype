const axios = require("axios");

const model = process.env.GEMINI_MODEL || "gemini-1.5-mini";
const apiKey = process.env.GEMINI_API_KEY;
const localAnalyzer = require("./localAnalyzer");

if (!apiKey) {
	console.warn(
		"Advertencia: GEMINI_API_KEY no está configurada. No podrás realizar análisis reales.",
	);
}

const buildPrompt = ({ sender, subject, content, urls }) => {
	const urlSection = urls
		? `URLs detectadas:
${urls}

`
		: "";
	return `Eres un analista cibernético experto especializado en detección de correos maliciosos.

Analiza el siguiente correo y responde SIEMPRE en JSON válido con la siguiente estructura:
{
  "risk_level": "ALTO|MEDIO|BAJO",
  "confidence": 0-100,
  "threats_detected": ["Phishing", "Spoofing", "Ingeniería social", "Urgencia sospechosa", "URLs sospechosas", "Malware potencial"],
  "explanation": "Descripción clara de los riesgos detectados.",
  "recommendation": "Acción recomendada para el equipo de seguridad."
}

Correo a analizar:
Remitente: ${sender}
Asunto: ${subject}
Contenido:
${content}

${urlSection}

Evalúa:
- Probabilidad de phishing o spoofing.
- Uso de ingeniería social.
- Tono urgente o manipulador.
- Enlaces sospechosos.
- Malware potencial.
- Recomendaciones concretas.

RESPONDE SOLO EN JSON. No agregues texto adicional fuera del JSON.`;
};

const parseJson = raw => {
	const text = raw.trim();
	try {
		return JSON.parse(text);
	} catch (error) {
		const jsonString = text.match(/\{[\s\S]*\}/);
		if (jsonString) {
			return JSON.parse(jsonString[0]);
		}
		throw new Error("Respuesta de Gemini no es JSON válido.");
	}
};

exports.analyzeEmail = async payload => {
	if (!apiKey) {
		console.warn(
			"Advertencia: GEMINI_API_KEY no está configurada. Usando analizador local.",
		);
		return await localAnalyzer.analyzeEmailLocal(payload);
	}

	const prompt = buildPrompt(payload);
	const endpoint = `https://gemini.googleapis.com/v1/models/${model}:generateText?key=${apiKey}`;

	const extractText = data => {
		if (!data) return "";
		if (typeof data.output_text === "string") return data.output_text;
		if (Array.isArray(data.candidates) && data.candidates.length) {
			const candidate = data.candidates[0];
			if (typeof candidate.output === "string") return candidate.output;
			if (typeof candidate.content === "string") return candidate.content;
			if (Array.isArray(candidate.content)) {
				return candidate.content.map(part => part.text || "").join("");
			}
		}
		if (Array.isArray(data.output)) {
			return data.output
				.map(chunk => {
					if (typeof chunk === "string") return chunk;
					return chunk.content?.map(part => part.text || "").join("");
				})
				.join("");
		}
		return JSON.stringify(data);
	};

	try {
		const response = await axios.post(
			endpoint,
			{
				prompt: { text: prompt },
				temperature: 0.0,
				maxOutputTokens: 500,
			},
			{
				headers: {
					"Content-Type": "application/json",
				},
			},
		);

		const outputText = extractText(response.data);
		const result = parseJson(outputText);

		return {
			risk_level: result.risk_level || "DESCONOCIDO",
			confidence: Number(result.confidence || 0),
			threats_detected: Array.isArray(result.threats_detected)
				? result.threats_detected
				: [],
			explanation: result.explanation || "No se obtuvo explicación detallada.",
			recommendation:
				result.recommendation ||
				"Revisar correo y tomar acciones de seguridad.",
		};
	} catch (error) {
		const details = error.response?.data || error.message || error;
		console.error("Error en Gemini API:", details);

		// Fallback to local analyzer without breaking the flow
		try {
			console.warn(
				"Usando analizador local como fallback por fallo en Gemini.",
			);
			const local = await localAnalyzer.analyzeEmailLocal(payload);
			return local;
		} catch (localErr) {
			console.error("Error en analizador local:", localErr);
			throw new Error(
				`Fallo en Gemini y en analizador local: ${error.response?.status || error.message}`,
			);
		}
	}
};
