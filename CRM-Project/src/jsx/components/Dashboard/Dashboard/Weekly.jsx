import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import moment from "moment";
import { ThemeContext } from "../../../../../src/context/ThemeContext";
import { axiosOther } from "../../../../http/axios_base_url";

// Initialize the 3D module
highcharts3d;

// const Weekly3DChart = () => {
//   const { background } = useContext(ThemeContext);
//   // The Weekly Sales data with custom colors
//   const dataSource = [
//     { label: "Mon", value: 65, color: "#543e4a" },
//     { label: "Tue", value: 59, color: "#1690d1" },
//     { label: "Wed", value: 80, color: "#e93abf" },
//     { label: "Thu", value: 81, color: "#73936e" },
//     { label: "Fri", value: 56, color: "#0c8ac4" },
//     { label: "Sat", value: 55, color: "#43710d" },
//     { label: "Sun", value: 40, color: "#c1570d" },
//   ];

//   // Mapping the data to Highcharts-compatible format
//   const chartData = dataSource.map((item) => ({
//     y: item.value, // Value for the y-axis
//     color: item.color, // Custom color for the bar
//   }));

//   // Highcharts 3D Bar Chart Options
//   const barChartOptions = {
//     chart: {
//       type: "column", // Change to 'column' for vertical bars (switching axes)
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
//       categories: dataSource.map((item) => item[0]), // Using the 'label' from dataSource for yAxis categories
//       title: {
//         text: "Value", // Y-axis title
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
//         color: background?.value == "dark" ? "white" : "dark",
//         fontSize: "12px",
//       },
//     },
//     xAxis: {
//       categories: dataSource.map((item) => item.label),
//       labels: {
//         style: {
//           color: background?.value == "dark" ? " white" : "dark",
//         },
//       },
//       gridLineWidth: 0, // Hide grid lines on the x-axis
//     },
//     series: [
//       {
//         name: "Week",
//         data: chartData, // Using the mapped data with colors
//         depth: 75,

//         color: "white",
//         labels: {
//           enabled: true,
//           style: {
//             color: background?.value == "dark" ? " white" : "dark",
//           },
//         }, // Depth of each bar in the 3D chart
//       },
//     ],
//   };

//   return (
//     <div style={{ height: "10%", maxWidth: "800px", margin: "0 auto" }}>
//       <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
//     </div>
//   );
// };

// export default Weekly3DChart;




































































import { useState, useEffect } from 'react';
// import { ThemeContext } from './ThemeContext'; // Adjust path as needed
// import axiosOther from './axiosOther'; // Adjust path to your axios instance
// import moment from 'moment';
// import Highcharts from 'highcharts';
// import HC_3D from 'highcharts/highcharts-3d';
// HC_3D(Highcharts);
// import HighchartsReact from 'highcharts-react-official';

const Weekly = () => {
  const { background } = useContext(ThemeContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQueryReceivedFromServer = async () => {
    try {
      setLoading(true);
      let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

      const { data } = await axiosOther.post("QueryReceived", {
        companyid: CompanyUniqueId,
        period: 'week'
      });

      if (data?.status === "success" && data?.data) {
        const transformedData = transformApiData(data.data, 'week');
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
    if (period === 'week' && apiData.week_wise) {
      const currentWeekStart = moment('2025-07-15', 'YYYY-MM-DD'); // Hardcoded start for testing
      const currentWeekEnd = moment('2025-07-21', 'YYYY-MM-DD').endOf('day'); // End of July 21
      // console.log(`📡 Week Range: Start ${currentWeekStart.format('YYYY-MM-DD')}, End ${currentWeekEnd.format('YYYY-MM-DD')}`);

      const dayOrder = { Monday: 0, Tuesday: 1, Wednesday: 2, Thursday: 3, Friday: 4, Saturday: 5, Sunday: 6 };
      dataArray = apiData.week_wise
        .filter(item => {
          const itemDate = moment(`${item.year}-${String(item.month).padStart(2, '0')}-${String(item.date).padStart(2, '0')}`, 'YYYY-MM-DD');
          const isInRange = itemDate.isBetween(currentWeekStart, currentWeekEnd, null, '[]');
          // console.log(`📡 Checking ${itemDate.format('YYYY-MM-DD')} (${item.day}): ${isInRange}`);
          return isInRange;
        })
        .map((item, index) => {
          const itemDate = moment(`${item.year}-${String(item.month).padStart(2, '0')}-${String(item.date).padStart(2, '0')}`, 'YYYY-MM-DD');
          return {
            y: item.count || 0,
            color: colorPalette[index % colorPalette.length],
            name: item.day,
            dayIndex: dayOrder[item.day] || index
          };
        })
        .sort((a, b) => a.dayIndex - b.dayIndex);

      // console.log(`📡 Filtered Data:`, dataArray); 
    } else {
      console.warn("No week_wise data or incorrect period:", apiData);
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
      text: `Week of ${moment().format("MMM DD, YYYY")} Queries`,
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
          No data available for the week.
        </div>
      )}
    </div>
  );
};

export default Weekly;