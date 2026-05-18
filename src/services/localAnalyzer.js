const suspiciousWords = [
	"password",
	"verify",
	"urgent",
	"bank",
	"click",
	"login",
	"update",
	"attach",
	"invoice",
	"confirm",
	"account",
	"credentials",
	"ssn",
	"reset",
	"secure",
	"wire",
	"transfer",
  "contraseña",
  "verificar",
  "urgente",
  "banco",
  "clic",
  "iniciar sesión",
  "actualizar",
  "adjuntar",
  "factura",
  "confirmar",
  "cuenta",
  "credenciales",
  "número de seguro social",
  "restablecer",
  "seguro",
  "transferencia bancaria",
  "transferir",
];

const urlSuspiciousPatterns = [
	/\bhttps?:\/\/[^\s]*\b/gi,
	/\b\d+\.\d+\.\d+\.\d+\b/gi,
];

function scoreFromMatches(matches) {
	return Math.min(100, matches * 20 + 20);
}

exports.analyzeEmailLocal = async ({
	sender = "",
	subject = "",
	content = "",
	urls = "",
}) => {
	const text = `${sender} ${subject} ${content} ${urls}`.toLowerCase();

	const found = [];
	let matchCount = 0;

	suspiciousWords.forEach(word => {
		if (text.includes(word)) {
			found.push(word);
			matchCount += 1;
		}
	});

	// simple URL checks
	const urlMatches = [];
	urlSuspiciousPatterns.forEach(re => {
		const m = text.match(re);
		if (m && m.length) {
			urlMatches.push(...m);
			matchCount += m.length;
		}
	});

	if (urlMatches.length) {
		found.push("URLs sospechosas");
	}

	// basic spoofing heuristic: sender contains suspicious domain or mismatched display
	if (
		sender &&
		/no-reply|support|service|security|admin|alert|update|billing/.test(
			sender.toLowerCase(),
		)
	) {
		if (!found.includes("Spoofing")) {
			found.push("Possibile Spoofing");
			matchCount += 1;
		}
	}

	const confidence = scoreFromMatches(matchCount);

	let risk_level = "BAJO";
	if (confidence >= 75) risk_level = "ALTO";
	else if (confidence >= 40) risk_level = "MEDIO";

	const explanationParts = [];
	if (found.length) explanationParts.push(`Indicadores: ${found.join(", ")}`);
	if (matchCount === 0)
		explanationParts.push("No se detectaron patrones sospechosos en el texto.");

	const recommendation =
		risk_level === "ALTO"
			? "Marcar como sospechoso, bloquear remitente y no interactuar con enlaces."
			: risk_level === "MEDIO"
				? "Revisar cabeceras, verificar enlaces en entorno seguro."
				: "Bajo riesgo aparente; proceder con precaución.";

	return {
		risk_level,
		confidence,
		threats_detected: found.length ? found : [],
		explanation: explanationParts.join(" "),
		recommendation,
	};
};
