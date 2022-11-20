import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  flex-direction: row;
  justify-items: center;
  justify-content: space-evenly;
  background-color: #ebe9e9;
`;

export default function Navigation() {
  return (
    <Bar>
      <a className="App-link" href="/" rel="noopener noreferrer">
        Home
      </a>
      <a className="App-link" href="/about" rel="noopener noreferrer">
        About
      </a>
      <a className="App-link" href="/states" rel="noopener noreferrer">
        States
      </a>
      <a className="App-link" href="/counties" rel="noopener noreferrer">
        Counties
      </a>
      <button>Find Deserts</button>
    </Bar>
  );
}
