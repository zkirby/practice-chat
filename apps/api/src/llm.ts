import path from "path";

let LlamaModel: any, LlamaContext: any, LlamaChatSession: any;

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
      "src/models",
      "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf"
    ),
  });

  const context = new LlamaContext({ model });
  const session = new LlamaChatSession({ context });

  return { context, session };
};

let context: any, session: any;
const stream = async (prompt: any, onNext: any) => {
  if (!session) {
    const llama = await initLlama();
    context = llama.context;
    session = llama.session;
  }
  session.prompt(prompt, {
    onToken(chunk: any) {
      onNext(context.decode(chunk));
    },
  });
};

export default {
  stream,
};
