import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import http from 'http';
import { Server as socketIO } from 'socket.io';
import mqtt from 'mqtt';
import cors from 'cors';
import WebSocket from 'ws';
import jwt from 'jsonwebtoken';

dotenv.config();

// import route
import machineRoute from './routes/machineRoute.js'
import punchMachineRoute from './routes/punchMachineRoute.js'

// import schema 
import punchMachineData from './models/punchMachineDataSchema.js';
// import registerOrderHandlers from "./handlers/orderHandler.js";
// import MachineHandlers from "./handlers/MachineHandler.js";
// import MachineHandler from './handlers/MachineHandler.js';

//import middleware
import authenticateJWT from './middlewares/authenticateJWT.js';
import saveMachineData from './utils/machine.js';

const app = express();
const server = http.createServer(app);


app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log(`Connected to MongoDB Successfully at ${process.env.MONGO_URL}`))
    .catch(err => console.error('MongoDB connection error:', err));

const MQTT_SERVER = "172.18.0.3"; // docker 
// const MQTT_SERVER = "127.0.0.1";
const MQTT_PORT = "1883";
const MQTT_USER = "tesa";
const MQTT_PASSWORD = "oriote";

const client = mqtt.connect({
    host: MQTT_SERVER,
    port: MQTT_PORT,
    username: MQTT_USER,
    password: MQTT_PASSWORD,
});

const topicHandlers = {};

const addTopicHandler = (topic, handler) => {
    topicHandlers[topic] = handler;
    client.subscribe(topic, (err) => {
        if (err) {
            console.error(`Failed to subscribe to topic ${topic}:`, err);
        } else {
            console.log(`Successfully subscribed to topic: ${topic}`);
        }
    });
};

client.on('connect', () => {
    console.log("MQTT Connected");

    addTopicHandler('message', (message) => {
        console.log(`Received on 'message' topic: ${message}`);
    });

    addTopicHandler('frommachine', (message) => {
        console.log(`Received on 'frommachine' topic: ${message}`);
    });

    addTopicHandler('machine/data', (message) => {
        console.log(`Received on 'machine/data' topic: ${message}`);
        saveMachineData(JSON.parse(message));
    });
    run();
});

client.on('message', (topic, message) => {
    const handler = topicHandlers[topic];
    if (handler) {
        handler(message.toString());
    } else {
        console.log(`No handler for topic ${topic}. Message: ${message.toString()}`);
    }
});


// test send data from sever to mqtt broker
setInterval(() => {
    const topic = "fromserver";
    const message = "hello world from server";
    publishMessage(topic, message);
}, 50000);

const publishMessage = async (topic, message) => {
    console.log("MQTT Publish Message:", topic, message);
    client.publish(topic, message);
};

const subscribeTopic = (topic) => {
    return new Promise((resolve, reject) => {
        client.subscribe(topic, (err) => {
            if (err) {
                console.log(`Failed to subscribe to topic ${topic}:`, err);
                reject(err);
            } else {
                console.log(`Successfully subscribed to topic: ${topic}`);
                resolve();
            }
        });
    });
};

const run = async () => {
    try {
        await subscribeTopic('10');

        addTopicHandler('10', (message) => {
            console.log(`Received on '10' topic: ${message}`);
        });
    } catch (error) {
        console.error("Error subscribing to topic:", error);
    }
};


// web socket
const ws = new WebSocket(process.env.WS_URL);

ws.on('error', console.error);

ws.on('open', function open() {
    console.log('Connection to Websocket successfully');
    ws.send(process.env.API_KEY_WS);
});

ws.on('message', async function message(data) {
    try {
        // console.log('before convert', data);
        const jsonString = data.toString('utf-8');

        const jsonObject = JSON.parse(jsonString);

        // console.log(jsonObject['Energy Consumption'].Power);
        const formattedData = {
            energyConsumption: {
                power: jsonObject['Energy Consumption'].Power
            },
            voltage: {
                L1_GND: jsonObject.Voltage['L1-GND'],
                L2_GND: jsonObject.Voltage['L2-GND'],
                L3_GND: jsonObject.Voltage['L3-GND']
            },
            pressure: jsonObject.Pressure,
            force: jsonObject.Force,
            cycleCount: jsonObject['Cycle Count'],
            positionOfThePunch: jsonObject['Position of the Punch']
        };

        // Create a new instance of the punch machine data model
        const newPunchMachineData = new punchMachineData(formattedData);

        // Save the new data to the database
        const savedData = await newPunchMachineData.save();

        // console.log('Saved data to database:');
    } catch (error) {
        console.error('Error processing message:', error);
    }
});




// Restful API 
app.post('/send-message', (req, res) => {
    const { message } = req.body;
    io.emit('message', { msg: message });
    res.json({ success: true, message: 'Message sent to all clients!' });
});

app.get('/', (req, res) => {
    res.json({ api: "api ok!" });
});

app.post('/token', async (req, res) => {
    const { API_KEY } = req.body;

    if (!API_KEY) {
        return res.status(401).json({ message: 'API_KEY is required' });
    }

    // Check API keys

    if (API_KEY !== process.env.API_KEY) {
        return res.status(401).json({ 'message': 'invalid API_KEY' });
    }

    // Create a JWT payload
    const payload = {
        userId: 1,
        username: 'web'
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

    // Send the token as the response
    res.json({ token });
});

app.use('/machine', machineRoute);
app.use('/punch-machine', authenticateJWT, punchMachineRoute);


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
