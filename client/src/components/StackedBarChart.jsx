import React from "react";
// import StackedBarChart from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// import faker from "faker";

export default function StackedBarChart(props) {
  console.log("Props", props);

  const options = {
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      },
    },
  };
  return (
    // <>
    // <div>
    <Bar options={options} data={props.data} />
    // </div>
    // </>
  );
}
