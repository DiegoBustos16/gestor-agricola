import "react-toastify/dist/ReactToastify.css";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const formatDate = (date: string) => {
  if (!date) return "";
  return format(parseISO(date), "d 'de' MMMM", { locale: es });
};

const FormattedDate: React.FC = () => {
    const selectedWaterShiftId = useSelector((state: RootState) => state.waterShift.selectedWaterShiftId);
    const waterShifts = useSelector((state: RootState) => state.waterShift.waterShifts);

    const selectedShift = waterShifts.find((shift) => shift.id === selectedWaterShiftId);

    const startDate = selectedShift ? selectedShift.startDate : "";
    const finishDate = selectedShift ? selectedShift.finishDate : "";

    const formattedStartDate = formatDate(startDate);
    const formattedFinishDate = formatDate(finishDate);
    
    return (
          <div className="flex-1 text-center justify-self-center">
            <h2 className="!text-4xl inline-block">
              {formattedStartDate && formattedFinishDate ? `${formattedStartDate} - ${formattedFinishDate}` : ""}
            </h2>
          </div>
      );
    }

export default FormattedDate;
