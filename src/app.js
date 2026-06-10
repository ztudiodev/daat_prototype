require("dotenv").config();
const path = require("path");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const analysisRoutes = require("./routes/analysisRoutes");

const app = express();
const PORT = process.env.PORT || 3000;


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan("tiny"));

app.use("/", authRoutes);
app.use("/", dashboardRoutes);
app.use("/analysis", analysisRoutes);

app.use((req, res) => {
	res.status(404).render("404", { title: "Página no encontrada" });
});

(async () => {
	try {
		await sequelize.authenticate();
		await sequelize.sync();
		if (!process.env.VERCEL) {
			app.listen(PORT, () => {
				console.log(`Servidor DAAT corriendo en puerto ${PORT}`);
			});
		}
	} catch (error) {
		console.error("No se pudo iniciar la aplicación:", error);
		if (!process.env.VERCEL) {
			process.exit(1);
		}
	}
})();

module.exports = app;

