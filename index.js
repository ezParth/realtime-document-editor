const connectBtn = document.getElementById("connect");
const disconnectBtn = document.getElementById("disconnect");
const documentArea = document.getElementById("document");

let ws;

connectBtn.addEventListener("click", () => {
  ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => {
    console.log("Connected to a websocket server!");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "sync") {
      documentArea.value = data.content;
    }
    if (data.type === "update") {
      documentArea.value = data.content;
    }
  };
  
  documentArea.addEventListener('input', () => {
    const content = documentArea.value;
    ws.send(JSON.stringify({type: 'update', content: content}));
  });

  ws.onclose = () => {
    console.log("websocket connection closed");
  };
});

disconnectBtn.addEventListener("click", () => {
  ws.close();
  console.log("client disconnected");
});
