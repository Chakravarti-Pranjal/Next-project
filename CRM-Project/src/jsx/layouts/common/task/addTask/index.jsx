import React, { useState, useEffect } from "react";
import { addTaskInitialValue } from "../../../../pages/masters/masters_initial_value.js";
import { taskValidationSchema } from "../../../../pages/masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../../../../css/style.css";


const AddTask = () => {
    const [formValue, setFormValue] = useState(addTaskInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const [countryList, setCountryList] = useState([]);
    const [leadlist, setLeadlist] = useState([]);
    const [agentList, setAgentList] = useState([]);
    const [showAgentPopup, setShowAgentPopup] = useState(true);
    const { state } = useLocation();
    const navigate = useNavigate();
    const [destinationList, setDestinationList] = useState([]);
    const param = useParams();
    console.log(state, "state")


    const getDataToServer = async () => {
        try {
            const destination = await axiosOther.post("destinationlist", {
                Search: "",
                Status: 1,
            });
            setDestinationList(destination.data.DataList);
        } catch (err) {
            console.log(err);
        }

        try {
            const countryData = await axiosOther.post("countrylist", {
                Search: "",
                Status: 1,
            });
            setCountryList(countryData.data.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const response = await axiosOther.post("leadlist", {
                Search: "",
                Status: 1,
            });
            setLeadlist(response.data.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const response = await axiosOther.post("agentlist", {
                Search: "",
                Status: 1,
            });
            setAgentList(response.data.DataList);
        } catch (err) {
            console.log(err);
        }


    };


    const {
        SelectInput: DestinatinoSelectInput,
        selectedDestination,
        setSelectedDestination,
    } = useDestinationSelect();

    console.log(selectedDestination, "selectedDestination-71")
    useEffect(() => {
        getDataToServer();
    }, []);
    const handleRemarks = (data) => {
        const cleanedData = data.replace(/<[^>]*>/g, '');
        setFormValue((prevState) => ({
            ...prevState,
            Description: cleanedData,  // Update Description field in state
        }));
    }
    const getFromDate = () => {
        return formValue?.Startdate ? new Date(formValue?.Startdate) : null;
    };
    const getNextDate = () => {
        return formValue?.NextFollowUpdate ? new Date(formValue?.NextFollowUpdate) : null;
    };

    const handleNextCalender = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setFormValue({
            ...formValue,
            NextFollowUpdate: formattedDate // Store the selected date as a Date object
        });
    };

    const handleCalender = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setFormValue({
            ...formValue,
            Startdate: formattedDate // Store the selected date as a Date object
        });
    };

    // submitting data to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await taskValidationSchema.validate(
                {
                    ...formValue,
                    Destination: selectedDestination

                },
                { abortEarly: false }
            );

            console.log("value-2", {
                ...formValue,
                Destination: selectedDestination
            });

            setValidationErrors({});
            const { data } = await axiosOther.post("addupdatetasks",
                {
                    ...formValue,
                    Destination: selectedDestination


                });

            if (data?.Status == 1) {
                // if (data?.SupplireId) {
                navigate(`/view/${state?.partner_payload?.Type}/${param?.id}`);
                // }
                // else {
                //     navigate(`/view/supplier/${formValue?.id}`);
                // }


            }
        } catch (error) {
            if (error.inner) {
                const errorMessages = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setValidationErrors(errorMessages);
            }

            if (error.response?.data?.Errors) {
                const data = Object.entries(error.response?.data?.Errors);
                alert(data[0][1]);
            }

            console.log("error", error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value, file, type } = e.target;
        console.log(name, value, "168")

        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));


    };
    console.log(formValue, "formValue")

    const handleSetDataToAgent = (agent, contact) => {
        console.log(agent, contact, "1245")
        setFormValue({
            ...formValue,
            AgentContactPerson: contact?.Name,
            EmailId: contact?.Email,
            AgentName: agent?.CompanyName,
            AgentId: agent?.id,
            AgentContactPersonId: 1,
            MobileNumber: contact?.Phone
        });
    };

    useEffect(() => {
        if (state?.partner_payload) {
            setFormValue({
                ...formValue,
                Type: state?.partner_payload?.Type,
                Fk_partnerid: state?.partner_payload?.
                    Fk_partnerid,
                AddedBy: "1",
                UpdatedBy: "0",

            })
        }
        else if (state) {
            setFormValue({
                ...formValue,
                id: state?.id,
                Type: state?.Type,
                Fk_partnerid: state?.Fk_partnerid,
                Fk_Leadsource: state?.Fk_Leadsource,
                BusinessType: state?.BusinessType,
                AgentName: state?.AgentName,
                AgentId: state?.AgentId,
                AgentContactPersonId: state?.AgentContactPersonId,
                AgentContactPerson: state?.AgentContactPerson,
                EmailId: state?.EmailId,
                CountryId: state?.CountryId,
                Destination: state?.Destination,
                SalesPerson: state?.SalesPerson,
                MobileNumber: state?.MobileNumber,
                ContactNumber: state?.ContactNumber,
                Startdate: state?.Startdate,
                StartTime: state?.StartTime,
                CallDuration: state?.CallDuration,
                EndTime: state?.EndTime,
                NextFollowUpdate: state?.NextFollowUpdate,
                NextFollowUpTime: state?.NextFollowUpTime,
                ReminderTime: state?.ReminderTime,
                Priority: state?.Priority,
                TaskSubject: state?.TaskSubject,
                Description: state?.Description,
                Status: state?.Status,
                AddedBy: "1",
                UpdatedBy: "0",

            })

        }
    }, [state])
    useEffect(() => {
        if (!formValue?.CountryId && state?.partner_payload?.CompanyNmae?.[0]?.CountryId) {

            setFormValue((prev) => ({
                ...prev,

                CountryId
                    : state.partner_payload.CompanyNmae[0].CountryId.toString(), // int mein bhejna hai toh
            }));
        }
    }, [state, formValue]);

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header py-3">
                        <h4 className="card-title">Add Task : {state?.
                            partner_payload?.CompanyNmae[0]?.CompanyName}</h4>
                        <div className="d-flex gap-3">
                            <button
                                className="btn btn-dark btn-custom-size"
                                name="SaveButton"
                                onClick={() => navigate(-1)}
                            >
                                <span className="me-1">Back</span>
                                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary">
                                Submit
                            </button>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="form-validation">
                            <form
                                className="form-valide"
                                action="#"
                                method="post"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row form-row-gap">


                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Lead Source <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    name="Fk_Leadsource"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.Fk_Leadsource}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    {leadlist && leadlist?.length > 0 && leadlist.map((data, index) => (
                                                        <option value={data?.id}>{data?.Name}</option>
                                                    ))}

                                                </select>
                                                {validationErrors?.Fk_Leadsource && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.Fk_Leadsource}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Bussiness Type <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    name="BusinessType"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.BusinessType}
                                                    onChange={handleFormChange}
                                                >

                                                    <option value="">Select</option>
                                                    <option value="15">debox5656</option>
                                                    <option value="14">Agent</option>

                                                </select>
                                                {validationErrors?.BusinessType && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.BusinessType}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Agent <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="AgentName"
                                                    value={formValue?.AgentName}
                                                    onChange={handleFormChange}
                                                    placeholder="Agent Name"
                                                    onClick={() => setShowAgentPopup(true)}
                                                />
                                                {validationErrors?.AgentName && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.AgentName}
                                                    </div>
                                                )}
                                            </div>

                                            {showAgentPopup && formValue.BusinessType !== "" && (
                                                <div className=" custom-search-dropdown custom-top-pos">
                                                    <div
                                                        className="col-12 d-flex justify-content-end cursor-pointer p-0"
                                                        onClick={() => setShowAgentPopup(!showAgentPopup)}
                                                    >
                                                        <i className="fa-solid fa-xmark font-size-15 font-weight-bold px-1"></i>
                                                    </div>
                                                    <div className="row w-100 align-items-center gap-1 m-0 px-1">
                                                        {agentList
                                                            ?.filter((agent) => {
                                                                return formValue?.AgentName != ""
                                                                    ? agent.CompanyName.toLowerCase().includes(
                                                                        formValue?.AgentName.toLowerCase()
                                                                    )
                                                                    : agent;
                                                            })
                                                            .map((agent, ind) => {
                                                                return (
                                                                    <div
                                                                        className="col-12 d-flex flex-column py-1 rounded border"
                                                                        key={ind + 1}
                                                                    >
                                                                        <div>
                                                                            <span className="font-weight-bold">
                                                                                {agent?.CompanyName}
                                                                            </span>
                                                                        </div>
                                                                        {agent?.ContactList[0]?.ContactDetail?.map(
                                                                            (contact, ind) => {
                                                                                return (
                                                                                    <div
                                                                                        className="d-flex justify-content-between p-2 rounded cursor-pointer alternate-color mb-1"
                                                                                        key={ind + 1}
                                                                                        onClick={() => {
                                                                                            handleSetDataToAgent(
                                                                                                agent,
                                                                                                contact
                                                                                            ),
                                                                                                setShowAgentPopup(
                                                                                                    !showAgentPopup
                                                                                                );
                                                                                        }}
                                                                                    >
                                                                                        <span className="m-0 ">
                                                                                            {contact?.Name}
                                                                                        </span>
                                                                                        <span className="m-0 ">
                                                                                            {contact?.Phone}
                                                                                        </span>
                                                                                    </div>
                                                                                );
                                                                            }
                                                                        )}
                                                                    </div>
                                                                );
                                                            })}
                                                        {agentList == "" && (
                                                            <div className="col-12 d-flex justify-content-center">
                                                                <h6 className="text-secondary">
                                                                    There are no records for show
                                                                </h6>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Sales Person  <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    name="SalesPerson"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.SalesPerson}
                                                    onChange={handleFormChange}
                                                >

                                                    <option value="">Select</option>
                                                    <option value="1">Ansar</option>
                                                    <option value="2">Rizwan</option>



                                                </select>
                                                {validationErrors?.SalesPerson && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.SalesPerson}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Contact Person Name  <span className="text-danger">*</span>

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="AgentContactPerson"
                                                    value={formValue?.AgentContactPerson}
                                                    onChange={handleFormChange}
                                                    placeholder="Contact Person Name"
                                                />
                                                {validationErrors?.AgentContactPerson && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.AgentContactPerson}
                                                    </div>
                                                )}

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Mobile Number

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="MobileNumber"
                                                    value={formValue?.MobileNumber}
                                                    onChange={handleFormChange}
                                                    placeholder="Mobile Number"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Email Address  <span className="text-danger">*</span>

                                                    </label>
                                                </div>
                                                <input
                                                    type="email"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="EmailId"
                                                    value={formValue?.EmailId}
                                                    onChange={handleFormChange}
                                                    placeholder="EmailId"
                                                />
                                                {validationErrors?.EmailId && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.EmailId}
                                                    </div>
                                                )}

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Country <span className="text-danger">*</span>
                                                </label>
                                                <select
                                                    name="CountryId"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.CountryId}
                                                    onChange={handleFormChange}
                                                >

                                                    <option value="">Select</option>
                                                    {countryList && countryList?.length > 0 && countryList.map((data, index) => (
                                                        <option value={data?.id}>{data?.Name}</option>
                                                    ))}


                                                </select>
                                                {validationErrors?.Country && (
                                                    <div
                                                        id="val-username1-error"
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.Country}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between ">
                                                    <label htmlFor="destionation" className="m-0">
                                                        Destination
                                                        <span className="text-danger fs-6">*</span>
                                                    </label>
                                                    {validationErrors?.Destination && (
                                                        <span className="font-size-12 text-danger m-0">
                                                            {validationErrors?.Destination}
                                                        </span>
                                                    )}
                                                </div>
                                                <DestinatinoSelectInput />

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Contact Number

                                                    </label>
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="ContactNumber"
                                                    value={formValue?.ContactNumber}
                                                    onChange={handleFormChange}
                                                    placeholder="Contact Number"
                                                />


                                            </div>
                                            <div className="col-md-12 col-lg-12">
                                                <p> Description</p>


                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    value={formValue?.Description || ""}
                                                    name="Description"
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        handleRemarks(data)

                                                    }}

                                                />
                                            </div>
                                            <div className="col-md-12 col-lg-12"><h4 className="card-title"> Task Information</h4></div>
                                            <div className="col-md-6 col-lg-3">

                                                <p className="mb-1">Start Date</p>
                                                <DatePicker className="form-control form-control-sm" x selected={getFromDate()} name="FromDate" onChange={(e) => handleCalender(e)} dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Start Time
                                                </label>
                                                <select
                                                    name="StartTime"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.StartTime}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="9:00,AM">9:00 AM</option>
                                                    <option value="9:15,AM">9:15 AM</option>
                                                    <option value="9:30,AM">9:30 AM</option>



                                                </select>

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Call Duration
                                                </label>
                                                <select
                                                    name="CallDuration"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.CallDuration}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="5,Minute">5 Minute</option>
                                                    <option value="10,Minute">10 Minute</option>
                                                    <option value="15,Minute">15 Minute</option>



                                                </select>

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        End Time

                                                    </label>
                                                </div>
                                                <input
                                                    type="number"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="EndTime"
                                                    value={formValue?.EndTime}
                                                    onChange={handleFormChange}
                                                    placeholder="End Time"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-3">

                                                <p className="mb-1">Next Follow Up Date</p>
                                                <DatePicker className="form-control form-control-sm" selected={getNextDate()} name="FromDate" onChange={(e) => handleNextCalender(e)} dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Next Follow Up Time
                                                </label>
                                                <select
                                                    name="NextFollowUpTime"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.NextFollowUpTime}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="9:00,AM">9:00 AM</option>
                                                    <option value="9:15,AM">9:15 AM</option>
                                                    <option value="9:30,AM">9:30 AM</option>



                                                </select>

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Reminder Time
                                                </label>
                                                <select
                                                    name="ReminderTime"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.ReminderTime}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Before 15 Min</option>
                                                    <option value="2">Before 30 Min</option>
                                                    <option value="3">Before 1 hour</option>
                                                    <option value="4">Before 2 hour</option>



                                                </select>

                                            </div>
                                            {/* <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Status
                                                </label>
                                                <select
                                                    name="Status"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.Status}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Scheduled</option>
                                                    <option value="2">Held</option>
                                                    <option value="3">Canceled</option>



                                                </select>

                                            </div> */}
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Task Outcome
                                                </label>
                                                <select
                                                    name="TaskOutcome"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.TaskOutcome}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">Long Term Prospect</option>
                                                    <option value="2">Long Term Prospect</option>
                                                    <option value="3">Not Interested</option>



                                                </select>

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label className="" htmlFor="status">
                                                    Campaign
                                                </label>
                                                <select
                                                    name="Campaign"
                                                    id="status"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.Campaign}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="">Select</option>
                                                    <option value="1">ABC</option>
                                                    <option value="2">DEF</option>
                                                    <option value="3">Not Interested</option>



                                                </select>

                                            </div>
                                            <div className="col-md-12 col-lg-12">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Task Agenda

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="TaskSubject"
                                                    value={formValue?.TaskSubject}
                                                    onChange={handleFormChange}
                                                    placeholder="Task Agenda"
                                                />


                                            </div>




                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddTask;
