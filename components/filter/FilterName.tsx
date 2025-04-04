import { useSearchParams } from "next/navigation";
import { ChangeEvent, useState, useEffect } from "react";

type SearchInputProps = {
  placeholder?: string;
  className?: string;
  label?: string;
  name?: string;
  filterSearch?: boolean;
  setSearchValue?: (value: string) => void;
};

const FilterName: React.FC<SearchInputProps> = ({
  filterSearch = false,
  placeholder = "",
  className = "",
  label,
  name,
  setSearchValue,
}) => {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Sync search state when URL parameters change
  useEffect(() => {
    setSearch(searchParams.get("search") || "");
  }, [searchParams]);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearch(value);
    if (setSearchValue) {
      setSearchValue(value);
    }
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label">
          {label}
        </label>
      )}
      {filterSearch && (
        <input
          type="search"
          placeholder={placeholder}
          value={search}
          onChange={handleInputChange}
          className="border form-control !bg-white rounded-lg pl-8 lg:pl-6 py-2 w-full focus:outline-none"
          maxLength={50}
        />
      )}
    </div>
  );
};

export default FilterName;
