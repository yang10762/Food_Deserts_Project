import React, { useRef, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

export default function DoughnutChart(props) {
  //   const bottomRef = useRef(null);
  //   useEffect(() => {
  //     // 👇️ scroll to bottom
  //     bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  //   }, []);
  //   console.log("props", props);
  return (
    <div className="DoughnutChart" style={{ minHeight: "100%" }}>
      {/* <Doughnut data={props.data} ref={bottomRef} /> */}
      <Doughnut data={props.data} />
    </div>
  );
}
