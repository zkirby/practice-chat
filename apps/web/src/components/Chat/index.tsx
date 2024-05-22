import { Message } from "../../types";
import "./Chat.css";

export default function Chat({
  messages,
  send,
}: {
  messages: Message[];
  send: (msg: string) => void;
}) {
  return (
    <div className="chat-body__wrapper">
      <div className="chat-body__header"></div>

      <div className="chat-body__content">
        <div className="chat-body__message-wrapper">
          {messages.map((m, key) => (
            <div key={key} className={"chat-body__message " + m.role}>
              {m.content}
            </div>
          ))}
        </div>

        <form
          className="chat-body__form"
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.currentTarget);
            send(form.get("message") as string);
            e.currentTarget.reset();
          }}
        >
          <input type="text" name="message" />
        </form>
      </div>
    </div>
  );
}
