import React, { useState, useEffect } from "react";
import "bootstrap-daterangepicker/daterangepicker.css";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { axiosOther } from "../../../../http/axios_base_url";
import { OperationRestrictedValidationSchema } from "../master_validation.js";
import { OperationRestrictionIntialValue } from "../masters_initial_value.js";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { Row, Card, Col, Button, Modal, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Table from "react-bootstrap/Table";
import { ClipLoader } from 'react-spinners';
import moment from 'moment';
import { useNavigate } from "react-router-dom";


const OperationRestricted = () => {

    const [selectBtn, setSelectBtn] = useState("Newest");
    const [modalCentered, setModalCentered] = useState(false);
    const [modalTable, setModalTable] = useState(false);
    const [modalWithTooltip, setModalWithTooltip] = useState(false);
    const [operationDropdown, setOperationDropdown] = useState('');
    const [operationName, setOperationName] = useState("Hotel");
    const [operationId, setOperationId] = useState(3);
    const [initialList, setInitialList] = useState([]);
    const [modalTableList, setModalTableList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formValue, setFormValue] = useState(OperationRestrictionIntialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const [filterValue, setFilterValue] = useState([]);
    const [filterInput, setFiterInput] = useState("");
    const navigate = useNavigate();

    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const handlePageChange = (page) => setCurrentPage(page - 1);
    const handleRowsPerPageChange = (newRowsPerPage) =>
        setRowsPerPage(newRowsPerPage);

    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("listproduct");
            setOperationDropdown(data?.Datalist)
        } catch (error) {
            console.log("operationdropdown-error", error);
        }

    };
    const getOperationList = async () => {
        switch (operationName) {
            case "Hotel":
                try {
                    const { data } = await axiosOther.post("hotellist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("hotel-error", error);
                }
                break;
            case "Activity":
                try {
                    const { data } = await axiosOther.post("activitymasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("activity-error", error);
                }
                break;
            case "Entrance":
                try {
                    const { data } = await axiosOther.post("monumentmasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("enterance-error", error);
                }
                break;
            case "Airlines":
                try {
                    const { data } = await axiosOther.post("airlinemasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("enterance-error", error);
                }
                break;
            case "Guide":
                try {
                    const { data } = await axiosOther.post("guidelist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("guidelist-error", error);
                }
                break;
            case "Insurance":
                try {
                    const { data } = await axiosOther.post("insurancetypemasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("Insurance-error", error);
                }
                break;
            case "Invoice":
                try {
                    const { data } = await axiosOther.post("monumentmasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("enterance-error", error);
                }
                break;
            case "Monument":
                try {
                    const { data } = await axiosOther.post("monumentmasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("enterance-error", error);
                }
                break;
            case "Restaurant":
                try {
                    const { data } = await axiosOther.post("restaurantmasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("enterance-error", error);
                }
                break;
            case "Train":
                try {
                    const { data } = await axiosOther.post("trainMasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("train-error", error);
                }
                break;
            case "Transfer":
                try {
                    const { data } = await axiosOther.post("transfermasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("transfer-error", error);
                }
                break;
            case "Visa":
                try {
                    const { data } = await axiosOther.post("visatypemasterlist");
                    setInitialList(data?.DataList);
                    setFilterValue(data?.DataList);
                } catch (error) {
                    console.log("visa-error", error);
                }
                break;

        }


    }
    useEffect(() => {
        getListDataToServer();
    }, []);

    const handleOperationModalTable = async (row) => {
        try {
            const { data } = await axiosOther.post("operationreslist", {
                ProductId: operationId,
                ProductName: operationName,
                ServiceId: row?.id
            });
            setModalTableList(data?.data)
        } catch (error) {
            console.log("operationdropdown-error", error);
        }
        setModalTable(true)


    }


    const handleCalender = (date) => {

        const formattedDate = date.toISOString().split("T")[0];
        setFormValue({
            ...formValue,
            restriction_json: {
                ...formValue.restriction_json,
                FromDate: formattedDate,
            },
        });

    };
    const handleToCalender = (date) => {
        const formattedDate = date.toISOString().split("T")[0];
        setFormValue({
            ...formValue,
            restriction_json: {
                ...formValue.restriction_json,
                ToDate: formattedDate,
            },
        });
    }


    // table data filtering -- with useeffect
    useEffect(() => {
        const filteredList = initialList?.filter(
            (data) =>
                data?.HotelDestination?.Destinationame?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.Destinationame?.toLowerCase()?.includes(filterInput?.toLowerCase())
        );
        setFilterValue(filteredList);
    }, [filterInput]);

    const modal_table_columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (
                <span className="font-size-11">
                    {currentPage * rowsPerPage + index + 1}
                </span>
            ),
            sortable: false,
            width: "4rem",
            style: {
                display: "flex",
                justifyContent: "center"
            }
        },
        {
            name: "Date",
            selector: (row) => <div>from - to </div>,
            sortable: true,
            width: "10rem"
        },
        {
            name: "Action",
            selector: (row) => {
                return (
                    <div className="d-flex align-items-center gap-1 sweetalert">
                        <i
                            className="fa-solid fa-pencil cursor-pointer text-success action-icon"
                        //   onClick={() => handleEdit(row)}
                        ></i>
                        <div className="sweetalert mt-5"></div>
                        <i
                            className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                        //   onClick={() => handleDelete(row?.id)}
                        ></i>
                    </div>




                );
            },
            width: "14rem",
        },
    ]

    const table_columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (
                <span className="font-size-11">
                    {currentPage * rowsPerPage + index + 1}
                </span>
            ),
            sortable: false,
            width: "4rem",
            style: {
                display: "flex",
                justifyContent: "center"
            }
        },
        ...(operationName === "Hotel" ? [
            {
                name: "Hotel Id",
                selector: (row) => row?.HotelUniqueID,
                cell: (row) => (
                    <span>
                        {row?.HotelUniqueID}
                    </span>
                ),
                sortable: true,
                minWidth: "6rem"
            }
        ] : []),
        ...(operationName === "Hotel" ? [
            {
                name: "Hotel Chain Name",
                selector: (row) => row?.HotelBasicDetails?.HotelChain?.ChainName,
                cell: (row) => (
                    <span>
                        {row?.HotelBasicDetails?.HotelChain?.ChainName}{" "}
                        {row?.Default == "Yes" && (
                            <i className="mdi mdi-check-circle-outline text-success fs-4"></i>
                        )}

                    </span>
                ),
                sortable: true,
                minWidth: "8rem"
            }
        ] : []),


        {
            name: "Name",
            selector: (row) =>
                row?.HotelName ||
                row?.ServiceName ||
                row?.MonumentName ||
                "",
            cell: (row) => (
                <span>

                    {
                        row?.HotelName ? row?.HotelName : row?.ServiceName ? row?.ServiceName : row?.MonumentName ? row?.MonumentName : ''
                    }

                </span>
            ),
            sortable: true,
            minWidth: "4rem"
        },
        {
            name: "Location",
            selector: (row) =>
                row?.HotelDestination?.Destinationame || row?.DestinationName || "",
            cell: (row) => <span>{row?.HotelDestination?.Destinationame ? row?.HotelDestination?.Destinationame : row?.DestinationName ? row?.DestinationName : ''}</span>,
            sortable: true,
            width: operationName === "Activity" ? "6rem" : "18rem"
        },
        {
            name: "Restricted Date",
            selector: (row) => <button
                type="submit"
                className="btn btn-dark btn-custom-size"
                onClick={() => handleOperationModalTable(row)}
            >
                View
            </button>,
            sortable: false,
            width: "10rem"
        },


        {
            name: "Operation Restriction",
            selector: (row) => {
                return (
                    <button
                        type="submit"
                        className="btn btn-primary btn-custom-size d-flex align-items-center gap-1" onClick={() => handleEdit(row)}
                    >
                        <i class="fa-solid fa-plus text-white text-center" ></i>
                        <span>Operation Restriction</span>

                    </button>




                );
            },
            width: "14rem",
        },
    ];

    const column = [
        {
            name: "Sr. No.",
            selectorhtffgghgfdfg: (row, index) => (
                <span className="font-size-11">
                    hkh
                </span>
            ),
            sortable: true,
            width: "4rem",
            style: {
                display: "flex",
                justifyContent: "center"
            }
        },
    ]

    const getFromDate = () => {
        const fromDate = formValue.restriction_json?.FromDate;

        return fromDate ? new Date(fromDate) : null;
    };


    const getToDate = () => {
        const ToDate = formValue.restriction_json?.ToDate
        return ToDate ? new Date(ToDate) : null;
    };

    const handleDescription = (e) => {
        const { value } = e.target;
        setFormValue({
            ...formValue,
            restriction_json: {
                ...formValue.restriction_json,
                Reason: value,
            },
        });

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await OperationRestrictedValidationSchema.validate(formValue, {
                abortEarly: false,
            });
            setValidationErrors({});

            const { data } = await axiosOther.post("addupdateoperation", formValue);
            // setLoading(true)
            if (data?.Status == 1) {
                // setLoading(false)
                getListDataToServer();
                setModalCentered(false)
                setFormValue(OperationRestrictionIntialValue);
                notifySuccess(data?.message || data?.Message);


            }

            if (data?.Status != 1) {
                // setLoading(false)
                notifyError(data?.message || data?.Message);
            }
        } catch (error) {
            if (error.inner) {
                const validationErrors = error.inner.reduce((acc, curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                }, {});
                setValidationErrors(validationErrors);
            }

            if (error.response?.data?.Errors) {
                const data = Object.entries(error.response?.data?.Errors);
                notifyError(data[0][1]);
            }
        }


    }

    const handleEdit = (value) => {
        setModalCentered(true)
        setFormValue({
            ...formValue,
            productId: operationId,
            productName: operationName,
            restriction_json:
            {
                serviceId: value?.id,
                serviceName: value?.ServiceName ? value?.ServiceName : value?.MonumentName ? value?.MonumentName : value?.HotelName ? value?.HotelName : '',
                destinationId: value?.DestinationId ? value?.DestinationId : value?.HotelDestination ? value?.HotelDestination?.DestinationId : '',
                destinationName: value?.DestinationName ? value?.DestinationName : value?.HotelDestination ? value?.HotelDestination?.Destinationame : '',

            },
        })

    };

    const handleTableEdit = (data) => {
        setModalTable(false)
        setModalCentered(true)
        setFormValue({
            productId: data?.ProductId,
            productName: data?.ProductName,
            restriction_json:
            {
                serviceId: data?.Restriction?.serviceId,
                serviceName: data?.Restriction?.serviceName,
                destinationId: data?.Restriction?.destinationId,
                destinationName: data?.Restriction?.destinationName,
                FromDate: data?.Restriction?.FromDate,
                ToDate: data?.Restriction?.ToDate,
                Reason: data?.Restriction?.Reason,
                UpdatedBy: 1,
                AddedBy: 0

            },
        })
    }

    const handleDelete = async (id) => {
        const confirmation = await swal({
            title: "Are you sure want to Delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirmation) {
            try {
                const { data } = await axiosOther.post("deleteoperation", {
                    Id: id,
                });
                if (data?.Status == 1 || data?.status == 1 || data?.result) {
                    notifySuccess(data?.Message || data?.message || data?.result);
                    getListDataToServer();
                }
            } catch (err) {
                if (err) {
                    notifyError(err?.message || err?.Message);
                    //   alert(err?.message || err?.Message);
                }
            }
        }
    };
    // handlign form changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const hanldeOperationList = (e) => {
        const selectedOption = e.target.options[e.target.selectedIndex];
        const selectedId = selectedOption ? selectedOption.dataset.id : null;
        setOperationId(selectedId)
        setOperationName(e.target.value)
    }
    useEffect(() => {
        getOperationList()
    }, [operationName])

    return (
        <>

            {/* {loading ? (
        <ClipLoader color="#36D7B7" loading={loading} size={50} />
      ):( */}
            <Modal className="fade" show={modalCentered}>
                <Modal.Header>
                    <ToastContainer />
                    <Modal.Title>Add Operation Restriction</Modal.Title>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant=""
                        className="btn-close"
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        {/* <div className="col-lg-12"> */}
                        <div className="col-6">
                            <label >From Date
                                <span className="text-danger">*</span>
                                {validationErrors?.['restriction_json.FromDate'] && (
                                    <div
                                        id="val-username1-error"
                                        className="invalid-feedback animated fadeInUp"
                                        style={{ display: "block" }}
                                    >
                                        {validationErrors?.["restriction_json.FromDate"]}
                                    </div>)}
                            </label>

                            <DatePicker
                                className="form-control form-control-sm"
                                selected={getFromDate()}
                                onChange={(e) => handleCalender(e)}
                                dateFormat="dd-MM-yyyy"
                                style={{
                                    transform: " translate3d(7px, 80px, 0px)",
                                }}
                                isClearable todayButton="Today"
                            />
                        </div>
                        <div className="col-6 p-0">
                            <label > To Date
                                <span className="text-danger">*</span>
                                {validationErrors?.['restriction_json.ToDate'] && (
                                    <span
                                        id="val-username1-error"
                                        className="invalid-feedback animated fadeInUp"
                                        style={{ display: "block" }}
                                    >
                                        {validationErrors?.['restriction_json.ToDate']}
                                    </span>)}</label>
                            <DatePicker
                                className="form-control form-control-sm"
                                selected={getToDate()}
                                onChange={(e) => handleToCalender(e)}
                                dateFormat="dd-MM-yyyy"
                                style={{
                                    transform: " translate3d(7px, 80px, 0px)",
                                }}
                                isClearable todayButton="Today"
                            />
                        </div>
                        <div className="col-12 ">
                            <div className="form-group">
                                <label htmlFor="exampleFormControlTextarea1" >
                                    Reason
                                    <span className="text-danger">*</span>
                                    {validationErrors?.["restriction_json.Reason"] && (
                                        <div
                                            id="val-username1-error"
                                            className="invalid-feedback animated fadeInUp"
                                            style={{ display: "block" }}
                                        >
                                            {validationErrors?.["restriction_json.Reason"]}
                                        </div>)}
                                </label>

                                <textarea id="" name="Reason" rows="2" cols="20" onChange={handleDescription} className="form-control form-control-sm" style={{ minHeight: '60px' }}>
                                    {formValue.restriction_json?.Reason || ""}</textarea>

                            </div>
                        </div>

                        {/* </div> */}
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalCentered(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSubmit}>Save changes</Button>
                </Modal.Footer>
            </Modal>
            {/* )} */}
            <Modal className="fade" show={modalTable}>
                <Modal.Header>
                    <Modal.Title>Add Operation Restriction</Modal.Title>
                    <Button
                        onClick={() => setModalTable(false)}
                        variant=""
                        className="btn-close"
                    >

                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <Table responsive striped bordered>
                            <thead >
                                <tr >
                                    <th scope="col" className="font-size-12 ">
                                        <strong>S.No</strong>
                                    </th>
                                    <th scope="col" className="font-size-12 ">
                                        <strong>Date</strong>
                                    </th>
                                    <th scope="col" className="font-size-12">
                                        <strong>Reason</strong>
                                    </th>
                                    <th scope="col" className="font-size-12">
                                        <strong>Action</strong>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalTableList?.length > 0 ? modalTableList?.map((data, index) => {
                                    return (
                                        <tr key={index}>
                                            <td className="font-size10">{index + 1}</td>
                                            <td className="font-size10">{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}-{moment(data?.Restriction?.FromDate).format('DD-MM-YYYY')}</td>
                                            <td className="font-size10">{data?.Restriction?.Reason}</td>
                                            <td className="font-size10"><span className="d-flex gap-1">
                                                <i
                                                    className="fa-solid fa-pencil cursor-pointer action-icon text-success"
                                                    data-toggle="modal"
                                                    data-target="#modal_form_vertical"
                                                    onClick={() =>
                                                        handleTableEdit(data)
                                                    }
                                                ></i>
                                                <i
                                                    className="fa-solid fa-trash-can cursor-pointer text-danger action-icon"
                                                    onClick={() =>
                                                        handleDelete(
                                                            data?.Id
                                                        )
                                                    }
                                                ></i>
                                            </span></td>
                                        </tr>
                                    )

                                }) : (
                                    <div className="text-center mt-3 d-flex justify-content-center">No record found</div>
                                )}

                            </tbody>
                        </Table>


                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={() => setModalTable(false)}
                        variant="danger light"
                    >
                        Close
                    </Button>

                </Modal.Footer>
            </Modal>

            <Tab.Container defaultActiveKey="All">
                <div className="d-flex justify-content-between align-items-center flex-wrap">
                    <div className="card-action coin-tabs mb-2">
                        <Nav as="ul" className="nav nav-tabs">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link" eventKey="All">
                                    All List
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </div>
                    <div className="col-3">

                        <div >
                            <select
                                name="operationName"
                                id=""
                                className="form-control form-control-sm form-query"
                                style={{ border: '1px solid grey' }}
                                value={operationName}
                                onChange={hanldeOperationList}

                            >
                                <option value="">Select</option>
                                {operationDropdown && operationDropdown?.length > 0 && operationDropdown?.map((value, index) => {
                                    return (
                                        <option value={value?.name} key={index} data-id={value?.id} >
                                            {value?.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>

                    </div>
                    <div className="col-3">
                        <div className="nav-item d-flex align-items-center">
                            <div className="input-group search-area">
                                <input
                                    type="text"
                                    className="form-control form-control-sm "
                                    style={{ border: '1px solid grey' }}
                                    placeholder="Destination"
                                    onChange={(e) => setFiterInput(e.target.value)}
                                />

                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center mb-2 flex-wrap">
                        <button
                            className="btn btn-dark btn-custom-size"
                            onClick={() => navigate(-1)}
                        >
                            <span className="me-1">Back</span>
                            <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                        </button>
                    </div>
                </div>
                <UseTable
                    table_columns={table_columns}
                    filterValue={filterValue}
                    setFilterValue={setFilterValue}
                    rowsPerPage={rowsPerPage}
                    handlePage={handlePageChange}
                    handleRowsPerPage={handleRowsPerPageChange}
                />
            </Tab.Container>
        </>
    );
};
export default OperationRestricted;
