#include <WiFi.h>
#include <WebSocketsClient.h>
#include "WiFiManagerHelper.h"
#include "EmonLib.h"
#include <time.h> 

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
  SCT013.current(ADC_INPUT, 7.99); 

  webSocket.beginSSL("agendazap.click", 443, "/telemetry?token=esp32-iot-key");
  webSocket.onEvent(webSocketEvent);
  webSocket.setReconnectInterval(5000);

  // Sync time via NTP
  configTime(0, 0, "pool.ntp.org", "time.nist.gov");

  Serial.print("Waiting for NTP time sync...");
  time_t now = time(nullptr);
  while (now < 1704067200) { // wait until time is reasonably synced (after year 2024)
    delay(100);
    now = time(nullptr);
  }
  Serial.println("✓ Time synced!");
}

String getCurrentTimestampWithMillis() {
  struct tm timeinfo;
  struct timeval tv;
  gettimeofday(&tv, NULL); // get seconds and microseconds

  localtime_r(&tv.tv_sec, &timeinfo);

  char timeString[30];
  snprintf(
    timeString,
    sizeof(timeString),
    "%04d-%02d-%02dT%02d:%02d:%02d.%03ldZ",
    timeinfo.tm_year + 1900,
    timeinfo.tm_mon + 1,
    timeinfo.tm_mday,
    timeinfo.tm_hour,
    timeinfo.tm_min,
    timeinfo.tm_sec,
    tv.tv_usec / 1000 // convert microseconds to milliseconds
  );

  return String(timeString);
}


void loop() {
  webSocket.loop();

  unsigned long currentTime = millis();
  if (currentTime - lastSendTime >= SEND_INTERVAL) {
    lastSendTime = currentTime;

    double Irms = SCT013.calcIrms(1480);
    power = Irms * HOME_VOLTAGE;

    String timestamp = getCurrentTimestampWithMillis();

    String json = "{\"current\":" + String(Irms, 2) +
                  ",\"power\":" + String(power) +
                  ",\"timestamp\":\"" + timestamp + "\"" +
                  ",\"voltage\":" + String(HOME_VOLTAGE) + "}";

    webSocket.sendTXT(json);
    logReading(Irms, power, timestamp);
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

void logReading(double Irms, int power, String timestamp) {
  Serial.print("Current = ");
  Serial.print(Irms);
  Serial.println(" A");
  
  Serial.print("Power = ");
  Serial.print(power);
  Serial.println(" W");

  Serial.print("Time = ");
  Serial.println(timestamp);

  Serial.println("............");
}
