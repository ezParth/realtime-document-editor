const express = require('express');
const http = require("http");
const WebSocket = require("ws");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let documentContent;

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.send(JSON.stringify({ type: 'sync', content:documentContent }));

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if(data.type === 'update'){
            documentContent = data.content;

            wss.clients.forEach((client) => {
                if(client !== ws && client.readyState === WebSocket.OPEN){
                    client.send(JSON.stringify({type: 'update', content: documentContent}));
                }
            })
        }
    })

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

server.listen(3000, () => console.log(`Server is listening on port 3000!`));
