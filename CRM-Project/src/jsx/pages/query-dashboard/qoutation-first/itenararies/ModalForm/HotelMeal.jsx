import React from "react";

const HotelMeal = () => {
  return (
    <div className="row">
      <div className="col-4 form-check">
        <input
          class="form-check-input"
          type="checkbox"
          value=""
          id="breakfast"
        />
        <label class="form-check-label" for="breakfast">
          BREAKFAST
        </label>
      </div>
      <div className="col-4 form-check">
        <input class="form-check-input" type="checkbox" value="" id="lunch" />
        <label class="form-check-label" for="lunch">
          LUNCH
        </label>
      </div>
      <div className="col-4 form-check">
        <input class="form-check-input" type="checkbox" value="" id="dinner" />
        <label class="form-check-label" for="dinner">
          DINNER
        </label>
      </div>
    </div>
  );
};

export default HotelMeal;
