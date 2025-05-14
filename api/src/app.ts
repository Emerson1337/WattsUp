import express from "express";
import router from "@/routes";
import "@/infra/crons/cronjob-runner";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";

const app = express();

app.use(express.json());
app.use(router);
const swaggerDocument = YAML.load(
  path.join(__dirname, ".", "swagger/openapi.yaml")
);

router.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app;
