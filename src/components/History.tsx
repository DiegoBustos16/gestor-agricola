import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setViewMode } from "../redux/waterShiftSlice";
import { RootState } from "../redux/store";

const History: React.FC = () => {
  const dispatch = useDispatch();
  const viewMode = useSelector((state: RootState) => state.waterShift.viewMode);

  const handleClick = () => {
    if (viewMode === "current") {
      dispatch(setViewMode("history"));
    } else {
      dispatch(setViewMode("current"));
    }
  };

  return (
    <button
      onClick={handleClick}
      className="aspect-square max-h-10.5 !p-0 !bg-black !border-white"
    >
      <img
        src="https://cdn-icons-png.flaticon.com/512/9169/9169204.png"
        alt="Icono"
        className="h-fit invert"
      />
    </button>
  );
};

export default History;
