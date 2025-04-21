#include "WiFiManagerHelper.h"
#include "EmonLib.h"

EnergyMonitor SCT013; 

int potencia;

#define ADC_INPUT 34
#define HOME_VOLTAGE 220.0
#define ADC_BITS    10

void setup() {
  Serial.begin(115200); //Communication frequency for debug
  // connectToWiFi();
  analogReadResolution(10);
  SCT013.current(ADC_INPUT, 9.09); 
}

void loop() {
  double Irms = SCT013.calcIrms(1480);   // Calcula o valor da Corrente
    
    potencia = Irms * HOME_VOLTAGE;          // Calcula o valor da Potencia Instantanea    
    Serial.print("Corrente = ");
    Serial.print(Irms);
    Serial.println(" A");
    
    Serial.print("Potencia = ");
    Serial.print(potencia);
    Serial.println(" W");
   
    delay(500);
    Serial.println("...");
    delay(500);
}