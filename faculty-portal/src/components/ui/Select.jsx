import React, { forwardRef } from "react";
const Select = forwardRef(
  (
    {
      label,
      options = [],
      placeholder = "Select an option",
      error,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {" "}
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {" "}
            {label}{" "}
          </label>
        )}{" "}
        <select
          ref={ref}
          id={selectId}
          className={`input-field ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""} ${className}`}
          {...props}
        >
          {" "}
          <option value="">{placeholder}</option>{" "}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {" "}
              {option.label}{" "}
            </option>
          ))}{" "}
        </select>{" "}
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}{" "}
      </div>
    );
  },
);
Select.displayName = "Select";
export default Select;
