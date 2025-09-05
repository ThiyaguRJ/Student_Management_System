require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { sequelize, Student } = require("./models");
const app = require("./app");
const path = require("path");

app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"], 
  })
);

app.use(express.json()); 


app.use("/api/auth", require("./routes/auth"));
app.use("/api/students", require("./routes/students"));
require("./audit/hooks")(Student);
app.use("/api/excel", require("./routes/excel"));
app.use("/api/excel", require("./routes/excel-import"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/audit", require("./routes/audit"));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 4000;
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connected");

    return sequelize.sync({ force: false, alter: false });
  })
  .then(() => {
    console.log("✅ Database synced");

    app.listen(PORT, () =>
      console.log(`🚀 Server Is running on Port:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ Database error:", err);
  });
