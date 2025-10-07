
import React, { useContext, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";
import { axiosOther } from "../../../../http/axios_base_url";


highcharts3d;


function MonthSale() {
  const { background } = useContext(ThemeContext);
  const [destinationData, setDestinationData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Color palette for the chart
  const colorPalette = ["#2cafff", "#544fc5", "#00e272", "#ff6932", "#6c8abd", "#ff9f43", "#28c76f", "#ea5455", "#ff6b6b"];

  // Function to fetch top destinations from API
  const getTopDestinationsFromServer = async () => {
    try {
      setLoading(true);
      let CompanyUniqueId = JSON.parse(
        localStorage.getItem("token")
      )?.companyKey;
      const { data } = await axiosOther.post("gettopDestination", {
        companyId: CompanyUniqueId
      });

      if (data?.Status === 200 && data?.DataList) {
        // Transform API data to chart format
        const transformedData = data.DataList.map((destination, index) => ({
          name: destination.DestinationName,
          y: destination.UsageCount,
          color: colorPalette[index % colorPalette.length], // Cycle through colors
          destinationId: destination.Destination,
          uniqueId: destination.DestinationUniqueId
        }));

        setDestinationData(transformedData);
      }
    } catch (error) {
      console.log("destination-error", error);
      // Fallback to empty array or default data
      setDestinationData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    getTopDestinationsFromServer();
  }, []);

  const options = {
    chart: {
      type: "pie", // Type of chart
      options3d: {
        enabled: true, // Enable 3D effect
        alpha: 45, // Angle of 3D view
        beta: 0, // Rotation of 3D view along Y-axis
        depth: 100, // Depth of the chart
      },
      backgroundColor: background?.value == "dark" ? null : 'white',
    },
    title: {
      text: "Chart",
      style: {
        fontSize: "12px", // Set the font size to smaller value
        color: background?.value == "dark" ? " white" : 'dark',
      },
    },
    plotOptions: {
      pie: {
        innerSize: "40%", // Creates the donut effect (hole in the center)
        depth: 45, // Depth of the slices
        dataLabels: {
          enabled: true,
          format: "{point.name}", // Format for data labels
        },
      },
    },
    series: [
      {
        name: "Hours per Day",
        data: destinationData, // Using the API data
      },
    ],
    colors: destinationData.map((item) => item.color), // Setting colors based on the data
    legend: {
      enabled: true,
      itemStyle: {
        color: background?.value == "dark" ? " white" : 'dark',
        fontSize: "12px",
      },
    },
  };

  // Show loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        color: background?.value === "dark" ? "white" : 'dark'
      }}>
        Loading destinations...
      </div>
    );
  }

  // Show message if no data
  if (!destinationData.length) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '300px',
        color: background?.value === "dark" ? "white" : 'dark'
      }}>
        No destination data available
      </div>
    );
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
}

export default MonthSale;