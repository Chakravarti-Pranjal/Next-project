import { useState } from "react";
import { Outlet } from "react-router-dom";
import Stepper from "./Stepper";
import QueryHeading from "./QueryHeading";
import { createContext } from "react";
import { useSelector } from "react-redux";
import QueryNavbar from "../../components/queryNavbar/QueryNavbar";

const currentQueryGlobalContext = createContext();

const QueryView = () => {
  const [headingShow, setHeadingShow] = useState(false);
  const selector = useSelector((data) => data?.queryReducer);
  const [currentQueryData, setCurrentQueryData] = useState(
    selector?.queryUpdateData
  );

  return (
    <>
      <Stepper />
      <div className="row">
        <div className="col-12 mt-2">
          <QueryNavbar />

          <div className="card shadow-none mt-1">
            <div className="card-body p-0">
              <div className="tab-content card-Custom-Padding">
                <currentQueryGlobalContext.Provider
                  value={{
                    header: { headingShow, setHeadingShow },
                    currentQuery: { currentQueryData, setCurrentQueryData },
                  }}
                >
                  {console.log("GFBHGF877656")}
                  {/* {selector?.queryData && ( */}
                  <QueryHeading headData={currentQueryData} />
                  {/* // )} */}
                  <Outlet />
                </currentQueryGlobalContext.Provider>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default QueryView;
export { currentQueryGlobalContext };
