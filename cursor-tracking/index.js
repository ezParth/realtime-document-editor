const ws = new WebSocket("ws://localhost:3000");
const disconnectBtn = document.getElementById('disconnect');
const connectBtn = document.getElementById('connect');
const documentArea = document.getElementById('document');
let currentDocument = "";

ws.onopen = () => {
    console.log("connected to the server!");
};

ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("data--->", data);

    if (data.type === 'sync') {
        documentArea.value = data.content;
        currentDocument = data.content;
    }

    if (data.type === 'patch') {
        const dmp = new diff_match_patch();
        const patches = dmp.patch_fromText(data.patch);  // Deserialize patch from text
        const result = dmp.patch_apply(patches, currentDocument);
        currentDocument = result[0];
        console.log("result --> ",result);
        console.log("cd --> ",currentDocument);
        documentArea.value = currentDocument;
        console.log(`Other user's cursor position: ${data.cursor}`);
    }
};


documentArea.addEventListener('input', () => {
    const content = documentArea.value;

    const cursorPosition = documentArea.selectionStart;
    console.log("Cursor position:", cursorPosition);
    ws.send(JSON.stringify({ type: "update", content: content, cursor:cursorPosition }));
});

ws.onclose = () => {
    console.log("Client disconnected!");
};

disconnectBtn.addEventListener('click', () => {
    ws.close();
    console.log("Disconnected by clicking the button");
});
