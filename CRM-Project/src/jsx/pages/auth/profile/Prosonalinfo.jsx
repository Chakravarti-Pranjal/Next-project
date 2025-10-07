import React, { useEffect, useState } from 'react';
import avatar from '../../../../images/avatar/1.jpg';
import './Profile.css';
import { Link, useNavigate } from 'react-router-dom';
import { axiosOther } from '../../../../http/axios_base_url.js';
import { notifyError, notifyHotSuccess, notifySuccess } from '../../../../helper/notify';
import { userlistInitialValue } from './Profileinfointialvalue';
import { profileinfovalidationschema } from './Profile_validation.js';
import ProfileSettingMenu from './ProfileSettingMenu.jsx';
import ProfileViewer from './ProfileViewer.jsx';

const Prosonalinfo = () => {
    // State for user profile data
    const [formValue, setFormValue] = useState(userlistInitialValue);
    // Separate state for address data
    const [addressForm, setAddressForm] = useState({
        Country: '',
        City: '',
        State: '',
        Zip: '',
    });
    const [validationErrors, setValidationErrors] = useState({});
    const [role, setRole] = useState([]);
    const [state, setState] = useState([]);
    const [countryList, setCountryList] = useState([]);
    const [stateList, setStateList] = useState([]);
    const [cityList, setCityList] = useState([]);
    const navigate = useNavigate();

    // Fetch profile and country list
    const getProfileList = async () => {
        let Id = null;
        try {
            const token = localStorage.getItem('token');
            const parsed = JSON.parse(token);
            Id = parsed?.UserID;
        } catch (error) {
            console.error('Error parsing token:', error);
        }

        try {
            const { data } = await axiosOther.post('listusers', { id: Id });
            setState(data?.Datalist);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }

        try {
            const countryResponse = await axiosOther.post('countrylist', {
                Search: '',
                Status: 1,
            });
            setCountryList(countryResponse.data.DataList);
        } catch (error) {
            console.error('Error fetching country list:', error);
        }
    };

    // Fetch roles
    const getDataList = async () => {
        try {
            const { data } = await axiosOther.post('listroles');
            setRole(data?.Datalist);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };

    // Populate form and address state when user data is fetched
    useEffect(() => {
        if (Array.isArray(state) && state.length > 0) {
            const user = state[0];
            setFormValue({
                ...formValue,
                id: user?.id,
                CompanyKey: user?.CompanyId,
                OrganizationId: user?.OrgId,
                FirstName: user?.FirstName,
                LastName: user?.LastName,
                Phone: user?.Phone,
                email: user?.Email,
                Mobile: user?.Mobile,
                LanguageKnown: user?.LanguageKnown?.map((e) => e.id),
                Street: user?.Street,
                UserKey: user?.UserKey,
                Status: user?.Status === 'Active' ? 1 : 0,
                UpdatedBy: user?.UpdatedBy,
            });
            // Set address-related fields in addressForm
            setAddressForm({
                Country: user?.Country || '',
                City: user?.City || '',
                State: user?.State || '',
                Zip: user?.Zip || '',
            });
        }
    }, [state]);

    // Fetch city and state based on selected country and city
    useEffect(() => {
        const dependentStateAndCity = async () => {
            try {
                const { data } = await axiosOther.post('citybycountry', {
                    CountryId: addressForm?.Country,
                });
                setCityList(data.DataList);
            } catch (error) {
                console.error('Error fetching city list:', error);
            }

            try {
                const { data } = await axiosOther.post('citystatebyid', {
                    CityId: addressForm?.City || state?.City,
                });
                setStateList([{ id: data.StateId, Name: data.StateName }]);
            } catch (error) {
                console.error('Error fetching state list:', error);
            }
        };
        dependentStateAndCity();
    }, [addressForm.Country, addressForm.City]);

    // Initialize data fetching
    useEffect(() => {
        getProfileList();
        getDataList();
    }, []);

    // Handle form changes for user profile fields
    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormValue((prev) => ({
            ...prev,
            [name]: name === 'Role' ? [parseInt(value)] : value,
        }));
    };

    // Handle form changes for address fields
    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddressForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setValidationErrors({});
            // Validate formValue (you may need to add address validation in profileinfovalidationschema)
            await profileinfovalidationschema.validate(formValue, { abortEarly: false });

            // Combine formValue and addressForm for submission
            const payload = {
                ...formValue,
                ...addressForm,
            };

            const { data } = await axiosOther.post('updateusers', payload);
            if (data?.Status == 1) {
                notifySuccess(data?.Message || data?.message);
                navigate('/user-profile');
                localStorage.setItem('success-message', data?.Message || data?.message);
            } else {
                notifyError(data?.message || data?.Message);
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
                notifyError(data[0][1] || data?.message || data?.Message);
            }
            console.error('Submission error:', error);
        }
    };

    return (
        <div className="Profile">
            <div className="row">
                <div className="col-lg-3 my-2">
                    <ProfileSettingMenu />
                </div>
                <div className="col-lg-3 my-2">
                    <ProfileViewer />
                </div>
                <div className="col-lg-6 my-2">
                    <div className="card-body">
                        <form className="form-valide" onSubmit={handleSubmit}>
                            {/* Personal Information Card */}
                            <div className="card p-2 mb-2 profileDetails Personal">
                                <div className="card-body">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <h2 className="mb-0">Personal Information</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>First Name</label>
                                            <input
                                                type="text"
                                                placeholder="First Name"
                                                className="form-control form-control-sm"
                                                name="FirstName"
                                                value={formValue?.FirstName}
                                                onChange={handleFormChange}
                                            />
                                            {validationErrors?.FirstName && (
                                                <div
                                                    id="val-username1-error"
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: 'block' }}
                                                >
                                                    {validationErrors?.FirstName}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Last Name</label>
                                            <input
                                                type="text"
                                                placeholder="Last Name"
                                                className="form-control form-control-sm"
                                                name="LastName"
                                                value={formValue?.LastName}
                                                onChange={handleFormChange}
                                            />
                                            {validationErrors?.LastName && (
                                                <div
                                                    id="val-username1-error"
                                                    className="invalid-feedback animated fadeInUp"
                                                    style={{ display: 'block' }}
                                                >
                                                    {validationErrors?.LastName}
                                                </div>
                                            )}
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Email</label>
                                            <input
                                                type="email"
                                                placeholder="Email"
                                                className="form-control form-control-sm"
                                                name="email"
                                                value={formValue?.email}
                                                disabled={true}
                                                style={{ cursor: 'no-drop' }}
                                            />
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Mobile</label>
                                            <input
                                                type="number"
                                                placeholder="Mobile"
                                                className="form-control form-control-sm"
                                                name="Mobile"
                                                value={formValue?.Mobile}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Phone</label>
                                            <input
                                                type="number"
                                                placeholder="Phone"
                                                className="form-control form-control-sm"
                                                name="Phone"
                                                value={formValue?.Phone}
                                                onChange={handleFormChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Address Card */}
                            <div className="card p-2 mb-2 profileDetails Personal">
                                <div className="card-body">
                                    <div className="d-flex justify-content-start align-items-center">
                                        <h2 className="mb-0">Address</h2>
                                    </div>
                                    <div className="row">
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label className="" htmlFor="Country">
                                                Country
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <select
                                                name="Country"
                                                id="Country"
                                                className="form-control form-control-sm"
                                                value={addressForm?.Country}
                                                onChange={handleAddressChange}
                                            >
                                                <option value="">Select</option>
                                                {countryList?.length > 0 &&
                                                    countryList.map((data) => (
                                                        <option key={data?.id} value={data?.id}>
                                                            {data?.Name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label className="" htmlFor="City">
                                                City
                                                {/* <span className="text-danger">*</span> */}
                                            </label>
                                            <select
                                                name="City"
                                                id="City"
                                                className="form-control form-control-sm"
                                                value={addressForm?.City}
                                                onChange={handleAddressChange}
                                            >
                                                <option value="">Select</option>
                                                {cityList?.length > 0 &&
                                                    cityList.map((data) => (
                                                        <option key={data?.id} value={data?.id}>
                                                            {data?.Name}
                                                        </option>
                                                    ))}
                                            </select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label htmlFor="State">State</label>
                                            <select
                                                name="State"
                                                id="State"
                                                className="form-control form-control-sm"
                                                value={addressForm?.State}
                                                onChange={handleAddressChange}
                                            >
                                                {stateList?.length > 0 ? (
                                                    stateList.map(({ id, Name }) => (
                                                        <option key={id} value={id}>
                                                            {Name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="">Select</option>
                                                )}
                                            </select>
                                        </div>
                                        <div className="col-lg-3 d-flex flex-column my-2">
                                            <label>Zip</label>
                                            <input
                                                type="number"
                                                placeholder="Zip"
                                                className="form-control form-control-sm"
                                                name="Zip"
                                                value={addressForm?.Zip}
                                                onChange={handleAddressChange}
                                            />
                                        </div>
                                        <div className="col-lg-6 d-flex flex-column my-2">
                                            <label>Street Address</label>
                                            <textarea
                                                className="form-control"
                                                name="Street"
                                                onChange={handleFormChange}
                                                rows="6"
                                                value={formValue?.Street}
                                            ></textarea>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Form Actions */}
                            <div className="row pb-1">
                                <div className="col-12 d-flex gap-3 justify-content-end">
                                    <button type="submit" className="btn btn-primary btn-custom-size">
                                        Save
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-dark btn-custom-size"
                                        onClick={() => navigate(-1)}
                                    >
                                        <span className="me-1">Back</span>
                                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Prosonalinfo;