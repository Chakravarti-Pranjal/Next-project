import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Funnel from "highcharts/modules/funnel"; // Funnel module
import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Initialize the funnel module
Funnel;

const FunnelPyramidChart = () => {
    const { background } = useContext(ThemeContext);

    const options = {
        chart: {
            type: "funnel", // Funnel chart type
            backgroundColor: background?.value === "dark" ? null : "white", // Background based on theme
        },
        title: null, // No title
        plotOptions: {
            funnel: {
                width: "60%", // Funnel width
                height: "80%", // Funnel height
                center: ["50%", "50%"], // Center alignment
                neckWidth: "0%", // Removes the bottom neck
                neckHeight: "0%", // Continuous pyramid shape
                dataLabels: {
                    enabled: true, // Display data labels
                    style: {
                        color: background?.value === "dark" ? "white" : "dark", // Text color based on theme
                        fontSize: "12px",
                    },
                    format: "<b>{point.name}</b>: {point.y}", // Format for labels
                },
            },
        },
        series: [
            {
                name: "Value",
                data: [
                    ["Stage 1", 50],
                    ["Stage 2", 40],
                    ["Stage 3", 30],
                    ["Stage 4", 20],
                    ["Stage 5", 10],
                ],
                colors: background?.value === "dark"
                    ? ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9"]
                    : ["#90ed7d", "#7cb5ec", "#f7a35c", "#8085e9", "#434348"], // Conditional colors for stages
            },
        ],
    };

    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default FunnelPyramidChart;
