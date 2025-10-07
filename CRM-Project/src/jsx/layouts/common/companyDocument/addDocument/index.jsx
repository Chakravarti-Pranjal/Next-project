import React, { useState, useEffect } from "react";
import { companyDocumentsInitialValue } from "../../../../pages/masters/masters_initial_value.js";
import { companyDocumentValidationSchema } from "../../../../pages/masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";
import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddDocument = () => {
    const [formValue, setFormValue] = useState(companyDocumentsInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();
    const param = useParams();

    console.log(state, "state")


    console.log(formValue, "formValue")
    // submitting data to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await companyDocumentValidationSchema.validate(
                {
                    ...formValue,

                },
                { abortEarly: false }
            );

            console.log("value-2", {
                ...formValue,

            });

            setValidationErrors({});
            const { data } = await axiosOther.post("addupdatecompanydocument",
                {
                    ...formValue,


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
        if (type == "file") {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = () => {
                const base64 = reader.result;
                const base64String = base64.split(",")[1];


                setFormValue({
                    ...formValue,
                    DocumentImageData: base64String,
                    DocumentImageName: file.name,
                });





            };
            reader.readAsDataURL(file);
        } else {
            setFormValue((prev) => ({
                ...prev,
                [name]: value,
            }));
        }




    };
    const handleRemarks = (data) => {
        const cleanedData = data.replace(/<[^>]*>/g, '');
        setFormValue((prevState) => ({
            ...prevState,
            Remarks: cleanedData,  // Update Description field in state
        }));
    }
    const getFromDate = () => {
        return formValue?.IssueDate ? new Date(formValue?.IssueDate) : null;
    };
    const getToDate = () => {
        return formValue?.ExpireDate ? new Date(formValue?.ExpireDate) : null;
    };
    const handleCalender = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setFormValue({
            ...formValue,
            IssueDate: formattedDate // Store the selected date as a Date object
        });
    };
    const handleExpiryCalender = (date) => {
        const formattedDate = date.toISOString().split('T')[0];
        setFormValue({
            ...formValue,
            ExpireDate: formattedDate // Store the selected date as a Date object
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
                PhoneNumber: "999909"
            })
        }

        if (state?.data) {

            setFormValue({
                ...formValue,

                id: state?.data?.id,
                DocumentName: state?.data?.DocumentName,
                DocumentNumber: state?.data?.DocumentNumber,
                DocumentImageName: state?.data?.DocumentImageName,
                DocumentImageData: '',
                Type: state?.data?.Type,
                IssueDate: state?.data?.IssueDate,
                ExpireDate: state?.data?.ExpireDate,
                Fk_partnerid: state?.data?.Fk_partnerid,
                Remarks: state?.data?.Remarks,
                Status: state?.data?.Status,
                AddedBy: "0",
                UpdatedBy: "1",

            })

        }
    }, [state])
    console.log("state-data", formValue);




    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header py-3">
                        <h4 className="card-title">Add Document : {state?.
                            partner_payload?.CompanyNmae[0]?.CompanyName}</h4>
                        <div className="d-flex gap-3">
                            {/* <Link to={`/view/${state?.partner_payload?.Type}/${param?.id}`}  className="btn btn-dark btn-custom-size">
                                Back
                            </Link> */}
                            <button
                                className="btn btn-dark btn-custom-size"
                                name="SaveButton"
                                onClick={() => navigate(-1)}
                            >
                                <span className="me-1">Back</span>
                                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                            </button>
                            <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
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


                                            <div className="col-md-6 col-lg-2">
                                                <label className="" htmlFor="name">
                                                    Document Name

                                                </label>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="DocumentName"
                                                    value={formValue?.DocumentName}
                                                    onChange={handleFormChange}
                                                    placeholder="Name"
                                                />


                                            </div>

                                            <div className="col-md-6 col-lg-2">

                                                <label className="" htmlFor="name">
                                                    Document Number

                                                </label>

                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="DocumentNumber"
                                                    value={formValue?.DocumentNumber}
                                                    onChange={handleFormChange}
                                                    placeholder="Document Number"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">


                                                <label className="" htmlFor="Issue Date">
                                                    Issue Date

                                                </label>
                                                <DatePicker className="form-control form-control-sm" selected={getFromDate()} name="FromDate" onChange={(e) => handleCalender(e)} dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label className="" htmlFor="Expiry Date">
                                                    Expiry Date </label>
                                                <DatePicker className="form-control form-control-sm" selected={getToDate()} name="FromDate" onChange={(e) => handleExpiryCalender(e)} dateFormat="yyyy-MM-dd" isClearable todayButton="Today" />

                                            </div>
                                            <div className="col-md-6 col-lg-2">

                                                <label className="" htmlFor="val-username">Document File </label>

                                                <input
                                                    type="file"
                                                    className="form-control form-control-sm"
                                                    id="val-username"
                                                    name="DocumentImageName"
                                                    onChange={handleFormChange}


                                                />

                                            </div>
                                            <div className="col-md-12 col-lg-12">
                                                <p> Remarks</p>


                                                <CKEditor
                                                    editor={ClassicEditor}
                                                    value={formValue?.Remarks || ""}
                                                    name="Remarks"
                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();
                                                        (data)

                                                    }}

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

export default AddDocument;
