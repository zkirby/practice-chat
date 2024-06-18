import { cns } from "@/display.utils";

import "./MessageBox.css";
import ActiveUsers from "../ActiveUsers";
import { ID } from "../../strings";
import { UIMessage } from "@/pages/Chat/chat.types";

function Message({ id, text }: Pick<UIMessage, "role" | "text" | "id">) {
  return (
    <div className="mb-body__message">
      <div className="mb-body__message-label">{id as unknown as string}</div>
      <div
        className={cns("mb-body__message-content", id === ID ? "me" : "them")}
        style={{
          backgroundColor: "red",
        }}
      >
        {text}
      </div>
    </div>
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
