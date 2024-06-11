import { cns } from "@/display.utils";
import type { UIMessage } from "@/pages/Chat";

import "./MessageBox.css";
import ActiveUsers from "../ActiveUsers";

const colors = [
  { bg: "coral" },
  { bg: "bisque" },
  { bg: "lightskyblue" },
  { bg: "slateblue" },
];
class ColorCache {
  __cache = new Map();
  rnd() {
    return colors[Math.floor(Math.random() * colors.length)].bg;
  }
  color(id: UIMessage["id"]) {
    return this.__cache.get(id) ?? this.__cache.set(id, this.rnd()).get(id);
  }
}

const c = new ColorCache();

function Message({ id, role, text }: Pick<UIMessage, "role" | "text" | "id">) {
  return (
    <pre
      className={cns("mb-body__message ", role)}
      style={{
        backgroundColor: c.color(id),
      }}
    >
      {id as unknown as string}:{text}
    </pre>
  );
}

export default function MessageBox({
  ids,
  messages,
  send,
}: {
  ids: string[];
  messages: UIMessage[];
  send: (msg: string) => void;
}) {
  const sorted = messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1));

  return (
    <div className="mb-body__wrapper">
      <div className="mb-body__header">
        <ActiveUsers ids={ids} />
      </div>

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
