import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import DateTimePickerModal from "./DateTimePickerModal";
import { setSelectedQuadrant, setFormData } from "../redux/waterShiftSlice";
import { toast } from "react-toastify";

interface RiegoData {
  id: number;
  waterShiftId: number;
  quadrant: number;
  startDate: string;
  finishDate: string;
}

const GRID_ORDER = [
  [12, 22, 32, 42, 52],
  [11, 21, 31, 41, 51],
];

const Grid: React.FC = () => {
  const dispatch = useDispatch();
  const waterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
  const selectedQuadrant = useSelector((state: RootState) => state.waterShift.selectedQuadrant);
  const [datos, setDatos] = useState<RiegoData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

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

  const handleBlockClick = (quadrant: number) => {
    dispatch(setSelectedQuadrant(quadrant));
    const log = datos.find((item) => item.quadrant === quadrant);
    if (log) {
      dispatch(setFormData({ startDate: log.startDate, finishDate: log.finishDate , editMode: true }))
    } else {
      const now = new Date();
      dispatch(setFormData({ startDate: now.toISOString(), finishDate: "" ,editMode: false }));
    }
    setModalOpen(true);
  };

  const handleSubmit = async (values: { startDate: string; finishDate: string }) => {
    if (!selectedQuadrant || !waterShiftId) return;
    try {
      const log = datos.find((item) => item.quadrant === selectedQuadrant);
      let response;
      if (log) {
        response = await fetch(`http://localhost:3000/api/irrigation-logs/${log.id}`, {
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
        response = await fetch("http://localhost:3000/api/irrigation-logs/", {
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
          const existingIndex = prev.findIndex((log) => log.quadrant === newLog.quadrant);
          if (existingIndex >= 0) {
            const updated = [...prev];
            updated[existingIndex] = newLog;
            return updated;
          }
          return [...prev, newLog];
        });
        setModalOpen(false);
        if (log) {
          toast.success("Registro de Riego actualizado con éxito");
        }
        else {
          toast.success("Registro de Riego creado con éxito");
        }
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

  const now = new Date();

  return (
    <>
      <div className="grid grid-rows-2 grid-cols-5 gap-1 w-[60vw]">
        {GRID_ORDER.flat().map((quadrant, index) => {
          const log = datos.find((item) => item.quadrant === quadrant);

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
              className={`aspect-square border border-black flex flex-col items-start justify-center p-2 cursor-pointer ${
                isActive ? "bg-cyan-500" : "bg-green-700"
              } ${index === 4 ? "clip-chaflan-top" : index === 9 ? "clip-chaflan-bottom" : ""}`}
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

      {modalOpen && (
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