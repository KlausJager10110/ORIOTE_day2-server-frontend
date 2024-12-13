const WebSocket = require('ws');

let time = 0; // ตัวแปรสำหรับเวลา
const timeIncrement = 0.1; // ค่าที่เพิ่มขึ้นของเวลาในแต่ละรอบ (ปรับเพื่อควบคุมความถี่)

// ฟังก์ชันสำหรับสร้างกราฟ sin
function getSineWaveValue(amplitude, frequency, phase) {
    return amplitude * Math.sin(frequency * time + phase);
}

// ฟังก์ชันสำหรับสร้างกราฟสามเหลี่ยม
function getTriangleWaveValue(amplitude, frequency, phase = 0) {
    // frequency: ความถี่ของคลื่น, amplitude: ความสูงของคลื่น, phase: การเลื่อนเฟส
    const period = 1 / frequency; // คำนวณคาบของคลื่น (Period)
    const timePhase = (time + phase) % period; // คำนึงถึงเฟสและคาบ
    return amplitude * (1 - Math.abs((2 * timePhase / period) - 1)); // กราฟสามเหลี่ยม
}

function generateRandomData() {
    time += timeIncrement; // เพิ่มค่าเวลาในแต่ละรอบ

    return {
        "Energy Consumption": {
            "Power": getRandomNumber(90, 120)
        },
        "Voltage": {
            "L1-GND": 220 + getSineWaveValue(10, 2 * Math.PI * 1, 0), // เฟส 0
            "L2-GND": 220 + getSineWaveValue(10, 2 * Math.PI * 1, Math.PI), // เฟส 120 องศา
            "L3-GND": 220 + getSineWaveValue(10, 2 * Math.PI * 1, 2 * Math.PI / 3) // เฟส 240 องศา
        },
        "Pressure": getRandomNumber(-10, 30),
        "Force": 0 + getTriangleWaveValue(1500, 1), // 0.05 - 1 [freq: min - max]
        "Cycle Count": getRandomCycleCount(),
        "Position of the Punch": 10 + getTriangleWaveValue(150, 1), // 0.05 - 1 [freq: min - max]
    };
}
// ฟังก์ชันสำหรับสุ่มตัวเลขในช่วงที่กำหนด
function getRandomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// ฟังก์ชันสำหรับสุ่ม Cycle Count (เพิ่มค่าจากตัวสุดท้าย)
let lastCycleCount = 0; // ตัวแปรเก็บค่าของ Cycle Count ล่าสุด
function getRandomCycleCount() {
    lastCycleCount += 1; // เพิ่มค่า Cycle Count
    return lastCycleCount;
}

// สร้าง WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // ส่งข้อมูลไปยัง client ทุก ๆ 1 วินาที
    const interval = setInterval(() => {
        const newData = generateRandomData(); // สร้างชุดข้อมูลใหม่
        ws.send(JSON.stringify(newData)); // ส่งข้อมูลใหม่ไปยัง client
    }, 500);

    // จัดการการปิดการเชื่อมต่อ
    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(interval); // หยุดการส่งข้อมูลเมื่อ client ปิด
    });
});

console.log('WebSocket server running on ws://localhost:8080');
