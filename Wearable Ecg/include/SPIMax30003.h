#ifndef _SPIMax30003_
#define _SPIMax30003_

#include <SPI.h>
#include "protocentral_Max30003.h"

#define INT_PIN 27
#define FCLK_PIN 13

hw_timer_t *timer = NULL;
MAX30003 max30003;
bool rtorIntrFlag = false;
uint8_t statusReg[3];
long pwearCount = 0;
int ULP = 0;

#define CES_CMDIF_PKT_START_1 0x0A
#define CES_CMDIF_PKT_START_2 0xFA
#define CES_CMDIF_TYPE_DATA 0x02
#define CES_CMDIF_PKT_STOP 0x0B
#define DATA_LEN 0x0f
#define ZERO 0

volatile char DataPacket[DATA_LEN];
const char DataPacketFooter[2] = {ZERO, CES_CMDIF_PKT_STOP};
const char DataPacketHeader[5] = {CES_CMDIF_PKT_START_1, CES_CMDIF_PKT_START_2, DATA_LEN, ZERO, CES_CMDIF_TYPE_DATA};

void sendDataThroughUART(void)
{
  // send 30003 data
  for (int i = 4; i < DATA_LEN; i++) // transmit the data
  {
    Serial.print(int(DataPacket[i]));
    Serial.print(" ");
  }
  Serial.println("");
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
void rtorInterruptHndlr()
{
  rtorIntrFlag = true;
}

void enableInterruptPin()
{

  pinMode(INT_PIN, INPUT_PULLUP);
  attachInterrupt(digitalPinToInterrupt(INT_PIN), rtorInterruptHndlr, CHANGE);
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////
void IRAM_ATTR TimerEvent()
{
  digitalWrite(FCLK_PIN, digitalRead(FCLK_PIN) ^ 1);
}

void Max30003Init()
{
  // Serial.begin(115200);

  pinMode(FCLK_PIN, OUTPUT);
  timer = timerBegin(0, 1220, true); // 80,000,000/(32768*2)=1,220.703125
  timerAttachInterrupt(timer, &TimerEvent, true);
  timerAlarmWrite(timer, 1, true);
  timerAlarmEnable(timer); //	使能定时器

  pinMode(MAX30003_CS_PIN, OUTPUT);
  digitalWrite(MAX30003_CS_PIN, HIGH); // disable device

  SPI.begin(); //(CLK_PIN, 19, 23, MAX30003_CS_PIN);
  SPI.setBitOrder(MSBFIRST);
  SPI.setDataMode(SPI_MODE0);

  bool ret = max30003.max30003ReadInfo();
  if (ret)
  {
    Serial.println("Max30003 ID Success");
  }
  else
  {

    while (!ret)
    {
      digitalWrite(MAX30003_CS_PIN, HIGH);
      delay(50);
      // stay here untill the issue is fixed.
      ret = max30003.max30003ReadInfo();
      Serial.println("Failed to read ID, please make sure all the pins are connected");
      delay(5000);
    }
  }

  Serial.println("Initialising the chip ...");
  max30003.max30003BeginRtorMode(); // initialize MAX30003
  enableInterruptPin();
  max30003.max30003RegRead(STATUS, statusReg);
}

void Max30003loop()
{
  if (rtorIntrFlag)
  {
    rtorIntrFlag = false;
    max30003.max30003RegRead(STATUS, statusReg);

    if (statusReg[1] & RTOR_INTR_MASK)
    {
      max30003.getEcgSamples();
      max30003.getHRandRR(); // It will store HR to max30003.heartRate and rr to max30003.RRinterval.

      DataPacket[5] = max30003.ecgdata;
      DataPacket[6] = max30003.ecgdata >> 8;
      DataPacket[7] = max30003.ecgdata >> 16;
      DataPacket[8] = max30003.ecgdata >> 24;

      DataPacket[9] = max30003.RRinterval;
      DataPacket[10] = max30003.RRinterval >> 8;
      DataPacket[11] = 0x00;
      DataPacket[12] = max30003.heartRate;

      DataPacket[13] = max30003.heartRate >> 8;
      DataPacket[14] = 0x00;

      Serial.print("Heart Rate  = ");
      Serial.println(max30003.heartRate);

      Serial.print("RR interval  = ");
      Serial.println(max30003.RRinterval);

      // sendDataThroughUART();
      Serial.println("");
      Serial.println(ULP);
      delay(8);
    }
  }
  else
  {
    pwearCount++;
    if (pwearCount == 500000)
    {
      pwearCount = 0;
      ULP++;
      Serial.println(ULP);
      Serial.println("Please wear.");
    }
  }
}
#endif