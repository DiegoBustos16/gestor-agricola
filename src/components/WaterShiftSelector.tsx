import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWaterShift, setShouldRefetchWaterShifts, setWaterShifts} from "../redux/waterShiftSlice";
import { RootState } from "../redux/store";

const WaterShiftSelector: React.FC = () => {
  const dispatch = useDispatch();
  const [waterShiftsList, setWaterShiftsList] = useState<any[]>([]);
  const selectedWaterShift = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
  const shouldRefetchWaterShifts = useSelector((state: RootState) => state.waterShift.shouldRefetchWaterShifts);

  useEffect(() => {
    const fetchWaterShifts = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/water-shifts/`);
        const data = await response.json();
        setWaterShiftsList(data);
        dispatch(setWaterShifts(data));

        if (data.length > 0) {
          const latestShift = data.reduce((prev: any, current: any) => {
            return new Date(prev.startDate) > new Date(current.startDate) ? prev : current;
          });
          dispatch(setWaterShift(latestShift.id));
        }
      } catch (error) {
        console.error("Error fetching water shifts:", error);
      } finally {
        if (shouldRefetchWaterShifts) {
          dispatch(setShouldRefetchWaterShifts(false));
        }
      }
    };

    fetchWaterShifts();
  }, [dispatch, shouldRefetchWaterShifts]);
  return (
    <div>
      <select
        className="border rounded bg-black min-w-30 aspect-6/2"
        value={selectedWaterShift || ""}
        onChange={(e) => dispatch(setWaterShift(Number(e.target.value)))}
      >
        {waterShiftsList.map((shift) => (
          <option key={shift.id} value={shift.id}>
            {new Date(shift.startDate).toLocaleDateString("es-ES", {
              month: "2-digit",
              day: "2-digit",
            })}
            -
            {new Date(shift.finishDate).toLocaleDateString("es-ES", {
              month: "2-digit",
              day: "2-digit",
            })}
          </option>
        ))}
      </select>
    </div>
  );
};

export default WaterShiftSelector;