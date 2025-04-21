export interface TelemetryMessage {
  power: number;
  current: number;
  voltage: number;
}

export const isTelemetryMessage = (
  message: TelemetryMessage
): message is TelemetryMessage => {
  return !!message.power && !!message.voltage && !!message.current;
};
