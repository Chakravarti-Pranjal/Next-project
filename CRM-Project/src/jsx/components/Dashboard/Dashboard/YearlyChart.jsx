import React, { useContext, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import moment from "moment";
import { axiosOther } from "../../../../http/axios_base_url";
import {  useEffect} from "react";

import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Initialize the 3D module
highcharts3d;

// const BarChart = () => {
//   const { background } = useContext(ThemeContext);
//   // The FusionCharts dataSource converted into Highcharts format with colors
//   const dataSource = [
//     { label: "Jan", value: 65, color: "#543e4a" }, // Custom color for January
//     { label: "Feb", value: 59, color: "#1690d1" }, // Custom color for February
//     { label: "Mar", value: 80, color: "#e93abf" }, // Custom color for March
//     { label: "Apr", value: 81, color: "#e93abf" }, // Custom color for April
//     { label: "May", value: 56, color: "#0c8ac4" }, // Custom color for May
//     { label: "Jun", value: 55, color: "#43710d" }, // Custom color for June
//     { label: "Jul", value: 40, color: "#c1570d" }, // Custom color for July
//     { label: "Aug", value: 72, color: "#66a4a3" }, // Custom color for August
//     { label: "Sep", value: 90, color: "#da836b" }, // Custom color for September
//     { label: "Oct", value: 56, color: "#79eaf2" }, // Custom color for October
//     { label: "Nov", value: 72, color: "#31bdac" }, // Custom color for November
//     { label: "Dec", value: 63, color: "#1d631a" }, // Custom color for December
//   ];

//   // Mapping the FusionCharts-style data into Highcharts-compatible format
//   const chartData = dataSource.map((item) => ({
//     y: item.value, // Value for the y-axis
//     color: item.color, // Custom color for the bar
//   }));

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
//       },
//     },
//     yAxis: {
//       categories: dataSource.map((item) => item[0]), // Using the 'label' from dataSource for yAxis categories
//       title: {
//         text: "Value",
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
//         name: "year",
//         data: chartData, // Using the mapped data with colors
//         depth: 75,
//         color: background?.value == "dark" ? " white" : "dark",

//         // Depth of each bar in the 3D chart
//       },
//     ],
//   };

//   return (
//     <div style={{ height: "10%", maxWidth: "800px", margin: "0 auto" }}>
//       <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
//     </div>
//   );
// };

// export default BarChart;









// const BarChart = () => {
//   const { background } = useContext(ThemeContext);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedPeriod, setSelectedPeriod] = useState('year'); // 'year', 'month', 'week'

//   // Color palette for different bars
//   const colorPalette = [
//     "#543e4a", "#1690d1", "#e93abf", "#e93abf", "#0c8ac4", "#43710d",
//     "#c1570d", "#66a4a3", "#da836b", "#79eaf2", "#31bdac", "#1d631a",
//     "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3",
//     "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24",
//     "#0abde3", "#c44569", "#40407a", "#706fd3", "#f368e0", "#3742fa"
//   ];

//   // Month names for mapping
//   const monthNames = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

  // Function to get queries data from server
//   const getQueryReceivedFromServer = async (period = 'year') => {
//     try {
//       setLoading(true);
//       let CompanyUniqueId = JSON.parse(
//         localStorage.getItem("token")
//       )?.companyKey;
      
//       const { data } = await axiosOther.post("QueryReceived", {
//         companyid: CompanyUniqueId,
//         period: period
//       });
      
//       if (data?.status === "success" && data?.data) {
//         const transformedData = transformApiData(data.data, period);
//         setChartData(transformedData);
//       } else {
//         setChartData([]);
//       }
//     } catch (error) {
//       console.log("query-received-error", error);
//       setChartData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Transform API data based on period
//   const transformApiData = (apiData, period) => {
//     let dataArray = [];
    
//     switch (period) {
//       case 'year':
//         if (apiData.year_wise) {
//           // Group by month and sum counts
//           const monthlyData = {};
//           apiData.year_wise.forEach(item => {
//             const monthKey = item.month;
//             if (!monthlyData[monthKey]) {
//               monthlyData[monthKey] = 0;
//             }
//             monthlyData[monthKey] += item.count || 0;
//           });
          
//           // Convert to array with proper month names
//           dataArray = Object.keys(monthlyData).map((month, index) => ({
//             y: monthlyData[month],
//             color: colorPalette[index % colorPalette.length],
//             name: monthNames[parseInt(month) - 1] || `Month ${month}`,
//             month: month
//           }));
          
//           // Sort by month number
//           dataArray.sort((a, b) => parseInt(a.month) - parseInt(b.month));
//         }
//         break;
        
//       case 'month':
//         if (apiData.month_wise) {
//           dataArray = apiData.month_wise.map((item, index) => ({
//             y: item.count || 0,
//             color: colorPalette[index % colorPalette.length],
//             name: item.day || `Day ${index + 1}`,
//             day: item.day
//           }));
          
//           // Sort by day if available
//           if (dataArray[0]?.day) {
//             dataArray.sort((a, b) => parseInt(a.day) - parseInt(b.day));
//           }
//         }
//         break;
        
//       case 'week':
//         if (apiData.week_wise) {
//           const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
//           dataArray = apiData.week_wise.map((item, index) => ({
//             y: item.count || 0,
//             color: colorPalette[index % colorPalette.length],
//             name: item.day_name || dayNames[index] || `Day ${index + 1}`,
//             dayIndex: item.day_index || index
//           }));
          
//           // Sort by day index if available
//           if (dataArray[0]?.dayIndex !== undefined) {
//             dataArray.sort((a, b) => a.dayIndex - b.dayIndex);
//           }
//         }
//         break;
        
//       default:
//         dataArray = [];
//     }
    
//     return dataArray;
//   };

//   // Fetch data on component mount and when period changes
//   useEffect(() => {
//     getQueryReceivedFromServer(selectedPeriod);
//   }, [selectedPeriod]);

//   // Generate categories based on selected period and data
//   const getCategories = () => {
//     if (chartData.length === 0) return [];
    
//     switch (selectedPeriod) {
//       case 'year':
//         // Use the actual month names from the data, or fallback to all months
//         if (chartData.length > 0) {
//           return chartData.map(item => item.name);
//         }
//         return monthNames;
        
//       case 'month':
//         // Generate day numbers based on data or 1-31
//         if (chartData.length > 0 && chartData[0].day) {
//           return chartData.map(item => item.day);
//         }
//         return chartData.map((_, index) => (index + 1).toString());
        
//       case 'week':
//         if (chartData.length > 0) {
//           return chartData.map(item => item.name);
//         }
//         return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        
//       default:
//         return chartData.map((item, index) => item.name || `Period ${index + 1}`);
//     }
//   };

//   // Get chart title based on selected period
//   const getChartTitle = () => {
//     switch (selectedPeriod) {
//       case 'year':
//         return `${moment().format("YYYY")} Queries by Month`;
//       case 'month':
//         return `${moment().format("MMMM YYYY")} Queries by Day`;
//       case 'week':
//         return `Week of ${moment().format("MMM DD, YYYY")} Queries`;
//       default:
//         return "Query Data";
//     }
//   };

//   const barChartOptions = {
//     chart: {
//       type: "column",
//       options3d: {
//         enabled: true,
//         alpha: 0,
//         beta: 0,
//         depth: 50,
//       },
//       backgroundColor: background?.value === "dark" ? null : "white",
//     },
//     title: {
//       text: getChartTitle(),
//       style: {
//         fontSize: "14px",
//         color: background?.value === "dark" ? "white" : "dark",
//       },
//     },
//     yAxis: {
//       title: {
//         text: "Query Count",
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 1,
//       gridLineColor: background?.value === "dark" ? "#444" : "#e6e6e6",
//     },
//     legend: {
//       enabled: false, // Disable legend since we're using colorByPoint
//     },
//     xAxis: {
//       categories: getCategories(),
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 0,
//     },
//     series: [
//       {
//         name: "Queries",
//         data: chartData,
//         depth: 75,
//         showInLegend: false,
//       },
//     ],
//     plotOptions: {
//       column: {
//         colorByPoint: true,
//         dataLabels: {
//           enabled: true,
//           style: {
//             color: background?.value === "dark" ? "white" : "dark",
//             fontSize: "10px"
//           }
//         }
//       },
//     },
//     tooltip: {
//       backgroundColor: background?.value === "dark" ? "#333" : "white",
//       style: {
//         color: background?.value === "dark" ? "white" : "dark",
//       },
//       formatter: function() {
//         return `<b>${this.point.name}</b><br/>Queries: <b>${this.y}</b>`;
//       }
//     }
//   };

//   return (
//     <div style={{ height: "100%", maxWidth: "800px", margin: "0 auto" }}>
//       {/* Period Selection Controls */}
//       <div style={{ 
//         marginBottom: "20px", 
//         textAlign: "center",
//         color: background?.value === "dark" ? "white" : "dark"
//       }}>
//         <button
//           onClick={() => setSelectedPeriod('year')}
//           style={{
//             margin: "0 5px",
//             padding: "8px 16px",
//             backgroundColor: selectedPeriod === 'year' ? '#1690d1' : 'transparent',
//             color: selectedPeriod === 'year' ? 'white' : (background?.value === "dark" ? "white" : "dark"),
//             border: `1px solid ${selectedPeriod === 'year' ? '#1690d1' : (background?.value === "dark" ? "white" : "dark")}`,
//             // borderRadius: "4px",
//             cursor: "pointer",
//             fontWeight: selectedPeriod === 'year' ? 'bold' : 'normal'
//           }}
//           disabled={loading}
//         >
//           Year
//         </button>
//         <button
//           onClick={() => setSelectedPeriod('month')}
//           style={{
//             margin: "0 5px",
//             padding: "8px 16px",
//             backgroundColor: selectedPeriod === 'month' ? '#1690d1' : 'transparent',
//             color: selectedPeriod === 'month' ? 'white' : (background?.value === "dark" ? "white" : "dark"),
//             border: `1px solid ${selectedPeriod === 'month' ? '#1690d1' : (background?.value === "dark" ? "white" : "dark")}`,
//             // borderRadius: "4px",
//             cursor: "pointer",
//             fontWeight: selectedPeriod === 'month' ? 'bold' : 'normal'
//           }}
//           disabled={loading}
//         >
//           Month
//         </button>
//         <button
//           onClick={() => setSelectedPeriod('week')}
//           style={{
//             margin: "0 5px",
//             padding: "8px 16px",
//             backgroundColor: selectedPeriod === 'week' ? '#1690d1' : 'transparent',
//             color: selectedPeriod === 'week' ? 'white' : (background?.value === "dark" ? "white" : "dark"),
//             border: `1px solid ${selectedPeriod === 'week' ? '#1690d1' : (background?.value === "dark" ? "white" : "dark")}`,
//             borderRadius: "4px",
//             cursor: "pointer",
//             fontWeight: selectedPeriod === 'week' ? 'bold' : 'normal'
//           }}
//           disabled={loading}
//         >
//           Week
//         </button>
//       </div>

//       {/* Loading State */}
//       {loading && (
//         <div style={{ 
//           textAlign: "center", 
//           color: background?.value === "dark" ? "white" : "dark",
//           padding: "40px",
//           fontSize: "16px"
//         }}>
//           <div>Loading chart data...</div>
//         </div>
//       )}

//       {/* Chart */}
//       {!loading && chartData.length > 0 && (
//         <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
//       )}

//       {/* No Data State */}
//       {!loading && chartData.length === 0 && (
//         <div style={{ 
//           textAlign: "center", 
//           color: background?.value === "dark" ? "white" : "dark",
//           padding: "40px",
//           fontSize: "16px"
//         }}>
//           No data available for the selected period.
//         </div>
//       )}
//     </div>
//   );
// };

// export default BarChart;































// const Yearly = () => {
//   const { background } = useContext(ThemeContext);
//   const [chartData, setChartData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const getQueryReceivedFromServer = async () => {
//     try {
//       setLoading(true);
//       let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

//       const { data } = await axiosOther.post("QueryReceived", {
//         companyid: CompanyUniqueId,
//         period: 'year'
//       });

//       if (data?.status === "success" && data?.data) {
//         const transformedData = transformApiData(data.data, 'year');
//         setChartData(transformedData);
//       } else {
//         setChartData([]);
//       }
//     } catch (error) {
//       console.log("query-received-error", error);
//       setChartData([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const transformApiData = (apiData, period) => {
//     let dataArray = [];
//     if (period === 'year' && apiData.year_wise) {
//       const monthlyData = {};
//       apiData.year_wise.forEach(item => {
//         const monthKey = item.month;
//         if (!monthlyData[monthKey]) {
//           monthlyData[monthKey] = 0;
//         }
//         monthlyData[monthKey] += item.count || 0;
//       });

//       dataArray = Object.keys(monthlyData).map((month, index) => ({
//         y: monthlyData[month],
//         color: colorPalette[index % colorPalette.length],
//         name: monthNames[parseInt(month) - 1] || `Month ${month}`,
//         month: month
//       })).sort((a, b) => parseInt(a.month) - parseInt(b.month));
//     }
//     return dataArray;
//   };

//   const colorPalette = [
//     "#543e4a", "#1690d1", "#e93abf", "#e93abf", "#0c8ac4", "#43710d",
//     "#c1570d", "#66a4a3", "#da836b", "#79eaf2", "#31bdac", "#1d631a",
//     "#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3",
//     "#54a0ff", "#5f27cd", "#00d2d3", "#ff9f43", "#10ac84", "#ee5a24",
//     "#0abde3", "#c44569", "#40407a", "#706fd3", "#f368e0", "#3742fa"
//   ];

//   const monthNames = [
//     "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//     "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
//   ];

//   useEffect(() => {
//     getQueryReceivedFromServer();
//   }, []);

//   const barChartOptions = {
//     chart: {
//       type: "column",
//       options3d: {
//         enabled: true,
//         alpha: 0,
//         beta: 0,
//         depth: 50,
//       },
//       backgroundColor: background?.value === "dark" ? null : "white",
//     },
//     title: {
//       text: `${moment().format("YYYY")} Queries by Month`,
//       style: {
//         fontSize: "14px",
//         color: background?.value === "dark" ? "white" : "dark",
//       },
//     },
//     yAxis: {
//       title: {
//         text: "Query Count",
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 1,
//       gridLineColor: background?.value === "dark" ? "#444" : "#e6e6e6",
//     },
//     legend: {
//       enabled: false,
//     },
//     xAxis: {
//       categories: chartData.map(item => item.name),
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 0,
//     },
//     series: [
//       {
//         name: "Queries",
//         data: chartData,
//         depth: 75,
//         showInLegend: false,
//       },
//     ],
//     plotOptions: {
//       column: {
//         colorByPoint: true,
//         dataLabels: {
//           enabled: true,
//           style: {
//             color: background?.value === "dark" ? "white" : "dark",
//             fontSize: "10px"
//           }
//         }
//       },
//     },
//     tooltip: {
//       backgroundColor: background?.value === "dark" ? "#333" : "white",
//       style: {
//         color: background?.value === "dark" ? "white" : "dark",
//       },
//       formatter: function() {
//         return `<b>${this.point.name}</b><br/>Queries: <b>${this.y}</b>`;
//       }
//     }
//   };

//   return (
//     <div style={{ height: "100%", maxWidth: "800px", margin: "0 auto" }}>
//       {loading && (
//         <div style={{ 
//           textAlign: "center", 
//           color: background?.value === "dark" ? "white" : "dark",
//           padding: "40px",
//           fontSize: "16px"
//         }}>
//           Loading chart data...
//         </div>
//       )}
//       {!loading && chartData.length > 0 && (
//         <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
//       )}
//       {!loading && chartData.length === 0 && (
//         <div style={{ 
//           textAlign: "center", 
//           color: background?.value === "dark" ? "white" : "dark",
//           padding: "40px",
//           fontSize: "16px"
//         }}>
//           No data available for the year.
//         </div>
//       )}
//     </div>
//   );
// };

// export default Yearly;




































const Yearly = () => {
  const { background } = useContext(ThemeContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const getQueryReceivedFromServer = async () => {
    try {
      setLoading(true);
      let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

      const { data } = await axiosOther.post("QueryReceived", {
        companyid: CompanyUniqueId,
        period: 'year'
      });

      if (data?.status === "success" && data?.data) {
        const transformedData = transformApiData(data.data, 'year');
        // console.log("Transformed Data:", transformedData); // Debug log
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
    if (period === 'year') {
      const monthlyData = {};
      // Initialize all 12 months with 0
      for (let month = 1; month <= 12; month++) {
        monthlyData[month] = 0;
      }
      // Aggregate API data
      if (apiData?.year_wise) {
        apiData.year_wise.forEach(item => {
          const monthKey = parseInt(item.month);
          if (monthlyData[monthKey] !== undefined) {
            monthlyData[monthKey] += item.count || 0;
          }
        });
        // console.log("Monthly Data:", monthlyData); // Debug log
      }
      // Map to chart data
      dataArray = Object.keys(monthlyData).map((month, index) => ({
        y: monthlyData[month],
        color: colorPalette[index % colorPalette.length],
        name: monthNames[parseInt(month) - 1] || `Month ${month}`,
        month: month
      })).sort((a, b) => parseInt(a.month) - parseInt(b.month));
    }
    return dataArray;
  };

  const colorPalette = [
   
  "#543e4a", "#1690d1", "#e93abf", "#e93abf", "#0c8ac4", 
  "#43710d", "#c1570d", "#66a4a3", "#da836b", "#79eaf2", 
  "#31bdac", "#1d631a"

  ];

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  useEffect(() => {
    getQueryReceivedFromServer();
  }, []);

  const barChartOptions = {
    chart: {
      type: "column", // Bar graph
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
      text: `${moment().format("YYYY")} Queries by Month`,
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
      categories: monthNames, // Explicitly set all 12 months
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
        data: chartData.map(item => item.y), // Ensure y values are used
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
      formatter: function() {
        return `<b>${monthNames[this.point.index]}</b><br/>Queries: <b>${this.y}</b>`;
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
          No data available for the year.
        </div>
      )}
    </div>
  );
};

export default Yearly;
