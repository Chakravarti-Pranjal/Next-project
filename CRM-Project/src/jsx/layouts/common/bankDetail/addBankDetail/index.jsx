import React, { useState, useEffect } from "react";
import { agentBankDetailsInitialValue } from "../../../../pages/masters/masters_initial_value.js";
import { bankDetailsValidationSchema } from "../../../../pages/masters/master_validation.js";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import useMultipleSelect from "../../../../../hooks/custom_hooks/useMultipleSelect";
import useDestinationSelect from "../../../../../hooks/custom_hooks/useDestinationSelect";
import { axiosOther } from "../../../../../http/axios_base_url";
import "../../../../../scss/main.css";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const AddBankDetail = () => {
    const [formValue, setFormValue] = useState(agentBankDetailsInitialValue);
    const [validationErrors, setValidationErrors] = useState({});
    const { state } = useLocation();
    const navigate = useNavigate();
    const param = useParams();
    // const getDataToServer = async () => {
    console.log(state, "state")





    // };
    // useEffect(() => {
    //     getDataToServer();
    // }, []);

    console.log(formValue, "formValue")
    // submitting data to server
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bankDetailsValidationSchema.validate(
                {
                    ...formValue,


                },
                { abortEarly: false }
            );

            console.log("value-2", {
                ...formValue,

            });

            setValidationErrors({});
            const { data } = await axiosOther.post("addupdatebankdetails",
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
        return formValue?.ExpiryDate ? new Date(formValue?.ExpiryDate) : null;
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
            ExpiryDate: formattedDate // Store the selected date as a Date object
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
        else if (state) {
            setFormValue({
                ...formValue,

                id: state?.id,
                AccountNumber: state?.AccountNumber,
                BankName: state?.BankName,
                BankBranch: state?.BankBranch,
                CheckToDefault: state?.CheckToDefault,
                BenificiryName: state?.BenificiryName,
                Fk_partnerid: state?.Fk_partnerid,
                CheckToDefault: state?.CheckToDefault,
                PhoneNumber: state?.PhoneNumber,
                SwiftCode: state?.SwiftCode,
                Type: state?.Type,
                Status: state?.Status,
                Address: state?.Address,
                EmailId: state?.EmailId,
                AddedBy: "0",
                UpdatedBy: "1",

            })

        }
    }, [state])

    return (
        <div className="row">
            <div className="col-lg-12">
                <div className="card">
                    <div className="card-header py-3">
                        <h4 className="card-title"> Add Bank Detail : {state?.
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
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Bank Name

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="BankName"
                                                    value={formValue?.BankName}
                                                    onChange={handleFormChange}
                                                    placeholder="Bank Name"
                                                />


                                            </div>

                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Branch Name

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="BankBranch"
                                                    value={formValue?.BankBranch}
                                                    onChange={handleFormChange}
                                                    placeholder="Branch Name"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Benificiry Name

                                                    </label>
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="BenificiryName"
                                                    value={formValue?.BenificiryName}
                                                    onChange={handleFormChange}
                                                    placeholder="Benificiry Name"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Email Id

                                                    </label>
                                                </div>
                                                <input
                                                    type="eamil"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="EmailId"
                                                    value={formValue?.EmailId}
                                                    onChange={handleFormChange}
                                                    placeholder=" Email Id."
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Swift Code

                                                    </label>
                                                </div>
                                                <input
                                                    type="eamil"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="SwiftCode"
                                                    value={formValue?.SwiftCode}
                                                    onChange={handleFormChange}
                                                    placeholder="Swift Code"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Account No.

                                                    </label>
                                                </div>
                                                <input
                                                    type="eamil"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="AccountNumber"
                                                    value={formValue?.AccountNumber}
                                                    onChange={handleFormChange}
                                                    placeholder=" Account No."
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        Address

                                                    </label>
                                                </div>
                                                <input
                                                    type="eamil"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="Address"
                                                    value={formValue?.Address}
                                                    onChange={handleFormChange}
                                                    placeholder="Address"
                                                />


                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <div className="d-flex justify-content-between">
                                                    <label className="" htmlFor="name">
                                                        IFSC Code

                                                    </label>
                                                </div>
                                                <input
                                                    type="eamil"
                                                    className="form-control form-control-sm"
                                                    id="name"
                                                    name="IfscCode"
                                                    value={formValue?.IfscCode}
                                                    onChange={handleFormChange}
                                                    placeholder="IFSC Code"
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

export default AddBankDetail;
