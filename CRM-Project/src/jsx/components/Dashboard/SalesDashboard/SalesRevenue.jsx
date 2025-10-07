import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import "../../../../css/new-style.css"

const Speedometer = () => {
    const [value, setValue] = useState(0);

    return (
        <div style={{ marginTop: "100px", marginLeft: "10px" }} className="Speedometerchart">
            <ReactSpeedometer labelFontSize="10px" valueTextFontWeight="normal"
                value={value}
                minValue={0}
                maxValue={100}
                height={250}
                segments={4} // Four segments for the ranges
                segmentColors={["red", "orange", "yellow", "green"]}
                needleColor="black"
                currentValueText={`Value: ${value}`}
                forceRender={true} // Ensures color updates dynamically
            />
            <div className="row mb-4">
                <div className="target col-6">Target: <button className="btn btn-danger px-2 py-1 ms-2">1234567890</button></div>
                <div className="Sales col-6">Sales: <button className="btn btn-success px-2 py-1 ms-2">1234567</button></div>


            </div>

        </div>
    );
};

export default Speedometer;
