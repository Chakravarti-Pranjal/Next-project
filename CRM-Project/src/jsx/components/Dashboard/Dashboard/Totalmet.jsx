import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";


import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Resolving the Highcharts 3D dependency
highcharts3d;



const TaskCompletionChart = () => {

  const { background } = useContext(ThemeContext)
  const pieChartOptions = {
    chart: {
      type: "pie", // Pie chart type
      options3d: {
        enabled: true, // Enable 3D effect
        alpha: 45, // Tilt angle
        beta: 0, // Rotation angle
        depth: 100, // Depth of the pie
      },
      backgroundColor: background?.value == "dark" ? null : 'white',
    },
    title: {
      text: "Queries Turnaround Time",
      style: {
        color: background?.value == "dark" ? " white" : 'dark',
        fontSize: "12px", // Optional: Adjust font size
      },
    },
    plotOptions: {
      pie: {
        innerSize: 100, // Space inside the pie (donut effect)
        depth: 45, // Depth of the pie
        dataLabels: {
          enabled: true, // Enable labels
          format: "{point.name}: {point.percentage:.1f}%", // Format for data labels
        },
      },
    },
    legend: {
      enabled: true,
      itemStyle: {
        color: background?.value == "dark" ? " white" : 'dark',
        fontSize: "12px",
      },
    },
    series: [
      {
        name: "Completion Status",
        data: [
          { name: "Ontime", y: 60, color: "#1690d1" }, // Custom color for Ontime
          { name: "Before Time", y: 25, color: "#543e4a" }, // Custom color for Before Time
          { name: "Delayed", y: 15, color: "#e93abf" }, // Custom color for Delayed
        ],
      },
    ],
  };
  return (
    <div>
      {/* Highcharts 3D Pie Chart */}
      <HighchartsReact highcharts={Highcharts} options={pieChartOptions} />
    </div>
  );
};

export default TaskCompletionChart;
