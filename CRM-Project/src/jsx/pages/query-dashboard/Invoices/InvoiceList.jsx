import React, { useEffect, useState } from 'react'
import { axiosOther } from '../../../../http/axios_base_url'
import PrintInvoiceComponent from './PrintInvoiceComponent'
import { BsPencil } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeadingShowTrue, setQoutationSubject, setQueryData, setQueryUpdateData } from '../../../../store/actions/queryAction';
import { currentDate } from '../../../../helper/currentDate';


const InvoiceList = () => {
    const [invoices, setInvoices] = useState([])
    const [loading, setLoading] = useState(false)
    const [hoveredRow, setHoveredRow] = useState(null); 

    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const handleInvoices = async() => {
            try { 
                setLoading(true)
                const response = await axiosOther.post("list-invoice")
                if (response.data.Status === 200) {
                    setInvoices(response?.data?.DataList)
                } 
                setLoading(false)
            } catch (error) {
                console.error("Error fetching invoices:", error);
            }
        }

        handleInvoices()
    }, [])

    const handleEdit = (row) => {
        const routeNavigate = "editByList";
        const data = { ...row, routeNavigate };
        console.log(row, 'rowskfdk')
        dispatch(setQueryUpdateData(row));
        dispatch(setHeadingShowTrue());
        dispatch(
          setQueryData({
            QueryId: row?.QueryId,
            QueryAlphaNumId: row?.QueryID,
            QueryAllData: row,
          })
        );
        dispatch(
          setQoutationSubject(
            row?.ServiceDetail?.ServiceCompanyName +
            " " +
            currentDate(row?.QueryDate?.Date)
          )
        );
        // Pass only the required fields in state
        navigate('/query/invoices', {
          state: {
            queryId: row?.QueryId,
            quotationNo: row?.InvoiceDetails?.QuotationNo,
            data // if you want to pass the whole row as well
          }
        });
        localStorage.setItem("query-data", JSON.stringify(row));
    };

  return (
    <div>
    <table className="table table-bordered itinerary-table mt-2">
    <thead>
        <tr className="text-center ">
            <th className=" p-1"></th>
            <th className=" p-1">InvoiceNo.</th>
            <th className=" p-1">Query ID</th>
            <th className=" p-1">Tour ID</th>
            <th className=" p-1">Invoice Date</th>
            <th className=" p-1">Invoice Format</th>
            <th className=" p-1">Amount</th>
            <th className=" p-1">Client</th>
            <th className=" p-1">Invoice Type</th>
            <th className=" p-1">Action</th>
        </tr>
    </thead>
    <tbody>
        {loading ? <tr className='text-center'>Loading...</tr> : (
            invoices.map((item, index) => (
            <tr key={index} className="text-center" 
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
            >
                <td onClick={()=>handleEdit(item)}>
                  {hoveredRow === index && <BsPencil style={{fontSize: '22px'}} />}
                  </td>
                <td>{item.InvoiceId}</td>
                <td>{item.QueryId}</td>
                <td>{item.TourId}</td>
                <td>{new Date(item.InvoiceDetails.InvoiceDate).toLocaleDateString('en-GB')}</td>
                <td>{item.InvoiceDetails.FormatType}</td>
                <td>{item.InvoiceDetails.TourAmount}</td>
                <td>{item.InvoiceDetails.GuestNameorReceiptName || "John Doe"}</td>
                <td>{item.InvoiceDetails.InvoiceType}</td>
                <td>{<PrintInvoiceComponent />}</td>
            </tr>
        )) 
  )}
    </tbody>
</table>
    </div>
  )
}

export default InvoiceList
