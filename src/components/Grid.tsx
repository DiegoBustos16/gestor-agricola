import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

interface RiegoData {
  quadrant: number;
  startDate: string;
  finishDate: string;
}

const GRID_ORDER = [
  [12, 22, 32, 42, 52],
  [11, 21, 31, 41, 51],
];

const Grid: React.FC = () => {
  const waterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
  const [datos, setDatos] = useState<RiegoData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (waterShiftId) {
          const response = await fetch(`http://localhost:3000/api/irrigation-logs/water-shift/${waterShiftId}`);
          const data: RiegoData[] = await response.json();
          setDatos(data);
        }
      } catch (error) {
        console.error("Error fetching irrigation logs:", error);
      }
    };

    fetchData();
  }, [waterShiftId]);

  return (
    <div className="grid grid-rows-2 grid-cols-5 gap-1 w-[60vw]">
      {GRID_ORDER.flat().map((quadrant, index) => {
        const log = datos.find((item) => item.quadrant === quadrant);

        let inicio = "-";
        let horas = "-";

        if (log) {
          const comienzo = new Date(log.startDate);
          const fin = new Date(log.finishDate);
          horas = ((fin.getTime() - comienzo.getTime()) / (1000 * 60 * 60)).toFixed(2);
          inicio = `${comienzo.getDate()}-${comienzo.getMonth() + 1} ${comienzo.getHours()}:${comienzo.getMinutes().toString().padStart(2, '0')}`;
        }

        return (
          <div
            key={index}
            className={`aspect-square bg-green-700 border border-black flex flex-col items-start justify-center p-2 ${
              index === 4 ? "clip-chaflan-top" : index === 9 ? "clip-chaflan-bottom" : ""
            }`}
          >
            <p className="text-sm font-bold">Cuartel: {quadrant}</p>
            <p className="text-sm font-bold">Inicio:</p>
            <p className="text-xs">{inicio}</p>
            <p className="text-sm font-bold mt-1">Horas:</p>
            <p className="text-xs">{horas}h</p>
          </div>
        );
      })}
    </div>
  );
};

export default Grid;
