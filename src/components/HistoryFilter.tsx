import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import {
  setFilterDates
} from "../redux/waterShiftSlice";
import { toast } from "react-toastify";

const HistoryFilter: React.FC = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.waterShift.viewMode);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);

  const handleFilter = () => {
    if (!fromDate || !toDate) {
      toast.error("Por favor seleccione ambas fechas");
      return;
    }
        dispatch(setFilterDates({ fromDate: fromDate, toDate: toDate }));
  };

  return (
    viewMode === "history" && (
      <div className="flex gap-2 justify-between">
      <div className="flex flex-col md:flex-row gap-2">
        <input
          className="border rounded bg-black p-2"
          type="date"
          value={fromDate || oneYearAgo.toISOString().split("T")[0]}
          onChange={(e) => setFromDate(e.target.value)} />
        <input
          className="border rounded bg-black p-2"
          type="date"
          value={toDate || now.toISOString().split("T")[0]}
          onChange={(e) => setToDate(e.target.value)} />
      </div>
      <div className="flex align-self-center">
          <button onClick={handleFilter} className="!border-white !bg-blue-900 text-white px-4 py-1 rounded">
            Filtrar
          </button>
        </div>
      </div>
    )
  );
};

export default HistoryFilter;