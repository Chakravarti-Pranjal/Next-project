import React,{ useEffect,useState } from 'react'
import avatar from "../../../../images/avatar/1.jpg";
import "./Profile.css"
import { Await,Link,useNavigate } from 'react-router-dom';
import { axiosOther } from '../../../../http/axios_base_url';
import { Changepasswordintialvalue } from "./Profileinfointialvalue";
import { changepasswordvalidationschema } from "./Profile_validation";
import { notifyError,notifyHotSuccess,notifySuccess } from "../../../../helper/notify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ProfileSettingMenu from './ProfileSettingMenu';
import ProfileViewer from './ProfileViewer';
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Changepassword = () => {
    const [formvalue,setFormValue] = useState(Changepasswordintialvalue)
    const [validationErrors,setValidationErrors] = useState({});
    const [showPassword,setShowPassword] = useState(false);
    const [showPasswords,setShowPasswords] = useState(false);
    const [showPasswordss,setShowPasswordss] = useState(false);
    const [data,setdata] = useState([])
    const navigate = useNavigate();
    // console.log(data,"data112")

    const getprofilelist = async () => {
        let Id = null;
        try {
            const token = localStorage.getItem("token");
            const persed = JSON.parse(token)
            console.log(persed,"persed")
            Id = persed?.UserID


            console.log(Id,"id1")

        } catch (error) {
            console.log(error,"error")

        }

        try {
            console.log(Id,"Id11")
            const data = await axiosOther.post("listusers",{ id: Id })
            setdata(data?.data?.Datalist)
            console.log(data?.data?.Datalist,'data')

        } catch (error) {
            console.log(error)

        }
    }
    useEffect(() => {
        getprofilelist()
    },[])

    const handlesubmit = async (e) => {
        e.preventDefault();
        setValidationErrors({});

        try {
            await changepasswordvalidationschema.validate(formvalue,{ abortEarly: false });

            const { data } = await axiosOther.post("update-password",formvalue);

            if (data?.Status !== 1) {
                notifyError(data?.message || data?.Message || "Something went wrong.");
                return;
            }

            notifyHotSuccess(data?.Message || data?.message || "Password updated successfully.");
            localStorage.setItem("success-message",data?.Message || data?.message);
            navigate("/user-profile");

        } catch (error) {
            // Validation errors
            if (error.name === "ValidationError" && error.inner) {
                const errorMessages = error.inner.reduce((acc,curr) => {
                    acc[curr.path] = curr.message;
                    return acc;
                },{});
                setValidationErrors(errorMessages);
            }

            // API response errors
            if (error.response?.data?.Errors) {
                const errors = Object.entries(error.response.data.Errors);
                alert(errors[0][1]);
                notifyError(errors[0][1]);
                console.log(errors,"API Errors");
            }

            console.error("Error in handleSubmit:",error);
        }
    };

    console.log(validationErrors,"error22")

    const handlechange = (e) => {
        const { name,value } = e.target;
        setFormValue((formvalue) => ({
            ...formvalue,
            [name]: value,
        }))
    }
    useEffect(() => {


        if (data) {
            setFormValue((formvalue) => ({
                ...formvalue,
                email: data.map((e) => e.Email).toString()
            }));
        }
    },[data]);
    console.log(formvalue,"formvalue")
    const handlereset = () => {
        setFormValue(Changepasswordintialvalue?.password)
        setFormValue(Changepasswordintialvalue?.password_confirmation)
    }




    return (
        <div className="Profile">
            <div className="row">
                <div className="col-lg-3 my-2 ">

                    {/* <div className="card ps-2">
                        <div className="card-body">
                            <div className="row">
                                <div className="card">
                                    <div className="card-body">


                                        <h2>Setup</h2>
                                        <span>General</span>
                                        <ul>
                                            <li >  <i className="fa-solid fa-gear me-2"></i> <div className="">Personal Setting</div> </li>
                                            <li >  <i className="fa-solid fa-envelope me-2"></i> <div className="">Email Setting</div></li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">

                                        <span>User & Permissons</span>
                                        <ul>
                                            <li>  <i className="fa-solid fa-user me-2"></i> User</li>
                                            <li>  <i className="fas fa-edit me-2"></i> Role</li>
                                            <li>  <i className="fa-solid fa-user me-2"></i>  Profiles</li>
                                            <li>  <i className="fa-solid fa-user me-2"></i>  User Department</li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-body">
                                        <span>Customization</span>
                                        <ul>
                                            <li>  <i className="fas fa-edit me-2"></i> Module</li>
                                            <li>  <i className="fas fa-edit me-2"></i> Email Templates</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div> */}

                    <ProfileSettingMenu />
                </div>
                <div className="col-lg-3 my-2">
                    {/* <div className="card
                    ">
                        <div className="card-body">
                            <div className="d-flex flex-column my-2 text-center">
                                {
                                    data?.map((item,index) => {
                                        return (

                                            <>
                                                <div className="d-flex justify-content-center align-items-center">

                                                    <img src={item?.ProfileLogoImageData || avatar} alt="" width="50%" height="50%" style={{ borderRadius: "50%" }} />
                                                </div>
                                                <h3>{item?.Name}</h3>
                                                <h3>{item?.role}</h3></>
                                        )
                                    })
                                }

                                <Link to="/user-profile/profile-info" className="btn btn-primary btn-custom-size my-2 mx-2">
                                    <i className="fa-solid fa-user me-2 text-light"></i>
                                    Personal Information
                                </Link>
                                <Link to="/user-profile/change-password" className="btn btn-dark btn-custom-size my-2 mx-2">
                                    <i className="fa-solid fa-lock me-2"></i>Change Password
                                </Link>

                            </div>
                        </div>
                    </div> */}

                    <ProfileViewer />

                </div>
                <div className="col-lg-6 my-2">

                    <div className="card-body">
                        <form
                            className="form-valide"
                            action="#"
                            method="post"
                            onSubmit={(e) => e.preventDefault()}
                        >



                            <div className="card p-2 mb-2 profileDetails Personal">
                                <div className="card-body">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <h2 className="mb-0">Change Password</h2>
                                        {/* <button className="btn btn-primary btn-custom-size">  <i className="bi bi-pencil me-1"></i> Edit</button> */}
                                    </div>

                                    <div className="row">
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Password</label>
                                            <div className="d-flex position-relative">
                                            <input
                                                type={showPassword ? "text" :"Password"}
                                                placeholder="Old Password"
                                                className="form-control form-control-sm pe-5"
                                                name="old_password"
                                                value={formvalue?.old_password}
                                                onChange={(e) => handlechange(e)}
                                            />
                                            <span
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="mx-2 mt-1 position-absolute end-0"
                                              
                                            >
                                            {showPassword ? <i className="fa-solid fa-eye fs-6  text-red"></i> : <i className="fa-solid fa-eye-slash fs-6 text-danger"></i>}
                                            </span>
                                           
                                        </div>
                                        {validationErrors?.old_password && (
                                                <div
                                                    id="val-username1-error"
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.old_password}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>New Password</label>
                                            <div className="d-flex position-relative">
                                            <input
                                                type={showPasswords ? "text" :"Password"}
                                                placeholder="New Password"
                                                className="form-control form-control-sm pe-5"
                                                onChange={(e) => handlechange(e)}
                                                name="password"
                                            />
                                            <span
                                                onClick={() => setShowPasswords(!showPasswords)}
                                                className="mx-2 mt-1 position-absolute end-0"
                                              
                                            >
                                            {showPasswords ? <i className="fa-solid fa-eye fs-6  text-red"></i> : <i className="fa-solid fa-eye-slash fs-6 text-danger"></i>}
                                            </span>
                                            </div>

                                            {validationErrors?.password && (
                                                <div
                                                    id="val-username1-error"
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.password}
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Confirm Password</label>
                                            <div className="d-flex position-relative">
                                            <input
                                                type={showPasswordss?"text":"password"}
                                                placeholder="Confirm Password"
                                                className="form-control form-control-sm pe-5"
                                                name="password_confirmation"
                                                onChange={(e) => handlechange(e)}

                                            />
                                               <span
                                                onClick={() => setShowPasswordss(!showPasswordss)}
                                                className="mx-2 mt-1 position-absolute end-0"
                                              
                                            >
                                            {showPasswordss ? <i className="fa-solid fa-eye fs-6  text-red"></i> : <i className="fa-solid fa-eye-slash fs-6 text-danger"></i>} </span>
                                            </div>
                                            {validationErrors?.password_confirmation && (
                                                <div
                                                    id="val-username1-error"
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.password_confirmation}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className="row pb-1">
                                <div className="col-12 d-flex gap-3 justify-content-end">
                                    <button
                                        onClick={handlesubmit}
                                        className="btn btn-primary btn-custom-size"
                                    >
                                        Update
                                    </button>
                                    <button
                                        className="btn btn-dark btn-custom-size"
                                        name="SaveButton"
                                        onClick={() => navigate(-1)}

                                    >
                                        <span className="me-1" >Back</span>

                                    </button>

                                </div>
                            </div>
                        </form>
                    </div>

                </div>


            </div>
        </div>
    )
}

export default Changepassword