import SalesUser from "./SalesUser";
import SalesaGraph from "./SalesaGraph";
import moment from "moment";
import { ThemeContext } from "../../../../context/ThemeContext";
import React, { useContext, useEffect } from "react";

const SalesDashboard = () => {
  const { changeBackground } = useContext(ThemeContext);
  // useEffect(() => {
  //   changeBackground({ value: "dark", label: "Dark" });
  // }, []);
  return (
    <div className="SalesDashboard">
      <div className="row">
        <div className="col-2">
          <SalesUser />
        </div>
        <div className="col-10">
          <SalesaGraph />
        </div>
      </div>
    </div>
  );
};

export default SalesDashboard;
