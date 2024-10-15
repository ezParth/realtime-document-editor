const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const DiffMatchPatch = require("diff-match-patch");
const randomName = require("node-random-name");
const dmp = new DiffMatchPatch();

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
app.use(express.static('public'));

let documentContent = "";

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.send(JSON.stringify({ type: "sync", content: documentContent }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);

    if (data.type === "update") {
      const clientPatch = dmp.patch_make(documentContent, data.content);
      console.log("#client patch:",clientPatch);
      const newContent = dmp.patch_apply(clientPatch, documentContent)[0];
      console.log("#newContent:",newContent);
      documentContent = newContent;
      console.log("#documentContent:",documentContent);

      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === WebSocket.OPEN) {
          client.send(
            JSON.stringify({ type: "patch", patch: clientPatch })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(3000, () => console.log(`Server is listening on port 3000!`));
