import "./Chat.css";

export default function Chat({ messages, send }) {
  return (
    <div className="chat-body__wrapper">
      <div className="chat-body__message-wrapper">
        {messages.map((m) => (
          <div className={"chat-body__message " + m.role}>{m.content}</div>
        ))}
      </div>

      <form
        className="chat-body__form"
        onSubmit={(e) => {
          e.preventDefault();

          const form = new FormData(e.currentTarget);
          send(form.get("message"));
          e.currentTarget.reset();
        }}
      >
        <input type="text" name="message" />
        <button type="submit">send</button>
      </form>
    </div>
  );
}
