import { TelemetryMessage } from "@/modules/telemetry/types";
import TelemetryRepository from "@/modules/telemetry/telemetry.repository";

class TelemetryService {
  private validPasskey = "esp32-iot-key";
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

    if (this.energyReportPacketPerMinute.length < 60) return;

    const totalPower = this.energyReportPacketPerMinute.reduce(
      (acc, packet) => {
        return acc + packet.power;
      },
      0
    );

    await TelemetryRepository.savePowerPerMinute(totalPower);

    this.energyReportPacketPerMinute = [];
  };

  handShake = (token: string) => {
    return this.validPasskey === token;
  };
}

export default new TelemetryService();
