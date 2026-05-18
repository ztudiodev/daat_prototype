const analysisForm =
	document.getElementById("analysisForm") ||
	document.getElementById("quickAnalysisForm");
const analysisCard = document.getElementById("analysisCard");
const riskBadge = document.getElementById("riskBadge");
const confidenceBar = document.getElementById("confidenceBar");
const confidenceLabel = document.getElementById("confidenceLabel");
const explanationText = document.getElementById("explanationText");
const recommendationText = document.getElementById("recommendationText");
const threatTags = document.getElementById("threatTags");
const analyzeButton =
	document.getElementById("analyzeButton") ||
	document.getElementById("quickAnalyzeButton");

const setRiskAppearance = risk => {
	const mapping = {
		ALTO: ["bg-rose-500/15 text-rose-300", "bg-rose-400"],
		MEDIO: ["bg-amber-400/15 text-amber-300", "bg-amber-400"],
		BAJO: ["bg-emerald-500/15 text-emerald-300", "bg-emerald-400"],
	};
	return mapping[risk] || ["bg-slate-700 text-slate-200", "bg-slate-500"];
};

const buildTags = items => {
	if (!items || items.length === 0) {
		return '<span class="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">No se detectó</span>';
	}
	return items
		.map(
			item =>
				`<span class="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">${item}</span>`,
		)
		.join("");
};

if (analysisForm) {
	analysisForm.addEventListener("submit", async event => {
		event.preventDefault();

		if (!analyzeButton) return;
		analyzeButton.disabled = true;
		analyzeButton.innerHTML = "<span>Cargando...</span>";

		const formData = new FormData(analysisForm);
		const payload = {
			sender: formData.get("sender"),
			subject: formData.get("subject"),
			content: formData.get("content"),
			urls: formData.get("urls"),
		};

		try {
			const response = await fetch("/analysis/analyze", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();
			if (!data.success) {
				window.showToast(data.message || "Error en el análisis", "error");
				return;
			}

			window.showToast("Análisis completado", "success");
			const analysis = data.analysis;
			const [badgeClass] = setRiskAppearance(analysis.risk_level);
			analysisCard.classList.remove("hidden");
			analysisCard.classList.add("border-cyan-400");
			riskBadge.textContent = analysis.risk_level;
			riskBadge.className = `rounded-full px-4 py-2 text-sm font-semibold ${badgeClass}`;
			confidenceBar.style.width = `${analysis.confidence}%`;
			confidenceLabel.textContent = `Confianza estimada ${analysis.confidence}%`;
			explanationText.textContent = analysis.explanation;
			recommendationText.textContent = analysis.recommendation;
			threatTags.innerHTML = buildTags(analysis.threats_detected);
		} catch (error) {
			console.error(error);
			window.showToast("No se pudo completar el análisis.", "error");
		} finally {
			analyzeButton.disabled = false;
			analyzeButton.innerHTML = "<span>Analizar correo</span>";
		}
	});
}
