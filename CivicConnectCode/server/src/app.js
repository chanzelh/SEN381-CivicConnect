const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const requestRoutes = require("./routes/requestRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
}));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/requests", requestRoutes);

module.exports = app;