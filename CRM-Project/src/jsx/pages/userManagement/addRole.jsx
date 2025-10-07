import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosOther } from '../../../http/axios_base_url';
import { roleAddValidation } from './user_validation';
import { Dropdown, Tab, Nav, Badge, Modal, Button, Row, Col } from "react-bootstrap";
import { notifyError } from '../../../helper/notify';
import { useDispatch } from 'react-redux';
import { setMessage } from '../../../store/actions/MessageAction';



const RecursiveAccordion = ({ data, reportingData, modalClose }) => {

    const [visibleIds, setVisibleIds] = useState([]); // Track which items are visible

    useEffect(() => {
        const getAllIds = (items) => {
            let ids = items.map((item) => item.id);
            items.forEach((item) => {
                if (item.children && item.children.length > 0) {
                    ids = ids.concat(getAllIds(item.children));
                }
            });
            return ids;
        };

        setVisibleIds(getAllIds(data)); // Initialize visibleIds with all IDs
    }, [data]);

    const handleToggle = (id) => {
        setVisibleIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const handleSetModalValue = (id) => {
        modalValue(true);
    };
    const hanldeReportingManager = (data) => {
        reportingData(data)
        modalClose(false)

    }

    return (
        <div >
            <ul>
                {data?.map((item, index) => (
                    <li className='ms-4 my-4'>
                        <div className='d-flex justify-content-start align-items-center gap-2 icon-roles cursor-pointer '
                            onClick={() => hanldeReportingManager(item)}
                        >
                            <i className={`fa-solid fa-${visibleIds.includes(item.id) ? "minus" : "plus"} bg-white p-1 d-block border-2 border-danger`} onClick={() => handleToggle(item.id)}></i>
                            <p className='m-0'>{item?.name}</p>


                        </div>
                        {item?.children && item?.children.length > 0 && visibleIds.includes(item.id) && (
                            <ul>
                                <li>
                                    <RecursiveAccordion data={item?.children} reportingData={(val) => hanldeReportingManager(val)} />
                                </li>
                            </ul>
                        )}

                    </li>
                ))}
            </ul>


        </div>
    );

}
const AddRole = () => {

    const { state } = useLocation();
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState({});
    const [modalReportingManager, setModalReportingManager] = useState(false);
    const [roleList, setRoleList] = useState([]);
    const [validationErrors, setValidationErrors] = useState({});
    const dispatch = useDispatch();
    console.log(state, "state")
    const getDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("listroles");

            setRoleList(data?.Datalist);
        } catch (err) {
            console.log(err);
        }

    };
    useCallback(() => {
    }, [])

    // const handleGSTArray = () => {
    //     setGSTarray([
    //         ...GSTarray,
    //         {
    //             StateId: '',
    //             GSTNo: '',
    //         },
    //     ]);
    // };
    // const handleDeleteGSTArray = (index) => {
    //     const updatedGSTarray = GSTarray.filter((_, idx) => idx !== index);
    //     setGSTarray(updatedGSTarray);
    // };
    useEffect(() => {
        console.log("state.editData:", state); // Debug
        getDataToServer();
        if (state) {
            setFormValue({
                name: state?.name || '',
                reporting_id: state?.reporting_id || '',
                description: state?.description || '',
                company_id: state?.company_id

            });
            setReportName(state.reporting_name || 'None');
        } else if (state?.ReportId) {
            setFormValue((prev) => ({
                ...prev,
                reporting_id: state.ReportId || '',
            }));
            setReportName(state.ReportName || 'None');
        }
    }, [state]);

    const hanldeReportId = (data) => {
        if (data?.id === state?.editData?.id) {
            notifyError("Cannot set the same role as its own reporting manager");
            return;
        }
        setFormValue((prev) => ({
            ...prev,
            reporting_id: data?.id || '',
        }));
        setReportName(data?.name || 'None');
        setModalReportingManager(false);
    };


    // useEffect(() => {
    //     getDataToServer();
    //     if (state?.ReportId) {
    //         setFormValue((prev) => (
    //             {
    //                 ...prev,
    //                 ["reporting_id"]: state?.ReportId
    //             }
    //         ))
    //         setReportName(state?.ReportName)
    //     }
    //     else if (state?.editData) {
    //         setFormValue((prev) => (
    //             {
    //                 ...prev,
    //                 ["reporting_id"]: state?.editData?.reporting_id,
    //                 ["name"]: state?.editData?.name,

    //             }
    //         ))
    //         setReportName(state?.editData?.reporting_name)
    //     }
    // }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let key = JSON.parse(localStorage.getItem("token"))?.companyKey;

        try {
            await roleAddValidation.validate(
                {
                    ...formValue,

                }, {
                abortEarly: false,
            });

            setValidationErrors({});
            let data = {};
            if (state?.editData) {
                data = await axiosOther.post("updateroles", {
                    ...formValue,
                    id: state?.editData?.id,
                    company_id: key,

                });
            } else {
                data = await axiosOther.post("addroles", {
                    ...formValue,
                    company_id: key,
                });
            }

            if (data?.data?.Status == 1) {
                navigate("/roles")

                // setIsEditing(false);
                setFormValue((prev) => ({
                    ...prev,
                    ["reporting_id"]: '',
                    ["name"]: '',
                    ["description"]: '',

                }));
                setReportName('')

                // getListDataToServer();
                dispatch(setMessage(data?.data?.message || data?.data?.Message))

                // notifySuccess(data?.message || data?.Message);
            } else {
                console.log(data)
                notifyError(data?.data?.message || data?.data?.Message || data?.errors.name || data?.data?.errors?.name?.[0]);
            }
        } catch (error) {
            if (error.inner) {
                const validationErrorss = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setValidationErrors(validationErrorss);
            }

            if (error.response?.data?.Errors || error.response?.data?.errors) {
                const data = Object.entries(
                    error.response?.data?.Errors || error.response?.data?.errors
                );
                notifyError(data[0][1]);
            }
        }
    };

    const [reportName, setReportName] = useState('')
    // const hanldeReportId = (data) => {
    //     setFormValue((prev) => ({
    //         ...prev,
    //         ["reporting_id"]: data?.id,
    //     }));
    //     setReportName(data?.name)
    // }
    const handleFormChange = (e) => {

        const { name, value } = e.target;


        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className='row'>
            <Modal className="fade" show={modalReportingManager}>
                <Modal.Header>
                    <ToastContainer />
                    <Modal.Title>Roles List</Modal.Title>
                    <Button
                        onClick={() => setModalReportingManager(false)}
                        variant=""
                        className="btn-close"
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <RecursiveAccordion data={roleList} reportingData={(val) => hanldeReportId(val)} modalClose={(val) => setModalReportingManager(val)} />
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalReportingManager(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>
                    <Button variant="primary" >Save changes</Button>
                </Modal.Footer>
            </Modal>
            <div className='col-lg-12'>
                <div className='card'>
                    <div className="card-header">
                        <h4 className="card-title">
                            Add Role
                        </h4>
                        <button
                            type="submit"
                            className="btn btn-dark btn-custom-size"
                            onClick={() => navigate(-1)}
                        >
                            Back
                            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded ms-1"></i>
                        </button>
                    </div>
                    <div className="card-body">
                        <div className="form-validation" >
                            <ToastContainer />
                            <form className="form-valide" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row form-row-gap">


                                            <div className="col-md-6 ">
                                                <label >Role Name
                                                    <span className='text-danger'>*</span>

                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    name="name"
                                                    placeholder="Enter Role Name"
                                                    value={formValue?.name}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.name && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.name}
                                                    </div>
                                                )}


                                            </div>
                                            <div className='col-md-6 '>
                                                <label>Reports To</label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    name="reporting_id"
                                                    placeholder="Enter Role Name"
                                                    value={reportName}
                                                    // onChange={handleFormChange}
                                                    onClick={() => setModalReportingManager(true)}
                                                />

                                            </div>
                                            <div className="col-12 p-0">
                                                <label > Role Description

                                                </label>

                                                <textarea
                                                    id="email-compose-editor"
                                                    name="description"
                                                    value={formValue?.description}
                                                    className="textarea_editor form-control bg-transparent"
                                                    rows="2"
                                                    placeholder="Enter text ..."
                                                    onChange={handleFormChange}
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3 mt-1">
                            <button
                                className="btn btn-dark btn-custom-size"
                                name="SaveButton"
                                onClick={() => navigate("/roles")}
                            >
                                <span className="me-1">Back</span>
                                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                            {/* <button
                                                    type="submit"
                                                    className="btn btn-secondary btn-custom-size"
                                                >
                                                    Reset
                                                </button> */}
                            <button
                                type="submit"
                                className="btn btn-primary btn-custom-size"
                                onClick={handleSubmit}
                            >
                                Submit
                                {/* {isEditing ? "Update" : "Submit"} */}
                            </button>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddRole