
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const APP_VERSION = process.env.APP_VERSION || "BLUE - Version 1";

app.disable("x-powered-by");

// Serve the frontend assets.
app.use(express.static(path.join(__dirname, "public"), {
  etag: true,
  maxAge: 0
}));

// Return the version assigned to this Kubernetes Deployment.
app.get("/api/version", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.json({ version: APP_VERSION });
});

// Kubernetes readiness and health-check endpoint.
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    version: APP_VERSION
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`CarePoint is running on port ${PORT}`);
  console.log(`Active release: ${APP_VERSION}`);
});

