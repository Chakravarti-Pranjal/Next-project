import { useEffect } from "react";

const Counter = ({ value, dispatch, counter, onClick }) => {
  // console.log(counter, value, "counter");

  const handleCounterInputValue = (e) => {
    // implement condition to stop non value and negative
    let value = parseInt(e.target.value);
    if (isNaN(value) || value < 0) return;
    dispatch({ type: "SET", value, counter });
    onClick(counter, value);
  };

  const handleIncrement = () => {
    dispatch({ type: "INCREMENT", counter });
    onClick(counter, value + 1);
  };

  const handleDecrement = () => {
    // implement condition to stop non value and negative
    if (isNaN(value) || value <= 0) return;
    dispatch({ type: "DECREMENT", counter });
    onClick(counter, value - 1);
  };

  useEffect(() => {
    if (!isNaN(value) && value >= 0) {
      dispatch({ type: "SET", value, counter });
    }
  }, [value, counter]);

  return (
    <>
      <div
        className="text-center  text-dark row m-0"
        style={{ height: "25px" }}
      >
        <div
          onClick={handleDecrement}
          className="col-3 bg-red 
                    text-white cursor-pointer
                    d-flex align-items-center justify-content-center px-2 left-radius"
        >
          -
        </div>
        <div className="col-6 d-flex justify-content-center align-items-center px-0 counter-primary-bg">
          <input
            className="w-100 border-0 outline-0 counter-input text-center"
            value={value}
            onChange={handleCounterInputValue}
          />
        </div>

        <div
          onClick={handleIncrement}
          className="col-3 bg-red rounded-right
                text-white cursor-pointer h-100
                d-flex align-items-center justify-content-center px-2 left-right"
        >
          +
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center pt-1 mt-1">
        <div
          className={`py-0 border-red p-1 cursor-pointer green-hover padding-x 
          d-flex justify-content-center align-items-center ${
            value == 1 ? "Active text-white bg-danger" : "input-count"
          }`}
          onClick={() =>
            dispatch({ type: "SET", value: 1, counter }, onClick(counter, 1))
          }
          style={{ height: "19px", fontSize: "9px" }}
        >
          1
        </div>
        <div
          className={`py-0 border-red p-1 cursor-pointer green-hover padding-x
           d-flex justify-content-center align-items-center ${
             value == 2 ? "Active text-white bg-danger" : "input-count"
           }`}
          onClick={() => (
            dispatch({ type: "SET", value: 2, counter }), onClick(counter, 2)
          )}
          style={{ height: "19px", fontSize: "9px" }}
        >
          2
        </div>
        <div
          className={`py-0 border-red p-1 cursor-pointer green-hover padding-x 
          d-flex justify-content-center align-items-center ${
            value == 3 ? "Active text-white bg-danger" : "input-count"
          }`}
          onClick={() => (
            dispatch({ type: "SET", value: 3, counter }), onClick(counter, 3)
          )}
          style={{ height: "19px", fontSize: "9px" }}
        >
          3
        </div>
        <div
          className={`py-0 border-red p-1  cursor-pointer green-hover padding-x 
          d-flex justify-content-center align-items-center ${
            value == 4 ? "Active text-white bg-danger" : "input-count"
          }`}
          onClick={() => (
            dispatch({ type: "SET", value: 4, counter }), onClick(counter, 4)
          )}
          style={{ height: "19px", fontSize: "9px" }}
        >
          4
        </div>
        <div
          className={`py-0 border-red p-1 cursor-pointer green-hover padding-x 
          d-flex justify-content-center align-items-center ${
            value == 5 ? "Active text-white bg-danger" : "input-count"
          }`}
          onClick={() => (
            dispatch({ type: "SET", value: 5, counter }), onClick(counter, 5)
          )}
          style={{ height: "19px", fontSize: "9px" }}
        >
          5
        </div>
      </div>
    </>
  );
};
export default Counter;
