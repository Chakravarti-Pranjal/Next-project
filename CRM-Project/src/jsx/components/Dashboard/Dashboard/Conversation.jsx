import React, { useContext, useState, useEffect, useRef } from "react";
import Highcharts, { color } from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { axiosOther } from "../../../../http/axios_base_url";
// import  { useContext, useState, useEffect } from "react";

import { ThemeContext } from "../../../../../src/context/ThemeContext";
import moment from "moment";

highcharts3d;


function Conversation() {
  const { background } = useContext(ThemeContext);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchQueryData = async () => {
    try {
      setLoading(true);
      setError(null);
      const CompanyUniqueId = JSON.parse(localStorage.getItem("token"))?.companyKey;

      if (!CompanyUniqueId) {

        processData(staticApiResponse.data || []);
        return;
      }
      { companyid: CompanyUniqueId };
      const { data } = await axiosOther.post("Queryconvertion", { companyid: CompanyUniqueId });

      JSON.stringify(data, null, 2);
      const responseData = data?.data || []; // Directly use data.data
      if (data?.status === "success" && Array.isArray(responseData) && responseData.length > 0) {
        // console.log("✅ API data received:", responseData);
        processData(responseData);
      } else {

        processData(staticApiResponse.data || []);
      }
    } catch (error) {

      setError(error.message || "Failed to fetch Query Conversion data");
      processData(staticApiResponse.data || []); // Fallback to static data
    } finally {
      setLoading(false);
    }
  };

  const processData = (responseData) => {
    const aggregatedMap = new Map();
    responseData.forEach((item) => {
      const key = `${item.year}-${item.month}`;
      if (!aggregatedMap.has(key)) {
        aggregatedMap.set(key, {
          year: String(item.year),
          month: String(item.month).padStart(2, "0"),
          totalqueries: 0,
          confirmqueries: 0,
        });
      }
      const entry = aggregatedMap.get(key);
      entry.totalqueries += parseInt(item.totalqueries, 10) || 0;
      entry.confirmqueries += parseInt(item.confirmqueries, 10) || 0;
    });

    const transformedData = Array.from(aggregatedMap.values())
      .map((item) => {
        if (!item.year || !item.month) {

          return null;
        }
        const monthLabel = moment(`${item.year}-${item.month}`, "YYYY-MM").format("MMMM");
        return {
          label: monthLabel,
          totalQuery: item.totalqueries,
          convertQuery: item.confirmqueries,
        };
      })
      .filter((item) => item !== null);

    setChartData(transformedData);
  };

  useEffect(() => {
    fetchQueryData();
  }, []);

  const barChartOptions = {
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
      width: 400,
      backgroundColor: background?.value === "dark" ? null : "white",
    },
    title: {
      text: "Query Conversion Statistics",
      style: { fontSize: "12px", color: background?.value === "dark" ? "white" : "black" },
    },
    xAxis: {
      categories: chartData.map((item) => item.label),
      labels: { style: { color: background?.value === "dark" ? "white" : "black" } },
      title: {
        text: `${moment().format("YYYY")} Queries`,
        style: { color: background?.value === "dark" ? "white" : "black" },
      },
      gridLineWidth: 0,
    },
    yAxis: [
      {
        min: 0,
        labels: { style: { color: background?.value === "dark" ? "white" : "black" } },
        title: { text: "Total Queries" },
        gridLineWidth: 0,
      },
      {
        min: 0,
        title: { text: "Confirmed Queries" },
        opposite: true,
        gridLineWidth: 0,
      },
    ],
    series: [
      {
        name: "Total Queries",
        data: chartData.map((item) => item.totalQuery),
        yAxis: 0,
        depth: 50,
        color: "#4A90E2",
      },
      {
        name: "Confirmed Queries",
        data: chartData.map((item) => item.convertQuery),
        yAxis: 0,
        depth: 50,
        color: "#50C878",
      },
    ],
    legend: {
      enabled: true,
      itemStyle: { color: background?.value === "dark" ? "white" : "black", fontSize: "12px" },
    },
    plotOptions: {
      column: { depth: 25, colorByPoint: false },
    },
    accessibility: { enabled: false },
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: background?.value === "dark" ? "white" : "black" }}>
        Loading Query Conversion data...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: background?.value === "dark" ? "white" : "black" }}>
        Error: {error}
      </div>
    );
  }

  if (chartData.length === 0) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px", color: background?.value === "dark" ? "white" : "black" }}>
        No Query Conversion data available for this company. Please check the company ID or contact support.
      </div>
    );
  }

  return (
    <div>
      <HighchartsReact highcharts={Highcharts} options={barChartOptions} />
    </div>
  );
}

export default Conversation;
