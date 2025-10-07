import React, { useEffect, useState } from 'react'
import useQueryData from '../../../hooks/custom_hooks/useQueryData';
import { useDispatch, useSelector } from "react-redux";
import { axiosOther } from '../../../http/axios_base_url';
import icon3 from "../../../images/quotation/icon3.svg";
import { useLocation } from 'react-router-dom';
import { setQoutationData, setQueryData } from '../../../store/actions/queryAction';

const DestinationsCard = () => {
    const queryData = useQueryData();

    const { state } = useLocation();
    const [qoutationList, setQoutationList] = useState([]);
    const [queryMasterList, setQueryMasterList] = useState({});
    const dispatch = useDispatch();


    // console.log(queryMasterList, "queryMasterList")

    const { qoutationData, dayServicesCondition } = useSelector(
        (data) => data?.queryReducer
    );

    const getQoutationList = async () => {
        try {
            const { data } = await axiosOther.post("listqueryquotation", {
                QueryId: state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId,
                QuotationNo: "",
            });

            if (data?.success) {
                // console.log("dattat",data?.data)
                setQoutationList(data?.data);
            }
        } catch (error) {
            console.log("error", error);
        }
    };
    // console.log(qoutationList, "qoutationList")

    const getQueryList = async (quotation) => {
        try {
            const { data } = await axiosOther.post("querymasterlist", {
                QueryId: queryData?.QueryAlphaNumId,
            });

            setQueryMasterList(data?.DataList?.[0]);
        } catch (error) {
            console.log("error", error);
        }
    };

    useEffect(() => {
        getQueryList();
    }, [queryData]);

    // const emptyqoutationdata = () => {
    //     localStorage.setItem(
    //         "Query_Qoutation",
    //         JSON.stringify({ QoutationNum: "", QueryID: queryData?.QueryAlphaNumId })
    //     );
    //     if (qoutationData != {}) {
    //         dispatch(setQoutationData({}));
    //     }
    // };

    // useEffect(() => {
    //     emptyqoutationdata();
    // }, []);

    useEffect(() => {
        getQoutationList();
    }, [state?.QueryData?.QueryID ?? queryData?.QueryAlphaNumId]);


    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));
    const getqueryData = async () => {
        const payload = {
            QueryId: queryQuotation?.QueryID,
        };
        try {
            const { data } = await axiosOther.post("querymasterlist", payload);
            dispatch(
                setQueryData({
                    QueryId: data?.DataList[0]?.id,
                    QueryAlphaNumId: data?.DataList[0]?.QueryID,
                    QueryAllData: data?.DataList[0],
                })
            );
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getqueryData();
    }, []);



    const { QueryStatus, TourSummary, QueryInfo, Pax } =
        qoutationList[0] != undefined ? qoutationList[0] : {};

    const itemVal = qoutationList[0]?.Days?.map((item) => item?.DayServices);
    const condition = itemVal?.every((item) => item?.length > 0);

    useEffect(() => {
        dispatch({ type: "DAY-SERVICES-CONDITION", payload: condition });
    }, [condition]);

    // const firstDestination = TourSummary?.TourDetails?.[0]?.DestinationName || "DELHI";
    // const lastDestination = TourSummary?.TourDetails?.[TourSummary?.TourDetails?.length - 1]?.DestinationName || "AGRA";
    const firstDestination = qoutationList[0]?.TravelDateInfo?.TravelData[0]?.DestinationName || "DELHI";
    const lastDestination = qoutationList[0]?.TravelDateInfo?.TravelData[qoutationList[0]?.TravelDateInfo?.TravelData?.length - 1]?.DestinationName || "AGRA";

    // console.log(qoutationList?.TravelDateInfo, "zssss")
    return (
        <div className="sidebar-container col-lg-3 col-md-12 col-sm-12 p-2">
            <p className="sidebar-heading text-center fw-semibold text-uppercase small pb-2 mb-1 border-bottom">
                Destinations
            </p>

            <div className="row text-center mb-1">
                <div className="col-4">
                    <p className="sidebar-label m-0">From</p>
                    <p className="sidebar-value m-0 fw-semibold text-uppercase">{firstDestination}</p>
                </div>
                <div className="col-4 d-flex align-items-center justify-content-center">
                    <img src={icon3} alt="arrow icon" className="img-fluid icon-arrow" />
                </div>
                <div className="col-4">
                    <p className="sidebar-label m-0">To</p>
                    <p className="sidebar-value m-0 fw-semibold text-uppercase">{lastDestination}</p>
                </div>
            </div>

            <div className="mb-4">
                {/* <div className="row text-center py-2 mb-1 sidebar-table-header mx-1">
                     <div className="col">Duration</div>
                     <div className="col">Destination</div>
                     <div className="col">Date</div>
                   </div>
                   {TourSummary?.TourDetails?.map((tour, index) => (
                     <div className="row text-center py-2 sidebar-table-row" key={index}>
                       <div className="col">Day {tour?.DayNo}</div>
                       <div className="col">{tour?.DestinationName}</div>
                       <div className="col">{tour?.Date}</div>
                     </div>
                   ))} */}
                <table className="sidebar-table w-100 text-center" style={{ tableLayout: "fixed" }}>
                    <thead>
                        <tr className="sidebar-table-header">
                            <th>Duration</th>
                            <th>Destination</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* change here  */}
                        {queryMasterList?.TravelDateInfo?.TravelData?.map((tour, index) => (
                            <tr className="sidebar-table-row" key={index}>
                                <td>Day {tour?.DayNo}</td>
                                <td>{tour?.DestinationName}</td>
                                {/* <td>{tour?.Date}</td> */}
                                <td>
                                    {tour?.Date
                                        ? new Date(tour.Date).toLocaleDateString("en-GB") // dd/mm/yyyy format
                                        : ""}
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>


            <div className="row g-2 mb-3">
                {[
                    { label: 'NIGHTS', value: queryMasterList?.TravelDateInfo?.TotalNights },
                    { label: 'ADULTS', value: queryMasterList?.PaxInfo?.Adult },
                    { label: 'CHILDS', value: queryMasterList?.PaxInfo?.Child }
                ].map((item, idx) => (
                    <div className="col-4" key={idx}>
                        <div className="sidebar-box">
                            <div className="sidebar-box-label">{item.label}</div>
                            <div className="sidebar-box-value">{item.value}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-2 mb-4">
                {QueryInfo?.Accomondation?.RoomInfo?.map((info, idx) => (
                    <div className="col-4" key={idx}>
                        <div className="sidebar-box">
                            <div className="sidebar-box-label">{info?.RoomType}</div>
                            <div className="sidebar-box-value">{info?.NoOfPax ?? 0}</div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="row g-2 mb-2">
                <div className="col-6">
                    <div className="sidebar-box">
                        <div className="sidebar-box-label">BUDGET</div>
                        <div className="sidebar-box-value">{queryMasterList?.Budget}</div>
                    </div>
                </div>
            </div>

            <div className="border-top py-1 mb-0 sidebar-divider border-bottom" >
                <p className="m-0 small sidebar-label">Room Preference :</p>
            </div>
            <div className="py-1">
                <span className="small sidebar-label">Operation Person :</span>
                <div className="fw-bold sidebar-value">{queryMasterList?.Prefrences?.OperationPersonName}</div>
            </div>
        </div>
    )
}

export default DestinationsCard
