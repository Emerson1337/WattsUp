import express from "express";
import router from "@/routes";
import "@/infra/crons/cronjob-runner";

const app = express();

app.use(express.json());
app.use(router);

export default app;
