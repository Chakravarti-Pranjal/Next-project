import React from "react";

const Hotel = ({ handleNext }) => {
  return (
    <div>
      <div className="d-flex mb-2 justify-content-end gap-2">
        <button className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0">
          <i className="fa-solid fa-floppy-disk fs-4 me-1" />
          Save
        </button>
        <button
          className="btn btn-primary btn-custom-size d-flex flex-shrink-0 flex-grow-0"
          onClick={() => handleNext("hotel")}
        >
          Next
          <i
            className="fa-solid fa-backward text-red bg-white p-1 rounded ms-1"
            style={{ transform: "rotate(180deg)" }}
          ></i>
        </button>
      </div>
      <table className="table table-bordered itinerary-table">
        <thead>
          <tr>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Days
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Sector
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Hotel
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Room type
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Meal Type
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Breakfast
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Lunch
            </th>
            <th rowSpan={2} style={{ verticalAlign: "middle" }}>
              Dinner
            </th>
            <th colSpan="2">FIT</th>
            <th colSpan="2">GIT</th>
          </tr>
          <tr>
            <th style={{ verticalAlign: "middle" }}>SGL</th>
            <th style={{ verticalAlign: "middle" }}>DBL</th>
            <th style={{ verticalAlign: "middle" }}>SGL</th>
            <th style={{ verticalAlign: "middle" }}>DBL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>21-Dec-25</td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Arrival Delhi">Arrival Delhi</option>
                <option value="Delhi">Delhi</option>
                <option value="Delhi - Agra">Delhi - Agra</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Le Meridien">Le Meridien</option>
                <option value="Hilton">Hilton</option>
                <option value="Taj Hotel">Taj Hotel</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Executive Room">Executive Room</option>
                <option value="Superior Room">Superior Room</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="EP">EP</option>
                <option value="CP">CP</option>
                <option value="MAP">MAP</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Regular Lunch">Regular Lunch</option>
                <option value="Gala Dinner">Gala Dinner</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Regular Lunch">Regular Lunch</option>
                <option value="Gala Dinner">Gala Dinner</option>
              </select>
            </td>
            <td>
              <select className="formControl1">
                <option value="">Select</option>
                <option value="Regular Lunch">Regular Lunch</option>
                <option value="Gala Dinner">Gala Dinner</option>
              </select>
            </td>
            <td>
              <input type="number" className="formControl1 width50px" />
            </td>
            <td>
              <input type="number" className="formControl1 width50px" />
            </td>
            <td>
              <input type="number" className="formControl1 width50px" />
            </td>
            <td>
              <input type="number" className="formControl1 width50px" />
            </td>
          </tr>
          <tr>
            <td>21-Dec-25</td>
            <td>Arrival Delhi</td>
            <td>Le Meridien</td>
            <td>Executive Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>12345.00</td>
            <td>Mail</td>
            <td></td>
          </tr>
          <tr>
            <td>22-Dec-25</td>
            <td>Delhi</td>
            <td>Le Meridien</td>
            <td>Executive Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>10620.00</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>23-Dec-25</td>
            <td>Delhi - Agra</td>
            <td>Taj Hotel and Convention Centre</td>
            <td>Superior Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>34567.00</td>
            <td>15% Hike</td>
            <td></td>
          </tr>
          <tr>
            <td>24-Dec-25</td>
            <td>Agra - Jaipur</td>
            <td>Hilton</td>
            <td>Guest Room</td>
            <td>CP</td>
            <td></td>
            <td>Gala Dinner</td>
            <td>9,000.00</td>
            <td></td>
            <td>3000.00</td>
            <td>Mail</td>
            <td></td>
          </tr>
          <tr>
            <td>25-Dec-25</td>
            <td>Jaipur</td>
            <td>Hilton</td>
            <td>Guest Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>34567.00</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>26-Dec-25</td>
            <td>Jaipur</td>
            <td>Hilton</td>
            <td>Guest Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>34567.00</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>27-Dec-25</td>
            <td>Jaipur - Delhi</td>
            <td>Andaz by Hyatt</td>
            <td>Andaz Room</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>45678.00</td>
            <td></td>
            <td></td>
          </tr>
          <tr>
            <td>28-Dec-25</td>
            <td>Delhi Depart</td>
            <td>Departure</td>
            <td>Departure</td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>0.00</td>
            <td></td>
            <td></td>
          </tr>
          <tr style={{ background: "#2e2e40" }}>
            <td colSpan={4}>TOTAL</td>
            <td></td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>0.00</td>
            <td>2,06,911.00</td>
            <td>0.00</td>
            <td>0.00</td>
          </tr>
        </tbody>
      </table>

      <table className="table table-bordered itinerary-table">
        <thead>
          <tr>
            <th></th>
            <th>Hotel</th>
            <th>Tpt+Guide</th>
            <th>ABF</th>
            <th>Lunch</th>
            <th>Dinner</th>
            <th>Entr+Misc</th>
            <th>FH Charge</th>
            <th>Sub Total</th>
            <th>Mark Up %</th>
            <th>Total</th>
            <th>with ISO</th>
            <th>INR with S Tax</th>
            <th>EURO</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1 Pax (Crysta)</td>
            <td>0.00</td>
            <td>20,790.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>16,737.00</td>
            <td>200.00</td>
            <td>46,727.00</td>
            <td>7,009.05</td>
            <td>53,736.05</td>
            <td>55,397.99</td>
            <td>58,167.89</td>
            <td>639.21</td>
          </tr>
          <tr>
            <td>2 Guests (Crysta)</td>
            <td>1,03,455.50</td>
            <td>10,395.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>16,737.00</td>
            <td>200.00</td>
            <td>1,39,787.50</td>
            <td>20,968.13</td>
            <td>1,60,755.63</td>
            <td>1,65,727.45</td>
            <td>1,74,013.82</td>
            <td>1,912.24</td>
          </tr>
          <tr>
            <td>4 Guests (Twin sharing basis)</td>
            <td>1,03,455.50</td>
            <td>37,248.75</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>16,737.00</td>
            <td>200.00</td>
            <td>1,66,641.25</td>
            <td>24,996.19</td>
            <td>1,91,637.44</td>
            <td>1,97,564.37</td>
            <td>2,07,442.59</td>
            <td>2,279.59</td>
          </tr>
          <tr>
            <td>15 - 19 Pax + 1 Tour Leader FOC</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>16,737.00</td>
            <td>200.00</td>
            <td>25,937.00</td>
            <td>3,890.55</td>
            <td>29,827.55</td>
            <td>30,750.05</td>
            <td>32,287.55</td>
            <td>354.81</td>
          </tr>
          <tr>
            <td>20 - 25 Pax + 1 Tour Leader FOC</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>9,000.00</td>
            <td>16,737.00</td>
            <td>200.00</td>
            <td>25,937.00</td>
            <td>3,890.55</td>
            <td>29,827.55</td>
            <td>30,750.05</td>
            <td>32,287.55</td>
            <td>354.81</td>
          </tr>
          <tr>
            <td>SRS</td>
            <td>-1,03,455.50</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>0.00</td>
            <td>-1,03,455.50</td>
            <td>-15,518.33</td>
            <td>-1,18,973.83</td>
            <td>-1,22,653.43</td>
            <td>-1,28,786.10</td>
            <td>-1,415.23</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Hotel;
