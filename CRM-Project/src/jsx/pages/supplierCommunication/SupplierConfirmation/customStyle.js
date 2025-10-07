// export const customStyles = {
//   control: (provided, state) => ({
//     ...provided,
//     backgroundColor: "#2c2b3f",
//     borderColor: "#2c2b3f",
//     boxShadow: "none",
//     color: "#fff",
//     minHeight: "32px",
//     height: "20px",
//     fontSize: "12px",
//     width: "180px",
//     "&:hover": {
//       borderColor: "#2c2b3f",
//     },
//   }),
//   menu: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#2c2b3f"
//       : state.isFocused
//       ? "#2c2b3f"
//       : "#2c2b3f",
//     color: "#fff",
//     zIndex: 9999,
//     width: "180px",
//     // Custom scrollbar styles
//     scrollbarWidth: "thin",
//     scrollbarColor: "#fff #3b3a50",
//     "&::-webkit-scrollbar": {
//       width: "8px",
//     },
//     "&::-webkit-scrollbar-track": {
//       background: "#3b3a50",
//     },
//     "&::-webkit-scrollbar-thumb": {
//       backgroundColor: "#fff",
//       borderRadius: "4px",
//     },
//   }),
//   option: (provided, state) => ({
//     ...provided,
//     backgroundColor: state.isSelected
//       ? "#007bff"
//       : state.isFocused
//       ? "#3b3a50"
//       : "transparent",
//     color: "#fff",
//     cursor: "pointer",
//     fontSize: "10px",
//   }),
//   placeholder: (provided) => ({
//     ...provided,
//     color: "#ccc",
//   }),
//   singleValue: (provided) => ({
//     ...provided,
//     color: "#fff",
//   }),
//   indicatorsContainer: (provided) => ({
//     ...provided,
//     color: "#fff",
//   }),
//   input: (provided) => ({
//     ...provided,
//     color: "#fff",
//     caretColor: "#fff",
//   }),
// };

import { initial } from "lodash";

export const customStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#2e2e40",
    color: "white",
    border: "1px solid #2e2e40", // light gray border
    boxShadow: "none",
    borderRadius: "0.5rem",
    width: "100%",
    height: "32px",
    minHeight: "32px",
    fontSize: "0.8rem",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#2e2e40",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "white",
    fontSize: "0.8rem",
  }),

  input: (base) => ({
    ...base,
    color: "white",
    fontSize: "0.8rem",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#aaa",
    fontSize: "0.8rem",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#ccc",
    padding: "0 4px",
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#ccc",
    padding: "0 4px",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#2e2e40",
    zIndex: 9999,
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#444" : "#2e2e40",
    color: "white",
    fontSize: "0.8rem",
    padding: "6px 10px",
    cursor: "pointer",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "32px",
  }),
};

export const customStylesForInvoice = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#2e2e40",
    color: "white",
    border: "1px solid #2e2e40", // light gray border
    boxShadow: "none",
    borderRadius: "0.5rem",
    width: "100%",
    height: "26px",
    minHeight: "26px",
    fontSize: "0.8rem",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
    "&:hover": {
      borderColor: "#2e2e40",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: "white",
    fontSize: "0.8rem",
  }),

  input: (base) => ({
    ...base,
    color: "white",
    fontSize: "0.8rem",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#aaa",
    fontSize: "0.8rem",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#ccc",
    padding: "0 4px",
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#ccc",
    padding: "0 4px",
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#2e2e40",
    zIndex: 9999,
    borderRadius: "0.5rem",
    overflow: "hidden",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#444" : "#2e2e40",
    color: "white",
    fontSize: "0.8rem",
    padding: "6px 10px",
    cursor: "pointer",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "26px",
  }),
};

export const customStylesForhotel = (background) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    color: background?.value === "dark" ? "white" : "#000",
    border: background?.value === "dark" ? "none" : "1px solid #000",
    boxShadow: "none",
    width: "100%",
    height: "18px",
    minHeight: "18px",
    fontSize: "10px",
    padding: "0 1px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    cursor: "pointer",
    "&:hover": {
      border: background?.value === "dark" ? "none" : "1px solid #aaa",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "10px",
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 0px",
    display: "flex",
    alignItems: "center",
  }),

  input: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "10px",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#fff",
    fontSize: "10px",
    padding: "0px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: 0,
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: 0,
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    zIndex: 9999,
    overflow: "visible",
    width: "auto",
    minWidth: "100%",
    border: "1px solid",
    boxShadow: "none",
    marginTop: "1px", // Adjust this value (e.g., -20px, -15px) to move it upward
    marginLeft: "-4px", // Adjust this value (e.g., -20px, -15px) to move it upward
    position: "absolute", // Ensure it stays positioned relative to control
    top: "0px",
    borderRadius: "8px",
    borderColor: background?.value === "dark" ? "#3d3d3d" : "#ccc7c7",
  }),

  option: (base, state) => ({
    ...base,

    fontSize: "10px",
    padding: "3px 6px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "visible",
    width: "max-content",
    minWidth: "100%",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "18px",
    padding: 0,
  }),
});

// upper vale me position use ho rhi hai niche vale me normal hai
export const customStylesForAuto = (background) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    color: background?.value === "dark" ? "white" : "#000",
    border: background?.value === "dark" ? "none" : "1px solid #ccc",
    boxShadow: "none",
    width: "100%",
    height: "18px",
    minHeight: "18px",
    fontSize: "10px",
    padding: "0 1px",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    cursor: "pointer",
    "&:hover": {
      border: background?.value === "dark" ? "none" : "1px solid #aaa",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "10px",
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "2px 0px",
    display: "flex",
    alignItems: "center",
  }),

  input: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "10px",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#aaa" : "#999",
    fontSize: "10px",
    padding: "0px 0px",
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: 0,
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: 0,
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    zIndex: 9999,
    overflow: "visible",
    width: "auto",
    minWidth: "100%",
    border: "none",
    boxShadow: "none",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor:
      background?.value === "dark"
        ? state.isFocused
          ? "#444"
          : "#2e2e40"
        : state.isFocused || state.isSelected
        ? "#d3d3d3"
        : "#fff",
    color:
      background?.value === "dark"
        ? "white"
        : state.isFocused || state.isSelected
        ? "#000"
        : "#000",
    fontSize: "10px",
    padding: "2px",
    cursor: "pointer",
    whiteSpace: "nowrap",
    overflow: "visible",
    width: "max-content",
    minWidth: "100%",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "18px",
    padding: 0,
  }),
});

export const customStylesForAutoVoucher = {
  control: (base) => ({
    ...base,
    backgroundColor: "#fff",
    color: "#000",
    border: "none !important", // ❌ border hatao
    boxShadow: "none !important", // ❌ shadow hatao
    outline: "none !important", // ❌ outline hatao
    borderRadius: "0px", // flat look
    width: "100%",
    minHeight: "18px",
    height: "18px",
    fontSize: "12px",
    padding: "0 2px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "pointer",
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0 2px",
    display: "flex",
    alignItems: "center",
    height: "100%",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#000",
    fontSize: "12px",
    margin: 0,
  }),

  input: (base) => ({
    ...base,
    color: "#000",
    fontSize: "12px",
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: "#777",
    fontSize: "11px",
    margin: 0,
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: "#333",
    padding: "0 2px",
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  clearIndicator: (base) => ({
    ...base,
    color: "#333",
    padding: "0 2px",
    svg: {
      width: "10px",
      height: "10px",
    },
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "100%",
    padding: 0,
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#fff",
    zIndex: 9999,
    borderRadius: "4px",
    marginTop: "2px",
    boxShadow: "none", // ❌ dropdown ka shadow bhi hatao
    border: "1px solid #ddd", // optional halka border
    minWidth: "100%",
    width: "max-content",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#eee" : "#fff",
    color: "#000",
    fontSize: "12px",
    padding: "4px 8px",
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),
};
