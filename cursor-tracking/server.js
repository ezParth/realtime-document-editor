const websockets = require("ws")
const http = require('http')
const express = require("express")
const app = express();
const server = http.createServer(app)
const DiffMatchPatch = require('diff-match-patch');
const { v4: uuidv4 } = require('uuid');
const { uniqueNamesGenerator, adjectives, animals } = require('unique-names-generator');

let documentContent = "";
const dmp = new DiffMatchPatch();

const wss = new websockets.Server({server});

wss.on('connection', (ws) => {
    const randomName = uniqueNamesGenerator({ dictionaries: [adjectives, animals] });
    ws.randomName = randomName
    console.log(`User ${randomName} connected!`)

    ws.send(JSON.stringify({type: 'sync', content: documentContent}))

    ws.on('message', (message) => {
        const data = JSON.parse(message);

        if(data.type === 'update'){
            const clientPatch = dmp.patch_make(documentContent, data.content);
            const patchText = dmp.patch_toText(clientPatch);
            const newContent = dmp.patch_apply(clientPatch, documentContent)[0];
            documentContent = newContent;
            wss.clients.forEach((client) => {
                if(client !== ws && client.readyState === websockets.OPEN){
                    client.send(JSON.stringify({type: "patch", patch: patchText, cursor: data.cursor}))
                }
            });
        }
    })
    ws.on('close', () => {
        console.log(`User ${randomName} disconnected`);
    });
})

server.listen(3000, () =>{
    console.log("server running on port 3000!");
})