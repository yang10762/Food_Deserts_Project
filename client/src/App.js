import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation.jsx";
import React, { useState } from "react";

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      <Navigation />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>The place to be for</p>
        <h1>understanding food accesibility in the United States</h1>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>The interactive food desert visualizer.</p>
      </header>
      <button onClick={() => setCount(count + 1)}>plus 1</button>
      <button onClick={() => setCount(count - 1)}>minus 1</button>
      <div>{count}</div>
    </div>
  );
}

export default App;
