#include "WiFiManagerHelper.h"
#include <WiFiManager.h>
#include <WiFi.h>

// Default ESP32 - WiFi setup credentials
const char* ssid = "Energy Monitor - Setup";
const char* password = "setup123";


void connectToWiFi() {
  WiFi.mode(WIFI_STA);

  Serial.println("Starting Wi-Fi...");
  WiFiManager wm;
  // wm.resetSettings(); // In case you wanna forgot previous networks

  // If not available, starts an AP called "Energy Monitor - Setup"
  if (!wm.autoConnect(ssid, password)) {
    Serial.println("❌ Failed to connect. Restarting in 5 seconds...");
    delay(5000);
    ESP.restart();
  }

  Serial.println("✅ Connected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}