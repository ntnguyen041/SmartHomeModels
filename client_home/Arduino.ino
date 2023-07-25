#include <Wire.h>
#include <Stepper.h>

int stepsPerRevolution = 2048;

int controllDriver = 0;

int Gate = 0;
int GARAGE = 0;
int LED_BED = 0;
int LED_TOILET = 0;
int LED_KIT = 0;
int Fan = 0;

int LED_Toilet_Pin = 12;
int LED_Bed_Pin = 2;
int LED_Kit_Pin = 3;

int THERMISTORPIN = A1;


Stepper Gate_stepper(stepsPerRevolution, 8, 10, 9, 11);  // main gate
Stepper Garage_stepper(stepsPerRevolution, 4, 6, 5, 7);  // garage

unsigned long time;

int stop1 = 0;
int stop2 = 0;

void setup() {
  Wire.begin(4);                 // join i2c bus with address #4
  Wire.onReceive(receiveEvent);  // register event
  // Wire.onRequest(receiveEvent)
  Serial.begin(115200);

  Gate_stepper.setSpeed(15);    // set first stepper speed
  Garage_stepper.setSpeed(15);  // start serial for output

  pinMode(LED_Toilet_Pin, OUTPUT);
  pinMode(LED_Bed_Pin, OUTPUT);
  pinMode(LED_Kit_Pin, OUTPUT);
  digitalWrite(LED_Toilet_Pin, HIGH);
}

void loop() {
  if (LED_BED == 1) {
    digitalWrite(LED_Bed_Pin, HIGH);
  }
  if (LED_BED != 1) {
    digitalWrite(LED_Bed_Pin, LOW);
  }
  if (LED_KIT == 1) {
    digitalWrite(LED_Kit_Pin, HIGH);
  }
  if (LED_KIT == 0) {
    digitalWrite(LED_Kit_Pin, LOW);
  }
  if (LED_TOILET == 1) {
    digitalWrite(LED_Toilet_Pin, HIGH);
  }
  if (LED_TOILET == 0) {
    digitalWrite(LED_Toilet_Pin, LOW);
  }
  if (Gate == 1) {
    Gate_stepper.step(-1);
    stop1--;
    if (stop1 <= 0) {
      stop1 = 0;
      stopGate();
    }
    
  }  // step left
  if (Gate == 0) {
    Gate_stepper.step(1);
    stop1++;
    if (stop1 >= 5350) {
      stop1 = 5350;
      stopGate();
    }
  }  // step right

  if (GARAGE == 0) {
    Garage_stepper.step(1);
    stop2++;
    if (stop2 >= 3000) {
      stop2 = 3000;
      stopGARAGE();
    }
  }  // step forward
  if (GARAGE == 1) {
    Garage_stepper.step(-1);
    stop2--;
    if (stop2 <= 0) {
      stop2 = 0;
      stopGARAGE();
    }
  }  // step backward
}

// function that executes whenever data is received from master
// this function is registered as an event, see setup()
void receiveEvent(int numBytes) {
  int a[10];
  int i = 0;

  while (0 < Wire.available()) {
    char c = Wire.read();
    Serial.println(c);
    if (i == 5) {
      break;  // nếu đã đọc đủ 5 ký tự thì thoát khỏi vòng lặp
    }
    a[i] = c - '0';  // chuyển ký tự sang số và lưu vào mảng a
    i++;
  }

  LED_BED = a[0];
  // Serial.print(a[0]);
  LED_KIT = a[1];
  LED_TOILET = a[2];
  Gate = a[3];
  GARAGE = a[4];
}

void stopGate() {
  digitalWrite(8, LOW);
  digitalWrite(9, LOW);
  digitalWrite(10, LOW);
  digitalWrite(11, LOW);
}

void stopGARAGE() {
  digitalWrite(4, LOW);
  digitalWrite(5, LOW);
  digitalWrite(6, LOW);
  digitalWrite(7, LOW);
}