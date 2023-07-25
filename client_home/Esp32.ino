#include <ESP32Servo.h>
#include <WiFi.h>
#include <Arduino.h>
#include <ArduinoJson.h>
#include <SocketIOclient.h>
#include <Wire.h>
#include <LiquidCrystal_I2C.h>
#include <HTTPClient.h>
#include <SPI.h>
#include <MFRC522.h>
#include <WiFiManager.h>

#define RST_PIN 0
#define SS_PIN 5

int UID[4], i;

int ID1[4] = { 78, 36, 00, 125 };  //Thẻ bật tắt đèn

MFRC522 mfrc522(SS_PIN, RST_PIN);

LiquidCrystal_I2C lcd(0x27, 16, 2);

SocketIOclient socketIO;

#define USE_SERIAL Serial

WiFiManager wm;

const char* ssid = "OPPO A3s";        /*SSID of network to connect*/
const char* password = "12345678900"; /*password for SSID*/


//////////////////// Khai Báo Các Chân Của Thiết Bị //////////////////////////
int buttonBedroom = 25;
int buttonKitroom = 26;
int buttonToiletroom = 27;
int buttonGarage = 12;
int buttonGate = 13;
int buttonMainDoor = 14;
int buttonFan = 33;
int DoorLeft = 2;
int DoorRight = 4;
int Fan = 15;
int Buz = 17;
int led = 16;
// 0986641241
#define LaserPin 32

#define RainPin 39

#define LDRPin 34

#define THERMISTORPIN 36
// resistance of termistor at 25 degrees C
#define THERMISTORNOMINAL 10000
#define TEMPERATURENOMINAL 25
// Accuracy - Higher number is bigger
#define NUMSAMPLES 10
// Beta coefficient from datasheet
#define BCOEFFICIENT 3950
// the value of the R1 resistor
#define SERIESRESISTOR 10000
//prepare pole
uint16_t samples[NUMSAMPLES];


Servo ServoLeft;
Servo ServoRight;
//////////////////// Khai Báo Trạng Thái Của Thiết Bị //////////////////////////
const String token = "ExponentPushToken[osKFkDKC2aGcyjxlSdNYnG]";
const String title = "JiDuy Smart Home";
const String body = "A thief broke into your house";

int buttonBedstate = 0;
int buttonKitstate = 0;
int buttonToiletstate = 0;
int buttonGatestate = 0;
int buttonGaragestate = 0;
int buttonMaindoorstate = 0;
int buttonFanstate = 0;
int Rainstate = 0;
int Laserstate = 0;

int lastButtonBedstate = 0;
int lastButtonKitstate = 0;
int lastButtonToiletstate = 0;
int lastButtonGatestate = 0;
int lastButtonGaragestate = 0;
int lastbuttonMaindoorstate = 0;
int lastbuttonFanstate = 0;
int lastRainstate = 0;
int lastLaserstate = 0;

bool statusBedLed = false;
bool statusKitLed = false;
bool statusToiletLed = false;
bool statusFan = false;
bool statusGate = false;
bool statusGarage = false;
bool statusMaindoor = false;
bool statusRain = false;
bool statusLaser = false;


int stop1 = 0;
int stop2 = 0;

int temp = 0;

unsigned long previousMillis = 0;
const long interval = 3000;

int ValueSoil, Soilanalog;

unsigned long startTime;
unsigned long elapsedTime;
double t = 0;
double h = 0;
double p = 0;
double a = 0;

String homeId = "64a3de2814b0c81928b21d97";
///////////////////// Xứ Lý Sự Kiện Được Lấy Về Trên Server ///////////////////
void messageHandler(uint8_t* payload) {
  DynamicJsonDocument doc(1024);
  DeserializationError error = deserializeJson(doc, payload);

  if (error) {
    Serial.print(F("deserializeJson() failed: "));
    Serial.println(error.f_str());
    return;
  }

  String EventName = doc[0];

  // Serial.println(EventName);

  if (EventName == "buttonState") {
    int pinEsp = doc[1]["pinEsp"];
    bool status = doc[1]["status"];
    // Serial.println(pinEsp);
    if (pinEsp == 2) {
      statusBedLed = status;
      if (status) {
        startTime = millis();
        p = 18;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 2);
        p = 0;
      }
    }
    if (pinEsp == 3) {
      statusKitLed = status;
      if (status) {
        startTime = millis();
        p = 18;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 3);
        p = 0;
      }
    }
    if (pinEsp == 12) {
      statusToiletLed = status;
      if (status) {
        startTime = millis();
        p = 18;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 12);
        p = 0;
      }
    }
    if (pinEsp == 7) {
      statusGarage = status;
      if (status) {
        startTime = millis();
        p = 746;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 7);
        p = 0;
      }
    }
    if (pinEsp == 8) {
      statusGate = status;
      if (status) {
        startTime = millis();
        p = 746;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 8);
        p = 0;
      }
    }
    if (pinEsp == 4) {
      statusMaindoor = status;
      if (status) {
        startTime = millis();
        p = 373;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 4);
        p = 0;
      }
    }
    if (pinEsp == 15) {
      statusFan = status;
      if (status) {
        startTime = millis();
        p = 1119;
      } else {
        elapsedTime = millis() - startTime;
        t = elapsedTime;
        t = t / 1000;
        h = t / 3600;
        a = p * h;
        Serial.print("TOTAL: ");
        Serial.print(a);
        Serial.println(" KWH");
        sendconsume(homeId, a, 15);
        p = 0;
      }
    }
  }
}
int arrPinsEsp[] = {
  2, 3, 12, 8, 7, 15, 4
};

bool arrState[] = {
  statusBedLed,
  statusKitLed,
  statusToiletLed,
  statusGate,
  statusGarage,
  statusFan,
  statusMaindoor
};
void sendresetdevicestate() {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
  array.add("resetDeviceState");

  JsonObject param = array.createNestedObject();
  param["homeId"] = homeId;

  param["pinsEsp"][0] = 2;
  param["statuss"][0] = statusBedLed;
  param["pinsEsp"][1] = 3;
  param["statuss"][1] = statusKitLed;
  param["pinsEsp"][2] = 12;
  param["statuss"][2] = statusToiletLed;
  param["pinsEsp"][3] = 8;
  param["statuss"][3] = statusGate;
  param["pinsEsp"][4] = 7;
  param["statuss"][4] = statusGarage;
  param["pinsEsp"][5] = 15;
  param["statuss"][5] = statusFan;
  param["pinsEsp"][6] = 4;
  param["statuss"][6] = statusMaindoor;


  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}
//////////////// Xử Lý Trạng Thái Của SocketIO //////////////////////

void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
  switch (type) {
    case sIOtype_DISCONNECT:
      {
        USE_SERIAL.printf("[IOc] Disconnected!\n");
        digitalWrite(led, LOW);
      }
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
      socketIO.send(sIOtype_CONNECT, "/");
      sendresetdevicestate();

      digitalWrite(led, HIGH);

      break;
    case sIOtype_EVENT:
      // USE_SERIAL.printf("[IOc] Get Event: %s\n", payload);
      messageHandler(payload);
      break;
  }
}
bool listOnOff[] = {
  false,  //BEDROOM
  false,  //KITCHEN
  false,  //TOILET
  false,  // GATE
  true,   // GARAGE
};

void setup() {
  Wire.begin(21, 22);
  SPI.begin();
  mfrc522.PCD_Init();
  USE_SERIAL.begin(115200);

  WiFi.onEvent(Wifi_connected, SYSTEM_EVENT_STA_CONNECTED);
  WiFi.onEvent(Get_IPAddress, SYSTEM_EVENT_STA_GOT_IP);
  WiFi.onEvent(Wifi_disconnected, SYSTEM_EVENT_STA_DISCONNECTED);
  WiFi.begin(ssid, password);
  Serial.println("Waiting for WIFI network...");

  SensorNTC();
  // server address, port and URL
  // socketIO.beginSSL("server-smart-home.onrender.com", 443, "/socket.io/?EIO=4");
  socketIO.begin("192.168.43.142", 3001, "/socket.io/?EIO=4");

  // event handler
  socketIO.onEvent(socketIOEvent);

  pinMode(buttonKitroom, INPUT);
  pinMode(buttonBedroom, INPUT);
  pinMode(buttonToiletroom, INPUT);
  pinMode(buttonGate, INPUT);
  pinMode(buttonGarage, INPUT);
  pinMode(buttonMainDoor, INPUT);
  pinMode(buttonFan, INPUT);
  pinMode(RainPin, INPUT);
  pinMode(LaserPin, INPUT);
  pinMode(Fan, OUTPUT);
  pinMode(Buz, OUTPUT);
  pinMode(led, OUTPUT);

  ServoLeft.attach(DoorLeft);
  ServoRight.attach(DoorRight);

  ServoLeft.write(180);
  ServoRight.write(90);

  lcd.init();
  lcd.clear();
  lcd.backlight();
  lcd.setCursor(2, 0);
  lcd.print("Welcom to");
  lcd.setCursor(3, 1);
  lcd.print("Smart Home!");
}

void loop() {
  socketIO.loop();

  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis > interval) {
    previousMillis = currentMillis;
    lcd.clear();
    SensorNTC();
    RainSersor();
    SoilSensor();
    senddatasensor(homeId, temp, ValueSoil, Rainstate);
  }
  LazerSensor();

  RFID();
  maindoor();
  fan();

  ControlBedRoom();
  ControlKitRoom();
  ControlToiletRoom();
  ControlGate();
  ControlGarage();
  ControlMainDoor();
  ControlFan();
  controllArduinoTwo();
}
////////////////////////// Xử Lý Gửi Dữ Liệu Lên Server ////////////////////////
void senddata(String homeid, bool status, int pin) {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
  array.add("updateDeviceOnOffEsp");

  JsonObject param = array.createNestedObject();
  param["homeId"] = homeid;
  param["status"] = status;
  param["pinEsp"] = pin;

  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}
void sendconsume(String homeid, double consume, int pin) {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
  array.add("updateConsumes");

  JsonObject param = array.createNestedObject();
  param["homeId"] = homeid;
  param["consumes"] = consume;
  param["pinEsp"] = pin;

  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}
void sendsensor(String homeid, String icon, String title, String subTitle) {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
  array.add("createNotification");

  JsonObject param = array.createNestedObject();
  param["homeId"] = homeid;
  param["iconName"] = icon;
  param["title"] = title;
  param["subTitle"] = subTitle;

  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}
void senddatasensor(String homeid, int temperature, int humidity, bool weather) {
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();
  array.add("weather");

  JsonObject param = array.createNestedObject();
  param["homeId"] = homeid;
  param["temperature"] = temperature;
  param["humidity"] = humidity;
  param["weather"] = weather;

  String output;
  serializeJson(doc, output);
  socketIO.sendEVENT(output);
}
void ControlBedRoom() {
  int buttonBedstate = digitalRead(buttonBedroom);

  if (buttonBedstate != lastButtonBedstate && buttonBedstate) {
    statusBedLed = !statusBedLed;
    senddata(homeId, statusBedLed, 2);
    p = 18;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 2);
  }
  listOnOff[0] = statusBedLed;
  if (listOnOff[0] == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
  }
  lastButtonBedstate = buttonBedstate;
}

void ControlKitRoom() {
  buttonKitstate = digitalRead(buttonKitroom);

  if (buttonKitstate != lastButtonKitstate && buttonKitstate) {
    statusKitLed = !statusKitLed;
    senddata(homeId, statusKitLed, 3);
    p = 18;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 3);
  }
  listOnOff[1] = statusKitLed;
  if (listOnOff[1] == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }
  lastButtonKitstate = buttonKitstate;
}
void ControlToiletRoom() {
  buttonToiletstate = digitalRead(buttonToiletroom);

  if (buttonToiletstate != lastButtonToiletstate && buttonToiletstate) {
    statusToiletLed = !statusToiletLed;
    senddata(homeId, statusToiletLed, 12);
    p = 18;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 12);
  }
  listOnOff[2] = statusToiletLed;
  if (listOnOff[2] == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }
  lastButtonToiletstate = buttonToiletstate;
}


void ControlGate() {
  buttonGatestate = digitalRead(buttonGate);

  if (buttonGatestate != lastButtonGatestate && buttonGatestate) {
    statusGate = !statusGate;
    senddata(homeId, statusGate, 8);
    p = 746;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 8);
  }

  listOnOff[3] = statusGate;
  if (listOnOff[3] == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }
  lastButtonGatestate = buttonGatestate;
}

void ControlGarage() {
  buttonGaragestate = digitalRead(buttonGarage);

  if (buttonGaragestate != lastButtonGaragestate && buttonGaragestate) {
    statusGarage = !statusGarage;
    senddata(homeId, statusGarage, 7);
    p = 746;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 7);
  }
  listOnOff[4] = statusGarage;
  if (listOnOff[4] == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }
  lastButtonGaragestate = buttonGaragestate;
}

void ControlFan() {
  buttonFanstate = digitalRead(buttonFan);

  if (buttonFanstate != lastbuttonFanstate && buttonFanstate) {
    statusFan = !statusFan;
    fan();
    senddata(homeId, statusFan, 15);
    p = 1119;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 15);
  }
  if (digitalRead(Fan) == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }

  lastbuttonFanstate = buttonFanstate;
}
void fan() {
  if (statusFan == true) {
    digitalWrite(Fan, HIGH);
  } else {
    digitalWrite(Fan, LOW);
  }
}
void ControlMainDoor() {
  buttonMaindoorstate = digitalRead(buttonMainDoor);

  if (buttonMaindoorstate != lastbuttonMaindoorstate && buttonMaindoorstate) {
    statusMaindoor = !statusMaindoor;
    maindoor();
    senddata(homeId, statusMaindoor, 4);
    p = 373;
    startTime = millis();
    t = t / 1000;
    h = t / 3600;
    a = p * h;
    sendconsume(homeId, a, 4);
  }
  if (digitalRead(DoorLeft) == true) {
    elapsedTime = millis() - startTime;
    t = elapsedTime;
    p = 18;
  }
  lastbuttonMaindoorstate = buttonMaindoorstate;
}
void maindoor() {
  if (statusMaindoor == true) {
    ServoLeft.write(90);
    ServoRight.write(180);
  } else {
    ServoLeft.write(180);
    ServoRight.write(90);
  }
}
void SensorNTC() {
  uint8_t i;
  float average;

  // lưu giá trị input
  for (i = 0; i < NUMSAMPLES; i++) {
    samples[i] = analogRead(THERMISTORPIN);
  }
  //tính giá trị trung bình input
  average = 0;
  for (i = 0; i < NUMSAMPLES; i++) {
    average += samples[i];
  }
  average /= NUMSAMPLES;

  //đổi sang điện trở
  average = 4095 / average - 1;
  average = SERIESRESISTOR / average;

  //đổi từ điện trở sang nhiệt độ
  float temperature;
  temperature = average / THERMISTORNOMINAL;
  temperature = log(temperature);
  temperature /= BCOEFFICIENT;
  temperature += 1.0 / (TEMPERATURENOMINAL + 273.15);
  temperature = 1.0 / temperature;
  temperature -= 273.15;  // đổi sang nhiệt độ
  temp = temperature + 14;
  // Hiện thị nhiệt độ lên lcd
  lcd.setCursor(0, 0);
  lcd.print("T: ");
  lcd.print(temp);
  Serial.println(temp);
  if (temp > 60) {
    sendPushNotification("Temperature", "Is your house too hot?", token);
    sendsensor(homeId, "thermometer-outline", "Temperature", "Is your house too hot?");
  }
}

void SoilSensor() {

  Soilanalog = analogRead(LDRPin);
  ValueSoil = (100 - ((Soilanalog / 4095.00) * 100));
  lcd.setCursor(7, 0);
  lcd.print("||");
  lcd.setCursor(10, 0);
  lcd.print("M: ");
  lcd.print(ValueSoil);
  lcd.print("%");
  Serial.print(ValueSoil);
  Serial.println("%");
}

void LazerSensor() {
  unsigned long time = millis();
  Laserstate = digitalRead(LaserPin);
  // Serial.println(Laserstate);
  if (Laserstate != lastLaserstate && Laserstate) {
    statusLaser = !statusLaser;
  }
  if (Laserstate == true) {
    buz_pef(3);
  } else {
    buz_pef(1);
  }
  if (Laserstate != lastLaserstate && !Laserstate) {
    sendPushNotification("Security", "Do you have an intruder in your house?", token);
    sendsensor(homeId, "walk-outline", "Security", "Do you have an intruder in your house?");
  }


  lastLaserstate = Laserstate;
}

void RainSersor() {
  String status = "";
  Rainstate = digitalRead(RainPin);
  if (Rainstate != lastRainstate && Rainstate) {
    statusRain = !statusRain;
    Serial.println("True");
    sendPushNotification("Weather", "Your house is Sunny", token);
    sendsensor(homeId, "partly-sunny-outline", "Weather", "Your house is Sunny");
  }
  if (Rainstate != lastRainstate && !Rainstate) {
    Serial.println("false");
    sendPushNotification("Weather", "Your house is Rain", token);
    sendsensor(homeId, "thunderstorm-outline", "Weather", "Your house is Rain");
  }
  lastRainstate = Rainstate;
  if (Rainstate == true) {
    status = "Sun";
  } else {
    status = "Rain";
  }
  lcd.setCursor(0, 1);
  lcd.print("W: ");
  lcd.print(status);
}

void buz_pef(int value) {
  switch (value) {
    case 0:
      {
        digitalWrite(Buz, HIGH);
      }
      break;
    case 1:
      {
        digitalWrite(Buz, HIGH);
      }
      break;
    case 3:
      {
        digitalWrite(Buz, LOW);
      }
      break;
  }
}
void RFID() {
  if (!mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  if (!mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  Serial.print("UID của thẻ: ");

  for (byte i = 0; i < mfrc522.uid.size; i++) {
    Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
    UID[i] = mfrc522.uid.uidByte[i];
    Serial.print(UID[i]);
  }

  Serial.println("   ");

  if (UID[i] == ID1[i]) {
    statusMaindoor = true;
    ServoLeft.write(90);
    ServoRight.write(180);

    buz_pef(3);
  } else {
    statusMaindoor = false;
    ServoLeft.write(180);
    ServoRight.write(90);
    Serial.println("SAI THẺ........");
    buz_pef(0);
  }

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
  senddata(homeId, statusMaindoor, 4);
}
void sendPushNotification(String title, String message, String token) {
  HTTPClient http;

  // Tạo URL API gửi thông báo
  String url = "https://api.expo.dev/v2/push/send";

  // Tạo JSON data cho thông báo
  String jsonData = "{";
  jsonData += "\"to\": \"" + token + "\",";
  jsonData += "\"title\": \"" + title + "\",";
  jsonData += "\"body\": \"" + message + "\",";
  jsonData += "\"priority\": \"high\",";
  jsonData += "\"sound\": \"default\"";
  jsonData += "}";

  // Gửi yêu cầu POST đến API của ứng dụng của bạn
  http.begin(url);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(jsonData);

  // Xử lý kết quả trả về từ API
  if (httpResponseCode > 0) {
    Serial.printf("Notification sent (HTTP status code: %d)\n", httpResponseCode);
    String response = http.getString();
    Serial.println(response);
  } else {
    Serial.printf("Error sending notification (HTTP status code: %d)\n", httpResponseCode);
  }

  http.end();
}
void controllArduinoTwo() {
  int t = 0;
  t = listOnOff[0] * 10000 + listOnOff[1] * 1000 + listOnOff[2] * 100 + listOnOff[3] * 10 + listOnOff[4];
  int ControllAduinoTwo = t < 10000 ? t + 20000 : t;
  // Serial.println(ControllAduinoTwo);
  Wire.beginTransmission(4);
  char num[5];
  itoa(ControllAduinoTwo, num, 10);
  Wire.write((const uint8_t*)num, 5);  // ép kiểu con trỏ num về kiểu const uint8_t*
  Wire.endTransmission();
}



/////////////////////////// Tìm Kiếm Và Kết Nối WIFI ////////////////////////
void Wifi_connected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("ESP32 WIFI Connected to Access Point");
}

void Get_IPAddress(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("WIFI Connected!");
  Serial.println("IP address of Connected WIFI: ");
  Serial.println(WiFi.localIP());
}

void Wifi_disconnected(WiFiEvent_t event, WiFiEventInfo_t info) {
  Serial.println("Disconnected from WIFI");
  Serial.print("Connection Lost Reason: ");
  Serial.println(info.disconnected.reason);
  Serial.println("Reconnecting...");
  WiFi.begin(ssid, password);
}

// void searchWiFi() {
//   int numberOfNetwork = WiFi.scanNetworks();
//   USE_SERIAL.println("----");

//   for (int i = 0; i < numberOfNetwork; i++) {
//     USE_SERIAL.print("Network name: ");
//     USE_SERIAL.println(WiFi.SSID(i));
//     USE_SERIAL.print("Signal strength: ");
//     USE_SERIAL.println(WiFi.RSSI(i));
//     USE_SERIAL.println("--------------");
//   }
// }
// void connectWiFi() {
//   WiFi.begin(ssid, pass);
//   while (WiFi.status() != WL_CONNECTED) {
//     bool res;
//     res = wm.autoConnect("AutoConnectAP", "password");
//     if (!res) {
//       Serial.println("Failed to connect");
//     } else {
//       Serial.println("connected...yeey :)");
//     }
//   }

//   USE_SERIAL.print("");
//   USE_SERIAL.println("WiFi connected");
//   USE_SERIAL.print("IP Address : ");
//   USE_SERIAL.println(WiFi.localIP());
// }