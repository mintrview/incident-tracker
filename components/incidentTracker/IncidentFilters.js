import styled from "styled-components";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "../common/Button";
import Datetime from "react-datetime";
import { FormContainer } from "../common/Form";

const FiltersContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  position: relative;
`;

const FiltersSearchBox = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  box-sizing: border-box;
  border-radius: 2px;
  border: 1px solid #e1e1e1;
  font-size: 12px;
  font-family: inherit;
  margin-right: 10px;
  box-sizing: border-box;

  > input {
    flex: 1;
    background-repeat: no-repeat;
    background-attachment: scroll;
    background-size: 16px 18px;
    background-position: 98% 50%;
    padding: 10px;
    border: 0;
    display: block;
  }

  > div {
    /*! background: #0198ff; */
    padding: 10px;
    display: block;
  }
`;

const FiltersButton = styled.button`
  padding: 10px;
  background: #0198ff;
  color: white;
  width: 100%;
  padding: 12px;
  background: #0198ff;
  border: 0;
  border-radius: 2px;
  color: white;
  font-weight: bold;
  text-transform: uppercase;
  -webkit-transition: all 0.2s ease;
  transition: all 0.2s ease;
  cursor: pointer;
`;

const FiltersDropDown = styled.div`
  width: 300px;
  background: white;
  position: absolute;
  right: 0;
  box-shadow: 0px 0px 5px 1px #d7d7d7;
`;

// Filters for the incident table.
export default function IncidentFilters({ filters, onFiltersChanged }) {
  const dropdownElem = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Handler to open the filters dropdown.
  const openDropdown = (e) => {
    e.preventDefault();
    setShowDropdown(!showDropdown);
  };

  // Handler to apply dropdown filters.
  const onAdditionalFiltersApplied = (e) => {
    e.preventDefault();
    onFiltersChanged(["startDate", "endDate"], [startDate, endDate]);
    setShowDropdown(false);
  };

  // Handler to clear dropdown filters.
  const resetAdditionalFilters = () => {
    setStartDate(null);
    setEndDate(null);
    onFiltersChanged(["startDate", "endDate"], [null, null]);
  };

  // Mount handler to clear dropdown on clicks outside the element.
  useEffect(() => {
    const closeDropdown = () => setShowDropdown(false);
    window.addEventListener("click", closeDropdown);
    return () => window.removeEventListener("click", closeDropdown);
  }, [showDropdown]);

  let numFilters = 0;
  if (filters.startDate) {
    numFilters++;
  }
  if (filters.endDate) {
    numFilters++;
  }
  const filtersLabel = numFilters > 0 ? `Filters (${numFilters})` : "Filters";

  return (
    <FiltersContainer onClick={(e) => e.stopPropagation()}>
      <FiltersSearchBox>
        <input
          placeholder="Search incidents..."
          value={filters.textSearch}
          onChange={(e) => onFiltersChanged(["textSearch"], [e.target.value])}
        />
      </FiltersSearchBox>
      <div>
        <FiltersButton onClick={openDropdown}>{filtersLabel}</FiltersButton>
        {showDropdown ? (
          <FiltersDropDown ref={dropdownElem}>
            <FormContainer width="100%" padding="10px" onSubmit={onAdditionalFiltersApplied}>
              <label htmlFor="filter_start_date">Start Date</label>
              <Datetime
                inputProps={{
                  id: "filter_start_date",
                  readOnly: true,
                  value: startDate ? startDate.format("MM/DD/YYYY hh:mm A") : "",
                }}
                isValidDate={(selectedDate) => (endDate ? selectedDate.isSameOrBefore(endDate) : true)}
                value={startDate}
                onChange={setStartDate}
              />
              <label htmlFor="filter_end_date">End Date</label>
              <Datetime
                inputProps={{
                  id: "filter_end_date",
                  readOnly: true,
                  value: endDate ? endDate.format("MM/DD/YYYY hh:mm A") : "",
                }}
                isValidDate={(selectedDate) => (startDate ? selectedDate.isSameOrAfter(startDate) : true)}
                value={endDate}
                onChange={setEndDate}
              />
              <PrimaryButton type="submit" onClick={onAdditionalFiltersApplied}>
                Apply Filters
              </PrimaryButton>
              <a onClick={resetAdditionalFilters}>Reset Filters</a>
            </FormContainer>
          </FiltersDropDown>
        ) : null}
      </div>
    </FiltersContainer>
  );
}
