import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Enable Highcharts 3D
highcharts3d;

const ProcessChart = () => {
    const { background } = useContext(ThemeContext)
    const options = {
        chart: {
            type: "column", // Column chart for stages representation
            options3d: {
  enabled: true,
  alpha: 15,  // Tilt on X-axis
  beta: 20,   // Rotate on Y-axis
  depth: 80,  // Bar thickness
  viewDistance: 25, // Perspective depth
  fitToPlot: false
},
            backgroundColor: background?.value == "dark" ? null : 'white',
            borderWidth: 0, // Remove the border
        },
        title: {
            text: "Process Chart ",
            style: {
                fontSize: "12px", // Set the font size to smaller value
                color: background?.value == "dark" ? " white" : 'dark',
            },
        },
        xAxis: {
            categories: [
                "Stage 1: Query Created",
                "Stage 2: Quotation Generated",
                "Stage 3: Follow Up",
                "Stage 4: Confirmed",
                "Stage 5: Voucher",
                "Stage 6: Invoice",
            ],
            labels: {
                style: {
                    color: background?.value === "dark" ? "white" : "dark",
                },
            },
            title: {
                text: "Process Stages",
                style: {
                    color: background?.value == "dark" ? " white" : 'dark',
                },
            },
            gridLineWidth: 0, // Hide grid lines on the x-axis
        },
        yAxis: {
            labels: {
                style: {
                    color: background?.value === "dark" ? "white" : "dark",
                },
            },
            title: {
                text: "Effort (Hours)",
                style: {
                    color: background?.value == "dark" ? " white" : 'dark',
                },
            },
            gridLineWidth: 0, // Hide grid lines on the y-axis
        },
        tooltip: {
            headerFormat: "<b>{point.key}</b><br>", // Tooltip header
            pointFormat: "Effort: {point.y} hours", // Tooltip body
        },
        plotOptions: {
            column: {
                depth: 40, // Depth for individual columns
            },
        },
        series: [
            {
                name: "Effort",
                data: [10, 20, 35, 25, 15, 10], // Example effort data for each stage
                colorByPoint: true, // Different colors for each stage
            },
        ],
        legend: {
            enabled: false,
            itemStyle: {
                fontSize: "12px",
                color: background?.value == "dark" ? " white" : 'dark',
            },
        },
    };

    return (
        <div>
            {/* Render Highcharts 3D Process Chart */}
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
};

export default ProcessChart;
