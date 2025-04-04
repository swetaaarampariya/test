import { AxiosGet } from "@/common/api/axiosService";
import { API_URLS } from "@/common/api/constants";
import { CountryList } from "@/common/constants/interface";
import React, { useEffect, useState } from "react";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}
interface CountryProps {
  label: string;
  name: string;
  selectedValue: string; // Get the selected country value from the parent
  setSelectedValue: (value: string) => void; // Function to update the parent
  placeholder?: string;
}

const CountryName: React.FC<CountryProps> = ({
  label,
  name,
  selectedValue,
  setSelectedValue,
  placeholder = "Select an option",
}) => {
  const [countryList, setCountryList] = useState<Option[]>([]);

  useEffect(() => {
    const getCountryList = async () => {
      try {
        const response = await AxiosGet(`${API_URLS.ADDRESS.COUNTRY}`);

        if (
          response &&
          typeof response !== "string" &&
          response.statusCode === 200
        ) {
          const countryData = response.data.map((country: CountryList) => ({
            value: country.isoCode,
            label: country.name,
          }));

          setCountryList(countryData);
        }
      } catch (error) {
        console.error("Error fetching country list:", error);
      }
    };

    getCountryList();
  }, []);

  return (
    <div className="relative">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <div className="w-full border border-zinc-300 rounded bg-white p-2">
        <Select
          name="country"
          options={countryList}
          value={countryList.find((c) => c.value === selectedValue) || null} // Match selected country
          onChange={(selectedOption) => {
            setSelectedValue(selectedOption?.value || ""); // Update the parent
          }}
          placeholder={placeholder}
          classNamePrefix="react-select"
          styles={{
            control: (baseStyles) => ({
              ...baseStyles,
              border: "none",
              boxShadow: "none",
              backgroundColor: "transparent",
            }),
          }}
        />
      </div>
    </div>
  );
};

export default CountryName;
