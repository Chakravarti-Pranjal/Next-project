import React, { useEffect, useContext, useReducer, useState } from "react";
import { addQueryContext } from "..";
import "../../../../../css/style.css";
import AccomodationCounter from "../accomodationCounter";
import { useSelector } from "react-redux";
import axios from "axios";
import { axiosOther } from "../../../../../http/axios_base_url";

const Accomodation = () => {
  const { roomObject, dropdownObject, queryObjects } =
    useContext(addQueryContext);

  const { RoomInfo, setRoomInfo } = roomObject;
  const { dropdownState } = dropdownObject;
  const { formValue, setFormValue } = queryObjects;
  const [pereferenceList, setPereferenceList] = useState([]);
  const [defaultMeal, setDefaultMeal] = useState("3");
  const [mealPlanList, setMealPlanList] = useState([]);
  // console.log(RoomInfo, "RoomInfo");
  // console.log(queryObjects, "queryObjects");

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
      // console.log(data?.DataList?.[0], "data?.DataList?.[0]");
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(pereferenceList, "dropdownStateksdk541");

  useEffect(() => {
    getPerefernceApi();
  }, [perefernce]);
  const mealplan = async () => {
    try {
      const { data } = await axiosOther.post("hotelmealplanlist", {
        Search: "",
        Status: "",
      });
      setMealPlanList(data?.DataList);
      // console.log(data?.DataList, "data?.DataList");
    } catch (error) {
      console.log(error);
    }
    //  try {
    //   const { data } = await axiosOther.post("querymasterlist",{

    //   });
    //   setMealPlanList(data?.DataList);
    //   console.log(data?.DataList,"data?.DataList");

    // } catch (error) {
    //   console.log(error);
    // }
  };
  useEffect(() => {
    mealplan();
  }, []);

  // -------------------------------

  useEffect(() => {
    if (pereferenceList?.Preferences) {
      console.log(pereferenceList?.Preferences, "pereferenceList?.Preferences");

      // console.log(pereferenceList, "pereferenceList?.Preferences");

      setFormValue({
        ...formValue,
        // mealplan:pereferenceList,
        Hotel: {
          ...formValue?.Hotel,
          HotelCategory: pereferenceList?.Preferences?.HotelCategoryId,
        },
      });
      console.log(
        pereferenceList?.Preferences?.HotelCategoryId,
        "checkhotelformvalue"
      );
    }
  }, [
    pereferenceList?.Preferences,
    pereferenceList?.Preferences?.HotelCategoryId,
  ]);
  console.log(formValue, "checkformvalueeee");

  // HotelCategoryId
  const initialState = {};

  {
    dropdownState?.roomList?.length > 0 &&
      dropdownState.roomList.map(
        (key, index) => initialState[`counter${index + 1}`]
      );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    // console.log(name, value, "name, value");

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

  useEffect(() => {
    const initialRoomData = dropdownState?.roomList?.map((room) => {
      const existingRoom = RoomInfo?.find((r) => r?.id === room?.id);
      // console.log(existingRoom, "existingRoom");

      // return existingRoom ? existingRoom : { id: room?.id, NoOfPax: "" };
      return {
        id: room?.id,
        NoOfPax:
          room?.id === 4
            ? existingRoom?.NoOfPax || "1"
            : existingRoom?.NoOfPax || "",
      };
    });
    // console.log(initialRoomData, "initialRoomData");

    setRoomInfo(initialRoomData);
  }, [dropdownState]);

  useEffect(() => {
    if (defaultMeal) {
      // updating Meal type
      setFormValue((prev) => ({
        ...prev,
        MealPlan: defaultMeal,
      }));
    }
  }, []);

  const handleInputChange = (counter, counterValue, roomId) => {
    // console.log(counter, counterValue, roomId, "12345");
    const updatedRoomData = RoomInfo.map((room) => {
      // console.log(room, "room");

      if (room.id === roomId) {
        return { ...room, NoOfPax: counterValue };
      }

      return room;
    });
    setRoomInfo(updatedRoomData);
  };

  const totalRoom = RoomInfo?.map((room) =>
    parseInt(
      room?.NoOfPax == "" || room?.NoOfPax == null ? 0 : parseInt(room?.NoOfPax)
    )
  );
  // console.log(totalRoom, "totalRoom");

  const totalRoomCount = totalRoom?.reduce((acc, curr) => acc + curr, 0);

  const reducer = (state, action) => {
    switch (action.type) {
      case "INCREMENT":
        // console.log(state, action.type, "action.counter");

        return { ...state, [action.counter]: (state[action.counter] || 0) + 1 };
      case "DECREMENT":
        return {
          ...state,
          [action.counter]: Math.max(0, (state[action.counter] || 0) - 1),
        };
      case "SET":
        return {
          ...state,
          [action.counter]: parseInt(action.value) || 0,
        };
      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  // console.log(dispatch,"dispatch");

  // Edit mode value -> defaultMeal
  // useEffect(() => {
  //   if (formValue?.MealPlan) {
  //     setDefaultMeal(formValue.MealPlan.toString());
  //   }
  // }, [formValue?.MealPlan]);

  // defaultMeal -> formValue (auto submit support)
  // useEffect(() => {
  //   if (defaultMeal && formValue?.MealPlan !== defaultMeal) {
  //     setFormValue((prev) => ({
  //       ...prev,
  //       MealPlan: defaultMeal,
  //     }));
  //   }
  // }, [defaultMeal]);

  // console.log(dropdownState, "dropdownState");
  console.log(
    formValue?.Hotel?.HotelCategory,
    "formValue?.Hotel?.HotelCategory"
  );

  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="card query-box-height-main">
          <div className="card-header px-2 py-2">
            <h4 className="card-title query-title">Accomodation</h4>
          </div>
          <div className="card-body px-2 py-2">
            <div className="row m-0">
              {/* <div className="row"> */}
              <div className="d-flex gap-2 justify-content-between  align-items-center">
                <div className="font-size10 text-nowrap">Hotel Category</div>
                {/* <div className="d-flex">
                  <div className="d-flex gap-0 m-0 p-0">
                    <div className="form-check d-flex gap-4 align-items-center text-nowrap my-0 py-0" >
                      <label className="form-check-label p-1" htmlFor="all">
                        All<span className="fs-6">*</span>
                      </label>
                      <input
                        className="form-check-input"
                        name="Hotel.HotelCategory"
                        type="radio"
                        value="0"
                        id="all"
                        onChange={handleChange}
                        style={{ height: "1rem", width: "1rem" }}
                      />
                    </div>

                    {dropdownState?.hotelCategory?.map((item) => (
                      <div
                        key={item?.id}
                        className="form-check d-flex gap-4 align-items-center text-nowrap"
                      >
                        <label
                          className="form-check-label p-1"
                          htmlFor={`${item?.id}-star`}
                        >
                          {item?.Name} <span className="fs-6">*</span>
                        </label>
                        <input
                          className="form-check-input"
                          name="Hotel.HotelCategory"
                          type="radio"
                          value={item?.id}
                          id={`${item?.id}-star`}
                          onChange={handleChange}
                          defaultChecked={
                            formValue?.Hotel?.HotelCategory?.toString() ===
                            item?.id?.toString()
                          }
                          style={{ height: "1rem", width: "1rem" }}
                        />
                      </div>
                    ))}
                  </div>
                </div> */}
                {/* {console.log(
                  formValue?.Hotel?.HotelCategory,
                  "formValue?.Hotel?.HotelCategoryy"
                )} */}
                <div className="d-flex flex-wrap align-items-center">
                  <div className="d-flex flex-wrap align-items-center m-0 p-0 gap-2">
                    <div className="form-check d-flex align-items-center m-0 p-0">
                      <input
                        className="form-check-input m-0"
                        name="Hotel.HotelCategory"
                        type="radio"
                        value="0"
                        defaultChecked={
                          formValue?.Hotel?.HotelCategory?.toString() == "0"
                        }
                        id="all"
                        onChange={handleChange}
                        style={{ height: "1rem", width: "1rem" }}
                      />
                      <label
                        className="form-check-label m-0 p-0 ms-1"
                        htmlFor="all"
                        style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                      >
                        All<span className="fs-6">*</span>
                      </label>
                    </div>

                    {dropdownState?.hotelCategory?.map((item) => (
                      <div
                        key={item?.id}
                        className="form-check d-flex align-items-center m-0 p-0 ms-2"
                      >
                        <input
                          className="form-check-input m-0"
                          name="Hotel.HotelCategory"
                          type="radio"
                          value={item?.id}
                          id={`${item?.id}-star`}
                          onChange={handleChange}
                          checked={
                            formValue?.Hotel?.HotelCategory?.toString() ===
                            item?.id?.toString()
                          }
                          style={{ height: "1rem", width: "1rem" }}
                        />

                        <label
                          className="form-check-label m-0 p-0 ms-1"
                          htmlFor={`${item?.id}-star`}
                          style={{ fontSize: "0.9rem", whiteSpace: "nowrap" }}
                        >
                          {item?.Name}
                          <span className="fs-6">*</span>
                        </label>
                      </div>
                    ))}
                    {console.log(
                      // dropdownState,
                      formValue?.Hotel?.HotelCategory,
                      "checkdropdownstates"
                    )}
                  </div>
                </div>
                <select
                  name="MealPlan"
                  id=""
                  className="form-control form-control-sm"
                  onChange={(e) => {
                    handleChange(e);
                    setDefaultMeal(e.target.value); // update mealsPlane without effecting other field rendering
                  }}
                  value={formValue?.MealPlan}
                  style={{
                    width: "23%",
                    fontSize: "0.7rem",
                    textAlign: "center",
                  }}
                >
                  <option value="">Select Meals</option>
                  {mealPlanList?.map((value) => {
                    return (
                      <option value={value?.id} key={value?.id}>
                        {value?.Name}
                      </option>
                    );
                  })}
                </select>
              </div>

              {dropdownState?.roomList &&
                dropdownState?.roomList.map((room, ind) => {
                  // console.log(dropdownState, "dropdownState");

                  return (
                    <div key={ind} className="col-md-6 col-xs-12 col-lg-4 mt-2">
                      <label
                        className=""
                        htmlFor="name"
                        style={{ fontSize: "10px" }}
                      >
                        {room?.Name}
                      </label>
                      {/* {console.log(room, ind, "roomind")} */}

                      <AccomodationCounter
                        roomId={room?.id}
                        value={
                          parseInt(
                            state[`counter${ind + 1}`] === 0
                              ? RoomInfo.find((r) => r.id === room.id)
                                  ?.NoOfPax || 0
                              : state[`counter${ind + 1}`]
                          ) || 0
                        }
                        onClick={(counter, counterValue) =>
                          handleInputChange(counter, counterValue, room?.id)
                        }
                        dispatch={dispatch}
                        counter={`counter${ind + 1}`}
                      />
                      {/* {console.log(
                        state[`counter${ind + 1}`],
                        "state[`counter${ind + 1}`]"
                      )}
                      {console.log(room?.id, "room?.id")}
                      {console.log(
                        RoomInfo?.find((r) => r.id === room.id)?.NoOfPax,
                        state[`counter${ind + 1}`],
                        "room?.id222"
                      )} */}
                    </div>
                  );
                })}
              {dropdownState?.roomList.length > 0 && (
                <div className="col-6 col-md-4 col-lg-12 d-flex justify-content-end align-items-center">
                  <p className="font-weight-bold m-0 font-size-10 text-center">
                    Total Rooms : {totalRoomCount}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Accomodation);
