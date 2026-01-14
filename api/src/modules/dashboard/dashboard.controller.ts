import { Request, Response } from "express";
import DashboardService from "@/modules/dashboard/dashboard.service";

class DashboardController {
  getTariffs = async (_: Request, response: Response): Promise<void> => {
    try {
      const data = await DashboardService.getTariffs();

      if (!data) {
        response.status(404).json({ error: "Tarifa não encontrada." });
        return;
      }

      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  updateTariff = async (
    { params, body }: Request,
    response: Response
  ): Promise<void> => {
    try {
      const id = params.id;

      if (!id || typeof id !== "string") {
        response.status(400).json({ error: "ID não informado." });
        return;
      }

      const data = await DashboardService.updateTariff(id, body);
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getMonthlyConsumption = async (
    _: Request,
    response: Response
  ): Promise<void> => {
    try {
      const data = await DashboardService.getMonthlyConsumption();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getMonthlyForecast = async (
    _: Request,
    response: Response
  ): Promise<void> => {
    try {
      const data = await DashboardService.getMonthlyForecast();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getLast6MonthsHistory = async (
    _: Request,
    response: Response
  ): Promise<void> => {
    try {
      const data = await DashboardService.getLast6MonthsHistory();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getLastHourHistory = async (
    _: Request,
    response: Response
  ): Promise<void> => {
    try {
      const data = await DashboardService.getLastHourHistory();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getLastDayHistory = async (_: Request, response: Response): Promise<void> => {
    try {
      const data = await DashboardService.getLastDayHistory();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };

  getLastMonthHistory = async (
    _: Request,
    response: Response
  ): Promise<void> => {
    try {
      const data = await DashboardService.getLastMonthHistory();
      response.json(data).status(200);
    } catch (error) {
      response.status(500).json(error);
    }
  };
}

export default new DashboardController();
