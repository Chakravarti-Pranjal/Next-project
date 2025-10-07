import { createContext, lazy, useEffect, useRef, useState } from "react";
import Itineraries from "./Itineraries";
import { Card, Tab, Nav } from "react-bootstrap";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import QueryHeading from "../QueryHeading";
import { axiosOther } from "../../../../http/axios_base_url";

const Quotation = () => {
  const { queryData, qoutationData, isItineraryEditing } = useSelector(
    (data) => data?.queryReducer
  );
  const { TourSummary, QueryInfo } = qoutationData;
  const [headingShow, setHeadingShow] = useState(false);
  const [previewData, setPreviewData] = useState("");
  const itinerariesRef = useRef();
  const currentQueryGlobalContext = createContext();

  const getPreviewData = async () => {
    try {
      const { data } = await axiosOther.post("querymasterlist", {
        QueryId: state?.QueryAlphaNumId || queryData?.QueryAlphaNumId,
      });
      localStorage.setItem("query-data", JSON.stringify(data?.DataList[0]));
      setPreviewData(data?.DataList[0]);
      dispatch(
        setQoutationSubject(
          data?.DataList[0]?.ServiceDetail?.ServiceCompanyName +
            " " +
            currentDate(data?.DataList[0]?.QueryDate?.Date)
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPreviewData();
  }, [queryData?.QueryId]);

  useEffect(() => {
    if (qoutationData != "") {
      itinerariesRef.current.click();
    }
  }, [qoutationData]);
  const [activeTab, setActiveTab] = useState("itineraries");

  const handleNext = (currentTab) => {
    const tabOrder = [
      "itineraries",
      "policies",
      "commission",
      "summary",
      "pax-slab",
    ];
    const currentIndex = tabOrder.indexOf(currentTab);
    const nextIndex = (currentIndex + 1) % tabOrder.length;
    setActiveTab(tabOrder[nextIndex]);
  };

  console.log(previewData, "previewDataLLL");

  return (
    <Card>
      <Card.Body className="py-0 px-0">
        {/* <currentQueryGlobalContext.Provider
          value={{
            header: { headingShow, setHeadingShow },
            currentQuery: { previewData, setPreviewData },
          }}
        >
          <QueryHeading headData={previewData} />
        </currentQueryGlobalContext.Provider> */}
        <div className="custom-tab-1">
          <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
            <Nav
              as="ul"
              className="nav-tabs d-flex justify-content-between custom-row-gap"
            >
              <div className="d-flex">
                <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="itineraries"
                    disabled={qoutationData != "" ? false : true}
                    ref={itinerariesRef}
                  >
                    {/* <i className={`la la-home me-2 nav-icons`} /> */}
                    <span className="nav-name fs-4">Service Selection</span>
                  </Nav.Link>
                </Nav.Item>
                {/* <Nav.Item as="li" onClick={() => toast.dismiss()}>
                  <Nav.Link
                    eventKey="policies"
                    disabled={qoutationData != "" ? false : true}
                  >
                    <i className={`la la-user me-2 nav-icons`} />
                    <span className="nav-name">Policies</span>
                  </Nav.Link>
                </Nav.Item> */}
              </div>
              <div className="d-flex gap-3 pb-1" style={{ overflowX: "auto" }}>
                <div className="pax-info">
                  <span>Total Nights</span>
                  <span>{TourSummary?.NumberOfNights || "2"}</span>
                </div>
                {QueryInfo?.Accomondation?.RoomInfo?.filter(
                  (room) => room?.NoOfPax != "" && room?.NoOfPax != null
                ).map((room, ind) => {
                  return (
                    <div className="pax-info" key={ind}>
                      <span>{room?.RoomType}</span>
                      <span>{room?.NoOfPax}</span>
                    </div>
                  );
                })}
                <div className="pax-info">
                  <span>Adult</span>
                  <span>{qoutationData?.Pax?.AdultCount || "2"}</span>
                </div>
                <div className="pax-info">
                  <span>Child</span>
                  <span>{qoutationData?.Pax?.ChildCount || "2"}</span>
                </div>
              </div>
            </Nav>
            <Tab.Content className="pt-2">
              <Tab.Pane eventKey="itineraries" className="mt-2">
                <Itineraries onNext={() => handleNext("itineraries")} />
              </Tab.Pane>
              {/* <Tab.Pane eventKey="policies">
                <Policies
                  onNext={() => handleNext("policies")}
                  onBack={() => handleBack("policies")}
                />
              </Tab.Pane> */}
            </Tab.Content>
          </Tab.Container>
        </div>
      </Card.Body>
    </Card>
  );
};

export default Quotation;
