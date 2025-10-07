import React, { useContext } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from "highcharts/highcharts-3d";
import { ThemeContext } from "../../../../../src/context/ThemeContext";

// Resolving the Highcharts 3D dependency
highcharts3d;

// Data source for Pie chart


function Topdestination() {
    const { background } = useContext(ThemeContext)
    const dataSource = [
        { name: "Agra", y: 5, color: "#2cafff" },
        { name: "Delhi", y: 5, color: "#544fc5" },
        { name: "Jaipur", y: 3, color: "#00e272" },
        { name: "Bengaluru", y: 2, color: "#ff6932" },
        { name: "Ahmedabad", y: 1, color: "#6c8abd" },
    ];

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
            text: "chart",
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
                data: dataSource, // Using the custom data with color
            },
        ],
        colors: dataSource.map((item) => item.color), // Setting colors based on the data
        legend: {
            enabled: true,
            itemStyle: {
                color: background?.value == "dark" ? " white" : 'dark',
                fontSize: "12px",
            },
        },
    };
    return (
        <div>
            <HighchartsReact highcharts={Highcharts} options={options} />
        </div>
    );
}

export default Topdestination;
