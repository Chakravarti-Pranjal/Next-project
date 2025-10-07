// import React,{ useContext } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import highcharts3d from "highcharts/highcharts-3d";
// import { ThemeContext } from "../../../../../src/context/ThemeContext";

// // Resolving the Highcharts 3D dependency
// highcharts3d;

// // Data source for Pie chart

// function TopFTO() {
//   const { background } = useContext(ThemeContext)

//   const dataSource = [
//     { name: "Memora Travel",y: 5,color: "#2cafff" },
//     { name: "Quest Travel",y: 5,color: "#544fc5" },
//     { name: "VDG VIET",y: 3,color: "#00e272" },
//     { name: "ABC Travel",y: 2,color: "#ff6932" },
//     { name: "Gebeco Gmb",y: 1,color: "#6c8abd" },
//   ];

//   const options = {
//     chart: {
//       type: "pie", // Type of chart
//       options3d: {
//         enabled: true, // Enable 3D effect
//         alpha: 45, // Angle of 3D view
//         beta: 0, // Rotation of 3D view along Y-axis
//         depth: 100, // Depth of the chart
//       },
//       backgroundColor: background?.value == "dark" ? null : 'white',
//     },
//     title: {
//       text: "Top 5 Agent",
//       style: {
//         fontSize: "12px", // Set the font size to smaller value
//         color: background?.value == "dark" ? " white" : 'dark',
//       },
//     },
//     plotOptions: {
//       pie: {
//         innerSize: "40%", // Creates the donut effect (hole in the center)
//         depth: 45, // Depth of the slices
//         dataLabels: {
//           enabled: true,
//           format: "{point.name}", // Format for data labels
//         },
//       },
//     },
//     series: [
//       {
//         name: "Hours per Day",
//         data: dataSource, // Using the custom data with color
//       },
//     ],
//     colors: dataSource.map((item) => item.color), // Setting colors based on the data
//     legend: {
//       enabled: true,
//       itemStyle: {
//         color: background?.value == "dark" ? " white" : 'dark',
//         fontSize: "12px",
//       },
//     },
//   };
//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   );
// }

// export default TopFTO;


























import React, { useContext, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";
import { axiosOther } from "../../../../http/axios_base_url";


highcharts3d;



function TopFTO({ statusType, setStatusType }) { // Accept props from parent
  const { background } = useContext(ThemeContext);
  const [dataSource, setDataSource] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  // Color palette for the chart
  const colorPalette = ["#2cafff", "#544fc5", "#00e272", "#ff6932", "#6c8abd"];
  const CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  // Function to fetch data from API
  const getTopFTOFromServer = async () => {
    try {
      setLoading(true);
      // console.log("Fetching data for statusType:", statusType); // Debug log

      const payload = {
        companyid: CompanyUniqueId,
        statusType: statusType === "confirm" ? "confirm" : "created", // Match API expectations
      };
      // console.log("API Payload:", payload); // Debug log

      const { data } = await axiosOther.post("getTopFTO", payload);
      console.log("API Response:", data); // Debug log

      if (data?.Status === 200 && data?.DataList) {
        const transformedData = data.DataList.map((agent, index) => ({
          name: agent.AgentName,
          y: agent.UsageCount,
          color: colorPalette[index % colorPalette.length],
        }));
        console.log("Transformed Data:", transformedData); // Debug log
        setDataSource(transformedData);
      } else {
        setDataSource([]); // Reset if no DataList
      }
    } catch (error) {
      console.log("top-fto-error", error);
      setDataSource([]); // Reset on error
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when statusType changes or on component mount
  useEffect(() => {
    getTopFTOFromServer();
  }, [statusType]);

  // Show loading state
  if (loading) {
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              type: "pie",
              options3d: { enabled: true, alpha: 45, beta: 0, depth: 100 },
              backgroundColor: background?.value === "dark" ? null : "white",
              accessibility: { enabled: false }, // Suppress Highcharts accessibility warning
            },
            title: {
              text: "Top 5 Agent - Loading...",
              style: {
                fontSize: "12px",
                color: background?.value === "dark" ? "white" : "dark",
              },
            },
            plotOptions: {
              pie: { innerSize: "40%", depth: 45, size: "80%" },
            },
            series: [{ data: [] }],
            credits: { enabled: false },
          }}
        />
      </div>
    );
  }

  const options = {
    chart: {
      type: "pie",
      options3d: { enabled: true, alpha: 45, beta: 0, depth: 100 },
      backgroundColor: background?.value === "dark" ? null : "white",
      accessibility: { enabled: false }, // Suppress Highcharts accessibility warning
    },
    title: {
      text: `Top 5 Agent - ${statusType === "confirm" ? "Confirmed" : "Received"}`,
      style: {
        fontSize: "12px",
        color: background?.value === "dark" ? "white" : "dark",
      },
    },
    plotOptions: {
      pie: {
        innerSize: "40%",
        depth: 45,
        size: "60%",
        dataLabels: { enabled: true, format: "{point.name}" },
      },
    },
    series: [
      {
        name: "Usage Count",
        data: dataSource,
      },
    ],
    colors: dataSource.map((item) => item.color),
    legend: {
      enabled: true,
      itemStyle: {
        color: background?.value === "dark" ? "white" : "dark",
        fontSize: "12px",
      },
    },
    credits: { enabled: false },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default TopFTO;