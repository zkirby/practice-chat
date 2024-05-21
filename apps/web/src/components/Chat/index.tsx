export default function Chat({ messages, send }) {
  return (
    <div>
      {messages.map((m) => (
        <div>{m}</div>
      ))}

      <form
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
