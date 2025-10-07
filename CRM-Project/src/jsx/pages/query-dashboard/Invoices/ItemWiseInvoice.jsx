
import React, { useEffect, useState } from 'react'


import { Row, Card, Col, Button, Nav, Container, Dropdown, CardHeader, CardBody, } from "react-bootstrap";
import deboxlogo from "../../../../images/logo/deboxlogo.png";


import DatePicker from "react-datepicker";
import PrintInvoiceComponent from './PrintInvoiceComponent';
import { axiosOther } from '../../../../http/axios_base_url';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { notifySuccess } from '../../../../helper/notify';

const ItemWiseInvoice = () => {

    const [editMode, setEditMode] = useState(null);
        const [billingData, setBillingData] = useState({
            billTo: "Ruchi Travel",
            address: "Noida sector 15, 310 A",
            phone: "9990003616",
            email: "Rachin@debox.com",
            gstin: "JKHGKJH8767HK",
            pan: "KJYU876HJGJ",
            stateCountry: "",
        });

    const [tempData, setTempData] = useState(billingData);
    const [destinationList, setDestinationList] = useState([]);
    
    const [currencyName, setCurrencyName] = useState([])
    const [selectedCurrency, setSelectedCurrency] = useState('INR');
    const [selectedDestination, setSelectedDestination] = useState();
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDated, setSelectedDated] = useState(new Date());
    const [guestName, setGuestName] = useState()
    const [invoiceData, setInvoiceData] = useState({});
    const [officePlace, setOfficePlace] = useState([])
    const [selectedOfficePlace, setSelectedOfficePlace] = useState("")
    const [companyDetails, setCompanyDetails] = useState({
            CompanyName: 'DEBOX GLOBAL IT SOLUTION PRIVATE LIMITED',
            Address: 'Sector-62 I thum tower C-319',
            Phone: '9898556641',
            Website: 'www.deboxglobal.com',
            GstNo: '09AAGCD6966P1ZP',
            Email: 'info@deboxglobal.com',
            Cin: '09AAGCD6966P1ZP'
        });
    const [formData, setFormData] = useState({
            ContactType: "PROFORMA INVOICE",
        });

const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation"));

    const { queryData, qoutationData, qoutationSubject } = useSelector(
            (data) => data?.queryReducer
          );

        //   const manish = useSelector(
        //     (data) => data?.queryReducer
        //   );
        //   console.log(manish,"Manish");
          

    const {TourId, QueryAlphaNumId} = queryData || {};
    const {QuotationNumber} = qoutationData || {}      

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempData({ ...tempData, [name]: value });
    };

    const handleFormChangeData = (e) => {
        const { name, value } = e.target;

        setFormData({ ...formData, [name]: value });
    };

    const handleFieldClick = (fieldName) => {
        setEditMode(fieldName);
      };

    const handleFieldBlur = () => {
        setBillingData(tempData);
        setEditMode(null); // closes the input after editing
      };


    const getCurrency = async () => {
            try {
              const { data } = await axiosOther.post("currencymasterlist");
              const currency = data.DataList.map(item => ({
                id: item.id,
                currency: item.CurrencyName
              }))
              const reorderedCurrency = [
                ...currency.filter(item => item.currency.toUpperCase() === 'INR'),
                ...currency.filter(item => item.currency.toUpperCase() !== 'INR')
              ];
                setCurrencyName(reorderedCurrency)
            } catch (error) {
              console.log("error", error);
            }
          };  

    const postDataToServer = async () => {
            try {
                const { data } = await axiosOther.post("destinationlist");
                setDestinationList(data?.DataList);
            } catch (error) {
                console.log(error);
            }
        }      

        const handleInvoiceData = async() => {
                const payload = {
                    id: "",
                    QueryId: QueryAlphaNumId,
                    // QuotationNo: QuotationNumber,
                    QuotationNo: queryQuotation?.QoutationNum || "",
                    Type: "Regular",
                    TourId: TourId,
                    ReferenceId: "REF-789",
                    PdfFileLink: "https://example.com/invoice.pdf",
                    AddedBy: 1,
                    UpdatedBy: 1,
                    InvoiceDetails: {
                      InvoiceType: "",
                      FormatType: "Total Invoice",
                      CostType: "",
                      GstType: "18%",
                      Tcs: "1%",
                      TourAmount: "5000",
                      CompanyLogo: deboxlogo,
                      CompanyName: "DEBOX GLOBAL IT SOLUTION PRIVATE LIMITED",
                      CompanyAddress: "Sector-62 I thum tower C-319",
                      CompanyContact: "9898556641",
                      CompanyEmail: "info@deboxglobal.com",
                      CompanyWebsite: "www.deboxglobal.com",
                      CompanyPan: "ABCDE1234F",
                      CompanyCIN: "09AAGCD6966P1ZP",
                      BillToCompanyName: billingData.billTo,
                      BillToCompanyAddress: billingData.address,
                      BillToCompanyContact: billingData.phone,
                      BillToCompanyEmail: billingData.email,
                      BillToCompanyWebsite: "https://abc.com",
                      BillToCompanyPan: billingData.pan,
                      BillToCompanyCIN: "U67890ABC",
                      InvoiceNo: "INV/24-25/000001",
                      InvoiceDate: selectedDate,
                      ReferenceNo: "REF-2024-001",
                      DueDate: selectedDated,
                      ToutDate: "2024-03-10",
                      FileNo: "FILE-001",
                      Currency: selectedCurrency || "INR",
                      GuestNameorReceiptName: guestName,
                      PlaceofDeliveryId: "DEL-001",
                      PlaceofDeliveryName: selectedDestination || "New Delhi",
                      Particulars: {
                        ParticularName: "",
                        HSN: "",
                        SAC: "",
                        Amount: "",
                        Tcs: "",
                        Tax: "",
                        TotalAmount: "",
                      },
                      TotalTourCost: "",
                      Cgst: "9%",
                      Sgst: "9%",
                      GrantTotal: "5000",
                      BankDetails: {
                        BankName: "", 
                        AmountType: "",
                        baneficiaryName: "",
                        AccountNumber: "",
                        IFSC: "",
                        BranchAddress: "",
                        BranchSwiftCode: ""
                      },
                      TermsandCondition: "Payment should be made within 15 days.",
                      PaymentDesc: "Advance payment required before confirmation."
                    }
                  };
                  
                  console.log('payload', payload);
                try {
                    const {data} = await axiosOther.post("/add-update-invoice", payload);
                    if (data?.Status === 1) {
                        // toast(data?.Message);
                        notifySuccess(data?.Message)
                        setInvoiceData(data);  
                    }
                } catch (error) {
                    console.log("Error adding invoice:", error);
                }
            }

   useEffect(() => {
    const getCompanyDetails = async () => {
        try {
            const {data} = await axiosOther.post('listCompanyOfc', {
                CompanyId: selectedOfficePlace
            });
            
            if(data.Status === 200){
                setCompanyDetails(data.DataList[0]);
                setOfficePlace(data.DataList.map((item) => ({
                    city: item.CityName,
                    compId: item.CompanyId,
                })));
            }
        } catch (error) {
            console.error("Error fetching company details:", error);
            
        }
    }  

    getCompanyDetails()
   },[selectedOfficePlace])      

    useEffect(() => {
        postDataToServer();
        getCurrency();
       }, []);

    return (
        <div className=" ItemWiseInvoice m-0 p-0">
            <Row>
                <Col md={12}>
                    <Card>
                        <CardHeader className='my-0 border-0'>
                            <div className="col-md-12 d-flex justify-content-between align-items-center gap-1 col-sm-12">
                                <div className=" col-lg-2 options col-md-6 ">
                                    <h6 className='mb-0'>PROFORMA INVOICE</h6>
                                </div>
                                <div className="col-lg-3 col-md-6 mb-1">
                                    <div className="d-flex justify-content-end align-content-center gap-1">
                                        <PrintInvoiceComponent />
                                        <div className=" d-flex " >
                                            <button className="btn btn-dark btn-custom-size">
                                                <span className="me-1">Back</span>
                                                <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                                            </button>
                                        </div>
                                        <div className=" Save">
                                            <button className="btn btn-primary btn-custom-size" onClick={handleInvoiceData}>
                                                Save
                                            </button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </CardHeader>
                        <div className="">
                                <div className="row">

                                    <div className="col-lg-3 col-md-6 mb-3">
                                        <label>Contact Type</label>
                                        <select name="ContactType"
                                            id="contactType"
                                            className="form-control form-control-sm"
                                            value={formData.ContactType}
                                            onChange={handleFormChangeData} >
                                            <option value="Proforma Invoice">Proforma Invoice</option>
                                            <option value="Tax Invoice">Tax Invoice</option>
                                        </select>
                                    </div>

                                    <div className="col-lg-3 col-md-6 mb-3">
                                        <label>City Type</label>
                                        <select name="costType"
                                            id="costType"
                                            className="form-control form-control-sm"
                                            value={selectedOfficePlace}
                                            onChange={(e) => setSelectedOfficePlace(e.target.value)} >
                                            {officePlace?.map((item, index) => 
                                                <option key={index} value={item?.compId}>{item?.city}</option>
                                            )}
                                        
                                        </select>

                                    </div>

                                </div>
                            </div>
                        <CardBody  >
                            <div className="" style={{ background: "var(--rgba-primary-1)" }}>
                                <div className="row pt-2 pb-2 p-1">
                                    <div className="col-lg-4 img col-sm-12">
                                        <div className="img my-auto">
                                            <img src={deboxlogo} alt="Logo" style={{ height: "60px", width: "auto", objectFit: "contain" }} />
                                        </div>
                                    </div>
                                    <div className="col-lg-8 col-sm-12 ps-2 my-auto">
                                        <div className="row  deboxcontact">
                                            <div className="heading col-12
                                ">
                                                <h6>DEBOX GLOBAL IT SOLUTION PRIVATE LIMITED</h6>
                                            </div>
                                            <div className="address col-12">
                                                <div className="d-flex gap-3">
                                                    <span>Address : </span>Sector-62 I thum tower C-319
                                                </div>


                                            </div>
                                            <div className="Contact col-6">
                                                <div className="d-flex gap-3">
                                                    <span>Contact : </span> 9898556641
                                                </div>

                                            </div>
                                            <div className="Email col-6">
                                                <div className="d-flex gap-3">
                                                    <span>Email : </span>  info@deboxglobal.com
                                                </div>

                                            </div>
                                            <div className="Website col-12">
                                                <div className="d-flex gap-3">
                                                    <span>Website : </span>   www.deboxglobal.com
                                                </div>

                                            </div>

                                            <div className="GSTN/UIN col-6">
                                                <div className="d-flex gap-1">
                                                    <span>GSTN/UIN : </span>    09AAGCD6966P1ZP
                                                </div>


                                            </div>
                                            <div className="CIN col-6">
                                                <div className="d-flex gap-3">
                                                    <span>CIN : </span>   09AAGCD6966P1ZP
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className=" border">
                                                            <div className="row">
                                                                <div className="col-lg-4 billscontact ps-4">
                            
                            
                                                                    <div className="row">
                                                                        <div className="col-12 ">
                                                                            <div className="row my-2 mt-3">
                                                                                <div className="col-2"><span className="billHeading">Bill To : </span></div>
                                                                                <div className="col-10" onClick={() => handleFieldClick("billTo")}>
                                                                                    {editMode === "billTo" ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="billTo"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.billTo}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.billTo}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-12 my-2">
                                                                            <div className="row">
                                                                                <div className="col-2"><span className="billHeading">Address : </span></div>
                                                                                <div className="col-10" onClick={() => handleFieldClick("address")}>
                                                                                    {editMode === 'address' ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="address"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.address}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.address}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-12 my-2">
                                                                            <div className="row">
                                                                                <div className="col-2"><span className="billHeading">Phone : </span></div>
                                                                                <div className="col-10" onClick={() => handleFieldClick("phone")}>
                                                                                    {editMode === 'phone' ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="phone"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.phone}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.phone}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-12 my-2">
                                                                            <div className="row">
                                                                                <div className="col-2"><span className="billHeading">Email : </span></div>
                                                                                <div className="col-10" onClick={() => handleFieldClick("email")}>
                                                                                    {editMode === 'email' ? (
                                                                                        <input
                                                                                            type="email"
                                                                                            name="email"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.email}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.email}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-6 my-2">
                                                                            <div className="row">
                                                                                <div className="col-4"><span className="billHeading">GSTIN/UIN : </span></div>
                                                                                <div className="col-8" onClick={() => handleFieldClick("gstin")}>
                                                                                    {editMode === 'gstin' ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="gstin"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.gstin}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.gstin}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-6 my-2">
                                                                            <div className="row">
                                                                                <div className="col-2"><span className="billHeading">PAN : </span></div>
                                                                                <div className="col-10" onClick={() => handleFieldClick("pan")}>
                                                                                    {editMode === 'pan' ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="pan"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.pan}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.pan}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                        <div className="col-12 my-2">
                                                                            <div className="row">
                                                                                <div className="col-3"><span className="billHeading">State/Country Name : </span></div>
                                                                                <div className="col-9" onClick={() => handleFieldClick("stateCountry")}>
                                                                                    {editMode === "stateCountry" ? (
                                                                                        <input
                                                                                            type="text"
                                                                                            name="stateCountry"
                                                                                            className="form-control form-control-sm"
                                                                                            value={tempData.stateCountry}
                                                                                            onChange={handleChange}
                                                                                            onBlur={handleFieldBlur}
                                                                                            autoFocus
                                                                                        />
                                                                                    ) : billingData.stateCountry || "-"}
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    {/*<div className="d-flex justify-content-end mb-2">
                                                                        {!editMode ? (
                                                                            <button className="btn btn-custom-size btn-primary" onClick={handleEdit}>Edit</button>
                                                                        ) : (
                                                                            <>
                                                                                <button className="btn btn-custom-size btn-success me-2" onClick={handleSave  
                                                                                }>Save</button>
                                                                                <button className="btn btn-dark btn-custom-size" onClick={handleCancel}>Cancel</button>
                                                                            </>
                                                                        )}
                                                                    </div> */}
                                                                </div>
                                                                <div className="col-lg-8 border-left">
                                                                    <div className="row invoicetable " >
                                                                        <div className="col-6 ps-3 pt-3 border-bottom ">
                                                                            <div className="row">
                                                                                <div className="col-4"><span className="billHeading">Invoice No:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-8">59995659868</div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6 border-bottom ">
                                                                            <div className="row">
                                                                                <div className="col-4 pt-3 "><span className="billHeading">Invoice Date:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-4"><DatePicker
                                                                                    className="form-control form-control-sm my-2 "
                                                                                    dateFormat="yyyy-MM-dd" isClearable todayButton="Today"
                                                                                    selected={selectedDate}
                                                                                    onChange={(date) => setSelectedDate(date)}
                                                                                /></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-6 ps-3 border-bottom pt-3">
                                                                            <div className="row">
                                                                                <div className="col-4"><span className="billHeading">Reference No:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-8">R20240615</div>
                                                                            </div>
                            
                            
                                                                        </div>
                                                                        <div className="col-6  border-bottom">
                                                                            <div className="row">
                                                                                <div className="col-4 pt-3"><span className="billHeading">Due Date:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-4"><DatePicker
                                                                                    className="form-control form-control-sm my-2 "
                                                                                    dateFormat="yyyy-MM-dd" isClearable todayButton="Today"
                                                                                    selected={selectedDated}
                                                                                    onChange={(date) => setSelectedDated(date)}
                                                                                /></div>
                                                                            </div>
                            
                            
                                                                        </div>
                                                                        <div className="col-6 ps-3 border-bottom py-2 pt-3">
                                                                            <div className="row">
                                                                                <div className="col-4 "><span className="billHeading">Tour Id:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-8">{TourId}</div>
                                                                            </div>
                            
                            
                                                                        </div>
                                                                        <div className="col-6 border-bottom py-2">
                                                                            <div className="row">
                                                                                <div className="col-4"><span className="billHeading">Query Id:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-8"> <h6>{QueryAlphaNumId}</h6></div>
                                                                            </div>
                            
                                                                        </div>
                                                                        <div className="col-6 ps-3  border-bottom ">
                                                                            <div className="row ">
                                                                                <div className="col-4 pt-3">
                                                                                    <span className="billHeading">Currency:</span>
                                                                                </div>
                                                                                <div className='col-4'>
                                                                                <select name='Currency' className="form-control form-control-sm my-2 "
                                                                                    value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}
                                                                                >
                                                                                {currencyName.map((item,index)=> (
                                                                                    <option key={index} value={item.id}>{item.currency}</option>
                                                                                ))}
                                                                            </select>
                                                                                </div>
                                                                            </div>
                            
                            
                                                                        </div>
                                                                        <div className="col-6 border-bottom">
                                                                            <div className="row">
                                                                                <div className="col-4 pt-3"><span className="billHeading">Guest/ Client Name:
                                                                                </span>
                                                                                </div>
                                                                                <div className="col-4">
                                                                                <input
                                                                                    type="text"
                                                                                    className={`form-control form-control-sm my-2  `}
                                                                                    name="Name"
                                                                                    value={guestName}
                                                                                    onChange={(e)=>setGuestName(e.target.value)}
                                                                                /></div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="col-12 ps-3  ">
                                                                            <div className="row items-center">
                                                                                <div className="col-2 pt-3">
                                                                                    <span className="billHeading">Place of Delivery:</span>
                                                                                </div>
                                                                                <div className="col-3 ">
                                                                                    <select
                                                                                        name="Payment"
                                                                                        className="form-control form-control-sm my-2 "
                                                                                        value={selectedDestination}
                                                                                        onChange={(e) => setSelectedDestination(e.target.value)}
                                                                                    >   <option>select</option>
                                                                                       {destinationList.map((place) =>  <option key={place.id} value={place.id}>{place.Name}</option>)}
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                            
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                            <table className="table table-bordered itinerary-table mt-2">
                                <thead>
                                    <tr>
                                        <th>Particulars</th>
                                        <th>HSN/SAC</th>
                                        <th>Rate</th>
                                        <th>Number of Pax</th>
                                        <th>Total Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "200px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}></td>
                                        <td className='text-start'>Total</td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={3}></td>
                                        <td className='text-start'>Total Cost in (INR)</td>
                                        <td>
                                            <input
                                                type="text"
                                                className={`form-control form-control-sm`}
                                                style={{ width: "100px", margin: "0 auto" }}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <div className="totalamounttable border-bottom border-left border-right" >
                                <div className="col-sm-12" style={{ background: "var(--rgba-primary-1)" }}>
                                    <div className="row text-center py-1">
                                        <div className="col">Particulars
                                        </div>
                                        <div className="col">HSN/SAC
                                        </div>
                                        <div className="col">Rate
                                        </div>
                                        <div className="col">Number of Pax
                                        </div>

                                        <div className="col">Total Amount
                                        </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "> <div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "> <div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "> <div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                                <div className="row text-center border-bottom">
                                    <div className="col   py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 px-2 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                    <div className="col  py-3 "><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>

                                    <div className="col  py-3"><div className="px-4">
                                        <input
                                            type="text"
                                            className={`form-control form-control-sm   `}
                                        />
                                    </div>
                                    </div>
                                </div>
                            </div> 
                            <div className="border-bottom py-2 border-left border-right costtable">
                                <div className="row d-flex justify-content-end align-items-center">
                                    <div className="col-3 ">
                                        <div className="row">
                                            <div className="col-6 py-auto"><p>Total</p></div>
                                            <div className="col-6 px-2"><input
                                                type="text"
                                                className="form-control form-control-sm"
                                            /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="border-bottom py-2 border-left border-right costtable">
                                <div className="row d-flex justify-content-end align-items-center">
                                    <div className="col-3 ">
                                        <div className="row">
                                            <div className="col-6 py-auto"><p>Total Cost in (INR)
                                            </p></div>
                                            <div className="col-6 px-2"><input
                                                type="text"
                                                className="form-control form-control-sm"
                                            /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>*/}


                            <table className="table table-bordered itinerary-table mt-2">
                                <thead>
                                    <tr>
                                        <th>Currency Type</th>
                                        <th> Bank Name</th>
                                        <th>Account Number</th>
                                        <th>Account Type</th>
                                        <th>Benificiary Name</th>
                                        <th>Branch Address</th>
                                        <th>Branch IFSC</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <select
                                                name="Payment"
                                                className="form-control form-control-sm  "
                                            > <option value="1">All</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="Payment"
                                                className="form-control form-control-sm  "
                                            > <option value="1">All</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select
                                                name="Payment"
                                                className="form-control form-control-sm  "
                                            > <option value="1">All</option>
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                name="Payment"
                                                className="form-control form-control-sm  "
                                            > <option value="1">All</option>
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control form-control-sm"

                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* <div className="headingtable  px-1 col-lg-12">
                                <div className="row d-flex border p-1 headingss">
                                    <div className="col">Currency Type</div>
                                    <div className=" col"> Bank Name</div>
                                    <div className=" col"> Account Number</div>
                                    <div className=" col"> Account Type </div>
                                    <div className=" col"> Benificiary Name</div>
                                    <div className=" col"> Branch Address</div>
                                    <div className=" col">Branch IFSC</div>
                                </div>
                                <div className="row border-left border-right p-2 text-between">
                                    <div className="content col "> <div className="px-3 py-2"><select
                                        name="Payment"
                                        className="form-control form-control-sm  "
                                    > <option value="1">All</option>
                                    </select></div></div>
                                    <div className="content col "> <div className="px-3 py-2"><select
                                        name="Payment"
                                        className="form-control form-control-sm  "
                                    > <option value="1">All</option>
                                    </select></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                </div>
                                <div className="row border-left border-right p-2 text-between">
                                    <div className="content col "> <div className="px-3 py-2"><select
                                        name="Payment"
                                        className="form-control form-control-sm  "
                                    > <option value="1">All</option>
                                    </select></div></div>
                                    <div className="content col "> <div className="px-3 py-2"><select
                                        name="Payment"
                                        className="form-control form-control-sm  "
                                    > <option value="1">All</option>
                                    </select></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                    <div className="content col "><div className="px-3 py-2"><input
                                        type="text"
                                        className="form-control form-control-sm"
                                    /></div></div>
                                </div>
                            </div> */}
                            <div className="border-left border-top border-right p-2 mt-2">
                                <h6>
                                    Terms & Conditions
                                </h6>
                                {/* <div className="col-sm-12 border py-5"></div> */}
                                <textarea
                                    id="name"
                                    className="form-control form-control-sm"
                                    name="Address"
                                    placeholder="Address"
                                ></textarea>
                            </div>
                            <div className="border-left border-bottom border-right p-2">
                                <h6>
                                    Payment

                                </h6>
                                {/* <div className="col-sm-12 border py-3"></div> */}
                                <textarea
                                    id="name"
                                    className="form-control form-control-sm"
                                    name="Address"
                                    placeholder="Address"
                                ></textarea>
                            </div>
                            <div className="py-2">
                                <div className="row d-flex justify-content-end align-items-center">
                                    <div className="col-3">
                                        <div className="d-flex justify-content-end align-content-center gap-1">

                                            <div className=" Save">
                                                <button className="btn btn-primary btn-custom-size" onClick={handleInvoiceData}>
                                                    Save
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>

                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default ItemWiseInvoice