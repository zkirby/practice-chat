import path from "path";
import { LlamaModel, LlamaContext, LlamaChatSession } from "node-llama-cpp";

// const __dirname = path.dirname(fileURLToPath(import.meta.url));

const model = new LlamaModel({
  modelPath: path.join(
    path.resolve(),
    "models",
    "capybarahermes-2.5-mistral-7b.Q4_K_M.gguf"
  ),
});

const context = new LlamaContext({ model });
const session = new LlamaChatSession({ context });

const stream = async (prompt: string, onToken: any) =>
  session.prompt(prompt, {
    onToken(chunk) {
      onToken(context.decode(chunk));
    },
  });

export default {
  stream,
};
