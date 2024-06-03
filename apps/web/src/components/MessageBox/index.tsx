import { cns } from "@/display.utils";
import type { UIMessage } from "@/pages/Chat";

import "./MessageBox.css";

const _color = new Map();
const colors = [
  { bg: "coral" },
  { bd: "bisque" },
  { bd: "lightskyblue" },
  { bd: "slateblue" },
];

function Message({ id, role, text }: Pick<UIMessage, "role" | "text" | "id">) {
  if (!_color.has(id)) {
    _color.set(id, colors[Math.floor(Math.random() * colors.length)]);
  }

  return (
    <pre
      className={cns("mb-body__message ", role)}
      style={{
        backgroundColor: _color.get(id).bg ?? "blue",
      }}
    >
      {id}:{text}
    </pre>
  );
}

export default function MessageBox({
  messages,
  send,
}: {
  messages: UIMessage[];
  send: (msg: string) => void;
}) {
  const sorted = messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1));

  return (
    <div className="mb-body__wrapper">
      <div className="mb-body__header"></div>

      <div className="mb-body__content">
        <div className="mb-body__message-wrapper">
          {sorted.map((m, key) => (
            <Message id={m.id} key={key} text={m.text} role={m.role} />
          ))}
        </div>

        <form
          className="mb-body__form"
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            send(form.get("message") as string);
            e.currentTarget.reset();
          }}
        >
          <input type="textarea" name="message" />
        </form>
      </div>
    </div>
  );
}
