import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Enable Highcharts 3D
highcharts3d;

const BarChart3D = () => {
  const { background } = useContext(ThemeContext)
  const options = {
    chart: {
      type: "bar", // Use 'bar' for horizontal bars with categories on the Y-axis
      options3d: {
        enabled: true, // Enable 3D rendering
        alpha: 0, // Rotation along the X-axis
        beta: 0, // Rotation along the Y-axis
        depth: 30, // Depth of the bars
      },
      backgroundColor: background?.value == "dark" ? null : 'white',
    },
    title: {
      text: "", // Title for the chart
    },
    yAxis: {
      // Categories on the Y-axis
      categories: [0],
      labels: {
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      title: {
        text: "Amount",
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 0, // Hide grid lines on the Y-axis
    },
    xAxis: {
      categories: ["Sales", "Gross Margins"],

      title: {
        text: "Categories",
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      labels: {
        formatter: function () {
          return `${this.value.toLocaleString()}`; // Format X-axis values as currency with a dollar sign
        },
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 0, // Hide grid lines on the X-axis
    },
    tooltip: {
      pointFormat: "<b>{point.x.toLocaleString()}</b>", // Tooltip format for X values
    },
    plotOptions: {
      bar: {
        depth: 80, // Depth of individual bars
      },
    },
    series: [
      {
        name: "", // Series name
        data: [180000, 60000], // Data for Gross Margin and Sales
        colorByPoint: true, // Use different colors for each bar
        colors: [
          {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 }, // Gradient effect
            stops: [
              [0, "#ff6600"], // Start gradient color
              [1, "#ff3300"], // End gradient color
            ],
          },
          {
            linearGradient: { x1: 0, y1: 0, x2: 1, y2: 0 },
            stops: [
              [0, "#00ccff"], // Start gradient color for the second bar
              [1, "#0066ff"], // End gradient color for the second bar
            ],
          },
        ],
      },
    ],
    legend: {
      enabled: false,
      itemStyle: {
        color: background?.value == "dark" ? " white" : 'dark',
        fontSize: "12px",
      },
    },
  };

  return (
    <div>
      {/* Render Highcharts 3D Bar Chart */}
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default BarChart3D;