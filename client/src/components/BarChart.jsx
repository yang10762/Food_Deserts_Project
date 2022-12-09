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

export default function BarChart(props) {
  return <Bar data={props.data} />;
}
