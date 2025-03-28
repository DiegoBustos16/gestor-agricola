import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWaterShift } from "../redux/waterShiftSlice";
import { RootState } from "../redux/store";

const WaterShiftSelector: React.FC = () => {
  const dispatch = useDispatch();
  const [waterShifts, setWaterShifts] = useState<any[]>([]);
  const selectedWaterShift = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);

  useEffect(() => {
    const fetchWaterShifts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/water-shifts/");
        const data = await response.json();
        setWaterShifts(data);

        if (data.length > 0) {
          const latestShift = data.reduce((prev: any, current: any) => {
            return new Date(prev.startDate) > new Date(current.startDate) ? prev : current;
          });
          dispatch(setWaterShift(latestShift.id));
        }
      } catch (error) {
        console.error("Error fetching water shifts:", error);
      }
    };

    fetchWaterShifts();
  }, [dispatch]);

  return (
    <div>
      <select className="borderrounded bg-black"
        value={selectedWaterShift || ""}
        onChange={(e) => dispatch(setWaterShift(Number(e.target.value)))}
      >
        {waterShifts.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {new Date(shift.startDate).toLocaleDateString('es-ES', {
              month: '2-digit',
              day: '2-digit',
            })}-{new Date(shift.finishDate).toLocaleDateString('es-ES', {
              month: '2-digit',
              day: '2-digit',
            })}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WaterShiftSelector;