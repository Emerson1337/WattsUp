export class TelemetryService {
  healthCheck = async () => {
    return { ping: "Pong!" };
  };
}
