import React from "react";
import Navigation from "../components/Navigation.jsx";

export default function Home() {
  return (
    <div className="Home">
      <Navigation />
      <header className="Home">
        <p>The place to be for</p>
        <h1>understanding food accesibility in the United States</h1>
        <p>The interactive food desert visualizer.</p>
      </header>
    </div>
  );
}
