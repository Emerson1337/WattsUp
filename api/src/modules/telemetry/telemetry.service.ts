import { TelemetryMessage } from "@/modules/telemetry/types";
import TelemetryRepository from "@/modules/telemetry/telemetry.repository";

const ONE_MINUTE_IN_SECONDS = 60;

class TelemetryService {
  private energyReportPacketPerMinute: TelemetryMessage[] = [];

  healthCheck = async () => {
    return { ping: "Pong!" };
  };

  handlePowerData = async (data: TelemetryMessage): Promise<void> => {
    const { power, current, voltage } = data;

    console.log(
      `[TELEMETRY] Potency: ${power} W, Current: ${current} A, Voltage: ${voltage} V`
    );

    this.energyReportPacketPerMinute.push(data);

    if (this.energyReportPacketPerMinute.length < ONE_MINUTE_IN_SECONDS) return;

    const totalPower = this.energyReportPacketPerMinute.reduce(
      (acc, packet) => {
        return acc + packet.power;
      },
      0
    );

    const totalPowerAverage = totalPower / ONE_MINUTE_IN_SECONDS;
    const totalPowerInKw = totalPowerAverage / 1000;
    await TelemetryRepository.savePowerPerMinute(totalPowerInKw);

    this.energyReportPacketPerMinute = [];
  };

  handShake = (token: string) => {
    return true;
  };
}

export default new TelemetryService();
