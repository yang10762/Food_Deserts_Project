import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

export default function LineChart(props) {
  return (
    <>
      {/* // <div> */}
      <LineChart data={props.data} />
      {/* </div> */}
    </>
  );
}
