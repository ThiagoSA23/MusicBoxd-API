require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✓ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ MongoDB erro:", err.message);
    process.exit(1);
  });

const swaggerDocument = YAML.load("./swagger.yaml");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/albums", require("./routes/albumRoutes"));
app.use("/api/musicas", require("./routes/musicRoutes"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MusicBoxd API - veja /api-docs para documentação",
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Rota não encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Erro interno",
  });
});

module.exports = app;
