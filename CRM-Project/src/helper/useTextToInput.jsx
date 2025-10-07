import React from "react";
import { useState, useEffect } from "react";

const useTextToInput = (inputValue, styleClass) => {
  const [formValue, setFormValue] = useState(inputValue);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const handleTextToInputChange = (e) => {
    setFormValue(e.target.value);
  };

  const handleClick = () => {
    inputRef.current.focus();
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        inputRef.current.blur();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const InputForm = () => {
    return (
      <input
        type="text"
        className={`form-control form-control-sm ${styleClass}`}
        readOnly={!isReadOnly}
        onChange={handleTextToInputChange}
        value={formValue}
        onClick={handleClick}
      />
    );
  };

  return { InputForm, formValue, setFormValue, isReadOnly, setIsReadOnly };
};

export default useTextToInput;
