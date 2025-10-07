import React, { useContext, useState } from "react";
import Select from "react-select";
import { ThemeContext } from "../../context/ThemeContext";

const customStyle = (background) => ({
  control: (provided) => ({
    ...provided,
    backgroundColor: background?.value == "dark" ? "#2E2E40" : "#fff",
    borderColor: background?.value == "dark" ? "#3D3D3D" : "#ccc7c7",
    boxShadow: "none",
    minHeight: "1.8rem",
    height: "auto",
    fontWeight: "400",
    color: "#6E6E6E",
    lineHeight: "1.5",
    borderRadius: "0.5rem",
    "&:hover": {
      borderColor: "red",
    },
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: "0 5px",
    display: "flex",
    // height: "1.4rem",
    flexWrap: "wrap",
    alignItems: "center",
    gap: "4px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
    color: background?.value == "dark" ? "white" : "#3D3D3D",
    fontSize: "12px",
    fontWeight: "400",
  }),
  multiValue: (provided) => ({
    ...provided,
    backgroundColor: " #e23428",
    display: "flex",
    alignItems: "center",
    // height: "1.4rem",
    padding: "0 4px",
    borderRadius: "0",
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: "white",
    fontSize: "0.7rem",
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: "white",
    display: "flex",
    alignItems: "center",
    "&:hover": {
      backgroundColor: "#e23428",
      color: "white",
    },
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "1.8rem",
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
      backgroundColor: "#166fd4",
      color: "white",
    },
  }),
  menu: (provided) => ({
    ...provided,
    overflow: "hidden",
    color: background?.value == "dark" ? "white" : "lightgray",
    background: background?.value == "dark" ? "#2e2e40 !important" : "white",
    zIndex: 1000,
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: "200px",
    overflowY: "auto",
    color: background?.value == "dark" ? "white" : "lightgray",
    zIndex: 1000,
  }),
});

const useMultipleSelect = (listOption, initialData) => {
  // console.log("Helloooo", initialData);

  const { background } = useContext(ThemeContext);

  const [selectedData, setSelectedData] = useState(initialData || []);
  const [valueWithLabel, setValueWithLabel] = useState([]);

  const handleMultiSelectChange = (selected) => {
    const selectedValue = selected
      ? selected.map((option) => option.value)
      : [];
    setSelectedData(selectedValue);
    setValueWithLabel(selected);
  };

  const SelectInput = () => {
    return (
      <Select
        value={selectedData.map((val) =>
          listOption.find((option) => option.value == val)
        )}
        onChange={handleMultiSelectChange}
        options={listOption}
        isMulti={true}
        styles={customStyle(background)}
      />
    );
  };

  return {
    SelectInput,
    selectedData,
    setSelectedData,
    valueWithLabel,
    setValueWithLabel,
  };
};

export default useMultipleSelect;
