#ifndef _protocentral_Max30003_h_
#define _protocentral_Max30003_h_

#include <Arduino.h>

#define WREG 0x00
#define RREG 0x01

#define   NO_OP           0x00
#define   STATUS          0x01  /////////D[11]: LONINT 导联检测标志位
#define   EN_INT          0x02  /////////D[11]: LONINT 导联检测使能
#define   EN_INT2         0x03
#define   MNGR_INT        0x04
#define   MNGR_DYN        0x05
#define   SW_RST          0x08
#define   SYNCH           0x09
#define   FIFO_RST        0x0A
#define   INFO            0x0F
#define   CNFG_GEN        0x10
#define   CNFG_CAL        0x12
#define   CNFG_EMUX       0x14
#define   CNFG_ECG        0x15
#define   CNFG_RTOR1      0x1D
#define   CNFG_RTOR2      0x1E
#define   ECG_FIFO_BURST  0x20
#define   ECG_FIFO        0x21
#define   RTOR            0x25
// #define   NO_OP           0x7F

#define MAX30003_CS_PIN   25
#define CLK_PIN          18
#define RTOR_INTR_MASK     0x04

typedef enum
{
  SAMPLINGRATE_128 = 128, SAMPLINGRATE_256 = 256, SAMPLINGRATE_512 = 512
}sampRate;

class MAX30003
{
  public:
  	unsigned int heartRate;
  	unsigned int RRinterval;
  	signed long ecgdata;

    void max30003Begin();
    void max30003BeginRtorMode();
    void max30003SwReset(void);
    void getHRandRR(void);
    void getEcgSamples(void);
    bool max30003ReadInfo(void);
    void max30003SetsamplingRate(uint16_t samplingRate);
    void max30003RegRead(uint8_t Reg_address, uint8_t * buff);

  private:

    void max30003ReadData(int num_samples, uint8_t * readBuffer);

    void max30003Synch(void);
    void max30003RegWrite (unsigned char WRITE_ADDRESS, unsigned long data);
};

#endif
