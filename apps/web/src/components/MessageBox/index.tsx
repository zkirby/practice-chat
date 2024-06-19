import { cns } from "@/display.utils";

import "./MessageBox.css";
import ActiveUsers from "../ActiveUsers";
import { UIMessage } from "@/pages/Chat/chat.types";
import { useUser } from "../Authenticate/authenticate.model";

export default function MessageBox({
  ids,
  messages,
  send,
}: {
  ids: string[];
  messages: UIMessage[];
  send: (msg: string) => void;
}) {
  const user = useUser((u) => u.user);
  const sorted = messages.sort((a, b) => (a.sentAt > b.sentAt ? 1 : -1));

  return (
    <div className="mb-body__wrapper">
      <div className="mb-body__header">
        <ActiveUsers ids={ids} />
      </div>

      <div className="mb-body__content">
        <div className="mb-body__message-wrapper">
          {sorted.map((m, key) => (
            <Message
              name={m.id === user?.userId ? user.name : m.id}
              key={key}
              text={m.text}
              isMe={m.id === user?.userId}
            />
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

interface MessageProps {
  name: string;
  text: string;
  isMe: boolean;
}

function Message({ name, text, isMe }: MessageProps) {
  return (
    <div className="mb-body__message">
      <div className="mb-body__message-label">{name}</div>
      <div
        className={cns("mb-body__message-content", isMe ? "me" : "them")}
        style={{
          backgroundColor: "red",
        }}
      >
        {text}
      </div>
    </div>
  );
}
