import React from "react";
import StackedBardChart from "react-chartjs-2";

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
  return (
    // <>
    <div>
      <StackedBarChart data={props.data} />
    </div>
    // </>
  );
}
