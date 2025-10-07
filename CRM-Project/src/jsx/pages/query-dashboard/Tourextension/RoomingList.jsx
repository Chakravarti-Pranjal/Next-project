import React, { useState, useEffect } from "react";
import { axiosOther } from "../../../../http/axios_base_url.js";
import { notifyError, notifySuccess } from "../../../../helper/notify.jsx";
import swal from "sweetalert";
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

const RoomingList = ({ setActiveTab, activeTab }) => {
    const [data, setData] = useState([]);
    const [initialList, setInitialList] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);
    const [groupedData, setGroupedData] = useState([]);
    const [QoutationData, setQoutationData] = useState({});
    const queryQuotation = JSON.parse(localStorage.getItem("Query_Qoutation") || "{}");
    const companyId = JSON.parse(localStorage.getItem("token"))?.companyKey;

    // const getRoomTypes = async () => {
    //     try {
    //         const { data } = await axiosOther.post("roomsharingmasterlist", {});
    //         const apiData = data?.DataList || [];
    //         setRoomTypes(apiData);
    //     } catch (error) {
    //         console.log("room-types-error", error);
    //         notifyError("Failed to fetch room types");
    //     }
    // };


        async function fetchQueryQuotation() {
        try {
            // setLoading(true);
            const { data } = await axiosOther.post('lisFinalQuotation', {
                QueryId: queryQuotation?.QueryID,
                QuotationNo: queryQuotation?.QoutationNum,
                TourId: queryQuotation?.TourId,
            });
            setQoutationData(data?.FilteredQuotations[0] || {});
const roomInfo = data?.FilteredQuotations[0]?.RoomInfo;
const filteredRoomInfo = roomInfo?.filter(room => room.NoOfPax !== null && room.NoOfPax !== undefined);
setRoomTypes(filteredRoomInfo);
            // setLoading(false);
        } catch (error) {
            console.error('Error fetching quotation:', error);
            setError('Failed to load quotation data');
            // setLoading(false);
        }
    }

    useEffect(() => {
        fetchQueryQuotation();
    }, []);

console.log(roomTypes,"setQoutationData");

    

    const getHotelCostsByDay = (data) => {
        const hotelCostsByDay = [];

        if (data.Days && Array.isArray(data.Days)) {
            data.Days.forEach((day) => {
                const dayHotelData = {
                    day: day.Day,
                    destination: day.DestinationName || 'Unknown',
                    Hotelid: 'Unknown',
                    hotelDetails: {
                        hotelName: 'Unknown',
                        hotelCategory: 'Unknown',
                        mealPlan: 'Unknown',
                    },
                    rooms: [],
                };

                if (day.DayServices && Array.isArray(day.DayServices)) {
                    const hotelService = day.DayServices.find(
                        (service) => service.ServiceType === 'Hotel'
                    );

                    if (hotelService && hotelService.TotalCosting) {
                        dayHotelData.Hotelid = hotelService.ServiceId || 'Unknown';
                        dayHotelData.hotelDetails = {
                            hotelName: hotelService.ServiceDetails?.[0]?.ItemName || 'Unknown',
                            hotelCategory: hotelService.HotelCategoryName || 'Unknown',
                            mealPlan: hotelService.MealPlanName || 'Unknown',
                        };

                        hotelService.TotalCosting.forEach((costing) => {
                            costing.HotelRoomBedType.forEach((room) => {
                                dayHotelData.rooms.push({
                                    roomBedTypeName: room.RoomBedTypeName,
                                    totalServiceCost: Number(room.TotalServiceCost) || 0,
                                    pax: room.RoomBedTypeName.includes('DBL') ? 2 : 1,
                                });
                            });
                        });
                    }
                }

                if (dayHotelData.rooms.length > 0) {
                    hotelCostsByDay.push(dayHotelData);
                }
            });
        }
        return hotelCostsByDay;
    };

    const hotelCostsByDay = getHotelCostsByDay(QoutationData);

    console.log(hotelCostsByDay,"hotelCostsByDay");

    const getListDataToServer = async () => {
        try {
            const { data } = await axiosOther.post("list-rooming-guest-list", {
                id: "",
                QueryId: queryQuotation?.QueryID || "",
                QuotationNumber: queryQuotation?.QoutationNum || "",
                per_page: "20"
            });
            const apiData = data?.Data || [];
            const mappedData = apiData.map((guest, index) => ({
                id: guest.id || index + 1,
                title: guest.Title || "",
                firstName: guest.FirstName || "",
                lastName: guest.LastName || "",
                type: guest.PaxType === "1" ? "SGL Room" : guest.PaxType === "2" ? "DBL Room" : guest.PaxType === "3" ? "TPL Room" : "",
                selected: false,
                group: null,
                Gender: guest.Gender || "",
                DateOfBirth: guest.DateOfBirth || "",
                PassportNumber: guest.PassportNumber || ""
            }));
            setData(mappedData);
            setInitialList(mappedData);
        } catch (error) {
            console.log("rooming-error", error);
            notifyError("Failed to fetch guest list");
        }
    };

    const fetchGroupedRoomingList = async () => {
        try {
            const { data } = await axiosOther.post("list-roominglist", {
                id: "",
                QueryId: queryQuotation?.QueryID || "",
                QuotationNo: queryQuotation?.QoutationNum || "",
                per_page: "200"
            });
            const apiData = data?.Data || [];
            setGroupedData(apiData);
        } catch (error) {
            console.log("grouped-rooming-error", error);
            notifyError("Failed to fetch grouped rooming list");
        }
    };

    useEffect(() => {
        // getRoomTypes();
        getListDataToServer();
        fetchGroupedRoomingList();
    }, []);

    useEffect(() => {
    if (activeTab === "RoomingList") {
      getListDataToServer();
    }
  }, [activeTab]);


    useEffect(() => {
        getListDataToServer();
    }, [groupedData]);

    const toggleSelect = (id) => {
        const updated = data.map((row) =>
            row.id === id ? { ...row, selected: !row.selected } : row
        );
        setData(updated);
    };

    const handleAddRow = () => {
        const newRow = {
            id: Date.now(),
            title: "",
            firstName: "",
            lastName: "",
            type: "",
            selected: false,
            group: null,
        };
        setData([...data, newRow]);
    };

    const addRow = (index) => {
        const newRow = {
            id: Date.now(),
            title: "",
            firstName: "",
            lastName: "",
            type: "",
            selected: false,
            group: null,
        };
        const updatedData = [
            ...data.slice(0, index + 1),
            newRow,
            ...data.slice(index + 1)
        ];
        setData(updatedData);
    };

    const deleteRow = async (id) => {
        const confirmation = await swal({
            title: "Are you sure you want to delete this row?",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        });

        if (confirmation) {
            const updatedData = data.filter((row) => row.id !== id);
            setData(updatedData);
            notifySuccess("Row deleted successfully");
        }
    };

    const groupSelectedRows = async () => {
        const selected = data.filter((item) => item.selected);
        if (selected.length === 0) {
            notifyError("Please select at least one row to group.");
            return;
        }

        const payload = selected.map((row) => {
            const roomType = roomTypes.find((rt) => rt.RoomType === row.type);
            return {
                QueryId: queryQuotation?.QueryID || "QRY-1234",
                QuotationNumber: queryQuotation?.QoutationNum || "QUO-2025-002",
                CompanyId: companyId,
                Fk_guestId: row.id,
                RoomTypeId: roomType ? roomType.id : null,
                GroupId: null,
                AddedBy: 1,
                Status: 1
            };
        });

        try {
            const { data: response } = await axiosOther.post("store-roominglist", payload);
            if (response?.Status == 1 || response?.status == 1) {
                const notSelected = data.filter((item) => !item.selected);
                const cleared = selected.map((item) => ({ ...item, selected: false, group: null }));
                const blankRow = {
                    id: "",
                    title: "",
                    firstName: "",
                    lastName: "",
                    type: "",
                    selected: false,
                    group: null,
                    isBlank: true,
                };
                setData([...cleared, blankRow, ...notSelected]);
                notifySuccess(response?.Message || "Group saved successfully");
                await fetchGroupedRoomingList(); // Fetch updated grouped list
            } else {
                notifyError(response?.Message || "Failed to save group");
            }
        } catch (error) {
            console.log("group-error", error);
            notifyError(error?.response?.data?.message || "An error occurred while grouping");
        }
    };

    const handleInputChange = (id, key, value) => {
        const updated = data.map((row) =>
            row.id === id ? { ...row, [key]: value } : row
        );
        setData(updated);
    };

    const exportToExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Grouped Rooming List');

        // Define columns
        worksheet.columns = [
            { header: 'S. No', key: 'sno', width: 8 },
            { header: 'Title', key: 'title', width: 12 },
            { header: 'First Name', key: 'firstName', width: 15 },
            { header: 'Last Name', key: 'lastName', width: 15 },
            { header: 'Date of Birth', key: 'dob', width: 12 },
            { header: 'Passport Number', key: 'passport', width: 15 },
            { header: 'Room Type', key: 'roomType', width: 12 },
        ];

        // Style headers
        worksheet.getRow(1).font = { bold: true };
        worksheet.getRow(1).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFCCCCCC' },
        };
        worksheet.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

        let currentRow = 2;

        groupedData.forEach((group) => {
            const members = group.Members || [];
            const numMembers = members.length;

            members.forEach((member, memberIndex) => {
                try {
                    const guest = JSON.parse(member.GuestJson);
                    worksheet.getRow(currentRow).values = [
                        memberIndex + 1,
                        guest.Title || '',
                        guest.FirstName || '',
                        guest.LastName || '',
                        guest.DateOfBirth || '',
                        guest.PassportNumber || '',
                        memberIndex === 0 ? member.RoomTypeName || '' : '',
                    ];

                    // Merge Room Type cell for the group
                    if (memberIndex === 0 && numMembers > 0) {
                        worksheet.mergeCells(`G${currentRow}:G${currentRow + numMembers - 1}`);
                        worksheet.getCell(`G${currentRow}`).value = member.RoomTypeName || '';
                        worksheet.getCell(`G${currentRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
                    }

                    currentRow++;
                } catch (error) {
                    console.error('Error parsing guest JSON:', error);
                }
            });

            // Add blank separator row
            if (numMembers > 0) {
                worksheet.getRow(currentRow).height = 24; // Match table's height
                worksheet.getRow(currentRow).fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'ffffff' }, // Match table's background
                };
                for (let col = 1; col <= 7; col++) {
                    worksheet.getCell(currentRow, col).value = '';
                    worksheet.getCell(currentRow, col).border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
                currentRow++;
            }
        });

        // Add borders to all cells
        worksheet.eachRow({ includeEmpty: true }, (row) => {
            row.eachCell({ includeEmpty: true }, (cell) => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' },
                };
            });
        });

        // Download the file
        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(blob, 'Grouped_Rooming_List.xlsx');
    };

    return (
        <div className="">
            <div className="card-header">
                <h4 className="card-title">Rooming List</h4>
                <div className="d-flex justify-content-end gap-3 mb-1">
                    
                    <button className="btn btn-dark btn-custom-size" name="SaveButton"
                        onClick={() => setActiveTab("GuestList")}
                    >
                        <span className="me-1">Back</span>
                        <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
                    </button>
                    <button
                        className="btn btn-primary btn-custom-size "
                        name="SaveButton"
                        // onClick={() => navigate("/query/payments")}
                        onClick={() => setActiveTab("ContactList")}
                    >
                        <span className="me-1">Next</span>
                        <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
                    </button>
                </div>
            </div>


             <div className="card-header border-0">
            <h4 className="mt-2">Grouped Rooming List</h4>
                <div className="d-flex justify-content-end gap-3 mb-1">
                    
                   <button className="btn btn-success btn-custom-size" onClick={exportToExcel}>
    Export to Excel
</button>
                </div>
            </div>
            <table className="table table-bordered itinerary-table">
                <thead>
                    <tr>
                        {/* <th>Group ID</th> */}
                        {/* <th>S. No</th> */}
                        <th>Title</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Passport Number</th>
                        <th>Room Type</th>
                    </tr>
                </thead>
                {/* <tbody>
                    {groupedData.map((group, groupIndex) => (
                        group.Members.map((member, memberIndex) => {
                            const guest = JSON.parse(member.GuestJson);
                            return (
                                <tr key={`${group.GroupId}-${member.id}`}>
                                    <td><span>{memberIndex + 1}</span></td>
                                    <td><span>{guest.Title}</span></td>
                                    <td><span>{guest.FirstName}</span></td>
                                    <td><span>{guest.LastName}</span></td>
                                    {memberIndex === 0 && (
                                        <td rowSpan={group.Members.length}><span>{member.RoomTypeName}</span></td>
                                    )}
                                    <td><span>{guest.DateOfBirth}</span></td>
                                    <td><span>{guest.PassportNumber}</span></td>
                                </tr>
                            );
                        })
                    ))}
                </tbody> */}
                <tbody>
    {groupedData.map((group, groupIndex) => (
        <React.Fragment key={group.GroupId}>
            {group.Members.map((member, memberIndex) => {
                const guest = JSON.parse(member?.GuestJson);
                return (
                    <tr key={`${group?.GroupId}-${member?.id}`}>
                        {/* <td><span>{memberIndex + 1}</span></td> */}
                        <td><span>{guest?.Title}</span></td>
                        <td><span>{guest?.FirstName}</span></td>
                        <td><span>{guest?.LastName}</span></td>
                        
                        <td><span>{guest?.DateOfBirth}</span></td>
                        <td><span>{guest?.PassportNumber}</span></td>
                        {memberIndex === 0 && (
                            <td rowSpan={group?.Members?.length}><span>{member?.RoomTypeName}</span></td>
                        )}
                    </tr>
                );
            })}
            <tr style={{height:"24px",background:"#3f3f3f55"}} key={`blank-${group.GroupId}`}>
                <td colSpan="7"></td>
            </tr>
        </React.Fragment>
    ))}
</tbody>
            </table>

            <div className="mb-2 d-flex align-items-center gap-2">
                <button className="btn btn-primary btn-custom-size" onClick={handleAddRow}>
                    Add New Row
                </button>
                <button className="btn btn-success btn-custom-size" onClick={groupSelectedRows}>
                    Group Selected
                </button>
            </div>

            <table className="table table-bordered itinerary-table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>S. No</th>
                        <th>Title</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Room Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr
                            key={row.id}
                        >
                            <td>
                                {!row.isBlank && (
                                    <input
                                        type="checkbox"
                                        checked={row.selected}
                                        onChange={() => toggleSelect(row.id)}
                                    />
                                )}
                            </td>
                            <td>{row.isBlank ? "" : data.filter((item) => !item.isBlank && item.group === row.group).indexOf(row) + 1 || index + 1 - data.filter((item) => item.isBlank).length}</td>
                            <td>
                                {!row.isBlank && (
                                    <input
                                        type="text"
                                        value={row.title}
                                        onChange={(e) => handleInputChange(row.id, "title", e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                )}
                            </td>
                            <td>
                                {!row.isBlank && (
                                    <input
                                        type="text"
                                        value={row.firstName}
                                        onChange={(e) => handleInputChange(row.id, "firstName", e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                )}
                            </td>
                            <td>
                                {!row.isBlank && (
                                    <input
                                        type="text"
                                        value={row.lastName}
                                        onChange={(e) => handleInputChange(row.id, "lastName", e.target.value)}
                                        className="form-control form-control-sm"
                                    />
                                )}
                            </td>
                            <td>
                                {!row.isBlank ? (
                                    <select
                                        value={row.type}
                                        onChange={(e) => handleInputChange(row.id, "type", e.target.value)}
                                        className="form-control form-control-sm"
                                    >
                                        <option value="">Select Room Type</option>
                                        {roomTypes.map((roomType) => (
                                            <option key={roomType.id} value={roomType.RoomType}>
                                                {roomType.RoomType}
                                            </option>
                                        ))}
                                    </select>
                                ) : (<span style={{ height: "18px", display: "block" }}></span>)}
                            </td>
                            <td>
                                {!row.isBlank && (
                                    <div className="d-flex w-100 justify-content-center gap-2">
                                        <span onClick={() => addRow(index)}>
                                            <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                                        </span>
                                        <span onClick={() => deleteRow(row.id)}>
                                            <i className="la la-minus border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                                        </span>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>


        </div >
    );
};

export default RoomingList;










// import React, { useEffect, useState } from 'react';
// import { axiosOther } from '../../../../http/axios_base_url';
// import { useSelector } from 'react-redux';
// import { notifyError, notifySuccess } from '../../../../helper/notify';
// import { Row, Card, Col } from 'react-bootstrap';
// import Table from 'react-bootstrap/Table';

// const initialPayload = [
//     {
//         id: '',
//         QueryId: '',
//         ReferenceNo: '',
//         TourId: 0,
//         QuotationNumber: '',
//         CompanyId: '',
//         HotelId: '',
//         HotelName: '',
//         HotelCategory: '',
//         HotelRoomType: '',
//         GuestId: '',
//         GuestRoomBedTypeId: '',
//         Status: 1,
//         AddedBy: 1,
//     },
// ];

// // const RoomingList = ({ setActiveTab }) => {
// //     const [formvalue, setFormvalue] = useState(initialPayload);
// //     const [roomingList, setRoomingList] = useState([]);
// //     const [guestFilterValue, setGuestFilterValue] = useState([]);
// //     const [selectedGuests, setSelectedGuests] = useState({});
// //     const [selectedRoomTypes, setSelectedRoomTypes] = useState({}); // New state for room types
// //     const [QoutationData, setQoutationData] = useState({});
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);

// //     const { queryData, qoutationData } = useSelector((state) => state?.queryReducer);
// //     const companyId = JSON.parse(localStorage.getItem('token'))?.companyKey;
// //     const { QuotationNumber } = qoutationData || {};
// //     const queryAndQuotationNo = JSON.parse(localStorage.getItem('Query_Qoutation')) || {};

// //     useEffect(() => {
// //         const GuestMasterListData = async () => {
// //             try {
// //                 const { data } = await axiosOther.post('guestmasterlist');
// //                 setGuestFilterValue(data.Data || []);
// //             } catch (error) {
// //                 console.log('Error', error);
// //             }
// //         };

// //         GuestMasterListData();
// //     }, []);  //[queryData, companyId]

// //     async function fetchQueryQuotation() {
// //         try {
// //             setLoading(true);
// //             const { data } = await axiosOther.post('lisFinalQuotation', {
// //                 QueryId: queryAndQuotationNo?.QueryID,
// //                 QuotationNo: queryAndQuotationNo?.QoutationNum,
// //                 TourId: queryData?.QueryAllData?.TourId,
// //             });
// //             setQoutationData(data?.FilteredQuotations[0] || {});
// //             setLoading(false);
// //         } catch (error) {
// //             console.error('Error fetching quotation:', error);
// //             setError('Failed to load quotation data');
// //             setLoading(false);
// //         }
// //     }

// //     useEffect(() => {
// //         fetchQueryQuotation();
// //     }, []);

// //     const getHotelCostsByDay = (data) => {
// //         const hotelCostsByDay = [];

// //         if (data.Days && Array.isArray(data.Days)) {
// //             data.Days.forEach((day) => {
// //                 const dayHotelData = {
// //                     day: day.Day,
// //                     destination: day.DestinationName || 'Unknown',
// //                     Hotelid: 'Unknown',
// //                     hotelDetails: {
// //                         hotelName: 'Unknown',
// //                         hotelCategory: 'Unknown',
// //                         mealPlan: 'Unknown',
// //                     },
// //                     rooms: [],
// //                 };

// //                 if (day.DayServices && Array.isArray(day.DayServices)) {
// //                     const hotelService = day.DayServices.find(
// //                         (service) => service.ServiceType === 'Hotel'
// //                     );

// //                     if (hotelService && hotelService.TotalCosting) {
// //                         dayHotelData.Hotelid = hotelService.ServiceId || 'Unknown';
// //                         dayHotelData.hotelDetails = {
// //                             hotelName: hotelService.ServiceDetails?.[0]?.ItemName || 'Unknown',
// //                             hotelCategory: hotelService.HotelCategoryName || 'Unknown',
// //                             mealPlan: hotelService.MealPlanName || 'Unknown',
// //                         };

// //                         hotelService.TotalCosting.forEach((costing) => {
// //                             costing.HotelRoomBedType.forEach((room) => {
// //                                 dayHotelData.rooms.push({
// //                                     roomBedTypeName: room.RoomBedTypeName,
// //                                     totalServiceCost: Number(room.TotalServiceCost) || 0,
// //                                     pax: room.RoomBedTypeName.includes('DBL') ? 2 : 1,
// //                                 });
// //                             });
// //                         });
// //                     }
// //                 }

// //                 if (dayHotelData.rooms.length > 0) {
// //                     hotelCostsByDay.push(dayHotelData);
// //                 }
// //             });
// //         }
// //         return hotelCostsByDay;
// //     };

// //     const hotelCostsByDay = getHotelCostsByDay(QoutationData);

// //     console.log(hotelCostsByDay,"hotelCostsByDay");
    

// //     const handleGuestSelect = (roomId, guest) => {
// //         setSelectedGuests((prev) => ({
// //             ...prev,
// //             [roomId]: guest,
// //         }));
// //     };

// //     const handleRoomBedTypeChange = (e, dayIndex, roomIndex) => {
// //         const roomId = `room-${dayIndex}-${roomIndex}`;
// //         setSelectedRoomTypes((prev) => ({
// //             ...prev,
// //             [roomId]: e.target.value,
// //         }));
// //     };

// //     const roomBedTypeName = Array.from(
// //         new Set(
// //             hotelCostsByDay.flatMap((day) =>
// //                 day.rooms.map((room) => room.roomBedTypeName)
// //             )
// //         )
// //     );

// //     const buildRoomingPayload = () => {
// //         let payload = [];

// //         hotelCostsByDay.forEach((dayData, dayIndex) => {
// //             let guestDetails = [];

// //             dayData.rooms.forEach((room, roomIndex) => {
// //                 const guestId = selectedGuests[`room-${dayData.day}-${roomIndex}`];
// //                 const roomType = selectedRoomTypes[`room-${dayIndex}-${roomIndex}`] || room.roomBedTypeName;
// //                 if (guestId && guestId !== '0') {
// //                     guestDetails.push({
// //                         GuestId: Number(guestId),
// //                         GuestRoomBedTypeId: roomIndex + 1, // Update as needed
// //                     });
// //                 }
// //             });

// //             if (guestDetails.length > 0) {
// //                 payload.push({
// //                     id: '',
// //                     QueryId: queryData?.QueryAlphaNumId,
// //                     ReferenceNo: queryData?.QueryAllData?.ReferenceId,
// //                     TourId: queryData?.QueryAllData?.TourId,
// //                     QuotationNumber: QoutationData?.QuotationNumber,
// //                     CompanyId: companyId,
// //                     HotelId: +dayData.Hotelid,
// //                     HotelName: dayData.hotelDetails.hotelName,
// //                     HotelCategory: dayData.hotelDetails.hotelCategory,
// //                     HotelRoomType: selectedRoomTypes[`room-${dayIndex}-0`] || dayData.rooms[0]?.roomBedTypeName || 'Unknown',
// //                     GuestDetails: guestDetails,
// //                     Status: 1,
// //                     AddedBy: 1,
// //                 });
// //             }
// //         });

// //         return payload;
// //     };

// //     const handleSubmit = async () => {
// //         try {
// //             const payload = buildRoomingPayload();
// //             setFormvalue(payload);
// //             const { data } = await axiosOther.post('store-roominglist', payload);
// //             if (data?.Status === 1) {
// //                 setRoomingList(data);
// //                 notifySuccess(data?.message || data?.Message);
// //             } else {
// //                 notifyError(data?.message || data?.Message);
// //             }
// //         } catch (error) {
// //             console.log('Error', error);
// //         }
// //     };

// //     return (
// //         <div className="row">
// //             <div className="col-lg-12">
// //                 <div className="card">
// //                     <div className="card-header border-0">
// //                         <h4 className="card-title">HOTEL ROOMING LIST</h4>
// //                         <div className="d-flex justify-content-end gap-3 mb-2">
// //                             <button className="btn btn-dark btn-custom-size" name="SaveButton"
// //                                 onClick={() => setActiveTab("GuestList")}
// //                             >
// //                                 <span className="me-1">Back</span>
// //                                 <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
// //                             </button>
// //                             <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
// //                                 Submit
// //                             </button>
// //                             <button
// //                                 className="btn btn-primary btn-custom-size "
// //                                 name="SaveButton"
// //                                 // onClick={() => navigate("/query/payments")}
// //                                 onClick={() => setActiveTab("ContactList")}
// //                             >
// //                                 <span className="me-1">Next</span>
// //                                 <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
// //                             </button>
// //                         </div>
// //                     </div>
// //                     <div className="card-body">
// //                         <div className="w-100">
// //                             {hotelCostsByDay.map((dayData, dayIndex) => (
// //                                 <div key={`day-${dayData.day}`}>
// //                                     <table className="table table-bordered itinerary-table mb-0">
// //                                         <tbody>
// //                                             <tr>
// //                                                 <td className="text-start">Day {dayData.day}</td>
// //                                                 <td className="text-start">{dayData.destination}</td>
// //                                                 <td className="text-start">{dayData.hotelDetails.hotelName}</td>
// //                                                 <td className="text-start">{dayData.hotelDetails.hotelCategory} Star</td>
// //                                             </tr>
// //                                             <tr>
// //                                                 <td className="text-start">
// //                                                     Room Type: {dayData.rooms[0]?.roomBedTypeName || 'Unknown'}
// //                                                 </td>
// //                                             </tr>
// //                                         </tbody>
// //                                     </table>

// //                                     <div>
// //                                         <table className="table table-bordered itinerary-table">
// //                                             <thead>
// //                                                 <tr>
// //                                                     <th>Room</th>
// //                                                     <th>Pax</th>
// //                                                     <th>Guest</th>
// //                                                     <th>Room Category</th>
// //                                                 </tr>
// //                                             </thead>
// //                                             <tbody>
// //                                                 {dayData.rooms.map((room, roomIndex) => (
// //                                                     <tr key={`room-${dayData.day}-${roomIndex}`}>
// //                                                         <td>Room {roomIndex + 1}</td>
// //                                                         <td>{room.pax}</td>
// //                                                         <td>
// //                                                             <select
// //                                                                 className="form-control form-control-sm"
// //                                                                 value={selectedGuests[`room-${dayData.day}-${roomIndex}`] || '0'}
// //                                                                 onChange={(e) =>
// //                                                                     handleGuestSelect(`room-${dayData.day}-${roomIndex}`, e.target.value)
// //                                                                 }
// //                                                             >
// //                                                                 <option value="0">Select</option>
// //                                                                 {guestFilterValue?.map((guest) => (
// //                                                                     <option key={guest.id} value={guest.id}>
// //                                                                         {guest.Title + ' ' + guest.FirstName + ' ' + guest.MiddleName + ' ' + guest.LastName}
// //                                                                     </option>
// //                                                                 ))}
// //                                                             </select>
// //                                                         </td>
// //                                                         <td>
// //                                                             <select
// //                                                                 className="form-control form-control-sm"
// //                                                                 value={selectedRoomTypes[`room-${dayIndex}-${roomIndex}`] || room.roomBedTypeName}
// //                                                                 onChange={(e) => handleRoomBedTypeChange(e, dayIndex, roomIndex)}
// //                                                             >
// //                                                                 {roomBedTypeName.map((option) => (
// //                                                                     <option key={option} value={option}>
// //                                                                         {option}
// //                                                                     </option>
// //                                                                 ))}
// //                                                             </select>
// //                                                         </td>
// //                                                     </tr>
// //                                                 ))}
// //                                             </tbody>
// //                                         </table>
// //                                     </div>
// //                                 </div>
// //                             ))}
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>

// //             {hotelCostsByDay.length === 0 && (
// //                 <h4 className="text-center">No hotel data available for this quotation.</h4>
// //             )}
// //             <div className="d-flex justify-content-end gap-3">
// //                 <button className="btn btn-dark btn-custom-size" name="SaveButton"
// //                     onClick={() => setActiveTab("GuestList")}
// //                 >
// //                     <span className="me-1">Back</span>
// //                     <i className="fa-solid fa-backward text-dark bg-white p-1 rounded"></i>
// //                 </button>
// //                 <button onClick={handleSubmit} className="btn btn-primary btn-custom-size">
// //                     Submit
// //                 </button>
// //                 <button
// //                     className="btn btn-primary btn-custom-size "
// //                     name="SaveButton"
// //                     // onClick={() => navigate("/query/payments")}
// //                     onClick={() => setActiveTab("TaskScheduling")}
// //                 >
// //                     <span className="me-1">Next</span>
// //                     <i className="fa-solid fa-forward text-primary bg-white p-1 rounded"></i>
// //                 </button>
// //             </div>
// //         </div>
// //     );
// // };

// export default RoomingList;