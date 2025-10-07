import { useState } from "react";
import DatePicker from "react-datepicker";

const ArrivalDeparture = () => {
    const [formValue, setFormValue] = useState({});
    const getFromDate = () => {
        return formValue?.ValidFrom ? new Date(formValue?.ValidFrom) : null;
    };
    const handleCalender = (date) => {
        const formattedDate = date ? date.toISOString().split("T")[0] : null;
        setFormValue({
            ...formValue,
            ValidFrom: formattedDate,
        });
    };
    return (
        <div>
            <table className="table table-bordered itinerary-table">
                <thead>
                    <tr>
                        <th>Type</th>
                        <th>Agent</th>
                        <th>Agent Ref No</th>
                        <th>Pax</th>
                        <th>Date</th>
                        <th>Mode</th>
                        <th>Country / City</th>
                        <th>Flight / Train No.</th>
                        <th>Time</th>
                        <th>Details</th>
                        <th>Pax Details</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {hotelData?.map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.PaxDetails?.TotalNoOfPax} Pax</td>
                            <td>{listFinalQuotationData?.TourSummary?.FromDate}</td>
                            <td>{listFinalQuotationData?.TourSummary?.ToDate}</td>
                            <td
                                className="cursor-pointer text-primary"
                                onClick={() =>
                                    redirectToItinerary(listFinalQuotationData, {
                                        ServiceId: item.ServiceId,
                                        ServiceName: item.ServiceType,
                                    })
                                }
                            >
                                {item?.ServiceType}
                            </td>
                            <td>{listFinalQuotationData?.TourSummary?.NumberOfNights}</td>
                            <td>{item?.DoubleRoom || 1}</td>
                            <td>{dblRoomCosts[index]}</td>
                            <td>{item?.TwinRoom || 0}</td>
                            <td>{twinRoomCosts[index] || 0}</td>
                            <td>{item?.SingleRoom || 1}</td>
                            <td>{sglRoomCosts[index]}</td>
                            <td>{item?.TripleRoom || 0}</td>
                            <td>{item?.TripleAmount || 0}</td>
                            <td>{item?.VoucherNo}</td>
                            <td>{item?.ClientConfirmed}</td>
                            <td>{listFinalQuotationData?.ReservationRequest[0]?.ReservationStatus}</td>
                        </tr>
                    ))} */}
                    <tr>
                        <td>
                            <select
                                className="formControl1"
                                name="Arrival"
                                style={{ width: "100%" }}
                            >
                                {/* <option value={""}>Select</option> */}
                                <option value={""}>Arrival</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" className="formControl1" name="" value="Mr. Satyajeet Ghosh" style={{ width: "100%", textAlign: "center" }} />
                        </td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td width={50}><input type="text" className="formControl1" name="" value="6" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td>
                            <DatePicker
                                style={{ width: "100%", textAlign: "center" }}
                                className="formControl1"
                                selected={getFromDate()}
                                onChange={handleCalender}
                                dateFormat="dd-MM-yyyy"
                                name="ValidFrom"
                                // isClearable 
                                todayButton="Today"
                                placeholderText="13-12-2025"
                            />
                        </td>
                        <td>
                            <select
                                className="formControl1"
                                name="Mode"
                                style={{ width: "100%" }}
                            >
                                <option value={""}>None</option>
                            </select>
                        </td>
                        <td>
                            <select
                                className="formControl1"
                                name="Mode"
                                style={{ width: "100%" }}
                            >
                                <option value={""}>Select</option>

                            </select>
                        </td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>
                            <select
                                className="formControl1"
                                name="Departure"
                            >
                                {/* <option value={""}>Select</option> */}
                                <option value={""}>Departure</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" className="formControl1" name="" value="Mr. Satyajeet Ghosh" style={{ width: "100%", textAlign: "center" }} />
                        </td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td width={50}><input type="text" className="formControl1" name="" value="6" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td>
                            <DatePicker
                                style={{ width: "100%", textAlign: "center" }}
                                className="formControl1"
                                selected={getFromDate()}
                                onChange={handleCalender}
                                dateFormat="dd-MM-yyyy"
                                name="ValidFrom"
                                // isClearable 
                                todayButton="Today"
                                placeholderText="13-12-2025"
                            />
                        </td>
                        <td>
                            <select
                                className="formControl1"
                                name="Mode"
                                style={{ width: "100%" }}
                            >
                                <option value={""}>None</option>
                            </select>
                        </td>
                        <td>
                            <select
                                className="formControl1"
                                name="Mode"
                                style={{ width: "100%" }}
                            >
                                <option value={""}>Select</option>

                            </select>
                        </td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td><input type="text" className="formControl1" name="" value="" style={{ width: "100%", textAlign: "center" }} /></td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default ArrivalDeparture
