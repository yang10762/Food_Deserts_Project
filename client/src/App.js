import logo from "./logo.svg";
import "./App.css";
import Navigation from "./components/Navigation.jsx";
import React, { useState } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CustomButton from "./components/CustomButton";
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2e1667",
    },
    secondary: {
      main: "#c7d8ed",
    },
  },
  typography: {
    fontFamily: ["Open Sans"],
    h4: {
      fontWeight: 600,
      fontSize: 28,
      lineHeight: "2rem",
    },
    h5: {
      fontWeight: 100,
      lineHeight: "2rem",
    },
  },
});

function App() {
  const [count, setCount] = useState(0);
  return (
    <div className="App">
      {/* <ThemeProvider theme={theme}></ThemeProvider> */}
      {/* <Navigation /> */}
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
