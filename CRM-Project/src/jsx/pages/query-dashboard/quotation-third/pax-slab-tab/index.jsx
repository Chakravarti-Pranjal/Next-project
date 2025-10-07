import React, { useEffect, useMemo, useState } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { paxSlabTableInitialValue } from "../qoutation_initial_value";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { axiosOther } from "../../../../../http/axios_base_url";
import { useSelector } from "react-redux";
import { notifyError, notifySuccess } from "../../../../../helper/notify";
import { ToastContainer } from "react-toastify";
import { setLocalHotelFormValue } from "../../../../../store/actions/queryAction";

const PaxSlab = ({ paxSlab }) => {
  const {
    qoutationData,
    queryData,
    isItineraryEditing,
    itineraryHotelValue,
    localHotelValue,
    payloadQueryData,
  } = useSelector((data) => data?.queryReducer);

  const factorInitial = {
    factor: "",
    factorInd: "",
    transType: "",
  };

  const [slabFormValue, setSlabFormValue] = useState([]);
  const [slabSingleFormValue, setSlabSingleFormValue] = useState([]);
  const [transportId, setTransportId] = useState([]);
  const [multipletransportId, setMultipleTransportId] = useState([]);
  const [isAllPaxChecked, setIsAllPaxChecked] = useState("");
  const [singleDevidingFactor, setSingleDevidingFactor] = useState([]);
  const [multipleDevidingFactor, setMultipleDevidingFactor] = useState([]);
  const [singleVehicleNo, setSingleVehicleNo] = useState([]);
  const [multipleVehicleNo, setMultipleVehicleNo] = useState([]);
  const [slabSingleOriginalForm, setSingleOriginalForm] = useState([]);

  const [initialList, setInitialList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const hotelprice = useSelector((state) => state?.priceReducer);
  const { PaxSlab } = qoutationData;

  useEffect(() => {
    // intialization of form value
    if (!PaxSlab?.length > 0) {
      const intialFormValue = initialList?.map((pax, index) => {
        return {
          QueryId: queryData?.QueryAlphaNumId,
          QuotationNumber: qoutationData?.QuotationNumber,
          CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
          UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
          PaxSlabId: pax?.id,
          Min: pax?.Min ?? 0,
          Max: pax?.Max ?? 0,
          DividingFactor: pax?.DividingFactor ?? 0,
          TransportType: payloadQueryData?.Prefrences?.VehiclePreference || "",
          SupplimentTransferType: "1",
          NoOfVehicle: 1,
          NoOfEscort: 1,
          TransportTotalCost: "",
          DayAct: "",
          TopMargin: "",
          IGST: "",
          HotelTotalCost: hotelprice?.totalRoomCost,
          Meal:
            hotelprice?.TotalResturantPricePax != ""
              ? hotelprice?.totalMealCost + hotelprice?.TotalResturantPricePax
              : hotelprice?.totalMealCost,
          AddOn: hotelprice?.TotalActivityPricePax
            ? hotelprice?.TotalActivityPricePax
            : "",
          Misc: hotelprice?.totalMSCCost ? hotelprice?.totalMSCCost : "",
          MFees: hotelprice?.TotalMonumentPricePax,
          Guide: hotelprice?.TotalGuidePricePax,
          Train: "0",
          GuideFare: "0",
          Commission: "0",
          Total: "0",
          TotalInUSD: "0",
          AirInUSD: "0",
          IsChecked: index === 0,
          Nett: "",
          Escort: 1,
        };
      });
      const intialSingleFormValue =
        intialFormValue.length > 0
          ? [
              {
                ...intialFormValue[0],
                QueryId: queryData?.QueryAlphaNumId,
                QuotationNumber: qoutationData?.QuotationNumber,
                CompanyId: JSON.parse(localStorage.getItem("token"))
                  ?.companyKey,
                UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
                Min: 1,
                Max: 2,
                DividingFactor: 2,
                NoOfVehicle: 1,
                NoOfEscort: 1,
                Escort: 1,
                HotelTotalCost: hotelprice?.totalRoomCost,
                Meal:
                  hotelprice?.TotalResturantPricePax != ""
                    ? hotelprice?.totalMealCost +
                      hotelprice?.TotalResturantPricePax
                    : hotelprice?.totalMealCost,
                AddOn: hotelprice?.TotalActivityPricePax
                  ? hotelprice?.TotalActivityPricePax
                  : 0,
                Misc: hotelprice?.totalMSCCost ? hotelprice?.totalMSCCost : "",
                MFees: hotelprice?.TotalMonumentPricePax,
                Guide: hotelprice?.TotalGuidePricePax,
                Train: "0",
                GuideFare: "0",
                Commission: "0",
                Total: "0",
                TotalInUSD: "0",
                AirInUSD: "0",
                TransportType: payloadQueryData?.Prefrences?.VehiclePreference
                  ? payloadQueryData?.Prefrences?.VehiclePreference
                  : "",
                SupplimentTransferType: "1",
                NoOfVehicle: 1,
                NoOfEscort: "",
                TransportTotalCost: "",
                DayAct: "",
                TopMargin: "",
                IGST: "",
                Nett: "",
              },
            ]
          : [];
      const multiFactorInital = initialList?.map((list, ind) => {
        return {
          factorInd: ind,
          factor: list?.DividingFactor || "",
          transType: list?.TransportType || "",
        };
      });

      const singleFact = {
        factorInd: 0,
        factor:
          initialList[0]?.DividingFactor > 0
            ? initialList[0]?.DividingFactor
            : 1,
        transType: payloadQueryData?.Prefrences?.VehiclePreference || "",
      };
      const sglTransprtId = {
        id: payloadQueryData?.Prefrences?.VehiclePreference || "",
        transIndex: 0,
      };
      const snglVehicle = { value: 1, index: 0 };

      const mltplVehicle = initialList?.map((list, ind) => {
        return {
          value: 1,
          index: ind,
        };
      });
      setMultipleVehicleNo(mltplVehicle);
      setSingleVehicleNo([snglVehicle]);
      setTransportId([sglTransprtId]);
      setSingleDevidingFactor([singleFact]);
      setMultipleDevidingFactor(multiFactorInital);
      setSlabFormValue(intialFormValue);
      setSlabSingleFormValue(intialSingleFormValue);
    } else {
      const intialFormValue = PaxSlab?.map((pax, index) => {
        return {
          QueryId: pax?.QueryId,
          QuotationNumber: pax?.QuotationNumber,
          CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
          UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
          PaxSlabId: pax?.PaxSlabId,
          Min: pax?.Min ?? 0,
          Max: pax?.Max ?? 0,
          DividingFactor: pax?.DividingFactor ?? 0,
          TransportType: pax?.TransportType || "",
          SupplimentTransferType: pax?.SupplimentTransferType || "",
          NoOfVehicle: pax?.NoOfVehicle || "",
          NoOfEscort: pax?.NoOfEscort || "",
          TransportTotalCost: pax?.TransportTotalCost || 0,
          DayAct: pax?.DayAct || "",
          TopMargin: pax?.TopMargin || "",
          IGST: pax?.IGST || "",
          HotelTotalCost: pax?.HotelTotalCost || "",
          Meal: pax?.Meal || "",
          AddOn: pax?.AddOn || "",
          Misc: pax?.Misc || "",
          MFees: pax?.MFees || "",
          Guide: pax?.Guide || "",
          Train: pax?.Train || "",
          GuideFare: pax?.GuideFare || "",
          Commission: pax?.Commission || "",
          Total: pax?.Total || "",
          TotalInUSD: pax?.TotalInUSD || "",
          AirInUSD: pax?.AirInUSD || "",
          IsChecked: true,
          Nett: pax?.Nett,
          Escort: pax?.Escort,
        };
      });

      const mltplFactor = PaxSlab?.map((pax, ind) => {
        return {
          factorInd: ind,
          factor: pax?.DividingFactor,
          transType: pax?.TransportType,
        };
      });

      const sglFactor = PaxSlab?.map((pax) => {
        return {
          factorInd: 0,
          factor: pax?.DividingFactor || "",
          transType: pax?.TransportType,
        };
      });

      const mltplNoVehicle = PaxSlab?.map((pax, ind) => {
        return {
          value: pax?.NoOfVehicle,
          index: ind,
        };
      });

      const sglNoVehicle = PaxSlab?.map((pax, ind) => {
        return {
          value: pax?.NoOfVehicle,
          index: ind,
        };
      });

      setMultipleVehicleNo(mltplNoVehicle);
      setSingleVehicleNo(sglNoVehicle);
      setSingleDevidingFactor(sglFactor);
      setMultipleDevidingFactor(mltplFactor);
      setSlabFormValue(intialFormValue);
      setSlabSingleFormValue(intialFormValue);
      setSingleOriginalForm(intialFormValue);
    }
  }, [initialList, PaxSlab]);

  // settting transport-total-cost for single slab form
  const setSingleTranportPrice = (id, transeInd) => {
    setSlabSingleFormValue((prevArr) => {
      let newArr = [...prevArr];
      newArr[transeInd] = {
        ...newArr[transeInd],
        TransportTotalCost: Math.round(
          parseInt(hotelprice?.TransportPrice[id]?.totalCostWithMarkup) +
            parseInt(hotelprice?.TransportPrice[id]?.markupWithHike)
        ),
      };
      return newArr;
    });
  };
  useEffect(() => {
    transportId?.forEach(({ id, transIndex }) => {
      setSingleTranportPrice(id, transIndex);
    });
  }, [transportId?.map((item) => item?.id).join(",")]);

  const setMultiTranportPrice = (id, transeInd) => {
    setSlabFormValue((prevArr) => {
      let newArr = [...prevArr];
      newArr[transeInd] = {
        ...newArr[transeInd],
        TransportTotalCost: Math.round(
          hotelprice?.TransportPrice[id]?.totalCostWithMarkup +
            hotelprice?.TransportPrice[id]?.markupWithHike
        ),
      };
      return newArr;
    });
  };

  useEffect(() => {
    multipletransportId?.forEach(({ id, transIndex }) => {
      setMultiTranportPrice(id, transIndex);
    });
  }, [multipletransportId?.map((item) => item?.id).join(",")]);

  const getDataToServer = async () => {
    try {
      const { data } = await axiosOther.post("paxslablist");
      setInitialList(data?.DataList);
    } catch (error) {
      console.log("error-pax", error);
    }
    try {
      const { data } = await axiosOther.post("vehicletypemasterlist");
      setVehicleList(data?.DataList);
    } catch (error) {
      console.log("error-pax", error);
    }
  };
  useEffect(() => {
    getDataToServer();
  }, []);

  const handleFormChange = (e, index, Type) => {
    // reviewed handling onchage data
    const { name, value, checked } = e.target;

    if (name == "DividingFactor" && Type == "single") {
      setSingleDevidingFactor((prevArr) => {
        let newArr = [...prevArr];
        newArr[index] = {
          factor: parseInt(value || 1),
          factorInd: index,
          transType: slabSingleFormValue[index]?.TransportType,
        };
        return newArr;
      });
    }
    if (name == "NoOfVehicle" && Type == "single") {
      setSingleVehicleNo((prevArr) => {
        let newForm = [...prevArr];
        newForm[index] = { value: value, index: index };
        return newForm;
      });
    }

    if (name == "NoOfVehicle" && Type == "Multiple") {
      setMultipleVehicleNo((prevArr) => {
        let newForm = [...prevArr];
        newForm[index] = { value: value, index: index };
        return newForm;
      });
    }

    if (name == "DividingFactor" && Type == "Multiple") {
      multipleDevidingFactor((prevArr) => {
        let newArr = [...prevArr];
        newArr[index] = {
          factor: parseInt(value || 1),
          factorInd: index,
          transType: slabSingleFormValue[index]?.TransportType,
        };
        return newArr;
      });
    }

    switch (Type) {
      case "single":
        if (name == "isChecked") {
          setSlabSingleFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], IsChecked: checked };
            return newArr;
          });
        } else if (name == "TransportType") {
          setTransportId((prevState) => {
            const updatedArray = [...prevState];
            updatedArray[index] = { id: value, transIndex: index };

            return updatedArray;
          });
          setSlabSingleFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], [name]: value };
            return newArr;
          });
        } else {
          setSlabSingleFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], [name]: value };
            return newArr;
          });
        }
        break;
      case "Multiple":
        if (name == "isChecked") {
          setSlabFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], IsChecked: checked };
            return newArr;
          });
        } else if (name == "DividingFactor") {
          setSingleDevidingFactor((prevArr) => {
            let newArr = [...prevArr];
            newArr[index] = { factor: parseInt(value || 1), factorInd: index };
            return newArr;
          });
          setSlabFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], [name]: value };
            return newArr;
          });
        } else if (name == "TransportType") {
          setMultipleTransportId((prevState) => {
            const updatedArray = [...prevState];
            updatedArray[index] = {
              id: value,
              transIndex: index,
              TransportTotalCost: "",
            };
            return updatedArray;
          });

          setSlabFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], [name]: value };
            return newArr;
          });
        } else {
          setSlabFormValue((prevArr) => {
            const newArr = [...prevArr];
            newArr[index] = { ...newArr[index], [name]: value };
            return newArr;
          });
        }
    }
  };

  const handleAllPaxChange = (e) => {
    // doing check and uncheck of form
    const { checked, value } = e.target;
    const updatedSlabFormValue = slabFormValue.map((slab) => ({
      ...slab,
      IsChecked: checked,
    }));
    const updatedSingleSlabFormValue = slabSingleFormValue.map((slab) => ({
      ...slab,
      IsChecked: checked,
    }));
    setSlabFormValue(updatedSlabFormValue);
    setSlabSingleFormValue(updatedSingleSlabFormValue);
  };

  const handleIncrementTable = (indx) => {
    // table increaing
    const addTable = slabFormValue?.filter((_, index) => index == indx)[0];
    setSlabFormValue((prevArr) => {
      const newArr = [...prevArr];
      newArr.splice(indx + 1, 0, addTable);
      return newArr;
    });
    const dvdFctor = slabFormValue[slabFormValue.length - 1]?.DividingFactor;
    const trnsType = slabFormValue[slabFormValue.length - 1]?.TransportType;
    setMultipleDevidingFactor([
      ...multipleDevidingFactor,
      {
        ...factorInitial,
        factorInd: multipleDevidingFactor.length,
        factor: parseInt(dvdFctor || 1),
        transType: trnsType,
      },
    ]);

    setMultipleVehicleNo((prevArr) => {
      let newArr = [...prevArr];
      newArr = [...newArr, newArr[indx]];
      return newArr;
    });
  };

  const handleIncrementSingleTable = (indx) => {
    // table decreasing
    const addTable = slabSingleFormValue?.filter(
      (_, index) => index == indx
    )[0];
    setSlabSingleFormValue((prevArr) => {
      let newArr = [...prevArr];
      newArr = [...newArr, slabSingleFormValue[indx]];
      return newArr;
      // newArr.splice(indx + 1, 0, addTable);
      // return newArr;
    });

    const dvdFctor =
      slabSingleFormValue[slabSingleFormValue.length - 1]?.DividingFactor;
    const trnsType =
      slabSingleFormValue[slabSingleFormValue.length - 1]?.TransportType;

    setTransportId((prevArr) => {
      let newArr = [...prevArr];
      newArr = [
        ...newArr,
        { id: newArr[indx]?.id, transIndex: newArr[indx]?.transIndex },
      ];
      return newArr;
    });

    setSingleDevidingFactor([
      ...singleDevidingFactor,
      {
        ...factorInitial,
        factorInd: singleDevidingFactor?.length,
        factor: parseInt(dvdFctor),
        transType: trnsType,
      },
    ]);

    setSingleVehicleNo((prevArr) => {
      let newArr = [...prevArr];
      newArr = [...newArr, newArr[indx]];
      return newArr;
    });
  };

  const handleDecrementTable = (indx) => {
    // decremet table
    const filteredTable = slabFormValue?.filter((_, ind) => ind != indx);
    setSlabFormValue(filteredTable);

    const filteredMultiFactor = multipleDevidingFactor?.filter(
      (_, ind) => ind != indx
    );
    setMultipleDevidingFactor(filteredMultiFactor);

    const filteredVehicle = multipleVehicleNo?.filter((_, ind) => ind != indx);
    setMultipleVehicleNo(filteredVehicle);
  };

  const handleDecrementSingleTable = (indx) => {
    // increment table
    const filteredTable = slabSingleFormValue?.filter((_, ind) => ind != indx);
    setSlabSingleFormValue(filteredTable);
    const filteredSglFactor = singleDevidingFactor?.filter(
      (_, ind) => ind != indx
    );

    const filteredDivFactor = singleDevidingFactor?.filter(
      (_, index) => index != indx
    );
    const filteredTransId = transportId?.filter((_, ind) => ind != indx);
    setTransportId(filteredTransId);
    setSingleDevidingFactor(filteredDivFactor);
    setSingleDevidingFactor(filteredSglFactor);
    const filteredVehicle = singleVehicleNo?.filter((_, ind) => ind != indx);
    setSingleVehicleNo(filteredVehicle);
  };

  const handleSubmit = async () => {
    // submitting data
    let finalSave =
      paxSlab?.PaxSlabType == "Single Slab"
        ? slabSingleFormValue
            ?.filter((slab) => slab?.IsChecked === true)
            ?.map(({ IsChecked, ...rest }) => rest)
        : slabFormValue
            ?.filter((slab) => slab?.IsChecked === true)
            ?.map(({ IsChecked, ...rest }) => rest);

    const finalJson = finalSave?.map((data) => ({
      ...data,
      Nett: Math.round(
        ((parseInt(data?.Guide) || 0) +
          (parseInt(data?.HotelTotalCost) || 0) +
          (parseInt(data?.Meal) || 0) +
          (parseInt(data?.AddOn) || 0) +
          (parseInt(data?.Misc) || 0) +
          (parseInt(data?.MFees) || 0) +
          parseInt(data?.TransportTotalCost)) /
          data?.DividingFactor ==
          1 || data?.DividingFactor > 1
          ? data?.DividingFactor
          : 1
      ),
    }));

    try {
      const { data } = await axiosOther.post("store-paxSlabData", finalJson);

      if (data?.status == 1 || data?.Status == 1) {
        notifySuccess(data?.message || data?.Message);
      }
    } catch (error) {
      if (error.response?.data?.Errors || error.response?.data?.errors) {
        const data = Object.entries(
          error.response?.data?.Errors || error.response?.data?.errors
        );
        notifyError(data[0][1]);
      }
      if (error.response?.data) {
        const data = Object.entries(error.response?.data);
        notifyError(data[0][1]);
      }
    }
  };

  // setting all value into from that's comming through redux from itineraries
  useEffect(() => {
    if (hotelprice) {
      // Ensure hotelprice is not undefined or null
      const transferId = payloadQueryData?.Prefrences?.VehiclePreference;
      setSlabFormValue((form) => {
        let newForm = form.map((prices) => {
          let NettValue = Math.round(
            hotelprice.HotelPrice +
              hotelprice.MealPrice / prices?.DividingFactor ||
              2 + hotelprice.AdditinalPrice / prices?.DividingFactor ||
              2 + hotelprice.GuidePrice / prices?.DividingFactor ||
              2 + hotelprice.MonumentPrice / prices?.DividingFactor ||
              2 + hotelprice.TrainPrice / prices?.DividingFactor ||
              2 + hotelprice?.ActivityPrice / prices?.DividingFactor ||
              2
          );
          let GST = Math.round((NettValue * 5) / 100);
          let COMMSN = Math.round(((NettValue + GST) * 5) / 100);
          return {
            ...prices,
            HotelTotalCost: Math.round(hotelprice.HotelPrice),
            Meal: Math.round(
              hotelprice.MealPrice / prices?.DividingFactor || 2
            ),
            Misc: Math.round(
              hotelprice.AdditinalPrice / prices?.DividingFactor || 2
            ),
            Guide: Math.round(
              hotelprice.GuidePrice / prices?.DividingFactor || 2
            ),
            MFees: Math.round(
              hotelprice.MonumentPrice / prices?.DividingFactor || 2
            ),
            Train: Math.round(
              hotelprice.TrainPrice / prices?.DividingFactor || 2
            ),
            AddOn: Math.round(
              hotelprice?.ActivityPrice / prices?.DividingFactor || 2
            ),
            Nett: Math.round(NettValue),
            TransportType: transferId,
            TransportTotalCost: Math.round(
              hotelprice?.TransportPrice[transferId]?.totalCostWithMarkup +
                hotelprice?.TransportPrice[transferId]?.markupWithHike
            ),
            IGST: Math.round(GST),
            Commission: Math.round(COMMSN),
          };
        });
        return newForm;
      });

      setSlabSingleFormValue((form) => {
        let newForm = [...form];
        newForm = newForm.map((prices) => ({
          ...prices,
          HotelTotalCost: hotelprice.HotelPrice,
          Meal: Math.round(hotelprice.MealPrice / prices?.DividingFactor),
          Misc: Math.round(hotelprice.AdditinalPrice / prices?.DividingFactor),
          Guide: Math.round(hotelprice.GuidePrice / prices?.DividingFactor),
          MFees: Math.round(hotelprice.MonumentPrice / prices?.DividingFactor),
          Train: Math.round(hotelprice.TrainPrice / prices?.DividingFactor),
          AddOn: Math.round(hotelprice?.ActivityPrice / prices?.DividingFactor),
          TransportType: transferId,
          TransportTotalCost: Math.round(
            (hotelprice?.TransportPrice[transferId]?.totalCostWithMarkup +
              hotelprice?.TransportPrice[transferId]?.markupWithHike) /
              prices?.DividingFactor || 2
          ),
          Nett: Math.round(
            hotelprice.HotelPrice +
              hotelprice.MealPrice / prices?.DividingFactor ||
              2 + hotelprice.AdditinalPrice / prices?.DividingFactor ||
              2 + hotelprice.GuidePrice / prices?.DividingFactor ||
              2 + hotelprice.MonumentPrice / prices?.DividingFactor ||
              2 + hotelprice.TrainPrice / prices?.DividingFactor ||
              2 + hotelprice?.ActivityPrice / prices?.DividingFactor ||
              2
          ),
        }));
        return newForm;
      });
    }
  }, [hotelprice?.togglePriceState]);

  // deviding value with devidingFactor of single form
  const handleSingleDividingFactor = (factor, index, transType) => {
    setSlabSingleFormValue((prevArr) => {
      let newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        Meal: Math.round(hotelprice.MealPrice / factor || 2),
        Misc: Math.round(hotelprice.AdditinalPrice / factor || 2),
        Guide: Math.round(hotelprice.GuidePrice / factor || 2),
        MFees: Math.round(hotelprice.MonumentPrice / factor || 2),
        Train: Math.round(hotelprice.TrainPrice / factor || 2),
        AddOn: Math.round(hotelprice?.ActivityPrice / factor || 2),
        TransportTotalCost: Math.round(
          (hotelprice?.TransportPrice[transType]?.totalCostWithMarkup +
            hotelprice?.TransportPrice[transType]?.markupWithHike) /
            factor || 1
        ),
      };
      return newArr;
    });
  };

  // deviding value with devidingFactor of multiple form
  const handleMultipleDividingFactor = (factor, index, transType) => {
    setSlabFormValue((prevArr) => {
      let newArr = [...prevArr];
      newArr[index] = {
        ...newArr[index],
        Meal: Math.round(hotelprice.MealPrice / factor || 2),
        Misc: Math.round(hotelprice.AdditinalPrice / factor || 2),
        Guide: Math.round(hotelprice.GuidePrice / factor || 2),
        MFees: Math.round(hotelprice.MonumentPrice / factor || 2),
        Train: Math.round(hotelprice.TrainPrice / factor || 2),
        AddOn: Math.round(hotelprice?.ActivityPrice / factor || 2),
        TransportTotalCost: Math.round(
          (hotelprice?.TransportPrice[transType]?.totalCostWithMarkup +
            hotelprice?.TransportPrice[transType]?.markupWithHike) /
            factor || 1
        ),
      };
      return newArr;
    });
  };

  useEffect(() => {
    singleDevidingFactor?.forEach(({ factor, factorInd, transType }) => {
      handleSingleDividingFactor(factor, factorInd, transType);
    });
  }, [singleDevidingFactor?.map(({ factor }) => factor).join(",")]);

  useEffect(() => {
    multipleDevidingFactor?.forEach(({ factor, factorInd, transType }) => {
      handleMultipleDividingFactor(factor, factorInd, transType);
    });
  }, [multipleDevidingFactor?.map(({ factor }) => factor).join(",")]);

  const openPopup = async () => {
    // console.log("queryQueryId", {
    //   QueryId: queryData?.QueryID ?? queryData?.QueryAlphaNumId, // Corrected casing
    //   QuotationNumber: queryData?.QuotationNumber, // Corrected spelling
    //   TemplateType: "FIT-Costsheet",
    // });

    try {
      const response = await axiosOther.post("costsheet-template", {
        QueryId: queryData?.QueryID ?? queryData?.QueryAlphaNumId, // Corrected casing
        QuotationNumber: qoutationData?.QuotationNumber, // Corrected spelling
        TemplateType: "FIT-Costsheet",
      });
      console.log(response);
      if (response.status !== 200) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const templateUrl = response.data?.TemplateUrl;
      if (!templateUrl) {
        throw new Error("Template URL not received from API.");
      }

      // Create popup container
      const popupDiv = document.createElement("div");
      Object.assign(popupDiv.style, {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      });

      // Create iframe
      const iframe = document.createElement("iframe");
      Object.assign(iframe.style, {
        width: "90%",
        height: "90%",
        border: "none",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        backgroundColor: "white",
      });

      iframe.src = templateUrl; // Load the external template URL

      // Close button
      const closeButton = document.createElement("div");
      closeButton.innerHTML = "&times;";
      Object.assign(closeButton.style, {
        position: "absolute",
        top: "10px",
        right: "20px",
        fontSize: "2rem",
        fontWeight: "lighter",
        color: "#bd241a",
        cursor: "pointer",
        zIndex: 1001,
      });

      closeButton.onclick = () => {
        document.body.style.overflow = "auto";
        document.body.removeChild(popupDiv);
      };

      // Append elements
      popupDiv.appendChild(iframe);
      popupDiv.appendChild(closeButton);
      document.body.appendChild(popupDiv);
      document.body.style.overflow = "hidden";
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      alert("Failed to generate the template. Please try again later.");
    }
  };

  const handleSingleTransportPriceDividingByVehicleNo = (value, index) => {
    setSlabSingleFormValue((form) => {
      let newForm = [...form];
      newForm = newForm.map((item) => {
        return {
          ...item,
          TransportTotalCost:
            item?.TransportType != ""
              ? Math.round(
                  (hotelprice?.TransportPrice[item?.TransportType]
                    ?.totalCostWithMarkup +
                    hotelprice?.TransportPrice[item?.TransportType]
                      ?.markupWithHike) /
                    (item?.factor || 1)
                ) * parseInt(item?.NoOfVehicle || 1)
              : item?.TransportTotalCost,
        };
      });
      return newForm;
    });
  };

  const handleMultipleTransportPriceDividingByVehicleNo = () => {
    setSlabFormValue((form) => {
      let newForm = [...form];
      newForm = newForm.map((item) => {
        return {
          ...item,
          TransportTotalCost:
            item?.TransportType != ""
              ? Math.round(
                  (hotelprice?.TransportPrice[item?.TransportType]
                    ?.totalCostWithMarkup +
                    hotelprice?.TransportPrice[item?.TransportType]
                      ?.markupWithHike) /
                    (item?.factor || 1)
                ) * parseInt(item?.NoOfVehicle || 1)
              : item?.TransportTotalCost,
        };
      });
      return newForm;
    });
  };

  useEffect(() => {
    handleMultipleTransportPriceDividingByVehicleNo();
  }, [slabFormValue?.map((item) => item?.NoOfVehicle).join(",")]);

  useEffect(() => {
    handleSingleTransportPriceDividingByVehicleNo();
  }, [slabSingleFormValue?.map((item) => item?.NoOfVehicle).join(",")]);

  return (
    <>
      <div className="row m-0">
        <div className="col-12 mt-2">
          <ToastContainer />
          <div
            className="d-flex justify-content-between align-items-center flex-wrap  p-1 my-1  border-1 col-lg-2 col-xs-2 "
            style={{ border: "1px solid grey" }}
          >
            <div className="d-flex align-items-center gap-1">
              <label>Pax</label>
              <input
                type="number"
                name="Pax"
                className="formControl1 width50px"
                value={
                  qoutationData?.Pax?.ChildCount +
                  qoutationData?.Pax?.AdultCount
                }
                // onChange={(e) => handleFormChange(e, index)}
                style={{ fontSize: "0.7rem" }}
              />
            </div>
            <div className="d-flex align-items-center gap-1">
              <label>FOC</label>
              <input
                type="number"
                name="Pax"
                className="formControl1 width50px"
                value="1"
                // onChange={(e) => handleFormChange(e, index)}
                style={{ fontSize: "0.7rem" }}
              />
            </div>
          </div>
        </div>
        <div className="col-12 pax-scroll">
          {/* <PerfectScrollbar>
          </PerfectScrollbar> */}
          <table className="table table-bordered itinerary-table table-first-child">
            <thead>
              <tr>
                <th></th>
                <th></th>
                <th></th>
                <th>
                  <div className="form-check check-sm d-flex align-items-center justify-content-center">
                    <input
                      type="checkbox"
                      className="form-check-input height-em-1 width-em-1"
                      id={`star`}
                      onChange={handleAllPaxChange}
                      checked={
                        paxSlab?.PaxSlabType == "Single Slab"
                          ? true
                          : slabFormValue?.every(
                              (item) => item?.IsChecked == true
                            )
                      }
                    />
                  </div>
                </th>
                <th>Min Pax</th>
                <th>Max Pax</th>
                <th>Div Fact</th>
                <th>Trans Type</th>
                <th>No.of Vehicle</th>
                <th>No.of Esc</th>
                <th>No.of F. Esc</th>
                {/* <th>Term Text</th> */}
                <th>Transport</th>
                <th>Hotel</th>
                <th>Meal</th>
                <th>Activity On's</th>
                {/* <th>Day Act</th> */}
                <th>Misc</th>
                <th>M. Fees</th>
                <th>Guide</th>
                <th>Train</th>
                <th>Escort</th>
                <th>Nett</th>
                <th>Top Margin</th>
                <th>IGST[5%]</th>
                <th>Guide Fare</th>
                <th>Commision</th>
                <th>Total</th>
                <th>Total in USD</th>
                <th>Air in USD</th>
              </tr>
            </thead>
            <tbody>
              {paxSlab?.PaxSlabType == "Single Slab"
                ? slabSingleFormValue?.map((slab, index) => {
                    return (
                      <tr key={index + 1}>
                        <td>
                          <i
                            class="fa fa-eye"
                            onClick={handleShow}
                            aria-hidden="true"
                          ></i>
                        </td>
                        <td>
                          <span
                            className="badge bg-info rounded-pill p-0 m-0"
                            onClick={openPopup}
                          >
                            <i className="fa fa-eye"></i>
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <span
                              onClick={() => handleIncrementSingleTable(index)}
                            >
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span
                              onClick={() => handleDecrementSingleTable(index)}
                            >
                              <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="form-check check-sm d-flex align-items-center justify-content-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id={`star`}
                              checked={slabSingleFormValue[index]?.IsChecked}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              name="isChecked"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="Min"
                              className="formControl1 width50px"
                              value={slabSingleFormValue[index]?.Min}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="Max"
                              className="formControl1 width50px"
                              value={slabSingleFormValue[index]?.Max}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="DividingFactor"
                              className="formControl1 width50px"
                              value={slabSingleFormValue[index]?.DividingFactor}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              // style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="TransportType"
                              className="formControl1"
                              value={slabSingleFormValue[index]?.TransportType}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              // style={{fontSize:'0.4rem'}}
                            >
                              <option value="">Select</option>
                              {hotelprice?.transTypeDrop?.length > 0 &&
                                hotelprice?.transTypeDrop.map((data, index) => {
                                  return (
                                    <option key={index} value={data?.value}>
                                      {data?.label}
                                    </option>
                                  );
                                })}
                            </select>
                            {/* <input
                                type="number"
                                className="width50px formControl1"
                                name="TransportType"
                                value={
                                  slabSingleFormValue[index]?.TransportType
                                }
                                onChange={(e) =>
                                  handleFormChange(e, index, "single")
                                }
                                style={{ fontSize: "0.7rem" }}
                              /> */}
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="NoOfVehicle"
                              value={slabSingleFormValue[index]?.NoOfVehicle}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              className="formControl1 width50px"
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="NoOfEscort"
                              value={slabSingleFormValue[index]?.NoOfEscort}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              className="formControl1 width50px"
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="Escort"
                              value={slabSingleFormValue[index]?.Escort}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              className="formControl1 width50px"
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td>
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="DoubleRoom"
                              value={slabSingleFormValue[index]?.DoubleRoom}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              style={{ fontSize: "0.7rem" }}
                            />
                          </div>
                        </td> */}
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TransportTotalCost"
                              // value={}
                              value={Number(
                                slabSingleFormValue[index]?.TransportTotalCost
                              )}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="HotelTotalCost"
                              value={slabSingleFormValue[index]?.HotelTotalCost}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Meal"
                              value={slabSingleFormValue[index]?.Meal}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="AddOn"
                              value={slabSingleFormValue[index]?.AddOn}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="CnBed"
                              value={slabSingleFormValue[index]?.CnBed}
                              onChange={(e) => handleFormChange(e, index)}
                            />
                          </div>
                        </td> */}
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Misc"
                              value={slabSingleFormValue[index]?.Misc}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="MFees"
                              value={slabSingleFormValue[index]?.MFees}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Guide"
                              value={slabSingleFormValue[index]?.Guide}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Train"
                              value={slabSingleFormValue[index]?.Train}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Escort"
                              value={slabSingleFormValue[index]?.Escort}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Nett"
                              value={parseInt(
                                (parseInt(slabSingleFormValue[index]?.Guide) ||
                                  0) +
                                  parseInt(
                                    slabSingleFormValue[index]?.MFees || 0
                                  ) +
                                  parseInt(
                                    slabSingleFormValue[index]?.Misc || 0
                                  ) +
                                  parseInt(
                                    slabSingleFormValue[index]
                                      ?.HotelTotalCost || 0
                                  ) +
                                  parseInt(
                                    slabSingleFormValue[index]?.Meal || 0
                                  ) +
                                  parseInt(
                                    slabSingleFormValue[index]?.AddOn || 0
                                  ) +
                                  (parseInt(
                                    slabSingleFormValue[index]
                                      ?.TransportTotalCost
                                  ) || 0)
                              )}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                              //value={slabSingleFormValue[index]?.Nett}
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="TopMargin"
                              value={slabSingleFormValue[index]?.TopMargin}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="IGST"
                              value={Math.floor(
                                (parseInt(slabSingleFormValue[index]?.Nett) *
                                  5) /
                                  100
                              )}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>

                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="GuideFare"
                              value={slabSingleFormValue[index]?.GuideFare}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Commission"
                              value={
                                (slabSingleFormValue[index]?.Nett +
                                  slabSingleFormValue[index]?.IGST * 5) /
                                100
                              }
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="Total"
                              value={slabSingleFormValue[index]?.Total}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="TotalInUSD"
                              value={slabSingleFormValue[index]?.TotalInUSD}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="width50px formControl1"
                              name="AirInUSD"
                              value={slabSingleFormValue[index]?.AirInUSD}
                              onChange={(e) =>
                                handleFormChange(e, index, "single")
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                : slabFormValue?.map((slab, index) => {
                    return (
                      <tr key={index + 1}>
                        <td>
                          <i
                            class="fa fa-eye"
                            onClick={handleShow}
                            aria-hidden="true"
                          ></i>
                        </td>
                        <td>
                          <span
                            className="badge bg-info rounded-pill p-0 m-0"
                            onClick={openPopup}
                          >
                            <i className="fa fa-eye"></i>
                          </span>
                        </td>
                        <td>
                          <div className="d-flex gap-2 justify-content-center">
                            <span onClick={() => handleIncrementTable(index)}>
                              <i className="la la-plus border cursor-pointer bg-success text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                            <span onClick={() => handleDecrementTable(index)}>
                              <i className="la la-minus  border cursor-pointer bg-primary text-white rounded-pill fontSize10px padding1px"></i>
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="form-check check-sm d-flex align-items-center justify-content-center">
                            <input
                              type="checkbox"
                              className="form-check-input height-em-1 width-em-1"
                              id={`star`}
                              checked={slabFormValue[index]?.IsChecked}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                              name="isChecked"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="Min"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Min}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="Max"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.Max}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="DividingFactor"
                              className="formControl1 width50px"
                              value={slabFormValue[index]?.DividingFactor}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <select
                              name="TransportType"
                              className="formControl1"
                              value={slabFormValue[index]?.TransportType}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                              // style={{fontSize:'0.4rem'}}
                            >
                              <option>Select</option>
                              {hotelprice?.transTypeDrop?.length > 0 &&
                                hotelprice?.transTypeDrop.map((data, index) => {
                                  return (
                                    <option key={index} value={data?.value}>
                                      {data?.label}
                                    </option>
                                  );
                                })}
                            </select>
                            {/* <input
                                type="number"
                                className="width50px formControl1"
                                name="TransportType"
                                value={slabFormValue[index]?.TransportType}
                                onChange={(e) =>
                                  handleFormChange(e, index, "Multiple")
                                }
                              /> */}
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="NoOfVehicle"
                              value={slabFormValue[index]?.NoOfVehicle}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                              className="formControl1 width50px"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              name="NoOfEscort"
                              value={slabFormValue[index]?.NoOfEscort}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                              className="formControl1 width50px"
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Escort"
                              value={slabFormValue[index]?.Escort}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TransportTotalCost"
                              value={
                                slabFormValue[index]?.DividingFactor > 0
                                  ? Number(
                                      slabFormValue[index]?.TransportTotalCost /
                                        slabFormValue[index]?.DividingFactor
                                    )
                                  : slabFormValue[index]?.TransportTotalCost
                              }
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TransportTotalCost"
                              value={slabFormValue[index]?.TransportTotalCost}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td> */}
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="HotelTotalCost"
                              value={slabFormValue[index]?.HotelTotalCost}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Meal"
                              value={slabFormValue[index]?.Meal}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="AddOn"
                              value={slabFormValue[index]?.AddOn}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Misc"
                              value={slabFormValue[index]?.Misc}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="MFees"
                              value={slabFormValue[index]?.MFees}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Guide"
                              value={
                                slabFormValue[index]?.Guide /
                                slabFormValue[index]?.DividingFactor
                              }
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Train"
                              value={slabFormValue[index]?.Train}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Escort"
                              value={slabFormValue[index]?.Escort}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Nett"
                              value={parseInt(
                                (slabFormValue[index]?.Guide /
                                  slabFormValue[index]?.DividingFactor || 0) +
                                  (slabFormValue[index]?.MFees || 0) +
                                  (slabFormValue[index]?.Misc || 0) +
                                  (slabFormValue[index]?.HotelTotalCost || 0) +
                                  (slabFormValue[index]?.Meal || 0) +
                                  (slabFormValue[index]?.AddOn || 0) +
                                  (slabFormValue[index]?.TransportTotalCost /
                                    slabFormValue[index]?.DividingFactor || 0)
                              )}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TopMargin"
                              value={slabFormValue[index]?.TopMargin}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="IGST"
                              value={slabFormValue[index]?.IGST}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>

                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="GuideFare"
                              value={slabFormValue[index]?.GuideFare}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                          {/* </td>
                              <td> */}
                          {/* <div>
                              <input
                              type="number"
                              name="Nett"
                               value={parseInt(
                                (parseInt(slabFormValue[index]?.Guide/slabFormValue[index]?.DividingFactor) || 0) +
                                (parseInt(slabFormValue[index]?.MFees || 0)) +
                                (parseInt(slabFormValue[index]?.Misc || 0)) +
                                (parseInt(slabFormValue[index]?.HotelTotalCost || 0)) +
                                (parseInt(slabFormValue[index]?.Meal || 0)) +
                                (parseInt(slabFormValue[index]?.AddOn || 0))+
                                (parseInt(slabFormValue[index]?.TransportTotalCost/slabFormValue[index]?.DividingFactor)|| 0)
                              )}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div> */}
                        </td>
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TopMargin"
                              value={slabFormValue[index]?.TopMargin}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td> */}
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="IGST"
                              value={slabFormValue[index]?.IGST}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td> */}
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Train"
                              value={slabFormValue[index]?.Train}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td> */}
                        {/* <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="GuideFare"
                              value={slabFormValue[index]?.GuideFare}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td> */}

                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Commission"
                              value={slabFormValue[index]?.Commission}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="Total"
                              value={slabFormValue[index]?.Total}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="TotalInUSD"
                              value={slabFormValue[index]?.TotalInUSD}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                        <td>
                          <div>
                            <input
                              type="number"
                              className="formControl1 width50px"
                              name="AirInUSD"
                              value={slabFormValue[index]?.AirInUSD}
                              onChange={(e) =>
                                handleFormChange(e, index, "Multiple")
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
        <div className="col-12 d-flex justify-content-end align-items-end mt-2">
          <button
            className="btn btn-primary py-1 px-2 radius-4"
            onClick={handleSubmit}
          >
            <i className="fa-solid fa-floppy-disk fs-4"></i>
          </button>
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <div
          style={{
            border: "2px solid white",
            backgroundColor: "#202020",
            width: "300px",
            color: "#fffa",
            padding: "10px",
          }}
        >
          <h4 style={{ textAlign: "center", marginBottom: "10px" }}>
            Option 1
          </h4>
          <div style={{ border: "0.5px solid white", padding: "10px" }}>
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              Top Margin By Per
            </p>
            <div style={{ border: "0.5px solid white", padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="checkbox" />
                <label style={{ marginLeft: "5px" }}>Package</label>
                <input
                  type="number"
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "10px",
                    outline: "none",
                  }}
                />
                <div
                  style={{
                    border: "0.5px solid white",
                    marginLeft: "20px",
                    padding: "5px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 0 5px 0",
                      color: "white",
                      backgroundColor: "#202020",
                    }}
                  >
                    On
                  </p>
                  <div>
                    <input type="radio" name="On" />
                    <label>Cost</label>
                    <input type="radio" name="On" />
                    <label>Sale</label>
                  </div>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="radio" name="" />
                <label>Hotel</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "20px",
                  }}
                  type="number"
                />
                <input style={{ marginLeft: "20px" }} type="radio" name="" />
                <label>Trans</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    backgroundColor: "#2e2e40",
                    marginLeft: "10px",
                  }}
                  type="number"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="radio" name="" />
                <label>Meal</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "20px",
                  }}
                  type="number"
                />
                <input style={{ marginLeft: "20px" }} type="radio" name="" />
                <label>Guide</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    backgroundColor: "#2e2e40",
                    marginLeft: "10px",
                  }}
                  type="number"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="radio" name="" />
                <label>Add On</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "9px",
                  }}
                  type="number"
                />
                <input style={{ marginLeft: "20px" }} type="radio" name="" />
                <label>Escort</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    backgroundColor: "#2e2e40",
                    marginLeft: "10px",
                  }}
                  type="number"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="radio" name="" />
                <label>Menu</label>
                <input
                  style={{
                    width: "45px",
                    height: "18px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    marginLeft: "18px",
                  }}
                  type="number"
                />
                <input style={{ marginLeft: "20px" }} type="radio" name="" />
                <label>D Act</label>
                <input
                  style={{
                    width: "45px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    height: "18px",
                    marginLeft: "10px",
                  }}
                  type="number"
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input type="radio" name="" />
                <label>Misc</label>
                <input
                  style={{
                    width: "45px",
                    color: "white",
                    backgroundColor: "#2e2e40",
                    height: "18px",
                    marginLeft: "20px",
                  }}
                  type="number"
                />
              </div>
            </div>
          </div>
          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              marginTop: "10px",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              F.Escot
            </p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <input type="radio" name="" />
              <label>Hotel</label>
              <input
                style={{
                  width: "45px",
                  height: "18px",
                  color: "white",
                  backgroundColor: "#2e2e40",
                  marginLeft: "10px",
                }}
                type="number"
              />
            </div>
          </div>
          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p
              style={{
                margin: "0 0 10px 0",
                color: "white",
                backgroundColor: "#202020",
              }}
            >
              Top Margin Amount
            </p>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input type="checkbox" />
              <label style={{ marginLeft: "5px" }}>On Amount</label>
              <input
                type="Number"
                style={{
                  marginLeft: "10px",
                  color: "white",
                  backgroundColor: "#2e2e40",
                  flex: 1,
                }}
              />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <input type="checkbox" />
              <label style={{ marginLeft: "5px" }}>On Amount (PKG)</label>
              <input
                type="Number"
                style={{
                  marginLeft: "16px",
                  color: "white",
                  backgroundColor: "#2e2e40",
                  flex: 1,
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input type="radio" name="On" />
            <label style={{ marginLeft: "5px" }}>MU</label>
            <input
              type="range"
              style={{
                marginLeft: "10px",
                color: "white",
                backgroundColor: "#2e2e40",
                flex: 1,
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <input type="radio" name="On" />
            <label style={{ marginLeft: "5px" }}>Comm</label>
          </div>

          <div
            style={{
              border: "0.5px solid white",
              padding: "10px",
              margin: "10px 0",
            }}
          >
            <p style={{ margin: "0 0 10px 0", backgroundColor: "#202020" }}>
              Commission
            </p>
            <div className="d-flex align-items-center gap-2">
              <input
                type="number"
                style={{ backgroundColor: "#2e2e40" }}
                defaultValue="0"
                className="w-25 h-25 text-center text-white"
              />
              <div className="d-flex justify-content-start gap-2">
                <label>%On</label>
                <input type="radio" name="com" />
                <label>Cost</label>
                <input type="radio" name="com" />
                <label>Sale</label>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-primary btn-custom-size">
              Calculate
            </button>
            <button
              className="btn btn-dark btn-custom-size"
              onClick={handleClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PaxSlab;
