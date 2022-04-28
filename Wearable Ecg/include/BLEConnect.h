#include <Arduino.h> // 包含所必需的库
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include "SPIMax30003.h"

BLEServer *pServer = NULL;
BLECharacteristic *pTxCharacteristic;
bool deviceConnected = false;
bool oldDeviceConnected = false;

char BLEbuf[32] = {0};
String data = "";
String _data = "";
String _hp = "";

// 定义收发服务的UUID（唯一标识）
#define SERVICE_UUID "6E400001-B5A3-F393-E0A9-E50E24DCCA9E"
// RX串口标识
#define CHARACTERISTIC_UUID_RX "6E400002-B5A3-F393-E0A9-E50E24DCCA9E"
// TX串口标识
#define CHARACTERISTIC_UUID_TX "6E400003-B5A3-F393-E0A9-E50E24DCCA9E"

class MyServerCallbacks : public BLEServerCallbacks
{
    void onConnect(BLEServer *pServer)
    {
        deviceConnected = true;
    };

    void onDisconnect(BLEServer *pServer)
    {
        deviceConnected = false;
    }
};

class MyCallbacks : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *pCharacteristic)
    {
        std::string rxValue = pCharacteristic->getValue();

        if (rxValue.length() > 0)
        {
            Serial.println("*********");
            Serial.print("Received Value: ");
            for (int i = 0; i < rxValue.length(); i++)
            {
                Serial.print(rxValue[i]);
            }
            Serial.println();
            data = rxValue.c_str();
            // Serial.println(data);
            Serial.println("*********");
            Serial.println();
        }
    }
};

// setup()在复位或上电后运行一次:
void BLEInit()
{
    Serial.begin(115200);
    // 初始化蓝牙设备
    BLEDevice::init("ESP32 test");
    // 为蓝牙设备创建服务器
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());
    // 基于SERVICE_UUID来创建一个服务
    BLEService *pService = pServer->createService(SERVICE_UUID);
    pTxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_TX,
        BLECharacteristic::PROPERTY_NOTIFY);
    pTxCharacteristic->addDescriptor(new BLE2902());
    BLECharacteristic *pRxCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID_RX,
        BLECharacteristic::PROPERTY_WRITE);
    pRxCharacteristic->setCallbacks(new MyCallbacks());
    // 开启服务
    pService->start();
    // 开启通知
    pServer->getAdvertising()->start();
    Serial.println("Waiting a client connection to notify...");
    Serial.println();
}

// loop()一直循环执行:
void BLEloop()
{

    if ((deviceConnected == 1) & (data.length() > 0))
    {
        memset(BLEbuf, 0, 32);
        memcpy(BLEbuf, data.c_str(), 32);
        // Serial.println(BLEbuf);

        pTxCharacteristic->setValue(BLEbuf); //收到数据后返回数据
        pTxCharacteristic->notify();
        data = ""; //返回数据后进行清空，否则一直发送data
    }
    // if ((deviceConnected == 1) & Serial.available())
    // {
    //     while (Serial.available() > 0) // 串口收到字符数大于零。
    //     {
    //         data += char(Serial.read());
    //         delay(2);
    //     }
    // }
    if ((deviceConnected == 1) & (DataPacket[12] > 5))
    {
        u_char ETAG = (max30003.ecgdata >> 3) & 0x07;
        if ((ETAG == 0))
        {
            data = max30003.ecgdata >> 6;
            _data = data;
        }
        else if (_data != "")
        {
            data = _data;
        }
        if (ETAG < 4)
        {
            data += "0" + String(int16_t(DataPacket[12]));
            _hp = String(int16_t(DataPacket[12]));
            ULP = 0;
        }
        else if (_hp != "")
        {
            data = "1";
        }
        if ((ULP > 6) | (int16_t(DataPacket[12]) < 30) | (ETAG == 2))
            data = "1";
    }

    // 没有新连接时
    if (!deviceConnected && oldDeviceConnected)
    {
        // 给蓝牙堆栈准备数据的时间
        delay(500);
        pServer->startAdvertising();
        // 重新开始广播
        Serial.println("start advertising");
        oldDeviceConnected = deviceConnected;
    }
    // 正在连接时
    if (deviceConnected && !oldDeviceConnected)
    {
        // 正在连接时进行的操作
        oldDeviceConnected = deviceConnected;
    }
}