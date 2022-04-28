#include <Arduino.h>
#include "BLEConnect.h"
#include "SPIMax30003.h"

void setup()
{
  Serial.begin(115200);
  BLEInit();
  Max30003Init();
}

void loop()
{
  BLEloop();
  Max30003loop();
}