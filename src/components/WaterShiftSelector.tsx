import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setWaterShift } from "../redux/waterShiftSlice";

const WaterShiftSelector: React.FC = () => {
  const dispatch = useDispatch();
  const [waterShifts, setWaterShifts] = useState<any[]>([]);

  useEffect(() => {
    const fetchWaterShifts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/water-shifts/");
        const data = await response.json();
        setWaterShifts(data);
      } catch (error) {
        console.error("Error fetching water shifts:", error);
      }
    };

    fetchWaterShifts();
  }, []);

  return (
    <div>
      <select onChange={(e) => dispatch(setWaterShift(Number(e.target.value)))}>
        <option value="">Selecciona un turno de riego</option>
        {waterShifts.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {shift.startDate}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WaterShiftSelector;
