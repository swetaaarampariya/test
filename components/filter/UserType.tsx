import React from "react";
interface Option {
  value: string;
  label: string;
}

interface UserTypesProps {
  label: string;
  name: string;
  options: Option[];
  selectedValue: string;
  setSelectedValue: (value: string) => void;
  placeholder?: string;
}

const UserType: React.FC<UserTypesProps> = ({
  label,
  name,
  options,
  selectedValue,
  setSelectedValue,
  placeholder = "Select an option",
}) => {
  return (
    <div className="relative">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        name={name}
        id={name}
        value={selectedValue}
        className="w-full form-control py-2 !bg-white"
        onChange={(e) => setSelectedValue(e.target.value)}
      >
        <option hidden>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {selectedValue && (
        <span
          className="absolute bottom-[6px] right-6 text-black cursor-pointer dark:text-gray-200 text-base"
          onClick={() => setSelectedValue("")}
        ></span>
      )}
    </div>
  );
};

export default UserType;
