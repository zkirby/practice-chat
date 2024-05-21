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

const port = process.env.PORT || 5001;
const app = express();

app.use(cors());

const wsServer = new WebSocketServer({ noServer: true });

wsServer.on("connection", (socket) => {
  socket.on("message", async (message) => {
    const prompt = message.toString();
    console.log({ prompt });
    socket.send("[START MESSAGE]");
    await stream(prompt, socket.send.bind(socket));
  });
});

const server = app.listen(port);

server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
