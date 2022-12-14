import React, { useRef, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function DoughnutChart(props) {
  return (
    <div className="DoughnutChart" style={{ minHeight: "100%" }}>
      <Doughnut data={props.data} />
    </div>
  );
}
