import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import path from "path";

let LlamaModel, LlamaContext, LlamaChatSession;

const loadLlamaModules = async () => {
  const llama = await import("node-llama-cpp");
  LlamaModel = llama.LlamaModel;
  LlamaContext = llama.LlamaContext;
  LlamaChatSession = llama.LlamaChatSession;
};

const initLlama = async () => {
  await loadLlamaModules();
  const model = new LlamaModel({
    modelPath: path.join(
      path.resolve(),
      "models",
      "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf"
    ),
  });

  const context = new LlamaContext({ model });
  const session = new LlamaChatSession({ context });

  return { context, session };
};

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());

// ---------------------------------------
// ------- HTTP Server -------------------

// ---------------------------------------
// ------- Websocket ---------------------
const wss = new WebSocketServer({ noServer: true });

let _id = 0;
let _clients = [];

const broadcast = (message) =>
  _clients.forEach((s) => s.send(JSON.stringify(message)));

wss.on("connection", (socket) => {
  _clients.push(socket);
  socket.on("message", async (payload) => {
    const prompt = payload.toString();
    const { id, message } = JSON.parse(prompt);

    console.log({ prompt });

    broadcast({
      user: { id, role: "human" },
      content: { id: ++_id, text: message },
      sentAt: new Date().toISOString(),
    });

    const cid = ++_id;
    const sentAt = new Date().toISOString();
    await stream(message, (chunk) => {
      broadcast({
        user: { id: 1000, role: "ai" },
        content: { id: cid, fragment: chunk },
        sentAt,
      });
    });
  });
});

let context, session;
const stream = async (prompt, onNext) => {
  if (!session) {
    const llama = await initLlama();
    context = llama.context;
    session = llama.session;
  }
  session.prompt(prompt, {
    onToken(chunk) {
      onNext(context.decode(chunk));
    },
  });
};

const server = app.listen(port);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
