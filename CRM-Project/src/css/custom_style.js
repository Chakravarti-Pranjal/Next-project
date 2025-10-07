import zIndex from "@mui/material/styles/zIndex";
import { color } from "highcharts";
import { useContext } from "react";
// import { ThemeContext } from "../context/ThemeContext";
import DataTable from "react-data-table-component";
// const {background}=useContext(ThemeContext);

// console.log(background , "background")

export const table_custom_style = (background) => ({
  rdt_TableCell: {
    className: "center-cell",
    backgroundColor: background?.value == "dark" ? "#202020" : "white",
    border: "none !important",
  },
  rdt_Pagination: {
    color: "white !important",
  },
  rdt_TableHeadRow: {
    className: "min-height-row",
    backgroundColor: background?.value == "dark" ? "#202020" : "white",
    border: background?.value == "dark" && "none !important",
    borderBottom: background?.value == "dark" && "none !important",
  },
  rdt_TableRow: {
    style: {
      borderBottom:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      border: background?.value == "dark" && "none !important",
      transition: "background-color 0.3s ease", // Smooth transition for hover effect
    },
    "&:hover": {
      transitionDuration: "0.05s",
      backgroundColor: background?.value == "dark" ? "#303030" : "#f0f0f0", // Change background color on hover
      cursor: "pointer", // Change cursor to pointer on hover
    },
  },

  rows: {
    style: {
      minHeight: "40px",
      border:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      transition: "background-color 0.3s ease",
      "&:hover": {
        transitionDuration: "0.05s",
        background: "rgba(152, 166, 173, 0.15)", // Background color on hover
      },
    },
  },
  headCells: {
    style: {
      fontWeight: "500",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      color: background?.value == "dark" ? "#fff" : "black",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      whiteSpace: "normal",
      fontSize: "13px",
      textAlign: "center",
      borderBottom:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      flexWrap: "wrap",
      borderTop:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      borderRight:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      fontSize: "1em !important",
      paddingRight: "4px",
      paddingLeft: "4px",
      paddingTop: "4px",
      paddingBottom: "4px",
      border: background?.value == "dark" && "none !important",
    },
  },
  cells: {
    style: {
      fontSize: "1em",
      fontFamily: "Aerial, sans-serif",

      color: background?.value == "dark" ? "#fff" : "#6e6e6e",
      borderRight:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      paddingRight: "4px",
      paddingLeft: "4px",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      transition: "background-color 0.3s ease",
      "&:hover": {
        transitionDuration: "0.05s",
        background: "rgba(152, 166, 173, 0.15)", // Background color on hover
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: background?.value === "dark" ? "#202020" : "#f5f5f5",
      color: background?.value == "dark" && "#fff",
    },
  },
  paginationDropdown: {
    style: {
      backgroundColor: background?.value === "dark" ? "#444" : "#ffffff", // Dropdown background
      color: background?.value == "dark" ? "#fff" : "black", // Dropdown text color
      borderRadius: "4px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    },
  },
  paginationDropdownList: {
    style: {
      backgroundColor: background?.value === "dark" ? "#333" : "#f5f5f5", // List background
      color: background?.value == "dark" ? "#fff !important" : "black", // List text color
      padding: "6px 12px",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: background?.value === "dark" ? "#555" : "#d0d0d0", // Hover effect
      },
    },
  },
  paginationButton: {
    style: {
      color: background?.value === "dark" ? "#fff !important" : "black",
    },
  },
  navbarIcons: {
    svg: {
      fill: "white !important",
      stroke: "white !important",
    },
  },
  noData: {
    style: {
      color: background?.value === "dark" ? "white" : "black",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
    },
  },

});

export const multiSelect_custom_style = (background) => {
  console.log(background, "background-143"); // Logging the background value

  return {
    control: (provided) => ({
      width: "auto",
      minHeight: "25px",
      height: "25px",
      padding: "0px",
      border: "1px solid #ccc",
      color: background?.value == "dark" ? "white" : "lightgray",
      background: background?.value == "dark" ? "#2e2e40" : "white", // Fixed to support both dark and light backgrounds
      zIndex: 10000,
      "&:hover": {
        border: "1px solid #aaa",
      },
    }),

    valueContainer: (provided) => ({
      padding: "0px",
      paddingLeft: "4px",
      height: "25px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: background?.value === "dark" ? "white" : "lightgray",
    }),

    placeholder: (provided) => ({
      margin: "0",
      fontSize: "12px",
      textAlign: "center",
      flex: 1,
      color: background?.value == "dark" ? "white" : "lightgray",
    }),

    singleValue: (provided) => ({
      margin: "0",
      fontSize: "12px",
      color: background?.value === "dark" ? "white" : "lightgray",
    }),

    dropdownIndicator: (provided) => ({
      display: "none", // Removed !important as it could interfere with styling
    }),

    option: (provided, state) => ({
      ...provided,
      padding: "4px 1px",
      fontSize: "10px",
      overflow: "hidden",
      paddingLeft: "4px",
      color: background?.value === "dark" ? "white" : "lightgray",
      backgroundColor: state.isFocused ? "blue !important" : "transparent",
      "&:hover": {
        backgroundColor: "blue", // Set background color to blue on hover
        color: "white", // Set text color to white when hovered
      },
    }),

    menu: (provided) => ({
      ...provided,
      zIndex: 10000,
      overflowY: "scroll",
      overflowX: "hidden",
      color: background?.value == "dark" ? "white" : "lightgray",
      background: background?.value == "dark" ? "#2e2e40" : "white", // Set background color based on theme
    }),

    menuList: (provided) => ({
      ...provided,
      maxHeight: "100px",
      overflowY: "scroll",
      "&::-webkit-scrollbar": {
        display: "none", // Hide scrollbar in WebKit browsers
        width: "2px",
      },
      color: background?.value == "dark" ? "white" : "lightgray",
      background: background?.value == "dark" ? "#2e2e40 !important" : "white", // Background color based on theme
    }),
  };
};

export const select_customStyles = (background) => ({
  // menuPortal: (base) => ({ ...base, zIndex: 9999 }), // 👈 Ensure it's above all
  control: (provided) => ({
    width: "auto", // Set to 'auto' for responsive width
    height: "1.8rem", // Fixed height
    padding: "0px", // Remove default padding
    border: "1px solid #ccc7c7", // Border to define control
    color: background?.value === "dark" ? "white" : "lightgray",
    borderRadius: "0.5rem",
    "&:hover": {
      border: "1px solid #aaa",
    },
    zIndex: "9999",
  }),
  valueContainer: (provided) => ({
    padding: "0px", // Remove padding
    paddingLeft: "4px",
    height: "20px", // Match height
    display: "flex",
    alignItems: "center", // Center content vertically
    justifyContent: "center", // Center content horizontally
    textAlign: "center",
    color: background?.value === "dark" ? "white" : "lightgray",
  }),
  placeholder: (provided) => ({
    margin: "0", // Adjust placeholder margin
    fontSize: "0.76562rem", // Adjust font size as needed
    textAlign: "center", // Center text horizontally
    flex: 1, // Allow placeholder to take available space
    color: background?.value == "dark" ? "white" : "#6e6e6e",
  }),
  singleValue: (provided) => ({
    margin: "0", // Adjust single value margin
    fontSize: "0.6rem", // Adjust font size as needed
    textAlign: "center",
    color: background?.value == "dark" ? "white" : "#6e6e6e",
  }),
  dropdownIndicator: (provided) => ({
    display: "none", // Hide the dropdown indicator (icon)
  }),
  option: (provided, state) => ({
    ...provided,
    padding: "4px 1px",
    fontSize: "0.76562rem",
    overflow: "hidden",
    paddingLeft: "4px",
    color: "black",
    backgroundColor:
      state.isSelected || state.isFocused || state.isSelected
        ? "rgb(41, 146, 244)"
        : "", // Default blue if selected or focused
    color:
      state.isSelected || state.isFocused || state.isSelected ? "white" : "",
    "&:hover": {
      // backgroundColor: "rrgb(117, 188, 255)",
      // color: "black",
    },
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: "9999", // Ensure the dropdown appears above other elements
    overflowY: "hidden", // Hide vertical scrollbar
    overflowX: "hidden", // Hide horizontal scrollbar
    //color: background?.value === "dark" ? "white" : "#6e6e6e",
    //background: background?.value === "dark" ? "#2e2e40" : "white", // Set background color based on theme
    zIndex: "9999999",
    background: "white",
    color: "black",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "150px", // Set maximum height for list
    overflowY: "auto",
    background: "white",
    color: "black",
    //color: background?.value === "dark" ? "white" : "#6e6e6e",
    //background: background?.value === "dark" ? "#2e2e40" : "white", // Set background color to white in light mode
    "&::-webkit-scrollbar": {
      display: "none", // Hide scrollbar for Chrome/Safari
      width: "2px",
    },
    zIndex: "9999",
  }),
  input: (provided) => ({
    ...provided,
    color: background?.value === "dark" ? "white" : "black", // Text color while typing
  }),
});

export const customStylesTheme = (background) => ({
  control: (base, state) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    color: background?.value === "dark" ? "white" : "#000",
    border: background?.value === "dark" ? "1px solid #2e2e40" : "1px solid #ccc",
    boxShadow: "none",
    borderRadius: "0.5rem",
    width: "100%",
    height: "30px",
    minHeight: "30px",
    fontSize: "0.8rem", // ✅ same as first style
    padding: "0 4px",   // ✅ same padding
    display: "flex",
    alignItems: "center", // ✅ align center like first one
    justifyContent: "space-between",
    cursor: "pointer",
    "&:hover": {
      borderColor: background?.value === "dark" ? "#2e2e40" : "#aaa",
    },
  }),

  singleValue: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "0.8rem", // ✅ updated
  }),

  valueContainer: (base) => ({
    ...base,
    padding: "0", // ✅ keep minimal padding
    display: "flex",
    alignItems: "center",
  }),

  input: (base) => ({
    ...base,
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "0.8rem", // ✅ updated
    margin: 0,
    padding: 0,
  }),

  placeholder: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#aaa" : "#999",
    fontSize: "0.8rem", // ✅ updated
  }),

  dropdownIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: "0 4px", // ✅ same as first one
  }),

  clearIndicator: (base) => ({
    ...base,
    color: background?.value === "dark" ? "#ccc" : "#333",
    padding: "0 4px", // ✅ same
  }),

  indicatorSeparator: () => ({
    display: "none",
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: background?.value === "dark" ? "#2e2e40" : "#fff",
    zIndex: 9999,
    borderRadius: "0.5rem", // ✅ added like first one
    overflow: "hidden", // ✅ match first one
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
    color: background?.value === "dark" ? "white" : "#000",
    fontSize: "0.8rem", // ✅ updated
    padding: "6px 10px", // ✅ match first style
    cursor: "pointer",
    whiteSpace: "nowrap",
  }),

  indicatorsContainer: (base) => ({
    ...base,
    height: "30px",
  }),
});


export const transportCustomStyle = {
  control: (provided) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
    width: "100%",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#333",
    color: "#fff",
    border: "1px solid #444",
    boxShadow: "none",
  }),
  container: (provided) => ({
    ...provided,
    width: "8rem",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "30px",
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    color: "#fff",
  }),
  placeholder: (provided) => ({
    ...provided,
    margin: 0,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    fontSize: "12px",
    color: "#ccc",
    zIndex: "999",
    visibility: "visible",
  }),
  input: (provided) => ({
    ...provided,
    color: "#ccc", // 🔥 input typing text ko white kar diya
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "30px",
    display: "flex",
    alignItems: "center",
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    padding: "0",
    display: "flex",
    alignItems: "center",
    color: "#fff",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: "transparent", // Make it transparent instead of hiding
    borderRadius: "2px",
    margin: "2px",
    padding: "0 4px",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: "12px",
    lineHeight: "20px",
    color: "transparent", // Hide the text but still keep space
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    display: "none !important", // Hide the remove icon
  }),
  option: (provided, { isSelected, isFocused }) => ({
    ...provided,
    display: "flex",
    alignItems: "center",
    padding: "8px",
    backgroundColor: isSelected ? "#444" : isFocused ? "#555" : "#333",
    color: "#fff",
    ":hover": {
      backgroundColor: "#555",
    },
  }),
  menuList: (provided) => ({
    ...provided,
    "&::-webkit-scrollbar": {
      width: "0.5rem",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "#888",
      borderRadius: "10px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "#333",
    },
  }),
};

// -------------------------------------------------------------------------------------

export const testStyle = (background) => ({
  rdt_TableCell: {
    className: "center-cell",
    backgroundColor: background?.value == "dark" ? "#202020" : "white",
    border: "none !important",
  },
  rdt_Pagination: {
    color: "white !important",
  },
  rdt_TableHeadRow: {
    className: "min-height-row",
    backgroundColor: background?.value == "dark" ? "#202020" : "white",
    border: background?.value == "dark" && "none !important",
    borderBottom: background?.value == "dark" && "none !important",
  },
  rdt_TableRow: {
    borderBottom:
      background?.value == "dark" ? "none" : "1px solid rgba(0, 0, 0, 0.1)",
    backgroundColor: background?.value == "dark" ? "#202020" : "white",
    border: background?.value == "dark" && "none !important",
    transition: "background-color 0.3s ease",
    "&:hover": {
      transitionDuration: "0.05s !important",
      background: "rgba(152, 166, 173, 0.15) !important",
    },
  },

  rows: {
    style: {
      minHeight: "40px",
      border:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      transition: "background-color 0.3s ease",
      "&:hover": {
        transitionDuration: "0.05s",
        background: "rgba(152, 166, 173, 0.15)", // Background color on hover
      },
    },
  },
  headCells: {
    style: {
      fontWeight: "400",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      color: background?.value == "dark" ? "#fff" : "black",
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      overflow: "hidden",
      whiteSpace: "normal",
      fontSize: "13px",
      textAlign: "center",
      borderBottom:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      flexWrap: "wrap",
      borderTop:
        background?.value == "dark"
          ? "none !important"
          : "1px solid rgba(0, 0, 0, 0.1)",
      borderRight:
        background?.value == "dark" ? "none " : "1px solid rgba(0, 0, 0, 0.1)",
      fontSize: "0.8em",
      paddingRight: "4px",
      paddingLeft: "4px",
      paddingTop: "4px",
      paddingBottom: "4px",
      border: background?.value == "dark" && "none !important",
    },
  },
  cells: {
    style: {
      fontSize: "10px",
      color: background?.value == "dark" ? "#fff" : "#6e6e6e",
      borderRight:
        background?.value == "dark" ? "none" : "1px solid rgba(0, 0, 0, 0.1)",
      paddingRight: "4px",
      paddingLeft: "4px",
      backgroundColor: background?.value == "dark" ? "#202020" : "white",
      transition: "background-color 0.3s ease",
      "&:hover": {
        transitionDuration: "0.05s",
        background: "rgba(152, 166, 173, 0.15)", // Background color on hover
      },
    },
  },
  pagination: {
    style: {
      backgroundColor: background?.value === "dark" ? "#202020" : "#f5f5f5",
      color: background?.value == "dark" && "#fff",
    },
  },
  paginationDropdown: {
    style: {
      backgroundColor: background?.value === "dark" ? "#444" : "#ffffff",
      color: background?.value == "dark" ? "#fff" : "black",
      borderRadius: "4px",
      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    },
  },
  paginationDropdownList: {
    style: {
      backgroundColor: background?.value === "dark" ? "#333" : "#f5f5f5",
      color: background?.value == "dark" ? "#fff !important" : "black",
      padding: "6px 12px",
      fontSize: "14px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: background?.value === "dark" ? "#555" : "#d0d0d0",
      },
    },
  },
  paginationButton: {
    style: {
      color: background?.value === "dark" ? "#fff !important" : "black",
    },
  },
  navbarIcons: {
    svg: {
      fill: "white !important",
      stroke: "white !important",
    },
  },
});

// export const table_custom_style = {
//   rdt_TableCell: {
//     className: "center-cell",
//   },
//   rdt_TableHeadRow: {
//     className: "min-height-row",
//   },
//   rdt_TableRow: {
//     borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Add border between rows
//   },

//   rows: {
//     style: {
//       minHeight: "40px", // Adjust row height
//       //margin: "0px 0px", // Remove vertical margins
//       //borderRadius: "0px", // No rounded corners
//       //overflow: "hidden",
//       //padding: "0px 4px",
//       border: "1px solid rgba(0, 0, 0, 0.1)", // Add border for the entire row
//       //display: "flex",
//       //flexWrap: "wrap",
//       //justifyContent: "start",
//       // alignItems: "center",
//     },
//   },
//   headCells: {
//     style: {
//       // height: "45px",
//       fontWeight: "400",
//       backgroundColor: "white",
//       color: "black",
//       display: "-webkit-box",
//       "-webkit-line-clamp": 3,
//       "-webkit-box-orient": "vertical",
//       overflow: "hidden",
//       whiteSpace: "normal",
//       fontSize: "13px",
//       textAlign: "center",
//       borderBottom: "1px solid rgba(0, 0, 0, 0.1)", // Add border below header row
//       //padding: "0px 10px",
//       //margin: "0",
//       flexWrap: "wrap",
//       //wordWrap: "break-word",
//       borderTop: "1px solid rgba(0, 0, 0, 0.1)", // Add border on top
//       //alignItems: "center",
//       //justifyContent: "start",
//       borderRight: "1px solid rgba(0, 0, 0, 0.1)",
//       //flexBasis: "1",
//       //minWidth: "100px !important",
//       fontSize:'0.8em'
//     },
//     activeSortStyle: {
//       //visibility: "visible", // Make active sort icon always visible
//     },
//     inactiveSortStyle: {
//       //visibility: "visible", // Make inactive sort icon always visible
//       //opacity: 0.6, // Adjust transparency for inactive icons if desired
//     },
//   },
//   cells: {
//     style: {
//       fontSize: "10px",
//       //wordWrap: "break-word",
//       //padding: "4px 7px", // Add horizontal spacing inside the cells
//       //backgroundColor: "inherit",
//       color: "#6e6e6e",
//       borderRight: "1px solid rgba(0, 0, 0, 0.1)", // Add border between columns
//       //whiteSpace: "nowrap", // Prevent wrapping inside cells
//       //overflow: "visible", // Ensure content is not clipped
//       //textOverflow: "clip", // Do not truncate text with ellipsis
//       //width: "auto", // Allow dynamic resizing of cell width based on content
//       // minWidth: "150px !important",
//     },
//   },

//   columns: {
//     //textAlign: "center",
//     border: "1px solid rgba(0, 0, 0, 0.1)", // Column border
//     even: {
//       style: {
//     //    backgroundColor: "#f8f8f8", // Background color for even rows
//     //    color: "black", // Optional: text color for even rows
//       },
//     },
//     odd: {
//       style: {
//       //  backgroundColor: "#ffffff", // Background color for odd rows
//       //  color: "black", // Optional: text color for odd rows
//       },
//     },
//   },
//   table: {
//     style: {
//       //border: "1px solid rgba(0, 0, 0, 0.1)", // Border around the table
//       //borderCollapse: "collapse", // Ensure borders don't double
//       //backgroundColor: "#f7f7f7", // Light gray background for table
//       //tableLayout: "auto", // Allow table layout to adapt based on content
//     },
//   },
// };
