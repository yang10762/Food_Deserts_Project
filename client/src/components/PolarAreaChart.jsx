import React from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Container } from "shards-react";

export default function PolarAreaChart(props) {
  return (
    <div
      className="PolarArea"
      style={{ maxHeight: "50%", display: "flex", justifyContent: "center" }}
    >
      <PolarArea data={props.data} />
    </div>
  );
}
