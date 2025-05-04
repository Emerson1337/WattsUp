#include <WiFi.h>
#include <WebSocketsClient.h>
#include "WiFiManagerHelper.h"
#include "EmonLib.h"

EnergyMonitor SCT013; 
WebSocketsClient webSocket;

int power;
unsigned long lastSendTime = 0;

#define ADC_INPUT 34
#define HOME_VOLTAGE 220.0
#define SEND_INTERVAL 1000

void setup() {
  Serial.begin(115200);
  connectToWiFi();
  analogReadResolution(10);
  SCT013.current(ADC_INPUT, 9.09); 

  webSocket.beginSSL("agendazap.click", 443, "/telemetry");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);
}

void loop() {
  webSocket.loop();

  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;

    double Irms = SCT013.calcIrms(1480);
    power = Irms * HOME_VOLTAGE;
      
    String json = "{\"current\":" + String(Irms, 2) + ",\"power\":" + String(power) + ",\"voltage\":" + String(HOME_VOLTAGE) + "}";
    webSocket.sendTXT(json);
    logReading(Irms, power);
  }
}

void webSocketEvent(WStype_t type, uint8_t *payload, size_t length) {
  switch (type) {
    case WStype_DISCONNECTED:
      Serial.println("[WebSocket] Disconnected");
      break;
    case WStype_CONNECTED:
      Serial.println("[WebSocket] Connected");
      break;
    case WStype_TEXT:
      Serial.print("[WebSocket] Message: ");
      Serial.println((char *)payload);
      break;
    case WStype_ERROR:
      Serial.println("[WebSocket] Error occurred");
      break;
    default:
      break;
  }
}

void logReading(double Irms, int power) {
  Serial.print("Current = ");
  Serial.print(Irms);
  Serial.println(" A");
  
  Serial.print("Power = ");
  Serial.print(power);
  Serial.println(" W");
  
  Serial.println("............");
}
