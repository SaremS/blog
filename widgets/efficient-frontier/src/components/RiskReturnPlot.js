import { Chart } from "react-google-charts";
import * as React from "react";

export default function RiskReturnPlot({ data }) {
  var chartData = [[{type: "number", id:"\u03C3"}, {type: "number", id:"\u03BC"}, {type:"string", role:"tooltip", p: {'html': true}}]];

  if (data.length == 0) {
    chartData.push([0., 0.,"0."]);
  }

  for (let i = 0; i < data.length; i++) {
    chartData.push([data[i][0], data[i][1], data[i][2]]);
  }

  const options = {
    title: "Risk-Return profile",
    tooltip: {isHtml: true},
    curveType: "function",
    legend: { position: "none" },
    animation: {
      duration: 500,
      easing: "out",
      startup: true,
    },

    chartArea: {
      width: "80%",
      height: "80%",
    },
  };
  return (
    <Chart
      chartType="LineChart"
      height="22.5em"
      data={chartData}
      options={options}
    />
  );
}
