import express from "express";
import router from "@/routes";
import "@/infra/crons/cronjob-runner";

const app = express();

app.get("/", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

app.use(express.json());
app.use(router);

import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

if (process.env.NODE_ENV === "development") {
  const swaggerDocument = YAML.load(
    path.join(__dirname, ".", "swagger/openapi.yaml")
  );

  router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

export default app;
