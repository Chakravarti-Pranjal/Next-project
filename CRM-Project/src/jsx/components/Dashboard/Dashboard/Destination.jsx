// import React, { useContext } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import highcharts3d from "highcharts/highcharts-3d";
// import { ThemeContext } from "../../../../../src/context/ThemeContext";

// highcharts3d;

// const DestinationChart = () => {
//   const { background } = useContext(ThemeContext);

//   const dataSource = [
//     { label: "Delhi", destinationQuery: 500, confirmationQuery: 300 },
//     { label: "Mumbai", destinationQuery: 400, confirmationQuery: 250 },
//     { label: "Chennai", destinationQuery: 350, confirmationQuery: 200 },
//     { label: "Bangalore", destinationQuery: 300, confirmationQuery: 180 },
//     { label: "Hyderabad", destinationQuery: 270, confirmationQuery: 150 },
//     { label: "Ahmedabad", destinationQuery: 250, confirmationQuery: 130 },
//     { label: "Kolkata", destinationQuery: 220, confirmationQuery: 100 },
//     { label: "Pune", destinationQuery: 200, confirmationQuery: 90 },
//     { label: "Jaipur", destinationQuery: 180, confirmationQuery: 80 },
//     { label: "Lucknow", destinationQuery: 150, confirmationQuery: 70 },
//   ];

//   const options = {
//     chart: {
//       type: "column",
//       options3d: {
//         enabled: true,
//         alpha: 0,
//         beta: 0,
//         depth: 50,
//         viewDistance: 25,
//       },
//       backgroundColor: background?.value === "dark" ? null : "white",
//     },
//     title: {
//       text: "Top 10 Destinations: Destination Query vs. Confirmation Query",
//       style: {
//         fontSize: "12px",
//         color: background?.value === "dark" ? "white" : "dark",
//       },
//     },
//     xAxis: {
//       categories: dataSource.map((item) => item.label),
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       title: {
//         text: "Destinations",
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 0,
//     },
//     yAxis: {
//       labels: {
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       title: {
//         text: "Number of Queries",
//         style: {
//           color: background?.value === "dark" ? "white" : "dark",
//         },
//       },
//       gridLineWidth: 0,
//     },
//     tooltip: {
//       headerFormat: "<b>{point.key}</b><br>",
//       pointFormat: "{series.name}: {point.y}<br>Total: {point.stackTotal}",

//     },
//     style: {
//       color: background?.value === "dark" ? "white" : "dark",
//     },
//     plotOptions: {
//       column: {
//         depth: 40,
//         grouping: true,
//         dataLabels: {
//           enabled: false,
//           style: {
//             color: background?.value === "dark" ? "white" : "dark",
//           },
//         },
//       },
//     },
//     series: [
//       {
//         name: "Destination Queries",
//         data: dataSource.map((item) => item.destinationQuery),
//         color: "#7cb5ec",
//       },
//       {
//         name: "Confirmation Queries",
//         data: dataSource.map((item) => item.confirmationQuery),
//         color: "#90ed7d",
//       },
//     ],
//     legend: {
//       enabled: false,
//       itemStyle: {
//         fontSize: "12px",
//         color: background?.value == "dark" ? " white" : 'dark',
//       },
//     },
//   };

//   return (
//     <div>
//       <HighchartsReact highcharts={Highcharts} options={options} />
//     </div>
//   );
// };

// export default DestinationChart;


import React, { useContext, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";
import { axiosOther } from "../../../../http/axios_base_url";

// Enable Highcharts 3D
highcharts3d;

const DestinationChart = () => {
  const { background } = useContext(ThemeContext);
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch data from API

  let CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

  const getTopDestinationsFromServer = async () => {
    try {
      setLoading(true);
      const { data } = await axiosOther.post("toptendestinations", {
        companyid: CompanyUniqueId,
      });

      if (data?.status === "success" && data?.data) {
        // Transform API data to match the chart format
        const transformedData = data.data.map((item) => ({
          label: item.destinationname,
          destinationQuery: item.totalcount,
        }));
        setDataSource(transformedData);
      }
    } catch (error) {
      console.error("top-destinations-error", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getTopDestinationsFromServer();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{
            chart: {
              type: "column",
              options3d: {
                enabled: true,
                alpha: 15,  // Tilt on X-axis
                beta: 20,   // Rotate on Y-axis
                depth: 80,  // Bar thickness
                viewDistance: 25, // Perspective depth
                fitToPlot: false
              },
              backgroundColor: background?.value === "dark" ? null : "white",
            },
            title: {
              text: "Loading...",
              style: {
                fontSize: "12px",
                color: background?.value === "dark" ? "white" : "dark",
              },
            },
            xAxis: {
              categories: [],
              labels: {
                style: {
                  color: background?.value === "dark" ? "white" : "dark",
                },
              },
              title: {
                text: "Destinations",
                style: {
                  color: background?.value === "dark" ? "white" : "dark",
                },
              },
              gridLineWidth: 0,
            },
            yAxis: {
              labels: {
                style: {
                  color: background?.value === "dark" ? "white" : "dark",
                },
              },
              title: {
                text: "Number of Queries",
                style: {
                  color: background?.value === "dark" ? "white" : "dark",
                },
              },
              gridLineWidth: 0,
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
      type: "column",
      options3d: {
        enabled: true,
        alpha: 15,  // Tilt on X-axis
        beta: 20,   // Rotate on Y-axis
        depth: 80,  // Bar thickness
        viewDistance: 25, // Perspective depth
        fitToPlot: false
      },
      backgroundColor: background?.value === "dark" ? null : "white",
    },
    title: {
      text: "Top 10 Destinations",
      style: {
        fontSize: "12px",
        color: background?.value === "dark" ? "white" : "dark",
      },
    },
    xAxis: {
      categories: dataSource.map((item) => item.label),
      labels: {
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      title: {
        text: "Destinations",
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 0,
    },
    yAxis: {
      labels: {
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      title: {
        text: "Number of Queries",
        style: {
          color: background?.value === "dark" ? "white" : "dark",
        },
      },
      gridLineWidth: 0,
    },
    tooltip: {
      headerFormat: "<b>{point.key}</b><br>",
      pointFormat: "{series.name}: {point.y}",
    },
    style: {
      color: background?.value === "dark" ? "white" : "dark",
    },
    plotOptions: {
      column: {
        depth: 40,
        grouping: true,
        dataLabels: {
          enabled: false,
          style: {
            color: background?.value === "dark" ? "white" : "dark",
          },
        },
      },
    },
    series: [
      {
        name: "Destination Queries",
        data: dataSource.map((item) => item.destinationQuery),
        color: "#7cb5ec",
      },
    ],
    legend: {
      enabled: false,
      itemStyle: {
        fontSize: "12px",
        color: background?.value === "dark" ? "white" : "dark",
      },
    },
    credits: { enabled: false },
  };

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};

export default DestinationChart;