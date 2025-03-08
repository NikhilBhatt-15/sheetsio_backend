import { WebSocketServer } from "ws";
import { generateHash } from "./utility.js";
import axios from "axios";

const clients = new Map();

function disconnectClient(ws) {
    if (clients.has(ws)) {
        clearInterval(ws.intervalId);
        clients.delete(ws);
        console.log("✅ Client removed successfully");
    }
}

async function fetchSheetData(sheetId, ws) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/A1:Z100?key=${process.env.API_KEY}`;

    try {
        const response = await axios.get(url);
        const newData = response.data.values || [];
        const newHash = generateHash(newData);

        const client = clients.get(ws);
        if (!client) return;

        //if data has changed before sending
        if (newHash !== client.lastHash) {
            console.log("Google Sheets updated! Sending new data...");
            client.lastHash = newHash; // Store the new hash

           
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "google_sheets_data",
                    payload: {
                        values: newData,
                        range: "A1:Z100"
                    }
                }));
            }
        }
    } catch (error) {
        console.error("Error fetching Google Sheets data:", error.response?.data || error.message);
    }
}

export function webSocketService(server) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", (ws) => {
        console.log("New WebSocket client connected");

        ws.on("message", (message) => {
            try {
                const parsedMessage = JSON.parse(message);
                console.log("Received message:", parsedMessage);
                const { type, sheetId } = parsedMessage;

                if (type === "connect") {
                    console.log("Client connected with sheet:", sheetId);

                    // Update client with new sheetId and reset lastHash
                    clients.set(ws, { sheetId, lastHash: "" });

                    // Fetch data immediately & set interval
                    fetchSheetData(sheetId, ws);
                    const intervalId = setInterval(() => fetchSheetData(sheetId, ws), 5000); // Fetch every 5s

                    // Clear previous interval if exists
                    if (ws.intervalId) {
                        clearInterval(ws.intervalId);
                    }

                    ws.intervalId = intervalId; // Store interval for cleanup
                } else if (type === "disconnect") {
                    console.log("Client disconnected manually");
                    disconnectClient(ws);
                }
            } catch (error) {
                console.error("Error processing message:", error);
            }
        });

        ws.on("close", () => {
            console.log("Client disconnected");
            disconnectClient(ws);
        });
    });
}