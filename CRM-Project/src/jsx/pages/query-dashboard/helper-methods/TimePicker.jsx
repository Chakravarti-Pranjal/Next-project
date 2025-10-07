import React, { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const DarkCustomTimePicker = ({ value, onChange, name }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [ampm, setAmpm] = useState("AM");
  const pickerRef = useRef(null);

  // Sync with parent value
  useEffect(() => {
    if (value) {
      let h = 0,
        m = 0,
        ap = "AM";

      if (value.includes("AM") || value.includes("PM")) {
        const [hm, apVal] = value.split(" ");
        const [hStr, mStr] = hm.split(":");
        h = parseInt(hStr, 10) || 0;
        m = parseInt(mStr, 10) || 0;
        ap = apVal.toUpperCase();
      } else {
        const [hStr, mStr] = value.split(":");
        h = parseInt(hStr, 10) || 0;
        m = parseInt(mStr, 10) || 0;
        ap = h >= 12 ? "PM" : "AM";
        if (h > 12) h -= 12;
        if (h === 0) h = 12;
      }

      setHours(h);
      setMinutes(m);
      setAmpm(ap);
    }
  }, [value]);

  // Close popup on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(e.target) &&
        !document.getElementById("time-popup")?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = () =>
    `${hours.toString().padStart(2, "0")} : ${minutes
      .toString()
      .padStart(2, "0")} ${ampm}`;

  const updateParent = (h, m, ap) => {
    onChange({
      target: {
        name,
        value: `${h.toString().padStart(2, "0")}:${m
          .toString()
          .padStart(2, "0")} ${ap}`,
      },
    });
  };

  const incHours = () => {
    let newHours = hours >= 12 ? 1 : hours + 1;
    setHours(newHours);
    updateParent(newHours, minutes, ampm);
  };

  const decHours = () => {
    let newHours = hours <= 1 ? 12 : hours - 1;
    setHours(newHours);
    updateParent(newHours, minutes, ampm);
  };

  const incMinutes = () => {
    const newMinutes = (minutes + 1) % 60;
    setMinutes(newMinutes);
    updateParent(hours, newMinutes, ampm);
  };

  const decMinutes = () => {
    const newMinutes = (minutes - 1 + 60) % 60;
    setMinutes(newMinutes);
    updateParent(hours, newMinutes, ampm);
  };

  const toggleAmPm = () => {
    const newAmPm = ampm === "AM" ? "PM" : "AM";
    setAmpm(newAmPm);
    updateParent(hours, minutes, newAmPm);
  };

  // ---- Positioning for Portal ----
  const getPopupStyle = () => {
    if (!pickerRef.current) return {};
    const rect = pickerRef.current.getBoundingClientRect();
    return {
      position: "absolute",
      top: rect.bottom + window.scrollY + 4,
      left: rect.left + window.scrollX,
      background: "#fff",
      border: "1px solid #888",
      borderRadius: "8px",
      padding: "4px",
      zIndex: 9999,
      boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
      minWidth: "120px",
      textAlign: "center",
    };
  };

  return (
    <>
      <div style={{ position: "relative", display: "inline-block" }} ref={pickerRef}>
        {/* Time Input */}
        <input
          value={formatTime()}
          onClick={() => setIsOpen(!isOpen)}
          readOnly
          style={{ cursor: "pointer" }}
          className="formControl1"
        />
      </div>

      {/* Popup via Portal */}
      {isOpen &&
        ReactDOM.createPortal(
          <div id="time-popup" style={getPopupStyle()}>
            <div
              style={{ display: "flex", gap: "10px", justifyContent: "center" }}
            >
              {/* Hours */}
              <div>
                <div style={styles.arrow} onClick={incHours}>
                  ▲
                </div>
                <input
                  type="number"
                  value={hours}
                  min={1}
                  max={12}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 1;
                    if (val < 1) val = 1;
                    if (val > 12) val = 12;
                    setHours(val);
                    updateParent(val, minutes, ampm);
                  }}
                  style={styles.input}
                />
                <div style={styles.arrow} onClick={decHours}>
                  ▼
                </div>
              </div>

              <div style={{ color: "#aaa" }}>:</div>

              {/* Minutes */}
              <div>
                <div style={styles.arrow} onClick={incMinutes}>
                  ▲
                </div>
                <input
                  type="number"
                  value={minutes}
                  min={0}
                  max={59}
                  onChange={(e) => {
                    let val = parseInt(e.target.value) || 0;
                    if (val < 0) val = 0;
                    if (val > 59) val = 59;
                    setMinutes(val);
                    updateParent(hours, val, ampm);
                  }}
                  style={styles.input}
                />
                <div style={styles.arrow} onClick={decMinutes}>
                  ▼
                </div>
              </div>

              {/* AM/PM */}
              <div>
                <div style={styles.arrow} onClick={toggleAmPm}>
                  ▲
                </div>
                {/* <div style={styles.timeValue}>{ampm}</div> */}
                <div style={styles.timeValue} tabIndex={0} role="button" aria-label="AM or PM" onFocus={(e) => {
                  const range = document.createRange(); range.selectNodeContents(e.target); const selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range);
                }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") toggleAmPm(); else if (e.key === "ArrowUp" || e.key === "ArrowDown") { toggleAmPm(); } else if (e.key === "Tab") { setIsOpen(false); } }} > {ampm} </div>
                <div style={styles.arrow} onClick={toggleAmPm}>
                  ▼
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

const styles = {
  arrow: {
    cursor: "pointer",
    fontSize: "14px",
    lineHeight: "14px",
    userSelect: "none",
    color: "#888",
    padding: "2px",
    borderRadius: "4px",
  },
  input: {
    width: "30px",
    height: "20px",
    textAlign: "center",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#000",
    background: "transparent",
    border: "none",
    outline: "none",
    margin: "2px 0",
  },
  timeValue: {
    color: "#000",
    fontSize: "14px",
    fontWeight: "bold",
  },
};

export default DarkCustomTimePicker;
