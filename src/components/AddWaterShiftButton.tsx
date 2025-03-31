import React, { useState } from "react";
import DateTimePickerModal from "./DateTimePickerModal.tsx";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { setShouldRefetchWaterShifts , setFormData} from "../redux/waterShiftSlice";
import { RootState } from "../redux/store";

const AddWaterShiftButton: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [editShift, setEditShift] = useState(false);
  const dispatch = useDispatch();
  const selectedWaterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
  const waterShifts = useSelector((state: RootState) => state.waterShift.waterShifts);

  const handleTime = (isEdit: boolean) => {
    if(isEdit){
      if (!selectedWaterShiftId) {
        toast.error("No hay turno seleccionado");
        return;
      }

      const selectedShift = waterShifts.find((shift) => shift.id === selectedWaterShiftId);
      if (!selectedShift) {
        toast.error("Turno no encontrado");
        return;
      }
      dispatch(
        setFormData({
          startDate: selectedShift.startDate,
          finishDate: selectedShift.finishDate,
          editMode: true,
      }));
    } else {
      const now = new Date();
      dispatch(
        setFormData({
          startDate: now.toISOString(),
          finishDate: "",
          editMode: false,
        })
      );
    }    
  }


  const handleSubmit = async (values: { startDate: string; finishDate: string }) => {
    try {
      let response;
      if(editShift){
        const waterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
        response = await fetch(`http://localhost:3000/api/water-shifts/${waterShiftId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: waterShiftId,
            startDate: values.startDate,
            finishDate: values.finishDate,
          }),
        });
      }else{
      response = await fetch("http://localhost:3000/api/water-shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          startDate: values.startDate,
          finishDate: values.finishDate,
        }),
      });
    }

      if (response.ok) {
        setModalOpen(false);
        if(editShift){
          toast.success("Turno editado con éxito");
        }else{
          toast.success("Turno creado con éxito");
        }
        dispatch(setShouldRefetchWaterShifts(true));
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
        onClick={() => {
          setEditShift(false);
          handleTime(false);
          setModalOpen(true);
        }}
      className="aspect-square max-h-10.5 !p-0 !bg-transparent"> 
        <img src="https://cdn-icons-png.flaticon.com/512/4288/4288231.png" alt="Icono" className="h-fit invert" />
      </button>
      
      <button
        onClick={() => {
          setEditShift(true);
          handleTime(true);
          setModalOpen(true);
        }}
        className="aspect-square max-h-11.5 !p-0 !bg-transparent"
      >
        <img src="https://cdn-icons-png.flaticon.com/512/7018/7018917.png" alt="Icono" className="h-fit invert " />
      </button>
      {modalOpen && (
        <DateTimePickerModal
          type="waterShift"
          onCancel={() => {
            setModalOpen(false); 
          }}
          onSubmit={handleSubmit}
        />
      )}
    </>
  );
};

export default AddWaterShiftButton;