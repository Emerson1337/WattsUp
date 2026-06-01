#include "WiFiManagerHelper.h"
#include <WiFiManager.h>
#include <WiFi.h>

// Default ESP32 - WiFi setup credentials
const char* ssid = "Energy Monitor - Setup";
const char* password = "setup123";

// Default network to try connecting to automatically before falling back
// to the manual WiFiManager setup portal.
const char* defaultSsid = "MOB-COMMIT";
const char* defaultPassword = "whatsapp123";
const int   maxConnectRetries = 3;
const unsigned long connectTimeoutMs = 10000; // per-attempt timeout

// Attempts to connect to the default network. Returns true on success.
bool tryConnectDefault() {
  for (int attempt = 1; attempt <= maxConnectRetries; attempt++) {
    Serial.printf("Attempt %d/%d: connecting to \"%s\"...\n",
                  attempt, maxConnectRetries, defaultSsid);

    WiFi.begin(defaultSsid, defaultPassword);

    unsigned long start = millis();
    while (WiFi.status() != WL_CONNECTED && millis() - start < connectTimeoutMs) {
      delay(250);
      Serial.print(".");
    }
    Serial.println();

    if (WiFi.status() == WL_CONNECTED) {
      return true;
    }

    Serial.printf("⚠️  Attempt %d failed.\n", attempt);
    WiFi.disconnect();
    delay(500);
  }
  return false;
}

void connectToWiFi() {
  WiFi.mode(WIFI_STA);

  Serial.println("Starting Wi-Fi...");

  // First, try connecting to the default network a few times.
  if (tryConnectDefault()) {
    Serial.println("✅ Connected to Wi-Fi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    return;
  }

  // Fallback: start the manual WiFiManager setup portal so the user can
  // select a network and enter credentials.
  Serial.printf("❌ Could not connect to \"%s\" after %d attempts. "
                "Starting setup portal...\n", defaultSsid, maxConnectRetries);

  WiFiManager wm;
  // wm.resetSettings(); // In case you wanna forgot previous networks

  // Starts an AP called "Energy Monitor - Setup" for manual configuration.
  if (!wm.autoConnect(ssid, password)) {
    Serial.println("❌ Failed to connect. Restarting in 5 seconds...");
    delay(5000);
    ESP.restart();
  }

  Serial.println("✅ Connected to Wi-Fi!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}