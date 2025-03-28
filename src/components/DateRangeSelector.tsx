import React from "react";
import { useDispatch } from "react-redux";
import { setDateRange } from "../redux/waterShiftSlice";

const DateRangeSelector: React.FC = () => {
  const dispatch = useDispatch();

  return (
    <div>
      <button onClick={() => dispatch(setDateRange("last-month"))}>
        Último Mes
      </button>
      <button onClick={() => dispatch(setDateRange("last-year"))}>
        Último Año
      </button>
    </div>
  );
};

export default DateRangeSelector;
