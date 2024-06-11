import express from "express";
import cors from "cors";
import { WebSocketServer } from "ws";
import path from "path";
import http from "http";

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
const server = http.createServer(app);

// ---------------------------------------
// ------- Websocket ---------------------
const wss = new WebSocketServer({ noServer: true });

let _id = 0;
let _clients = [];

let _streaming = [];

const broadcast = (message) =>
  _clients.forEach((s) => s.send(JSON.stringify(message)));

app.get("/healthz", (req, res) => res.send("good"));

app.get("/streaming", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders(); // flush the headers to establish SSE with client

  const id = req.query.id;
  if (!_streaming.includes((p) => p.id === id)) {
    _streaming.push({ res, id });
    _streaming.forEach(({ res }) => {
      res.write(`data: ${JSON.stringify(_streaming.map((s) => s.id))}\n\n`);
    });
  }

  // If client closes connection, stop sending events
  res.on("close", () => {
    console.log("client dropped me");
    _streaming = _streaming.filter((p) => p.id !== id);
    _streaming.forEach(({ res }) => {
      res.write(`data: ${JSON.stringify(_streaming.map((s) => s.id))}\n\n`);
    });
    res.end();
  });
});

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

    // const cid = ++_id;
    // const sentAt = new Date().toISOString();
    // await stream(message, (chunk) => {
    //   broadcast({
    //     user: { id: 1000, role: "ai" },
    //     content: { id: cid, fragment: chunk },
    //     sentAt,
    //   });
    // });
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

server.listen(port);

server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (socket) => {
    wss.emit("connection", socket, request);
  });
});
