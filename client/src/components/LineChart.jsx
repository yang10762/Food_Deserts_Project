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
import { useEffect, useState } from "react";

export default function LineChart(props) {
  const getNonEmptyData = (startingData) => {
    let data = startingData.datasets[0].data;

    console.log(data);
    let percentages = [];
    let years = [];
    data.forEach((element) => {
      if (element.percent != "-") {
        percentages.push(element.percent);
        years.push(element.year);
      }
    });
    return {
      labels: years,
      datasets: [
        {
          label: startingData.datasets[0].label,
          data: percentages,
          backgroundColor: "#7FB069",
          borderColor: "#7FB069",
        },
      ],
    };
  };
  return (
    <>
      {/* // <div> */}
      <Line data={getNonEmptyData(props.data)} />
      {/* {!(lineData.toString() === {}.toString()) && <Line data={lineData} />} */}
      {/* </div> */}
    </>
  );
}
