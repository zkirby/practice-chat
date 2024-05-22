import "./Threads.css";

export default function Threads() {
  return (
    <div className="threads__wrapper">
      <div className="threads__header">
        <div className="threads__header__top">
          <h1>Chat</h1>
          <button type="button">+</button>
        </div>
        <input type="text" placeholder="search..." />
      </div>

      <div className="threads__messages"></div>
    </div>
  );
}
