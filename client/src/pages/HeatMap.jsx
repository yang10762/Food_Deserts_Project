import React from "react";
import Navigation from "../components/Navigation.jsx";

// type Props = {};

export default function Heatmap() {
  return (
    <div className="Heatmap">
      <Navigation />
      <header className="Heatmap">
        <h1>Heatmap here</h1>
        <p>
          View the heatmap below to see the distribution of food deserts across
          the United States
        </p>
      </header>
    </div>
  );
}
