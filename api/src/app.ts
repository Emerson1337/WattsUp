import express from "express";
import router from "@/routes";
import "@/modules/telemetry/jobs";

const app = express();

app.use(express.json());
app.use(router);

export default app;
