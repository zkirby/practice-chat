import "./App.css";

function App() {
  return (
    <button onClick={() => fetch("http://localhost:5001/healthz?name='carl'")}>
      Hello
    </button>
  );
}

export default App;
