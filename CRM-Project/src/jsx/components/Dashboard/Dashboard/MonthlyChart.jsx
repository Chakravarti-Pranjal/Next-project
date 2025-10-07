// import React, { useEffect, useContext } from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import moment from "moment";
import { axiosOther } from "../../../../http/axios_base_url";

import { ThemeContext } from "../../../../../src/context/ThemeContext";

// // Resolving the Highcharts 3D dependency
highcharts3d;

// // Data source for Monthly Sales with custom colors

// const MonthlySalesChart = () => {
//   const { background } = useContext(ThemeContext);

//   const dataSource = [
//     { label: "01", value: 65, color: "#543e4a" },
//     { label: "02", value: 59, color: "#1690d1" },
//     { label: "03", value: 80, color: "#e93abf" },
//     { label: "04", value: 81, color: "#31bdac" },
//     { label: "05", value: 56, color: "#0c8ac4" },
//     { label: "06", value: 55, color: "#43710d" },
//     { label: "07", value: 40, color: "#c1570d" },
//     { label: "08", value: 72, color: "#66a4a3" },
//     { label: "09", value: 90, color: "#da836b" },
//     { label: "10", value: 56, color: "#79eaf2" },
//     { label: "11", value: 72, color: "#31bdac" },
//     { label: "12", value: 63, color: "#1d631a" },
//     { label: "13", value: 75, color: "#543e4a" },
//     { label: "14", value: 80, color: "#1690d1" },
//     { label: "15", value: 65, color: "#e93abf" },
//     { label: "16", value: 67, color: "#e93abf" },
//     { label: "17", value: 88, color: "#0c8ac4" },
//     { label: "18", value: 77, color: "#43710d" },
//     { label: "19", value: 70, color: "#c1570d" },
//     { label: "20", value: 85, color: "#66a4a3" },
//     { label: "21", value: 92, color: "#da836b" },
//     { label: "22", value: 78, color: "#79eaf2" },
//     { label: "23", value: 67, color: "#31bdac" },
//     { label: "24", value: 82, color: "#1d631a" },
//     { label: "25", value: 90, color: "#543e4a" },
//     { label: "26", value: 64, color: "#1690d1" },
//     { label: "27", value: 88, color: "#e93abf" },
//     { label: "28", value: 91, color: "#31bdac" },
//     { label: "29", value: 55, color: "#0c8ac4" },
//     { label: "30", value: 79, color: "#43710d" },
//     { label: "31", value: 68, color: "#FF5733" },
//   ];

//   // Mapping the data for Highcharts
//   const chartData = dataSource.map((item) => ({
//     y: item.value, // Value for the y-axis
//     color: item.color, // Custom color for the bar
//   }));

//   // Highcharts options for 3D column chart
//   const barChartOptions = {
//     chart: {
//       type: "column", // Change to 'column' for vertical bars
//       options3d: {
//         enabled: true, // Enable 3D rendering
//         alpha: 0, // Rotation angle along the x-axis
//         beta: 0, // Rotation angle along the y-axis
//         depth: 50, // Depth of the bars
//       },
//       backgroundColor: background?.value == "dark" ? null : "white",
//     },
//     title: {
//       text: `${moment().format("YYYY")} Queries`,
//       style: {
//         fontSize: "12px", // Set the font size to smaller value
//         color: background?.value == "dark" ? " white" : "dark",
//       }, // Title is removed, no text displayed
//     },
//     yAxis: {
//       categories: dataSource.map((item) => item.label), // Using the 'label' from dataSource for yAxis categories
//       title: {
//         text: "Value", // Y-axis label
//         style: {
//           color: background?.value == "dark" ? " white" : "dark",
//         },
//       },
//       labels: {
//         style: {
//           color: background?.value == "dark" ? " white" : "dark",
//         },
//       },
//       gridLineWidth: 0, // Hide grid lines on the y-axis
//     },
//     legend: {
//       enabled: true,
//       itemStyle: {
//         color: background?.value == "dark" ? " white" : "dark",
//         fontSize: "12px",
//       },
//     },
//     xAxis: {
//       categories: dataSource.map((item) => item.label), // Same label for X-axis as Y-axis
//       title: {
//         text: "", // X-axis label
//       },
//       labels: {
//         style: {
//           color: background?.value == "dark" ? " white" : "dark",
//         },
//       },
//       gridLineWidth: 0, // Hide grid lines on the x-axis
//     },
//     series: [
//       {
//         name: "Month",
//         data: chartData, // Using the mapped data with colors
//         depth: 35,
//         color: background?.value == "dark" ? " white" : "dark",
//       },
//     ],
//   };
//   return (
//     <div style={{ height: "10%", maxWidth: "800px", margin: "0 auto" }}>
//       {/* Highcharts 3D Column Chart */}
//       <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
//     </div>
//   );
// };

// export default MonthlySalesChart;

import { useState, useEffect, useContext } from 'react';
// import { ThemeContext } from './ThemeContext'; // Adjust path as needed
// import axiosOther from './axiosOther'; // Adjust path to your axios instance
// import moment from 'moment';
// import Highcharts from 'highcharts';
// import HC_3D from 'highcharts/highcharts-3d';
// HC_3D(Highcharts);
// import HighchartsReact from 'highcharts-react-official';

const Monthly = () => {
  const { background } = useContext(ThemeContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQueryReceivedFromServer = async () => {
    try {
      setLoading(true);
      let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

      const { data } = await axiosOther.post("QueryReceived", {
        companyid: CompanyUniqueId,
        period: 'month'
      });

      if (data?.status === "success" && data?.data) {
        const transformedData = transformApiData(data.data, 'month');
        setChartData(transformedData);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.log("query-received-error", error);
      setChartData([]);
    } finally {
      setLoading(false);
    }
  };
  const transformApiData = (apiData, period) => {
    let dataArray = [];
    if (period === 'month' && apiData.month_wise) {
      const currentYear = moment().year();
      const currentMonth = moment().month() + 1; // +1 because moment months are 0-indexed
      dataArray = apiData.month_wise
        .filter(item => parseInt(item.year) === currentYear && parseInt(item.month) === currentMonth)
        .map((item, index) => ({
          y: item.count || 0,
          color: colorPalette[index % colorPalette.length],
          name: item.date || `Day ${index + 1}`,
          day: item.date
        })).sort((a, b) => parseInt(a.day) - parseInt(b.day));
    } else {
      console.warn("No month_wise data or incorrect period:", apiData);
    }
    return dataArray;
  };
  const colorPalette = [
    "#543e4a", "#1690d1", "#e93abf", "#e93abf", "#0c8ac4", "#43710d",
    "#c1570d", "#66a4a3", "#da836b", "#79eaf2", "#31bdac", "#1d631a",
    "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3",
    "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24",
    "#0abde3", "#c44569", "#40407a", "#706fd3", "#f368e0", "#3742fa"
  ];

  useEffect(() => {
    getQueryReceivedFromServer();
  }, []);

  const barChartOptions = {
    chart: {
      type: "column",
      options3d: {
        enabled: true,
        alpha: 5,  // Tilt on X-axis
        beta: 20,   // Rotate on Y-axis
        depth: 80,  // Bar thickness
        viewDistance: 25, // Perspective depth
        fitToPlot: false
      },
      backgroundColor: background?.value === "dark" ? null : "white",
    },
    title: {
      text: `${moment().format("MMMM YYYY")} Queries by Day`,
      style: {
        fontSize: "14px",
        color: background?.value === "dark" ? "white" : "dark",
      },
    },
    yAxis: {
      title: {
        text: "Query Count",
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      labels: {
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 1,
      gridLineColor: background?.value === "dark" ? "#444" : "#e6e6e6",
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      categories: chartData.map(item => item.name),
      labels: {
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 0,
    },
    series: [
      {
        name: "Queries",
        data: chartData,
        depth: 75,
        showInLegend: false,
      },
    ],
    plotOptions: {
      column: {
        colorByPoint: true,
        dataLabels: {
          enabled: true,
          style: {
            color: background?.value === "dark" ? "white" : "dark",
            fontSize: "10px"
          }
        }
      },
    },
    tooltip: {
      backgroundColor: background?.value === "dark" ? "#333" : "white",
      style: {
        color: background?.value === "dark" ? "white" : "dark",
      },
      formatter: function () {
        return `<b>${this.point.name}</b><br/>Queries: <b>${this.y}</b>`;
      }
    }
  };

  return (
    <div style={{ height: "100%", maxWidth: "800px", margin: "0 auto" }}>
      {loading && (
        <div style={{
          textAlign: "center",
          color: background?.value === "dark" ? "white" : "dark",
          padding: "40px",
          fontSize: "16px"
        }}>
          Loading chart data...
        </div>
      )}
      {!loading && chartData.length > 0 && (
        <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
      )}
      {!loading && chartData.length === 0 && (
        <div style={{
          textAlign: "center",
          color: background?.value === "dark" ? "white" : "dark",
          padding: "40px",
          fontSize: "16px"
        }}>
          No data available for the month.
        </div>
      )}
    </div>
  );
};

export default Monthly;