const toastContainer = document.getElementById("toast-container");

window.showToast = (message, type = "info") => {
	if (!toastContainer) return;
	const colors = {
		info: "bg-slate-800 text-slate-100",
		success: "bg-emerald-500 text-slate-950",
		error: "bg-rose-500 text-slate-950",
	};
	const toast = document.createElement("div");
	toast.className = `max-w-sm rounded-3xl px-5 py-3 shadow-xl ${colors[type] || colors.info}`;
	toast.textContent = message;

	toastContainer.appendChild(toast);
	setTimeout(() => {
		toast.classList.add("opacity-0");
		setTimeout(() => toast.remove(), 400);
	}, 3800);
};
