import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  startDate: Date | null;
  endDate: Date | null;
  handleDateChange: (dates: [Date | null, Date | null]) => void;
  className?: string;
  label?: string;
  name?: string;
};

const DateFilter: React.FC<Props> = ({
  startDate,
  endDate,
  handleDateChange,
  className,
  label,
  name,
}) => {
  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      <DatePicker
        className="border form-control !bg-white rounded-lg pl-8 lg:pl-6 py-2 w-full focus:outline-none"
        wrapperClassName="w-full"
        selectsRange
        startDate={startDate}
        endDate={endDate}
        maxDate={new Date()}
        onChange={handleDateChange}
        placeholderText="DD/MM/YYYY"
        dateFormat="dd/MM/yyyy"
        isClearable
      />
    </div>
  );
};

export default DateFilter;
