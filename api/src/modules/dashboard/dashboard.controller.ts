import { Request, Response } from "express";
import DashboardService from "@/modules/dashboard/dashboard.service";

class DashboardController {
  getTariffs = async (_: Request, response: Response): Promise<void> => {
    try {
      const data = await DashboardService.getTariffs();
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
}

export default new DashboardController();
