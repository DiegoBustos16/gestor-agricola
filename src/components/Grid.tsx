import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DateTimePickerModal from "./DateTimePickerModal";
import { setSelectedQuadrant, setFormData, setShouldRefetchWaterShifts } from "../redux/waterShiftSlice";
import { toast } from "react-toastify";

interface RiegoData {
  id: number;
  waterShiftId: number;
  quadrant: number;
  startDate: string;
  finishDate: string;
}

interface HistoryData {
  quadrant: number;
  total: number;
}

const HORIZONTAL_GRID_ORDER = [
  [12, 22, 32, 42, 52],
  [11, 21, 31, 41, 51],
];

const VERTICAL_GRID_ORDER = [
  [11, 12],
  [21, 22],
  [31, 32],
  [41, 42],
  [51, 52],
];

const Grid: React.FC = () => {
  const dispatch = useDispatch();
  const waterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
  const selectedQuadrant = useSelector((state: RootState) => state.waterShift.selectedQuadrant);
  const viewMode = useSelector((state: RootState) => state.waterShift.viewMode);
  const shouldRefetch = useSelector((state: RootState) => state.waterShift.shouldRefetchWaterShifts);
  const [datos, setDatos] = useState<RiegoData[] | HistoryData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const fromDate = useSelector((state: RootState) => state.waterShift.fromDate);
  const toDate = useSelector((state: RootState) => state.waterShift.toDate);

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const GRID_ORDER = isMobile ? VERTICAL_GRID_ORDER : HORIZONTAL_GRID_ORDER;

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (viewMode === "current" && waterShiftId) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/irrigation-logs/water-shift/${waterShiftId}`);
          const data: RiegoData[] = await response.json();
          setDatos(data);
        } else if (viewMode === "history") {
          if (!fromDate || !toDate) {
            const now = new Date();
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(now.getFullYear() - 1);
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/irrigation-logs/history?fromDate=${oneYearAgo.toISOString()}&toDate=${now.toISOString()}`
            );
            const data: HistoryData[] = await response.json();
            setDatos(data);
          } else {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/api/irrigation-logs/history?fromDate=${fromDate}&toDate=${toDate}`
            );
            const data: HistoryData[] = await response.json();
            setDatos(data);
          }
        }
        if (shouldRefetch) {
          dispatch(setShouldRefetchWaterShifts(false));
        }
      } catch (error) {
        console.error("Error fetching irrigation logs:", error);
      }
    };

    fetchData();
  }, [waterShiftId, viewMode, fromDate, toDate, shouldRefetch, dispatch]);

  const handleBlockClick = (quadrant: number) => {
    if (viewMode === "current") {
      dispatch(setSelectedQuadrant(quadrant));
      const log = (datos as RiegoData[]).find((item) => item.quadrant === quadrant);
      if (log) {
        dispatch(setFormData({
          startDate: log.startDate,
          finishDate: log.finishDate,
          editMode: true,
          id: log.id,
        }));
      } else {
        const now = new Date();
        dispatch(setFormData({
          startDate: now.toISOString(),
          finishDate: "",
          editMode: false,
        }));
      }
      setModalOpen(true);
    }
  };

  const getColorForTotal = (total: number, min: number, max: number): string => {
    if (max === min) return "rgb(0, 255, 0)";
    const ratio = (total - min) / (max - min);
    const red = Math.round(255 * (1 - ratio));
    const green = Math.round(255 * ratio);
    return `rgb(${red},${green},0)`;
  };

  const now = new Date();
  let minTotal = 0;
  let maxTotal = 0;
  if (viewMode === "history" && datos.length > 0) {
    const totals = (datos as HistoryData[]).map((d) => d.total);
    minTotal = Math.min(...totals);
    maxTotal = Math.max(...totals);
  }

  const handleSubmit = async (values: { startDate: string; finishDate: string }) => {
    if (!selectedQuadrant || !waterShiftId) return;
    try {
      const log = (datos as RiegoData[]).find((item) => item.quadrant === selectedQuadrant);
      let response;
      if (log) {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/irrigation-logs/${log.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: log.id,
            quadrant: selectedQuadrant,
            startDate: values.startDate,
            finishDate: values.finishDate,
            waterShiftId: waterShiftId,
          }),
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/irrigation-logs/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quadrant: selectedQuadrant,
            startDate: values.startDate,
            finishDate: values.finishDate,
            waterShiftId: waterShiftId,
          }),
        });
      }

      if (response.ok) {
        const newLog = await response.json();
        setDatos((prev) => {
          const existingIndex = (prev as RiegoData[]).findIndex((log) => log.quadrant === newLog.quadrant);
          if (existingIndex >= 0) {
            const updated = [...(prev as RiegoData[])];
            updated[existingIndex] = newLog;
            return updated;
          }
          return [...(prev as RiegoData[]), newLog];
        });
        setModalOpen(false);
        toast.success(log ? "Registro de Riego actualizado con éxito" : "Registro de Riego creado con éxito");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error al crear el Irrigation Log";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error creating irrigation log:", error);
      toast.error("Error en la conexión con el servidor");
    }
  };

  return (
    <>
      <div
        className={`grid gap-1 w-[90vw] md:w-[60vw] ${
          isMobile ? "grid-rows-5 grid-cols-2" : "grid-rows-2 grid-cols-5"
        }`}
      >
        {GRID_ORDER.flat().map((quadrant, index) => {
          let extraClasses = "";

          if (viewMode === "current") {
            const log = (datos as RiegoData[]).find((item) => item.quadrant === quadrant);

            let inicio = "-";
            let horas = "-";
            let isActive = false;

            if (log) {
              const comienzo = new Date(log.startDate);
              const fin = new Date(log.finishDate);
              horas = ((fin.getTime() - comienzo.getTime()) / (1000 * 60 * 60)).toFixed(2);
              inicio = `${comienzo.getDate()}-${comienzo.getMonth() + 1} ${comienzo.getHours()}:${comienzo.getMinutes().toString().padStart(2, "0")}`;
              if (now >= comienzo && now <= fin) {
                isActive = true;
              }
            }

            return (
              <div
                key={index}
                onClick={() => handleBlockClick(quadrant)}
                className={`w-full sm:w-auto aspect-square border border-black flex flex-col items-start justify-center p-2 cursor-pointer rounded-md ${
                  isActive ? "bg-cyan-500" : "bg-green-700"
                } ${extraClasses}`}
              >
                <p className="text-sm font-bold">Cuartel: {quadrant}</p>
                <p className="text-sm font-bold">Inicio:</p>
                <p className="text-xs">{inicio}</p>
                <p className="text-sm font-bold mt-1">Horas:</p>
                <p className="text-xs">{horas}h</p>
              </div>
            );
          } else if (viewMode === "history") {
            const record = (datos as HistoryData[]).find((item) => item.quadrant === quadrant);
            const totalHours = record ? record.total : 0;
            const backgroundColor = record ? getColorForTotal(totalHours, minTotal, maxTotal) : "gray";

            return (
              <div
                key={index}
                className={`aspect-square border border-black flex flex-col items-start justify-center p-2 rounded-md ${extraClasses}`}
                style={{ backgroundColor }}
              >
                <p className="text-sm font-bold">Cuartel: {quadrant}</p>
                <p className="text-sm font-bold">Total Horas:</p>
                <p className="text-xs">{totalHours}h</p>
              </div>
            );
          } else {
            return null;
          }
        })}
      </div>

      {modalOpen && viewMode === "current" && (
        <DateTimePickerModal
          type="irrigationLog"
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default Grid;
