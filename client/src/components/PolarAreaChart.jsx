import React from "react";
import { PolarArea } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Container } from "shards-react";

export default function PolarAreaChart(props) {
  return (
    <Container maxWidth="sm">
      <PolarArea data={props.data} />
    </Container>
  );
}
