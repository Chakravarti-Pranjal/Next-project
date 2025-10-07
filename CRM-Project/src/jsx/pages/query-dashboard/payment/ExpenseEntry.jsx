import React, { useState, useEffect } from "react";
import { Dropdown, Tab, Nav } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../http/axios_base_url";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import swal from "sweetalert";
import { notifySuccess, notifyError } from "../../../../helper/notify.jsx";
import UseTable from "../../../../helper/UseTable.jsx";
import { scrollToTop } from "../../../../helper/scrollToTop.js";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ✅ Helper function to get default form values
const getDefaultFormValue = (currencyList) => {
    const queryData = JSON.parse(localStorage.getItem("Query_Qoutation") || "{}");
    const quotationList = JSON.parse(localStorage.getItem("qoutationList") || "[]")[0] || {};
    const token = JSON.parse(localStorage.getItem("token") || "{}");

    return {
        id: "",
        QueryId: queryData?.QueryID || "",
        ReferenceNo: quotationList?.ReferenceNo || queryData?.ReferenceId,
        TourId: quotationList?.TourId || queryData?.TourId,
        QuotationNo: queryData?.QoutationNum || "",
        CompanyId: token?.companyKey || "",
        AddedBy: 1,
        UpdatedBy: 1,
        ExpenseJson: {
            date: "",
            type: "",
            currencyId: "1",
            amount: "",
            narration: "",
            paidto: ""
        }
    };
};

const ExpenseEntry = () => {
    const [formValue, setFormValue] = useState(getDefaultFormValue([]));
    const [validationErrors, setValidationErrors] = useState({});
    const [initialList, setInitialList] = useState([]);
    const [filterValue, setFilterValue] = useState([]);
    const [filterInput, setFilterInput] = useState("");
    const [currencyList, setCurrencyList] = useState([]);
    const [ExpenseType, setExpenseType] = useState([])
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handlePageChange = (page) => setCurrentPage(page - 1);
    const handleRowsPerPageChange = (newRowsPerPage) => setRowsPerPage(newRowsPerPage);

    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("expenseentrieslist", {
                QueryId: queryQuotation?.QueryID,
                QuotationNo: queryQuotation?.QoutationNum,
                TourId: queryQuotation?.TourId
            });
            setInitialList(data?.DataList || []);
            setFilterValue(data?.DataList || []);
        } catch (error) {
            console.log("expense-error", error);
        }
        try {
            const { data } = await axiosOther.post("listproduct");
            setExpenseType(data?.Datalist || []);
        } catch (error) {
            console.log("product-error", error);
        }
    };
    console.log(ExpenseType, "ExpenseType")

    const getCurrencyList = async () => {
        try {
            const { data } = await axiosOther.post("currencymasterlist");
            setCurrencyList(data?.DataList || []);
            const defaultForm = getDefaultFormValue(data?.DataList || []);
            setFormValue(defaultForm);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        getListDataToServer();
        getCurrencyList();
    }, []);

    useEffect(() => {
        const filteredList = initialList?.filter(
            (data) =>
                data?.ExpenseJson?.narration?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.ExpenseJson?.type?.toLowerCase()?.includes(filterInput?.toLowerCase()) ||
                data?.ExpenseJson?.paidto?.toLowerCase()?.includes(filterInput?.toLowerCase())
        );
        setFilterValue(filteredList);
    }, [filterInput, initialList]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        if (["type", "amount", "narration", "paidto", "currencyId"].includes(name)) {
            setFormValue((prev) => ({
                ...prev,
                ExpenseJson: {
                    ...prev.ExpenseJson,
                    [name]: value
                }
            }));
        } else {
            setFormValue((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCalender = (date) => {
        setFormValue((prev) => ({
            ...prev,
            ExpenseJson: {
                ...prev.ExpenseJson,
                date: date ? date.toISOString().split('T')[0] : ""
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {};
        const { ExpenseJson } = formValue;

        if (!ExpenseJson.date) errors.date = "Expense Date is required.";
        if (!ExpenseJson.type.trim()) errors.type = "Expense Type is required.";
        if (!ExpenseJson.amount || isNaN(ExpenseJson.amount)) errors.amount = "Amount is required.";
        if (!ExpenseJson.paidto.trim()) errors.paidto = "Paid To is required.";
        if (!ExpenseJson.narration.trim()) errors.narration = "Narration is required.";

        setValidationErrors(errors);

        // if (Object.keys(errors).length > 0) {
        //     notifyError("Please fill in all required fields.");
        //     return;
        // }

        try {
            const payload = { ...formValue };
            const apiEndpoint = isEditing ? "updateexpenseentries" : "addexpenseentries";
            const { data } = await axiosOther.post(apiEndpoint, payload);

            if (data?.status == 1 || data?.Status == 200) {
                getListDataToServer();
                setFormValue(getDefaultFormValue(currencyList));
                setIsEditing(false);
                setValidationErrors({});
                notifySuccess(data?.message || data?.Message);
            } else {
                notifyError(data?.message || data?.Message);
            }
        } catch (error) {
            console.log(error)
            // notifyError(error?.message || "An error occurred");
        }
    };

    const handleEdit = (row) => {
        setFormValue({
            id: row.id,
            QueryId: row.QueryId || "",
            ReferenceNo: row.ReferenceNo || "",
            TourId: row.TourId || "",
            QuotationNo: row.QuotationNo || "",
            CompanyId: row.CompanyId || "",
            AddedBy: row.AddedBy || 1,
            UpdatedBy: row.UpdatedBy || 1,
            ExpenseJson: {
                date: row.ExpenseJson.date || "",
                type: row.ExpenseJson.type || "",
                currencyId: +(row.ExpenseJson.currencyId) || "",
                amount: row.ExpenseJson.amount || "",
                narration: row.ExpenseJson.narration || "",
                paidto: row.ExpenseJson.paidto || ""
            }
        });
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        const confirmation = await swal({
            title: "Are you sure want to Delete?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirmation) {
            try {
                const { data } = await axiosOther.post("deleteexpenseentries", { id });
                if (data?.status == 1 || data?.Status == 200) {
                    notifySuccess(data?.Message || data?.message);
                    getListDataToServer();
                } else {
                    notifyError(data?.message || data?.Message);
                }
            } catch (err) {
                notifyError(err?.message || err?.Message);
            }
        }
    };

    const table_columns = [
        {
            name: "Sr. No.",
            selector: (row, index) => (
                <span className="font-size-11">{currentPage * rowsPerPage + index + 1}</span>
            ),
            sortable: false,
            width: "5rem",
        },
        {
            name: "Date",
            selector: (row) => row?.ExpenseJson?.date,
            cell: (row) => <span>{row?.ExpenseJson?.date}</span>,
            sortable: true,
            minWidth: "10rem",
        },
        {
            name: "Type",
            selector: (row) => row?.ExpenseJson?.type,
            cell: (row) => <span>{row?.ExpenseJson?.type}</span>,
            sortable: true,
            minWidth: "10rem",
        },
        {
            name: "Currency",
            selector: (row) => row?.ExpenseJson?.currency,
            cell: (row) => <span>{row?.ExpenseJson?.currency}</span>,
            sortable: true,
            minWidth: "10rem",
        },
        {
            name: "Amount",
            selector: (row) => row?.ExpenseJson?.amount,
            cell: (row) => <span>{row?.ExpenseJson?.amount}</span>,
            sortable: true,
            minWidth: "10rem",
        },
        {
            name: "Paid To",
            selector: (row) => row?.ExpenseJson?.paidto,
            cell: (row) => <span>{row?.ExpenseJson?.paidto}</span>,
            sortable: true,
            width: "10rem",
        },
        {
            name: "Narration",
            selector: (row) => row?.ExpenseJson?.narration,
            cell: (row) => <span>{row?.ExpenseJson?.narration}</span>,
            sortable: true,
        },
        {
            name: "Action",
            selector: (row) => (
                <div className="d-flex align-items-center gap-1 sweetalert">
                    <i
                        className="fa-solid fa-pencil cursor-pointer text-success action-icon"
                        onClick={() => handleEdit(row)}
                    ></i>
                    <i
                        className="fa-solid fa-trash-can cursor-pointer text-danger action-icon sweet-confirm"
                        onClick={() => handleDelete(row?.id)}
                    ></i>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Create New Expense</h4>
                            <div>
                                <button className="btn btn-dark btn-custom-size me-2" onClick={() => navigate(-1)}>
                                    <span className="me-1">Back</span>
                                    <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                                </button>
                                <button
                                    className="btn btn-primary btn-custom-size "
                                    name="SaveButton"
                                    onClick={() => navigate("/query/vouchers")}
                                >
                                    <span className="me-1">Next</span>
                                    <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="form-validation">
                                <ToastContainer />
                                <form className="form-valide" onSubmit={handleSubmit}>
                                    <div className="row">
                                        <div className="col-12">
                                            <div className="row form-row-gap">
                                                {/* Date */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="date">Expense Date <span className="text-danger">*</span></label>
                                                    <DatePicker
                                                        popperProps={{
                                                            strategy: "fixed", // Ensures the popper is positioned relative to the viewport
                                                        }}
                                                        className="form-control form-control-sm"
                                                        selected={formValue.ExpenseJson.date ? new Date(formValue.ExpenseJson.date) : null}
                                                        name="date"
                                                        onChange={handleCalender}
                                                        dateFormat="yyyy-MM-dd"
                                                        isClearable
                                                        todayButton="Today"
                                                    />
                                                    {validationErrors.date && (
                                                        <small className="text-danger">{validationErrors.date}</small>
                                                    )}
                                                </div>

                                                {/* Type */}
                                                {/* <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="type">Expense Type <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="type"
                                                        value={formValue.ExpenseJson.type}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors.type && <small className="text-danger">{validationErrors.type}</small>}
                                                </div> */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="type">Expense Type <span className="text-danger">*</span></label>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name="type"
                                                        value={formValue.ExpenseJson.type}
                                                        onChange={handleFormChange}
                                                    >
                                                        <option value="">All</option>
                                                        {ExpenseType.map((typeObj) => (
                                                            <option key={typeObj.id} value={typeObj.name}>
                                                                {typeObj.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {validationErrors.type && <small className="text-danger">{validationErrors.type}</small>}
                                                </div>

                                                {/* Currency */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="currency">Currency</label>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        name="currencyId"
                                                        value={formValue.ExpenseJson.currencyId}
                                                        onChange={handleFormChange}
                                                    >
                                                        {currencyList.length > 0 ? (
                                                            currencyList.map((currency) => (
                                                                <option key={currency.id} value={currency.id}>
                                                                    {currency.CurrencyName}
                                                                </option>
                                                            ))
                                                        ) : (
                                                            <option value="">Loading...</option>
                                                        )}
                                                    </select>
                                                </div>

                                                {/* Amount */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="amount">Amount <span className="text-danger">*</span></label>
                                                    <input
                                                        type="number"
                                                        className="form-control form-control-sm"
                                                        name="amount"
                                                        value={formValue.ExpenseJson.amount}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors.amount && (
                                                        <small className="text-danger">{validationErrors.amount}</small>
                                                    )}
                                                </div>

                                                {/* Paid To */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="paidto">Paid To <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="paidto"
                                                        value={formValue.ExpenseJson.paidto}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors.paidto && (
                                                        <small className="text-danger">{validationErrors.paidto}</small>
                                                    )}
                                                </div>

                                                {/* Narration */}
                                                <div className="col-md-6 col-lg-2">
                                                    <label htmlFor="narration">Narration <span className="text-danger">*</span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control form-control-sm"
                                                        name="narration"
                                                        value={formValue.ExpenseJson.narration}
                                                        onChange={handleFormChange}
                                                    />
                                                    {validationErrors.narration && (
                                                        <small className="text-danger">{validationErrors.narration}</small>
                                                    )}
                                                </div>

                                                {/* Buttons */}
                                                <div className="col-md-12 d-flex align-items-center mt-3 justify-content-end">
                                                    <button type="submit" className="btn btn-primary btn-custom-size">
                                                        {isEditing ? "Update" : "Submit"}
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-dark btn-custom-size ms-2"
                                                        onClick={() => {
                                                            setFormValue(getDefaultFormValue(currencyList));
                                                            setIsEditing(false);
                                                            setValidationErrors({});
                                                        }}
                                                    >
                                                        Reset
                                                    </button>
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

            <Tab.Container defaultActiveKey="All">
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

export default ExpenseEntry;
