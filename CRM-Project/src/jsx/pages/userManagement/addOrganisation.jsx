import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosOther } from '../../../http/axios_base_url';
import useMultipleSelect from '../../../hooks/custom_hooks/useMultipleSelect';
import { companyIntialValue } from './user-intial-values';
import Select from "react-select";
import { PhoneInput } from "react-international-phone";
import "react-international-phone/style.css";
import { ThemeContext } from '../../../context/ThemeContext';
import { select_customStyles } from '../../../css/custom_style';
import {companyAddValidation} from './user_validation';

// const customStyles = {
//     control: (provided) => ({
//         width: "auto", // Set to 'auto' for responsive width
//         // Minimum height
//         height: "1.8rem", // Fixed height
//         padding: "0px", // Remove default padding
//         border: "1px solid #ccc7c7", // Border to define control
//         borderRadius: "0.5rem",
//         "&:hover": {
//             border: "1px solid #aaa",
//         },
//     }),
//     valueContainer: (provided) => ({
//         // ...provided,
//         padding: "0px", // Remove padding
//         paddingLeft: "4px",
//         height: "20px", // Match height
//         display: "flex",
//         alignItems: "center", // Center content vertically
//         justifyContent: "center", // Center content horizontally
//         textAlign: 'center'
//     }),
//     placeholder: (provided) => ({
//         // ...provided,
//         margin: "0", // Adjust placeholder margin
//         fontSize: "0.76562rem", // Adjust font size as needed
//         textAlign: "center", // Center text horizontally
//         flex: 1, // Allow placeholder to take available space
//         color: '#6e6e6e'
//     }),
//     singleValue: (provided) => ({
//         // ...provided,
//         margin: "0", // Adjust single value margin
//         fontSize: "0.76562rem", // Adjust font size as needed
//         textAlign: 'center'
//     }),
//     dropdownIndicator: (provided) => ({
//         // ...provided,
//         display: "none", // Hide the dropdown indicator (icon)
//     }),
//     option: (provided) => ({
//         ...provided,
//         padding: "4px 1px", // Padding for options
//         fontSize: "0.76562rem", // Adjust font size as needed
//         overflow: "hidden", // Prevent overflow
//         paddingLeft: "4px",
//     }),
//     menu: (provided) => ({
//         ...provided,
//         zIndex: 9999, // Ensure the dropdown appears above other elements
//         overflowY: "hidden", // Hide vertical scrollbar
//         overflowX: "hidden", // Hide horizontal scrollbar
//     }),
//     menuList: (provided) => ({
//         ...provided,
//         maxHeight: "150px", // Set maximum height for list
//         overflowY: "auto",
//         "&::-webkit-scrollbar": {
//             display: "none", // Hide scrollbar for Chrome/Safari
//             width: "2px",
//         },
//     }),
// };


const renderOptions = (data, level = 0) => {
    return data.map((item) => (
        <React.Fragment key={item.id}>
            <option value={item.id} >
                {item.name}
            </option>
            {item.children?.length > 0 && renderOptions(item.children, level + 1)}
        </React.Fragment>
    ));
};
const AddOrganisation = () => {
    const {background}=useContext(ThemeContext)
    const { state } = useLocation();

    console.log(state,"state")
    const navigate = useNavigate();
    const [formValue, setFormValue] = useState(companyIntialValue);
  
    const [destinationList, setDestinationList] = useState([]);
    const [roleList, setRoleList] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [country, setCountry] = useState("");
    const [stateList, setStateList] = useState([]);
    const [stateCity, setStateCity] = useState("");
    const [cityList, setCityList] = useState([]);
    const [city, setCity] = useState("");
    const [validationErrors, setValidationErrors] = useState({});
     const [phoneValue, setPhoneValue] = useState({
        PHONE: "",
        ALTERNATEPHONE: "",
       
      });
      const [GSTarray,setGSTarray]=useState([
        {
            StateId:'',
            GSTNo:''
        }
      ]);

    const countryOptions = countryList.map(item => ({
        value: item.id,
        label: item.Name
    }));
    const stateOptions = stateList.map(item => ({
        value: item.id,
        label: item.Name
    }));
    const cityOptions = cityList.map(item => ({
        value: item.id,
        label: item.Name
    }));
    const destinationOption = destinationList?.map((dest) => {
        return {
            value: dest?.id,
            label: dest?.Name,
        };
    });

    console.log(validationErrors, "validationErrors")

    const {
        SelectInput: DestinationInput,
        selectedData: destinationSelected,
        setSelectedData: setDestinationSelected,
    } = useMultipleSelect(destinationOption);

    const {
        SelectInput: RoleInput,
        selectedData: roleSelected,
        setSelectedData: setRoleSelected,
    } = useMultipleSelect(destinationOption);


    const getDataToServer = async () => { 
        
        try {
            const language = await axiosOther.post("destinationlist", {
                Search: "",
                Status: 1,
            });
            setDestinationList(language.data.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("countrylist", {
                Search: "",
                Status: 1,
            });

            setCountryList(data?.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("statelist", {
                Search: "",
                Status: 1,
            });

            setStateList(data?.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
            const { data } = await axiosOther.post("citylist", {
                Search: "",
                Status: 1,
            });

            setCityList(data?.DataList);
        } catch (err) {
            console.log(err);
        }
        try {
                    const { data } = await axiosOther.post("listroles");
        
                    setRoleList(data?.Datalist)
                } catch (error) {
                    console.log("user-error", error);
                }

    };
    useCallback(() => {

    }, [])
   
        const handleGSTArray = () => {
            setGSTarray([
              ...GSTarray,
              {
                StateId: '', 
                GSTNo: '', 
              },
            ]);
          };
          const handleDeleteGSTArray = (index) => {
            const updatedGSTarray = GSTarray.filter((_, idx) => idx !== index);
            setGSTarray(updatedGSTarray);
          };
    
   
    useEffect(() => {
        getDataToServer();
        console.log(state,"state")
        if(state){
            setFormValue({
                FK_PARENTID: state?.FK_PARENTID,
                COMPANYNAME: state?.COMPANYNAME,
                REGISTEREDEMAIL:state?.REGISTEREDEMAIL,
                ALTERNATEEMAIL:state?.ALTERNATEEMAIL,
                FirstName :state?.FirstName,
                LastName :state?.LastName,
              
                LICENSEKEY:state?.LICENSEKEY,
                PAN:state?.PAN,
                TAN:state?.TAN,
                CIN:state?.CIN,
                LUT:state?.LUT,
                GST:state?.GST,
                DESTINATION:[],
                ZIP:state?.ZIP,
                ADDRESS1:state?.ADDRESS1,
                ADDRESS2:state?.ADDRESS2,
                ISACTIVE: 1,
                ACTIONDATE:state?.ACTIONDATE,
                AddedBy:"1",
                email_key_id:"4"
            })
            setCountry(state?.COUNTRYID)
            setStateCity(state?.STATEID)
            setCity(state?.CITYID)
            setPhoneValue({
                  PHONE: state?.PHONE,
                ALTERNATEPHONE: state?.ALTERNATEPHONE,
            })
            setDestinationSelected(
                state?.Destination?.length > 0
                  ? state?.Destination.map((dest) => dest?.['DestinationId'])
                  : []
              );
        }
    }, []);
    console.log(stateCity,country,city , "para")
    const handleSubmit = async (e) => {
        e.preventDefault();
        let key =JSON.parse(localStorage.getItem("token"))?.companyKey;
        console.log( {...formValue,
            ...phoneValue,
            COMPANYKEY:key,
            DESTINATION: destinationSelected,
            COUNTRY: country,
            STATE:stateCity,
            CITY: city,
            GST:GSTarray

        } , "valid")
        try {
            await companyAddValidation.validate(
                {...formValue,
                ...phoneValue,
                COMPANYKEY:key,
                DESTINATION: destinationSelected,
                COUNTRY: country,
                STATE:stateCity,
                CITY: city,
                GST:GSTarray

            }, {
              abortEarly: false,
            });
           
            setValidationErrors({});
            const { data } = await axiosOther.post("createorg", {
                ...formValue,
                ...phoneValue,
                COMPANYKEY:key,
                DESTINATION: destinationSelected,
                COUNTRY: country,
                STATE:stateCity,
                CITY: city,
                GST:GSTarray

            });
            if (data?.Status === 1) {
                getListDataToServer();
                setIsEditing(false);
                setFormValue(userIntialValue);
                notifySuccess(data?.message || data?.Message);
            } else {
                notifyError(data?.message || data?.Message);
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

    console.log(state, city, country,validationErrors , "errors")
    const handleSelectChange = (selectedOption, name) => {

        switch (name) {
            case "country":
                setCountry(selectedOption.value)

                break;
            case "stateCity":
                setStateCity(selectedOption.value)

                break;
            case "city":
                setCity(selectedOption.value)

                break;
            case "currency":
                setFormValue({
                    ...formValue,
                    OthersInfo: {
                        ...formValue.OthersInfo,
                        CurrencyId: selectedOption.value,
                        CurrencyName: selectedOption.label
                    }
                })
                break;
            default:
                console.log("nothing")

        }
    };
    const handlePhoneChange = (phone, nameValue) => {
        setPhoneValue({ ...phoneValue, [nameValue]: phone });
      };
    
    const handleGSTChange=(index,event)=>{
        console.log(index,event)
        const { name, value } = event.target;
        const updatedGSTarray = [...GSTarray];
        updatedGSTarray[index][name] = value;
        setGSTarray(updatedGSTarray);
        console.log(GSTarray)
    }  
    const handleSelectStateChange=(selectedOption,name,index)=>{
        const updatedGSTarray = [...GSTarray];
        updatedGSTarray[index].StateId = selectedOption ? selectedOption.value : '';
        setGSTarray(updatedGSTarray);
    }
    const handleRoleChange = (event) => {
        const selectedRoleId = event.target.value;
        setFormValue({
            ...formValue,
            RoleId:selectedRoleId
        })
    
      };
    const handleFormChange = (e) => {

        const { name, value } = e.target;


        setFormValue((prev) => ({
            ...prev,
            [name]: (name === "PHONE" || name=== "ALTERNATEPHONE" || name=== "ISACTIVE" || name==="Designation") ? +value : value,
        }));
    };

    console.log(formValue, validationErrors, "formValue")
    return (
        <div className='row'>
            <div className='col-lg-12'>
                <div className='card'>
                    <div className="card-header">
                        <h4 className="card-title">
                        organisation
                        </h4>
                        <i
                            className="fa-solid fa-arrow-left cursor-pointer text-primary back-icon"
                            style={{ fontSize: "20px" }}
                            onClick={() => navigate(-1)}
                        ></i>
                    </div>
                    <div className="card-body">
                        <div className="form-validation" >
                            <ToastContainer />
                            <form className="form-valide" onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="row form-row-gap">

                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="name">
                                                organisation Name
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    name="COMPANYNAME"
                                                    placeholder="Enter organisation Name"
                                                    value={formValue?.COMPANYNAME}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            {validationErrors?.COMPANYNAME && (
                                                <div
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.COMPANYNAME}
                                                </div>
                                            )}

                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="email">
                                                    Email
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control form-control-sm `}
                                                    name="REGISTEREDEMAIL"
                                                    placeholder="Enter your Email"
                                                    value={formValue?.REGISTEREDEMAIL}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            {validationErrors?.REGISTEREDEMAIL && (
                                                <div
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.REGISTEREDEMAIL}
                                                </div>
                                            )}
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="email">
                                                    Alternate Email
                                                </label>
                                                <input
                                                    type="email"
                                                    className={`form-control form-control-sm `}
                                                    name="ALTERNATEEMAIL"
                                                    placeholder="Enter your Email"
                                                    value={formValue?.ALTERNATEEMAIL}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            <div className="col-md-6 col-lg-3">
                                                <label htmlFor="Phone">
                                                    Phone
                                                    <span className="text-danger">*</span>

                                                </label>
                                                {/* <input
                                                    type="number"
                                                    className={`form-control form-control-sm `}
                                                    name="PHONE"
                                                    placeholder="Enter Phone Number"
                                                    value={formValue?.PHONE}
                                                    onChange={handleFormChange}
                                                /> */}
                                                <PhoneInput
                                                                          defaultCountry="in"
                                                                         value={phoneValue?.PHONE}
                                                                         onChange={(phone) => handlePhoneChange(phone, "PHONE")}
                                                                            style={{height:'1.8rem'}}
                                                                         />

                                            </div>
                                            {validationErrors?.PHONE && (
                                                <div
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.PHONE}
                                                </div>
                                            )}
                                            <div className="col-md-6 col-lg-3">
                                                <label htmlFor="Mobile">
                                                    Alternate Phone

                                                </label>
                                                <PhoneInput
                                                                          defaultCountry="in"
                                                                         value={phoneValue?.ALTERNATEPHONE}
                                                                         onChange={(phone) => handlePhoneChange(phone, "ALTERNATEPHONE")}/>
                                                {/* <input
                                                    type="number"
                                                    className={`form-control form-control-sm `}
                                                    name="ALTERNATEPHONE"
                                                    placeholder="Enter Mobile Number"
                                                    value={formValue?.ALTERNATEPHONE}
                                                    onChange={handleFormChange}
                                                /> */}

                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="Pin">
                                                    Zip

                                                </label>
                                                <input
                                                    type="number"
                                                    className={`form-control form-control-sm`}
                                                    name="ZIP"
                                                    placeholder="Enter a Zip Code"
                                                    value={formValue?.ZIP}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="LICENSEKEY">
                                                    License Key
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm`}
                                                    name="LICENSEKEY"
                                                    placeholder="Enter License Key"
                                                    value={formValue?.LICENSEKEY}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.LICENSEKEY && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.LICENSEKEY}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="shortName">
                                                    PAN
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${validationErrors?.PAN ? "is-invalid" : ""
                                                        }`}
                                                    name="PAN"
                                                    placeholder="Enter PAN"
                                                    value={formValue?.PAN}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.PAN && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.PAN}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="TAN">
                                                    TAN
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${validationErrors?.TAN ? "is-invalid" : ""
                                                        }`}
                                                    name="TAN"
                                                    placeholder="Enter TAN"
                                                    value={formValue?.TAN}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.TAN && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.TAN}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="CIN">
                                                    CIN
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${validationErrors?.CIN ? "is-invalid" : ""
                                                        }`}
                                                    name="CIN"
                                                    placeholder="Enter CIN"
                                                    value={formValue?.CIN}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.CIN && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.CIN}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="LUT">
                                                    LUT
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${validationErrors?.LUT ? "is-invalid" : ""
                                                        }`}
                                                    name="LUT"
                                                    placeholder="Enter LUT"
                                                    value={formValue?.LUT}
                                                    onChange={handleFormChange}
                                                />
                                                {validationErrors?.LUT && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.LUT}
                                                    </div>
                                                )}
                                            </div>
                                            



                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor=" Address">
                                                    Address-1

                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    name="ADDRESS1"
                                                    placeholder="Enter  Address"
                                                    value={formValue?.ADDRESS1}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor=" Address">
                                                    Address-2

                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm `}
                                                    name="ADDRESS2"
                                                    placeholder="Enter  Address"
                                                    value={formValue?.ADDRESS2}
                                                    onChange={handleFormChange}
                                                />

                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label>Time Format</label>
                                                <select
                                                    name="TimeFormat"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.TimeFormat}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="12">12 Hours</option>
                                                    <option value="24">24 Hours</option>
                                                </select>
                                            </div>

                                           
                                            <div className="col-md-6 col-lg-2" >
                                                <label >
                                                    Country

                                                </label>
                                                {console.log(countryList,countryOptions,country,"90")}
                                                <Select
                                                    name="country"
                                                    id=""
                                                    options={countryOptions}
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption, 'country')}
                                                    value={countryOptions?.find(
                                                        (option) => option.value == country
                                                    )}
                                                    styles={select_customStyles(background)}
                                                    placeholder="Select"
                                                    autocomplete="off"
                                                    className="w-100 m-auto"
                                                >
                                                </Select>
                                            </div>
                                            <div className="col-md-6 col-lg-2" >
                                                <label >
                                                    State
                                                    <span className="text-danger">*</span>
                                                </label>
                                                
                                                <Select
                                                    name="stateCity"
                                                    id=""
                                                    options={stateOptions}
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption, 'stateCity')}
                                                    value={stateOptions?.find(
                                                        (option) => option.value == stateCity
                                                    )}
                                                    styles={select_customStyles(background)}
                                                    placeholder="Select"
                                                    autocomplete="off"
                                                    className="w-100 m-auto"
                                                >
                                                </Select>
                                                {validationErrors?.STATE && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.LUT}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="col-md-6 col-lg-2" >
                                                <label htmlFor="Designation">
                                                    City

                                                </label>
                                                <Select
                                                    name="city"
                                                    id=""
                                                    options={cityOptions}
                                                    onChange={(selectedOption) => handleSelectChange(selectedOption, 'city')}
                                                    value={cityOptions?.find(
                                                        (option) => option.value === city
                                                    )}
                                                    styles={select_customStyles(background)}
                                                    placeholder="Select"
                                                    autocomplete="off"
                                                    className="w-100 m-auto"
                                                >
                                                </Select>
                                            </div>


                                            <div className="col-md-6 col-lg-4">
                                                <label htmlFor="Language">
                                                    Destination

                                                </label>
                                                <DestinationInput />
                                            </div>
                                            <div className="col-md-6 col-lg-4">
                                                <label htmlFor="Language">
                                                    Role

                                                </label>
                                                <select className="form-control form-control-sm" onChange={handleRoleChange} value={formValue?.RoleId}>
                                                    <option value="">Select</option>
                                                    {renderOptions(roleList)}
                                                </select>
                                            </div>
                                            <div className="col-md-6 col-lg-2">
                                                <label>Status</label>
                                                <span className="text-danger">*</span>
                                                <select
                                                    name="ISACTIVE"
                                                    className="form-control form-control-sm"
                                                    value={formValue?.ISACTIVE}
                                                    onChange={handleFormChange}
                                                >
                                                    <option value="Active">Active</option>
                                                    <option value="Inactive">Inactive</option>
                                                </select>
                                            </div>
                                            {validationErrors?.ISACTIVE && (
                                                <div
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: "block" }}
                                                >
                                                    {validationErrors?.ISACTIVE}
                                                </div>
                                            )}
                                            <div className='col-12'>
                                            {GSTarray.map((data,index)=>{
                                                return (
                                                    <div className='row' key={index}>
                                            <div className="col-md-6 col-lg-2">
                                                <label htmlFor="GST">
                                                    GST
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    className={`form-control form-control-sm ${validationErrors?.GST ? "is-invalid" : ""
                                                        }`}
                                                    name="GSTNo"
                                                    placeholder="Enter GST"
                                                    value={data?.GSTNo}
                                                    onChange={(e)=>handleGSTChange(index,e)}
                                                />
                                                {validationErrors?.GST && (
                                                    <div
                                                        className="invalid-feedback animated fadeInUp"
                                                        style={{ display: "block" }}
                                                    >
                                                        {validationErrors?.GST}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="col-md-5 col-lg-2" >
                                                <label htmlFor="Designation">
                                                    State

                                                </label>
                                                <Select
                                                    name="state"
                                                    classNames="form-control.form-control-sm "
                                                    id=""
                                                    options={stateOptions}
                                                    onChange={(selectedOption) => handleSelectStateChange(selectedOption, 'stateCity',index)}
                                                    value={stateOptions?.find(
                                                        (option) => option.value === data.StateId
                                                    )}
                                                    styles={select_customStyles(background)}
                                                    placeholder="Select"
                                                    autocomplete="off"
                                                    className="w-100 m-auto"
                                                >
                                                </Select>
                                            </div>
                                            <div className='col-md-1 d-flex align-items-center gap-1'>
                                            <i class="fa-solid fa-plus text-secondary fs-5 mt-4 cursor-pointer" onClick={handleGSTArray}></i>
                                            {index>=1 && (
                                                <i className="fa-solid fa-trash-can cursor-pointer text-danger  fs-5 mt-4"
                        onClick={() => handleDeleteGSTArray(index)}
                    ></i>
                                            )}
                                           
                                            </div>
                                            </div>
                                                )
                                            })}
                                           
                                            </div>
                                           



                                            <div className="col-md-12 col-lg-12 d-flex align-items-center justify-content-end gap-3">
                                                <button
                                                    type="submit"
                                                    className="btn btn-dark btn-custom-size"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    className="btn btn-secondary btn-custom-size"
                                                >
                                                    Reset
                                                </button>
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
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default AddOrganisation