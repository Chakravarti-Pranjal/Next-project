import React, { useState, useEffect, useContext, useReducer } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { axiosOther } from "../../../../../http/axios_base_url";
import { addQueryContext } from "..";
import "../../../../../css/style.css";
import Counter from "../counter";
import { useSelector } from "react-redux";

const PaxDetail = ({ queryType }) => {
  const context = useContext(addQueryContext);
  const { queryObjects } = useContext(addQueryContext);
  const { dropdownState } = context?.dropdownObject;
  const { formValue, setFormValue } = queryObjects;
  const [pereferenceList, setPereferenceList] = useState([]);
  // console.log("formValue123", formValue);

  const initialState = {
    counter1: 0,
    counter2: 0,
    counter3: 0,
  };

  const perefernce = useSelector(
    (state) => state?.MessageReducer?.perefernceValue
  );
  const getPerefernceApi = async () => {
    try {
      const { data } = await axiosOther.post("querypreflist", {
        CompanyId: JSON.parse(localStorage.getItem("token"))?.companyKey,
        UserId: JSON.parse(localStorage.getItem("token"))?.UserID,
      });
      setPereferenceList(data?.DataList?.[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getPerefernceApi();
  }, [perefernce]);
  useEffect(() => {
    if (pereferenceList?.Preferences) {
      console.log("calllss");

      setFormValue({
        ...formValue,
        PaxInfo: {
          ...formValue?.PaxInfo,
          PaxType: pereferenceList?.Preferences?.PaxTypeId,
        },
      });
    }
  }, [pereferenceList?.Preferences]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name in formValue) {
      setFormValue((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else {
      const keys = name.split(".");
      const newFormData = { ...formValue };
      let current = newFormData;

      keys.forEach((key, index) => {
        if (index === keys.length - 1) {
          current[key] = value;
        } else {
          current = current[key];
        }
      });
      setFormValue(newFormData);
    }
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        return { ...state, [action.counter]: state[action.counter] + 1 };
      case "DECREMENT":
        return {
          ...state,
          [action.counter]: Math.max(0, state[action.counter] - 1),
        };
      case "SET":
        return {
          ...state,
          [action.counter]: (state[action.counter] = action.value),
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [isCounterChanged, setIsCounterChanged] = useState(false);
  useEffect(() => {
    if (!isCounterChanged) return;

    console.log(state, "state11");

    const { counter1, counter2, counter3 } = state;

    setFormValue({
      ...formValue,
      PaxInfo: {
        ...formValue?.PaxInfo,
        Adult: counter1,
        Child: counter2,
        Infant: counter3,
        TotalPax: counter1 + counter2 + counter3,
      },
    });

    if (counter1 + counter2 >= 9) {
      setFormValue({
        ...formValue,
        PaxInfo: { ...formValue?.PaxInfo, PaxType: "2" },
      });
    }
    if (counter1 + counter2 < 9) {
      setFormValue({
        ...formValue,
        PaxInfo: { ...formValue?.PaxInfo, PaxType: "1" },
      });
    }
  }, [state]);
  const handleInputChange = (counter, counterValue) => {
    console.log(counter, counterValue, "12345");
    setIsCounterChanged(true);
    let sum = 0;
    sum += counterValue;
    switch (counter) {
      case "counter1":
        setFormValue({
          ...formValue,
          PaxInfo: {
            ...formValue?.PaxInfo,
            Adult: counterValue,
            TotalPax: sum,
          },
        });

        break;
      case "counter2":
        setFormValue({
          ...formValue,
          PaxInfo: {
            ...formValue?.PaxInfo,
            Child: counterValue,
            TotalPax: sum,
          },
        });

        break;
      case "counter3":
        setFormValue({
          ...formValue,
          PaxInfo: {
            ...formValue?.PaxInfo,
            Infant: counterValue,
            TotalPax: sum,
          },
        });

        break;
      default:
        console.log("try agein");
    }
  };

  // console.log(formValue , "132")

  // const handleInputChange = (e, roomId) => {
  //     const updatedRoomData = RoomInfo.map((room) => {
  //         if (room.id === roomId) {
  //             return { ...room, NoOfPax: e.target.value };
  //         }
  //         return room;
  //     });
  //     setRoomInfo(updatedRoomData);
  // };

  // const totalRoom = RoomInfo?.map((room) =>
  //     parseInt(room?.NoOfPax == "" || room?.NoOfPax == null ? 0 : parseInt(room?.NoOfPax))
  // );

  // const totalRoomCount = totalRoom?.reduce((acc, curr) => acc + curr, 0);

  // get list for dropdown
  const heightAutoAdjust = queryType;

  return (
    <div className="row">
      <div className="col-lg-12">
        <div
          className="card query-box-height-main mb-0"
          style={{ minHeight: !heightAutoAdjust.includes(1) && "23.2rem" }}
        >
          <div className="card-header px-2 py-2 d-flex justify-content-between align-items-center gap-2">
            <h4 className="card-title query-title">Pax Detail</h4>
            <div className="d-flex justify-content-center align-items-center gap-2">
              {/* <label className="m-0" style={{ fontSize: "10px" }}>
                Pax Type
              </label>

              <select
                id="status"
                className="form-control form-control-sm form-query"
                name="PaxInfo.PaxType"
                value={formValue?.PaxInfo?.PaxType}
                onChange={handleChange}
                style={{ width: "4rem" }}
              >
                {dropdownState?.paxList &&
                  dropdownState?.paxList?.length > 0 &&
                  dropdownState?.paxList.map((data, index) => (
                    <option value={data?.id} key={index}>
                      {data?.Paxtype}
                    </option>
                  ))}
              </select> */}
              {dropdownState?.paxList?.map((pax, index) => {
                return (
                  <div className="form-check p-0" key={index}>
                    <input
                      className="form-check-input ms-1"
                      name="PaxInfo.PaxType"
                      type="radio"
                      value={pax?.id}
                      checked={formValue?.PaxInfo?.PaxType == pax?.id}
                      id={pax?.Paxtype}
                      onChange={handleChange}
                      style={{ height: "1rem", width: "1rem" }}
                    />
                    <label className="form-check-label" htmlFor={pax?.Paxtype}>
                      {pax?.Paxtype}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card-body px-2 py-3">
            <div className="row col-gap-1">
              <div className="col-6 col-xl-4 mt-1">
                <div className="d-flex justify-content-between gap-1">
                  <label className="" htmlFor="status">
                    Adult
                    <i className="fa-solid fa-person ps-2"></i>
                  </label>
                </div>

                <Counter
                  value={
                    state.counter1 == 0
                      ? formValue?.PaxInfo?.Adult
                      : state?.counter1
                  }
                  onClick={(counter, value) =>
                    handleInputChange(counter, value)
                  }
                  dispatch={dispatch}
                  counter="counter1"
                />
              </div>
              <div className="col-6 col-xl-4 mt-1">
                <div className="d-flex justify-content-between">
                  <label className="" htmlFor="status">
                    Child
                    <i className="fa-solid fa-child-reaching ps-2"></i>
                  </label>
                </div>

                <Counter
                  value={
                    state.counter2 == 0
                      ? formValue?.PaxInfo?.Child
                      : state?.counter2
                  }
                  onClick={(counter, value) =>
                    handleInputChange(counter, value)
                  }
                  dispatch={dispatch}
                  counter="counter2"
                />
              </div>
              <div className="col-6 col-xl-4 mt-1">
                <div className="d-flex justify-content-between">
                  <label className="" htmlFor="status">
                    Infant
                    <i className="fa-solid fa-person-breastfeeding ps-2"></i>
                  </label>
                </div>
                <Counter
                  value={
                    state.counter3 == 0
                      ? formValue?.PaxInfo?.Infant
                      : state?.counter3
                  }
                  dispatch={dispatch}
                  onClick={(counter, value) =>
                    handleInputChange(counter, value)
                  }
                  counter="counter3"
                />
              </div>
              <div className="col-md-6 col-lg-6 mt-1">
                <div
                  className=" 
                      d-flex justify-content-start align-items-center font-weight-bold"
                  style={{ height: "25px" }}
                >
                  Total Pax :{" "}
                  {state?.counter1 + state?.counter2 + state?.counter3 == 0
                    ? formValue?.PaxInfo?.TotalPax
                    : state?.counter1 + state?.counter2 + state?.counter3}
                </div>
              </div>
              {formValue?.PaxInfo?.Adult > 0 && (
                <div>
                  {/* <p className="text-danger fs-6">
                    *Select {formValue?.PaxInfo?.TotalPax} Single Rooms or{" "}
                    {Math.ceil(formValue?.PaxInfo?.TotalPax / 2)} Double Rooms
                  </p> */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(PaxDetail);
