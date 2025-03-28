import React, { useState } from "react";
import DateTimePickerModal from "./DateTimePickerModal.tsx";
import { toast } from "react-toastify";

const AddWaterShiftButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleSubmit = async (values: { startDate: string; finishDate: string }) => {
    try {
      const response = await fetch("http://localhost:3000/api/water-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: values.startDate,
          finishDate: values.finishDate,
        }),
      });

      if (response.ok) {
        setModalOpen(false);
        toast.success("Turno creado con éxito");
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Error al crear el turno";
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      toast.error("Error en la conexión con el servidor");
    }
  };

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded"
      >
        Añadir Turno
      </button>
      {modalOpen && (
        <DateTimePickerModal
          type="waterShift"
          onCancel={() => setModalOpen(false)}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default AddWaterShiftButton;